var mongoose = require('mongoose');
var router = require('express').Router();

//var auth = require('../../helpers/auth');
var listCourts = require('../../helpers/court/listCourts');

var Court = mongoose.model('Court');
var Facility = mongoose.model('Facility');

/*
 * List all courts for particular facilitys
 * required data: none 
 * optional data in query string: 
 *	-	availability='available' / 'unavailable' / 'status'. To filter courts on given date
 *	-	date, in mili-second format. Find out reservation status on this time
 *	- capacity, mincapacity, maxcapacity // Capacity wise filtering for available courts
 *	- reservationId // ignore this reservation id while checking availability
 */
//TODO restrict acess
router.get('/:facilityId', auth.required, function(req, res, next) { // remove auth.required
	// Check user is admin of the facility or not
	Facility.findOne({
		admin: req.user.id,
		_id: req.params.facilityId
	}).then(function(facility) {
		if (!facility) return res.sendStatus(401);

		// Validate query string parameters
		let availability = (typeof(req.query.availability) == 'string'
				&& ['available', 'unavailable', 'status'].indexOf(req.query.availability) != -1)
			? req.query.availability : false;

		let query = {}
		query.reservationId = req.query.reservationId;
		query.date = parseInt(req.query.date) ? parseInt(req.query.date) : (Date.now());
		//query.capacity = parseInt(req.query.capacity) ? parseInt(req.query.capacity) : null;
		//query.maxcapacity = parseInt(req.query.maxcapacity) ? parseInt(req.query.maxcapacity) : null;
		//query.mincapacity = parseInt(req.query.mincapacity) ? parseInt(req.query.mincapacity) : 0;

		if (!availability) {
			// Return all courts
			listCourts('all', req.params.facilityId, query, next)
			.then(function(list) {
				return res.json({courts: list});
			}).catch(next);
		} else {
			listCourts(availability, req.params.facilityId, query, next)
			.then(function(list) {
				return res.json({courts: list});
			}).catch(next);
		}
	}).catch(next)
});

module.exports = router;
