import axios from 'axios';

const fetchRestaurants = async () => {
    try {
        console.log(process.env.REACT_APP_API_URL);
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/public/restaurants/all`);
        if (response.data?.success && Array.isArray(response.data.restaurantData)) {
            return response.data.restaurantData.map(restaurant => ({
                id: restaurant._id,
                name: restaurant.name || '',
                location: restaurant.location || '',
                image: restaurant.image ? `${process.env.REACT_APP_API_URL}/restaurant/images/${restaurant.image}` : '',
                Image: Array.isArray(restaurant.Image) 
                ? restaurant.Image.map(img => `${process.env.REACT_APP_API_URL}/restaurant/images/${img}`)
                : [],
                cuisines: restaurant.cuisines || '',
                openingTime: restaurant.openingTime || '',
                closingTime: restaurant.closingTime || '',
                phoneNumber: restaurant.phoneNumber || '',
                foodPreference: restaurant.foodPreference || '',
                specialDishes: restaurant.specialDishes || '',
                features: restaurant.features || '',
                menuImage: Array.isArray(restaurant.menuImage) 
                    ? restaurant.menuImage.map(img => `${process.env.REACT_APP_API_URL}/restaurant/images/${img}`)
                    : []
            }));
        }
        // Return fallback data if API fails
        return [
            {
                id: 1,
                name: "Sugar & Spice",
                location: "Surat",
                image: "/images/restaurant1.jpg",
                cuisines: "Italian, Chinese, Indian, Fast Food",
                openingTime: "11:00 AM",
                closingTime: "10:00 PM",
                phoneNumber: "1234567890",
                foodPreference: "Vegan",
                specialDishes: "Pasta, Pizza",
                features: "Outdoor Seating",
                menuImage: ["/images/menu1.jpg", "/images/menu2.jpg"]
            },
            // ... your other fallback data
        ];
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        // Return empty array if everything fails
        return [];
    }
};

export default fetchRestaurants;
