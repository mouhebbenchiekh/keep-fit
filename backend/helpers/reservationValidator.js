var mongoose = require('mongoose');

var helpers = require('./utility');

var Court = mongoose.model('Court');
var Facility = mongoose.model('Facility');
//var getDay = helpers.time.getDay;   // didn't work i have to copy and past them here
//var getTime = helpers.time.get;

let days = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday'];

let getDay = function (date) {
	x = new Date(date)
	return (days[x.getDay()]);
}

let getTime = function (date) {
	date = new Date(date)
	return (date.getHours() * 100 + date.getMinutes());
}




// Instantiate object to export
var reservationValidator = {};

reservationValidator.businessHours = function (data) {
	var reservationDay = getDay(data.reservationFrom);


	return new Promise(function (resolve, reject) {
		// Check businessHours of the facility
		Facility.findById(data.facility).then(function (facility) {

			console.log('Business hours for the day: ', facility.businessHours[reservationDay], '\nReservation requested at: ', getTime(data.reservationFrom));
			console.log('Too early to make a reservation: ', facility.businessHours[reservationDay].start
				> getTime(data.reservationFrom));
			console.log('Too late to make a reservation: ', facility.businessHours[reservationDay].end
				< getTime(data.reservationFrom));

			if (
				!facility
				|| typeof (facility.businessHours[reservationDay].start)
				=== 'undefined'
				|| typeof (facility.businessHours[reservationDay].end)
				=== 'undefined'
				|| facility.businessHours[reservationDay].start
				> getTime(data.reservationFrom)
				|| facility.businessHours[reservationDay].end
				< getTime(data.reservationFrom)
			) resolve(false);

			resolve(true);
		}).catch(function (err) {
			console.log('Catched Error: ', err);
			resolve(false);
		});
	});
};

module.exports = reservationValidator;
