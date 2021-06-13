var mongoose = require('mongoose');
var router = require('express').Router();

var Facility = mongoose.model('Facility');

// WORKS
/*
 * Get list of all verified facilitys : 
   public access
   no data required
 */
router.get('/', function (req, res, next) {
	var query = { verified: true };

	if (req.query.facilityid)
		query._id = req.query.facilityid;

	Facility.find(query).then(function (facilitys) {
		if (!facilitys.length) return res.sendStatus(404);

		let list = []

		facilitys.forEach(function (facility) {
			list.push(facility.viewJSON());
		});

		return res.json({ facilitys: list });
	}).catch(next);
});

module.exports = router;
