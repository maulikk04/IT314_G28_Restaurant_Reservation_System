import './reservation.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from './useWebSocket'; // Import the custom hook

const Reservation = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isConnected } = useWebSocket(id);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/reservation/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }

            const data = await response.json();

            // Transform the data to match your component's structure
            const transformedBookings = data.data.map(reservation => ({
                code: reservation.entryCode,
                date: new Date(reservation.date).toISOString().split('T')[0],
                time: reservation.time,
                duration: 1,
                status: reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1),
                customerName: reservation.userId.name,
                people: reservation.tables.twoPerson * 2 + reservation.tables.fourPerson * 4 + reservation.tables.sixPerson * 6,
                tableFor2: reservation.tables.twoPerson,
                tableFor4: reservation.tables.fourPerson,
                tableFor6: reservation.tables.sixPerson,
                showDetails: false
            }));

            setBookings(sortBookings(transformedBookings));
            setError(null);
        } catch (err) {
            setError('Failed to load reservations. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [id]);

    // Sort bookings based on nearest upcoming slot
    const sortBookings = (list) => {
        return [...list].sort((a, b) => {
            const aDate = new Date(`${a.date} ${a.time}`);
            const bDate = new Date(`${b.date} ${b.time}`);
            return aDate - bDate;
        });
    };

    const handleTerminate = async (code) => {
        try {
            // Add API call to update status on the backend
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/reservation/${id}/terminate/${code}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update reservation status');
            }

            setBookings((prev) => {
                const updatedBookings = prev.map((booking) => {
                    if (booking.code === code) {
                        return {
                            ...booking,
                            status: booking.status === 'Confirmed' ? 'Serviced' : booking.status,
                            terminated: true,
                        };
                    }
                    return booking;
                });

                const [terminatedSlot] = updatedBookings.filter((booking) => booking.code === code);
                const remainingSlots = updatedBookings.filter((booking) => booking.code !== code);
                return [...remainingSlots, terminatedSlot];
            });
        } catch (err) {
            setError('Failed to update reservation status. Please try again.');
            console.error('Error:', err);
        }
    };

    const toggleExtraDetails = (code) => {
        setBookings((prev) => {
            return prev.map((booking) => {
                if (booking.code === code) {
                    return {
                        ...booking,
                        showDetails: !booking.showDetails,
                    };
                }
                return booking;
            });
        });
    };

    if (loading) {
        return (
            <div className="reservation-system">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <div className="reservation-system">
            <div className="hero fade-in">
                <h1>Owner Onlooker</h1>
                {!isConnected && (
                    <div className="connection-status">
                        Connecting to real-time updates...
                    </div>
                )}
                {error && <div className="error-message">{error}</div>}
            </div>
            
            <div className="reservations fade-in">
                <div className="reservation-box">
                    <h2>Bookings</h2>
                    {bookings.length === 0 ? (
                        <div className="no-bookings">No reservations found</div>
                    ) : (
                        <ul>
                            {bookings.map((booking) => (
                                <li key={booking.code} className={booking.status.toLowerCase()}>
                                    <div className="reservation-header">
                                        <span>Code: {booking.code}</span>
                                        <span>Date: {booking.date}</span>
                                        <span>Time: {`${booking.time} (Duration: ${booking.duration} hr)`}</span>
                                        <span className={`status ${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                        {!booking.terminated && (
                                            <button
                                                className="terminate-btn"
                                                onClick={() => handleTerminate(booking.code)}
                                            >
                                                Mark as Serviced
                                            </button>
                                        )}
                                        <button
                                            className="details-toggle-btn"
                                            onClick={() => toggleExtraDetails(booking.code)}
                                        >
                                            {booking.showDetails ? '▲' : '▼'}
                                        </button>
                                    </div>

                                    {booking.showDetails && (
                                        <div className="extra-details">
                                            <p>Customer Name: {booking.customerName}</p>
                                            <p>Reservation for: {booking.people} people</p>
                                            <p>Table for 2: {booking.tableFor2}</p>
                                            <p>Table for 4: {booking.tableFor4}</p>
                                            <p>Table for 6: {booking.tableFor6}</p>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reservation;