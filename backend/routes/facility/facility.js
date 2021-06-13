var mongoose = require('mongoose');
var router = require('express').Router();

//var auth = require('../../helpers/auth');

var Facility = mongoose.model('Facility');
var FacilityOwner = mongoose.model('FacilityOwner');

// WORKS
/*
 * Create new facility by facility owner
 * required data: 
 * 	facility owner id
 * 	facility address
 *  description
 *  business hours
 */
router.post('/', function (req, res, next) {
	FacilityOwner.findById(req.body.user.id).then(function (facilityOwner) {
		if (!facilityOwner) return res.sendStatus(401);

		if (!req.body.facility) return res.sendStatus(400);

		var facility = new Facility();

		facility.admin = req.body.user.id;
		facility.name = req.body.facility.name;
		facility.address = req.body.facility.address;
		facility.description = req.body.facility.description;
		facility.businessHours = req.body.facility.businessHours;

		facility.save().then(function () {
			return res.json({ facility: facility.viewByOwnerJSON() });
		}).catch(next);
	}).catch(next);
});


// WORKS
/*
 * Get facilities owned by facilityOwner
 * required data: 
 * 	facility owner id 
 */
router.get('/', function (req, res, next) {

	FacilityOwner.findById(req.body.user.id).then(function (facilityOwner) {
		if (!facilityOwner) return res.sendStatus(401);

		Facility.find({ admin: req.body.user.id }).then(function (facilitys) {
			var facilitysDetails = [];
			facilitys.forEach(function (facility) {
				facilitysDetails.push(facility.viewByOwnerJSON());
			});

			return res.json({ facilitys: facilitysDetails });
		}).catch(next);
	}).catch(next);
});



// WORKS

/*
 * Update facility details
 *  required data: 
 * 		facility owner id
 * 		facility address
 *  	description
 *  	business hours
 */

router.put('/', function (req, res, next) {
	FacilityOwner.findById(req.body.user.id).then(function (facilityOwner) {
		if (!facilityOwner) return res.sendStatus(401);

		let data = req.body.facility;
		if (!data || !(data.name || data.address || data.description || data.businessHours)) {
			return res.status(400).json({ errors: 'Provide data to update' });
		}

		Facility.findOne({
			admin: req.body.user.id,
			_id: req.body.facility.id
		}).then(function (facility) {
			if (!facility) return res.sendStatus(401);

			// Update fields that were passed
			if (typeof data.name !== 'undefined')
				facility.name = data.name;
			if (typeof data.address !== 'undefined')
				facility.address = data.address;
			if (typeof data.description !== 'undefined')
				facility.description = data.description;
			if (typeof data.businessHours !== 'undefined')
				facility.businessHours = data.businessHours;

			facility.save().then(function () {
				return res.json({ facility: facility.viewByOwnerJSON() });
			}).catch(next);
		}).catch(next);
	}).catch(next);
});

module.exports = router;
