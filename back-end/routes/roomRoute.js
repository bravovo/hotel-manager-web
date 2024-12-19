const { Router } = require('express');
const { getHotel } = require('../middlewares/middleware.js');
require('dotenv').config();

const router = Router();

router.get('/room', getHotel, async (request, response) => {
    const { hotelRef } = request;
    const { roomId } = request.query;

    try {
        const roomRef = hotelRef.collection('rooms').doc(roomId);

        const room = await roomRef.get();
        
        if (!room.exists) {
            return response.status(404).send({ success: false, message: 'Room is not found' });
        }

        return response.status(200).send({success: true, message: 'Room is found', room:room.data() })
    } catch (error) {
        console.error(error);
        return response.sendStatus(500);
    }
    
});

module.exports = router;