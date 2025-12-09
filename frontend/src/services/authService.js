import api from './api';

/**
 * Logs in the user by sending credentials to the backend.
 * @param {object} credentials - { username, password } or { email, password }
 * @returns {Promise<object>} The data from the API response.
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/signin', credentials);
    
    if (response.data && response.data.accessToken) {
      const { accessToken, data } = response.data;
      
      console.log("Login success:", response.data);

      localStorage.setItem('token', accessToken);
      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return response.data;
    } else {
      throw new Error('Login did not return an access token.');
    }
  } catch (error) {
    console.error('Login failed in authService:', error);
    throw error;
  }
};

// Alias for driver frontend compatibility
export const signIn = login;

/**
 * Mock login for offline demonstration
 */
export const loginDemo = () => {
  const mockToken = 'demo-token-12345';
  const mockUser = { username: 'demo_parent', name: 'Demo Parent' };
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  return Promise.resolve({ success: true, user: mockUser, token: mockToken });
};

/**
 * Logs out the user
 */
export const logout = async () => {
  try {
    await api.delete('/auth/logout');
  } catch (error) {
    console.warn("Logout API call failed:", error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Alias for driver frontend compatibility
export const logOut = logout;

/**
 * Retrieves the currently stored JWT token.
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Retrieves the currently stored user data.
 * @returns {object|null}
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    return null;
  }
};

/**
 * Checks if a user is currently authenticated.
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getToken();
};

// Default export for backward compatibility
const authService = {
  login,
  signIn,
  logout,
  logOut,
  getToken,
  getCurrentUser,
  isAuthenticated,
  loginDemo,
};

export default authService;
