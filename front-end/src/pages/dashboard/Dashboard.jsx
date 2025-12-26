import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../../components/roomCard/RoomCard';

const Dashboard = () => {
    const [error, setError] = useState('');

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
    const [roomSuccess, setRoomSuccess] = useState(false);

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/hotel', { withCredentials: true });

                if (response.data.message && response.data.message === 'No rooms found') {
                    setRooms([]);
                }

                if (response.data.hotel) {
                    setHotel(response.data.hotel);
                }

                if (response.data.rooms) {
                    setRooms(response.data.rooms);
                }
            } catch (error) {
                if (error.response.status === 404) {
                    setHotelError('No hotel found');
                } else if (error.response.status === 500 && error.response.data.message) {
                    setHotelError(error.response.data.message);
                } else {
                    setHotelError(error.message);
                }
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
                'http://localhost:5000/api/hotel/rooms/add',
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
                setRoomSuccess(true);
                rooms.push(response.data);
                setRooms(rooms);

                setRoomNumber(0);
                setRoomType('');
                setRoomCapacity(0);
                setRoomName('');
                setRoomDescription('');
                setRoomPrice(0);
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

    const deleteRoom = async (roomId) => {
        try {
            const response = await axios.delete('http://localhost:5000/api/rooms/delete', {
                params: { roomId: roomId },
                withCredentials: true,
            });

            if (response.status === 204) {
                window.alert('Room is deleted');

                setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
            } else {
                setError('Something went wrong');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError(error.message);
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px' }}>
            <div
                style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '32px',
                        padding: '24px',
                        backgroundColor: '#2d2d2d',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <div>
                        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#4a9eff' }}>{hotel.name}</h1>
                        <p style={{ color: '#b0b0b0', fontSize: '16px' }}>{hotel.email}</p>
                        {hotelError && <p style={{ color: '#f44336', marginTop: '8px' }}>{hotelError}</p>}
                    </div>
                    <Link to="/">
                        <button>← Home</button>
                    </Link>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '24px',
                        alignItems: 'start',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#2d2d2d',
                            padding: '24px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#e0e0e0' }}>Room Management</h2>
                        <button onClick={() => setAddRoom(!addRoom)} style={{ width: '100%' }}>
                            {addRoom ? 'Cancel' : 'Add a Room'}
                        </button>
                        {addRoom && (
                            <form
                                onSubmit={handleRoomCreateSubmit}
                                style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}
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
                                <button type="submit">Create a Room</button>
                                {roomsError.length > 0 && (
                                    <div
                                        style={{
                                            color: '#f44336',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                            padding: '12px',
                                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(244, 67, 54, 0.3)',
                                        }}
                                    >
                                        {roomsError.map((err, index) => (
                                            <p key={index}>{err.msg || err}</p>
                                        ))}
                                    </div>
                                )}
                                {roomSuccess && (
                                    <p
                                        style={{
                                            color: '#4caf50',
                                            padding: '12px',
                                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(76, 175, 80, 0.3)',
                                        }}
                                    >
                                        Room created successfully!
                                    </p>
                                )}
                            </form>
                        )}
                        {error && <p style={{ color: '#f44336', marginTop: '16px' }}>{error}</p>}
                    </div>

                    <div
                        style={{
                            backgroundColor: '#2d2d2d',
                            padding: '24px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#e0e0e0' }}>
                            Rooms ({rooms.length})
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {rooms.length > 0 ? (
                                rooms.map((room) => <RoomCard key={room.id} roomId={room.id} deleteRoom={deleteRoom} />)
                            ) : (
                                <p style={{ color: '#b0b0b0', textAlign: 'center', padding: '40px 0' }}>
                                    No rooms yet. Add your first room to get started!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
