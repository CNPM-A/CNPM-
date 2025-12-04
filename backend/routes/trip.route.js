const express = require('express');
const tripController = require('../controllers/trip.controller');
// Config lưu vào RAM (Multer)
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { authenticateToken, restrictTo } = require('../controllers/auth.controller');

const route = express.Router();

// Áp dụng middleware xác thực cho tất cả các route bên dưới
route.use(authenticateToken);

// === CÁC ROUTE SỬ DỤNG CONTROLLER TÙY CHỈNH ===

route.post(
    '/',
    restrictTo('Admin', 'Manager'),
    tripController.createTrip
);

route.patch(
    '/:id',
    restrictTo('Admin', 'Manager'),
    tripController.updateTrip
);

route.get(
    '/my-schedule',
    restrictTo('Driver'),
    tripController.getMySchedule
);

route.get('/:id/students',
    restrictTo('Driver'),
    tripController.getStudents
);

route.patch(
    '/:id/check-in',
    restrictTo('Admin', 'Driver'),
    tripController.checkIn
);

route.patch(
    '/:id/mark-absent',
    restrictTo('Driver'),
    tripController.markAsAbsent
);

route.post(
    '/:id/check-in-face',
    // Nhờ Middleware dưới đây mới có data req.file (req.file.buffer, req.file.originalname,...)
    // .single(): nhận được 1 file thoi
    // 'image': Là tên của field (trường) trong form-data mà client dùng để gửi file.
    // <input type="file" name="image">
    upload.single('image'),
    tripController.checkInWithFace
);

route.get(
    '/:id',
    restrictTo('Admin', 'Manager', 'Driver', 'Parent'),
    tripController.getTrip
);

// === CÁC ROUTE VẪN SỬ DỤNG FACTORY (HOẶC CONTROLLER ĐÃ WRAP FACTORY) ===

route.get(
    '/',
    restrictTo('Admin', 'Manager', 'Driver', 'Parent'),
    tripController.getAllTrips
);


route.delete('/:id', restrictTo('Admin', 'Manager'), tripController.deleteTrip);

module.exports = route;