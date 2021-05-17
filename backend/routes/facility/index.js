var router = require('express').Router();

// facility Create, Read, Update, Delete 
router.use('/', require('./facility'));

// Add, read, modify and delete courts by facility owner
router.use('/court', require('./court'));

// read list of courtss by facility owner
router.use('/courts', require('./courts'));

// list reservations
router.use('/reservations', require('./reservations'));

// reservation releted operations
router.use('/reservation', require('./reservation'));

// Access customer details who has reservation
// '/facility/:facility/:phone'
router.use('/customer', require('./customer'));

module.exports = router;
