import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ onAddRestaurant }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/');
  };
  return (
    <>
      <div className={styles.sidebar}>
        <h2>Menu</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/contactus">Contact Us</Link></li>
          <li>
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </ul>
        <div>
          <button 
          onClick={onAddRestaurant}
          className={styles.addRestaurantButton}
        >
          Add Restaurant
        </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;