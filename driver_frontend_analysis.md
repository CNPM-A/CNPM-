# Driver Frontend: Phân Tích Mock Data & API Gaps

## 📊 Tổng Quan

**Trạng thái hiện tại (commit 4c7505c):**
- ✅ Có kết nối cơ bản với backend API
- ⚠️ Tất cả services đều có **mock fallback** khi API fail
- ⚠️ RouteTrackingContext sử dụng **hardcoded mock data** làm initial state
- ⚠️ Một số feature chưa integrate hoàn toàn với backend

---

## 🔍 I. MOCK DATA ĐANG SỬ DỤNG

### 1. Services với Mock Fallback

#### A. `tripService.js` (7/11 functions có mock)
```javascript
// File: src/services/tripService.js
// Mock source: src/mocks/mockTripResponses.js

✅ getAllTrips()       → mockGetAllTripsResponse
✅ getTrip()           → mockGetTripResponse  
✅ getTripStudents()   → mockGetTripStudentsResponse
✅ getMySchedule()     → mockMyScheduleResponse
✅ createTrip()        → mockGetTripResponse
✅ updateTrip()        → mockGetTripResponse
✅ checkIn()           → mockCheckInResponse
✅ checkInWithFace()   → mockCheckInWithFaceResponse
✅ markAsAbsent()      → mockMarkAsAbsentResponse

// Không có mock:
✓ deleteTrip() - ném lỗi khi fail
```

**Vấn đề:** Khi backend API unavailable/fail, trang vẫn hiển thị mock data thay vì error → user không biết data không thật.

#### B. `notificationService.js` (4/6 functions có mock)
```javascript
// File: src/services/notificationService.js

✅ getMyNotifications() → mockMyNotificationsResponse
✅ deleteNotification() → return true (fake success)
✅ markAsRead()         → return fake success object
✅ markAllAsRead()      → return true (fake success)

// Không có mock:
✓ createNotification() - ném lỗi
✓ sendNotification()   - ném lỗi
```

#### C. `messageService.js` (1/1 function có mock)
```javascript
// File: src/services/messageService.js

✅ getMyMessages() → mockGetMyMessagesResponse
```

### 2. RouteTrackingContext - Hardcoded Mock Data

#### A. Mock Constants (lines 535-606)
```javascript
// File: src/context/RouteTrackingContext.jsx

// 1. STUDENTS_DATABASE (line 535)
const STUDENTS_DATABASE = {
  hs1: { id: 'hs1', name: 'Nguyễn Văn A', ... },
  // ... 10 mock students
};

// 2. ROUTES_BASE_STATIONS (line 547)
const ROUTES_BASE_STATIONS = [
  { id: 'trường', name: 'Trường THCS', position: [10.762622, 106.660172], time: '06:30' },
  // ... 4 mock stations
];

// 3. createStudentsByRoute() (line 558)
// Gán students vào từng trạm (hardcoded logic)

// 4. createDailyRoutes() (line 575)
// Tạo 3 routes/day với mock data

// 5. ROUTES_WEEK (line 606)
// Tạo routes cho cả tuần
```

#### B. Initial State Uses Mock (line 659)
```javascript
const [stations, setStations] = useState(ROUTES_BASE_STATIONS);
```

#### C. syncDataFromBackend Fallback (line 707)
```javascript
const stationData = await getAllStations();
setStations(stationData.data?.stations || ROUTES_BASE_STATIONS); // Fallback mock
```

#### D. routesToday Uses Mock (line 679)
```javascript
const routesToday = useMemo(
  () => ROUTES_WEEK[todayLabel] || createDailyRoutes(todayLabel), 
  [todayLabel]
);
```

**Vấn đề:** Context luôn có mock data ngay từ init, không đợi backend → map/UI hiển thị mock data ngay cả khi có API.

---

## 🌐 II. BACKEND APIs ĐÃ CÓ

### 1. Trip APIs (`/api/v1/trips`)

| Method | Endpoint | Role | Controller | Frontend Service |
|--------|----------|------|------------|------------------|
| `GET` | `/` | Admin, Manager, Driver, Parent | `getAllTrips` | ✅ `tripService.getAllTrips()` |
| `GET` | `/:id` | Admin, Manager, Driver, Parent | `getTrip` | ✅ `tripService.getTrip(id)` |
| `GET` | `/my-schedule` | Driver | `getMySchedule` | ✅ `tripService.getMySchedule()` |
| `GET` | `/:id/students` | Driver | `getStudents` | ✅ `tripService.getTripStudents(id)` |
| `POST` | `/` | Admin, Manager | `createTrip` | ✅ `tripService.createTrip(data)` |
| `PATCH` | `/:id` | Admin, Manager | `updateTrip` | ✅ `tripService.updateTrip(id, data)` |
| `DELETE` | `/:id` | Admin, Manager | `deleteTrip` | ✅ `tripService.deleteTrip(id)` |
| `PATCH` | `/:id/check-in` | Admin, Driver | `checkIn` | ✅ `tripService.checkIn(id, data)` |
| `PATCH` | `/:id/mark-absent` | Driver | `markAsAbsent` | ✅ `tripService.markAsAbsent(id, studentId)` |
| `POST` | `/:id/check-in-face` | Driver | `checkInWithFace` | ✅ `tripService.checkInWithFace(id, image)` |

**Status:** ✅ Tất cả APIs đã có service tương ứng, nhưng có mock fallback.

### 2. Notification APIs (`/api/v1/notifications`)

| Method | Endpoint | Role | Controller | Frontend Service |
|--------|----------|------|------------|------------------|
| `GET` | `/me` | All | `getMyNotifications` | ✅ `notificationService.getMyNotifications()` |
| `DELETE` | `/:id` | All | `deleteMyNotification` | ✅ `notificationService.deleteNotification(id)` |

**Missing in backend (nếu cần):**
- ❌ `POST /notifications` - Create notification (mentioned in frontend code)
- ❌ `PATCH /notifications/:id` - Mark as read
- ❌ `PATCH /notifications/mark-all-read` - Mark all as read

### 3. Message APIs (`/api/v1/messages`)

| Method | Endpoint | Role | Controller | Frontend Service |
|--------|----------|------|------------|------------------|
| `GET` | `/me` | All | `getMyMessage` | ✅ `messageService.getMyMessages()` |

**Status:** ✅ Có API cơ bản.

### 4. Other APIs Available

**Station APIs (`/api/v1/stations`):**
- `GET /` - Get all stations
- `GET /:id` - Get station by ID
- `POST /` - Create station
- `PATCH /:id` - Update station
- `DELETE /:id` - Delete station

**Route APIs (`/api/v1/routes`):**
- `GET /` - Get all routes
- `GET /:id` - Get route by ID
- `POST /` - Create route
- `PATCH /:id` - Update route
- `DELETE /:id` - Delete route

**Schedule APIs (`/api/v1/schedules`):**
- `GET /` - Get all schedules
- `GET /:id` - Get schedule by ID
- `GET /:id/route` - Get route info for schedule
- `POST /` - Create schedule
- `PATCH /:id` - Update schedule
- `DELETE /:id` - Delete schedule

---

## ❌ III. MISSING INTEGRATIONS / GÁP

### 1. Driver Pages Chưa Kết Nối API Đúng

#### `DriverHome.jsx`
- ⚠️ Không fetch trip/schedule khi mount
- ⚠️ Sử dụng data từ RouteTrackingContext (có mock)
- ✅ Recommendation: Call `getMySchedule()` on mount, chọn active trip

#### `DriverDailySchedule.jsx`
- ⚠️ Không fetch trips list
- ⚠️ Sử dụng `routesToday` từ context (mock data)
- ✅ Recommendation: Call `getMySchedule()`, hiển thị danh sách trips thật

#### `DriverOperations.jsx`
- ⚠️ Chưa rõ luồng check-in
- ✅ Recommendation: Integrate `checkIn()`, `markAsAbsent()`, `checkInWithFace()`

#### `DriverContacts.jsx`
- ⚠️ Sử dụng `allStudentsForContact` từ context (mock)
- ✅ Recommendation: Fetch danh sách students từ trip hiện tại

### 2. RouteTrackingContext Cần Refactor

**Vấn đề:**
1. Initial state = mock data → UI luôn hiển thị mock ngay cả khi có API
2. `syncDataFromBackend()` có fallback mock → không biết API fail
3. `routesToday` uses `ROUTES_WEEK` (mock) thay vì trips từ `getMySchedule()`

**Giải pháp:**
```javascript
// Thay vì:
const [stations, setStations] = useState(ROUTES_BASE_STATIONS);
const routesToday = useMemo(() => ROUTES_WEEK[todayLabel] || ..., [todayLabel]);

// Nên:
const [stations, setStations] = useState([]); // Empty init
const [trips, setTrips] = useState([]); // From getMySchedule()
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchData() {
    try {
      const schedule = await getMySchedule();
      setTrips(schedule);
      // Select active trip and load its details
      const activeTrip = schedule.find(t => t.status === 'IN_PROGRESS') || schedule[0];
      if (activeTrip) {
        const fullTrip = await getTrip(activeTrip._id);
        setStations(fullTrip.routeId.orderedStops.map(...)); // Convert to UI format
        // ... set students, route shape, etc.
      }
    } catch (err) {
      setError(err.message);
      // NO MOCK FALLBACK - let UI handle error
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

### 3. Backend Features Frontend Chưa Dùng

#### A. Route Shape (`trip.routeId.shape`)
- ✅ Backend có: `trip.routeId.shape` (GeoJSON coordinates)
- ❌ Frontend chưa dùng: Map component vẽ route bằng OSRM API external
- ✅ Fix: Use `RouteMapWithBackend` component, pass `routeShape` from backend

#### B. Real-time Updates (Socket.io)
- ✅ Backend có: Socket events cho bus location, check-in
- ⚠️ Frontend có `socketService.js` nhưng chưa integrate hết trong pages
- ✅ Fix: Connect socket when trip starts, listen to events, update UI

#### C. Face ID Check-in
- ✅ Backend có: `POST /:id/check-in-face` với Python AI service
- ⚠️ Frontend có UI nhưng chưa test kỹ
- ✅ Fix: Test luồng upload ảnh → AI recognize → backend update

#### D. Notification Read Status
- ❌ Backend chưa có API `markAsRead`, `markAllAsRead`
- ⚠️ Frontend có service functions nhưng chỉ return fake success
- ✅ Fix: Backend cần thêm APIs này hoặc frontend xóa functions

---

## 📋 IV. KHUYẾN NGHỊ ĐỂ HOÀN THIỆN

### Phase 1: Loại Bỏ Mock Fallbacks (Ưu tiên cao)

**A. Services (tripService, notificationService, messageService)**
```javascript
// Thay vì:
} catch (error) {
  console.warn('API failed → using mock');
  return mockData;
}

// Nên:
} catch (error) {
  console.error('API failed:', error);
  throw new Error(error.response?.data?.message || 'API error');
}
```

**Impact:** UI sẽ hiển thị error khi API fail, user biết có vấn đề.

**B. RouteTrackingContext**
1. Xóa `STUDENTS_DATABASE`, `ROUTES_BASE_STATIONS`, `ROUTES_WEEK`
2. Init state = empty `[]`
3. Fetch data from `getMySchedule()` + `getTrip()` + `getTripStudents()`
4. Xóa `syncDataFromBackend()` fallback mock

### Phase 2: Integrate Backend Route Shape

**Component:** `RouteMapWithBackend.jsx` (đã có sẵn)

**Data flow:**
```
getTrip(tripId) 
  → response.data.routeId.shape (GeoJSON coordinates)
  → Pass to RouteMapWithBackend
  → Vẽ polyline trên map
```

**Files cần sửa:**
- `DriverHome.jsx`: Thay `RouteMap` → `RouteMapWithBackend`
- `DriverDailySchedule.jsx`: Thay `RouteMap` → `RouteMapWithBackend`
- `RouteTrackingContext.jsx`: Lưu `routeShape` state

### Phase 3: Auto-init Trip khi Page Load

**DriverHome.jsx:**
```javascript
useEffect(() => {
  async function init() {
    try {
      const schedule = await getMySchedule();
      const activeTrip = schedule.find(t => t.status === 'IN_PROGRESS') || schedule[0];
      if (activeTrip) {
        // Gọi context.initializeTrip(activeTrip._id)
        // hoặc fetch getTrip() + getTripStudents() ngay tại đây
      }
    } catch (err) {
      setError(err.message);
    }
  }
  init();
}, []);
```

**DriverDailySchedule.jsx:**
```javascript
useEffect(() => {
  async function fetchTrips() {
    const trips = await getMySchedule();
    setTrips(trips);
    // Auto-select first trip và init
    if (trips[0]) {
      await initializeTrip(trips[0]._id);
    }
  }
  fetchTrips();
}, []);
```

### Phase 4: Hoàn Thiện Socket.io Integration

**Features cần:**
1. Bus location updates → Update marker trên map real-time
2. Student check-in events → Update UI ngay lập tức
3. Trip completed events → Chuyển sang chuyến tiếp theo

**Files:**
- `socketService.js` - Đã có sẵn logic
- `RouteTrackingContext.jsx` - Connect socket khi `startTracking()`
- `RouteMapWithBackend.jsx` - Hiển thị bus position real-time

### Phase 5: Backend APIs Còn Thiếu (Optional)

**Notification:**
```javascript
// Backend cần thêm:
router.patch('/notifications/:id', markAsRead);
router.patch('/notifications/mark-all-read', markAllAsRead);

// Hoặc frontend xóa functions này nếu không cần
```

**Message:**
- Chỉ có `GET /me` - Có đủ cho driver
- Nếu cần chat feature → Backend cần thêm `POST /messages`

---

## 🎯 V. CHECKLIST IMPLEMENTATION

### Loại Bỏ Mock Data
- [ ] **tripService.js**: Xóa mock imports và fallbacks
- [ ] **notificationService.js**: Xóa mock imports và fallbacks  
- [ ] **messageService.js**: Xóa mock imports và fallbacks
- [ ] **RouteTrackingContext.jsx**: Xóa STUDENTS_DATABASE constant
- [ ] **RouteTrackingContext.jsx**: Xóa ROUTES_BASE_STATIONS constant
- [ ] **RouteTrackingContext.jsx**: Xóa createDailyRoutes, ROUTES_WEEK
- [ ] **RouteTrackingContext.jsx**: Đổi initial state từ mock → `[]`

### Integrate Backend Data
- [ ] **RouteTrackingContext**: Fetch trips từ `getMySchedule()` on init
- [ ] **RouteTrackingContext**: Fetch trip details từ `getTrip(tripId)`
- [ ] **RouteTrackingContext**: Fetch students từ `getTripStudents(tripId)`
- [ ] **RouteTrackingContext**: Extract `routeShape` từ `trip.routeId.shape`
- [ ] **RouteTrackingContext**: Extract `stations` từ `trip.routeId.orderedStops`

### Update Driver Pages
- [ ] **DriverHome**: Auto-init trip from `getMySchedule()` on mount
- [ ] **DriverHome**: Đổi `RouteMap` → `RouteMapWithBackend`
- [ ] **DriverHome**: Pass `routeShape` prop from context
- [ ] **DriverDailySchedule**: Fetch và hiển thị trips list từ API
- [ ] **DriverDailySchedule**: Đổi `RouteMap` → `RouteMapWithBackend`
- [ ] **DriverDailySchedule**: Auto-init first trip on load
- [ ] **DriverOperations**: Verify check-in flow uses real API
- [ ] **DriverContacts**: Fetch students từ current trip

### Socket.io Real-time
- [ ] **RouteTrackingContext**: Connect socket khi `startTracking()`
- [ ] **RouteMapWithBackend**: Listen `bus:location_changed` event
- [ ] **RouteTrackingContext**: Listen `student:checked_in` event
- [ ] **RouteTrackingContext**: Listen `trip:completed` event

### Error Handling
- [ ] Add loading states cho tất cả pages
- [ ] Add error UI khi API fails (không dùng mock)
- [ ] Add retry mechanism hoặc refresh button
- [ ] Add offline detection

---

## 📊 VI. TÓM TẮT

### Tình Trạng Hiện Tại
✅ **Có sẵn:**
- Backend APIs đầy đủ cho driver features
- Frontend services đã map đúng với backend APIs
- Socket.io infrastructure đã có

⚠️ **Vấn đề:**
- **Mock fallbacks everywhere** → Không biết API có hoạt động không
- **Context init với mock data** → UI luôn hiển thị mock
- **Pages không fetch data** → Dựa vào context mock
- **Route shape không dùng backend** → Dùng external OSRM

### Công Việc Cần Làm
1. **Loại bỏ tất cả mock fallbacks** (1-2 giờ)
2. **Refactor RouteTrackingContext** để fetch từ backend (2-3 giờ)
3. **Update driver pages** auto-fetch data (1-2 giờ)  
4. **Integrate RouteMapWithBackend** với backend route shape (1 giờ)
5. **Test real-time features** với Socket.io (1 giờ)

**Tổng estimate:** 6-9 giờ để hoàn thiện driver frontend.

---

## 🔗 VII. FILES LIÊN QUAN

### Frontend Files Cần Sửa
```
src/
├── services/
│   ├── tripService.js           ⚠️ Xóa mock fallbacks
│   ├── notificationService.js   ⚠️ Xóa mock fallbacks
│   └── messageService.js        ⚠️ Xóa mock fallbacks
├── context/
│   └── RouteTrackingContext.jsx ⚠️ Xóa mock data, fetch từ API
├── pages/driver/
│   ├── DriverHome.jsx           ⚠️ Auto-init trip, use RouteMapWithBackend
│   ├── DriverDailySchedule.jsx  ⚠️ Fetch trips list, auto-init
│   ├── DriverOperations.jsx     ✅ Verify check-in flow
│   └── DriverContacts.jsx       ⚠️ Fetch students từ trip
└── components/maps/
    └── RouteMapWithBackend.jsx  ✅ Đã sẵn sàng dùng backend shape
```

### Backend Files (Reference Only)
```
backend/
├── routes/
│   ├── trip.route.js           ✅ 10 endpoints
│   ├── notification.route.js   ✅ 2 endpoints
│   └── message.route.js        ✅ 1 endpoint
└── controllers/
    ├── trip.controller.js      ✅ Full CRUD + check-in + Face ID
    ├── notification.controller.js
    └── message.controller.js
```

---