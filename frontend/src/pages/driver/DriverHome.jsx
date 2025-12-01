// // src/pages/driver/DriverHome.jsx
// import React, { useState } from 'react';
// import { MapPin, Phone, Users, Bus, Bell, Clock, AlertCircle, CheckCircle } from 'lucide-react';
// import RouteMap from '../../components/maps/RouteMap';

// // Sample data
// const vehicles = [
//   { id: 'v1', name: 'Bus 29A-123.45', plate: '29A-123.45', status: 'online' },
//   { id: 'v2', name: 'Bus 29B-987.65', plate: '29B-987.65', status: 'offline' },
// ];

// const stops = [
//   { name: 'Trạm A', position: [10.7628, 106.6602], time: '06:35', done: true },
//   { name: 'Trạm B', position: [10.7640, 106.6670], time: '06:42', done: true },
//   { name: 'Trạm C', position: [10.7665, 106.6820], time: '06:50', done: false },
//   { name: 'THPT Lê Quý Đôn', position: [10.7800, 106.6950], time: '07:10', done: false },
// ];

// const route = stops.map(s => s.position);

// export default function DriverHome() {
//   const [selectedVehicle] = useState(vehicles[0]);
//   const todaySchedule = { name: 'Sáng - Tuyến 1', time: '06:30', assigned: true };
//   const notifications = [
//     { id: 'n1', title: 'Lộ trình sáng thay đổi', time: '07:45', body: 'Do tắc đường Nguyễn Trãi, đi đường vòng qua Lê Văn Sỹ', urgent: true },
//     { id: 'n2', title: 'Nhắc xuất phát', time: '06:20', body: 'Chuyến sáng - Tuyến 1 sắp đến giờ', urgent: false },
//   ];
//   const contacts = [
//     { id: 'c1', name: 'Cô Lan (Mẹ An)', phone: '0901234567', relation: 'Mẹ', student: 'An' },
//     { id: 'c2', name: 'Chú Hùng (Bố Bình)', phone: '0912223334', relation: 'Bố', student: 'Bình' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       {/* Header card */}
//       <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
//         <div className="px-4 py-5">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold">Chào buổi sáng, Tài xế Nam!</h1>
//               <p className="text-indigo-100">Hôm nay: Thứ 4, 26/11/2025</p>
//             </div>

//             <div className="text-right">
//               <div className="flex items-center gap-2">
//                 <Bus className="w-8 h-8" />
//                 <div>
//                   <div className="font-semibold">{selectedVehicle.name}</div>
//                   <div className="text-sm opacity-90">
//                     Trạng thái: <span className="text-green-300">● Đang hoạt động</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 -mt-4">
//         {/* Quick Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl shadow p-4 text-center">
//             <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
//             <div className="text-2xl font-bold">28</div>
//             <div className="text-xs text-gray-500">Học sinh hôm nay</div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-4 text-center">
//             <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
//             <div className="text-2xl font-bold">12</div>
//             <div className="text-xs text-gray-500">Đã đón</div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-4 text-center">
//             <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
//             <div className="text-2xl font-bold">06:48</div>
//             <div className="text-xs text-gray-500">Giờ hiện tại</div>
//           </div>

//           <div className="bg-white rounded-xl shadow p-4 text-center">
//             <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
//             <div className="text-2xl font-bold">1</div>
//             <div className="text-xs text-gray-500">Sự cố cần xử lý</div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Left: map + stops */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//               <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
//                 <h3 className="font-bold text-lg flex items-center gap-2">
//                   <MapPin className="w-5 h-5" /> Lộ trình hiện tại - {todaySchedule.name}
//                 </h3>
//               </div>

//               <div className="h-96">
//                 <RouteMap center={route[0]} zoom={13} route={route} stops={stops} />
//               </div>

//               <div className="p-4">
//                 <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-3 text-sm">
//                   <div>Tiến độ: <strong>2/4 điểm dừng</strong></div>
//                   <div>Điểm tiếp theo: <strong>Trạm C - 06:50</strong></div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-5">
//               <h3 className="font-bold text-lg mb-4">Các điểm dừng hôm nay</h3>
//               <div className="space-y-3">
//                 {stops.map((stop, idx) => (
//                   <div
//                     key={idx}
//                     className={`flex items-center justify-between p-3 rounded-lg ${
//                       stop.done ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
//                           stop.done ? 'bg-green-600' : 'bg-gray-400'
//                         }`}
//                       >
//                         {idx + 1}
//                       </div>
//                       <div>
//                         <div className="font-medium">{stop.name}</div>
//                         <div className="text-xs text-gray-500">Dự kiến: {stop.time}</div>
//                       </div>
//                     </div>

//                     {stop.done ? (
//                       <CheckCircle className="w-6 h-6 text-green-600" />
//                     ) : (
//                       <Clock className="w-6 h-6 text-gray-400" />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right: notifications, contacts, actions */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-5">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-bold text-lg flex items-center gap-2">
//                   <Bell className="w-5 h-5" /> Thông báo
//                 </h3>
//                 <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">2 mới</span>
//               </div>

//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {notifications.map(n => (
//                   <div key={n.id} className={`p-3 rounded-lg border ${n.urgent ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
//                     <div className="font-medium text-sm">{n.title}</div>
//                     <div className="text-xs text-gray-500 mt-1">{n.time} • {n.body}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-5">
//               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
//                 <Phone className="w-5 h-5" /> Danh bạ nhanh
//               </h3>

//               <div className="space-y-3">
//                 {contacts.map(c => (
//                   <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div>
//                       <div className="font-medium text-sm">{c.name}</div>
//                       <div className="text-xs text-gray-500">{c.relation} của {c.student}</div>
//                     </div>
//                     <a href={`tel:${c.phone}`} className="bg-green-600 text-white p-3 rounded-full">
//                       <Phone className="w-4 h-4" />
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-5">
//               <h3 className="font-bold text-lg mb-4">Thao tác nhanh</h3>
//               <div className="grid grid-cols-1 gap-3">
//                 <button className="bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
//                   Bắt đầu chuyến đi
//                 </button>
//                 <button className="bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition">
//                   Báo cáo sự cố
//                 </button>
//                 <button className="border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
//                   Check-in học sinh
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// // // src/pages/driver/DriverHome.jsx
// // import React from 'react';

// // export default function DriverHome() {
// //   return (
// //     <div>
// //       <h1 className="text-2xl font-semibold">Trang Tổng quan (Driver Home)</h1>
// //       <p className="mt-2 text-gray-600">Nội dung dashboard cho tài xế...</p>
// //     </div>
// //   );
// // }
// src/pages/driver/DriverHome.jsx
import React, { useState } from 'react';
import { MapPin, Phone, Users, Bus, Bell, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import RouteMap from '../../components/maps/RouteMap';
import useDriverRouteLogic from '../../hooks/useDriverRouteLogic';

const vehicles = [
  { id: 'v1', name: 'Bus 29A-123.45', plate: '29A-123.45', status: 'online' },
  { id: 'v2', name: 'Bus 29B-987.65', plate: '29B-987.65', status: 'offline' },
];

const notificationsSample = [
  { id: 'n1', title: 'Lộ trình sáng thay đổi', time: '07:45', body: 'Do tắc đường Nguyễn Trãi, đi đường vòng qua Lê Văn Sỹ', urgent: true },
  { id: 'n2', title: 'Nhắc xuất phát', time: '06:20', body: 'Chuyến sáng - Tuyến 1 sắp đến giờ', urgent: false },
];

const contactsSample = [
  { id: 'c1', name: 'Cô Lan (Mẹ An)', phone: '0901234567', relation: 'Mẹ', student: 'An' },
  { id: 'c2', name: 'Chú Hùng (Bố Bình)', phone: '0912223334', relation: 'Bố', student: 'Bình' },
];

// routeStations used by the driver logic (replace with API data in production)
const routeStations = [
  { id: 'st1', name: 'Trạm A', lat: 10.7628, lng: 106.6602, time: '06:35' },
  { id: 'st2', name: 'Trạm B', lat: 10.7640, lng: 106.6670, time: '06:42' },
  { id: 'st3', name: 'Trạm C', lat: 10.7665, lng: 106.6820, time: '06:50' },
  { id: 'st4', name: 'THPT Lê Quý Đôn', lat: 10.7800, lng: 106.6950, time: '07:10' },
];

export default function DriverHome() {
  const [selectedVehicle] = useState(vehicles[0]);
  // integrate driver route logic hook
  const {
    currentIndex,
    currentStation,
    isAtStation,
    isTracking,
    currentPosition,
    logs,
    startTracking,
    stopTracking,
  } = useDriverRouteLogic(routeStations);

  const todaySchedule = { name: 'Sáng - Tuyến 1', time: '06:30', assigned: true };
  const route = routeStations.map((s) => [s.lat, s.lng]);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header card */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Chào buổi sáng, Tài xế Nam!</h1>
              <p className="text-indigo-100">Hôm nay: Thứ 4, 26/11/2025</p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                <Bus className="w-8 h-8" />
                <div>
                  <div className="font-semibold">{selectedVehicle.name}</div>
                  <div className="text-sm opacity-90">
                    Trạng thái:{' '}
                    <span className={selectedVehicle.status === 'online' ? 'text-green-300' : 'text-gray-300'}>
                      ● {selectedVehicle.status === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 -mt-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">28</div>
            <div className="text-xs text-gray-500">Học sinh hôm nay</div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-gray-500">Đã đón</div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{currentPosition ? new Date(currentPosition.ts).toLocaleTimeString() : '—'}</div>
            <div className="text-xs text-gray-500">Giờ hiện tại</div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-xs text-gray-500">Sự cố cần xử lý</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: map + stops */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Lộ trình hiện tại - {todaySchedule.name}
                </h3>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-white/90">
                    Trạm hiện tại: <strong>{currentStation?.name || '—'}</strong>
                    <span className="mx-2">•</span>
                    {isAtStation ? <span>Đang dừng</span> : <span>Di chuyển</span>}
                  </div>

                  <button
                    onClick={isTracking ? stopTracking : startTracking}
                    className={`ml-3 px-3 py-2 rounded text-white ${isTracking ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    {isTracking ? 'Dừng theo dõi' : 'Bắt đầu theo dõi'}
                  </button>
                </div>
              </div>

              <div className="h-96">
                <RouteMap
                  center={route[0]}
                  zoom={13}
                  route={route}
                  stops={routeStations.map(s => ({ id: s.id, name: s.name, position: [s.lat, s.lng] }))}
                />
              </div>

              <div className="p-4">
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-3 text-sm">
                  <div>Tiến độ: <strong>{currentIndex + 1}/{routeStations.length} điểm</strong></div>
                  <div>Điểm tiếp theo: <strong>{routeStations[currentIndex + 1]?.name || '—'}</strong></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5">
              <h3 className="font-bold text-lg mb-4">Các điểm dừng hôm nay</h3>
              <div className="space-y-3">
                {routeStations.map((stop, idx) => (
                  <div
                    key={stop.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${idx < currentIndex ? 'bg-green-50 border border-green-200' : (idx === currentIndex ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${idx < currentIndex ? 'bg-green-600' : (idx === currentIndex ? 'bg-indigo-600' : 'bg-gray-400')}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium">{stop.name}</div>
                        <div className="text-xs text-gray-500">Dự kiến: {stop.time}</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {idx === currentIndex ? (isAtStation ? 'Đang dừng' : 'Sắp đến') : (idx < currentIndex ? 'Đã qua' : 'Chưa tới')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: notifications, contacts, actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Thông báo
                </h3>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{notificationsSample.length} mới</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notificationsSample.map(n => (
                  <div key={n.id} className={`p-3 rounded-lg border ${n.urgent ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{n.time} • {n.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" /> Danh bạ nhanh
              </h3>

              <div className="space-y-3">
                {contactsSample.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.relation} của {c.student}</div>
                    </div>
                    <a href={`tel:${c.phone}`} className="bg-green-600 text-white p-3 rounded-full">
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5">
              <h3 className="font-bold text-lg mb-4">Event logs (gần đây)</h3>
              <div className="max-h-64 overflow-auto text-sm">
                {logs.length === 0 ? <div className="text-gray-500">Không có event</div> : null}
                {logs.map((l, i) => (
                  <div key={i} className="p-2 border-b">
                    <div className="text-xs text-gray-400">{new Date(l.ts).toLocaleTimeString()}</div>
                    <div className="text-sm">{l.type} {l.station ? `— ${l.station.name}` : ''} {l.distance ? `(${l.distance} m)` : ''}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5">
              <h3 className="font-semibold mb-2">Ghi chú</h3>
              <p className="text-xs text-gray-500">Frontend kiểm tra khoảng cách và phát sự kiện. Backend sẽ forward tới phụ huynh/ứng dụng. Nếu cần thêm vehicleId/driverId, tích hợp useAuth() và truyền vào payload emit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
