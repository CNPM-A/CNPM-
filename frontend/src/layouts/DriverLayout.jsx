// // src/layouts/DriverLayout.jsx
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import DriverSidebar from '../components/driver/DriverSidebar';
// import Header from '../components/layout/header';
// import Footer from '../components/layout/footer';

// export default function DriverLayout() {
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header role="driver" />

//       <div className="flex flex-1">
//         <DriverSidebar />
//         <main className="flex-1 ml-64 transition-all duration-300">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       <Footer open={true} />
//     </div>
//   );
// }
// src/layouts/DriverLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import DriverSidebar from '../components/driver/DriverSidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function DriverLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header cố định */}
      <Header role="driver" />

      {/* Nội dung chính: có padding-top để tránh bị header đè */}
      <div className="flex flex-1 pt-16">
        <DriverSidebar />
        <main className="flex-1 ml-64 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer open={true} />
    </div>
  );
}