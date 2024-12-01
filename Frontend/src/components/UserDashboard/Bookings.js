import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Bookings.module.css';
import { FaEdit, FaTimes } from 'react-icons/fa';
import useWebSocket from '../RestaurantOwner/useWebSocket';

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const { isConnected } = useWebSocket();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservation/user-reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const transformedBookings = data.reservations.map(booking => ({
          ...booking,
          numberOfGuests: 
            (booking.tables.twoPerson * 2) + 
            (booking.tables.fourPerson * 4) + 
            (booking.tables.sixPerson * 6)
        }));
        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleEdit = (booking) => {
    const formattedDate = new Date(booking.date).toISOString().split('T')[0];
    
    navigate(`/user-dashboard/book-table/${booking.restaurantId._id}`, {
      state: { 
        isEditing: true,
        reservationId: booking._id,
        reservationData: {
          _id: booking._id,
          date: formattedDate,
          time: booking.time,
          tables: {
            twoPerson: booking.tables.twoPerson,
            fourPerson: booking.tables.fourPerson,
            sixPerson: booking.tables.sixPerson
          },
          restaurantId: booking.restaurantId._id
        }
      }
    });
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const bookingToCancel = bookings.find(booking => booking._id === bookingId);
        if (!bookingToCancel) {
          throw new Error('Booking not found');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/reservation/deleteReservation/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setBookings(bookings.filter(booking => booking._id !== bookingId));
          alert('Booking cancelled successfully');
          
          const ws = new WebSocket(process.env.REACT_APP_WS_URL);
          ws.onopen = () => {
            ws.send(JSON.stringify({
              type: 'reservationCancelled',
              restaurantId: bookingToCancel.restaurantId
            }));
            ws.close();
          };
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking');
      }
    }
  };

  const formatTableInfo = (tables) => {
    const tableInfo = [];
    if (tables.twoPerson) tableInfo.push(`${tables.twoPerson} × 2-seater`);
    if (tables.fourPerson) tableInfo.push(`${tables.fourPerson} × 4-seater`);
    if (tables.sixPerson) tableInfo.push(`${tables.sixPerson} × 6-seater`);
    return tableInfo.join(', ');
  };

  const isActiveReservation = (booking) => {
    return booking.status === 'confirmed' && new Date(booking.date) >= new Date();
  };

  return (
    <div className={styles.bookingsContainer}>
      <h2>Your Bookings</h2>
      
      <div className={styles.bookingsList}>
        {bookings.length === 0 ? (
          <div className={styles.noBookings}>
            <p>You don't have any bookings yet.</p>
          </div>
        ) : (
          <>
            <h3>Current Bookings</h3>
            {bookings
              .filter(booking => new Date(booking.date) >= new Date())
              .map(booking => (
                <div key={booking._id} className={`${styles.bookingCard} ${booking.status === 'cancelled' ? styles.cancelledBooking : ''}`}>
                  <div className={styles.restaurantInfo}>
                    <h4>{booking.restaurantId.name}</h4>
                    <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                    <p>Time: {booking.time}</p>
                    <p>Tables: {formatTableInfo(booking.tables)}</p>
                    <p className={styles.entryCode}>Entry Code: {booking.entryCode}</p>
                    {booking.status === 'cancelled' && (
                      <p className={styles.cancelledStatus}>Cancelled</p>
                    )}
                  </div>
                  {isActiveReservation(booking) && (
                    <div className={styles.bookingActions}>
                      <button 
                        onClick={() => handleEdit(booking)} 
                        className={styles.editButton}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        onClick={() => handleCancel(booking._id)} 
                        className={styles.cancelButton}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}

            <h3>Previous Bookings</h3>
            {bookings
              .filter(booking => new Date(booking.date) < new Date() && booking.status !== 'cancelled')
              .map(booking => (
                <div key={booking._id} className={`${styles.bookingCard} ${styles.pastBooking}`}>
                  <div className={styles.restaurantInfo}>
                    <h4>{booking.restaurantId.name}</h4>
                    <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                    <p>Time: {booking.time}</p>
                    <p>Tables: {formatTableInfo(booking.tables)}</p>
                    <p className={styles.entryCode}>Entry Code: {booking.entryCode}</p>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Bookings;
