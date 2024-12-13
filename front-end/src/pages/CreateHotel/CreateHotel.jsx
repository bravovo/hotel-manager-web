import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MAX_ROOMS_COUNT = 25;

const CreateHotel = () => {
    const [nameValue, setNameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [roomsCountValue, setRoomsCountValue] = useState(0);
    const [phoneNumberValue, setPhoneNumberValue] = useState('');
    const [addressValue, setAddressValue] = useState('');
    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const createHotelSubmit = async (event) => {
        event.preventDefault();
        if (roomsCountValue > MAX_ROOMS_COUNT) {
            const error = {
                msg: `Max rooms count is ${MAX_ROOMS_COUNT}`,
            };
            setError([error]);
            return;
        }
        if (passwordValue !== confirmPasswordValue) {
            const error = {
                msg: `Passwords are not equal`,
            };
            setError([error]);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/hotels',
                {
                    name: nameValue,
                    email: emailValue,
                    roomsCount: roomsCountValue,
                    phoneNumber: phoneNumberValue,
                    address: addressValue,
                    login: loginValue,
                    password: passwordValue,
                },
                { withCredentials: true },
            );

            if (response.status === 201) {
                setError([]);
                setSuccess(true);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError(error.response.data.errors);
                } else {
                    setError([error.response.statusText || 'Something went wrong']);
                }
            } else {
                setError([error.message]);
            }
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
                    placeholder={`Enter hotel rooms count (max ${MAX_ROOMS_COUNT})`}
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
                <input
                    type="text"
                    placeholder="Enter hotel login value"
                    value={loginValue}
                    onChange={(event) => setLoginValue(event.target.value)}
                />
                <input
                    type="password"
                    placeholder="Enter password"
                    value={passwordValue}
                    onChange={(event) => setPasswordValue(event.target.value)}
                />
                <input
                    type="password"
                    placeholder="Enter confirm password"
                    value={confirmPasswordValue}
                    onChange={(event) => setConfirmPasswordValue(event.target.value)}
                />
                <button type="submit">Create hotel</button>
                <div style={{ color: 'red', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {error.length > 0 && error.map((err, index) => <p key={index}>{err.msg}</p>)}
                </div>
                {success && <p style={{ color: 'green' }}>Hotel Created</p>}
            </form>
        </div>
    );
};

export default CreateHotel;
