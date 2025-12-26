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
        <div
            className="room-card"
            style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
            }}
        >
            {room && !error ? (
                <>
                    <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-accent)' }}>
                            {room.name}
                        </h3>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
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
                            <p style={{ fontSize: '18px', color: 'var(--color-accent)', marginTop: '8px' }}>
                                <strong>${room.price}</strong> per night
                            </p>
                        </div>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                        <button
                            style={{
                                flex: 1,
                                backgroundColor: 'var(--color-bg-tertiary)',
                                border: '1px solid var(--color-accent)',
                            }}
                        >
                            Modify
                        </button>
                        <button
                            onClick={handleDelete}
                            className="delete-button"
                            style={{ flex: 1, backgroundColor: 'var(--color-error)' }}
                        >
                            Delete
                        </button>
                    </div>
                </>
            ) : (
                <p style={{ color: 'var(--color-error)' }}>No room found. {error}</p>
            )}
        </div>
    );
};

RoomCard.propTypes = {
    roomId: PropTypes.string.isRequired,
    deleteRoom: PropTypes.func.isRequired,
};

export default RoomCard;
