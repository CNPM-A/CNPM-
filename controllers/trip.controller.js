const Trip = require('../models/trip.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../utils/handlerFactory');

// Sử dụng lại factory cho các hành động đơn giản
exports.getAllTrips = factory.selectAll(Trip);
exports.getTrip = factory.selectOne(Trip);
exports.deleteTrip = factory.deleteOne(Trip);

/**
 * Tạo một chuyến đi mới.
 * Logic phức tạp hơn việc chỉ tạo document đơn thuần.
 * Ví dụ: Có thể cần kiểm tra xem lịch trình có đang hoạt động không,
 * hoặc gửi thông báo khi tạo chuyến đi.
 */
exports.createTrip = catchAsync(async (req, res, next) => {
    try {
        // Sử dụng Trip.create để Mongoose tự động gọi new và save()
        // Hook pre('save') sẽ được kích hoạt tự động
        const newTrip = await Trip.create(req.body);

        res.status(201).json({
            status: 'success',
            data: newTrip,
        });
    } catch (error) {
        // Bắt lỗi validation từ Mongoose (nếu có)
        if (error.name === 'ValidationError') {
            return next(new AppError(error.message, 400));
        }
        next(error); // Chuyển các lỗi khác (ví dụ: lỗi từ pre-save hook) đi tiếp
    }
});

/**
 * Cập nhật một chuyến đi.
 * Có thể có các quy tắc nghiệp vụ đặc biệt, ví dụ: không cho phép
 * thay đổi tài xế/xe buýt khi chuyến đi đang diễn ra.
 */
exports.updateTrip = catchAsync(async (req, res, next) => {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
        return next(new AppError(`No trip found with that ID: ${req.params.id}`, 404));
    }

    // Ví dụ về nghiệp vụ: Không cho phép thay đổi thông tin quan trọng khi chuyến đi đang diễn ra
    if (trip.status === 'IN_PROGRESS' && (req.body.driverId || req.body.busId)) {
        return next(new AppError('Cannot change driver or bus while the trip is in progress.', 400));
    }

    // Tối ưu: Thay vì gọi lại factory (sẽ query lại DB),
    // chúng ta cập nhật trực tiếp trip đã tìm thấy.
    Object.assign(trip, req.body);

    // trip.save() sẽ kích hoạt hook pre('save') để kiểm tra xung đột
    const updatedTrip = await trip.save();

    res.status(200).json({
        status: 'success',
        data: {
            data: updatedTrip,
        },
    });
});