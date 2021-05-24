var mongoose = require('mongoose');
var router = require('express').Router();

var Coach = mongoose.model('Coach');

/*
 * Get list of all verified coachs : 
   public access
   no data required
 */

 router.get('/', function(req, res, next) {
	var query = {verified: true};

	if (req.query.coachid) 
		query._id = req.query.coachid;

	Coach.find(query).then(function(coachs) {
		if (!coachs.length) return res.sendStatus(404);

		let list = []

		coachs.forEach(function(coach) {
			list.push(coach.viewJSON());
		});

		return res.json({coachs: list});
	}).catch(next);
});

// ----------------------------------------------------------------------------------


/*
 * Update coach details

 */



module.exports = router;
