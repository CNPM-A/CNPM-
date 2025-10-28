const mongoose = require("mongoose");

const studentStopSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    // PENDING: Trạng thái chờ, khi chuyến đi mới được tạo
    action: {
        enum: ['PENDING', 'PICKED_UP', 'DROPPED_OFF', 'ABSENT'],
        type: String,
        required: true
    },
    timestamp: { type: Date } // Thoi gian quet RFID (null khi PENDING | ABSENT)
}, { _id: false });

const actualStopTimeSchema = new mongoose.Schema({
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    arrivalTime: { type: Date, required: true }, // toi tram
    departureTime: { type: Date } // roi tram
}, { _id: false });

const tripSchema = new mongoose.Schema({
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
    },

    // **TỐI ƯU: Denormalization (Phi chuẩn hóa) để tăng hiệu suất**
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    direction: {
        type: String,
        enum: ['PICKUP', 'DROP_OFF'],
        required: true
    },

    tripDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'NOT_STARTED'
    },
    studentStops: [studentStopSchema], // Theo dõi trạng thái của từng học sinh tại mỗi trạm
    actualStopTimes: [actualStopTimeSchema] // Theo dõi thời gian thực tế xe đến mỗi trạm
});

// To prevent creating duplicate trips for the same schedule on the same day
tripSchema.index({ scheduleId: 1, tripDate: 1 }, { unique: true });

tripSchema.index({ scheduleId: 1, driverId: 1});
tripSchema.index({ scheduleId: 1, busId: 1});

module.exports = mongoose.model("Trip", tripSchema);