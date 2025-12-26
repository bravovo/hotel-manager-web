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

    const cardStyle = {
        backgroundColor: '#3a3a3a',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #404040',
        transition: 'all 0.2s ease',
    };

    const modifyButtonStyle = {
        flex: 1,
        backgroundColor: '#3a3a3a',
        border: '1px solid #4a9eff',
    };

    const deleteButtonStyle = {
        flex: 1,
        backgroundColor: '#f44336',
    };

    return (
        <div style={cardStyle} className="room-card">
            {room && !error ? (
                <>
                    <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#4a9eff' }}>{room.name}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#b0b0b0' }}>
                            <p>
                                <strong>Room Number:</strong> {room.number}
                            </p>
                            <p>
                                <strong>Type:</strong> {room.type}
                            </p>
                            <p>
                                <strong>Capacity:</strong> {room.capacity} guests
                            </p>
                            {room.description && (
                                <p>
                                    <strong>Description:</strong> {room.description}
                                </p>
                            )}
                            <p style={{ fontSize: '18px', color: '#4a9eff', marginTop: '8px' }}>
                                <strong>${room.price}</strong> per night
                            </p>
                        </div>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #404040', margin: '16px 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                        <button style={modifyButtonStyle} className="modify-button">
                            Modify
                        </button>
                        <button onClick={handleDelete} style={deleteButtonStyle} className="delete-button">
                            Delete
                        </button>
                    </div>
                    <style>{`
                        .room-card:hover {
                            border-color: #4a9eff;
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(74, 158, 255, 0.2);
                        }
                        .delete-button:hover {
                            background-color: #d32f2f !important;
                        }
                    `}</style>
                </>
            ) : (
                <p style={{ color: '#f44336' }}>No room found. {error}</p>
            )}
        </div>
    );
};

RoomCard.propTypes = {
    roomId: PropTypes.string.isRequired,
    deleteRoom: PropTypes.func.isRequired,
};

export default RoomCard;
