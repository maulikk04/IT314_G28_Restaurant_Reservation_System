import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyProfile.module.css';
import { FaUser, FaEnvelope, FaCrown, FaCalendar } from 'react-icons/fa';

const MyProfile = () => {
  const navigate = useNavigate();
  
  // Dummy user data - replace with actual user data from backend
  const [userData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    membership: {
      isMember: true,
      tier: "Gold",
      expiresOn: "2024-12-31"
    },
    bookings: [
      {
        restaurantName: "The Fancy Restaurant",
        date: "2024-02-15",
        time: "19:00",
        guests: 4
      },
      {
        restaurantName: "Pasta Paradise",
        date: "2024-02-20",
        time: "20:30",
        guests: 2
      }
    ]
  });

  const handleBecomeMember = () => {
    navigate('/membership-plans');
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h2>My Profile</h2>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.userInfo}>
          <div className={styles.infoItem}>
            <FaUser className={styles.icon} />
            <div>
              <h3>Name</h3>
              <p>{userData.name}</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <FaEnvelope className={styles.icon} />
            <div>
              <h3>Email</h3>
              <p>{userData.email}</p>
            </div>
          </div>
        </div>

        <div className={styles.membershipSection}>
          <FaCrown className={styles.icon} />
          <h3>Membership Status</h3>
          {userData.membership.isMember ? (
            <div className={styles.membershipInfo}>
              <p className={styles.tierBadge}>{userData.membership.tier} Member</p>
              <p>Expires on: {new Date(userData.membership.expiresOn).toLocaleDateString()}</p>
            </div>
          ) : (
            <div className={styles.nonMember}>
              <p>You are not a member yet</p>
              <button 
                className={styles.membershipButton}
                onClick={handleBecomeMember}
              >
                Become a Member
              </button>
            </div>
          )}
        </div>

        <div className={styles.bookingsSection}>
          <FaCalendar className={styles.icon} />
          <h3>Recent Bookings</h3>
          <div className={styles.bookingsList}>
            {userData.bookings.map((booking, index) => (
              <div key={index} className={styles.bookingCard}>
                <h4>{booking.restaurantName}</h4>
                <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                <p>Time: {booking.time}</p>
                <p>Guests: {booking.guests}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyProfile;
