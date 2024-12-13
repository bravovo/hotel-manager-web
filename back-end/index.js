const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { db } = require('./firebase.js');
const { query, validationResult, body, matchedData, checkSchema } = require('express-validator');
const { registerHotelValidation, createRoomValidation } = require('./utils/validationSchemas.js');
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

const getHotel = async (request, response, next) => {
    try {
        if (!request.session.hotel) {
            return response.status(401).send({ message: 'Unauthorized: Missing session token' });
        }

        const token = request.session.hotel;

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            console.error('JWT verification error:', error.message);
            return response.status(401).send({ message: 'Invalid or expired token' });
        }

        const hotelId = decoded.id;

        const hotelRef = db.collection('hotels').doc(hotelId);
        const hotelSnap = await hotelRef.get();

        if (!hotelSnap.exists) {
            console.error(`Hotel not found for ID: ${hotelId}`);
            return response.status(404).send({ message: 'Hotel not found' });
        }

        request.hotelSnap = { id: hotelSnap.id, ...hotelSnap.data() };
        request.hotelRef = hotelRef;

        next();
    } catch (error) {
        console.error('Error in getHotel middleware:', error);
        return response.status(500).send({ message: 'Internal Server Error' });
    }
};


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

app.post('/hotels', checkSchema(registerHotelValidation), async (request, response) => {
    const validResult = validationResult(request);

    if (validResult.isEmpty()) {
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
    } else {
        console.log(validResult.array());
        return response.status(400).send({ errors: validResult.array() });
    }
});

app.get('/hotel', getHotel, async (request, response) => {
    const { hotelSnap } = request;

    return response.status(200).send({ id: hotelSnap.id, ...hotelSnap });
});

app.post('/hotel/auth', async (request, response) => {
    const { login, password } = request.body;

    try {
        const query = await db.collection('hotels').where('login', '==', login).get();

        if (query.empty) {
            return response.status(404).send({ message: 'Invalid credentials' });
        }

        const hotelRef = query.docs[0];
        const hotelData = hotelRef.data();

        bcrypt.compare(password, hotelData.password, function (error, result) {
            if (error) {
                return response.status(500).send('Server error');
            }
            if (result) {
                const token = jwt.sign({ id: hotelRef.id.toString() }, JWT_SECRET);

                request.session.hotel = token;
                return response.status(200).send(hotelData);
            } else {
                return response.status(400).send({ message: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Internal server error' });
    }
});

app.post('/hotel/rooms/add', checkSchema(createRoomValidation), getHotel, async (request, response) => {
    const { number, type, capacity, name, description, price } = request.body;

    const { hotelRef } = request;

    try {
        const roomsSubcollection = hotelRef.collection('rooms');

        const room = {
            number,
            type,
            capacity,
            name,
            description,
            price
        }

        const roomRef = await roomsSubcollection.add(room);
        
        return response.status(201).send({ id: roomRef.id, ...room });
    } catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
