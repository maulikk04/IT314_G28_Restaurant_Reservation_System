import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LoginSignup/LandingPage';
import LoginPage from './components/LoginSignup/LoginPage';
import UserTypeSelection from './components/LoginSignup/UserTypeSelection';
import Dashboard from './components/RestaurantOwner/Dashboard';
import ResetPassword from './components/LoginSignup/ResetPassword';
import UserDashboard from './components/UserDashboard/UserDashboard';
import AddRestaurant from './components/RestaurantOwner/AddRestaurantform'; // Import your AddRestaurant component
import Reservation  from './components/RestaurantOwner/reservation';
import Profile from './components/RestaurantOwner/Profile';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Route with Token as Parameter */}
        <Route path="/login/:token" element={<LoginPage />} />

        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* User type selection page */}
        <Route path="/select-user" element={<UserTypeSelection />} />
       
        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Dashboard with nested routes */}
        <Route path="/user-dashboard/*" element={<UserDashboard />} />

        {/* Reset Password Route with Token */}
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

        {/* Add Restaurant page */}
        <Route path="/add-restaurant" element={<AddRestaurant />} /> {/* Add this route */}
        <Route path="/restaurant/:id/reservations" element={<Reservation />} />

        <Route path="/profile" element={<Profile />} /> 
        {/* Redirect any unknown paths to the landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
