var mongoose = require('mongoose');
var router = require('express').Router();

var Coach = mongoose.model('Coach');

/*
 * Get list of all verified coaches : 
 *  public access
 *  no data required
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


/*
 * Create new coach 
 * required data: 
 * 	firstName
 * 	lastName
 *  cin
 *  email
 *  phone
 *  description
 *  price
 *  address
 * 
 * TO-DO : restrict access 
 */
router.post('/', function (req, res, next) { 

        if (!req.body.coach) return res.sendStatus(400);

        var coach = new Coach();

        coach.firstName = req.body.coach.firstName;
        coach.lastName = req.body.coach.lastName;
        coach.cin = req.body.coach.cin;
        coach.email = req.body.coach.email;
        coach.phone = req.body.coach.phone;
        coach.description = req.body.coach.description;
        coach.price = req.body.coach.price;
        coach.address = req.body.coach.address;

        coach.save().then(function () {
            return res.json({ coach: coach.viewJSON() });
        }).catch(next);
});

module.exports = router;
