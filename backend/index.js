const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

var bodyParser = require('body-parser');



// Import Routes :
const authRoute = require('./routes/auth');
const privateRoute = require('./routes/privateRoute');



dotenv.config();
var config = require('./config');


// Database models
var FacilityOwner = require('./models/FacilityOwner');
var Customer = require('./models/Customer');
var Facility = require('./models/Facility');
var Court = require('./models/Court');
var Reservation = require('./models/Reservation');



// Connect to DB :
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true})
.then(function() {
	console.log('\x1b[32m%s\x1b[0m', 'Database Connection Established!');
})
.catch(function(err) {
	console.log('\x1b[31m%s\x1b[0m', 'Error in Database Connection!');
	console.log(err);
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not found');
	err.status = 404;
	next(err);
});


// Middlewares :
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
    res.header("Access-Control-Allow-methods", "POST, GET, PUT, DELETE");
    next();
  });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

// Route Middlewares :
app.use('/api/user', authRoute);
app.use('/api/private', privateRoute);

app.use(require('./routes'));

app.listen(5000, () => console.log('Server Up and running'));



















/*
// Before adding the reservation :
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


app.listen(5000, () => console.log('Server Up and running'));
*/