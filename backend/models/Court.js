var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var CourtSchema = new mongoose.Schema({
	facility: {
		type: ObjectId,
		ref: 'Facility',
		required: [true, "can't be blank"]
	},
	courtIdentifier: {
		type: String,
		required: [true, "can't be blank"]
	},
	description: {
		type: String,
	},
});

CourtSchema.methods.viewJSON = function() {
	return {
		id: this._id,
		courtIdentifier: this.courtIdentifier,
		description: this.description
	};
};

var Court = mongoose.model('Court', CourtSchema);

module.exports = Court;








/*
const mongoose = require('mongoose');

const CourtSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    coordinates: [],
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // the owner of the court
    },
    sessionPrice: {
        type: Number,
        require: true
    },

    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }] // use population   
});

module.exports = mongoose.model('Court', CourtSchema);
*/