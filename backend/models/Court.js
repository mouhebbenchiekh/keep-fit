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
    rating: {
        type: Number,
        require: true,
        default: -1 // This court has no rating yet 
    },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }] // use population   
});

module.exports = mongoose.model('Court', CourtSchema);