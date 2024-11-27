const Restaurant = require('../model/restaurantmodel');
const mongoose = require('mongoose');

let gfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
});

const getAllRestaurants = async (req, res) => {
    try {
        // No authentication required, fetch all restaurants
        const restaurantData = await Restaurant.find({})
            .select('name location cuisines image openingTime closingTime phoneNumber foodPreference'); // Select only needed fields

        const transformedData = restaurantData.map(restaurant => ({
            ...restaurant.toObject(),
            image: restaurant.image[0] // First image for card display
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
};

const getPublicRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id)
            .select('-ownerId'); // Exclude sensitive data

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        res.status(200).json({
            success: true,
            restaurantData: restaurant
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch restaurant details'
        });
    }
};

module.exports = {
    getAllRestaurants,
    getPublicRestaurantById
};