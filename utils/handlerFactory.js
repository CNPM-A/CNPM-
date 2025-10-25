const catchAsync = require('./catchAsync');

/** @param {import("mongoose").Model} Model */
const selectAll = (Model) => {
    return catchAsync(async (req, res, next) => {
        const docs = await Model.find({})
        res.json({
            status: "success",
            result: docs.length,
            data: docs
        })
    })
}

/** @param {import("mongoose").Model} Model */
const selectOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findById(req.params.id)

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: "success",
            data: doc
        })
    })
}

/** @param {import("mongoose").Model} Model */
const createOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body)

        res.status(201).json({ // 201 Created
            status: "success",
            data: doc // Chỉ trả về document vừa được tạo
        })
    })
}

/** @param {import("mongoose").Model} Model */
const updateOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id,
            req.body,
            {
                new: true, // Trả về tài liệu sau khi cập nhật
                runValidators: true // Chạy lại các hàm kiểm tra hợp lệ (validators) trên schema
            }
        )

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: "success",
            data: doc
        })
    })
}

/** @param {import("mongoose").Model} Model */
const deleteOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: "success",
            data: doc
        })
    })
}

module.exports = { selectAll, selectOne, createOne, updateOne, deleteOne }