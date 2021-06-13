/* 
 * Add Gym owners
 * Do not include this file in the main app
 */

var mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

var GymOwner = require('../../models/GymOwner');

// Connect database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }) 
	.then(function () {
		console.log('\x1b[32m%s\x1b[0m', 'Database Connection Established!');

		var user = new GymOwner;

		user.firstName = 'gymowner firstname';
		user.lastName = 'gymowner lastname';
		user.cin = '14767162';
		user.email = 'gymowner123@gmail.com';
		user.phone = '22018181';
		user.password = 'testpassword';
		user.save().then(function () {
		}).catch(function (err) { console.log(err) });
	})
	.catch(function (err) {
		console.log('\x1b[31m%s\x1b[0m', 'Error in Database Connection!');
		console.log(err);
	});
