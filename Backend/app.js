require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const port = 3000;
mongoose.connect(uri)
.then(()=>{
    console.log("Connected to Database");
    app.listen(port, ()=>{
        console.log(`Server running on port ${port}`);
    })
})
.catch(err => console.log(err));
