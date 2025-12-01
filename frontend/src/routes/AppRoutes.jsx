// // src/routes/AppRoutes.jsx
// import React, { Suspense, lazy } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import DriverLayout from '../layouts/DriverLayout';
// import PageLayout from '../components/layout/PageLayout'; // giữ tạm cho login, 404

// // Lazy load pages
// const Login = lazy(() => import('../pages/shared/login'));
// const NotFound = lazy(() => import('../pages/shared/NotFound'));

// // Driver pages
// const DriverHome = lazy(() => import('../pages/driver/DriverHome'));
// const DriverFeatures = lazy(() => import('../pages/driver/DriverFeatures'));
// const DriverContacts = lazy(() => import('../pages/driver/DriverContacts'));
// const DriverDailySchedule = lazy(() => import('../pages/driver/DriverDailySchedule'));
// const DriverOperations = lazy(() => import('../pages/driver/DriverOperations'));

// const Loader = () => (
//   <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center z-50">
//     <div className="text-white text-2xl font-bold animate-pulse">SchoolBus Tracker</div>
//   </div>
// );

// export default function AppRoutes() {
//   return (
//     <Suspense fallback={<Loader />}>
//       <Routes>
//         {/* Auth & Public */}
//         <Route element={<PageLayout />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="*" element={<NotFound />} />
//         </Route>

//         {/* Driver Routes - Dùng layout riêng */}
//         <Route element={<DriverLayout />}>
//           <Route path="/driver" element={<DriverHome />} />
//           <Route path="/driver/features" element={<DriverFeatures />} />
//           <Route path="/driver/contacts" element={<DriverContacts />} />
//           <Route path="/driver/daily-schedule" element={<DriverDailySchedule />} />
//           <Route path="/driver/operations" element={<DriverOperations />} />
//         </Route>

//         {/* Redirect root */}
//         <Route path="/" element={<Navigate to="/driver" replace />} />
//       </Routes>
//     </Suspense>
//   );
// }
// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DriverLayout from '../layouts/DriverLayout';

// Pages
const Login = lazy(() => import('../pages/shared/login'));
const NotFound = lazy(() => import('../pages/shared/NotFound'));

const DriverHome = lazy(() => import('../pages/driver/DriverHome'));
const DriverContacts = lazy(() => import('../pages/driver/DriverContacts'));
const DriverDailySchedule = lazy(() => import('../pages/driver/DriverDailySchedule'));
const DriverFeatures = lazy(() => import('../pages/driver/DriverFeatures'));
const DriverOperations = lazy(() => import('../pages/driver/DriverOperations'));

const Loader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center z-50">
    <div className="text-white text-3xl font-bold animate-pulse">SchoolBus Tracker</div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />

        {/* Driver - Dùng layout riêng */}
        <Route element={<DriverLayout />}>
          <Route path="/driver" element={<DriverHome />} />
          <Route path="/driver/contacts" element={<DriverContacts />} />
          <Route path="/driver/daily-schedule" element={<DriverDailySchedule />} />
          <Route path="/driver/features" element={<DriverFeatures />} />
          <Route path="/driver/operations" element={<DriverOperations />} />
        </Route>

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/driver" replace />} />
      </Routes>
    </Suspense>
  );
}