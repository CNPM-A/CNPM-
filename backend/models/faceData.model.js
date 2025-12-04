const mongoose = require('mongoose');

const faceDataSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        unique: true
    },
    encoding: {
        type: [Number],
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
}, { timestamps: true });

faceDataSchema.methods.updateFace = async function (newEncoding, newImageUrl) {
    this.encoding = newEncoding;
    this.imageUrl = newImageUrl;

    return await this.save();
}

module.exports = mongoose.model("FaceData", faceDataSchema);