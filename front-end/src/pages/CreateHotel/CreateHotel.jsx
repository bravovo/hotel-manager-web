import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CreateHotel = () => {
    const [nameValue, setNameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [roomsCountValue, setRoomsCountValue] = useState(0);
    const [phoneNumberValue, setPhoneNumberValue] = useState('');
    const [addressValue, setAddressValue] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const createHotelSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/hotels', {
                name: nameValue,
                email: emailValue,
                roomsCount: roomsCountValue,
                phoneNumber: phoneNumberValue,
                address: addressValue,
            });

            if (response.status === 201) {
                setSuccess(true);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRoomsCountChange = (event) => {
        const roomsCount = parseFloat(event.target.value);
        setRoomsCountValue(isNaN(roomsCount) ? 0 : roomsCount);
    };

    return (
        <div>
            <Link to="/">Go home</Link>
            <form
                onSubmit={createHotelSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}
            >
                <input
                    type="text"
                    placeholder="Enter hotel name"
                    value={nameValue}
                    onChange={(event) => setNameValue(event.target.value)}
                />
                <input
                    type="email"
                    placeholder="Enter hotel email"
                    value={emailValue}
                    onChange={(event) => setEmailValue(event.target.value)}
                />
                <input
                    type="number"
                    placeholder="Enter hotel rooms count (max 25)"
                    value={roomsCountValue}
                    onChange={handleRoomsCountChange}
                />
                <input
                    type="text"
                    placeholder="Enter hotel phone number"
                    value={phoneNumberValue}
                    onChange={(event) => setPhoneNumberValue(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter hotel address"
                    value={addressValue}
                    onChange={(event) => setAddressValue(event.target.value)}
                />
                <button type="submit">Create hotel</button>
                <h3 style={{ color: 'red' }}>{error}</h3>
                {success && <h3 style={{ color: 'green' }}>Hotel Created</h3>}
            </form>
        </div>
    );
};

export default CreateHotel;
