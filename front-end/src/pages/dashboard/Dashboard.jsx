import axios from 'axios';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [hotel, setHotel] = useState({ name: '', email: '' });
    const [hotelError, setHotelError] = useState('');

    const [addRoom, setAddRoom] = useState(false);

    const [roomNumber, setRoomNumber] = useState(0);
    const [roomType, setRoomType] = useState('');
    const [roomCapacity, setRoomCapacity] = useState(0);
    const [roomName, setRoomName] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [roomPrice, setRoomPrice] = useState(0);

    const [rooms, setRooms] = useState([]);
    const [roomsError, setRoomsError] = useState([]);
    const [roomsSuccess, setRoomsSuccess] = useState(false);

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/hotel', { withCredentials: true });

                if (response.data) {
                    setHotel(response.data);
                }
            } catch (error) {
                setHotelError(error.response.status === 404 ? 'No hotel found' : error.message);
            }
        };

        fetchHotelData();
    }, []);

    const handleRoomNumberChange = (event) => {
        const parsedRoomNumber = parseFloat(event.target.value);
        setRoomNumber(isNaN(parsedRoomNumber) ? 0 : parsedRoomNumber);
    };

    const handleRoomCapacityChange = (event) => {
        const parsedRoomCapacity = parseFloat(event.target.value);
        setRoomCapacity(isNaN(parsedRoomCapacity) ? 0 : parsedRoomCapacity);
    };

    const handleRoomPriceChange = (event) => {
        const parsedRoomPrice = parseFloat(event.target.value);
        setRoomPrice(isNaN(parsedRoomPrice) ? 0 : parsedRoomPrice);
    };

    const handleRoomCreateSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:5000/hotel/rooms/add',
                {
                    number: roomNumber,
                    type: roomType,
                    capacity: roomCapacity,
                    name: roomName,
                    description: roomDescription,
                    price: roomPrice,
                },
                { withCredentials: true },
            );

            if (response.status === 201) {
                setRoomsError([]);
                setRoomsSuccess(true);
                console.log(response.data);
                rooms.push(response.data);
                setRooms(rooms);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setRoomsError(error.response.data.errors);
                } else {
                    setRoomsError([error.response.data.message || 'Something went wrong']);
                }
            } else {
                setRoomsError([error.message]);
            }
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '100px',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div>
                <div>
                    <p>{hotel.name}</p>
                    <p>{hotel.email}</p>
                    <p>{hotelError.message}</p>
                </div>
                <div>
                    <button onClick={() => setAddRoom(!addRoom)}>Add a room</button>
                    {addRoom && (
                        <form
                            onSubmit={handleRoomCreateSubmit}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}
                        >
                            <input
                                type="number"
                                placeholder="Enter room number"
                                onChange={handleRoomNumberChange}
                                value={roomNumber}
                            />
                            <input
                                type="text"
                                placeholder="Enter room type"
                                onChange={(e) => setRoomType(e.target.value)}
                                value={roomType}
                            />
                            <input
                                type="number"
                                placeholder="Enter room capacity"
                                onChange={handleRoomCapacityChange}
                                value={roomCapacity}
                            />
                            <input
                                type="text"
                                placeholder="Enter room name"
                                onChange={(e) => setRoomName(e.target.value)}
                                value={roomName}
                            />
                            <input
                                type="text"
                                placeholder="Enter room description (optional)"
                                onChange={(e) => setRoomDescription(e.target.value)}
                                value={roomDescription}
                            />
                            <input
                                type="number"
                                placeholder="Enter room price ($)"
                                onChange={handleRoomPriceChange}
                                value={roomPrice}
                            />
                            <button type="submit">Create a room</button>
                            {roomsError.length > 0 && (
                                <div style={{ color: 'red', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {roomsError.map((err, index) => (
                                        <p key={index}>{err.msg}</p>
                                    ))}
                                </div>
                            )}
                            {roomsSuccess && <p style={{ color: 'green' }}>Room is created</p>}
                        </form>
                    )}
                </div>
            </div>
            <div>
                {rooms.length > 0 ? (
                    rooms.map((room) => {
                        return (
                            <div key={room.id}>
                                <p>{room.name}</p>
                                <p>{room.number}</p>
                                <p>{room.price}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No rooms yet</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
