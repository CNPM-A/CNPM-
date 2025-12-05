const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file từ Buffer lên Cloudinary
 * @param {Buffer} buffer - Buffer của file ảnh
 * @param {String} folder - Tên thư mục muốn lưu trên Cloud
 * @returns {Promise<String>} - Trả về URL
 */

exports.uploadToCloudinary = ( buffer, folder = 'students_faces') => {
    // Tạo Promise: Vì quá trình upload mất thời gian, gói nó vào Promise 
    // để bên Controller có thể dùng 'await'
    return new Promise((resolve, reject) => {
        // upload_stream để dễ xử lý mấy file lớn
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url); // trả link ảnh
            }
        );

        // Dữ liệu tự động chảy từ RAM -> Cloudinary cho đến khi hết sạch
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};