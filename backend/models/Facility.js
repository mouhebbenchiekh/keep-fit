var mongoose = require('mongoose');

var helpers = require('../helpers/utility');
var throwError = require('../helpers/throwError');

var ObjectId = mongoose.Schema.Types.ObjectId;

var timeSchema = {
	start: Number,
	end: Number
}

var FacilitySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "can't be blank"]
	},
	address: {
		type: String,
		required: [true, "can't be blank"]
	},
	description: {
		type: String,
	},
	admin: {
		type: [{ type: ObjectId, ref: 'FacilityOwner' }],
		required: [true, "can't be blank"]
	},
	businessHours: {
		sunday: timeSchema,
		monday: timeSchema,
		tuesday: timeSchema,
		wednesday: timeSchema,
		thursday: timeSchema,
		friday: timeSchema,
		saturday: timeSchema
	},
	verified: {
		type: Boolean,
		default: false
	}
});

FacilitySchema.methods.setBusinessHours = function (data) {
	if (!data) return;

	var businessHours = this.businessHours;
	const days = Object.keys(businessHours);

	days.forEach(function (day) {
		console.log("test");
		if (!data[day]) return;

		if (!helpers.time.validate(data[day].start) || !helpers.time.validate(data[day].end)
			|| data[day].start > data[day].end) {
			throwError.validationError('Invalid business hours');
		}

		businessHours[day].start = data[day].start;
		businessHours[day].end = data[day].end;
	});
};

FacilitySchema.methods.viewByOwnerJSON = function () {
	return {
		id: this._id,
		name: this.name,
		address: this.address,
		description: this.description,
		businessHours: this.businessHours,
		verified: this.verified
	};
};

FacilitySchema.methods.viewJSON = function () {
	return {
		id: this._id,
		name: this.name,
		address: this.address,
		description: this.description,
		businessHours: this.businessHours
	};
};

var Facility = mongoose.model('Facility', FacilitySchema);

module.exports = Facility;
