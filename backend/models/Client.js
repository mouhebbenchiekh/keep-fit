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
    /*
    numberOfPreviousReservation: {
        type : Number,
        require: true,
        default : 0
    },
    rating :{ // Rating by the court owner :
        type: Number,
        require:true,
        default : -1 // This client has no rating yet
    }
    */
});

module.exports = mongoose.model('Court', CourtSchema);