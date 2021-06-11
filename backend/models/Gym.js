var mongoose = require('mongoose');

var helpers = require('../helpers/utility');
var throwError = require('../helpers/throwError');

var ObjectId = mongoose.Schema.Types.ObjectId;

var timeSchema = {
    start: Number,
    end: Number
}

var GymSchema = new mongoose.Schema({
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
        type: [{ type: ObjectId, ref: ' GymOwner' }],
        required: [true, "can't be blank"]
    },
    businessHours: {
        monday: timeSchema,
        tuesday: timeSchema,
        wednesday: timeSchema,
        thursday: timeSchema,
        friday: timeSchema,
        saturday: timeSchema,
        sunday: timeSchema
    },
    verified: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: [true, "can't be blank"]
    },
    coordinates: {
        type: [Number],
        required: [true, "can't be blank"]
    },
    activities:{
        type: [String],
        required: [true, "can't be blank"]
    }
});

GymSchema.methods.setBusinessHours = function (data) {
    if (!data) return;

    var businessHours = this.businessHours;
    const days = Object.keys(businessHours);

    days.forEach(function (day) {
        if (!data[day]) return;

        if (!helpers.time.validate(data[day].start) || !helpers.time.validate(data[day].end)
            || data[day].start > data[day].end) {
            throwError.validationError('Invalid business hours');
        }

        businessHours[day].start = data[day].start;
        businessHours[day].end = data[day].end;
    });
};

GymSchema.methods.viewByOwnerJSON = function () {
    return {
        id: this._id,
        name: this.name,
        address: this.address,
        description: this.description,
        businessHours: this.businessHours,
        verified: this.verified,
        price: this.price,
        coordinates: this.coordinates,
        activities: this.activities
    };
};

GymSchema.methods.viewJSON = function () {
    return {
        id: this._id,
        name: this.name,
        address: this.address,
        description: this.description,
        businessHours: this.businessHours,
        price: this.price,
        coordinates: this.coordinates,
        activities: this.activities
    };
};

var Gym = mongoose.model('Gym', GymSchema);

module.exports = Gym;
