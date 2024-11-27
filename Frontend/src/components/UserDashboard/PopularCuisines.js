import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PopularCuisines.module.css";
import fetchRestaurants from "./restaurantData";

const PopularCuisine = () => {
  const [cuisines, setCuisines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCuisines = async () => {
      const restaurants = await fetchRestaurants();
      const allCuisines = restaurants.reduce((acc, restaurant) => {
        const cuisineList = restaurant.cuisines.split(',').map(c => c.trim());
        return [...acc, ...cuisineList];
      }, []);
      
      // Get unique cuisines and remove empty strings
      const uniqueCuisines = [...new Set(allCuisines)].filter(cuisine => cuisine);
      setCuisines(uniqueCuisines);
    };

    getCuisines();
  }, []);

  const handleCuisineClick = (cuisine) => {
    navigate(`/user-dashboard/cuisine/${cuisine}`);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Popular Cuisines</h3>
      <div className={styles.cuisines}>
        {cuisines.map((cuisine, index) => (
          <button
            key={index}
            className={styles.cuisineBtn}
            onClick={() => handleCuisineClick(cuisine)}
          >
            {cuisine}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularCuisine;
