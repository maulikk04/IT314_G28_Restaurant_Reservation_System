const restaurantData = [
  {
    id: 1,
    name: "Spice Symphony",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    cuisine: "Indian",
    rating: 4.6,
    priceRating: "₹₹₹",
    menus: [
      "https://images.unsplash.com/photo-1574484284002-952d92456975",
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",
      "https://images.unsplash.com/photo-1544250965-67a1716ae3e8"
    ],
    specialDishes: ["Chicken Biryani", "Tandoori Lamb"],
    features: ["Authentic Indian Spices", "Vegan Options"],
    booking: true,
    location: "Mumbai",
    address: "21 Curry Lane, Mumbai",
    photos: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9"
    ],
    openingTime: "11:00",
    closingTime: "23:00",
    totalTables: {
      2: 10,
      4: 8,
      6: 4
    },
    bookedSlots: {
      "2024-11-19": {
        "12:00": { 2: 8, 4: 5, 6: 2 },
        "13:00": { 2: 5, 4: 3, 6: 1 },
        "19:00": { 2: 10, 4: 8, 6: 4 }
      }
    },
    offers: [
      { title: "20% Off", description: "Enjoy a 20% discount on your first visit!" },
      { title: "Free Drink", description: "Get a free drink with any main course order." },
    ],
  },
  {
    id: 2,
    name: "Great Wall Wok",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    cuisine: "Chinese",
    rating: 4.4,
    priceRating: "₹₹₹",
    menus: [
      "https://images.unsplash.com/photo-1553163147-622ab57be1c7",
      "https://images.unsplash.com/photo-1562059390-a761a084768e",
      "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf"
    ],
    specialDishes: ["Peking Duck", "Sweet and Sour Pork"],
    features: ["Authentic Chinese Ingredients", "Family Style Dining"],
    booking: false,
    location: "Beijing",
    address: "15 Noodle Ave, Beijing",
    photos: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d",
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec",
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47"
    ],
    openingTime: "10:00",
    closingTime: "22:00",
    totalTables: {
      2: 12,
      4: 6,
      6: 3
    },
    bookedSlots: {
      "2024-02-01": {
        "11:00": { 2: 10, 4: 4, 6: 2 },
        "14:00": { 2: 8, 4: 3, 6: 1 },
        "18:00": { 2: 12, 4: 6, 6: 3 }
      }
    },
    offers: [
      { title: "Buy 1 Get 1 Free", description: "Buy one dish and get another free during lunch hours." },
      { title: "15% Off", description: "Get a 15% discount on orders above $50." },
    ],
  },
  {
    id: 3,
    name: "Sakura Bliss",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b",
    cuisine: "Japanese",
    rating: 4.8,
    priceRating: "₹₹₹",
    menus: [
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252",
      "https://images.unsplash.com/photo-1574484284002-952d92456975",
      "https://images.unsplash.com/photo-1562059390-a761a084768e"
    ],
    specialDishes: ["Dragon Roll", "Wagyu Beef Steak"],
    features: ["Traditional Japanese Setting", "Omakase Experience"],
    booking: true,
    location: "Tokyo",
    address: "8 Cherry Blossom St, Tokyo",
    photos: [
      "https://images.unsplash.com/photo-1580442151529-343f2f6e0e27",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9"
    ],
    openingTime: "12:00",
    closingTime: "22:00",
    totalTables: {
      2: 8,
      4: 6,
      6: 2
    },
    bookedSlots: {
      "2024-02-01": {
        "13:00": { 2: 6, 4: 4, 6: 1 },
        "15:00": { 2: 4, 4: 2, 6: 0 },
        "19:00": { 2: 8, 4: 6, 6: 2 }
      }
    },
    offers: [
      { title: "Free Dessert", description: "Enjoy a free dessert with every Omakase meal." },
      { title: "10% Off", description: "Get a 10% discount on orders above ¥2000." },
    ],
  },
  {
    id: 4,
    name: "Taco Fiesta",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
    cuisine: "Mexican",
    rating: 4.5,
    priceRating: "₹₹₹",
    menus: [
      "https://images.unsplash.com/photo-1544250965-67a1716ae3e8",
      "https://images.unsplash.com/photo-1553163147-622ab57be1c7",
      "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf"
    ],
    specialDishes: ["Carne Asada", "Fish Tacos"],
    features: ["Street Food Style", "Live Music Nights"],
    booking: true,
    location: "Mexico City",
    address: "99 Cactus Blvd, Mexico City",
    photos: [
      "https://images.unsplash.com/photo-1586673336422-c22e83d0c697",
      "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c",
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47"
    ],
    openingTime: "11:00",
    closingTime: "23:00",
    totalTables: {
      2: 10,
      4: 5,
      6: 3
    },
    bookedSlots: {
      "2024-02-01": {
        "12:00": { 2: 7, 4: 3, 6: 2 },
        "16:00": { 2: 5, 4: 2, 6: 1 },
        "20:00": { 2: 10, 4: 5, 6: 3 }
      }
    },
    offers: [
      { title: "Free Guacamole", description: "Get a free serving of guacamole with your taco order." },
      { title: "Happy Hour", description: "Enjoy 2-for-1 drinks from 5 PM to 7 PM." },
    ],
  },
  {
    id: 5,
    name: "La Bella Vita",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    cuisine: "Italian",
    rating: 4.7,
    priceRating: "₹₹₹",
    menus: [
      "https://images.unsplash.com/photo-1562059390-a761a084768e",
      "https://images.unsplash.com/photo-1574484284002-952d92456975",
      "https://images.unsplash.com/photo-1544250965-67a1716ae3e8"
    ],
    specialDishes: ["Risotto Milanese", "Osso Buco"],
    features: ["Romantic Ambiance", "Homemade Pasta"],
    booking: true,
    location: "Florence",
    address: "44 Roma Piazza, Florence",
    photos: [
      "https://images.unsplash.com/photo-1579684947550-22e945225d9a",
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",
      "https://images.unsplash.com/photo-1580442151529-343f2f6e0e27",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56"
    ],
    openingTime: "12:00",
    closingTime: "23:00",
    totalTables: {
      2: 15,
      4: 8,
      6: 4
    },
    bookedSlots: {
      "2024-02-01": {
        "13:00": { 2: 12, 4: 6, 6: 3 },
        "17:00": { 2: 8, 4: 4, 6: 2 },
        "20:00": { 2: 15, 4: 8, 6: 4 }
      }
    },
    offers: [
      { title: "Free Wine", description: "Get a complimentary glass of wine with any main dish." },
      { title: "10% Off", description: "Get 10% off your first online booking." },
    ],
  },
  {
    id: 6,
    name: "Dragon Noodles",
    image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c",
    cuisine: "Chinese",
    rating: 4.3,
    priceRating: "₹₹₹",
    menus: [
      "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf",
      "https://images.unsplash.com/photo-1553163147-622ab57be1c7",
      "https://images.unsplash.com/photo-1562059390-a761a084768e"
    ],
    specialDishes: ["Hot Pot", "Prawn Dumplings"],
    features: ["Spicy Dishes", "Quick Service"],
    booking: false,
    location: "Shanghai",
    address: "88 Dragon St, Shanghai",
    photos: [
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
      "https://images.unsplash.com/photo-1550367363-ea12860cc124",
      "https://images.unsplash.com/photo-1586673336422-c22e83d0c697",
      "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c"
    ],
    openingTime: "10:00",
    closingTime: "22:00",
    totalTables: {
      2: 12,
      4: 6,
      6: 2
    },
    bookedSlots: {
      "2024-02-01": {
        "11:00": { 2: 8, 4: 4, 6: 1 },
        "15:00": { 2: 6, 4: 3, 6: 0 },
        "19:00": { 2: 12, 4: 6, 6: 2 }
      }
    },
    offers: [
      { title: "20% Off", description: "Get 20% off on all orders during weekdays." },
      { title: "Free Dumplings", description: "Free dumplings with orders over $30." },
    ],
  },
  {
    id: 7,
    name: "Maharaja Palace",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    cuisine: "Indian",
    rating: 4.9,
    priceRating: "₹₹₹",
    menus: [
      "https://images.unsplash.com/photo-1574484284002-952d92456975",
      "https://images.unsplash.com/photo-1544250965-67a1716ae3e8",
      "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf"
    ],
    specialDishes: ["Mutton Biryani", "Butter Chicken"],
    features: ["Royal Indian Experience", "Private Dining"],
    booking: true,
    location: "Jaipur",
    address: "50 Palace Rd, Jaipur",
    photos: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
      "https://images.unsplash.com/photo-1579684947550-22e945225d9a",
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7"
    ],
    openingTime: "11:00",
    closingTime: "23:00",
    totalTables: {
      2: 20,
      4: 10,
      6: 5
    },
    bookedSlots: {
      "2024-02-01": {
        "12:00": { 2: 15, 4: 7, 6: 3 },
        "16:00": { 2: 10, 4: 5, 6: 2 },
        "20:00": { 2: 20, 4: 10, 6: 5 }
      }
    },
    offers: [
      { title: "Complimentary Sweets", description: "Get complimentary sweets with every royal meal." },
      { title: "10% Off", description: "10% discount on all orders above ₹1500." },
    ],
  },
  {
    id: "673c3da7d559e4780273e300",
    ownerId: "673c3c32d559e4780273e2f7",
    image: `${process.env.REACT_APP_API_URL}/restaurant/images/72aa4055900f4b11ed7a67114b4f03cf.png`,
    photos: [
      `${process.env.REACT_APP_API_URL}/restaurant/images/72aa4055900f4b11ed7a67114b4f03cf.png`,
      `${process.env.REACT_APP_API_URL}/restaurant/images/cebe7ca4607eeb98f7792b4cf9e66e74.png`,
      `${process.env.REACT_APP_API_URL}/restaurant/images/b963052ec33a0e812afca4aceb89420a.png`
    ],
    menus: [
      `${process.env.REACT_APP_API_URL}/restaurant/images/fc53412ee31077daa7f40bf48941bd59.png`,
      `${process.env.REACT_APP_API_URL}/restaurant/images/9ad546d1a9990d564555690054b640e0.png`,
      `${process.env.REACT_APP_API_URL}/restaurant/images/8b8b9c530cde4621a65894cfc6f14d48.png`
    ],
    name: "Master",
    location: "Surat",
    capacity: {
      2: 1,
      4: 1,
      6: 1
    },
    cuisine: "Indian, Thai, Chinese, Italian, Mexican",
    openingTime: "06:00",
    closingTime: "23:00",
    phoneNumber: "1234567890",
    foodPreference: "Vegetarian",
    specialDishes: "Nothing",
    features: "Very Good",
    booking: true,
  },
  {
    id: "673c329c3aa6219cd96a3b2e",
    ownerId: "673c2dcb92adafcb666c9365",
    image: `${process.env.REACT_APP_API_URL}/restaurant/images/4783f44003f157f4cb49f0a37db76303.jpg`,
    photos: [`${process.env.REACT_APP_API_URL}/restaurant/images/4783f44003f157f4cb49f0a37db76303.jpg`,
    `${process.env.REACT_APP_API_URL}/restaurant/images/8143e1ea01200632d461d4b972f82cb9.jpg`,
    `${process.env.REACT_APP_API_URL}/restaurant/images/e79112a5c85b355431c30971341ad5ea.jpg`],
    menus: [`${process.env.REACT_APP_API_URL}/restaurant/images/94ef0b333a9d22e9d2a33a3ddf551ee2.png`,
    `${process.env.REACT_APP_API_URL}/restaurant/images/e1f36fa2381e26c1faf1d2569d11d2a3.png`,
    `${process.env.REACT_APP_API_URL}/restaurant/images/7df9e084dba24bd78268d4f55ffac2b7.png`],
    name: "Green Spice",
    location: "Pal, Surat",
    capacity: { 2: 3, 4: 2, 6: 1 },
    cuisines: "Italian,Mexican,Thai",
    openingTime: "11:01",
    closingTime: "22:02",
    phoneNumber: "1234567890",
    foodPreference: "Non-Vegetarian",
    specialDishes: "Pasta, Pizza",
    features: "ekece",
    booking: true,
  }
];

export default restaurantData;