// without auth for now

var mongoose = require('mongoose');
var router = require('express').Router();

var Court = mongoose.model('Court');
var Facility = mongoose.model('Facility');
var FacilityOwner = mongoose.model('FacilityOwner');

//get court by its id 

router.get('/:id',(req,res,next)=>{
	Court.findById(req.params.id).then(
		
		court=>{
			if(!court) return res.sendStatus(404);
			
			return res.send(court.viewJSON());
		}
	).catch(next)

})

// WORKS
/*
 * Add court(s) to their facility by facilityOwner
 * required data: 
 * 	facility.id
 *  court(s),
 * 
 * optional data: 
 * 	description
 */
router.post('/:facilityId', function (req, res, next) { // removed auth.required,
	// if regEx of params do not match procceed to next function
	var regExObjectId = /^[a-f\d]{24}$/i;
	if (!regExObjectId.test(req.params.facilityId)) return next();
	FacilityOwner.findById(req.body.user.id).then(function (facilityOwner) {
		if (!facilityOwner) return res.sendStatus(401);

		if (!req.body.courts || !(req.body.courts instanceof Array))
			return res.sendStatus(400);

		Facility.findOne({
			admin: req.body.user.id,
			_id: req.params.facilityId
		}).then(function (facility) {
			if (!facility) return res.sendStatus(401);

			// instantiate empty array to be written into database
			let courts = [];

			// Grep only required data from req.body 
			req.body.courts.forEach(function (court) {
				if (!(court instanceof Object)) {
					var err = new Error('Invalid input');
					err.name = 'ValidationError';
					throw err;

				}

				let data = {
					facility: req.params.facilityId,
					courtIdentifier: court.courtIdentifier,
					description: court.description
				};

				courts.push(data);
				console.log(courts);
			});

			Court.insertMany(courts).then(function (courts) {
				let list = [];

				courts.forEach(function (court) {
					list.push(court.viewJSON());
				});

				return res.json({ courts: list });
			}).catch(next);
		}).catch(next);
	}).catch(next);
});

// WORKS
/*
 * Return data of a court of a particular facility
 */
router.get('/:facilityId/:courtId', function (req, res, next) {
	// Check user is admin of the facility or not
	Facility.findOne({
		admin: { "$all": req.body.user.id },
		_id: req.params.facilityId
	}).then(function (facility) {
		if (!facility) return res.sendStatus(401);

		Court.findById(req.params.courtId).then(function (court) {
			return res.json({ court: court.viewJSON() });
		}).catch(next);
	}).catch(next)
});



// Works 
/*
 * Update single court info by facilityOwner
 * required data: facilityOwner id, court.id
 * optional data: courtIdentifier, description
 */
router.put('/', function (req, res, next) {    // remove auth.required
	FacilityOwner.findById(req.body.user.id).then(function (facilityOwner) {
		if (!facilityOwner) return res.sendStatus(401);

		let data = req.body.court;
		if (!data || !data.id || !(data.courtIdentifier || data.description))
			return res.sendStatus(400);

		// find the court id is valid
		Court.findById(data.id).then(function (court) {
			if (!court) return res.sendStatus(401);

			// check the court belongs to a facility and user is admin
			Facility.findOne({
				_id: court.facility,
				admin: req.body.user.id
			}).then(function (facility) {
				if (!facility) return res.sendStatus(401);

				// Update the field that were passed
				if (typeof data.courtIdentifier !== 'undefined')
					court.courtIdentifier = data.courtIdentifier;

				if (typeof data.description !== 'undefined')
					court.description = data.description;

				court.save().then(function () {
					return res.json({ court: court.viewJSON() });
				}).catch(next);
			}).catch(next);
		}).catch(next);
	}).catch(next);
});

module.exports = router;
