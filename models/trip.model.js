const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true,
        unique: true // Enforces the 1-to-1 relationship
    },
    studentsPickedUp: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'NOT_STARTED'
    }
});

module.exports = mongoose.model("Trip", tripSchema);