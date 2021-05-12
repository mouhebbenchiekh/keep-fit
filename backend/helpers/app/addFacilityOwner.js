/* Add facility owners
 * Do not include this file in the main app

 TODO - database connection configuration

 */


var mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

var FacilityOwner = require('../../models/FacilityOwner');




// Connect database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }) // Change configurations
	.then(function () {
		console.log('\x1b[32m%s\x1b[0m', 'Database Connection Established!');

		var user = new FacilityOwner;

		user.firstName = 'Super2';
		user.lastName = 'Admin2';
		user.cin = '11111111';
		user.email = 'admin2@admin.com';
		user.phone = '22018181';
		//user.setPassword('password'); don't use this function for now : you need to add methods in the facilityowner in order to use
		user.password = 'testpassword';
		user.save().then(function () {
		}).catch(function (err) { console.log(err) });
	})
	.catch(function (err) {
		console.log('\x1b[31m%s\x1b[0m', 'Error in Database Connection!');
		console.log(err);
	});
