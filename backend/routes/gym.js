var mongoose = require('mongoose');
var router = require('express').Router();

var Gym = mongoose.model('Gym');
var GymOwner = mongoose.model('GymOwner');



// WORKS
/*
 * Get list of all verified gyms : 
   public access
   no data required
 */
router.get('/', function (req, res, next) {
    var query = { verified: true };

    if (req.query.gymid)
        query._id = req.query.gymid;

    Gym.find(query).then(function (gyms) {
        if (!gyms.length) return res.sendStatus(404);

        let list = []

        gyms.forEach(function (gym) {
            list.push(gym.viewJSON());
        });

        return res.json({ gyms: list });
    }).catch(next);
});


// --------------------------------------------------------------------------

/*
 * Create new gym by gym owner
 * required data: 
 * 	gym owner id
 * 	gym address
 *  description
 *  business hours
 * 
 *  price
 *  coordinates
 *  activities
 */
router.post('/', function (req, res, next) { // remove auth.required
    GymOwner.findById(req.body.user.id).then(function (gymOwner) {
        if (!gymOwner) return res.sendStatus(401);

        if (!req.body.gym) return res.sendStatus(400);

        var gym = new Gym();

        gym.admin = req.body.user.id;
        gym.name = req.body.gym.name;
        gym.address = req.body.gym.address;
        gym.description = req.body.gym.description;
        //	gym.setBusinessHours(req.body.gym.businessHours);   // didn't work ??
        gym.businessHours = req.body.gym.businessHours;

        gym.price = req.body.gym.price;
        gym.coordinates = req.body.gym.coordinates;
        gym.activities = req.body.gym.activities;

        gym.save().then(function () {
            return res.json({ gym: gym.viewByOwnerJSON() });
        }).catch(next);
    }).catch(next);
});



/*
 * Get gyms owned by gymOwner
 * required data: 
 * gym owner id 
 */
router.get('/', function (req, res, next) {

    GymOwner.findById(req.body.user.id).then(function (gymOwner) {
        if (!gymOwner) return res.sendStatus(401);

        Gym.find({ admin: req.body.user.id }).then(function (gyms) {
            var gymsDetails = [];
            gyms.forEach(function (gym) {
                gymsDetails.push(gym.viewByOwnerJSON());
            });

            return res.json({ gyms: gymsDetails });
        }).catch(next);
    }).catch(next);
});


/*
 * Update gym details
 *  required data: 
 * 		gym owner id
 * 		gym address
 *  	description
 *  	business hours
 * 
 *      price
 *      coordinates
 *      activities
 */

router.put('/', function (req, res, next) {
    GymOwner.findById(req.body.user.id).then(function (gymOwner) {
        if (!gymOwner) return res.sendStatus(401);

        let data = req.body.gym;
        if (!data || !(data.name || data.address || data.description || data.businessHours || data.price || data.coordinates || data.activities)) {
            return res.status(400).json({ errors: 'Provide data to update' });
        }

        Gym.findOne({
            admin: req.body.user.id,
            _id: req.body.gym.id
        }).then(function (gym) {
            if (!gym) return res.sendStatus(401);

            // Update fields that were passed
            if (typeof data.name !== 'undefined')
                gym.name = data.name;
            if (typeof data.address !== 'undefined')
                gym.address = data.address;
            if (typeof data.description !== 'undefined')
                gym.description = data.description;
            if (typeof data.businessHours !== 'undefined')
                gym.businessHours = data.businessHours;


            if (typeof data.price !== 'undefined')
                gym.price = data.price;
            if (typeof data.coordinates !== 'undefined')
                gym.coordinates = data.coordinates;
            if (typeof data.activities !== 'undefined')
                gym.activities = data.activities;
            
            gym.save().then(function () {
                return res.json({ gym: gym.viewByOwnerJSON() });
            }).catch(next);
        }).catch(next);
    }).catch(next);
});



module.exports = router;
