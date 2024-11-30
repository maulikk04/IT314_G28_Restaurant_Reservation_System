import React, { useState, useRef, useEffect } from 'react';
import './AddRestaurantform.css';

function AddRestaurantform({ restaurantData, onSave, onClose }) {
  const initialFormData = {
    name: '',
    location: '',
    images: [],
    menuImages: [],
    capacity: { twoPerson: 0, fourPerson: 0, sixPerson: 0 },
    cuisines: '',
    openingTime: '',
    closingTime: '',
    phoneNumber: '',
    specialDishes: '',
    features: '',
    foodPreference: '',
  };

  // If restaurantData is passed (i.e. when editing), set formData to that data
  const [formData, setFormData] = useState(() => {

    if (restaurantData) {
      return {
        name: restaurantData.restaurantData.name || '',
        location: restaurantData.restaurantData.location || '',
        images: [], // Will be handled by image previews
        menuImages: [], // Will be handled by menu image previews
        capacity: {
          twoPerson: restaurantData.restaurantData.capacity?.twoPerson || 0,
          fourPerson: restaurantData.restaurantData.capacity?.fourPerson || 0,
          sixPerson: restaurantData.restaurantData.capacity?.sixPerson || 0
        },
        cuisines: restaurantData.restaurantData.cuisines || [],
        openingTime: restaurantData.restaurantData.openingTime || '',
        closingTime: restaurantData.restaurantData.closingTime || '',
        phoneNumber: restaurantData.restaurantData.phoneNumber || '',
        specialDishes: restaurantData.restaurantData.specialDishes || [],
        features: restaurantData.restaurantData.features || '',
        foodPreference: restaurantData.restaurantData.foodPreference || '',
      };
    }

    return initialFormData;
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [menuImagePreviews, setMenuImagePreviews] = useState([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showMenuImagePreview, setShowMenuImagePreview] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [menuCurrentPreviewIndex, setMenuCurrentPreviewIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const imageInputRef = useRef(null);
  const menuImageInputRef = useRef(null);

  useEffect(() => {
    if (restaurantData) {
      // Handle restaurant images
      const existingImageUrls = Array.isArray(restaurantData.restaurantData.image)
        ? restaurantData.restaurantData.image
        : [restaurantData.restaurantData.image];
      
      const formattedImageUrls = existingImageUrls
        .filter(img => img) // Remove any null or undefined images
        .map(img => img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}/restaurant/images/${img}`);
  
      // Convert existing image URLs to File objects
      const convertUrlToFile = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], `restaurant_image_${Date.now()}.jpg`, { type: blob.type });
      };
  
      Promise.all(formattedImageUrls.map(convertUrlToFile))
        .then(imageFiles => {
          setFormData(prev => ({
            ...prev,
            images: imageFiles
          }));
          setImagePreviews(formattedImageUrls);
        });
  
      const existingMenuImageUrls = Array.isArray(restaurantData.restaurantData.menuImage)
        ? restaurantData.restaurantData.menuImage
        : [restaurantData.restaurantData.menuImage];
      
      const formattedMenuImageUrls = existingMenuImageUrls
        .filter(img => img)
        .map(img => img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}/restaurant/images/${img}`);
  
      Promise.all(formattedMenuImageUrls.map(convertUrlToFile))
        .then(menuImageFiles => {
          setFormData(prev => ({
            ...prev,
            menuImages: menuImageFiles
          }));
          setMenuImagePreviews(formattedMenuImageUrls);
        });
    }
  }, [restaurantData]);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    if (newFiles.length === 0) return;
    if (name === 'images') {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newFiles]
      }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    } else if (name === 'menuImages') {
      setFormData(prev => ({
        ...prev,
        menuImages: [...(prev.menuImages || []), ...newFiles]
      }));
      setMenuImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleImageNavigation = (direction, type) => {
    if (type === 'ambience') {
      const maxIndex = imagePreviews.length - 1;
      setCurrentPreviewIndex(prevIndex => {
        if (direction === 'prev') {
          return prevIndex === 0 ? maxIndex : prevIndex - 1;
        }
        return prevIndex === maxIndex ? 0 : prevIndex + 1;
      });
    } else {
      const maxIndex = menuImagePreviews.length - 1;
      setMenuCurrentPreviewIndex(prevIndex => {
        if (direction === 'prev') {
          return prevIndex === 0 ? maxIndex : prevIndex - 1;
        }
        return prevIndex === maxIndex ? 0 : prevIndex + 1;
      });
    }
  };
  const handleCapacityChange = (type, increment) => {
    setFormData((prev) => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [type]: Math.max(0, prev.capacity[type] + increment)
      }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      const token = localStorage.getItem('token');

      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'menuImages') {
          if (typeof formData[key] === 'object') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      formData.images.forEach(file => {
        formDataToSend.append('image', file);
      });
      
      formData.menuImages.forEach(file => {
        formDataToSend.append('menuImage', file);
      });
      // Determine if we're updating or creating
      const url = restaurantData
        ? `${process.env.REACT_APP_API_URL}/restaurant/updateRestaurant/${restaurantData.restaurantData._id}`
        : `${process.env.REACT_APP_API_URL}/restaurant/addRestaurant`;

      const method = restaurantData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save restaurant');
      }

      const result = await response.json();
      onSave(result.restaurant);
      handleClear();
      alert(`Restaurant ${restaurantData ? 'updated' : 'added'} successfully!`);
      onClose();
    } catch (err) {
      console.error('Error saving restaurant:', err);
      setError(err.message || 'An error occurred while saving the restaurant');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleClear = () => {
    setFormData(initialFormData);
    setImagePreviews([]);
    setMenuImagePreviews([]);
    setShowImagePreview(false);

    if (imageInputRef.current) imageInputRef.current.value = '';
    if (menuImageInputRef.current) menuImageInputRef.current.value = '';
  };

  const totalCapacity =
    formData.capacity.twoPerson * 2 +
    formData.capacity.fourPerson * 4 +
    formData.capacity.sixPerson * 6;

  const handlePrevImage = () => {
    if (showImagePreview) {
      setCurrentPreviewIndex((prevIndex) =>
        prevIndex === 0 ? imagePreviews.length - 1 : prevIndex - 1
      );
    } else if (showMenuImagePreview) {
      setMenuCurrentPreviewIndex((prevIndex) =>
        prevIndex === 0 ? menuImagePreviews.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (showImagePreview) {
      setCurrentPreviewIndex((prevIndex) =>
        prevIndex === imagePreviews.length - 1 ? 0 : prevIndex + 1
      );
    } else if (showMenuImagePreview) {
      setMenuCurrentPreviewIndex((prevIndex) =>
        prevIndex === menuImagePreviews.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleFoodPreferenceChange = (preference) => {
    setFormData({ ...formData, foodPreference: preference });
  };

  return (
    <div className="modalOverlay" onClick={(e) => {
      if (e.target.className === 'modalOverlay') {
        onClose();
      }
    }}>
      <div className="modalcontainer">
        <span className="close-icon" style={{
          cursor: 'pointer',
          position: 'absolute',
          right: '20px',
          top: '20px',
          fontSize: '24px'
        }} onClick={onClose}>
          ×
        </span>
        <div className="formContainer">
          <h1 className="title">{restaurantData ? 'Edit' : 'Add'} Restaurant Details</h1>
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="form" noValidate={showImagePreview || showMenuImagePreview}>
            <div>
              <label>Restaurant Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => {
                  if (/^\d{0,10}$/.test(e.target.value)) handleChange(e);
                }}
                required
              />
            </div>
            <div>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Ambience (Upload Images):</label>
              <input type="file" name="images" multiple onChange={handleFileChange} ref={imageInputRef} accept="image/*" />
              {imagePreviews.length > 0 && (
                <button type="button" style={{ marginTop: '5px' }} onClick={() => setShowImagePreview(true)}>
                  Preview Ambience Images
                </button>
              )}
              {showImagePreview && (
                <div className="preview-modal">
                  <button onClick={handlePrevImage} className="nav-button left">
                    ‹
                  </button>
                  <img src={imagePreviews[currentPreviewIndex]} alt="Preview" className="large-preview-image" />
                  <button onClick={handleNextImage} className="nav-button right">
                    ›
                  </button>
                  <button onClick={() => setShowImagePreview(false)} className="close-preview-button">
                    Close Preview
                  </button>
                </div>
              )}
            </div>

            <div>
              <label>Menu (Upload Images):</label>
              <input type="file" name="menuImages" multiple onChange={handleFileChange} ref={menuImageInputRef} accept="image/*" />
              {menuImagePreviews.length > 0 && (
                <button type="button" style={{ marginTop: '5px' }} onClick={() => setShowMenuImagePreview(true)}>
                  Preview Menu Images
                </button>
              )}
              {showMenuImagePreview && (
                <div className="preview-modal">
                  <button onClick={handlePrevImage} className="nav-button left">
                    ‹
                  </button>
                  <img src={menuImagePreviews[menuCurrentPreviewIndex]} alt="Preview" className="large-preview-image" />
                  <button onClick={handleNextImage} className="nav-button right">
                    ›
                  </button>
                  <button onClick={() => setShowMenuImagePreview(false)} className="close-preview-button">
                    Close Preview
                  </button>
                </div>
              )}
            </div>

            <div>
              <label>Capacity:</label>
              <div className="capacity-selector">
                <div>
                  <label>2 Person Tables:</label>
                  <button type="button" onClick={() => handleCapacityChange('twoPerson', -1)}>
                    -
                  </button>
                  <span>{formData.capacity.twoPerson}</span>
                  <button type="button" onClick={() => handleCapacityChange('twoPerson', 1)}>
                    +
                  </button>
                </div>
                <div>
                  <label>4 Person Tables:</label>
                  <button type="button" onClick={() => handleCapacityChange('fourPerson', -1)}>
                    -
                  </button>
                  <span>{formData.capacity.fourPerson}</span>
                  <button type="button" onClick={() => handleCapacityChange('fourPerson', 1)}>
                    +
                  </button>
                </div>
                <div>
                  <label>6 Person Tables:</label>
                  <button type="button" onClick={() => handleCapacityChange('sixPerson', -1)}>
                    -
                  </button>
                  <span>{formData.capacity.sixPerson}</span>
                  <button type="button" onClick={() => handleCapacityChange('sixPerson', 1)}>
                    +
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label>Total Capacity:</label>
              <span>{totalCapacity}</span>
            </div>

            <div>
              <label>Food Preference:</label>
              <div>
                <input
                  type="radio"
                  name="foodPreference"
                  value="Vegetarian"
                  checked={formData.foodPreference === 'Vegetarian'}
                  onChange={() => handleFoodPreferenceChange('Vegetarian')}
                />
                Vegetarian
              </div>
              <div>
                <input
                  type="radio"
                  name="foodPreference"
                  value="Non-Vegetarian"
                  checked={formData.foodPreference === 'Non-Vegetarian'}
                  onChange={() => handleFoodPreferenceChange('Non-Vegetarian')}
                />
                Non-Vegetarian
              </div>
              <div>
                <input
                  type="radio"
                  name="foodPreference"
                  value="Vegan"
                  checked={formData.foodPreference === 'Vegan'}
                  onChange={() => handleFoodPreferenceChange('Vegan')}
                />
                Vegan
              </div>
            </div>

            <div>
              <label>Cuisines:</label>
              <input
                type="text"
                value={formData.cuisines}
                onChange={handleChange}
                name="cuisines"
                placeholder="Enter comma separated Cuisines"
              />
            </div>

            <div>
              <label>Opening Time:</label>
              <input
                type="time"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Closing Time:</label>
              <input
                type="time"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Special Dishes:</label>
              <input
                type="text"
                name="specialDishes"
                value={formData.specialDishes}
                placeholder="Enter comma separated Special Dishes"
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Features:</label>
              <input
                type="text"
                name="features"
                value={formData.features}
                placeholder="Enter comma separated Features"
                onChange={handleChange}
              />
            </div>

            

            <div className="buttons">
              {!restaurantData &&
                <button type="button" onClick={handleClear} disabled={isSubmitting}>
                  Clear
                </button>
              }
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : (restaurantData ? 'Update' : 'Add') + ' Restaurant'}
              </button>
            </div>
          </form>
        </div>
        {showImagePreview && (
          <div className="preview-modal">
            <button onClick={() => handleImageNavigation('prev', 'ambience')} className="nav-button left">
              ‹
            </button>
            <img src={imagePreviews[currentPreviewIndex]} alt="Preview" className="large-preview-image" />
            <button onClick={() => handleImageNavigation('next', 'ambience')} className="nav-button right">
              ›
            </button>
            <button onClick={() => setShowImagePreview(false)} className="close-preview-button">
              Close Preview
            </button>
          </div>
        )}
        {showMenuImagePreview && (
          <div className="preview-modal">
            <button onClick={() => handleImageNavigation('prev', 'menu')} className="nav-button left">
              ‹
            </button>
            <img src={menuImagePreviews[menuCurrentPreviewIndex]} alt="Preview" className="large-preview-image" />
            <button onClick={() => handleImageNavigation('next', 'menu')} className="nav-button right">
              ›
            </button>
            <button onClick={() => setShowMenuImagePreview(false)} className="close-preview-button">
              Close Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddRestaurantform;