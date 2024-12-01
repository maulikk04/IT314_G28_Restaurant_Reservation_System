import React, { useState, useEffect } from "react";
import RC from "./RC";
import RestaurantModal from "./RestaurantModal";
import fetchRestaurants from "./restaurantData";
import styles from "./RestaurantList.module.css";

const RestaurantList = ({ filteredLocation }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const loadRestaurants = async () => {
      const data = await fetchRestaurants();
      setRestaurants(data);
    };
    loadRestaurants();
  }, []);

  // Keep your existing filtering logic
  const filteredRestaurants = filteredLocation
    ? restaurants.filter((restaurant) => restaurant.location === filteredLocation)
    : restaurants;

  // Keep your existing JSX structure exactly the same
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Restaurants Near You</h3>
      <div className={styles.cardsContainer}>
        {filteredRestaurants.map((restaurant) => (
          <RC
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => setSelectedRestaurant(restaurant)}
          />
        ))}
      </div>

      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </div>
  );
};

export default RestaurantList;

