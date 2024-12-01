import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import RestaurantCard from './RestaurantCard';
import RestaurantModal from './RestaurantModal';
import styles from './Dashboard.module.css';
import AddRestaurantForm from './AddRestaurantform';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Dashboard = () => {
  const [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);
  const [restaurants , setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [action, setAction] = useState(''); // To store the action (edit/manage)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Check token and validation in useEffect to ensure we're in browser environment
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login?type=owner');
      return; // Exit early if no token
    }

    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.isOwner) {
        navigate('/user-dashboard');
        return;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token'); // Clear invalid token
      navigate('/login?type=owner');
      return;
    }

    // Only fetch restaurants if we have a valid token
    fetchRestaurants();
  }, [navigate]);
  // useEffect(() => {
  //   fetchRestaurants();
  // }, []);
  

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/restaurant/allRestaurant`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login?type=owner');
        }
        throw new Error('Failed to fetch restaurants');
      }
  
      const data = await response.json();
      const restaurantData = data.restaurantData.map(restaurant => ({
        ...restaurant,
        imageUrl: `${process.env.REACT_APP_API_URL}/restaurant/images/${restaurant.image}`
      }));
      
      setRestaurants(restaurantData);
      setError(null);
    } catch (err) {
      setError('Failed to load restaurants. Please try again later.');
      console.error('Error fetching restaurants:', err);
      

    } finally {
      setLoading(false);
    }
  };
  
  const handleAddOrUpdateRestaurant = async (newRestaurant, isEdit = false) => {
    try {
      if (isEdit) {
        // Format the updated restaurant data
        const formattedRestaurant = {
          ...newRestaurant,
          imageUrl: Array.isArray(newRestaurant.image)
            ? `${process.env.REACT_APP_API_URL}/restaurant/images/${newRestaurant.image[0]}`
            : `${process.env.REACT_APP_API_URL}/images/${newRestaurant.image}`,
        };

        // Update the restaurants array with the new data
        setRestaurants(prevRestaurants =>
          prevRestaurants.map(restaurant =>
            restaurant._id === newRestaurant._id ? formattedRestaurant : restaurant
          )
        );
      } else {
        // Handle adding new restaurant (existing code)
        const formattedRestaurant = {
          ...newRestaurant,
          imageUrl: Array.isArray(newRestaurant.image)
            ? `${process.env.REACT_APP_API_URL}/restaurant/images/${newRestaurant.image[0]}`
            : `${process.env.REACT_APP_API_URL}/restaurant/images/${newRestaurant.image}`,
        };
        setRestaurants(prev => [...prev, formattedRestaurant]);
      }
      
      setShowAddRestaurantModal(false);
      setIsEditing(false);
      setSelectedRestaurant(null);
    } catch (error) {
      console.error('Error handling restaurant:', error);
    }
  };
  const onSave = async (newRestaurant) => {
    // Add the imageUrl to the new restaurant
    // const restaurantdata = {
    //   ...newRestaurant,
    //   imageUrl: `http://localhost:4000/restaurant/images/${newRestaurant.image}`
    // };
    console.log("1", newRestaurant)
    const formattedRestaurant = {
      ...newRestaurant,
      imageUrl: `${process.env.REACT_APP_API_URL}/restaurant/images/${newRestaurant.image}`,
    };
    // Update the local state by adding the new restaurant to the existing array
    setRestaurants(prevRestaurants => [...prevRestaurants, formattedRestaurant]);
    setShowAddRestaurantModal(false);
    console.log(restaurants);
  };
  
  
  // Filter restaurants based on search and cuisine
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterCuisine === '' || 
     (restaurant.cuisines && 
      restaurant.cuisines.toLowerCase().split(',').some(cuisine => 
        cuisine.trim().toLowerCase().includes(filterCuisine.toLowerCase())
      ))
    )
  );
  
  const handleAddRestaurantClose = () => {
    setShowAddRestaurantModal(false);
  };

  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleButtonClick = async (actionType, restaurant) => {
    setAction(actionType);
    if (actionType === 'edit') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/restaurant/${restaurant._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant details');
        }
        
        const restaurantData = await response.json();
        const formattedData = {
          ...restaurantData,
          restaurantData: {
            ...restaurantData.restaurantData,
            image: Array.isArray(restaurantData.restaurantData.image)
              ? restaurantData.restaurantData.image.map(img =>
                  img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}/restaurant/images/${img}`
                )
              : restaurantData.restaurantData.image
          }
        };
        setSelectedRestaurant(formattedData);
        setIsEditing(true);
        setShowAddRestaurantModal(true);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setError('Failed to fetch restaurant details');
      }
    } else {
      setSelectedRestaurant(restaurant);
    }
  };

  const closeModal = () => {
    setSelectedRestaurant(null);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }
  return (
    <div className={styles.dashboard}>
      <Sidebar onAddRestaurant={() => {
        setIsEditing(false);
        setSelectedRestaurant(null);
        setShowAddRestaurantModal(true);
      }}/>
      <div className={styles.content}>
        <h1 className={styles.heading}>Your Restaurants</h1>
        {error && (
          <div className={styles.errorMessage}>
            {error}
            <button onClick={fetchRestaurants} className={styles.retryButton}>
              Retry
            </button>
          </div>
        )}
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by cuisine..."
            className={styles.searchInput}
            value={filterCuisine}
            onChange={(e) => setFilterCuisine(e.target.value)}
          />
        </div>

        {/* Restaurant Cards */}
        <div className={styles.cardsContainer}>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                id = {restaurant._id}
                name={restaurant.name}
                cuisine={restaurant.cuisines}
                image={restaurant.imageUrl}
                onCardClick={() => handleCardClick(restaurant)}
                onButtonClick={(action) => handleButtonClick(action, restaurant)}
              />
            ))
          ) : (
            <p>No restaurants found.</p>
          )}
        </div>
          
        {showAddRestaurantModal && (
          <AddRestaurantForm
            restaurantData={isEditing ? selectedRestaurant : null}
            onClose={() => {
              setShowAddRestaurantModal(false);
              setIsEditing(false);
              setSelectedRestaurant(null);
            }}
            onSave={(data) => handleAddOrUpdateRestaurant(data, isEditing)}
          />
        )}
        <RestaurantModal 
          restaurant={selectedRestaurant} 
          onClose={() => setSelectedRestaurant(null)} 
          action={action}
        />
      </div>
    </div>
  );
};

export default Dashboard;