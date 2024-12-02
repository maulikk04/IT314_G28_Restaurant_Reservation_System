import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './RestaurantCard.module.css';
import AddRestaurantform from './AddRestaurantform'; // Import the AddRestaurantform component
import useWebSocket from './useWebSocket';

const RestaurantCard = ({id, name, cuisine, image, onCardClick, onButtonClick }) => {
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const navigate = useNavigate();
  const { hasNewReservations, resetNotification } = useWebSocket(id);

  const handleManageClick = async (e) => {
    e.stopPropagation();
    resetNotification();
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservation/${id}/mark-viewed`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark reservations as viewed');
      }

      navigate(`/restaurant/${id}/reservations`);
    } catch (error) {
      console.error('Error marking reservations as viewed:', error);
    }
  };


  const handleCardClick = (e) => {
    
    if (onCardClick) {
      onCardClick(e);
    }
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation(); 
    if (action === 'manage') {
      // Navigate to the reservations page for this restaurant
      navigate(`/restaurant/${id}/reservations`);
    } else if (onButtonClick) {
      onButtonClick(action);
    }
  };

  const closeEditForm = () => {
    setIsEditFormVisible(false); // Close the edit form
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img
          src={image || 'default-image.jpg'} 
          alt={name}
          className={styles.image}
        />
      </div>
      <h3>{name}</h3>
      <p>Cuisine: {cuisine}</p>
      <div className={styles.buttonsContainer}>
      <button
          className={styles.button}
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick('edit');
          }}
        >
          Edit
        </button>
        <button
          className={`${styles.button} ${styles.manageButton}`}
          onClick={handleManageClick}
        >
          Manage
          {hasNewReservations && (
            <span className={styles.notificationBadge}></span>
          )}
        </button>
      </div>

      {/* Conditionally render the AddRestaurantform if isEditFormVisible is true */}
      {isEditFormVisible && (
        <div className={styles.formOverlay}>
          <AddRestaurantform closeForm={closeEditForm} />
        </div>
      )}
    </div>
  );
};

export default RestaurantCard;
