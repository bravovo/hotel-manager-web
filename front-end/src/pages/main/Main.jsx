import { Link } from 'react-router-dom';

const Main = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: '30px',
                padding: '20px',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '48px', marginBottom: '16px', color: '#4a9eff' }}>Hotel Manager</h1>
                <p style={{ fontSize: '20px', color: '#b0b0b0' }}>Manage your hotel rooms with ease</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '300px' }}>
                <Link to="/new-hotel">
                    <button style={{ width: '100%' }}>Create Hotel</button>
                </Link>
                <Link to="/login-hotel">
                    <button style={{ width: '100%' }}>Login to Hotel</button>
                </Link>
            </div>
        </div>
    );
};

export default Main;
