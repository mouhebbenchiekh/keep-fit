var router = require('express').Router();

router.get('/ping', function(req, res, next){
    return res.status(200).send('Hello');
});

// user signup, login, view user data, modify user data
//router.use('/user', require('./user'));

// Facility releted operations 
router.use('/facility', require('./facility/'));

// View all verified facilitys by public
router.use('/facilitys', require('./facilitys'));

// Manage reservations
router.use('/reservation', require('./reservation'));

module.exports = router;