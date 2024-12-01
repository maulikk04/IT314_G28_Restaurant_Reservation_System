const express = require('express');
const router = express.Router();
const Restaurant = require('../model/restaurantmodel');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Public restaurant routes are working' });
});

// Get all restaurants
router.get('/all', async (req, res) => {
    try {
        const restaurantData = await Restaurant.find({});
        const transformedData = restaurantData.map(restaurant => ({
            ...restaurant.toObject(),
            image: restaurant.image[0],
            Image: restaurant.image
        }));
        
        res.status(200).json({ 
            success: true,
            restaurantData: transformedData 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch restaurants' 
        });
    }
});

module.exports = router;