import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const RoomCard = ({ roomId, deleteRoom }) => {
    const [room, setRoom] = useState({ name: '', number: null, price: null });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/room', {
                    params: { roomId: roomId },
                    withCredentials: true,
                });

                if (response.data.room) {
                    setRoom(response.data.room);
                } else {
                    setRoom({ name: '', number: null, price: null });
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status == 404) {
                        setError(error.response.data.message);
                    } else {
                        setError('Something went wrong');
                    }
                } else {
                    setError(error.message);
                }
            }
        };

        fetchRoom();
    }, [roomId]);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete the room "${room.name}"?`)) {
            deleteRoom(roomId);
        }
    };

    return (
        <div>
            {room ? (
                <div>
                    <div>
                        <p>{room.name}</p>
                        <p>{room.number}</p>
                        <p>{room.price}</p>
                    </div>
                    <hr />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <button>Modify</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            ) : (
                <p>No room found {error}</p>
            )}
        </div>
    );
};

RoomCard.propTypes = {
    roomId: PropTypes.string.isRequired,
    deleteRoom: PropTypes.func.isRequired,
};

export default RoomCard;
