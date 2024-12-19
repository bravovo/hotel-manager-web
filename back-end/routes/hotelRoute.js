const { Router } = require('express');
const { checkSchema, validationResult } = require('express-validator');
const { registerHotelValidation, createRoomValidation } = require('../utils/validationSchemas.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../firebase.js');
const { getHotel } = require('../middlewares/middleware.js');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = Router();

router.post('/hotels', checkSchema(registerHotelValidation), async (request, response) => {
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

router.get('/hotel', getHotel, async (request, response) => {
    const { hotelRef, hotelSnap } = request;

    try {
        const roomsSubcollectionRef = await hotelRef.collection('rooms').get();

        if (roomsSubcollectionRef.isEmpty) {
            return response
                .status(200)
                .send({ success: true, message: 'No rooms found', hotel: { id: hotelSnap.id, ...hotelSnap } });
        }

        const rooms = roomsSubcollectionRef.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });

        return response.status(200).send({
            success: true,
            message: 'Hotel and rooms Found',
            rooms: rooms,
            hotel: { id: hotelSnap.id, ...hotelSnap },
        });
    } catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Internal server error' });
    }
});

router.post('/hotel/rooms/add', checkSchema(createRoomValidation), getHotel, async (request, response) => {
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
            price,
        };

        const roomRef = await roomsSubcollection.add(room);

        return response.status(201).send({ id: roomRef.id, ...room });
    } catch (error) {
        console.error(error);
        return response.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
