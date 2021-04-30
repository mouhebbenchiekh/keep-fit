const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Routes :
const authRoute = require('./routes/auth');
const privateRoute = require('./routes/privateRoute');

dotenv.config();

// Connect to DB :
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('Connected to DataBase');
});


//cors allow 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
// Middlewares :
app.use(express.json());

// Route Middlewares :
app.use('/api/user', authRoute);
app.use('/api/private', privateRoute);


app.listen(5000, () => console.log('Server Up and running'));