import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Trang chủ & Login
import TrangChu from './Trang_Chu/trang_chu';
import Login_Admin from './Trang_Chu/Login_Admin';
import Login_Parents from './Trang_Chu/Login_Parents';
import Login_Driver from './Trang_Chu/Login_Driver';

// Layout
import Admin_Layouts from './layouts/Admin_Layouts';

// Pages
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Driver from './pages/Driver';
import Bus from './pages/Bus';
import RoutesPage from './pages/Routes';
import Schedules from './pages/Schedules';
import Assignments from './pages/Assignments';
import Messages from './pages/Messages';
import Tracking from './pages/Tracking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ & Login */}
        <Route path="/" element={<TrangChu />} />
        <Route path="/admin/login" element={<Login_Admin />} />
        <Route path="/parents/login" element={<Login_Parents />} />
        <Route path="/driver/login" element={<Login_Driver />} />

        {/* Admin Routes - sử dụng Layout */}
        <Route path="/admin" element={<Admin_Layouts />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="drivers" element={<Driver />} />
          <Route path="buses" element={<Bus />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="messages" element={<Messages />} />
          <Route path="tracking" element={<Tracking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;