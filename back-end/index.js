const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { db } = require('./firebase.js');
const hotelRoute = require('./routes/hotelRoute.js');
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

app.use(hotelRoute);

app.get('/', (request, response) => {
    console.log('Api is OK');
    return response.send('Api is OK');
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
