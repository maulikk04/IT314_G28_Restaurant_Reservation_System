import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Bookings.module.css';
import { FaEdit, FaTimes } from 'react-icons/fa';

const Bookings = () => {
  const navigate = useNavigate();

  // Dummy data for bookings
  const dummyBookings = [
    {
      _id: '1',
      restaurantId: '101',
      restaurantName: 'The Fancy Restaurant',
      date: '2024-02-15',
      time: '19:00',
      numberOfGuests: 4
    },
    {
      _id: '2', 
      restaurantId: '102',
      restaurantName: 'Pasta Paradise',
      date: '2024-02-20',
      time: '20:30',
      numberOfGuests: 2
    },
    {
      _id: '3',
      restaurantId: '103', 
      restaurantName: 'Sushi Sensation',
      date: '2023-12-25',
      time: '18:00',
      numberOfGuests: 6
    },
    {
      _id: '4',
      restaurantId: '104',
      restaurantName: 'Burger Bistro',
      date: '2023-12-20',
      time: '13:00', 
      numberOfGuests: 3
    }
  ];

  const handleEdit = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}/book`);
  };

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // In real app, would make API call here
      console.log('Booking cancelled:', bookingId);
    }
  };

  return (
    <div className={styles.bookingsContainer}>
      <h2>Your Bookings</h2>
      
      <div className={styles.bookingsList}>
        {dummyBookings.length === 0 ? (
          <div className={styles.noBookings}>
            <p>You don't have any bookings yet.</p>
          </div>
        ) : (
          <>
            <h3>Current Bookings</h3>
            {dummyBookings.filter(booking => new Date(booking.date) >= new Date()).map(booking => (
              <div key={booking._id} className={styles.bookingCard}>
                <div className={styles.restaurantInfo}>
                  <h4>{booking.restaurantName}</h4>
                  <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p>Time: {booking.time}</p>
                  <p>Guests: {booking.numberOfGuests}</p>
                </div>
                <div className={styles.bookingActions}>
                  <button 
                    onClick={() => handleEdit(booking.restaurantId)}
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
              </div>
            ))}

            <h3>Previous Bookings</h3>
            {dummyBookings.filter(booking => new Date(booking.date) < new Date()).map(booking => (
              <div key={booking._id} className={`${styles.bookingCard} ${styles.pastBooking}`}>
                <div className={styles.restaurantInfo}>
                  <h4>{booking.restaurantName}</h4>
                  <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p>Time: {booking.time}</p>
                  <p>Guests: {booking.numberOfGuests}</p>
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
