// fix-timestamp.js
const mongoose = require('mongoose');
const User = require('./models/user.model'); // Đường dẫn tới model User của bạn
require('dotenv').config();

async function fixData() {
    try {
        console.log("⏳ Đang kết nối Database...");
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Kết nối thành công!");

        const now = new Date();

        // Cập nhật TẤT CẢ user đang thiếu createdAt
        const result = await User.updateMany(
            { createdAt: { $exists: false } }, // Điều kiện: Tìm ông nào chưa có
            { 
                $set: { 
                    createdAt: now, 
                    updatedAt: now 
                } 
            },
            { timestamps: false } // Quan trọng: Tắt timestamps tự động của Mongoose để tránh conflict
        );

        console.log(`🎉 Đã cập nhật thành công cho ${result.modifiedCount} tài khoản!`);
        
    } catch (error) {
        console.error("❌ Lỗi:", error);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Đã ngắt kết nối.");
        process.exit();
    }
}

fixData();