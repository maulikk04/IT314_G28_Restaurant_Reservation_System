import React from "react";
import styles from "./RC.module.css";

const RC = ({ restaurant, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <img 
        src={restaurant.image} 
        alt={restaurant.name}
        className={styles.image}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images/default-restaurant.jpg';
        }}
      />
      <div className={styles.content}>
        <h3 className={styles.name}>{restaurant.name}</h3>
        <p className={styles.location}>{restaurant.location}</p>
        <p className={styles.cuisines}>{restaurant.cuisines}</p>
        {/* <p className={styles.timing}>{restaurant.openingTime} - {restaurant.closingTime}</p> */}
      </div>
    </div>
  );
};

export default RC;
