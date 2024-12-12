const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { db } = require('./firebase.js');
require('dotenv').config();

const PORT = process.env.SERVER_PORT || 5000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:5173', withCredentials: true }));
app.use(cookieParser(COOKIE_SECRET));
// app.set('trust proxy', 1);
app.use(
    session({
        secret: COOKIE_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60 * 2,
        },
    }),
);

app.get('/', (request, response) => {
    console.log('Api is OK');
    return response.send('Api is OK');
});

app.get('/hotels', async (request, response) => {
    const hotelsRef = db.collection('hotels');
    const hotelsDocs = await hotelsRef.get();

    const hotels = hotelsDocs.docs.map((hotel) => {
        return {
            id: hotel.id,
            ...hotel.data(),
        };
    });

    return response.send(hotels);
});

app.post('/hotels', async (request, response) => {
    const { name, email, phoneNumber, roomsCount, address, login, password } = request.body;
    try {
        const hotelsRef = db.collection('hotels');

        const salt = await bcrypt.genSalt(12);
        hashedPassword = await bcrypt.hash(password, salt);

        const hotelDoc = {
            name: name,
            email: email,
            roomsCount: roomsCount,
            phoneNumber: phoneNumber,
            address: address,
            login: login,
            password: hashedPassword,
        };

        const hotelDocRef = await hotelsRef.add(hotelDoc);

        const token = jwt.sign({ id: hotelDocRef.id.toString() }, JWT_SECRET);

        request.session.hotel = token;

        response.status(201).send({ msg: 'Success' });
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }
});

app.get('/hotel', async (request, response) => {
    if (!request.session.hotel) {
        return response.status(401).send({ message: 'Unauthorized' });
    }

    const token = request.session.hotel;

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return response.status(401).send({ message: 'Invalid or expired token' });
    }

    const hotelId = decoded.id;

    try {
        const hotelRef = db.collection('hotels').doc(hotelId);
        const hotelSnap = await hotelRef.get();

        if (!hotelSnap.exists) {
            console.log('No such document!');
            return response.status(404).send({ message: 'Hotel not found' });
        }

        return response.status(200).send({ id: hotelSnap.id, ...hotelSnap.data() });
    } catch (error) {
        console.error('Error fetching hotel:', error);
        return response.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/hotel/auth', async (request, response) => {
    const { login, password } = request.body;

    try {
        const query = await db.collection('hotels').where('login', '==', login).get();

        if (query.empty) {
            return response.status(404).send({ message: 'Hotel not found' });
        }

      const hotelRef = query.docs[0];
      const hotelData = hotelRef.data();

        bcrypt.compare(password, hotelData.password, function (error, result) {
            if (error) {
                console.log('Server error');
                return res.status(500).send('Server error');
            }
            if (result) {
                console.log('Successfully logged in');
                const token = jwt.sign({ id: hotelRef.id.toString() }, JWT_SECRET);

                request.session.hotel = token;
                return response.status(200).send(hotelData);
            } else {
                console.log('Invalid credentials');
                return res.status(400).json({ success: false, message: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
