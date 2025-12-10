# 🔧 Driver Frontend: Kế Hoạch Chỉnh Sửa Chi Tiết

**Mục tiêu:** Loại bỏ mock data, kết nối API backend thực, tránh lỗi tiềm ẩn.

---

## 📑 MỤC LỤC

1. [Tổng quan vấn đề](#-i-tổng-quan-vấn-đề)
2. [Bước 1: Sửa tripService.js](#-bước-1-sửa-tripservicejs)
3. [Bước 2: Sửa RouteTrackingContext.jsx](#-bước-2-sửa-routetrackingcontextjsx)
4. [Bước 3: Sửa DriverHome.jsx](#-bước-3-sửa-driverhomejsx)
5. [Bước 4: Sửa DriverDailySchedule.jsx](#-bước-4-sửa-driverdailyschedulejsx)
6. [Bước 5: Sửa các service khác](#-bước-5-sửa-các-service-khác)
7. [Bước 6: Cleanup mock files](#-bước-6-cleanup-mock-files)
8. [Thứ tự thực hiện](#-thứ-tự-thực-hiện)

---

## 🔍 I. TỔNG QUAN VẤN ĐỀ

### Các file có vấn đề và vị trí cụ thể:

| File | Vấn đề | Dòng code |
|------|--------|-----------|
| `tripService.js` | Mock fallback khi API fail | 189-257 |
| `RouteTrackingContext.jsx` | Hardcoded mock data | 535-606, 659, 679, 683-684, 707 |
| `DriverHome.jsx` | Dùng `RouteMap` thay vì `RouteMapWithBackend` | 358 |
| `DriverDailySchedule.jsx` | Cùng vấn đề với DriverHome | Tương tự |
| `notificationService.js` | Mock fallback | 120-122 |
| `messageService.js` | Mock fallback | 10-11 |

---

## 📝 BƯỚC 1: Sửa tripService.js

**File:** `src/services/tripService.js`

### Vấn đề 1.1: Import mock data (dòng 189-198)
```javascript
// ❌ HIỆN TẠI - XÓA ĐOẠN NÀY
import {
  mockMyScheduleResponse,
  mockGetTripResponse,
  mockGetTripStudentsResponse,
  mockCheckInResponse,
  mockCheckInWithFaceResponse,
  mockMarkAsAbsentResponse,
  mockGetAllTripsResponse,
} from '../mocks/mockTripResponses';
```

**Hành động:** Xóa hoàn toàn block import mock này.

---

### Vấn đề 1.2: getMySchedule fallback mock (dòng 249-258)

```javascript
// ❌ HIỆN TẠI
export const getMySchedule = async () => {
  try {
    const response = await api.get('/trips/my-schedule');
    return response.data.data || [];
  } catch (error) {
    console.warn('[tripService] getMySchedule failed → using mock schedule', error.message || error);
    return mockMyScheduleResponse.data; // ⚠️ MOCK FALLBACK
  }
};
```

```javascript
// ✅ SỬA THÀNH
export const getMySchedule = async () => {
  try {
    const response = await api.get('/trips/my-schedule');
    return response.data.data || [];
  } catch (error) {
    console.error('[tripService] getMySchedule failed:', error.message || error);
    throw new Error(error.response?.data?.message || 'Không thể tải lịch trình tài xế');
  }
};
```

---

### Vấn đề 1.3: getTrip fallback mock (dòng 219-228)

```javascript
// ❌ HIỆN TẠI
export const getTrip = async (tripId) => {
  try {
    const response = await apiGetTrip(tripId);
    return response.data.data || null;
  } catch (error) {
    console.warn(`[tripService] getTrip(${tripId}) failed → using mock`, error.message || error);
    return mockGetTripResponse.data.trip; // ⚠️ MOCK FALLBACK
  }
};
```

```javascript
// ✅ SỬA THÀNH
export const getTrip = async (tripId) => {
  try {
    const response = await apiGetTrip(tripId);
    return response.data.data || null;
  } catch (error) {
    console.error(`[tripService] getTrip(${tripId}) failed:`, error.message || error);
    throw new Error(error.response?.data?.message || 'Không thể tải thông tin chuyến đi');
  }
};
```

---

### Vấn đề 1.4: getTripStudents fallback mock (dòng 234-243)

```javascript
// ❌ HIỆN TẠI
export const getTripStudents = async (tripId) => {
  try {
    const response = await api.get(`/trips/${tripId}/students`);
    return response.data.data || [];
  } catch (error) {
    console.warn(`[tripService] getTripStudents(${tripId}) failed → using mock`, error.message || error);
    return mockGetTripStudentsResponse.data.students; // ⚠️ MOCK FALLBACK
  }
};
```

```javascript
// ✅ SỬA THÀNH
export const getTripStudents = async (tripId) => {
  try {
    const response = await api.get(`/trips/${tripId}/students`);
    return response.data.data || [];
  } catch (error) {
    console.error(`[tripService] getTripStudents(${tripId}) failed:`, error.message || error);
    // Trả về mảng rỗng thay vì throw - để UI không crash
    return [];
  }
};
```

---

### Vấn đề 1.5: Các function khác có mock fallback

Áp dụng pattern tương tự cho: `getAllTrips`, `createTrip`, `updateTrip`, `checkIn`, `checkInWithFace`, `markAsAbsent`

**Pattern chung:**
```javascript
// ✅ PATTERN ĐÚNG
} catch (error) {
  console.error('[tripService] functionName failed:', error.message || error);
  throw new Error(error.response?.data?.message || 'Thông báo lỗi mặc định');
}
```

---

## 📝 BƯỚC 2: Sửa RouteTrackingContext.jsx

**File:** `src/context/RouteTrackingContext.jsx`

### Vấn đề 2.1: Mock data constants (dòng 534-606)

```javascript
// ❌ HIỆN TẠI - CÓ 4 BLOCK MOCK DATA

// Dòng 535-545
const STUDENTS_DATABASE = {
  hs1: { id: 'hs1', name: 'Nguyễn Văn An', ... },
  // ...
};

// Dòng 547-552
const ROUTES_BASE_STATIONS = [
  { id: 'st1', name: 'Trạm A - Nguyễn Trãi', ... },
  // ...
];

// Dòng 554-566
const createStudentsByRoute = () => {...};
const STUDENTS_BY_STATION = createStudentsByRoute();

// Dòng 581-606
const createDailyRoutes = (dayLabel) => [...];
const ROUTES_WEEK = WEEK_DAYS.reduce(...);
```

**Hành động:** Comment hoặc xóa toàn bộ từ dòng 534 đến 606.

```javascript
// ✅ SỬA THÀNH - XÓA HOẶC COMMENT
// -------------------- Mock data (ĐÃ XÓA - dùng API) --------------------
// Tất cả mock data đã được loại bỏ, dùng backend API thay thế
```

---

### Vấn đề 2.2: State khởi tạo với mock (dòng 659)

```javascript
// ❌ HIỆN TẠI
const [stations, setStations] = useState(ROUTES_BASE_STATIONS);
```

```javascript
// ✅ SỬA THÀNH
const [stations, setStations] = useState([]); // Khởi tạo rỗng, fetch từ API
```

---

### Vấn đề 2.3: routesToday dùng mock (dòng 679)

```javascript
// ❌ HIỆN TẠI
const routesToday = useMemo(() => ROUTES_WEEK[todayLabel] || createDailyRoutes(todayLabel), [todayLabel]);
```

```javascript
// ✅ SỬA THÀNH - Thêm state mới và fetch từ API
const [tripsFromApi, setTripsFromApi] = useState([]);

// routesToday giờ dựa vào API data
const routesToday = useMemo(() => {
  if (tripsFromApi.length > 0) {
    // Transform trips từ API sang format UI
    return tripsFromApi.map(trip => ({
      id: trip._id,
      name: trip.routeId?.name || 'Chuyến xe',
      time: trip.tripDate ? new Date(trip.tripDate).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'}) : '--:--',
      totalStudents: trip.studentStops?.length || 0,
      direction: trip.direction,
      status: trip.status,
      rawData: trip
    }));
  }
  return []; // Không có mock fallback
}, [tripsFromApi]);
```

---

### Vấn đề 2.4: currentStudentsMemo dùng mock (dòng 683)

```javascript
// ❌ HIỆN TẠI
const currentStudentsMemo = useMemo(() => currentStation ? STUDENTS_BY_STATION[currentStation.id] || [] : [], [currentStation]);
```

```javascript
// ✅ SỬA THÀNH
const [backendStudents, setBackendStudents] = useState([]);

const currentStudentsMemo = useMemo(() => {
  if (!currentStation || !backendStudents.length) return [];
  // Filter students tại trạm hiện tại
  return backendStudents
    .filter(stop => stop.stationId?._id === currentStation.id || stop.stationId === currentStation.id)
    .map(stop => ({
      id: stop.studentId?._id || stop.studentId,
      name: stop.studentId?.name || 'Học sinh',
      avatar: stop.studentId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stop.studentId?._id}`,
      class: stop.studentId?.grade || '',
      status: stop.action || 'PENDING'
    }));
}, [currentStation, backendStudents]);
```

---

### Vấn đề 2.5: allStudentsForContact dùng mock (dòng 684)

```javascript
// ❌ HIỆN TẠI
const allStudentsForContact = useMemo(() => Object.values(STUDENTS_DATABASE), []);
```

```javascript
// ✅ SỬA THÀNH
const allStudentsForContact = useMemo(() => {
  return backendStudents.map(s => ({
    id: s.studentId?._id || s.studentId,
    name: s.studentId?.name || 'Học sinh',
    avatar: s.studentId?.avatar,
    class: s.studentId?.grade,
    parentName: s.studentId?.parentId?.name,
    parentPhone: s.studentId?.parentId?.phone
  }));
}, [backendStudents]);
```

---

### Vấn đề 2.6: syncDataFromBackend fallback mock (dòng 707)

```javascript
// ❌ HIỆN TẠI
setStations(stationData.data?.stations || ROUTES_BASE_STATIONS);
```

```javascript
// ✅ SỬA THÀNH
setStations(stationData.data?.stations || []); // Không có mock fallback
```

---

### Vấn đề 2.7: Thêm hàm initializeTracking mới

**Thêm function này vào context (nếu chưa có hoặc cần cập nhật):**

```javascript
// ✅ THÊM VÀO - Function để init trip từ API
const initializeTracking = useCallback(async (tripFromSchedule) => {
  try {
    console.log('[RouteTracking] Initializing trip:', tripFromSchedule._id);
    
    // 1. Fetch full trip data với route shape
    const fullTrip = await getTrip(tripFromSchedule._id);
    
    if (!fullTrip || !fullTrip.routeId) {
      throw new Error('Không tìm thấy thông tin tuyến đường');
    }
    
    // 2. Extract route shape từ backend
    if (fullTrip.routeId.shape) {
      setRouteShape(fullTrip.routeId.shape); // State mới cần thêm
    }
    
    // 3. Extract stations từ orderedStops
    if (fullTrip.routeId.orderedStops) {
      const stationsFromApi = fullTrip.routeId.orderedStops.map((station, idx) => ({
        id: station._id,
        name: station.name,
        position: [
          station.address?.location?.coordinates?.[1] || 0, // lat
          station.address?.location?.coordinates?.[0] || 0  // lng
        ],
        time: fullTrip.scheduleId?.stopTimes?.[idx]?.arrivalTime || ''
      }));
      setStations(stationsFromApi);
    }
    
    // 4. Fetch students cho trip này
    const students = await getTripStudents(fullTrip._id);
    setBackendStudents(students);
    
    // 5. Set trip state
    setCurrentTripId(fullTrip._id);
    setCurrentRouteIndex(0);
    setCurrentStationIndex(fullTrip.nextStationIndex || 0);
    
    console.log('[RouteTracking] Initialized successfully:', {
      tripId: fullTrip._id,
      stationsCount: fullTrip.routeId.orderedStops?.length || 0,
      studentsCount: students.length
    });
    
    return fullTrip;
  } catch (error) {
    console.error('[RouteTracking] Initialize failed:', error);
    throw error; // Để UI xử lý hiển thị lỗi
  }
}, []);
```

---

### Vấn đề 2.8: Thêm state routeShape

```javascript
// ✅ THÊM VÀO - State cho route shape từ backend
const [routeShape, setRouteShape] = useState(null);
const [backendStudents, setBackendStudents] = useState([]);
const [tripsFromApi, setTripsFromApi] = useState([]);
```

---

### Vấn đề 2.9: Export thêm các state mới trong Provider

```javascript
// ✅ CẬP NHẬT PROVIDER VALUE
return (
  <RouteTrackingContext.Provider
    value={{
      // ... existing values
      routeShape,        // ✅ Thêm mới
      backendStudents,   // ✅ Thêm mới
      initializeTracking, // ✅ Đảm bảo export
      // ...
    }}
  >
    {children}
  </RouteTrackingContext.Provider>
);
```

---

## 📝 BƯỚC 3: Sửa DriverHome.jsx

**File:** `src/pages/driver/DriverHome.jsx`

### Vấn đề 3.1: Dùng RouteMap thay vì RouteMapWithBackend (dòng 358)

```javascript
// ❌ HIỆN TẠI
import RouteMap from '../../components/maps/RouteMap';
```

```javascript
// ✅ SỬA THÀNH
import RouteMapWithBackend from '../../components/maps/RouteMapWithBackend';
```

---

### Vấn đề 3.2: Không destructure routeShape từ context (dòng 367-385)

```javascript
// ❌ HIỆN TẠI
const {
  isTracking,
  currentStationIndex,
  currentStation,
  currentRoute,
  stations = [],
  // ... không có routeShape
} = useRouteTracking();
```

```javascript
// ✅ SỬA THÀNH
const {
  isTracking,
  currentStationIndex,
  currentStation,
  currentRoute,
  stations = [],
  currentStudents = [],
  studentCheckIns = {},
  checkInStudent = () => {},
  markAbsentStudent = () => {},
  stationTimer = 0,
  isStationActive = false,
  startTracking,
  stopTracking,
  lastStoppedState,
  forceDepart,
  initializeTracking,
  routeShape,          // ✅ Thêm mới
  currentTripId,       // ✅ Thêm mới
} = useRouteTracking();
```

---

### Vấn đề 3.3: useEffect không có proper error handling (dòng 396-428)

```javascript
// ❌ HIỆN TẠI
useEffect(() => {
  const initSchedule = async () => {
    if (stations.length > 0 || currentRoute) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const schedule = await getMySchedule();
      // ...
    } catch (err) {
      console.error('Không thể tải lịch trình:', err);
      setError('Không thể tải lịch trình. Đang dùng dữ liệu mẫu.'); // ⚠️ HÓA RA KHÔNG CÓ MOCK
    } finally {
      setLoading(false);
    }
  };
  initSchedule();
}, []); // ⚠️ Missing dependencies
```

```javascript
// ✅ SỬA THÀNH
useEffect(() => {
  const initSchedule = async () => {
    // Skip nếu đã có data
    if (stations.length > 0 && currentTripId) {
      console.log('[DriverHome] Already has data, skipping init');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('[DriverHome] Fetching schedule from API...');
      
      const schedule = await getMySchedule();
      console.log('[DriverHome] Schedule loaded:', schedule.length, 'trips');

      if (!schedule || schedule.length === 0) {
        setError('Không có chuyến đi nào được phân công hôm nay.');
        setLoading(false);
        return;
      }

      // Tìm chuyến đang chạy hoặc sắp chạy
      const activeTrip = schedule.find(trip =>
        trip.status === 'IN_PROGRESS'
      ) || schedule.find(trip =>
        trip.status === 'NOT_STARTED'
      ) || schedule[0];

      if (activeTrip && initializeTracking) {
        console.log('[DriverHome] Initializing trip:', activeTrip._id);
        await initializeTracking(activeTrip);
      }
    } catch (err) {
      console.error('[DriverHome] Error:', err);
      setError(err.message || 'Không thể tải lịch trình từ server.');
    } finally {
      setLoading(false);
    }
  };

  initSchedule();
}, [initializeTracking, stations.length, currentTripId]);
```

---

### Vấn đề 3.4: Sử dụng RouteMap không có routeShape

Tìm đoạn render RouteMap và thay thế:

```jsx
// ❌ HIỆN TẠI (khoảng dòng 570-590)
<RouteMap
  center={stations[0]?.position || [10.7623, 106.7056]}
  stops={stations.map(s => ({
    id: s.id,
    name: s.name,
    position: s.position,
    time: s.time,
  }))}
  isTracking={isTracking}
  isCheckingIn={isCheckingIn}
  isAtStation={isStationActive}
  isMoving={isMoving}
  currentStationIndex={currentStationIndex}
  lastStoppedPosition={lastStoppedState?.position}
/>
```

```jsx
// ✅ SỬA THÀNH
<RouteMapWithBackend
  center={stations[0]?.position || [10.7623, 106.7056]}
  routeShape={routeShape}
  stops={stations.map(s => ({
    id: s.id,
    name: s.name,
    position: s.position,
    time: s.time,
  }))}
  tripId={currentTripId}
  isTracking={isTracking}
  currentStationIndex={currentStationIndex}
/>
```

---

## 📝 BƯỚC 4: Sửa DriverDailySchedule.jsx

**File:** `src/pages/driver/DriverDailySchedule.jsx`

### Áp dụng tương tự như DriverHome:

1. **Import:** Đổi `RouteMap` → `RouteMapWithBackend`
2. **Context destructure:** Thêm `routeShape`, `currentTripId`
3. **Route component:** Đổi props tương tự
4. **Dependencies:** Thêm `initializeTracking` vào dependency array của useEffect

---

## 📝 BƯỚC 5: Sửa các service khác

### 5.1. notificationService.js

**File:** `src/services/notificationService.js`

```javascript
// ❌ HIỆN TẠI (dòng 106-108)
import {
  mockMyNotificationsResponse,
} from '../mocks/mockTripResponses';

// ❌ HIỆN TẠI (dòng 119-123)
} catch (error) {
  console.warn('[notificationService] getMyNotifications failed → using mock fallback', error.message || error);
  return mockMyNotificationsResponse.data.notifications || mockMyNotificationsResponse.data || [];
}
```

```javascript
// ✅ SỬA THÀNH - Xóa import mock

// ✅ SỬA THÀNH - Error handling
} catch (error) {
  console.error('[notificationService] getMyNotifications failed:', error.message || error);
  return []; // Trả về mảng rỗng, không dùng mock
}
```

---

### 5.2. messageService.js

**File:** `src/services/messageService.js`

```javascript
// ❌ HIỆN TẠI
import { mockGetMyMessagesResponse } from '../mocks/mockTripResponses';

export const getMyMessages = async () => {
  try {
    const response = await api.get('/messages/me');
    return response.data.data;
  } catch (error) {
    console.warn('API getMyMessages failed → using mock', error);
    return mockGetMyMessagesResponse.data;
  }
};
```

```javascript
// ✅ SỬA THÀNH
export const getMyMessages = async () => {
  try {
    const response = await api.get('/messages/me');
    return response.data.data || [];
  } catch (error) {
    console.error('[messageService] getMyMessages failed:', error.message || error);
    return []; // Trả về mảng rỗng
  }
};
```

---

## 📝 BƯỚC 6: Cleanup mock files

### 6.1. Các file có thể xóa/archive

```
src/mocks/
├── mockCurrentTrip.js      → Có thể xóa sau khi test
├── mockSchedule.js         → Có thể xóa sau khi test  
└── mockTripResponses.js    → Có thể xóa sau khi test
```

**Khuyến nghị:** Giữ lại nhưng rename thành `*.backup.js` cho đến khi hoàn toàn chắc chắn.

---

## 📋 THỨ TỰ THỰC HIỆN

### Phase 1: Services (Ưu tiên cao)
1. ☐ **tripService.js** - Xóa import mock, sửa error handling
2. ☐ **notificationService.js** - Xóa import mock, sửa error handling
3. ☐ **messageService.js** - Xóa import mock, sửa error handling

### Phase 2: Context (Ưu tiên cao)
4. ☐ **RouteTrackingContext.jsx** - Xóa/comment mock constants (dòng 534-606)
5. ☐ **RouteTrackingContext.jsx** - Sửa state init từ mock → `[]`
6. ☐ **RouteTrackingContext.jsx** - Thêm state `routeShape`, `backendStudents`
7. ☐ **RouteTrackingContext.jsx** - Cập nhật `initializeTracking` function
8. ☐ **RouteTrackingContext.jsx** - Sửa `currentStudentsMemo`, `allStudentsForContact`
9. ☐ **RouteTrackingContext.jsx** - Sửa `routesToday` dùng API data

### Phase 3: Pages (Ưu tiên cao)
10. ☐ **DriverHome.jsx** - Đổi import `RouteMapWithBackend`
11. ☐ **DriverHome.jsx** - Thêm destructure `routeShape`, `currentTripId`
12. ☐ **DriverHome.jsx** - Sửa useEffect dependencies
13. ☐ **DriverHome.jsx** - Sửa RouteMap component

14. ☐ **DriverDailySchedule.jsx** - Áp dụng tương tự

### Phase 4: Cleanup
15. ☐ Rename mock files thành `*.backup.js`
16. ☐ Test tất cả các trang
17. ☐ Xóa mock files nếu không cần

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Không sửa backend
Tất cả thay đổi chỉ ở frontend. Backend APIs đã hoạt động đúng.

### 2. Backend API requirements
Đảm bảo các API sau hoạt động:
- `GET /trips/my-schedule` → Danh sách trips của driver
- `GET /trips/:id` → Chi tiết trip với `routeId.shape` và `routeId.orderedStops`
- `GET /trips/:id/students` → Danh sách học sinh trong trip

### 3. Test sau mỗi bước
Sau khi sửa mỗi file, test ngay để phát hiện lỗi sớm.

### 4. Console logs
Giữ lại console.log để debug, có thể xóa sau khi stable.

### 5. Error UI
Đảm bảo UI hiển thị error message khi API fail thay vì crash.

---

## 🔗 BACKEND API REFERENCE

### GET /trips/my-schedule
```javascript
// Response
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "_id": "trip123",
      "direction": "PICK_UP",
      "status": "NOT_STARTED",
      "tripDate": "2024-12-09T06:30:00Z",
      "busId": { "licensePlate": "51B-12345" },
      "studentStops": [...]
    }
  ]
}
```

### GET /trips/:id
```javascript
// Response
{
  "status": "success",
  "data": {
    "_id": "trip123",
    "routeId": {
      "name": "Tuyến 1",
      "shape": {
        "type": "LineString",
        "coordinates": [[106.66, 10.76], [106.67, 10.77], ...]
      },
      "orderedStops": [
        {
          "_id": "station1",
          "name": "Trạm A",
          "address": {
            "location": {
              "type": "Point",
              "coordinates": [106.66, 10.76]
            }
          }
        }
      ]
    },
    "scheduleId": {
      "stopTimes": [
        { "stationId": "station1", "arrivalTime": "06:30" }
      ]
    }
  }
}
```

### GET /trips/:id/students
```javascript
// Response
{
  "status": "success",
  "data": [
    {
      "studentId": {
        "_id": "student1",
        "name": "Nguyễn Văn A",
        "grade": "6A1"
      },
      "stationId": {
        "_id": "station1",
        "name": "Trạm A"
      },
      "action": "PENDING"
    }
  ]
}
```

---

**Ngày tạo:** 2024-12-09  
**Estimate:** 4-6 giờ để implement toàn bộ  
**Độ ưu tiên:** CAO - Cần làm trước khi deploy
