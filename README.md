# 🚌 School Bus Management System - Backend API

Hệ thống quản lý xe đưa đón học sinh (School Student Bus - SSB)

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Cài đặt](#-cài-đặt)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Test API](#-test-api)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Endpoints](#-api-endpoints)

## ✨ Tính năng

### Xác thực & Bảo mật
- ✅ Đăng ký/Đăng nhập với JWT
- ✅ Access Token (15 phút) + Refresh Token (7 ngày)
- ✅ Multi-session support (tối đa 5 phiên/user)
- ✅ Mã hóa mật khẩu với bcrypt
- ✅ HttpOnly cookies

### Quản lý
- ✅ Người dùng (Admin, Manager, Parent, Driver)
- ✅ Học sinh
- ✅ Xe bus
- ✅ Tuyến đường & điểm dừng
- ✅ Lịch trình & chuyến đi
- ✅ Vị trí GPS theo thời gian thực
- ✅ Thông báo & cảnh báo

## 🛠️ Công nghệ

- **Runtime**: Node.js
- **Framework**: Express.js v5.x
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, cookie-parser
- **Dev Tools**: nodemon

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/CNPM-A/CNPM-.git
cd CNPM-
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Copy file `.env.example` thành `.env` và điền thông tin:

```bash
copy .env.example .env
```

Sửa file `.env`:

```env
NODE_ENV=development
PORT=3000
DB_URL=mongodb://localhost:27017/school_bus_db
ACCESS_TOKEN_SECRET=your_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Tạo secret keys ngẫu nhiên:**
```bash
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 4. Cài đặt & khởi động MongoDB

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Hoặc dùng MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

**Kiểm tra MongoDB đã chạy:**
```bash
mongosh
```

## 🚀 Chạy ứng dụng

### Development mode (với nodemon - auto restart)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

## 🧪 Test API

### Cách 1: Dùng REST Client Extension (Khuyên dùng)

1. Cài extension **REST Client** trong VS Code:
   - Mở Extensions (Ctrl+Shift+X)
   - Tìm "REST Client" by Huachao Mao
   - Click Install

2. Mở file `tests/api.http`

3. Click **"Send Request"** phía trên mỗi request

4. Xem kết quả bên phải màn hình

### Cách 2: Dùng Thunder Client Extension

1. Cài **Thunder Client** extension
2. Import collection từ `tests/api.http`
3. Click Send

### Cách 3: Dùng Postman

1. Import file `tests/api.http` vào Postman
2. Test từng endpoint

### Cách 4: Dùng curl (Command line)

```bash
# Đăng ký
curl -X POST http://localhost:3000/api/v1/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Admin Test\",\"email\":\"admin@test.com\",\"phoneNumber\":\"0123456789\",\"password\":\"Admin123\",\"role\":\"Admin\"}"

# Đăng nhập
curl -X POST http://localhost:3000/api/v1/auth/signin ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin@test.com\",\"password\":\"Admin123\"}"
```

## 📁 Cấu trúc dự án

```
CNPM-/
├── controllers/         # Business logic
│   ├── auth.controller.js
│   └── generic.controller.js
├── models/             # Database schemas
│   ├── user.model.js
│   ├── student.model.js
│   ├── bus.model.js
│   └── ...
├── routes/             # API routes
│   ├── auth.route.js
│   └── models.route.js
├── utils/              # Helpers
│   ├── appError.js
│   ├── catchAsync.js
│   └── handlerFactory.js
├── tests/              # API testing
│   └── api.http
├── .env.example        # Environment template
├── .gitignore
├── index.js            # App entry point
└── package.json
```

## 🔗 API Endpoints

### Authentication
```
POST   /api/v1/auth/signup      # Đăng ký
POST   /api/v1/auth/signin      # Đăng nhập
DELETE /api/v1/auth/logout      # Đăng xuất
POST   /api/v1/auth/token       # Refresh token
```

### Generic CRUD (Cần Authorization)
```
GET    /api/v1/:model           # Lấy tất cả
GET    /api/v1/:model/:id       # Lấy 1 item
POST   /api/v1/:model           # Tạo mới
PUT    /api/v1/:model/:id       # Cập nhật
DELETE /api/v1/:model/:id       # Xóa
```

**Models hỗ trợ:**
- `users` - Người dùng
- `students` - Học sinh
- `buses` - Xe bus
- `routes` - Tuyến đường
- `schedules` - Lịch trình
- `trips` - Chuyến đi
- `stations` - Điểm dừng
- `locations` - Vị trí GPS
- `notifications` - Thông báo
- `alerts` - Cảnh báo

### Ví dụ
```bash
# Lấy tất cả xe bus
GET /api/v1/buses
Authorization: Bearer <access_token>

# Tạo xe bus mới
POST /api/v1/buses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "licensePlate": "29A-12345"
}
```

## 🔐 Phân quyền

- **Admin**: Toàn quyền
- **Manager**: Quản lý lịch trình, tuyến đường
- **Parent**: Xem thông tin con, theo dõi xe
- **Driver**: Cập nhật vị trí, trạng thái chuyến đi

## 🐛 Debug & Troubleshooting

### Server không khởi động
- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra PORT có bị chiếm chưa
- Kiểm tra file .env đã tạo chưa

### Lỗi kết nối Database
```bash
# Kiểm tra MongoDB
mongosh

# Hoặc xem service
services.msc (tìm MongoDB)
```

### Lỗi JWT
- Kiểm tra ACCESS_TOKEN_SECRET và REFRESH_TOKEN_SECRET trong .env
- Đảm bảo token được gửi đúng format: `Authorization: Bearer <token>`

## 👥 Team

- **Branch**: Bao
- **Repository**: CNPM-A/CNPM-

## 📄 License

ISC

---

**Happy Coding! 🚀**
