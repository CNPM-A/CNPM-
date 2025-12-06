// src/services/authService.js
import { logOut as apiLogOut, refreshToken as apiRefreshToken, signIn as apiSignIn, signUp as apiSignUp } from '../api/apiClient';

/**
 * Đăng ký tài khoản mới
 * @param {Object} userData - { name, email, password, passwordConfirm, role, phone }
 * @returns {Promise<Object>} - { token, user }
 */
export const signUp = async (userData) => {
  try {
    const response = await apiSignUp(userData);
    const { token, data } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return { token, user: data.user };
  } catch (error) {
    throw new Error(error.message || 'Đăng ký thất bại');
  }
};

/**
 * Đăng nhập
 * @param {Object} credentials - { email, password } hoặc { phone, password }
 * @returns {Promise<Object>} - { token, user }
 */
export const signIn = async (credentials) => {
  try {
    // Chuyển đổi email thành phone nếu là số điện thoại
    const loginData = { ...credentials };
    if (loginData.email && /^[0-9]+$/.test(loginData.email)) {
      loginData.phone = loginData.email;
      delete loginData.email;
    }
    
    console.log('Sending login request with data:', loginData);
    const response = await apiSignIn(loginData);
    console.log('Login response:', response.data);
    
    const { token, data } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return { token, user: data.user };
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    // Throw the original error object to preserve response data
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
    console.error('Lỗi khi đăng xuất:', error);
  } finally {
    // Dù API có lỗi vẫn xóa token local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Refresh access token
 * @returns {Promise<string>} - new token
 */
export const refreshToken = async () => {
  try {
    const response = await apiRefreshToken();
    const { token } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
    }
    
    return token;
  } catch (error) {
    // Nếu refresh token thất bại, logout user
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
  } catch {
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
  return !!getToken();
};

export default {
  signUp,
  signIn,
  logOut,
  refreshToken,
  getCurrentUser,
  getToken,
  isAuthenticated
};
