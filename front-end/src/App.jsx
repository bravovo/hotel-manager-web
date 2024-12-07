import { useState } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState('');

    const handleClick = async () => {
        try {
            const response = await axios.get('http://localhost:3000/');

            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h1>{data}</h1>
            <button onClick={handleClick}>Request</button>
        </>
    );
}

export default App;
