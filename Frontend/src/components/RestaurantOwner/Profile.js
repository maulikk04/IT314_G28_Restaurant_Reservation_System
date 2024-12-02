// src/Profile.js
import React, { useState } from 'react';
import styles from './Profile.module.css';
import { FaUser, FaEnvelope } from 'react-icons/fa';

const Profile = () => {
    const [userData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
      });
    return ( 
            <div className={`${styles.profileContainer}`}>
              <div className={styles.profileHeader}>
                <h2> <center> My Profile </center> </h2>
              </div>
        
              <div className={styles.profileSection}>
                <div className={styles.userInfo}>
                  <div className={styles.infoItem}>
                    <FaUser className={styles.icon} />
                    <div>
                      <h3>Name</h3>
                      <p>{userData.name}</p>
                    </div>
                  </div>
        
                  <div className={styles.infoItem}>
                    <FaEnvelope className={styles.icon} />
                    <div>
                      <h3>Email</h3>
                      <p>{userData.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    );
};

export default Profile;