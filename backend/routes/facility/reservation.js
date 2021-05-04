var mongoose = require('mongoose');
var router = require('express').Router();

//var auth = require('../../helpers/auth');
var throwError = require('../../helpers/throwError');
var reservationValidator = require('../../helpers/reservationValidator');
var findAvailableCourt = require('../../helpers/court/findAvailableCourt');
var checkAvailability = require('../../helpers/court/checkAvailability');
var config = require('../../config');

var Facility = mongoose.model('Facility');
var Customer = mongoose.model('Customer');
var Reservation = mongoose.model('Reservation');
var Court = mongoose.model('Court');

/* 
 * Get reservation by reservation id
 * permission - facility owner
 * required data - Authentication token
 */ 
router.get('/:facilityId/:reservationId',  function(req, res, next) {
	console.log('Getting reservation..');
	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();
	if (!regExObjectId.test(req.params.reservationId)) return next();

	// Authorize if user is the admin of the facility
	Facility.findOne({
		_id: req.params.facilityId,
		admin: req.user.id
	}).then(function(facility) {
		if (!facility) res.sendStatus(401);

		Reservation.findById(req.params.reservationId).then(function(reservation) {
			// Unauthorize if the reservation facility is different
			if (!reservation || reservation.facility != req.params.facilityId)
				return res.sendStatus(401);

			return res.json({reservation: reservation.toFacilityeurJSON()});
		}).catch(next);
	}).catch(next);
});

/* 
 * Update reservation
 * permission - facility owner
 * required data - Authentication token
 * optional data
 *	-  reservationFrom, reservationStatus, court (objectId),           removed : noOfPersons,
 */ 
router.put('/:facilityId/:reservationId',  function(req, res, next) {  // remove auth.required
	console.log('\nProcessing updation request: ');
	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();
	if (!regExObjectId.test(req.params.reservationId)) return next();

	// Authorize if user is the admin of the facility
	Facility.findOne({
		_id: req.params.facilityId,
		admin: req.user.id
	}).then(function(facility) {
		if (!facility) res.sendStatus(401);

		Reservation.findById(req.params.reservationId).then(function(reservation) {
			// Unauthorize if the reservation facility is different
			if (!reservation || reservation.facility != req.params.facilityId)
				return res.sendStatus(401);

			var payload = req.body.reservation;
			if (!payload) return res.sendStatus(400);

			// Validate input
			var regExObjectId = /^[a-f\d]{24}$/i;
			
			/*if (!(payload.noOfPersons = parseInt(payload.noOfPersons))
				|| payload.noOfPersons <= 0)
				throwError.validationError('Invalid number of persons');*/

			if (payload.court && !regExObjectId.test(payload.court)) {
				throwError.validationError('Invalid court');
			}

			if (new Date(parseInt(payload.reservationFrom)) == 'Invalid Date')
				throwError.validationError();

			payload.reservationFrom = (parseInt(payload.reservationFrom));
			if (payload.reservationFrom < Date.now())
				throwError.validationError();

			// Add facility id and reservation id to payload
			payload.facility = reservation.facility;
			payload.id = reservation._id;
			console.log(payload);

			// Validate reservation time with business hours
			reservationValidator.businessHours(payload).then(async function(valid) {
				if (!valid) throwError.validationError('Facility will be closed at that time');

				let court = null;
				
				// Manual court selection
				if (payload.court) {
					let available = await checkAvailability(
						payload.court,
						req.params.facilityId,
						payload.reservationFrom,
						next,
						payload.id
					);

					if (!available)
						throwError.validationError('Court not available');

					court = payload.court;
				} else {
					court = await findAvailableCourt(payload, next);
				
					if (!court)	throwError.validationError('Court not available');
				}

				// Update database
				//reservation.noOfPersons = payload.noOfPersons;
				reservation.reservationFrom = payload.reservationFrom;
				reservation.courts = court;

				reservation.save()
				.then(function() {
					Reservation.populate(reservation, {path: 'courts'}).then(function() {
						return res.json({reservation: reservation.toFacilityOwnerJSON()});
					});
				}).catch(next);
			}).catch(next);
		}).catch(next);
	}).catch(next);
});

/* 
 * Create new reservation
 * permission - facility owner
 * required data - Authentication token, user: {phone}, reservation: {reservationFrom, noOfPersons}       // remove noOfPersons !!!
 * optional data
 *	-	user: {name, email} (optional data required in case of new customer)
 *	-	court (type: ObjectId)
 */ 
router.post('/:facilityId',  function(req, res, next) {  // remove auth.required
	console.log('\nProcessing reservation request: ');
	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();

	// Authorize if user is the admin of the facility
	Facility.findOne({
		_id: req.params.facilityId,
		admin: req.user.id
	}).then(function(facility) {
		if (!facility) res.sendStatus(401);

		// Obtain customer id by phone or email
		let customerQuery = {};
		if (req.body.user && req.body.user.phone) customerQuery.phone = req.body.user.phone;
		else if (req.body.user && req.body.user.email) customerQuery.email = req.body.user.email;
		else throwError.validationError(' provide phone number or email');

		console.log(customerQuery);
		Customer.findOne(customerQuery).then(function(customer) {
			// If phone or email is not present in customer database
			if (!customer) throwError.userNotFound();

			let payload = req.body.reservation;

			// Validate input
			if (!payload)
			//	|| !(payload.noOfPersons = parseInt(payload.noOfPersons))
			//	|| req.body.reservation.noOfPersons <= 0)
				throwError.validationError();

			if (new Date(parseInt(payload.reservationFrom)) == 'Invalid Date')
				throwError.validationError('Invalid date');

			payload.reservationFrom = (parseInt(payload.reservationFrom));
			if (payload.reservationFrom < Date.now())
				throwError.validationError('Invalid date');

			// Add facility id to payload
			payload.facility = req.params.facilityId;

			// Validate reservation time with business hours
			reservationValidator.businessHours(payload)
			.then(async function(valid) {
				if (!valid) throwError.validationError('Facility will be closed at that time');

				let court = null;

				// Manual court selection
				if (payload.court) {
					let available = await checkAvailability(
						payload.court,
						req.params.facilityId,
						payload.reservationFrom,
						next
					);

					if (!available)
						throwError.validationError('Court not available');

					court = payload.court;
				} else {
					court = await findAvailableCourt(payload, next);

					if (!court) {
						throwError.validationError('Court not available');
					}
				}

				// Update database
				var reservation = new Reservation;

				console.log('customer: ', customer);
				reservation.customer = customer._id;
				reservation.facility = payload.facility;
			//	reservation.noOfPersons = payload.noOfPersons;
				reservation.reservationFrom = payload.reservationFrom;
				reservation.courts = court;

				reservation.save()
				.then(function() {
					Reservation.populate(reservation, {path: 'courts'}).then(function() {
						return res.json({reservation: reservation.toFacilityeurJSON()});
					});
				}).catch(next);
			}).catch(next);
		}).catch(next);
	}).catch(next);
});

/*
 * Change reservation status - confirm reservation/ cancel reservation
 * permission - facility owner
 * required data - Authentication token, reservationStatus
 */
router.put('/:facilityId/:reservationId/status', function(req, res, next) {  //remove auth.required
	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();
	if (!regExObjectId.test(req.params.reservationId)) return next();

	// Authorize if user is the admin of the facility
	Facility.findOne({
		_id: req.params.facilityId,
		admin: req.user.id
	}).then(function(facility) {
		if (!facility) res.sendStatus(401);

		Reservation.findById(req.params.reservationId).then(function(reservation) {
			// Unauthorize if the reservation facility is different
			if (!reservation || reservation.facility != req.params.facilityId)
				return res.sendStatus(401);

			if (!req.body.reservation || !req.body.reservation.reservationStatus)
				return res.sendStatus(400);

			reservation.reservationStatus = req.body.reservation.reservationStatus;

			reservation.save().then(function(updatedReservation) {
				return res.json({reservation: updatedReservation.toFacilityeurJSON()});
			}).catch(next);
		}).catch(next);
	}).catch(next);
});

module.exports = router;
