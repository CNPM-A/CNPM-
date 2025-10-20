const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    stopPoints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
    }]
});

module.exports = mongoose.model("Route", routeSchema);