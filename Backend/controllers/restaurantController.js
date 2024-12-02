const restaurant = require('../model/restaurantmodel');
const mongoose = require('mongoose');

const isValidTimeRange = (openTime, closeTime) => {
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openingMinutes = openHour * 60 + openMinute;
    const closingMinutes = closeHour * 60 + closeMinute;

    return closingMinutes > openingMinutes;
};

//controller to add Restaurant
const addRestaurant = async (req, res) => {
    try {
        const { name, location, capacity, cuisines, openingTime, closingTime, phoneNumber, foodPreference, features, specialDishes } = req.body;
        if (!req.files.image || !req.files.menuImage) {
            return res.status(400).json({ message: 'Images are required' });
        }
        if (!isValidTimeRange(openingTime, closingTime)) {
            return res.status(400).json({ message: "Invalid Time Range" })
        }
        const newRestaurant = new restaurant({
            ownerId: req.user._id,
            image: req.files.image.map(file => file.filename),
            menuImage: req.files.menuImage.map(file => file.filename),
            name,
            location,
            capacity: JSON.parse(capacity),
            cuisines,
            openingTime,
            closingTime,
            phoneNumber,
            foodPreference,
            features,
            specialDishes
        });
        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant added successfully', restaurant: newRestaurant });

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
}

const allRestaurant = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const restaurantData = await restaurant.find({ ownerId: ownerId });
        const transformedData = restaurantData.map(restaurant => ({
            ...restaurant.toObject(),
            image: restaurant.image[0]   //considering only first image to display on card
        }));
        res.status(201).json({ restaurantData: transformedData });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message })
    }
}

const GetRestaurantById = async (req, res) => {
    try {
        const id = req.params.id;
        const Restaurant = await restaurant.findById(id);
        if (!Restaurant) {
            return res.status(404).json({ message: "Restaurant Not Found" });
        }
        res.status(200).json({ restaurantData: Restaurant });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message })
    }
}

const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, capacity, cuisines, openingTime, closingTime, phoneNumber, features, specialDishes } = req.body;

        const Restaurant = await restaurant.findOne({ _id: id, ownerId: req.user._id });
        if (!Restaurant) {
            return res.status(404).json({ message: 'Restaurant not found or unauthorized access' });
        }
        Restaurant.name = name;
        Restaurant.location = location;
        Restaurant.capacity = JSON.parse(capacity);
        Restaurant.cuisines = cuisines
    

        Restaurant.features = features
        Restaurant.specialDishes = specialDishes
        Restaurant.openingTime = openingTime;
        Restaurant.closingTime = closingTime;
        Restaurant.phoneNumber = phoneNumber;
        Restaurant.image = req.files.image.map(file => file.filename);
        
        Restaurant.menuImage = req.files.menuImage.map(file => file.filename);
        await Restaurant.save();
        res.status(200).json({ message: 'Restaurant updated successfully', restaurant: Restaurant });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message });
    }
}


module.exports = { addRestaurant, allRestaurant, updateRestaurant,GetRestaurantById,isValidTimeRange };
