const { db } = require('../firebase.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

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

        request.session.hotel = token;

        next();
    } catch (error) {
        console.error('Error in getHotel middleware:', error);
        return response.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = { getHotel };