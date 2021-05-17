var mongoose = require('mongoose');

var Reservation = mongoose.model('Reservation');
var Facility = mongoose.model('Facility');

var config = require('../../config');
var utility = require('../utility');

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


// Check availability of a Court at one instance
var checkAvailability = function (CourtId, facility, date, next, reservationId) {
	console.log('Checking the availability of Court ', CourtId);

	return new Promise(async function (resolve, reject) {

		// Find out if the facility is open or close at that time :
		await Facility.findById(facility, 'businessHours')
			.then(function (data) {
				let businessHours = (data.businessHours[getDay(date)]);
				let time = getTime(date);

				if (time < businessHours.start || time > businessHours.end) {
					// facility is closed, hence court unavailable
					console.log('the facility is closed');
					resolve(false);
				} else {
					
					// Facility is open
					// Search reservations for occupied courts :
					Reservation.find({
						facility: facility,
						_id: { $ne: reservationId },
						reservationFrom: {
							$gt: date - config.defaultReservationDuration,
							$lt: date + config.defaultReservationDuration
						}
					}, 'courts')
						.then(function (reservations) {
							
							if (reservations.map(x => JSON.parse(JSON.stringify(x.courts[0]))).includes(CourtId))
								resolve(false);
							else
								resolve(true);
						}).catch(next);

				}
			}).catch(next);
	});
}

module.exports = checkAvailability;
