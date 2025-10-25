# 🚀 HƯỚNG DẪN SETUP VÀ CHẠY DỰ ÁN

## 📌 BƯỚC 1: CÀI ĐẶT MONGODB

### Cách 1: MongoDB Community (Cài trên máy - Khuyên dùng)

1. **Download MongoDB Community Server**
   - Truy cập: https://www.mongodb.com/try/download/community
   - Chọn version: Windows
   - Click Download

2. **Cài đặt**
   - Chạy file .msi vừa download
   - Chọn "Complete" installation
   - ✅ **QUAN TRỌNG**: Tick vào "Install MongoDB as a Service"
   - ✅ Tick "Install MongoDB Compass" (GUI tool)
   - Click Install

3. **Kiểm tra MongoDB đã chạy**
   ```cmd
   # Mở Command Prompt
   mongosh
   ```
   
   Nếu thấy:
   ```
   Current Mongosh Log ID: ...
   Connecting to: mongodb://127.0.0.1:27017
   ```
   → ✅ THÀNH CÔNG!

4. **Nếu mongosh chưa có, thêm vào PATH**
   - Tìm folder: `C:\Program Files\MongoDB\Server\7.0\bin`
   - Thêm vào Environment Variables → Path
   - Restart terminal

---

### Cách 2: MongoDB Atlas (Cloud - Miễn phí)

1. **Đăng ký MongoDB Atlas**
   - Truy cập: https://www.mongodb.com/cloud/atlas/register
   - Đăng ký tài khoản miễn phí

2. **Tạo Cluster**
   - Chọn "Create a FREE cluster"
   - Chọn region gần nhất (Singapore)
   - Click "Create Cluster"

3. **Lấy Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/school_bus_db
   ```

4. **Sửa file `.env`**
   ```env
   DB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/school_bus_db
   ```

---

## 📌 BƯỚC 2: CÀI ĐẶT DEPENDENCIES

```cmd
npm install
```

**Kết quả mong đợi**:
```
added 85 packages
```

---

## 📌 BƯỚC 3: KIỂM TRA FILE .env

File `.env` phải có nội dung:
```env
NODE_ENV=development
PORT=3000
DB_URL=mongodb://localhost:27017/school_bus_db
ACCESS_TOKEN_SECRET=SchoolBus2025AccessTokenSecretKeyForDevelopmentUseOnly12345
REFRESH_TOKEN_SECRET=SchoolBus2025RefreshTokenSecretKeyForDevelopmentUseOnly67890
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

✅ File này đã được tạo sẵn!

---

## 📌 BƯỚC 4: CHẠY SERVER

### Option 1: Development mode (tự động restart khi sửa code)
```cmd
npm run dev
```

### Option 2: Production mode
```cmd
npm start
```

**Kết quả mong đợi**:
```
Connecting to DB URL: localhost:27017/school_bus_db
Database connected successfully!
App running on port 3000...
```

---

## 📌 BƯỚC 5: TEST API

### A. Cài REST Client Extension

1. Mở VS Code
2. Nhấn `Ctrl+Shift+X` (Extensions)
3. Tìm: **REST Client**
4. Click **Install** (by Huachao Mao)

### B. Mở file test

1. Mở file: `tests/api.http`
2. Tìm request đầu tiên (1.1 - Đăng ký Admin)
3. Click **"Send Request"** phía trên request
4. Xem kết quả bên phải

### C. Test theo thứ tự

Làm theo file `tests/TEST_GUIDE.md`:
1. ✅ Test Authentication (requests 1.1 → 1.7)
2. ✅ Test Users CRUD (requests 2.1 → 2.5)
3. ✅ Test Buses (requests 3.1 → 3.5)
4. ✅ ... tiếp tục

---

## 🎯 QUICK START (Chạy nhanh)

```cmd
# 1. Đảm bảo MongoDB đang chạy (nếu dùng local)
mongosh

# 2. Mở terminal mới, chạy server
npm run dev

# 3. Mở VS Code, mở file tests/api.http
# 4. Click "Send Request" ở request 1.1
# 5. Copy accessToken từ response
# 6. Paste vào biến @accessToken ở đầu file
# 7. Tiếp tục test các requests khác
```

---

## ❌ TROUBLESHOOTING (Xử lý lỗi)

### Lỗi: "MongoDB connection error"

**Nguyên nhân**: MongoDB chưa chạy

**Giải pháp**:
```cmd
# Kiểm tra service
services.msc
# Tìm "MongoDB Server" → Start

# Hoặc start manually
net start MongoDB
```

---

### Lỗi: "Port 3000 already in use"

**Giải pháp 1**: Đổi port trong `.env`
```env
PORT=3001
```

**Giải pháp 2**: Kill process đang dùng port 3000
```cmd
# Tìm process
netstat -ano | findstr :3000

# Kill process (thay PID)
taskkill /PID 1234 /F
```

---

### Lỗi: "Cannot find module ..."

**Giải pháp**:
```cmd
# Xóa node_modules và cài lại
rmdir /s /q node_modules
npm install
```

---

### Lỗi: "JWT must be provided"

**Nguyên nhân**: Chưa đăng nhập hoặc token hết hạn

**Giải pháp**:
1. Chạy request 1.4 (signin) để lấy token mới
2. Copy `accessToken` từ response
3. Paste vào biến `@accessToken` ở đầu file `api.http`:
   ```
   @accessToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 📊 XEM DỮ LIỆU TRONG DATABASE

### Dùng MongoDB Compass (GUI)

1. Mở MongoDB Compass
2. Connect string: `mongodb://localhost:27017`
3. Chọn database: `school_bus_db`
4. Xem các collections: users, buses, students, ...

### Dùng Command Line

```cmd
mongosh
use school_bus_db
db.users.find().pretty()
db.buses.find()
db.students.find()
```

---

## 🔄 XÓA DỮ LIỆU ĐỂ TEST LẠI

```cmd
mongosh
use school_bus_db
db.dropDatabase()
exit
```

Sau đó chạy lại từ request 1.1 (đăng ký Admin)

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] MongoDB đã cài và chạy
- [ ] `npm install` thành công
- [ ] File `.env` đã có
- [ ] Server chạy thành công (`npm run dev`)
- [ ] REST Client extension đã cài
- [ ] Test request 1.1 (signup) thành công
- [ ] Test request 1.4 (signin) thành công
- [ ] Test request 2.1 (get users) thành công

---

## 📞 HỖ TRỢ

Nếu gặp lỗi không giải quyết được:
1. Copy toàn bộ error message
2. Check logs trong terminal
3. Check MongoDB có đang chạy không
4. Đọc kỹ error message để tìm nguyên nhân

**Good Luck! 🚀**
