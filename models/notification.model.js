const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    contextStudentId: { // The student this notification is about
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model("Notification", notificationSchema);