/* Add facility owners
 * Do not include this file in the main app

 TODO - database connection configuration

 */

 
var mongoose = require('mongoose');
var config = require('../../config');

var FacilityOwner = require('../../models/FacilityOwner');



// Connect database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }) // Change configurations
.then(function() {
	console.log('\x1b[32m%s\x1b[0m', 'Database Connection Established!');

	var user = new FacilityOwner;

	user.firstName = 'Super';
	user.lastName = 'Admin';
	user.email = 'admin@admin.com';
	user.phone = '1234567890';
	user.setPassword('password');

	user.save().then(function() {
	}).catch(function(err) {console.log(err)});
})
.catch(function(err) {
	console.log('\x1b[31m%s\x1b[0m', 'Error in Database Connection!');
	console.log(err);
});
