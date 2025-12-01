// // src/components/layout/Header.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { LogOut, User, Bell } from 'lucide-react';

// export default function Header({ role }) {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   return (
//     <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
//               S
//             </div>
//             <div>
//               <div className="text-gray-900 font-bold">SchoolBus Tracker</div>
//               <div className="text-xs text-gray-500">Hệ thống đưa đón học sinh</div>
//             </div>
//           </div>

//           {/* Right: User menu */}
//           {user ? (
//             <div className="flex items-center gap-4">
//               <button className="relative p-2 rounded-full hover:bg-gray-100">
//                 <Bell className="w-5 h-5 text-gray-600" />
//                 <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>

//               <div className="relative group">
//                 <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
//                   <img
//                     src={user.avatar}
//                     alt={user.name}
//                     className="w-9 h-9 rounded-full border-2 border-indigo-600"
//                   />
//                   <span className="hidden md:block text-sm font-medium">{user.name}</span>
//                 </button>

//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
//                   <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2">
//                     <User className="w-4 h-4" /> Hồ sơ
//                   </button>
//                   <button
//                     onClick={logout}
//                     className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2"
//                   >
//                     <LogOut className="w-4 h-4" /> Đăng xuất
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <button className="rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700">
//               Đăng nhập
//             </button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
// src/components/layout/Header.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  if (!user) return null; // Ẩn header ở trang login

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
              S
            </div>
            <div>
              <div className="text-gray-900 font-bold text-lg">SchoolBus Tracker</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative group">
              <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full ring-2 ring-indigo-600"
                />
                <span className="font-medium text-gray-700">{user.name}</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <div className="px-4 py-3 border-b">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{user.role === 'driver' ? 'Tài xế' : 'Quản lý'}</div>
                </div>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2">
                  <User className="w-4 h-4" /> Hồ sơ
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}