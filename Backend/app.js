require('dotenv').config()
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const passportsetup = require('./middleware/passport_setup');
const passport = require('passport')
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const app = express();
const uri = process.env.MONGO_URI;
const port = process.env.port || 4000;
const restaurantRoutes = require('./routes/restaurantRoutes');
const publicRestaurantRoutes = require('./routes/publicRestaurantRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const { initializeWebSocket } = require('./socket/websocket');
const server = http.createServer(app); 
initializeWebSocket(server);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(cors({
    origin: `${process.env.FRONTEND_URL}` || 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',userRoutes)
app.use('/restaurant', restaurantRoutes);
app.use('/api/public/restaurants', publicRestaurantRoutes);
app.use('/reservation',reservationRoutes);


mongoose.connect(uri)
.then(()=>{
    console.log("Connected to Database");
    server.listen(port, ()=>{
        console.log(`Server running on port ${port}`);
    })
})
.catch(err => console.log(err));
