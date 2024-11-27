import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RestaurantModel.module.css";

const RestaurantModal = ({ restaurant, onClose }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(null);

  const handleBookTable = () => {
    if (restaurant && restaurant.id) {
      navigate(`/user-dashboard/book-table/${restaurant.id}`);
    } else {
      console.error("Restaurant ID is not available.");
    }
  };

  const handleImageClick = (index) => {
    setSelectedImage(restaurant.menuImage[index]);
    setFullscreenImageIndex(index);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setFullscreenImageIndex(null);
  };

  const nextFullscreenImage = (e) => {
    e.stopPropagation();
    if (fullscreenImageIndex !== null && restaurant.menuImage) {
      const nextIndex = fullscreenImageIndex === restaurant.menuImage.length - 1 ? 0 : fullscreenImageIndex + 1;
      setFullscreenImageIndex(nextIndex);
      setSelectedImage(restaurant.menuImage[nextIndex]);
    }
  };

  const prevFullscreenImage = (e) => {
    e.stopPropagation();
    if (fullscreenImageIndex !== null && restaurant.menuImage) {
      const prevIndex = fullscreenImageIndex === 0 ? restaurant.menuImage.length - 1 : fullscreenImageIndex - 1;
      setFullscreenImageIndex(prevIndex);
      setSelectedImage(restaurant.menuImage[prevIndex]);
    }
  };

  const nextImage = () => {
    if (restaurant.menuImage && restaurant.menuImage.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === restaurant.menuImage.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (restaurant.menuImage && restaurant.menuImage.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? restaurant.menuImage.length - 1 : prevIndex - 1
      );
    }
  };

  if (!restaurant) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.imageContainer}>
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className={styles.mainImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/default-restaurant.jpg';
            }}
          />
        </div>

        <div className={styles.content}>
          <h2 className={styles.name}>{restaurant.name}</h2>
          <p className={styles.rating}>
            <strong>Rating:</strong> {restaurant.rating} ⭐
          </p>
          <p className={styles.specialDishes}>
            <strong>Special Dishes:</strong> {restaurant.specialDishes}
          </p>
          <p className={styles.location}>
            <strong>Location:</strong> {restaurant.location}
          </p>
          <p className={styles.features}>
            <strong>Features:</strong> {restaurant.features}
          </p>
          <p className={styles.contact}>
            <strong>Contact:</strong> {restaurant.phoneNumber}
          </p>

          <button
            className={styles.bookButton}
            onClick={handleBookTable}
          >
            Book Table
          </button>

          {restaurant.menuImage && restaurant.menuImage.length > 0 && (
            <div className={styles.photos}>
              {restaurant.menuImage.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Menu ${index + 1}`}
                  className={styles.photo}
                  onClick={() => handleImageClick(index)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-menu.jpg';
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className={styles.modalOverlay} onClick={handleCloseImage}>
          <button className={styles.closeButton} onClick={handleCloseImage} style={{position: 'absolute', top: '20px', right: '20px', zIndex: 1001}}>
            &times;
          </button>
          <button className={styles.navButton} onClick={prevFullscreenImage} style={{position: 'absolute', left: '5%'}}>&lt;</button>
          <img
            src={selectedImage}
            alt="Full size menu"
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              cursor: 'pointer'
            }}
          />
          <button className={styles.navButton} onClick={nextFullscreenImage} style={{position: 'absolute', right: '5%'}}>&gt;</button>
        </div>
      )}
    </div>
  );
};

export default RestaurantModal;
