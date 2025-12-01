// // src/context/AuthProvider.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from './AuthContext';

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const saved = localStorage.getItem('busUser');
//     if (saved) {
//       try {
//         setUser(JSON.parse(saved));
//       } catch {
//         localStorage.removeItem('busUser');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData) => {
//     const userInfo = {
//       id: Date.now(),
//       name: userData.name,
//       role: userData.role,
//       phone: userData.phone || '',
//       vehicle: userData.vehicle || null,
//       avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
//     };

//     setUser(userInfo);
//     localStorage.setItem('busUser', JSON.stringify(userInfo));

//     const redirect = {
//       driver: '/driver',
//       parent: '/parent',
//       manager: '/manager/dashboard',
//     };
//     navigate(redirect[userInfo.role] || '/', { replace: true });
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('busUser');
//     navigate('/login', { replace: true });
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAuthenticated: !!user,
//     isDriver: user?.role === 'driver',
//     isParent: user?.role === 'parent',
//     isManager: user?.role === 'manager',
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }
// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('busUser');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('busUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userInfo = {
      id: Date.now(),
      name: userData.name,
      role: userData.role,
      phone: userData.phone || '',
      vehicle: userData.vehicle || null,
      avatar:
        userData.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
    };

    setUser(userInfo);
    localStorage.setItem('busUser', JSON.stringify(userInfo));

    const redirect = {
      driver: '/driver',
      parent: '/parent/dashboard',
      manager: '/manager/dashboard',
    };
    navigate(redirect[userInfo.role] || '/', { replace: true });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('busUser');
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isDriver: user?.role === 'driver',
    isParent: user?.role === 'parent',
    isManager: user?.role === 'manager',
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
