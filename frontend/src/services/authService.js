// src/services/authService.js
import { logOut as apiLogOut, refreshToken as apiRefreshToken, signIn as apiSignIn, signUp as apiSignUp } from '../api/apiClient';
import { connectSocket, disconnectSocket } from './socketService'; // Thêm Socket.IO
import { getMySchedule } from './tripService';
import { getScheduleRoute } from './scheduleService';

/**
 * Prefetch route data cho driver sau khi đăng nhập
 * Lưu vào localStorage để tránh gọi API liên tục
 */
const prefetchDriverRouteData = async (user) => {
  if (user?.role !== 'driver') return; // Chỉ prefetch cho driver

  try {
    console.log('[Auth] Prefetching driver route data...');

    // 1. Lấy lịch trình hôm nay
    const schedule = await getMySchedule();
    if (!schedule || schedule.length === 0) {
      console.log('[Auth] No schedule for today');
      return;
    }

    // 2. Lấy active trip
    const now = new Date();
    const activeTrip = schedule.find(trip =>
      trip.status === 'IN_PROGRESS' ||
      (trip.status === 'NOT_STARTED' && new Date(trip.tripDate) <= now)
    ) || schedule[0];

    if (!activeTrip?.scheduleId) {
      console.log('[Auth] No scheduleId found in trip');
      return;
    }

    // 3. Gọi getScheduleRoute để lấy route shape
    console.log('[Auth] Fetching route for scheduleId:', activeTrip.scheduleId);
    const routeData = await getScheduleRoute(activeTrip.scheduleId);

    // 4. Cache vào localStorage
    const today = new Date().toISOString().split('T')[0];
    const cacheData = {
      schedule,
      activeTrip,
      routeData,
      timestamp: Date.now()
    };
    localStorage.setItem(`driver_route_cache_${today}`, JSON.stringify(cacheData));
    console.log('[Auth] Driver route data cached successfully');

  } catch (error) {
    console.warn('[Auth] Prefetch failed (non-blocking):', error.message);
    // Không throw - đây là prefetch, không block login
  }
};

/**
 * Đăng ký tài khoản mới
 * @param {Object} userData - { name, email, password, passwordConfirm, role, phone }
 * @returns {Promise<Object>} - { token, user }
 */
export const signUp = async (userData) => {
  try {
    const response = await apiSignUp(userData);
    const { accessToken, data } = response.data;
    const token = accessToken;

    if (token && data?.user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Kết nối Socket.IO ngay sau khi đăng ký thành công
      connectSocket();

      // Prefetch route data cho driver
      prefetchDriverRouteData(data.user);
    }

    return { token, user: data.user };
  } catch (error) {
    console.error('Lỗi đăng ký:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Đăng nhập
 * @param {Object} credentials - { username, password }
 * @returns {Promise<Object>} - { token, user }
 */
export const signIn = async (credentials) => {
  try {
    console.log('Sending login request with:', credentials);
    const response = await apiSignIn(credentials);
    console.log('Login response:', response.data);

    const { accessToken, data } = response.data;
    const token = accessToken;

    if (token && data?.user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Kết nối Socket.IO ngay sau khi đăng nhập thành công
      connectSocket();

      // Prefetch route data cho driver (chạy async, không block)
      prefetchDriverRouteData(data.user);
    }

    return { token, user: data.user };
  } catch (error) {
    console.error('Lỗi đăng nhập:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

/**
 * Đăng xuất
 */
export const logOut = async () => {
  try {
    await apiLogOut();
  } catch (error) {
    console.error('Lỗi khi gọi API logout:', error);
  } finally {
    // Luôn xóa dữ liệu local dù API có lỗi
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Ngắt kết nối Socket.IO
    disconnectSocket();

    // Redirect về login (nếu không dùng router, dùng window.location)
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
};

/**
 * Refresh access token
 * @returns {Promise<string>} - token mới
 */
export const refreshToken = async () => {
  try {
    const response = await apiRefreshToken();
    const { token } = response.data;

    if (token) {
      localStorage.setItem('token', token);
      console.log('Token đã được refresh thành công');

      // Reconnect socket với token mới
      disconnectSocket();
      connectSocket();
    }

    return token;
  } catch (error) {
    console.error('Refresh token thất bại → Đăng xuất người dùng', error);
    await logOut(); // Tự động logout nếu refresh fail
    throw new Error('Phiên đăng nhập hết hạn');
  }
};

/**
 * Lấy thông tin user từ localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Lỗi parse user từ localStorage:', error);
    return null;
  }
};

/**
 * Lấy token từ localStorage
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Kiểm tra user đã đăng nhập chưa
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Kiểm tra token có hết hạn không (rất nhẹ)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch (error) {
    console.warn('Token không hợp lệ → coi như chưa đăng nhập');
    return false;
  }
};

/**
 * Kiểm tra và refresh token nếu sắp hết hạn (gọi định kỳ)
 */
export const ensureValidToken = async () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    const timeLeft = payload.exp - now;

    // Nếu còn dưới 5 phút → refresh trước
    if (timeLeft < 300) {
      console.log('Token sắp hết hạn → tự động refresh...');
      await refreshToken();
    }
    return true;
  } catch (error) {
    console.error('Lỗi kiểm tra token → logout');
    await logOut();
    return false;
  }
};

// Tự động kiểm tra token mỗi 4 phút (nếu user đang online)
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (isAuthenticated()) {
      ensureValidToken();
    }
  }, 4 * 60 * 1000); // 4 phút
}

export default {
  signUp,
  signIn,
  logOut,
  refreshToken,
  getCurrentUser,
  getToken,
  isAuthenticated,
  ensureValidToken,
};