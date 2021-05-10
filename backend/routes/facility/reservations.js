var mongoose = require('mongoose');
var router = require('express').Router();

//var auth = require('../../helpers/auth');
var throwError = require('../../helpers/throwError');

var Facility = mongoose.model('Facility');
var Customer = mongoose.model('Customer');
var Reservation = mongoose.model('Reservation');

/* Get reservations of a facility
 * permission - facility owner
 * required data - Authentication token
 * optional data on query string
 * - phone, email, customerId, reservationStatus, court, before, after
 * - skip (type: int, skip n results), limit(type: int, show only n rusult)
 * - sortby (type: array of array, ex: [['reservationFrom', -1], ['reservationStatus', 1]])
 * - countOnly (type: boolean) // To get only the counts of reservations 
 */
router.get('/:facilityId',  function(req, res, next) { // remove auth.required
	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();

	// Authorize if user is the admin of the facility
	Facility.findOne({
		_id: req.params.facilityId,
		admin: req.user.id
	}).then(async function(facility) {
		if (!facility) throwError.unauthorized();

		// Initialize object for database query
		var query = {facility: req.params.facilityId};

		// Check optional parameters to apply search filter
		// if customer id present do not look for email and phone
		// else if email and/or phone is present obtain customer id from email and/or phone
		if (req.query.customerId) {
			query.customer = req.query.customerId;
		} else if (req.query.phone || req.query.email) {
			let customerQuery = {};

			if (req.query.phone) customerQuery.phone = req.query.phone;
			if (req.query.email) customerQuery.email = req.query.email;

			await Customer.findOne(customerQuery).then(function(customer) {
				if (!customer) query.customer = null;
				else query.customer = customer._id;
			}).catch(next);
		}

		// filter allowed court if court id is present
		if (req.query.court) {
			if (!regExObjectId.test(req.query.court))
				throwError.validationError('Invalid court id');
			query.courts = req.query.court;
		}

		// Filter reservation status
		if (req.query.reservationStatus)
			query.reservationStatus = req.query.reservationStatus;

		// Filter reservation time
		if (req.query.before) {
			query.reservationFrom = {};
			query.reservationFrom.$lt = req.query.before;
		}
		if (req.query.after) {
			query.reservationFrom = query.reservationFrom ? query.reservationFrom : {};
			query.reservationFrom.$gt = req.query.after;
		}

		// Initialize object for database query options
		var option = {};

		// Starting row
		option.skip = (parseInt(req.query.skip)) ? parseInt(req.query.skip) : 0;

		// No of rows
		option.limit = (parseInt(req.query.limit)) ? parseInt(req.query.limit) : 25;

		// Default sort
		let sort = [];

		// Validate userdata for sorting
		if (typeof(req.query.sortby) == 'object' && req.query.sortby instanceof Array) {
			req.query.sortby.forEach(function(pair) {
				if (typeof(pair) == 'object' && pair instanceof Array) {

					pair[0] = (typeof(pair[0]) == 'string'
							&& ['reservationFrom', 'reservationStatus'] // removed  'noOfPersons' from  ['reservationFrom', 'reservationStatus', 'noOfPersons'] 
							.indexOf(pair[0]) != -1)
						? pair[0]
						: false;

					pair[1] = pair[1] == -1 ? -1 : 1;

					// If valid key value pair
					if (pair[0]) {
						sort.push(pair);
					}
				}
			});
		}

		// If no valid argument for sorting, assign default
		sort = sort.length ? sort : [['reservationFrom', 1]];

		console.log(query)
		console.log(option)
		console.log(sort)

		// To get only the counts
		if (req.query.countOnly) {
			Reservation.countDocuments(query).then(function(count) {
				res.json({count: count});
			}).catch(next);

		// To get the reservations as well as counts
		}else {
			Reservation.find(query, null, option)
			.sort(sort)
			.populate('courts', 'courtIdentifier')
			.then(function(reservations) {
				Reservation.countDocuments(query).then(function(count) {
					console.log(count);
					res.json({reservations: reservations, count: count});
				}).catch(next);
			}).catch(next);
		}
	}).catch(next);
});

module.exports = router;
