import { students, users, drivers, buses, routes, stops, trips, messages } from './mockData'

// Giả lập delay như API thật
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const AdminService = {
  // Students
  listStudents: async () => {
    await delay(300)
    return students
  },
  createStudent: async (data) => {
    await delay(300)
    const newStudent = { ...data, student_id: students.length + 1 }
    students.push(newStudent)
    return newStudent
  },
  updateStudent: async (id, data) => {
    await delay(300)
    const index = students.findIndex(s => s.student_id === id)
    if (index !== -1) students[index] = { ...students[index], ...data }
    return students[index]
  },
  deleteStudent: async (id) => {
    await delay(300)
    const index = students.findIndex(s => s.student_id === id)
    if (index !== -1) students.splice(index, 1)
    return { success: true }
  },

  // Drivers
  listDrivers: async () => {
    await delay(300)
    return users.filter(u => u.role_id === 2).map(u => {
      const driver = drivers.find(d => d.driver_id === u.user_id)
      return { ...u, license_number: driver?.license_number || '' }
    })
  },
  createDriver: async (data) => {
    await delay(300)
    const newUser = { ...data, user_id: users.length + 1, role_id: 2 }
    users.push(newUser)
    drivers.push({ driver_id: newUser.user_id, license_number: data.license_number })
    return newUser
  },
  updateDriver: async (id, data) => {
    await delay(300)
    const index = users.findIndex(u => u.user_id === id)
    if (index !== -1) users[index] = { ...users[index], ...data }
    return users[index]
  },
  deleteDriver: async (id) => {
    await delay(300)
    const index = users.findIndex(u => u.user_id === id)
    if (index !== -1) users.splice(index, 1)
    return { success: true }
  },

  // Buses
  listBuses: async () => {
    await delay(300)
    return buses
  },
  createBus: async (data) => {
    await delay(300)
    const newBus = { ...data, bus_id: buses.length + 1 }
    buses.push(newBus)
    return newBus
  },
  updateBus: async (id, data) => {
    await delay(300)
    const index = buses.findIndex(b => b.bus_id === id)
    if (index !== -1) buses[index] = { ...buses[index], ...data }
    return buses[index]
  },
  deleteBus: async (id) => {
    await delay(300)
    const index = buses.findIndex(b => b.bus_id === id)
    if (index !== -1) buses.splice(index, 1)
    return { success: true }
  },

  // Routes
  listRoutes: async () => {
    await delay(300)
    return routes.map(r => ({
      ...r,
      stops: stops.filter(s => s.route_id === r.route_id),
      start: stops.find(s => s.route_id === r.route_id && s.seq_index === 1)?.name || '',
      end: stops.filter(s => s.route_id === r.route_id).sort((a, b) => b.seq_index - a.seq_index)[0]?.name || '',
      distance: '5 km'
    }))
  },
  createRoute: async (data) => {
    await delay(300)
    const newRoute = { ...data, route_id: routes.length + 1 }
    routes.push(newRoute)
    return newRoute
  },
  updateRoute: async (id, data) => {
    await delay(300)
    const index = routes.findIndex(r => r.route_id === id)
    if (index !== -1) routes[index] = { ...routes[index], ...data }
    return routes[index]
  },
  deleteRoute: async (id) => {
    await delay(300)
    const index = routes.findIndex(r => r.route_id === id)
    if (index !== -1) routes.splice(index, 1)
    return { success: true }
  },

  // Stops
  createStop: async (data) => {
    await delay(300)
    const newStop = { ...data, stop_id: stops.length + 1 }
    stops.push(newStop)
    return newStop
  },
  updateStop: async (id, data) => {
    await delay(300)
    const index = stops.findIndex(s => s.stop_id === id)
    if (index !== -1) stops[index] = { ...stops[index], ...data }
    return stops[index]
  },
  deleteStop: async (id) => {
    await delay(300)
    const index = stops.findIndex(s => s.stop_id === id)
    if (index !== -1) stops.splice(index, 1)
    return { success: true }
  },

  // Trips
  listTrips: async () => {
    await delay(300)
    return trips.map(t => ({
      ...t,
      route: routes.find(r => r.route_id === t.route_id),
      bus: buses.find(b => b.bus_id === t.bus_id),
      driver: users.find(u => u.user_id === buses.find(b => b.bus_id === t.bus_id)?.driver_id)?.name || '',
      stops: stops.filter(s => s.route_id === t.route_id),
      passengers: students.slice(0, 2)
    }))
  },
  createTrip: async (data) => {
    await delay(300)
    const newTrip = { ...data, trip_id: trips.length + 1 }
    trips.push(newTrip)
    return newTrip
  },
  updateTrip: async (id, data) => {
    await delay(300)
    const index = trips.findIndex(t => t.trip_id === id)
    if (index !== -1) trips[index] = { ...trips[index], ...data }
    return trips[index]
  },
  deleteTrip: async (id) => {
    await delay(300)
    const index = trips.findIndex(t => t.trip_id === id)
    if (index !== -1) trips.splice(index, 1)
    return { success: true }
  },

  // Messages
  listMessages: async () => {
    await delay(300)
    return messages
  },
}

// Realtime mock: simple listeners list and interval updates
const listeners = new Set()
setInterval(() => {
  // move bus 1 slightly west every 3 seconds; bus 2 slightly south
  const b1 = navigation_logs.find((n) => n.bus_id === 1)
  if (b1) {
    b1.longitude -= 0.0008
    b1.latitude += 0.0003
    b1.recorded_at = new Date().toISOString()
  }
  const b2 = navigation_logs.find((n) => n.bus_id === 2)
  if (b2) {
    b2.latitude -= 0.0006
    b2.longitude += 0.0004
    b2.recorded_at = new Date().toISOString()
  }
  const payload = navigation_logs
  listeners.forEach((cb) => cb(payload))
}, 3000)

export const Realtime = {
  subscribe(cb) {
    listeners.add(cb)
    // send immediately
    cb(navigation_logs)
    return () => listeners.delete(cb)
  },
}
