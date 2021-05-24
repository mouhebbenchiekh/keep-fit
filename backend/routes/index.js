var router = require('express').Router();

router.get('/ping', function(req, res, next){
    return res.status(200).send('test');
});

// user signup, login, view user data, modify user data
//router.use('/user', require('./user'));

// Facility releted operations 
router.use('/facility', require('./facility/'));

// View all verified facilitys by public
router.use('/facilitys', require('./facilitys'));

// Manage reservations
router.use('/reservation', require('./reservation'));

// auth route
router.use('/api/user',require('./auth'));

// private route
router.use('/api/private',require('./privateRoute'));

// Gym releted operations 
router.use('/gym', require('./gym'));

// Event releted operations 
router.use('/event', require('./event'));

// Coach releted operations 
router.use('/coach', require('./coach'));

module.exports = router;