// src/pages/shared/login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState('driver');

  const handleLogin = () => {
    login({
      name: role === 'driver' ? 'Tài xế Nam' : role === 'parent' ? 'Phụ huynh An' : 'Quản lý Hùng',
      role,
      phone: '0901234567',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">SchoolBus Tracker</h1>
        <div className="space-y-6">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-4 border rounded-lg text-lg"
          >
            <option value="driver">Tài xế</option>
            <option value="parent">Phụ huynh</option>
            <option value="manager">Quản lý</option>
          </select>
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
          >
            Đăng nhập {role === 'driver' ? 'Tài xế' : role === 'parent' ? 'Phụ huynh' : 'Quản lý'}
          </button>
        </div>
      </div>
    </div>
  );
}