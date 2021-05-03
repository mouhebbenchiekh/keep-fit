// in OLD CALLED : Booking

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var ReservationSchema = new mongoose.Schema({
    customer: {
        type: ObjectId,
        required: [true, "can't be blank"]
    },
    facility: {
        type: ObjectId,
        ref: 'Facility',
        required: [true, "Can't be blank"],
    },
    court: {
        type: { type: ObjectId, ref: 'Court' },
        default: undefined,
        required: [true, "can't be blank"]
    },
    reservationFrom: {
        type: Date,
        required: [true, "can't be blank"],
    },
    reservationStatus: {
        type: String,
        default: 'pending',
        validate: {
            validator: function (value) {
                validStrings = ['pending', 'confirmed', 'canceled'];
                return (validStrings.indexOf(value.toLowerCase()) !== -1);
            },
            message: 'invalid input, enter pending / confirmed / canceled'
        }
    },
    ReservationStatusUpdatedBy: { 
        type: String,
        validate: {
            validator: function (value) {
                validStrings = ['customer', 'facilityOwner', 'Admin'];
                return (validStrings.indexOf(value.toLowerCase()) !== -1);
            },
            message: 'invalid string'
        }
    }
},
    { timestamps: true } //When you enable timestamps, Mongoose adds createdAt and updatedAt properties to your schema. By default, createdAt and updatedAt are of type Date.
);


// Methods : 
ReservationSchema.methods.toCustomerJSON = function () { 
    return {
        id: this._id,
        facility: this.facility,
        reservationFrom: this.reservationFrom,
        reservationStatus: this.reservationStatus
    };
};

ReservationSchema.methods.toFacilityOwnerJSON = function () { 
    return {
        id: this._id,
        facility: this.facility,
        court: this.court, 
        customer: this.customer,
        reservationFrom: this.reservationFrom, 
        reservationStatus: this.reservationStatus 
    };
};

var Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;















/*
const mongoose = require('mongoose');

const ReservationSchema = mongoose.Schema({
    // populate ???
    ReservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client' // Let's assume that anyone can make a reservation (logged in or not)
    },
    court: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court'
    },
    // Let's assume that we have this sessions :
    //    08 : 00 ==> 09 : 30     : Session 1
    //    09 : 30 ==> 11 : 00     : Session 2
    //    11 : 00 ==> 12 : 30     : Session 3
    //    ...                         .
    //    21 : 00 ==> 22 : 30         .
    //    22 : 30 ==> 00 : 00         .

    session: Number,
    date: Date
});

module.exports = mongoose.model('Reservation', ReservationSchema);
*/