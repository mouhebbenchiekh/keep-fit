var mongoose = require('mongoose');
var router = require('express').Router();

var Event = mongoose.model('Event');
var EventOwner = mongoose.model('EventOwner');


//works
/*
 * Get list of all verified events : 
   public access
   no data required
 */
router.get('/events', function (req, res, next) {
    var query = { verified: true };

    if (req.query.eventid)
        query._id = req.query.eventid;

    Event.find(query).then(function (events) {
        if (!events.length) return res.sendStatus(404);

        let list = []

        events.forEach(function (event) {
            list.push(event.viewJSON());
        });

        return res.json({ events: list });
    }).catch(next);
});


// --------------------------------------------------------------------------
// works
/*
 * Create new event by event owner
 * required data: 
 * 	event owner id
 * 	event address
 *  description
 *  time  
 *  price
 *  coordinates
 *  activities
 *  
 */
router.post('/', function (req, res, next) { // remove auth.required
    EventOwner.findById(req.body.user.id).then(function (eventOwner) {
        if (!eventOwner) return res.sendStatus(401);

        if (!req.body.event) return res.sendStatus(400);

        var event = new Event();

        event.admin = req.body.user.id;
        event.name = req.body.event.name;
        event.address = req.body.event.address;
        event.description = req.body.event.description;
        event.time = req.body.event.time;

        event.price = req.body.event.price;
        event.coordinates = req.body.event.coordinates;
        event.activities = req.body.event.activities;

        event.save().then(function () {
            return res.json({ event: event.viewByOwnerJSON() });
        }).catch(next);
    }).catch(next);
});


// works :
/*
 * Get events owned by eventOwner
 * required data: 
 * event owner id 
 */
router.get('/', function (req, res, next) {

    EventOwner.findById(req.body.user.id).then(function (eventOwner) {
        if (!eventOwner) return res.sendStatus(401);

        Event.find({ admin: req.body.user.id }).then(function (events) {
            var eventsDetails = [];
            events.forEach(function (event) {
                eventsDetails.push(event.viewByOwnerJSON());
            });

            return res.json({ events: eventsDetails });
        }).catch(next);
    }).catch(next);
});

//works :
/*
 * Update event details
 *  required data: 
 * 		event owner id
 * 		event address
 *  	description
 *  	time
 * 
 *      price
 *      coordinates
 *      activities
 */

router.put('/', function (req, res, next) {
    EventOwner.findById(req.body.user.id).then(function (eventOwner) {
        if (!eventOwner) return res.sendStatus(401);

        let data = req.body.event;
        if (!data || !(data.name || data.address || data.description || data.time || data.price || data.coordinates || data.activities)) {
            return res.status(400).json({ errors: 'Provide data to update' });
        }

        Event.findOne({
            admin: req.body.user.id,
            _id: req.body.event.id
        }).then(function (event) {
            if (!event) return res.sendStatus(401);

            // Update fields that were passed
            if (typeof data.name !== 'undefined')
                event.name = data.name;
            if (typeof data.address !== 'undefined')
                event.address = data.address;
            if (typeof data.description !== 'undefined')
                event.description = data.description;
            if (typeof data.time !== 'undefined')
                event.time = data.time;


            if (typeof data.price !== 'undefined')
                event.price = data.price;
            if (typeof data.coordinates !== 'undefined')
                event.coordinates = data.coordinates;
            if (typeof data.activities !== 'undefined')
                event.activities = data.activities;
            
            event.save().then(function () {
                return res.json({ event: event.viewByOwnerJSON() });
            }).catch(next);
        }).catch(next);
    }).catch(next);
});



module.exports = router;
