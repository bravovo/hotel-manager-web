import express from 'express';
import 'dotenv/config';
import cors from 'cors';
const PORT = process.env.SERVER_PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
    console.log('Api is OK');
    return response.send('Api is OK');
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
