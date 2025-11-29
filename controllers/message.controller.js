const Message = require("../models/message.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getMyMessage = catchAsync(async (req, res, next) => {
    const messages = await Message.find({
        $or:
        [
            {senderId: req.user.id},
            {receiverId: req.user.id}
        ]
    });

    if (!messages)
        return next(new AppError('Không tìm thấy lịch sử chat gần đây nhất',404));

    res.status(200).json({
        status: 'success',
        data: messages
    });
});