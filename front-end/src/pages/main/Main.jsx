import { Link } from 'react-router-dom';

const Main = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/new-hotel">Create hotel</Link>
            <Link to="/login-hotel">Login hotel</Link>
        </div>
    );
};

export default Main;
