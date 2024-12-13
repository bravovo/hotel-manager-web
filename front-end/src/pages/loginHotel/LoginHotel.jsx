import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginHotel = () => {
    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:5000/hotel/auth',
                {
                    login: loginValue,
                    password: passwordValue,
                },
                {
                    withCredentials: true,
                },
            );

            if (response.status === 200) {
                setError('');
                setSuccess(true);
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleLoginSubmit}>
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
                <button type="submit">Login</button>
                <h3 style={{ color: 'red' }}>{error}</h3>
                {success && <h3 style={{ color: 'green' }}>Logged in</h3>}
            </form>
        </div>
    );
};

export default LoginHotel;
