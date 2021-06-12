// Customer that makes a reservation : anyone can make a reservation doesn't have to be logged in 

var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

ObjectId = mongoose.Schema.Types.ObjectId;

var CustomerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "can't be blank"]
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
		match: [/((\+|00)216)?([2579][0-9]{7}|(3[012]|4[01]|8[0128])[0-9]{6}|42[16][0-9]{5})$/, 'is invalid']
	},
},
	{ timestamps: true });

CustomerSchema.plugin(uniqueValidator, { message: 'is already taken.' });

CustomerSchema.methods.toAuthJSON = function () {
	return {
		name: this.name,
		email: this.email,
	};
};

CustomerSchema.methods.getUserJSON = function () {
	return {
		name: this.name,
		email: this.email,
		phone: this.phone
	};
};

var Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;








/*
const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    cin: {
        type : Number,
        require: true,
        unique: true
    },
    phone: {
        type: Number,
        require: true,
        unique : true
    }

});

module.exports = mongoose.model('Court', CourtSchema);
*/