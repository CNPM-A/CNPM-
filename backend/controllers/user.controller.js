const User = require("../models/user.model");
const Trip = require("../models/trip.model");
const Student = require("../models/student.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });

    return newObj;
};

exports.getMe = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: req.user
    });
})

exports.updateMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    console.log(user);

    const filteredBody = filterObj(req.body, 'name');

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    }).catch((error) => {
        return next(new AppError(`Có lỗi xảy ra: ${error}`, 406));
    });

    res.status(200).json({
        status: 'success',
        data: updatedUser
    });
});

/**
 * API cho Driver lấy danh bạ phụ huynh từ các chuyến đi hôm nay
 * GET /api/users/driver/contacts
 * Response: Danh sách phụ huynh với thông tin học sinh
 */
exports.getDriverContacts = catchAsync(async (req, res, next) => {
    const driverId = req.user.id;

    // Lấy ngày hôm nay theo timezone Việt Nam (GMT+7)
    // Server Render Singapore (GMT+8) nên cần tính offset
    const VN_OFFSET_MS = 7 * 60 * 60 * 1000; // GMT+7 in milliseconds
    const nowUTC = Date.now();
    const nowVN = new Date(nowUTC + VN_OFFSET_MS);
    
    // Lấy ngày (YYYY-MM-DD) theo giờ VN, rồi convert về UTC để query
    const todayVN = new Date(Date.UTC(
        nowVN.getUTCFullYear(),
        nowVN.getUTCMonth(),
        nowVN.getUTCDate(),
        0, 0, 0, 0
    ) - VN_OFFSET_MS); // 00:00:00 VN = 17:00:00 UTC ngày hôm trước
    
    const tomorrowVN = new Date(todayVN.getTime() + 24 * 60 * 60 * 1000);

    // Tìm tất cả chuyến đi của driver hôm nay
    const todayTrips = await Trip.find({
        driverId: driverId,
        tripDate: { $gte: todayVN, $lt: tomorrowVN },
        status: { $in: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] }
    }).select('studentStops direction');

    if (todayTrips.length === 0) {
        return res.status(200).json({
            status: 'success',
            results: 0,
            data: []
        });
    }

    // Lấy tất cả studentId từ các chuyến đi
    const studentIds = [...new Set(
        todayTrips.flatMap(trip => 
            trip.studentStops.map(stop => stop.studentId.toString())
        )
    )];

    // Lấy thông tin học sinh và populate parentId
    const students = await Student.find({
        _id: { $in: studentIds }
    }).select('name grade parentId').populate({
        path: 'parentId',
        select: 'name phoneNumber'
    });

    // Nhóm học sinh theo phụ huynh
    const parentMap = new Map();

    students.forEach(student => {
        if (!student.parentId) return;

        const parentId = student.parentId._id.toString();

        if (!parentMap.has(parentId)) {
            parentMap.set(parentId, {
                parentId: parentId,
                parentName: student.parentId.name,
                phoneNumber: student.parentId.phoneNumber,
                students: []
            });
        }

        parentMap.get(parentId).students.push({
            studentId: student._id,
            studentName: student.name,
            grade: student.grade
        });
    });

    // Chuyển Map thành Array và sắp xếp theo tên
    const contacts = Array.from(parentMap.values())
        .sort((a, b) => a.parentName.localeCompare(b.parentName, 'vi'));

    res.status(200).json({
        status: 'success',
        results: contacts.length,
        data: contacts
    });
});