var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ObjectId = mongoose.Schema.Types.ObjectId;

var CoachSchema = new mongoose.Schema({
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
    description:{
        type: String,
        required: [true, "can't be blank"]
    },
    verified: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: [true, "can't be blank"]
    },
    address:{
        type: String,
        required: [true, "can't be blank"]
    }

}, { timestamps: true });

CoachSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// methods to add 
CoachSchema.methods.viewJSON = function () {
	return {
		id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        verified: this.verified,
		address: this.address,
        description: this.description,
        price: this.price,
	};
};


CoachSchema.methods.viewByCoachJSON = function () {
	return {
		id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        verified: this.verified,
		address: this.address,
        description: this.description,
        price: this.price,
        cin:this.cin
	};
};
var Coach = mongoose.model('Coach', CoachSchema);
module.exports = Coach;
