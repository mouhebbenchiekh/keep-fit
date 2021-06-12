var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var GymOwnerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "can't be blank"]
    },
    lastName: {
        type: String,
        required: [true, "can't be blank"]
    },
    cin: {
        type: Number,
        required: [true, "can't be blank"],
        unique: true,
        match: [/[0-9]{8}$/, 'is invalid']

    },
    password: {
        type: String,
        required: [true, "can't be blank"],
    }
    ,
    email: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
        index: true,
        match: [/^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/, 'is invalid']
    },
    phone: {
        type: String,
        required: [true, "can't be blank"],
        unique: true,
        match: [/((\+|00)216)?([2579][0-9]{7}|(3[012]|4[01]|8[0128])[0-9]{6}|42[16][0-9]{5})/g, 'is invalid']
    },

}, { timestamps: true });

GymOwnerSchema.plugin(uniqueValidator, { message: 'is already taken.' });

var GymOwner = mongoose.model('GymOwner', GymOwnerSchema);

module.exports = GymOwner;
