import React from "react";
import styles from "./RC.module.css";

const RC = ({ restaurant, onClick }) => {
  return (
    <div className={styles.restaurantCard} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className={styles.restaurantImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/default-restaurant.jpg';
          }}
        />
      </div>
      <div className={styles.restaurantInfo}>
        <h3>{restaurant.name}</h3>
        <p className={styles.cuisine}>{restaurant.cuisines}</p>
        <p className={styles.location}>{restaurant.location}</p>
        <span className={styles.foodPreference}>
          {restaurant.foodPreference}
        </span>
        <div className={styles.timings}>
          {restaurant.openingTime} - {restaurant.closingTime}
        </div>
      </div>
    </div>
  );
};

export default RC;
