// // src/services/socketService.js
// import io from 'socket.io-client';
// import { getToken } from './authService';
// import { getTrip } from './tripService'; // ← Import đúng từ tripService

// let socket = null;

// // URL backend – dùng cùng với HTTP API để đảm bảo đồng bộ
// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || 'https://smart-school-bus-api.onrender.com';

// /**
//  * Kết nối Socket.IO với token xác thực
//  * @returns {import('socket.io-client').Socket | null}
//  */
// export const connectSocket = () => {
//   const token = getToken();

//   if (!token) {
//     console.warn('Không có token → Không kết nối Socket.IO');
//     return null;
//   }

//   // Nếu đã kết nối rồi thì không tạo lại
//   if (socket && socket.connected) {
//     return socket;
//   }

//   // Tạo kết nối mới
//   socket = io(API_BASE_URL, {
//     auth: { token },
//     reconnection: true,
//     reconnectionAttempts: 10,
//     reconnectionDelay: 3000,
//     timeout: 15000,
//     transports: ['websocket', 'polling'], // Ưu tiên websocket, fallback polling
//   });

//   // Log trạng thái kết nối
//   socket.on('connect', () => {
//     console.log('Socket.IO đã kết nối thành công:', socket.id);
//   });

//   socket.on('connect_error', (error) => {
//     console.error('Socket.IO kết nối thất bại:', error.message);
//   });

//   socket.on('disconnect', (reason) => {
//     console.warn('Socket.IO ngắt kết nối:', reason);
//     if (reason === 'io server disconnect') {
//       // Server chủ động ngắt → thử kết nối lại
//       socket.connect();
//     }
//   });

//   socket.on('error', (err) => {
//     console.error('Socket.IO lỗi:', err);
//   });

//   return socket;
// };

// /**
//  * Ngắt kết nối Socket.IO
//  */
// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//     console.log('Socket.IO đã ngắt kết nối thủ công');
//   }
// };

// /**
//  * Tham gia room của chuyến đi (trip_<id>)
//  * @param {string} tripId
//  */
// export const joinTripRoom = (tripId) => {
//   if (socket && tripId) {
//     socket.emit('join_trip', tripId);
//     console.log(`Đã tham gia room: trip_${tripId}`);
//   }
// };

// /**
//  * Rời room của chuyến đi
//  * @param {string} tripId
//  */
// export const leaveTripRoom = (tripId) => {
//   if (socket && tripId) {
//     socket.emit('leave_trip', tripId);
//     console.log(`Đã rời room: trip_${tripId}`);
//   }
// };

// /**
//  * Fallback: Poll dữ liệu chuyến đi nếu Socket.IO bị mất kết nối
//  * @param {string} tripId
//  * @param {Function} callback - Hàm nhận dữ liệu trip mới
//  * @param {number} interval - Khoảng thời gian poll (ms)
//  * @returns {Function} Hàm để dừng poll
//  */
// export const startPollingTrip = (tripId, callback, interval = 30000) => {
//   if (!tripId || typeof callback !== 'function') return () => {};

//   const poller = setInterval(async () => {
//     try {
//       const tripData = await getTrip(tripId);
//       callback(tripData);
//       console.log('Poll cập nhật trip thành công (fallback)');
//     } catch (err) {
//       console.error('Lỗi poll trip:', err.message || err);
//     }
//   }, interval);

//   console.log(`Bắt đầu poll trip_${tripId} mỗi ${interval / 1000}s`);

//   // Trả về hàm để dừng poll khi cần
//   return () => {
//     clearInterval(poller);
//     console.log(`Đã dừng poll trip_${tripId}`);
//   };
// };

// /**
//  * Kiểm tra trạng thái kết nối Socket.IO
//  * @returns {boolean}
//  */
// export const isSocketConnected = () => {
//   return socket?.connected || false;
// };

// /**
//  * Lấy instance socket hiện tại (dùng trong context nếu cần)
//  * @returns {import('socket.io-client').Socket | null}
//  */
// export const getSocket = () => socket;

// export default {
//   connectSocket,
//   disconnectSocket,
//   joinTripRoom,
//   leaveTripRoom,
//   startPollingTrip,
//   isSocketConnected,
//   getSocket,
// };
// src/services/socketService.js
import io from 'socket.io-client';
import { getToken } from './authService';
import { getTrip } from './tripService';

let socket = null;

// ===== CHỈNH SỬA DÒNG NÀY ĐỂ FIX "Invalid namespace" =====
// Cắt bỏ /api/v1 → chỉ giữ domain + port
const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'https://smart-school-bus-api.onrender.com';

export const connectSocket = () => {
  const token = getToken();

  if (!token) {
    console.warn('Không có token → Không kết nối Socket.IO');
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    path: '/socket.io', // ← Rõ ràng chỉ định path (đảm bảo 100%)
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 3000,
    timeout: 15000,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket.IO kết nối thành công:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO kết nối thất bại:', error.message);
    if (error.message === 'Invalid namespace') {
      console.error('Lỗi: Server không có namespace này. Kiểm tra SOCKET_URL và backend socket path.');
    }
  });

  socket.on('disconnect', (reason) => {
    console.warn('Socket.IO ngắt kết nối:', reason);
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  socket.on('error', (err) => {
    console.error('Socket.IO lỗi:', err);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket.IO đã ngắt kết nối thủ công');
  }
};

export const joinTripRoom = (tripId) => {
  if (socket && tripId) {
    socket.emit('join_trip', tripId);
    console.log(`Đã tham gia room: trip_${tripId}`);
  }
};

export const leaveTripRoom = (tripId) => {
  if (socket && tripId) {
    socket.emit('leave_trip', tripId);
    console.log(`Đã rời room: trip_${tripId}`);
  }
};

export const startPollingTrip = (tripId, callback, interval = 30000) => {
  if (!tripId || typeof callback !== 'function') return () => {};

  const poller = setInterval(async () => {
    try {
      const tripData = await getTrip(tripId);
      callback(tripData);
    } catch (err) {
      console.error('Lỗi poll trip:', err.message || err);
    }
  }, interval);

  return () => clearInterval(poller);
};

export const isSocketConnected = () => socket?.connected || false;
export const getSocket = () => socket;

export default {
  connectSocket,
  disconnectSocket,
  joinTripRoom,
  leaveTripRoom,
  startPollingTrip,
  isSocketConnected,
  getSocket,
};