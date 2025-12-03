const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
            'SOS',          // Tài xế bấm nút khẩn cấp
            'LATE',         // Xe bị trễ giờ (Cron job phát hiện)
            'OFF_ROUTE',    // Xe đi chệch tuyến (Server phát hiện)
            'SPEEDING',     // (chức năng mở rộng trong tương lai)
            'OTHER'         // Các lỗi khác
        ],
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model("Alert", alertSchema);