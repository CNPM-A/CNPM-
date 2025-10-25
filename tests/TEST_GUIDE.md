# 🧪 HƯỚNG DẪN TEST HỆ THỐNG SCHOOL BUS

## 📋 CHECKLIST TEST

### ✅ 1. CÀI ĐẶT MÔI TRƯỜNG

- [ ] MongoDB đã cài đặt và đang chạy
- [ ] Node.js đã cài (version >= 14)
- [ ] Dependencies đã cài: `npm install`
- [ ] File `.env` đã được tạo từ `.env.example`
- [ ] REST Client extension đã cài trong VS Code

### ✅ 2. KHỞI ĐỘNG SERVER

```bash
# Chạy lệnh này trong terminal
npm run dev
```

**Kết quả mong đợi:**
```
Connecting to DB URL: localhost:27017/school_bus_db
Database connected successfully!
App running on port 3000...
```

---

## 🎯 KỊCH BẢN TEST THEO THỨ TỰ

### 📍 BƯỚC 1: TEST AUTHENTICATION (Xác thực)

#### 1.1 Đăng ký tài khoản Admin
**File**: `tests/api.http` - Request 1.1

**Input**:
```json
{
  "name": "Admin Test",
  "email": "admin@test.com",
  "phoneNumber": "0123456789",
  "password": "Admin123456",
  "role": "Admin"
}
```

**Kết quả mong đợi**:
- ✅ Status: 201 Created
- ✅ Response có `accessToken`
- ✅ Response có `data.user` với thông tin admin (không có password)
- ✅ Cookie `refreshToken` được set

**Lưu lại**: Copy `accessToken` để dùng cho các request sau

---

#### 1.2 Đăng ký thêm 2 tài khoản (Parent, Driver)
**File**: `tests/api.http` - Request 1.2, 1.3

**Kết quả mong đợi**: Tương tự 1.1

---

#### 1.3 Đăng nhập với email
**File**: `tests/api.http` - Request 1.4

**Input**:
```json
{
  "username": "admin@test.com",
  "password": "Admin123456"
}
```

**Kết quả mong đợi**:
- ✅ Status: 200 OK
- ✅ Nhận được `accessToken` mới
- ✅ Cookie `refreshToken` được update

---

#### 1.4 Đăng nhập với số điện thoại
**File**: `tests/api.http` - Request 1.5

**Kết quả mong đợi**: Tương tự 1.3

---

#### 1.5 Test đăng nhập SAI mật khẩu
**File**: `tests/api.http` - Request 12.1

**Kết quả mong đợi**:
- ✅ Status: 401 Unauthorized
- ✅ Message: "Incorrect email, phone number, or password"

---

#### 1.6 Test refresh token
**File**: `tests/api.http` - Request 1.6

**Kết quả mong đợi**:
- ✅ Status: 200 OK
- ✅ Nhận được `accessToken` mới

---

#### 1.7 Test logout
**File**: `tests/api.http` - Request 1.7

**Kết quả mong đợi**:
- ✅ Status: 204 No Content
- ✅ Cookie `refreshToken` bị xóa

---

### 📍 BƯỚC 2: TEST CRUD USERS

**⚠️ LƯU Ý**: Thay `{{accessToken}}` trong file `.http` bằng token thật nhận được từ signin

#### 2.1 Lấy danh sách users
**File**: `tests/api.http` - Request 2.1

**Kết quả mong đợi**:
- ✅ Status: 200 OK
- ✅ `result`: 3 (Admin, Parent, Driver đã tạo)
- ✅ `data`: Array chứa 3 users

---

#### 2.2 Tạo user mới (Manager)
**File**: `tests/api.http` - Request 2.3

**Kết quả mong đợi**:
- ✅ Status: 201 Created
- ✅ `data` chứa thông tin Manager vừa tạo
- ✅ **LƯU LẠI** `_id` của Manager để test update/delete

---

#### 2.3 Lấy thông tin 1 user
**File**: `tests/api.http` - Request 2.2

**Thay đổi**: Sửa ID trong URL thành ID của Manager vừa tạo
```
GET {{baseUrl}}/users/672b9a5c3e4f2a1b3c5d6e7f
                      ^^^^^ Thay bằng _id thật
```

**Kết quả mong đợi**:
- ✅ Status: 200 OK
- ✅ `data` chứa đúng thông tin Manager

---

#### 2.4 Cập nhật user
**File**: `tests/api.http` - Request 2.4

**Kết quả mong đợi**:
- ✅ Status: 200 OK
- ✅ `data.name` = "Manager Updated"

---

#### 2.5 Test truy cập KHÔNG có token
**File**: `tests/api.http` - Request 12.2

**Kết quả mong đợi**:
- ✅ Status: 401 Unauthorized
- ✅ Message: "You are not logged in..."

---

#### 2.6 Test với token không hợp lệ
**File**: `tests/api.http` - Request 12.3

**Kết quả mong đợi**:
- ✅ Status: 401 Unauthorized
- ✅ Message: "Token is invalid or expired..."

---

### 📍 BƯỚC 3: TEST BUSES (Xe bus)

#### 3.1 Tạo 3 xe bus
**File**: `tests/api.http` - Request 3.2, 3.3

**Kết quả mong đợi**:
- ✅ 3 xe được tạo với biển số khác nhau
- ✅ `isAssigned` = false (mặc định)

---

#### 3.2 Lấy danh sách buses
**File**: `tests/api.http` - Request 3.1

**Kết quả mong đợi**:
- ✅ `result`: 3
- ✅ `data`: Array có 3 buses

---

#### 3.3 Cập nhật bus
**File**: `tests/api.http` - Request 3.4

**Kết quả mong đợi**:
- ✅ `isAssigned` = true

---

### 📍 BƯỚC 4: TEST STATIONS (Điểm dừng)

#### 4.1 Tạo 2 stations
**File**: `tests/api.http` - Request 4.2, 4.3

**Kết quả mong đợi**:
- ✅ Stations được tạo với địa chỉ đầy đủ
- ✅ **LƯU LẠI** 2 `_id` của stations để dùng cho Routes

---

### 📍 BƯỚC 5: TEST ROUTES (Tuyến đường)

#### 5.1 Tạo route
**File**: `tests/api.http` - Request 5.2

**⚠️ SỬA**: Thay `stopPoints` bằng 2 station IDs thật

```json
{
  "name": "Tuyến 01 - Quận 1 - Quận 7",
  "stopPoints": [
    "672b...",  // ID station 1
    "672b..."   // ID station 2
  ]
}
```

**Kết quả mong đợi**:
- ✅ Route được tạo với 2 điểm dừng
- ✅ **LƯU LẠI** route `_id`

---

### 📍 BƯỚC 6: TEST STUDENTS (Học sinh)

#### 6.1 Tạo student
**File**: `tests/api.http` - Request 6.2

**⚠️ SỬA**: Thay các IDs:
```json
{
  "name": "Nguyễn Văn A",
  "grade": "Lớp 10A1",
  "parentId": "...",      // ID của Parent
  "routeId": "...",       // ID của Route vừa tạo
  "pickupStopId": "...",  // ID station 1
  "dropoffStopId": "..."  // ID station 2
}
```

**Kết quả mong đợi**:
- ✅ Student được tạo thành công
- ✅ **LƯU LẠI** student `_id`

---

### 📍 BƯỚC 7: TEST SCHEDULES (Lịch trình)

#### 7.1 Tạo schedule
**File**: `tests/api.http` - Request 7.2

**⚠️ SỬA**: Thay tất cả IDs thật

**Kết quả mong đợi**:
- ✅ Schedule được tạo
- ✅ **LƯU LẠI** schedule `_id`

---

### 📍 BƯỚC 8: TEST TRIPS (Chuyến đi)

#### 8.1 Tạo trip
**File**: `tests/api.http` - Request 8.2

**Kết quả mong đợi**:
- ✅ Trip được tạo với status = "NOT_STARTED"

---

#### 8.2 Cập nhật trip status
**File**: `tests/api.http` - Request 8.3

**Kết quả mong đợi**:
- ✅ `status` = "IN_PROGRESS"
- ✅ `studentsPickedUp` = 5

---

### 📍 BƯỚC 9: TEST LOCATIONS (GPS)

#### 9.1 Gửi vị trí GPS
**File**: `tests/api.http` - Request 9.2

**Kết quả mong đợi**:
- ✅ Location được lưu với timestamp tự động

---

#### 9.2 Lấy danh sách locations
**File**: `tests/api.http` - Request 9.1

**Kết quả mong đợi**:
- ✅ Thấy location vừa gửi

---

### 📍 BƯỚC 10: TEST NOTIFICATIONS & ALERTS

#### 10.1 Tạo notification
**File**: `tests/api.http` - Request 10.2

**Kết quả mong đợi**:
- ✅ Notification được tạo
- ✅ Có `createdAt` timestamp

---

#### 10.2 Tạo alert
**File**: `tests/api.http` - Request 11.2

**Kết quả mong đợi**:
- ✅ Alert được tạo thành công

---

## 🐛 TEST ERROR CASES (Các trường hợp lỗi)

### ❌ Test email trùng
**File**: `tests/api.http` - Request 12.4

**Kết quả mong đợi**:
- ✅ Status: 500 (MongoDB duplicate key error)
- ✅ Message chứa "duplicate key"

---

### ❌ Test lấy ID không tồn tại
**File**: `tests/api.http` - Request 12.5

**Kết quả mong đợi**:
- ❌ **HIỆN TẠI**: Status 200, data: null (BUG!)
- ✅ **NÊN LÀ**: Status 404, message: "No document found"

---

### ❌ Test endpoint không tồn tại
**File**: `tests/api.http` - Request 12.6

**Kết quả mong đợi**:
- ✅ Status: 404
- ✅ Message: "Can't find /api/v1/invalid-endpoint"

---

## 📊 BẢNG TỔNG KẾT TEST

| Chức năng | Số Test Cases | Passed | Failed | Notes |
|-----------|---------------|--------|--------|-------|
| Authentication | 7 | ? | ? | |
| Users CRUD | 6 | ? | ? | |
| Buses CRUD | 3 | ? | ? | |
| Stations CRUD | 2 | ? | ? | |
| Routes CRUD | 1 | ? | ? | |
| Students CRUD | 1 | ? | ? | |
| Schedules CRUD | 1 | ? | ? | |
| Trips CRUD | 2 | ? | ? | |
| Locations CRUD | 2 | ? | ? | |
| Notifications | 1 | ? | ? | |
| Alerts | 1 | ? | ? | |
| Error Handling | 4 | ? | ? | |
| **TOTAL** | **31** | **?** | **?** | |

---

## 🔍 DEBUG TIPS

### Xem logs trong MongoDB
```bash
mongosh
use school_bus_db
db.users.find()
db.buses.find()
```

### Xóa tất cả data để test lại
```bash
mongosh
use school_bus_db
db.dropDatabase()
```

### Xem request/response chi tiết
- Mở tab "Network" trong REST Client response
- Xem headers, cookies, timing

---

## ✅ HOÀN THÀNH

Sau khi test xong tất cả, bạn có thể:
1. ✅ Tích vào checklist
2. ✅ Ghi lại số Passed/Failed
3. ✅ Report bugs tìm được
4. ✅ Tạo test cases tự động (nếu cần)

**Happy Testing! 🚀**
