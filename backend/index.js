// Dependencies
var express = require('express');
var	mongoose = require('mongoose');
var bodyParser = require('body-parser');

var config = require('./config');
const dotenv = require('dotenv');

dotenv.config();

// Database models
var FacilityOwner = require('./models/FacilityOwner');
var Customer = require('./models/Customer');
var Facility = require('./models/Facility');
var Court = require('./models/Court');
var Reservation = require('./models/Reservation');

var app = express();

// Middlewares


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));



// Connect database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
.then(function() {
	console.log('\x1b[32m%s\x1b[0m', 'Database Connection Established!');
	app.emit('databaseReady');
})
.catch(function(err) {
	console.log('\x1b[31m%s\x1b[0m', 'Error in Database Connection!');
	console.log(err);
});

// API endpoints
app.use(require('./routes'));

// Catch 404 and forward to error handler

app.use(function(req, res, next) {
	var err = new Error('Not found');
	err.status = 404;
	next(err);
});


// Start the server when database ready
app.on('databaseReady', function() {
	var server = app.listen(config.port, function(err, a) {
		console.log('\x1b[32m%s\x1b[0m', 'Listening on port ' + server.address().port);
	}).on('error',function(err){
		console.log('\x1b[31m%s\x1b[0m', 'Error occured while creating server');
		console.log(err);
	});
});















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
*/