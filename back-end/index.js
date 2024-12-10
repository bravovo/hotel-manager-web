const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { db } = require('./firebase.js');

const PORT = process.env.SERVER_PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

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

app.post('/hotels/add', async (request, response) => {
    try {
        const hotelsRef = db.collection('hotels');
        const hotelDoc = {
            hotel_name: 'Hotelis',
            email: 'hotelis@gmail.com',
            rooms_count: 20,
            phone_number: '8234729476',
        };

        const hotelDocRef = await hotelsRef.add(hotelDoc);

        response.status(201).send({ id: hotelDocRef.id});
    } catch (error) {
        response.sendStatus(500);
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
