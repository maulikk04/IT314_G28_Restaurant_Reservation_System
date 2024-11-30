// src/Profile.js
import React from 'react';
import './Profile.css'; // Import the CSS file for styling
//import profileImage from './profilephoto.jpeg'; // Adjust the path as necessary

const Profile = () => {
    return (
        <div className="profile-container">
            <div className="profile-box">
                <img 
                    //src={profileImage} // Use the imported image
                    alt="Profile"
                    className="profile-photo"
                />
                <h2 className="profile-name">John Doe</h2>
                <p className="profile-email">Email ID: johndoe@example.com</p>
                <button className="edit-button">Edit Profile</button>
            </div>
        </div>
    );
};

export default Profile;