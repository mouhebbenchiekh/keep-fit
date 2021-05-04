var mongoose = require('mongoose');

var Court = mongoose.model('Court');
var Reservation = mongoose.model('Reservation');

var config = require('../../config');
var throwError = require('../throwError');

var findAvailbleCourt = function(payload, next) {
	return new Promise(function(resolve,reject){
		// Find the occupied courts of the facility at the given time
		Reservation.find(
			{
				'facility': payload.facility,
				'reservationFrom': {
					$gt: payload.reservationgFrom - config.defaultReservationDuration,
					$lt: payload.reservationgFrom + config.defaultReservationDuration
				},
				_id: {
					$ne: payload.id
				}
			},
			'courts'
		).then(function(occupiedCourts) {
			console.log('occupied Courts : ', occupiedCourts);

			// Find all the Courts of the facility 
			Court.find(
				{
					'facility': payload.facility,
				},
				'_id'              
			).then(function(allCourts) {
				console.log('All Courts: ', allCourts);
				if (!allCourts.length) throwError.noTable('Court not available');

				// Find the Courts which does not have bookings at the time
				// Substract the courts ids of occupiedCourts from allCourts
				let availableCourts = allCourts.filter(x =>
					!(JSON.parse(JSON.stringify(occupiedCourts.map(a => a.courts[0])))
					.includes(JSON.parse(JSON.stringify(x._id)))));

				if (!availableCourts.length) throwError.noTable('Court not available');
				console.log('Available courts', availableCourts);

				let len = availableCourts.length;
				let court = '';

				court = availableCourts[len]._id;		
				
				console.log('Selected court: ', court)
				return resolve(court);
			}).catch(next);
		}).catch(next);
	});
};

module.exports = findAvailableCourt;
