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


// Middlewares :
app.use(express.json());

// Route Middlewares :
app.use('/api/user', authRoute);
app.use('/api/private', privateRoute);


app.listen(3000, () => console.log('Server Up and running'));