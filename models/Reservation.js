const mongoose = require('mongoose');

const ReservationSchema = mongoose.Schema({
    _id: Schema.Types.ObjectId,
    // populate ???
    ReservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client' // Let's assume that anyone can make a reservation (logged in or not)
    },
    court: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court'
    },
    /* Let's assume that we have this sessions : 
        08 : 00 ==> 09 : 30     : Session 1
        09 : 30 ==> 11 : 00     : Session 2
        11 : 00 ==> 12 : 30     : Session 3
        ...                         .
        21 : 00 ==> 22 : 30         .
        22 : 30 ==> 00 : 00         .
    */
    session: Number
});

module.exports = mongoose.model('Reservation', ReservationSchema);