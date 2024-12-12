import axios from 'axios';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [hotel, setHotel] = useState({ name: '', email: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/hotel', { withCredentials: true });

                if (response.status === 404) {
                    setError('No hotel found');
                }

                if (response.data) {
                    setHotel(response.data);
                }
            } catch (error) {
                setError(error);
            }
        };

        fetchHotelData();
    }, []);

    return (
        <div>
            <p>{hotel.name}</p>
            <p>{hotel.email}</p>
            <h3>{error.message}</h3>
        </div>
    );
};

export default Dashboard;
