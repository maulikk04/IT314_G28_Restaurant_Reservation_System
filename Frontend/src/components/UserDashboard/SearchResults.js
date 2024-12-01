import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import fetchRestaurants from './restaurantData';
import RestaurantModal from './RestaurantModal';
import styles from './SearchResults.module.css';

const SearchResults = () => {
  const location = useLocation();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    if (!location.state) {
      setLoading(false);
      return;
    }

    const { searchQuery, suggestions } = location.state;

    if (suggestions?.length > 0) {
      setRestaurants(suggestions);
      setLoading(false);
      return;
    }

    const fetchAndFilterRestaurants = async () => {
      const allRestaurants = await fetchRestaurants();
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        const filteredResults = allRestaurants.filter(restaurant => {
          const searchFields = [
            restaurant.name,
            restaurant.location,
            restaurant.cuisines,
            restaurant.features || '',
            restaurant.foodPreference || ''
          ].join(' ').toLowerCase();
          return searchFields.includes(searchTerm);
        });
        setRestaurants(filteredResults);
      }
      setLoading(false);
    };

    fetchAndFilterRestaurants();
  }, [location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!location.state) {
    return <div>No search parameters provided</div>;
  }

  if (restaurants.length === 0) {
    return <div>No restaurants found matching your search criteria</div>;
  }

  return (
    <div className={styles.searchResultsContainer}>
      <h2 className={styles.searchHeader}>
        Search Results {location.state.searchQuery && `for "${location.state.searchQuery}"`}
      </h2>
      <p className={styles.resultsCount}>
        {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
      </p>

      <div className={styles.restaurantGrid}>
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className={styles.restaurantCard}
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <div className={styles.imageContainer}>
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className={styles.restaurantImage}
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

export default SearchResults;
