// // src/pages/driver/DriverDailySchedule.jsx
// import React, { useEffect } from 'react';
// import { Play, Square, Bus, MapPin, Clock } from 'lucide-react';
// import RouteMap from '../../components/maps/RouteMap';
// import useDriverRouteLogic from '../../hooks/useDriverRouteLogic';

// // Dữ liệu lộ trình mẫu
// const routeStations = [
//   { id: 'st1', name: 'Trạm A - Nguyễn Trãi', lat: 10.7628, lng: 106.6602, time: '06:35' },
//   { id: 'st2', name: 'Trạm B - Lê Văn Sỹ', lat: 10.7640, lng: 106.6670, time: '06:42' },
//   { id: 'st3', name: 'Trạm C - CMT8', lat: 10.7665, lng: 106.6820, time: '06:50' },
//   { id: 'st4', name: 'THPT Lê Quý Đôn', lat: 10.7800, lng: 106.6950, time: '07:10' },
// ];

// export default function DriverDailySchedule() {
//   const {
//     currentIndex,
//     currentStation,
//     nextStation,
//     isAtStation,
//     isTracking,
//     currentPosition,
//     logs,
//     startTracking,
//     stopTracking,
//   } = useDriverRouteLogic(routeStations);

//   const route = routeStations.map(s => [s.lat, s.lng]);

//   // Thay toast bằng alert + console (không cần cài package)
//   useEffect(() => {
//     if (logs.length === 0) return;
//     const latest = logs[0];

//     const msg = latest.message || latest.type;
//     if (latest.type.includes('approaching')) {
//       alert(`Xắp đến trạm: ${latest.station?.name || 'Trạm tiếp theo'} (${latest.distance ? '~' + latest.distance + 'm' : ''})`);
//       console.log('APPROACHING', latest);
//     } else if (latest.type.includes('arrived')) {
//       alert(`ĐÃ ĐẾN TRẠM: ${latest.station?.name}`);
//       console.log('ARRIVED', latest);
//     } else if (latest.type.includes('departed')) {
//       alert(`ĐÃ RỜI TRẠM: ${latest.station?.name}`);
//       console.log('DEPARTED', latest);
//     }
//   }, [logs]);

//   const handleStart = () => {
//     startTracking();
//     alert('BẮT ĐẦU ĐÓN HỌC SINH – Theo dõi vị trí đã được kích hoạt!');
//   };

//   const handleStop = () => {
//     stopTracking();
//     alert('ĐÃ DỪNG THEO DÕI CHUYẾN ĐI');
//   };

//   return (
//     <div className="space-y-6 pb-8">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-bold flex items-center gap-4">
//               <Bus className="w-12 h-12" />
//               Lịch trình hôm nay
//             </h1>
//             <p className="mt-3 text-lg opacity-90">Tuyến 1 • Chuyến sáng • 28 học sinh</p>
//           </div>
//           <div className="text-right">
//             <div className="text-5xl font-bold">
//               {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
//             </div>
//             <div className="text-sm opacity-80">Thứ Sáu, 29/11/2025</div>
//           </div>
//         </div>
//       </div>

//       {/* Nút điều khiển */}
//       <div className="flex items-center gap-6 bg-white rounded-2xl shadow-lg p-6">
//         {!isTracking ? (
//           <button
//             onClick={handleStart}
//             className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg flex items-center gap-3 transform hover:scale-105 transition"
//           >
//             <Play className="w-6 h-6" />
//             Bắt đầu đón học sinh
//           </button>
//         ) : (
//           <button
//             onClick={handleStop}
//             className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 shadow-lg flex items-center gap-3 transform hover:scale-105 transition"
//           >
//             <Square className="w-6 h-6" />
//             Kết thúc chuyến đi
//           </button>
//         )}

//         <div className="flex items-center gap-3 text-lg">
//           <div className={`w-4 h-4 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
//           <span className="font-medium">{isTracking ? 'Đang theo dõi' : 'Đã dừng'}</span>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Bản đồ */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-indigo-100">
//             <RouteMap
//               center={currentPosition ? [currentPosition.lat, currentPosition.lng] : route[0]}
//               zoom={15}
//               route={route}
//               stops={routeStations.map(s => ({
//                 id: s.id,
//                 name: s.name,
//                 position: [s.lat, s.lng],
//                 time: s.time
//               }))}
//               currentPosition={currentPosition ? [currentPosition.lat, currentPosition.lng] : null}
//             />
//           </div>

//           {/* Thông báo trạm tiếp theo */}
//           {nextStation && isTracking && !isAtStation && (
//             <div className="mt-4 bg-orange-50 border-2 border-orange-400 rounded-xl p-5 text-orange-800 font-bold text-center text-lg">
//               Trạm tiếp theo: <span className="text-orange-600">{nextStation.name}</span>
//               <br />
//               <span className="text-sm">Dự kiến: {nextStation.time}</span>
//             </div>
//           )}
//         </div>

//         {/* Cột phải */}
//         <div className="space-y-6">
//           {/* Trạm hiện tại */}
//           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
//             <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
//               <MapPin className="w-8 h-8" />
//               Trạm hiện tại
//             </h3>
//             {currentStation ? (
//               <div className="space-y-4">
//                 <div className="text-3xl font-bold">{currentStation.name}</div>
//                 <div className="text-lg opacity-90">Dự kiến: {currentStation.time}</div>
//                 <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-xl font-bold ${isAtStation ? 'bg-green-500' : 'bg-orange-500'}`}>
//                   {isAtStation ? 'Đang dừng tại trạm' : 'Đang di chuyển'}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-xl opacity-80">Chưa bắt đầu chuyến đi</div>
//             )}
//           </div>

//           {/* Danh sách trạm */}
//           <div className="bg-white rounded-2xl shadow-xl p-6 border">
//             <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
//               <Clock className="w-6 h-6 text-indigo-600" />
//               Tiến độ lộ trình
//             </h3>
//             <div className="space-y-4">
//               {routeStations.map((st, idx) => {
//                 const isCurrent = idx === currentIndex;
//                 const isNext = idx === currentIndex + (isAtStation ? 0 : 1);
//                 const isPassed = idx < currentIndex;

//                 return (
//                   <div
//                     key={st.id}
//                     className={`p-5 rounded-xl border-2 transition-all ${
//                       isCurrent && isAtStation
//                         ? 'border-green-500 bg-green-50 shadow-md'
//                         : isNext
//                         ? 'border-orange-500 bg-orange-50 shadow-md'
//                         : isPassed
//                         ? 'border-gray-300 bg-gray-50 opacity-60'
//                         : 'border-gray-200 bg-gray-50'
//                     }`}
//                   >
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <div className="font-bold text-lg">{st.name}</div>
//                         <div className="text-sm text-gray-600">Dự kiến: {st.time}</div>
//                       </div>
//                       <div className="text-right font-medium">
//                         {isCurrent && isAtStation && <span className="text-green-600">Đang dừng</span>}
//                         {isNext && <span className="text-orange-600">Sắp đến</span>}
//                         {isPassed && <span className="text-gray-500">Đã qua</span>}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Log sự kiện */}
//           <div className="bg-white rounded-2xl shadow-xl p-6 border">
//             <h3 className="text-xl font-bold mb-4">Sự kiện gần đây</h3>
//             <div className="text-sm space-y-2 max-h-80 overflow-y-auto font-mono bg-gray-50 p-4 rounded-lg">
//               {logs.length === 0 ? (
//                 <p className="text-gray-400 text-center py-8">Chưa có sự kiện</p>
//               ) : (
//                 logs.slice(0, 10).map((log, i) => (
//                   <div key={i} className="py-2 border-b border-gray-200 last:border-0">
//                     <span className="text-gray-500 text-xs">
//                       {new Date(log.ts).toLocaleTimeString('vi-VN')}
//                     </span>
//                     <span className={`ml-3 font-medium ${
//                       log.type.includes('approaching') ? 'text-orange-600' :
//                       log.type.includes('arrived') ? 'text-green-600' :
//                       log.type.includes('departed') ? 'text-blue-600' :
//                       'text-gray-700'
//                     }`}>
//                       {log.message || log.type}
//                       {log.station && ` — ${log.station.name}`}
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/driver/DriverDailySchedule.jsx
import React, { useEffect } from 'react';
import { Play, Square, Bus, MapPin, Clock } from 'lucide-react';
import RouteMap from '../../components/maps/RouteMap';
import useDriverRouteLogic from '../../hooks/useDriverRouteLogic';

const routeStations = [
  { id: 'st1', name: 'Trạm A - Nguyễn Trãi', lat: 10.7628, lng: 106.6602, time: '06:35' },
  { id: 'st2', name: 'Trạm B - Lê Văn Sỹ', lat: 10.7640, lng: 106.6670, time: '06:42' },
  { id: 'st3', name: 'Trạm C - CMT8', lat: 10.7665, lng: 106.6820, time: '06:50' },
  { id: 'st4', name: 'THPT Lê Quý Đôn', lat: 10.7800, lng: 106.6950, time: '07:10' },
];

export default function DriverDailySchedule() {
  const {
    currentIndex,
    currentStation,
    nextStation,
    isAtStation,
    isTracking,
    currentPosition,
    logs,
    startTracking,
    stopTracking,
  } = useDriverRouteLogic(routeStations);

  const route = routeStations.map(s => [s.lat, s.lng]);

  // Thông báo bằng alert (không cần react-hot-toast)
  useEffect(() => {
    if (logs.length === 0) return;
    const latest = logs[0];

    if (latest.type.includes('approaching')) {
      alert(`Sắp đến trạm: ${latest.station?.name} (${latest.distance ? '~' + latest.distance + 'm' : ''})`);
    } else if (latest.type.includes('arrived')) {
      alert(`ĐÃ ĐẾN TRẠM: ${latest.station?.name}`);
    } else if (latest.type.includes('departed')) {
      alert(`ĐÃ RỜI TRẠM: ${latest.station?.name}`);
    }
  }, [logs]);

  const handleStart = () => {
    startTracking();
    alert('BẮT ĐẦU ĐÓN HỌC SINH – Theo dõi vị trí đã được kích hoạt!');
  };

  const handleStop = () => {
    stopTracking();
    alert('ĐÃ DỪNG THEO DÕI CHUYẾN ĐI');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-4">
              <Bus className="w-12 h-12" />
              Lịch trình hôm nay
            </h1>
            <p className="mt-3 text-lg opacity-90">Tuyến 1 • Chuyến sáng • 28 học sinh</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">
              {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm opacity-80">Thứ Sáu, 29/11/2025</div>
          </div>
        </div>
      </div>

      {/* Nút điều khiển */}
      <div className="flex items-center gap-6 bg-white rounded-2xl shadow-lg p-6">
        {!isTracking ? (
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg flex items-center gap-3 transform hover:scale-105 transition"
          >
            <Play className="w-6 h-6" />
            Bắt đầu đón học sinh
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 shadow-lg flex items-center gap-3 transform hover:scale-105 transition"
          >
            <Square className="w-6 h-6" />
            Kết thúc chuyến đi
          </button>
        )}

        <div className="flex items-center gap-3 text-lg">
          <div className={`w-4 h-4 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="font-medium">{isTracking ? 'Đang theo dõi' : 'Đã dừng'}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Bản đồ */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-indigo-100">
            <RouteMap
              center={currentPosition ? [currentPosition.lat, currentPosition.lng] : route[0]}
              zoom={15}
              route={route}
              stops={routeStations.map(s => ({
                id: s.id,
                name: s.name,
                position: [s.lat, s.lng],
                time: s.time
              }))}
              currentPosition={currentPosition ? [currentPosition.lat, currentPosition.lng] : null}
            />
          </div>

          {nextStation && isTracking && !isAtStation && (
            <div className="mt-4 bg-orange-50 border-2 border-orange-400 rounded-xl p-5 text-orange-800 font-bold text-center text-lg">
              Trạm tiếp theo: <span className="text-orange-600">{nextStation.name}</span>
              <br />
              <span className="text-sm">Dự kiến: {nextStation.time}</span>
            </div>
          )}
        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <MapPin className="w-8 h-8" />
              Trạm hiện tại
            </h3>
            {currentStation ? (
              <div className="space-y-4">
                <div className="text-3xl font-bold">{currentStation.name}</div>
                <div className="text-lg opacity-90">Dự kiến: {currentStation.time}</div>
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-xl font-bold ${isAtStation ? 'bg-green-500' : 'bg-orange-500'}`}>
                  {isAtStation ? 'Đang dừng tại trạm' : 'Đang di chuyển'}
                </div>
              </div>
            ) : (
              <div className="text-xl opacity-80">Chưa bắt đầu chuyến đi</div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border">
            <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
              <Clock className="w-6 h-6 text-indigo-600" />
              Tiến độ lộ trình
            </h3>
            <div className="space-y-4">
              {routeStations.map((st, idx) => {
                const isCurrent = idx === currentIndex;
                const isNext = idx === currentIndex + (isAtStation ? 0 : 1);
                const isPassed = idx < currentIndex;

                return (
                  <div
                    key={st.id}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      isCurrent && isAtStation
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : isNext
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : isPassed
                        ? 'border-gray-300 bg-gray-50 opacity-60'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg">{st.name}</div>
                        <div className="text-sm text-gray-600">Dự kiến: {st.time}</div>
                      </div>
                      <div className="text-right font-medium">
                        {isCurrent && isAtStation && <span className="text-green-600">Đang dừng</span>}
                        {isNext && <span className="text-orange-600">Sắp đến</span>}
                        {isPassed && <span className="text-gray-500">Đã qua</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border">
            <h3 className="text-xl font-bold mb-4">Sự kiện gần đây</h3>
            <div className="text-sm space-y-2 max-h-80 overflow-y-auto font-mono bg-gray-50 p-4 rounded-lg">
              {logs.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Chưa có sự kiện</p>
              ) : (
                logs.slice(0, 10).map((log, i) => (
                  <div key={i} className="py-2 border-b border-gray-200 last:border-0">
                    <span className="text-gray-500 text-xs">
                      {new Date(log.ts).toLocaleTimeString('vi-VN')}
                    </span>
                    <span className={`ml-3 font-medium ${
                      log.type.includes('approaching') ? 'text-orange-600' :
                      log.type.includes('arrived') ? 'text-green-600' :
                      log.type.includes('departed') ? 'text-blue-600' :
                      'text-gray-700'
                    }`}>
                      {log.message || log.type}
                      {log.station && ` — ${log.station.name}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}