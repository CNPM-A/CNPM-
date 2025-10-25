# 🌱 HƯỚNG DẪN SEED DATABASE

## 📋 Dữ liệu sẽ được tạo

### Tổng quan:
- ✅ **1 Admin** - Quản trị viên hệ thống
- ✅ **2 Managers** - Quản lý
- ✅ **10 Drivers** - Tài xế
- ✅ **30 Parents** - Phụ huynh
- ✅ **10 Buses** - Xe bus với biển số thật
- ✅ **20 Stations** - Điểm dừng (5 trường học + 15 điểm đón)
- ✅ **5 Routes** - Tuyến đường (mỗi tuyến 4-7 điểm dừng)
- ✅ **50 Students** - Học sinh (mỗi parent có 1-2 con)
- ✅ **10 Schedules** - Lịch trình xe
- ✅ **10 Trips** - Chuyến đi (với trạng thái khác nhau)
- ✅ **~21 GPS Locations** - Vị trí xe bus theo thời gian thực
- ✅ **20 Notifications** - Thông báo cho phụ huynh
- ✅ **5 Alerts** - Cảnh báo từ tài xế

---

## 🚀 CÁCH CHẠY

### Bước 1: Đảm bảo server KHÔNG chạy
```bash
# Nếu đang chạy npm run dev, nhấn Ctrl+C để dừng
```

### Bước 2: Chạy seed script
```bash
npm run seed
```

### Bước 3: Đợi quá trình hoàn tất
Bạn sẽ thấy:
```
🔄 Connecting to database...
✅ Connected to database!

🗑️  Clearing old data...
✅ Old data cleared!

👥 Creating users...
✅ Created 1 Admin
✅ Created 2 Managers
✅ Created 10 Drivers
✅ Created 30 Parents

🚌 Creating buses...
✅ Created 10 Buses

... (và nhiều bước khác)

🎉 DATABASE SEEDING COMPLETED!
```

### Bước 4: Khởi động lại server
```bash
npm run dev
```

---

## 🔐 TÀI KHOẢN ĐĂNG NHẬP

### Admin
- **Email**: `admin@schoolbus.com`
- **Password**: `Admin123456`

### Manager
- **Email**: `manager1@schoolbus.com` hoặc `manager2@schoolbus.com`
- **Password**: `Manager123`

### Driver (Ví dụ)
- **Email**: Tên tài xế được tạo tự động (vd: `nguyenvanan123@gmail.com`)
- **Password**: `Driver123`
- *Xem danh sách email trong database hoặc log khi seed*

### Parent (Ví dụ)
- **Email**: Tên phụ huynh được tạo tự động
- **Password**: `Parent123`

---

## 📊 CHI TIẾT DỮ LIỆU

### Users (43 users)
- Tên tiếng Việt ngẫu nhiên
- Email tự động generate
- Số điện thoại 10 số ngẫu nhiên
- Mật khẩu đã được hash bằng bcrypt

### Buses (10 xe)
- Biển số thật: `29A-10001`, `30B-10002`, ...
- 7 xe đang được assign (isAssigned: true)
- 3 xe chưa assign

### Stations (20 điểm)
- 5 trường học: Lê Quý Đôn, Nguyễn Thị Minh Khai, Gia Định, ...
- 15 điểm đón/trả: Khu dân cư các quận ở TP.HCM
- Tọa độ GPS ngẫu nhiên trong TP.HCM

### Routes (5 tuyến)
- Mỗi tuyến có 4-7 điểm dừng
- Tên: Tuyến 01, Tuyến 02, ...

### Students (50 học sinh)
- Tên tiếng Việt (nam/nữ)
- Khối lớp 6-12
- Được phân bổ đều cho 30 parents (mỗi parent 1-2 con)
- Có điểm đón và điểm trả

### Schedules (10 lịch trình)
- Thời gian: 6:00 - 8:00 sáng
- Mỗi schedule assign cho 1 bus, 1 driver, 1 route
- Có danh sách students

### Trips (10 chuyến)
- Trạng thái ngẫu nhiên: NOT_STARTED, IN_PROGRESS, COMPLETED
- Số học sinh đã đón phù hợp với trạng thái

### GPS Locations (~21 vị trí)
- 7 xe đang hoạt động
- Mỗi xe có 3 điểm GPS gần nhất (mỗi 5 phút)

### Notifications (20 thông báo)
- Gửi đến phụ huynh
- Nội dung về việc đón/trả học sinh

### Alerts (5 cảnh báo)
- Từ tài xế
- Về tình trạng xe, giao thông

---

## 🔄 CHẠY LẠI SEED

**Lưu ý**: Mỗi lần chạy `npm run seed` sẽ:
1. ❌ **XÓA TẤT CẢ** dữ liệu cũ
2. ✅ Tạo dữ liệu mới hoàn toàn

```bash
# Xóa data cũ và tạo mới
npm run seed
```

---

## 🧪 TEST SAU KHI SEED

### 1. Đăng nhập Admin
```http
POST http://localhost:3000/api/v1/auth/signin
Content-Type: application/json

{
  "username": "admin@schoolbus.com",
  "password": "Admin123456"
}
```

### 2. Lấy danh sách Users (nên có 43 users)
```http
GET http://localhost:3000/api/v1/users
Authorization: Bearer <access_token>
```

### 3. Lấy danh sách Buses (nên có 10 buses)
```http
GET http://localhost:3000/api/v1/buses
Authorization: Bearer <access_token>
```

### 4. Lấy danh sách Students (nên có 50 students)
```http
GET http://localhost:3000/api/v1/students
Authorization: Bearer <access_token>
```

---

## 🔍 XEM DỮ LIỆU TRONG DATABASE

### Dùng MongoDB Compass
1. Mở MongoDB Compass
2. Connect: `mongodb://localhost:27017`
3. Chọn database: `school_bus_db`
4. Xem các collections:
   - users (43 documents)
   - students (50 documents)
   - buses (10 documents)
   - stations (20 documents)
   - routes (5 documents)
   - schedules (10 documents)
   - trips (10 documents)
   - locations (~21 documents)
   - notifications (20 documents)
   - alerts (5 documents)

### Dùng Command Line
```bash
mongosh
use school_bus_db

# Đếm số lượng
db.users.countDocuments()
db.students.countDocuments()
db.buses.countDocuments()

# Xem chi tiết
db.users.find({ role: "Admin" }).pretty()
db.students.find().limit(5).pretty()
db.buses.find().pretty()
```

---

## ⚠️ LƯU Ý

1. **Server phải DỪNG** khi chạy seed (tránh conflict)
2. **MongoDB phải đang chạy**
3. **File .env phải đúng** (DB_URL)
4. Quá trình seed mất khoảng **5-10 giây**
5. Dữ liệu cũ sẽ bị **XÓA HOÀN TOÀN**

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Cannot connect to database"
→ Kiểm tra MongoDB đã chạy chưa
```bash
mongosh
```

### Lỗi: "Duplicate key error"
→ Chạy lại seed (nó sẽ xóa data cũ trước)
```bash
npm run seed
```

### Lỗi: "Cannot find module"
→ Cài lại dependencies
```bash
npm install
```

---

## 📈 THỐNG KÊ DỮ LIỆU MẪU

| Model | Số lượng | Ghi chú |
|-------|----------|---------|
| Users | 43 | 1 Admin + 2 Managers + 10 Drivers + 30 Parents |
| Buses | 10 | 7 đang hoạt động, 3 chưa assign |
| Stations | 20 | 5 trường + 15 điểm đón |
| Routes | 5 | 4-7 điểm dừng mỗi tuyến |
| Students | 50 | Phân bổ đều cho 30 parents |
| Schedules | 10 | Sáng 6:00-8:00 |
| Trips | 10 | Trạng thái đa dạng |
| Locations | ~21 | 7 xe × 3 vị trí |
| Notifications | 20 | Gửi cho parents |
| Alerts | 5 | Từ drivers |

---

**Happy Testing with Real Data! 🎉**
