import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
                'http://localhost:5000/api/hotel/auth',
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
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '20px',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: '#2d2d2d',
                    padding: '40px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
            >
                <div style={{ marginBottom: '24px' }}>
                    <Link to="/" style={{ fontSize: '14px' }}>
                        ← Go home
                    </Link>
                </div>
                <h2 style={{ marginBottom: '24px', fontSize: '32px', color: '#4a9eff' }}>Hotel Login</h2>
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    <button type="submit" style={{ marginTop: '8px' }}>
                        Login
                    </button>
                    {error && (
                        <p
                            style={{
                                color: '#f44336',
                                padding: '12px',
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                borderRadius: '6px',
                                border: '1px solid rgba(244, 67, 54, 0.3)',
                            }}
                        >
                            {error}
                        </p>
                    )}
                    {success && (
                        <p
                            style={{
                                color: '#4caf50',
                                padding: '12px',
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                borderRadius: '6px',
                                border: '1px solid rgba(76, 175, 80, 0.3)',
                            }}
                        >
                            Logged in successfully!
                        </p>
                    )}
                </form>
                <div style={{ marginTop: '24px', textAlign: 'center', color: '#b0b0b0' }}>
                    <p style={{ fontSize: '14px' }}>
                        Don&apos;t have an account? <Link to="/new-hotel">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginHotel;
