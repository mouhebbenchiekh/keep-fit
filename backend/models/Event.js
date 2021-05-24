var mongoose = require('mongoose');

var helpers = require('../helpers/utility');
var throwError = require('../helpers/throwError');

var ObjectId = mongoose.Schema.Types.ObjectId;


var EventSchema = new mongoose.Schema({
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
        type: [{ type: ObjectId, ref: ' EventOwner' }],
        required: [true, "can't be blank"]
    },
    time: {
        type: Date,
        required: [true, "can't be blank"]
    },
    verified: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0,
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



EventSchema.methods.viewByOwnerJSON = function () {
    return {
        id: this._id,
        name: this.name,
        address: this.address,
        description: this.description,
        time:this.time,
        verified: this.verified,
        price: this.price,
        coordinates: this.coordinates,
        activities: this.activities
    };
};

EventSchema.methods.viewJSON = function () {
    return {
        id: this._id,
        name: this.name,
        address: this.address,
        description: this.description,
        time:this.time,
        price: this.price,
        coordinates: this.coordinates,
        activities: this.activities
    };
};

var Event = mongoose.model('Event', EventSchema);

module.exports = Event;
