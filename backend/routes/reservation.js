var mongoose = require('mongoose');
var router = require('express').Router();

//var auth = require('../helpers/auth');
var config = require('../config');
var throwError = require('../helpers/throwError');
var reservationValidator = require('../helpers/reservationValidator');

var Reservation = mongoose.model('Reservation');
var Court = mongoose.model('Court');
var Customer = mongoose.model('Customer');
var Facility = mongoose.model('Facility');

/*
 * Create a new reservation by logged-id customer
 * Required data: token, facility, reservationFrom   
 */
router.post('/', function (req, res, next) { // remove auth.required
    Customer.findById(req.user.id).then(function (customer) {
        if (!customer) return res.sendStatus(401);

        if (!req.body.reservation) return res.sendStatus(400);
        var payload = req.body.reservation;

        // Validate input
        var regExObjectId = /^[a-f\d]{24}$/i;
        if (!regExObjectId.test(payload.facility))
            throwError.validationError();

        if (payload.reservationFrom < Date.now())
            throwError.validationError();

        // Validate facility id. Only allow verified facility
        Facility.findById(payload.facility)
            .then(function (facility) {
                if (!facility || !facility.verified)
                    throwError.validationError('Invalid facility');

                // Validate reservation time with business hours
                reservationValidator.businessHours(payload).then(function (valid) {
                    if (!valid) throwError.validationError('Facility will be closed at that time');

                    // Find the courts which have reservations during the time
                    Reservation.find(
                        {
                            'facility': payload.facility,
                            'reservationFrom': {
                                $gt: payload.reservationFrom - config.defaultReservationDuration,
                                $lt: payload.reservationFrom + config.defaultReservationDuration
                            }
                        },
                        'courts'
                    ).then(function (occupiedCourts) {
                        console.log('Occupied courts: ', occupiedCourts);

                        // Find all the courts of the facility 
                        Court.find(
                            {
                                'facility': payload.facility
                            },
                            '_id'
                        ).then(function (allCourts) {
                            console.log('All courts: ', allCourts);
                            if (!allCourts.length) throwError.noCourt('Court not available');

                            // Find the courts which does not have reservations at the time
                            // Substract the courts ids of occupiedCourts from allCourts
                            let availableCourts = allCourts.filter(x =>
                                !(JSON.parse(JSON.stringify(occupiedCourts.map(a => a.courts[0])))
                                    .includes(JSON.parse(JSON.stringify(x._id)))));

                            if (!availableCourts.length) throwError.noCourt('Court not available');
                            console.log('Available courts', availableCourts);

                            // Select one court with minimum capacity
                            let len = availableCourts.length;
                            let court = '';

                            court = availableCourts[len]._id;

                            console.log('Selected court: ', court)

                            // Update database
                            var reservation = new Reservation;

                            reservation.customer = req.user.id;
                            reservation.facility = payload.facility;
                            reservation.reservationFrom = payload.reservationFrom;
                            reservation.courts = court;

                            reservation.save()
                                .then(function () {
                                    return res.json({ reservation: reservation.toCustomerJSON() });
                                }).catch(next);
                        }).catch(next);
                    }).catch(next);
                }).catch(next);
            }).catch(next);
    }).catch(next);
});

/*
 * Get all reservations of the logged-in customer
 * Required data: Authentication token for customer
 */
router.get('/', function (req, res, next) { // remove auth.required
    Customer.findById(req.user.id).then(function (customer) {
        if (!customer) return res.sendStatus(401);

        // Get reservation data of the customer
        Reservation.find({ customer: req.user.id })
            .populate('facility', 'name')
            .then(function (reservations) {
                var reservationList = [];
                reservations.forEach(function (reservation) {
                    reservationList.push(reservation.toCustomerJSON());
                });

                res.json({ reservations: reservationList });
            }).catch(next);
    }).catch(next);
});

/*
 * Get reservation of the logged-in customer by reservationId
 * Required data: Authentication token
 */
router.get('/:reservationId', function (req, res, next) {
    // if regEx of params do not match procceed to next function
    var regExObjectId = /^[a-f\d]{24}$/i;
    if (!regExObjectId.test(req.params.reservationId)) return next();

    Customer.findById(req.user.id).then(function (customer) {
        if (!customer) return res.sendStatus(401);

        // Get reservation data of the customer
        Reservation.findById({
            _id: req.params.reservationId,
            customer: req.user.id
        }).then(function (reservation) {
            if (!reservation) return res.sendStatus(401);

            res.json({ reservation: reservation.toCustomerJSON() });
        }).catch(next);
    }).catch(next);
});

module.exports = router;
