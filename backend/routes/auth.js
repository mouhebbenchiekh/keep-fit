const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { registerValidation, loginValidation } = require('../validation');

// Validation :
const Joi = require('@hapi/joi');

const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
})

// REGISTER :
router.post('/register', async (req, res) => {
    // Validate the data before making a User :
    const err = registerValidation(req.body);

    if (err["error"] !== null) {
        return res.status(400).send(err.error.details[0].message);
    }

    // Checking if the user is already in the database :
    const emailExist = await User.findOne({
        email: req.body.email
    });
    if (emailExist) {
        return res.status(400).send('Email already exists');

    }

    // Hash the Password :
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {

        const savedUser = await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        res.header('auth-token', token).send({
            token: token,
            user: savedUser
        });
    } catch (error) {
        res.status(400).send(error)
    }
});

// LOGIN :
router.post('/login', async (req, res) => {

    const err = loginValidation(req.body);

    if (err["error"] !== null) {
        return res.status(400).send(err.error.details[0].message);
    }

    // Checking if the email exists :
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return res.status(400).send('Invalid Email');
    }

    // check if password is correct: 

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send('Invalid Password')
    }

    // Create and assign a token :
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send({
        token: token,
        user: user
    });
});


module.exports = router;