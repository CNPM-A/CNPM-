import api from './client'

// ============================================================
// ADMIN SERVICE - Kết nối Backend Smart School Bus
// Base URL: https://smart-school-bus-api.onrender.com/api/v1
// ============================================================

export const AdminService = {

  // ==================== AUTHENTICATION ====================
  login: async (credentials) => {
    const response = await api. post('/auth/signin', {
      username: credentials.email || credentials.username,
      password: credentials. password
    })
    
    console.log('Login response:', response.data)
    
    if (response. data.accessToken) {
      localStorage.setItem('accessToken', response. data.accessToken)
      localStorage.setItem('user', JSON.stringify(response. data.data?. user || {}))
    }
    
    return response.data
  },

  refreshToken: async () => {
    const response = await api.post('/auth/token')
    if (response.data. accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken)
    }
    return response.data
  },

  logout: async () => {
    try {
      await api.delete('/auth/logout')
    } finally {
      localStorage. removeItem('accessToken')
      localStorage. removeItem('user')
    }
  },

  // ==================== USERS ====================
  listUsers: async (params = {}) => {
    const response = await api.get('/users', { params })
    return response.data. data || []
  },

  getMe: async () => {
    const response = await api.get('/users/me')
    return response.data.data
  },

  updateMe: async (data) => {
    const response = await api. patch('/users/me', data)
    return response.data. data
  },

  createUser: async (data) => {
    const response = await api.post('/users', data)
    return response.data.data
  },

  updateUser: async (id, data) => {
    const response = await api.patch(`/users/${id}`, data)
    return response.data.data
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`)
    return { success: true }
  },

  // ==================== DRIVERS ====================
  listDrivers: async (params = {}) => {
    const response = await api.get('/users', { params })
    const users = response.data.data || []
    return users
      .filter(u => u.role === 'Driver')
      .map(u => ({
        ... u,
        user_id: u._id,
        phone_number: u.phoneNumber,
        is_active: u. isActive !== false
      }))
  },

  getDriver: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data.data
  },

  createDriver: async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber || data.phone_number,
      password: data.password || 'Driver@123',
      role: 'Driver'
    }
    const response = await api.post('/auth/signup', payload)
    return response.data. data
  },

  updateDriver: async (id, data) => {
    const response = await api.patch(`/users/${id}`, data)
    return response.data.data
  },

  deleteDriver: async (id) => {
    await api.delete(`/users/${id}`)
    return { success: true }
  },

  // ==================== PARENTS ====================
  listParents: async (params = {}) => {
    const response = await api.get('/users', { params })
    const users = response. data.data || []
    return users
      .filter(u => u.role === 'Parent')
      .map(u => ({
        ... u,
        user_id: u._id,
        phone_number: u. phoneNumber
      }))
  },

  createParent: async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber || data.phone_number,
      password: data.password || 'Parent@123',
      role: 'Parent'
    }
    const response = await api. post('/auth/signup', payload)
    return response.data. data
  },

  // ==================== STUDENTS ====================
  listStudents: async (params = {}) => {
    const response = await api.get('/students', { params })
    const students = response.data.data || []
    return students. map(s => ({
      ...s,
      student_id: s._id,
      class: s.grade,
      parent_name: s.parentId?. name || '',
      parent_phone: s.parentId?.phoneNumber || '',
      fullAddress: s.fullAddress || 'Chưa cập nhật',
      hasFaceData: s.hasFaceData || false
    }))
  },

  getStudent: async (id) => {
    const response = await api.get(`/students/${id}`)
    return response. data.data
  },

  createStudent: async (data) => {
    const payload = {
      name: data.name,
      grade: data.grade || data.class,
      parentId: data.parentId || data.parent_id,
      fullAddress: data.fullAddress || 'Chưa cập nhật',
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(data.longitude) || 106.6942,
          parseFloat(data.latitude) || 10.7725
        ]
      }
    }
    const response = await api.post('/students', payload)
    return response.data.data
  },

  updateStudent: async (id, data) => {
    const payload = { ...data }
    
    // Nếu có tọa độ mới, format lại
    if (data.latitude && data.longitude) {
      payload.location = {
        type: 'Point',
        coordinates: [
          parseFloat(data.longitude),
          parseFloat(data.latitude)
        ]
      }
    }
    
    const response = await api.patch(`/students/${id}`, payload)
    return response.data. data
  },

  deleteStudent: async (id) => {
    await api. delete(`/students/${id}`)
    return { success: true }
  },

  // 🔴 UPLOAD ẢNH KHUÔN MẶT HỌC SINH
  uploadStudentFace: async (studentId, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.post(`/students/${studentId}/face-data`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // ==================== BUSES ====================
  listBuses: async (params = {}) => {
    const response = await api.get('/buses', { params })
    const buses = response.data. data || []
    return buses.map(b => ({
      ...b,
      bus_id: b._id,
      plate_number: b.licensePlate,
      is_assigned: b.isAssigned || false
    }))
  },

  getBus: async (id) => {
    const response = await api. get(`/buses/${id}`)
    return response.data. data
  },

  createBus: async (data) => {
    const response = await api.post('/buses', {
      licensePlate: data. licensePlate || data.plate_number,
      capacity: data.capacity || 45,
      model: data.model || ''
    })
    return response.data. data
  },

  updateBus: async (id, data) => {
    const response = await api.patch(`/buses/${id}`, data)
    return response.data.data
  },

  deleteBus: async (id) => {
    await api.delete(`/buses/${id}`)
    return { success: true }
  },

  // ==================== STATIONS ====================
  listStations: async (params = {}) => {
    const response = await api.get('/stations', { params })
    const stations = response.data. data || []
    return stations.map(s => ({
      ...s,
      station_id: s._id,
      latitude: s.address?.latitude,
      longitude: s.address?.longitude,
      fullAddress: s.address?.fullAddress,
      street: s.address?. street,
      district: s.address?. district,
      city: s.address?. city
    }))
  },

  // 🔴 LẤY CHI TIẾT TRẠM + HỌC SINH GẦN ĐÓ (500m)
  getStation: async (id) => {
    const response = await api. get(`/stations/${id}`)
    return response.data. data // { station, students: [{.. ., isAssigned}] }
  },

  getWalkingDirections: async (stationId, lat, lng) => {
    const response = await api.get(`/stations/${stationId}/walking-directions`, {
      params: { lat, lng }
    })
    return response.data.data
  },

  createStation: async (data) => {
    const payload = {
      name: data.name,
      address: {
        fullAddress: data.fullAddress || data.address || '',
        street: data.street || '',
        district: data.district || '',
        city: data.city || 'Hồ Chí Minh',
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude)
      }
    }
    const response = await api.post('/stations', payload)
    return response.data.data
  },

  updateStation: async (id, data) => {
    const payload = {
      name: data.name,
      address: {
        fullAddress: data.fullAddress || data.address?. fullAddress,
        street: data.street || data. address?.street,
        district: data. district || data.address?.district,
        city: data.city || data.address?. city || 'Hồ Chí Minh',
        latitude: parseFloat(data.latitude || data.address?.latitude),
        longitude: parseFloat(data. longitude || data.address?.longitude)
      }
    }
    const response = await api.patch(`/stations/${id}`, payload)
    return response.data.data
  },

  deleteStation: async (id) => {
    await api.delete(`/stations/${id}`)
    return { success: true }
  },

  // ==================== ROUTES ====================
  listRoutes: async (params = {}) => {
    const response = await api.get('/routes', { params })
    const routes = response.data. data || []
    return routes.map(r => ({
      ...r,
      route_id: r._id,
      stops: r.orderedStops || [],
      // Lấy điểm đầu/cuối
      start: r.orderedStops?.[0]?.name || '—',
      end: r.orderedStops?.[r. orderedStops. length - 1]?.name || '—',
      distance: r.distanceMeters ?  `${(r.distanceMeters / 1000).toFixed(1)} km` : '—',
      duration: r.durationSeconds ? `${Math.round(r. durationSeconds / 60)} phút` : '—'
    }))
  },

  getRoute: async (id) => {
    const response = await api.get(`/routes/${id}`)
    return response. data.data
  },

  createRoute: async (data) => {
    const response = await api.post('/routes', {
      name: data.name,
      stationIds: data.stationIds || data.stop_ids || []
    })
    return response.data. data
  },

  updateRoute: async (id, data) => {
    const response = await api. patch(`/routes/${id}`, data)
    return response. data.data
  },

  deleteRoute: async (id) => {
    await api.delete(`/routes/${id}`)
    return { success: true }
  },

  // ==================== SCHEDULES ====================
  listSchedules: async (params = {}) => {
    const response = await api.get('/schedules', { params })
    const schedules = response. data.data || []
    return schedules.map(s => ({
      ...s,
      schedule_id: s._id,
      route_name: s.routeId?.name || '',
      route_stops: s.routeId?.orderedStops || [],
      bus_plate: s.busId?.licensePlate || '',
      driver_name: s. driverId?.name || '',
      driver_phone: s. driverId?.phoneNumber || '',
      total_students: s.stopTimes?.reduce((sum, st) => sum + (st.studentIds?. length || 0), 0) || 0
    }))
  },

  getSchedule: async (id) => {
    const response = await api.get(`/schedules/${id}`)
    return response.data.data
  },

  // 🔴 LẤY ROUTE ĐỂ VẼ BẢN ĐỒ
  getScheduleRoute: async (id) => {
    const response = await api. get(`/schedules/${id}/route`)
    return response. data.data
    // { routeName, shape, stops, distance, duration }
  },

  // 🔴 GÁN HỌC SINH VÀO TRẠM TRONG LỊCH TRÌNH
  assignStudentsToStation: async (scheduleId, stationId, studentIds) => {
    const response = await api.patch(
      `/schedules/${scheduleId}/stopTimes/${stationId}/students`,
      { studentIds }
    )
    return response.data.data
  },

  // 🔴 BỎ GÁN HỌC SINH KHỎI TRẠM
  removeStudentsFromStation: async (scheduleId, stationId, studentIds) => {
    const response = await api.delete(
      `/schedules/${scheduleId}/stopTimes/${stationId}/students`,
      { data: { studentIds } }
    )
    return response.data.data
  },

  // ✅ SỬA: Thêm stopTimes khi tạo schedule
  createSchedule: async (data) => {
    const payload = {
      routeId: data. routeId || data.route_id,
      busId: data.busId || data.bus_id,
      driverId: data. driverId || data.driver_id,
      direction: data.direction || 'PICK_UP',
      daysOfWeek: data.daysOfWeek || [1, 2, 3, 4, 5],
      startDate: data.startDate,
      endDate: data.endDate,
      // 🔴 QUAN TRỌNG: Backend yêu cầu stopTimes
      stopTimes: data.stopTimes || []
      // Format: [{ stationId: "xxx", arrivalTime: "06:30", studentIds: [] }]
    }
    
    const response = await api.post('/schedules', payload)
    return response.data.data
  },

  updateSchedule: async (id, data) => {
    const response = await api.patch(`/schedules/${id}`, data)
    return response.data. data
  },

  deleteSchedule: async (id) => {
    await api.delete(`/schedules/${id}`)
    return { success: true }
  },

  // ==================== TRIPS ====================
  listTrips: async (params = {}) => {
    const response = await api.get('/trips', { params })
    const trips = response.data. data || []
    return trips.map(t => ({
      ...t,
      trip_id: t._id,
      route_name: t.routeId?.name || t.scheduleId?.routeId?.name || '',
      bus_plate: t. busId?.licensePlate || '',
      driver_name: t.driverId?.name || '',
      total_students: t. studentStops?.length || 0,
      picked_up: t.studentStops?.filter(s => s.action === 'PICKED_UP').length || 0,
      dropped_off: t.studentStops?. filter(s => s.action === 'DROPPED_OFF'). length || 0,
      absent: t.studentStops?.filter(s => s.action === 'ABSENT').length || 0
    }))
  },

  getMySchedule: async () => {
    const response = await api.get('/trips/my-schedule')
    return response. data.data || []
  },

  // 🔴 LẤY CHI TIẾT CHUYẾN ĐI (ĐẦY ĐỦ ĐỂ VẼ MAP)
  getTrip: async (id) => {
    const response = await api. get(`/trips/${id}`)
    return response.data. data
  },

  getTripStudents: async (tripId) => {
    const response = await api. get(`/trips/${tripId}/students`)
    return response. data.data || []
  },

  createTrip: async (data) => {
    const payload = {
      scheduleId: data. scheduleId || data.schedule_id,
      tripDate: data.tripDate || new Date().toISOString()
    }
    const response = await api.post('/trips', payload)
    return response.data.data
  },

  // ✅ Check-in thủ công (Admin/Driver gọi)
  checkInStudent: async (tripId, studentId, stationId) => {
    const response = await api.patch(`/trips/${tripId}/check-in`, {
      studentId,
      stationId
    })
    return response. data
  },

  // ✅ SỬA: CHECK-IN BẰNG CAMERA (FACE RECOGNITION)
  // Backend endpoint là /trips/:id/check-in với multipart/form-data
  checkInWithFace: async (tripId, imageFile, stationId) => {
    const formData = new FormData()
    formData. append('image', imageFile) // Backend expect 'image' field
    if (stationId) {
      formData.append('stationId', stationId)
    }
    
    const response = await api.patch(`/trips/${tripId}/check-in`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // Đánh dấu vắng
  markStudentAbsent: async (tripId, studentId) => {
    const response = await api. patch(`/trips/${tripId}/mark-absent`, { studentId })
    return response.data
  },

  updateTrip: async (id, data) => {
    const response = await api.patch(`/trips/${id}`, data)
    return response.data.data
  },

  deleteTrip: async (id) => {
    await api.delete(`/trips/${id}`)
    return { success: true }
  },

  // Bắt đầu chuyến đi
  startTrip: async (tripId) => {
    const response = await api. patch(`/trips/${tripId}`, {
      status: 'IN_PROGRESS',
      actualStartTime: new Date().toISOString()
    })
    return response.data.data
  },

  // Kết thúc chuyến đi
  completeTrip: async (tripId) => {
    const response = await api.patch(`/trips/${tripId}`, {
      status: 'COMPLETED',
      actualEndTime: new Date().toISOString()
    })
    return response.data. data
  },

  // ==================== NOTIFICATIONS ====================
  listNotifications: async (params = {}) => {
    const response = await api.get('/notifications/me', { params })
    return response.data.data || []
  },

  deleteNotification: async (id) => {
    await api.delete(`/notifications/${id}`)
    return { success: true }
  },

  markNotificationRead: async (id) => {
    const response = await api. patch(`/notifications/${id}`, { isRead: true })
    return response.data.data
  },

  // ==================== MESSAGES ====================
  listMessages: async (params = {}) => {
    try {
      const response = await api.get('/messages/me', { params })
      return response.data.data || []
    } catch {
      return []
    }
  },

  sendMessage: async (data) => {
    const response = await api.post('/messages', data)
    return response. data.data
  },

  // ==================== ALERTS ====================
  listAlerts: async (params = {}) => {
    try {
      const response = await api.get('/alerts', { params })
      return response.data.data || []
    } catch {
      return []
    }
  },

  getAlert: async (id) => {
    const response = await api. get(`/alerts/${id}`)
    return response.data. data
  },

  // ==================== DASHBOARD STATS ====================
  getDashboardStats: async () => {
    try {
      const [students, drivers, buses, routes, stations, trips] = await Promise. all([
        AdminService.listStudents(),
        AdminService.listDrivers(),
        AdminService.listBuses(),
        AdminService. listRoutes(),
        AdminService.listStations(),
        AdminService.listTrips()
      ])

      const today = new Date(). toISOString(). split('T')[0]
      const todayTrips = trips.filter(t => t. tripDate?. startsWith(today))
      const activeTrips = todayTrips.filter(t => t. status === 'IN_PROGRESS')
      const completedTrips = todayTrips.filter(t => t.status === 'COMPLETED')

      return {
        totalStudents: students.length,
        totalDrivers: drivers.length,
        totalBuses: buses.length,
        totalRoutes: routes.length,
        totalStations: stations.length,
        todayTrips: todayTrips.length,
        activeTrips: activeTrips.length,
        completedTrips: completedTrips. length,
        // Thêm stats chi tiết
        assignedBuses: buses.filter(b => b. is_assigned).length,
        studentsWithFace: students.filter(s => s.hasFaceData).length
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalStudents: 0,
        totalDrivers: 0,
        totalBuses: 0,
        totalRoutes: 0,
        totalStations: 0,
        todayTrips: 0,
        activeTrips: 0,
        completedTrips: 0,
        assignedBuses: 0,
        studentsWithFace: 0
      }
    }
  }
}

export default AdminService