// // src/pages/driver/DriverDailySchedule.jsx
// import React, { useMemo } from 'react';
// import { Play, Square, Bus, MapPin, Clock } from 'lucide-react';
// import RouteMap from '../../components/maps/RouteMap';

// // IMPORT LOGIC MỚI
// import useDriverRouteLogic from '../../hooks/useDriverRouteLogic';

// export default function DriverDailySchedule() {
//   // ==============================
//   // DỮ LIỆU MẪU (sau sẽ thay bằng API)
//   // ==============================
//   const stations = useMemo(() => [
//     { id: 'st1', name: 'Trạm A', lat: 10.7628, lng: 106.6602, time: '06:35' },
//     { id: 'st2', name: 'Trạm B', lat: 10.7640, lng: 106.6670, time: '06:42' },
//     { id: 'st3', name: 'Trạm C', lat: 10.7665, lng: 106.6820, time: '06:50' },
//     { id: 'st4', name: 'Trạm D', lat: 10.7800, lng: 106.6950, time: '07:10' },
//   ], []);

//   // Convert to format for hook
//   const stationRouteForHook = stations.map(s => ({
//     id: s.id,
//     name: s.name,
//     lat: s.lat,
//     lng: s.lng,
//     time: s.time,
//   }));

//   // ==============================
//   // TÍCH HỢP LOGIC MỚI
//   // ==============================
//   const {
//     currentIndex,
//     currentStation,
//     nextStation,
//     isTracking,
//     isAtStation,
//     startTracking,
//     stopTracking,
//     currentPosition,
//   } = useDriverRouteLogic(stationRouteForHook);

//   // ==============================
//   // NÚT BẮT ĐẦU / DỪNG
//   // ==============================
//   const handleToggle = () => {
//     isTracking ? stopTracking() : startTracking();
//   };

//   // ==============================
//   // CHUẨN HOÁ DỮ LIỆU CHO MAP
//   // ==============================
//   const stopsForMap = useMemo(
//     () => stations.map(s => ({ id: s.id, position: [s.lat, s.lng], name: s.name })),
//     [stations]
//   );

//   // Route polyline
//   const routePolyline = stopsForMap.map(s => s.position);

//   return (
//     <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4">

//       {/* ============================== */}
//       {/* HEADER – giữ nguyên 100%       */}
//       {/* ============================== */}
//       <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-2xl">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//           <div>
//             <h1 className="text-5xl font-bold flex items-center gap-5">
//               <Bus className="w-14 h-14" />
//               Lịch trình hôm nay – Tuyến 01
//             </h1>
//             <p className="mt-4 text-2xl opacity-95">
//               28 học sinh • Xe 59A-12345 • Tài xế: Nguyễn Văn A
//             </p>
//           </div>

//           <div className="text-right">
//             <div className="text-6xl font-bold">
//               {new Date().toLocaleTimeString('vi-VN', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </div>
//             <div className="text-xl opacity-90">
//               {new Date().toLocaleDateString('vi-VN', {
//                 weekday: 'long',
//                 day: 'numeric',
//                 month: 'long',
//                 year: 'numeric',
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ============================== */}
//       {/* NÚT BẮT ĐẦU / DỪNG – giữ nguyên */}
//       {/* ============================== */}
//       <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-800">Trạng thái chuyến đi</h2>
//           <p className="text-2xl font-semibold text-indigo-600 mt-3">
//             {isTracking ? 'ĐANG DI CHUYỂN' : 'Chưa bắt đầu chuyến đi'}
//           </p>
//         </div>

//         {!isTracking ? (
//           <button
//             onClick={handleToggle}
//             className="px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-3xl font-bold rounded-2xl hover:from-green-600 hover:to-emerald-700 shadow-2xl flex items-center gap-5 transform hover:scale-110 transition-all duration-300"
//           >
//             <Play className="w-12 h-12" />
//             BẮT ĐẦU CHUYẾN ĐI
//           </button>
//         ) : (
//           <button
//             onClick={handleToggle}
//             className="px-12 py-6 bg-gradient-to-r from-red-500 to-rose-600 text-white text-3xl font-bold rounded-2xl hover:from-red-600 hover:to-rose-700 shadow-2xl flex items-center gap-5 transform hover:scale-110 transition-all duration-300"
//           >
//             <Square className="w-12 h-12" />
//             DỪNG LẠI NGAY
//           </button>
//         )}
//       </div>

//       {/* ============================== */}
//       {/* BẢN ĐỒ + TÌNH TRẠNG TRẠM       */}
//       {/* ============================== */}
//       <div className="grid lg:grid-cols-3 gap-10">

//         {/* Bản đồ */}
//         <div className="lg:col-span-2 space-y-6">
//           <RouteMap
//             stops={stopsForMap}
//             route={routePolyline}
//             isTracking={isTracking}
//             currentStationIndex={currentIndex}
//           />

//           {/* THÔNG BÁO SẮP ĐẾN TRẠM */}
//           {isTracking && nextStation && (
//             <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white p-8 rounded-3xl text-center font-bold text-3xl shadow-2xl animate-pulse">
//               SẮP ĐẾN TRẠM
//               <div className="text-4xl mt-3">{nextStation.name}</div>
//               <div className="text-xl mt-2 opacity-90">
//                 Dự kiến: {nextStation.time}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ============================== */}
//         {/* PANEL TRẠM HIỆN TẠI           */}
//         {/* ============================== */}
//         <div className="space-y-8">

//           <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl shadow-2xl p-10 text-center">
//             <h3 className="text-3xl font-bold mb-6 flex items-center justify-center gap-4">
//               <MapPin className="w-10 h-10" />
//               Trạm hiện tại
//             </h3>

//             <div className="text-5xl font-bold">
//               {currentStation?.name || 'Chưa xuất phát'}
//             </div>

//             <div className="text-2xl mt-4 opacity-90">
//               {currentStation?.time || '--:--'}
//             </div>

//             <div className="mt-3 text-xl">
//               {isAtStation ? 'Xe đang dừng tại trạm' : 'Đang di chuyển'}
//             </div>
//           </div>

//           {/* ============================== */}
//           {/* TIẾN ĐỘ LỘ TRÌNH (giữ nguyên) */}
//           {/* ============================== */}
//           <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-gray-100">
//             <h3 className="text-3xl font-bold mb-8 flex items-center gap-4 text-indigo-700">
//               <Clock className="w-10 h-10" />
//               Tiến độ lộ trình
//             </h3>

//             <div className="space-y-6">
//               {stations.map((st, i) => {
//                 const status =
//                   i < currentIndex
//                     ? 'ĐÃ QUA'
//                     : i === currentIndex
//                     ? (isAtStation ? 'ĐANG DỪNG' : 'ĐANG ĐẾN')
//                     : 'CHƯA TỚI';

//                 return (
//                   <div
//                     key={st.id}
//                     className={`p-6 rounded-2xl border-4 transition-all duration-700 transform ${
//                       i < currentIndex
//                         ? 'border-green-500 bg-green-50 scale-105 shadow-xl'
//                         : i === currentIndex
//                         ? 'border-blue-600 bg-blue-50 shadow-2xl scale-110 animate-pulse'
//                         : 'border-gray-300 bg-gray-50'
//                     }`}
//                   >
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <div className="text-2xl font-bold text-gray-800">{st.name}</div>
//                         <div className="text-lg text-gray-600 mt-1">{st.time}</div>
//                       </div>

//                       <div className="text-2xl font-bold text-indigo-700">{status}</div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
/// src/pages/driver/DriverDailySchedule.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { PlayCircle, PauseCircle, Bus, MapPin, Clock, Calendar, ChevronRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import RouteMap from '../../components/maps/RouteMap';
import { useRouteTracking } from '../../context/RouteTrackingContext';

export default function DriverDailySchedule() {
  // ==============================
  // PHÂN CÔNG NHIỀU TUYẾN TRONG NGÀY
  // ==============================
  const routesToday = useMemo(() => [
    {
      id: 'route1',
      name: 'Tuyến 01 - Sáng',
      time: '06:30 - 07:30',
      students: 28,
      status: 'current',
      stations: [
        { id: 's1', name: 'Trạm A - Nguyễn Trãi', position: [10.7628, 106.6602], time: '06:35' },
        { id: 's2', name: 'Trạm B - Lê Văn Sỹ', position: [10.7640, 106.6670], time: '06:42' },
        { id: 's3', name: 'Trạm C - CMT8', position: [10.7715, 106.6780], time: '06:50' },
        { id: 's4', name: 'THPT Lê Quý Đôn', position: [10.7800, 106.6950], time: '07:05' },
      ],
    },
    {
      id: 'route2',
      name: 'Tuyến 02 - Chiều',
      time: '16:00 - 17:00',
      students: 25,
      status: 'upcoming',
      stations: [
        { id: 's5', name: 'THPT Lê Quý Đôn', position: [10.7800, 106.6950], time: '16:00' },
        { id: 's6', name: 'Trạm D - Nguyễn Thị Minh Khai', position: [10.7680, 106.6850], time: '16:20' },
        { id: 's7', name: 'Trạm E - Võ Thị Sáu', position: [10.7750, 106.6900], time: '16:35' },
      ],
    },
  ], []);

  // Tuyến hiện tại
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const currentRoute = routesToday[currentRouteIndex];

  // Dùng context để theo dõi lộ trình
  const {
    isTracking,
    currentStationIndex,
    currentStation,
    stations,
    currentStudents = [],
    studentCheckIns = {},
    checkInStudent,
    stationTimer,
    isStationActive,
    startTracking,
    stopTracking,
  } = useRouteTracking();

  // Tự động chuyển tuyến khi đến trạm cuối
  useEffect(() => {
    if (isTracking && currentStationIndex >= stations.length - 1 && isStationActive) {
      setTimeout(() => {
        if (currentRouteIndex < routesToday.length - 1) {
          setCurrentRouteIndex(prev => prev + 1);
          alert(`ĐÃ HOÀN THÀNH ${currentRoute.name}!\nChuyển sang ${routesToday[currentRouteIndex + 1].name}`);
        } else {
          alert('HOÀN THÀNH TẤT CẢ TUYẾN TRONG NGÀY!');
          stopTracking();
        }
      }, 3000);
    }
  }, [currentStationIndex, isStationActive, currentRouteIndex, routesToday.length, currentRoute.name, stopTracking]);

  const checkedCount = currentStudents.filter(s => studentCheckIns[s.id] === 'present').length;
  const totalAtStation = currentStudents.length;
  const allChecked = totalAtStation > 0 && checkedCount === totalAtStation;
  const isWaitingToStartCheckIn = isStationActive && stationTimer === 0;
  const isCheckingIn = isStationActive && stationTimer > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* HEADER + TUYẾN HIỆN TẠI + NÚT BẮT ĐẦU */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            <div>
              <h1 className="text-3xl font-bold">Lịch trình hôm nay</h1>
              <p className="text-indigo-100 mt-1">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* TUYẾN HIỆN TẠI */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 text-center">
                <div className="flex items-center gap-3">
                  <MapPin className="w-7 h-7" />
                  <div>
                    <div className="font-bold text-lg">TUYẾN HIỆN TẠI</div>
                    <div className="text-sm opacity-90">{currentRoute.name}</div>
                  </div>
                </div>
              </div>

              {/* NÚT BẮT ĐẦU / DỪNG */}
              <button
                onClick={isTracking ? stopTracking : startTracking}
                className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all transform hover:scale-105 ${
                  isTracking
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                }`}
              >
                {isTracking ? (
                  <>
                    <PauseCircle className="w-9 h-9" />
                    DỪNG
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-9 h-9" />
                    BẮT ĐẦU
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* PHÂN CÔNG TUYẾN TRONG NGÀY – GỌN ĐẸP */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 border-2 border-gray-200">
          <h3 className="text-2xl font-bold mb-5 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-600" />
            Phân công hôm nay
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {routesToday.map((route, idx) => (
              <div
                key={route.id}
                className={`p-5 rounded-2xl border-3 transition-all ${
                  idx === currentRouteIndex
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl scale-105'
                    : route.status === 'completed'
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-gray-50 border-gray-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-lg">{route.name}</div>
                  {idx === currentRouteIndex && <span className="text-xs bg-white/30 px-3 py-1 rounded-full">Đang chạy</span>}
                </div>
                <div className="text-sm opacity-90">{route.time}</div>
                <div className="text-sm mt-1">{route.students} học sinh</div>
              </div>
            ))}
          </div>
        </div>

        {/* BẢN ĐỒ */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-indigo-100 mb-8">
          <div className="h-96">
            <RouteMap
              center={currentRoute.stations[0]?.position || [10.77, 106.68]}
              stops={currentRoute.stations.map(s => ({
                id: s.id,
                name: s.name,
                position: s.position,
                time: s.time,
              }))}
              isTracking={isTracking}
              currentStationIndex={currentStationIndex}
              isStationActive={isStationActive}
            />
          </div>
        </div>

        {/* CHECK-IN HỌC SINH – SIÊU GỌN, SIÊU ĐẸP */}
        {isTracking && isStationActive && currentStationIndex < currentRoute.stations.length - 1 && (
          <div className="bg-gradient-to-br from-purple-700 to-pink-700 text-white rounded-3xl shadow-2xl p-6 border-4 border-white mb-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold flex items-center justify-center gap-4">
                <Bus className="w-10 h-10 animate-bounce" />
                ĐANG DỪNG TẠI: {currentStation?.name}
              </h3>
              {isCheckingIn && (
                <div className={`mt-4 text-5xl font-bold ${stationTimer <= 10 ? 'text-red-300 animate-pulse' : 'text-yellow-200'}`}>
                  {stationTimer}s
                </div>
              )}
            </div>

            {isCheckingIn && (
              <div className="bg-white/20 backdrop-blur rounded-2xl p-6 border-3 border-white/40">
                <h4 className="text-xl font-bold text-center mb-5">
                  CHECK-IN ({checkedCount}/{totalAtStation})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {currentStudents.map(s => {
                    const status = studentCheckIns[s.id];
                    return (
                      <div
                        key={s.id}
                        className={`p-4 rounded-xl text-center border-3 transition-all ${
                          status === 'present' ? 'bg-green-500 text-white border-green-600' :
                          status === 'absent' ? 'bg-red-500 text-white line-through border-red-600' :
                          'bg-white/30 border-white hover:bg-white/50'
                        }`}
                      >
                        <div className="font-bold text-sm">{s.name}</div>
                        {!status && (
                          <button
                            onClick={() => checkInStudent(s.id)}
                            className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black text-xs px-4 py-2 rounded-lg font-bold shadow hover:scale-110 transition"
                          >
                            CÓ MẶT
                          </button>
                        )}
                        {status === 'present' && <CheckCircle className="w-7 h-7 mx-auto mt-2" />}
                        {status === 'absent' && <XCircle className="w-7 h-7 mx-auto mt-2" />}
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mt-6 text-lg">
                  {allChecked && totalAtStation > 0 && (
                    <div className="text-2xl font-bold text-yellow-200 animate-bounce">
                      ĐÃ CHECK ĐỦ – XE SẼ CHẠY SAU 3S!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TIẾN ĐỘ TUYẾN HIỆN TẠI */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-center mb-5 text-indigo-700">
            Tiến độ: {currentRoute.name}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentRoute.stations.map((s, i) => (
              <div
                key={s.id}
                className={`p-4 rounded-xl text-center font-medium transition-all ${
                  i < currentStationIndex
                    ? 'bg-green-100 text-green-800'
                    : i === currentStationIndex
                    ? 'bg-purple-100 text-purple-800 shadow-lg scale-105'
                    : 'bg-gray-100'
                }`}
              >
                <div className="font-bold text-lg">{i + 1}</div>
                <div className="text-xs mt-1">{s.name}</div>
                <div className="text-xs opacity-70">{s.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}