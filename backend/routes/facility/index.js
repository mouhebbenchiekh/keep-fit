var router = require('express').Router();

// read list of courtss by facility owner
router.use('/courts', require('./courts'));


// Add, read, modify and delete courts by facility owner
router.use('/court', require('./court'));


// list reservations
router.use('/reservations', require('./reservations'));

// reservation releted operations
router.use('/reservation', require('./reservation.js'));

// Access customer details who has reservation
// '/facility/:facility/:phone'
router.use('/customer', require('./customer'));

// facility Create, Read, Update, Delete 
router.use('/facility', require('./facility'));

module.exports = router;
