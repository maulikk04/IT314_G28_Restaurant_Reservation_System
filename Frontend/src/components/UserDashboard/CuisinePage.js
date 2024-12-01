import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RC from "./RC";
import RestaurantModal from "./RestaurantModal";
import fetchRestaurants from "./restaurantData";
import styles from "./CuisinePage.module.css";

const CuisinePage = () => {
  const { type } = useParams();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    const getRestaurants = async () => {
      const restaurants = await fetchRestaurants();
      const filtered = restaurants.filter((restaurant) => {
        const cuisineList = restaurant.cuisines.split(',').map(c => c.trim().toLowerCase());
        return cuisineList.includes(type.toLowerCase());
      });
      setFilteredRestaurants(filtered);
    };

    getRestaurants();
  }, [type]);

  if (filteredRestaurants.length === 0) {
    return <p>No restaurants found for "{type}" cuisine.</p>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Restaurants offering {type} Cuisine:</h3>
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

export default CuisinePage;
