import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar1.module.css";
import fetchRestaurants from "./restaurantData";

const Navbar1 = ({ filterByLocation }) => {
  const navigate = useNavigate();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [locations] = useState(["All Locations", "Ahmedabad", "Surat", "Mumbai", "Delhi", "Bangalore", "Kolkata", "Gandhinagar"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      const restaurantsData = await fetchRestaurants();
      setRestaurants(restaurantsData);
    };
    getLocations();
  }, []);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    filterByLocation(location === "All Locations" ? null : location);
    setShowLocationDropdown(false);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      const filteredSuggestions = restaurants.filter(restaurant => {
        const searchFields = [
          restaurant.name,
          restaurant.location,
          restaurant.cuisines,
          restaurant.features || '',
          restaurant.foodPreference || ''
        ].join(" ").toLowerCase();
        return searchFields.includes(term.toLowerCase());
      });
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (searchItem = null) => {
    setShowSuggestions(false);
    const searchQuery = searchItem || searchTerm;
    
    if (searchQuery.trim()) {
      navigate("/user-dashboard/search-results", { 
        state: { 
          searchQuery: searchQuery.trim(),
          suggestions: suggestions 
        } 
      });
      setSearchTerm('');
    }
  };

  const handleSuggestionClick = (item) => {
    handleSearchSubmit(item.name);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleHomeClick = () => {
    setSelectedLocation("All Locations");
    filterByLocation(null);
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate("/user-dashboard");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className={styles.navbar}>
      <button className={styles.brand} onClick={handleHomeClick}>
        Fork & Feast
      </button>

      <div
        className={styles.locationDropdown}
        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
      >
        <button className={styles.dropdownButton}>{selectedLocation}</button>
        {showLocationDropdown && (
          <div className={styles.dropdownMenu}>
            {locations.map((loc, index) => (
              <button
                key={index}
                onClick={() => handleLocationChange(loc)}
                className={styles.dropdownItem}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            placeholder="Search for Restaurants, Preferences, Features etc."
            className={styles.searchBar}
            value={searchTerm}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={styles.searchButton}
            onClick={() => handleSearchSubmit()}
          >
            Search
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <>
            <div 
              className={`${styles.searchBackdrop} ${showSuggestions ? styles.active : ''}`}
              onClick={() => setShowSuggestions(false)}
            />
            <div className={styles.suggestions}>
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(item)}
                >
                  <span className={styles.suggestionName}>{item.name}</span>
                  <span className={styles.suggestionDetails}>
                    {item.cuisines} • {item.location}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.rightSection}>
        <button 
          className={styles.optionButton} 
          onClick={() => navigate("/user-dashboard/about-us")}
        >
          Contact Us
        </button>
        <button
          className={styles.optionButton}
          onClick={() => navigate("/user-dashboard/become-a-member")}
        >
          Become a Member
        </button>
        <div
          className={styles.profile}
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        >
          <button className={styles.profileBtn}>VG</button>
          {showProfileDropdown && (
            <div className={styles.profileDropdown}>
              <button onClick={() => navigate("/user-dashboard/profile")}>My Profile</button>
              <button onClick={() => navigate("/user-dashboard/bookings")}>Bookings</button>
              <button onClick={() => navigate("/user-dashboard/favourites")}>Favourites</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar1;
