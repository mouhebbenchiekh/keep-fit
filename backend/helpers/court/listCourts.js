var mongoose = require('mongoose');

var Court = mongoose.model('Court');
var Reservation = mongoose.model('Reservation');
var Facility = mongoose.model('Facility');

var config = require('../../config');
var utility = require('../utility');

// List courts based on availability
var listCourts = function(availability, facility, query, next) {
	return new Promise(async function(resolve,reject){
		// List all courts
		if (availability == 'all') {
			resolve(await listAllCourts(facility, query))	
		}

		let facilityOpen = undefined;

		// find facility is open or close at the given time
		if (availability != 'all') {
			// Find the facility is open or close at that time
			await Facility.findById(facility, 'businessHours')
			.then(function(data) {
				let businessHours = (data.businessHours[utility.time.getDay(query.date)]);
				let time = utility.time.get(query.date);

				if (time < businessHours.start || time > businessHours.end) {
					facilityOpen = false;
				} else {
					facilityOpen = true;
				}
			}).catch(next);
		}
		console.log('facilityOpen = ', facilityOpen);

		// List when facility is open
		if (facilityOpen)	{	
			// Find the occupied courts with required property of the facility at the given time
			let dbQuery = {};
			dbQuery.facility = facility;

			// Logic for court availability
			dbQuery.ReservationFrom = {
				$gt: query.date - config.defaultReservationDuration,
				$lt: query.date + config.defaultReservationDuration
			}

			// Reservation id to be ignore, usecase: updating reservation
			dbQuery._id = {$ne: query.reservationId}

			Reservation.find(dbQuery, 'courts')
			.populate('courts')
			.then(async function(reservations) {

				// For Unavailable courts
				if (availability == 'unavailable') {

					//return occupied courts with desired keys
					let list = [];
					reservations.forEach(function(booking) {
						list.push(booking.courts[0].viewJSON());
					});

					resolve(list);

				} else if (availability == 'available' || availability == 'status') {

					let allCourts = await listAllCourts(facility, query);

					let occupiedCourts = reservations.map(a => a.courts[0].id);

					// To provide booking status of courts
					if (availability == 'status') {
						let allCourtsWithStatus = allCourts;
						allCourtsWithStatus.map(x => {
							if ((occupiedCourts).includes(JSON.parse(JSON.stringify(x.id)))) {
								x.availability = 'unavailable';
								return x;
							}
							else {
								x.availability = 'available';
								return x;
							}
						});
						
						resolve(allCourtsWithStatus);
					} else {
						// For Available courts

						// Substract the courts ids of occupiedCourts from allCourts
						let availableCourts = allCourts.filter(x =>
							!(occupiedCourts).includes(JSON.parse(JSON.stringify(x.id)))
						);

						resolve(availableCourts);
					}
				}
			}).catch(next);
		}

		// When facility is closed
		if (!facilityOpen)	{	
			if (availability == 'unavailable') {
				// All courts will be unavailable when facility is closed
				resolve(await listAllCourts(facility, query));
			} else if (availability == 'available') {
				// No courts will be available when facility is closed
				resolve([]);
			} else if (availability == 'status') {
				// Provide status information with each court
				let allCourts = await listAllCourts(facility, query);
				allCourts = allCourts.map(x => {
					x.availability = 'unavailable';
					return x;
				});
				resolve(allCourts);
			}
		}
	});
};

// Function to read all courts of a facility
var listAllCourts = function(facility, query) {
	let dbQuery = {};
	dbQuery.facility = facility;
/*
	// Query obj for required court capacity
	if (query.capacity) {
		dbQuery.capacity = query.capacity;
	} else if (query.mincapacity || query.maxcapacity) {
		dbQuery.capacity = {};

		if (query.mincapacity) {
			dbQuery.capacity.$gte = query.mincapacity;
		}
		if (query.maxcapacity) {
			dbQuery.capacity.$lte = query.maxcapacity;
		}
	}
	console.log(dbQuery);
*/
	return new Promise(function(resolve,reject){
		Court.find(dbQuery)
		.then(function(courts) {
			let list = [];
			courts.forEach(function(court) {
				list.push(court.viewJSON());
			});
			resolve(list);
		}).catch(e => reject(e));
	});
}

module.exports = listCourts;
