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

// WORKS : 
/* 
 * Get reservation by reservation id
 * permission - facility owner
 * required data - facility owner
 */
router.get('/:facilityId/:reservationId', function (req, res, next) {
	console.log('Getting reservation..');
	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();
	if (!regExObjectId.test(req.params.reservationId)) return next();

	// Authorize if user is the admin of the facility
	Facility.findOne({
		_id: req.params.facilityId,
		admin: req.body.user.id
	}).then(function (facility) {
		if (!facility) res.sendStatus(401);

		Reservation.findById(req.params.reservationId).then(function (reservation) {
			// Unauthorize if the facility is different
			if (!reservation || reservation.facility != req.params.facilityId)
				return res.sendStatus(401);

			return res.json({ reservation: reservation.toFacilityOwnerJSON() });
		}).catch(next);
	}).catch(next);
});


// Works : but i need to add the update on reservationStatus
/* 
 * Update reservation
 * permission - facility owner
 * required data - facility owner
 * 
 * optional data :
 *	-  reservationFrom, reservationStatus, court (objectId),           
 */
router.put('/:facilityId/:reservationId', function (req, res, next) {

	console.log('\nProcessing request: ');

	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();
	if (!regExObjectId.test(req.params.reservationId)) return next();

	// Authorize if user is the owner of the facility
	Facility.findOne({
		_id: req.params.facilityId,
		admin: req.body.user.id
	}).then(function (facility) {
		if (!facility) res.sendStatus(401);

		Reservation.findById(req.params.reservationId).then(function (reservation) {
			// Unauthorize if the reservation facility is different
			if (!reservation || reservation.facility != req.params.facilityId)
				return res.sendStatus(401);

			var payload = req.body.reservation;
			if (!payload) return res.sendStatus(400);

			// Validate input
			var regExObjectId = /^[a-f\d]{24}$/i;


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
			reservationValidator.businessHours(payload).then(async function (valid) {
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
						throwError.validationError('Court is not available');

					court = payload.court;
				} else {
					court = await findAvailableCourt(payload, next);

					if (!court) throwError.validationError('Court is not available');
				}

				// Update database

				reservation.reservationFrom = payload.reservationFrom;
				reservation.courts = court;  //reservation.courts = court;

				reservation.save()
					.then(function () {
						Reservation.populate(reservation, { path: 'courts' }).then(function () {
							return res.json({ reservation: reservation.toFacilityOwnerJSON() });
						});
					}).catch(next);
			}).catch(next);
		}).catch(next);
	}).catch(next);
});


// the example WORKS but needs more testing + may cause problems in other routes (need to re-test them) 
/* 
 * Create new reservation
 * permission - facility owner
 * required data - facility owner id, user: {phone}, reservation: {reservationFrom}     
 * optional data
 *	-	user: {name, email} (optional data required in case of new customer)
 *	-	court (type: ObjectId)
 */
//to fix verification if it's already taken
router.post('/:facilityId', function (req, res, next) {
	console.log('\nProcessing reservation request: ');

	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();

	// Authorize if user is the owner of the facility
	Facility.findOne({
		_id: req.params.facilityId,
		admin: req.body.user.id   // facility owner
	}).then(function (facility) {
		if (!facility) res.sendStatus(401);

		// Obtain customer id by phone or email
		let customerQuery = {};
		if (req.body.userC && req.body.userC.phone) customerQuery.phone = req.body.userC.phone;
		else if (req.body.userC && req.body.userC.email) customerQuery.email = req.body.userC.email;
		else throwError.validationError(' provide phone number or email');

		console.log(customerQuery);

		Customer.findOne(customerQuery).then(function (customer) {
			// If phone or email is not present in customer database
			if (!customer) throwError.userNotFound();

			let payload = req.body.reservation;

			// Validate input
			if (!payload)
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
				.then(async function (valid) {
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
					reservation.reservationFrom = payload.reservationFrom;
					reservation.courts = court;
					reservation.court = court; // when i added this the court id was added to the reservation i don't know why

					reservation.save()
						.then(function () {
							Reservation.populate(reservation, { path: 'courts' }).then(function () {
								return res.json({ reservation: reservation.toFacilityOwnerJSON() });
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
router.put('/:facilityId/:reservationId/status', function (req, res, next) {  //remove auth.required
	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();
	if (!regExObjectId.test(req.params.reservationId)) return next();

	// Authorize if user is the admin of the facility
	Facility.findOne({
		_id: req.params.facilityId,
		admin: req.user.id
	}).then(function (facility) {
		if (!facility) res.sendStatus(401);

		Reservation.findById(req.params.reservationId).then(function (reservation) {
			// Unauthorize if the reservation facility is different
			if (!reservation || reservation.facility != req.params.facilityId)
				return res.sendStatus(401);

			if (!req.body.reservation || !req.body.reservation.reservationStatus)
				return res.sendStatus(400);

			reservation.reservationStatus = req.body.reservation.reservationStatus;

			reservation.save().then(function (updatedReservation) {
				return res.json({ reservation: updatedReservation.toFacilityOwnerJSON() });
			}).catch(next);
		}).catch(next);
	}).catch(next);
});

module.exports = router;
