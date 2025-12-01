// // src/utils/socket.js
// import { io } from 'socket.io-client';

// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// export const socket = io(SOCKET_URL, {
//   autoConnect: false,
//   transports: ['websocket'],
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// socket.on('connect', () => console.log('Socket connected:', socket.id));
// socket.on('connect_error', (err) => console.error('Socket error:', err.message));

// export const connectSocket = () => socket.connected || socket.connect();
// export const disconnectSocket = () => socket.disconnect();
// src/utils/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (err) => {
  console.error('Socket connect error:', err.message);
});