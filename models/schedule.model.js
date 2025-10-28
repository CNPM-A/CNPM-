const mongoose = require("mongoose");
const AppError = require("../utils/appError")

// Sub-schema cho các điểm dừng trong lịch trình
const scheduledStopSchema = new mongoose.Schema({
    stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true
    },
    // Giờ đến dự kiến (vẫn dùng "HH:mm" để tái sử dụng)
    arrivalTime: {
        type: String,
        required: true,
        match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ // Đảm bảo định dạng "HH:mm"
    },
    // Danh sách học sinh ĐƯỢC GÁN cho trạm này trong lịch trình này
    // Ví dụ: Chiều ĐÓN, trạm A, có 3 học sinh A, B, C
    studentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, { _id: false });


const scheduleSchema = new mongoose.Schema({
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Giả sử User model lưu cả driver
        required: true
    },
    direction: {
        type: String,
        enum: ['PICK_UP', 'DROP_OFF'], // PICKUP = Đón (sáng), DROP_OFF = Trả (chiều)
        required: true
    },

    // **TỐI ƯU: Thêm ngày hoạt động trong tuần**
    // (1 = Thứ 2, 2 = Thứ 3, ..., 7 = Chủ Nhật - theo chuẩn ISO 8601)
    daysOfWeek: [{
        type: Number,
        min: 1,
        max: 7
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },

    stopTimes: [scheduledStopSchema],

    isActive: {
        type: Boolean,
        default: true,
        select: false
    }
}, { timestamps: true }); // Thêm timestamps để biết khi nào lịch trình được tạo/cập nhật

// Index để tìm kiếm lịch trình nhanh chóng
scheduleSchema.index({ routeId: 1, direction: 1, isActive: 1 });
scheduleSchema.index({ busId: 1, isActive: 1 });
scheduleSchema.index({ driverId: 1, isActive: 1 });

scheduleSchema.pre('save', async function (next) {
    // Chỉ thực hiện kiểm tra nếu các trường liên quan bị thay đổi
    if (!this.isModified('startDate') && !this.isModified('endDate') && !this.isModified('daysOfWeek') && !this.isModified('driverId') && !this.isModified('busId')) {
        return next();
    }

    const Schedule = this.constructor;

    // Xây dựng điều kiện truy vấn để tìm lịch trình xung đột
    const conflictQuery = {
        // Loại trừ chính lịch trình đang được cập nhật
        _id: { $ne: this._id },
        // 1. Khoảng thời gian giao nhau
        startDate: { $lte: this.endDate },
        endDate: { $gte: this.startDate },
        // 2. Có ngày trong tuần trùng lặp
        daysOfWeek: { $in: this.daysOfWeek },
        // 3. Cùng chiều đi (PICK_UP hoặc DROP_OFF)
        direction: this.direction,
        // 4. Cùng tài xế HOẶC cùng xe buýt
        $or: [
            { driverId: this.driverId },
            { busId: this.busId }
        ]
    };

    const existingSchedule = await Schedule.findOne(conflictQuery);

    if (existingSchedule) {
        const message = 'Schedule conflict: The selected driver or bus is already assigned to another schedule during the specified time frame and days.';
        return next(new AppError(message, 409)); // 409 Conflict
    }

    next();
});

module.exports = mongoose.model("Schedule", scheduleSchema);