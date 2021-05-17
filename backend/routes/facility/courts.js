var mongoose = require('mongoose');
var router = require('express').Router();

//var auth = require('../../helpers/auth');
var listCourts = require('../../helpers/court/listCourts');

var Court = mongoose.model('Court');
var Facility = mongoose.model('Facility');


// Works
/*
 ** required data: none : will list all courts of the facility
 * 
 ** optional data in query string: 
 *	- availability='available' : List available courts 
				   /'unavailable' : List unavailable courts 
				   / 'status' : List all courts and show availability
 *	-	date, in mili-second format. Find out reservation status on this time

 *	-   reservationId // ignore this reservation id while checking availability
 */

 router.get('/:facilityId',  function(req, res, next) { // remove auth.required
	// Check user is admin of the facility or not
	Facility.findOne({
		admin: req.body.user.id,
		_id: req.params.facilityId
	}).then(function(facility) {
		if (!facility) return res.sendStatus(401);

		// Validate query string parameters
		let availability = (typeof(req.body.query.availability) == 'string'
				&& ['available', 'unavailable', 'status'].indexOf(req.body.query.availability) != -1)
			? req.body.query.availability : false;
		
				
		let query = {}
		
		query.reservationId = req.body.query.reservationId;
		query.date = parseInt(req.body.query.date) ? parseInt(req.body.query.date) : (Date.now());

	

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
