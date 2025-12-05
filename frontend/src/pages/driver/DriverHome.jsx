// // src/pages/driver/DriverHome.jsx
// import React from 'react';
// import {
//     MapPin,
//     Users,
//     Bus,
//     PlayCircle,
//     PauseCircle,
//     Timer,
//     UserCheck,
//     CheckCircle,
//     XCircle,
//     Loader2,
//     History,
// } from 'lucide-react';

// import RouteMap from '../../components/maps/RouteMap';
// import { useRouteTracking } from '../../context/RouteTrackingContext';

// export default function DriverHome() {
//     const {
//         isTracking,
//         currentStationIndex,
//         currentStation,
//         stations = [],
//         currentStudents = [],
//         studentCheckIns = {},
//         checkInStudent = () => {},
//         stationTimer = 0,
//         isStationActive = false,
//         startTracking,
//         stopTracking,
//         lastStoppedState,
//         forceDepart, // Dùng để rời trạm thủ công
//     } = useRouteTracking();

//     // Tính toán trạng thái
//     const checkedCount = currentStudents.filter(s => studentCheckIns[s.id] === 'present').length;
//     const totalAtStation = currentStudents.length;
//     const allChecked = totalAtStation > 0 && checkedCount === totalAtStation;
//     const isWaitingToStartCheckIn = isStationActive && stationTimer === 0;
//     const isCheckingIn = isStationActive && stationTimer > 0;

//     // Tổng học sinh đã check-in (toàn chuyến)
//     const totalChecked = Object.values(studentCheckIns).filter(v => v === 'present').length;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//             {/* HEADER + NÚT BẮT ĐẦU NẰM KẾ LỘ TRÌNH */}
//             <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-2xl">
//                 <div className="max-w-7xl mx-auto px-5 py-6">
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
//                         <div className="text-center sm:text-left">
//                             <h1 className="text-2xl md:text-3xl font-bold">Chào buổi sáng, Tài xế!</h1>
//                             <p className="text-indigo-100 text-sm mt-1">
//                                 {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
//                             </p>
//                         </div>

//                         <div className="flex items-center gap-6">
//                             {/* LỘ TRÌNH HIỆN TẠI */}
//                             <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 text-center">
//                                 <div className="flex items-center gap-3 justify-center">
//                                     <MapPin className="w-7 h-7" />
//                                     <div>
//                                         <div className="font-bold text-lg">TRẠM HIỆN TẠI</div>
//                                         <div className="text-sm opacity-90">
//                                             {currentStation ? currentStation.name : 'Chưa xuất phát'}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* NÚT BẮT ĐẦU / DỪNG – ĐỒNG BỘ VỚI DriverOperations */}
//                             <button
//                                 onClick={isTracking ? stopTracking : startTracking}
//                                 className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all transform hover:scale-105 ${
//                                     isTracking
//                                         ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
//                                         : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
//                                 }`}
//                             >
//                                 {isTracking ? (
//                                     <>
//                                         <PauseCircle className="w-9 h-9" />
//                                         DỪNG CHUYẾN
//                                     </>
//                                 ) : (
//                                     <>
//                                         <PlayCircle className="w-9 h-9" />
//                                         BẮT ĐẦU CHUYẾN
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <div className="max-w-7xl mx-auto px-5 py-8">

//                 {/* LỊCH SỬ DỪNG GẦN NHẤT */}
//                 {lastStoppedState && !isTracking && (
//                     <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-5 mb-8 shadow-lg text-center">
//                         <div className="flex items-center justify-center gap-3 mb-2">
//                             <History className="w-7 h-7 text-amber-700" />
//                             <h3 className="text-lg font-bold text-amber-900">Lần dừng gần nhất</h3>
//                         </div>
//                         <p className="text-base font-semibold">
//                             {lastStoppedState.stationName} • {lastStoppedState.time}
//                         </p>
//                     </div>
//                 )}

//                 {/* BẢN ĐỒ - ĐỒNG BỘ VỚI DriverOperations */}
//                 <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-indigo-100 mb-8">
//                     <div className="h-96">
//                         <RouteMap
//                             center={stations[0]?.position || [10.77, 106.68]}
//                             stops={stations.map(s => ({
//                                 id: s.id,
//                                 name: s.name,
//                                 position: s.position,
//                                 time: s.time,
//                             }))}
//                             isTracking={isTracking}
//                             currentStationIndex={currentStationIndex}
//                             isStationActive={isStationActive}
//                             lastStoppedPosition={lastStoppedState?.position}
//                         />
//                     </div>
//                 </div>

//                 {/* CHECK-IN HỌC SINH - HOẠT ĐỘNG THẬT */}
//                 {isTracking && isStationActive && currentStationIndex < stations.length - 1 && (
//                     <div className="bg-gradient-to-br from-purple-700 via-pink-600 to-red-600 text-white rounded-3xl shadow-2xl p-6 border-4 border-white mb-8">
//                         <div className="text-center mb-6">
//                             <h3 className="text-2xl font-bold flex items-center justify-center gap-4">
//                                 <Bus className="w-10 h-10 animate-bounce" />
//                                 ĐANG DỪNG TẠI: {currentStation?.name}
//                             </h3>

//                             {isWaitingToStartCheckIn && (
//                                 <div className="mt-4 flex items-center justify-center gap-3 text-4xl font-bold text-yellow-300">
//                                     <Loader2 className="w-10 h-10 animate-spin" />
//                                     Chuẩn bị check-in...
//                                 </div>
//                             )}
//                             {isCheckingIn && (
//                                 <div className={`mt-4 text-5xl font-bold ${stationTimer <= 10 ? 'text-red-300 animate-pulse' : 'text-yellow-200'}`}>
//                                     {stationTimer}s
//                                 </div>
//                             )}
//                         </div>

//                         {isCheckingIn && (
//                             <div className="bg-white/20 backdrop-blur rounded-2xl p-6 border-3 border-white/40">
//                                 <h4 className="text-2xl font-bold text-center mb-6">
//                                     CHECK-IN HỌC SINH ({checkedCount}/{totalAtStation})
//                                 </h4>

//                                 {totalAtStation === 0 ? (
//                                     <div className="text-center py-10 text-xl opacity-80">
//                                         Trạm trường – Không cần check-in
//                                     </div>
//                                 ) : (
//                                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                                         {currentStudents.map(student => {
//                                             const status = studentCheckIns[student.id];
//                                             return (
//                                                 <div
//                                                     key={student.id}
//                                                     className={`p-5 rounded-xl text-center border-3 transition-all ${
//                                                         status === 'present'
//                                                             ? 'bg-green-500 text-white border-green-600'
//                                                             : status === 'absent'
//                                                             ? 'bg-red-500 text-white line-through border-red-600'
//                                                             : 'bg-white/30 border-white hover:bg-white/50'
//                                                     }`}
//                                                 >
//                                                     <div className="font-bold text-base">{student.name}</div>
//                                                     {!status && (
//                                                         <button
//                                                             onClick={() => checkInStudent(student.id)}
//                                                             className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:scale-110 transition"
//                                                         >
//                                                             CÓ MẶT
//                                                         </button>
//                                                     )}
//                                                     {status === 'present' && <CheckCircle className="w-8 h-8 mx-auto mt-2" />}
//                                                     {status === 'absent' && <XCircle className="w-8 h-8 mx-auto mt-2" />}
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}

//                                 {/* NÚT RỜI TRẠM THỦ CÔNG */}
//                                 {forceDepart && (
//                                     <div className="text-center mt-6">
//                                         <button
//                                             onClick={forceDepart}
//                                             className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xl hover:scale-110 transition"
//                                         >
//                                             RỜI TRẠM NGAY (Bỏ qua chờ)
//                                         </button>
//                                     </div>
//                                 )}

//                                 <div className="text-center mt-6 text-lg">
//                                     {allChecked && totalAtStation > 0 && (
//                                         <div className="text-2xl font-bold text-yellow-200 animate-bounce">
//                                             ĐÃ CHECK ĐỦ – XE SẼ CHẠY SAU 3S!
//                                         </div>
//                                     )}
//                                     {stationTimer <= 10 && !allChecked && totalAtStation > 0 && (
//                                         <div className="text-2xl font-bold text-red-300 animate-pulse">
//                                             HẾT GIỜ! CHƯA CHECK SẼ BỊ VẮNG
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* THỐNG KÊ NHỎ GỌN */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center mb-8">
//                     <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-indigo-200">
//                         <Users className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
//                         <div className="text-2xl font-bold">28</div>
//                         <div className="text-sm text-gray-600">Tổng học sinh</div>
//                     </div>
//                     <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-green-300">
//                         <UserCheck className="w-10 h-10 text-green-600 mx-auto mb-2" />
//                         <div className="text-2xl font-bold text-green-600">{totalChecked}</div>
//                         <div className="text-sm text-gray-600">Đã check-in</div>
//                     </div>
//                     <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-purple-200">
//                         <Timer className="w-10 h-10 text-purple-600 mx-auto mb-2" />
//                         <div className="text-2xl font-bold">
//                             {isCheckingIn ? stationTimer : '--'}
//                         </div>
//                         <div className="text-sm text-gray-600">Giây còn lại</div>
//                     </div>
//                     <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-gray-200">
//                         <Bus className="w-10 h-10 text-gray-600 mx-auto mb-2" />
//                         <div className="text-2xl font-bold">{stations.length}</div>
//                         <div className="text-sm text-gray-600">Tổng trạm</div>
//                     </div>
//                 </div>

//                 {/* DANH SÁCH TRẠM NHỎ */}
//                 <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-gray-200">
//                     <h3 className="text-xl font-bold text-center mb-5">Các điểm dừng hôm nay</h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                         {stations.map((s, i) => (
//                             <div
//                                 key={s.id}
//                                 className={`p-4 rounded-xl text-center font-medium transition-all ${
//                                     i < currentStationIndex
//                                         ? 'bg-green-100 text-green-800'
//                                         : i === currentStationIndex
//                                         ? 'bg-purple-100 text-purple-800 shadow-lg scale-105'
//                                         : 'bg-gray-100'
//                                 }`}
//                             >
//                                 <div className="font-bold text-lg">{i + 1}</div>
//                                 <div className="text-xs mt-1">{s.name}</div>
//                                 <div className="text-xs opacity-70">{s.time}</div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
// src/pages/driver/DriverHome.jsx
import React from 'react';
import {
    MapPin,
    Users,
    Bus,
    PlayCircle,
    PauseCircle,
    Timer,
    UserCheck,
    CheckCircle,
    XCircle,
    Loader2,
    History,
} from 'lucide-react';

import RouteMap from '../../components/maps/RouteMap';
import { useRouteTracking } from '../../context/RouteTrackingContext';

export default function DriverHome() {
    const {
        isTracking,
        currentStationIndex,
        currentStation,
        stations = [],
        currentStudents = [],
        studentCheckIns = {},
        checkInStudent = () => {},
        stationTimer = 0,
        isStationActive = false,
        startTracking,
        stopTracking,
        lastStoppedState,
        forceDepart, // Dùng để rời trạm thủ công
    } = useRouteTracking();

    // Tính toán trạng thái
    const checkedCount = currentStudents.filter(s => studentCheckIns[s.id] === 'present').length;
    const totalAtStation = currentStudents.length;
    const allChecked = totalAtStation > 0 && checkedCount === totalAtStation;
    const isWaitingToStartCheckIn = isStationActive && stationTimer === 0;
    const isCheckingIn = isStationActive && stationTimer > 0;

    // Tổng học sinh đã check-in (toàn chuyến)
    const totalChecked = Object.values(studentCheckIns).filter(v => v === 'present').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* HEADER + NÚT BẮT ĐẦU NẰM KẾ LỘ TRÌNH */}
            <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-2xl">
                <div className="max-w-7xl mx-auto px-5 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold">Chào buổi sáng, Tài xế!</h1>
                            <p className="text-indigo-100 text-sm mt-1">
                                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* LỘ TRÌNH HIỆN TẠI */}
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 text-center">
                                <div className="flex items-center gap-3 justify-center">
                                    <MapPin className="w-7 h-7" />
                                    <div>
                                        <div className="font-bold text-lg">TRẠM HIỆN TẠI</div>
                                        <div className="text-sm opacity-90">
                                            {currentStation ? currentStation.name : 'Chưa xuất phát'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* NÚT BẮT ĐẦU / DỪNG – ĐỒNG BỘ VỚI DriverOperations */}
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
                                        DỪNG CHUYẾN
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle className="w-9 h-9" />
                                        BẮT ĐẦU CHUYẾN
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-5 py-8">

                {/* LỊCH SỬ DỪNG GẦN NHẤT */}
                {lastStoppedState && !isTracking && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-5 mb-8 shadow-lg text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <History className="w-7 h-7 text-amber-700" />
                            <h3 className="text-lg font-bold text-amber-900">Lần dừng gần nhất</h3>
                        </div>
                        <p className="text-base font-semibold">
                            {lastStoppedState.stationName} • {lastStoppedState.time}
                        </p>
                    </div>
                )}

                {/* BẢN ĐỒ - ĐỒNG BỘ VỚI DriverOperations */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-indigo-100 mb-8">
                    <div className="h-96">
                        <RouteMap
                            center={stations[0]?.position || [10.77, 106.68]}
                            stops={stations.map(s => ({
                                id: s.id,
                                name: s.name,
                                position: s.position,
                                time: s.time,
                            }))}
                            isTracking={isTracking}
                            currentStationIndex={currentStationIndex}
                            isStationActive={isStationActive}
                            lastStoppedPosition={lastStoppedState?.position}
                        />
                    </div>
                </div>

                {/* CHECK-IN HỌC SINH - HOẠT ĐỘNG THẬT */}
                {isTracking && isStationActive && currentStationIndex < stations.length - 1 && (
                    <div className="bg-gradient-to-br from-purple-700 via-pink-600 to-red-600 text-white rounded-3xl shadow-2xl p-6 border-4 border-white mb-8">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold flex items-center justify-center gap-4">
                                <Bus className="w-10 h-10 animate-bounce" />
                                ĐANG DỪNG TẠI: {currentStation?.name}
                            </h3>

                            {isWaitingToStartCheckIn && (
                                <div className="mt-4 flex items-center justify-center gap-3 text-4xl font-bold text-yellow-300">
                                    <Loader2 className="w-10 h-10 animate-spin" />
                                    Chuẩn bị check-in...
                                </div>
                            )}
                            {isCheckingIn && (
                                <div className={`mt-4 text-5xl font-bold ${stationTimer <= 10 ? 'text-red-300 animate-pulse' : 'text-yellow-200'}`}>
                                    {stationTimer}s
                                </div>
                            )}
                        </div>

                        {isCheckingIn && (
                            <div className="bg-white/20 backdrop-blur rounded-2xl p-6 border-3 border-white/40">
                                <h4 className="text-2xl font-bold text-center mb-6">
                                    CHECK-IN HỌC SINH ({checkedCount}/{totalAtStation})
                                </h4>

                                {totalAtStation === 0 ? (
                                    <div className="text-center py-10 text-xl opacity-80">
                                        Trạm trường – Không cần check-in
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {currentStudents.map(student => {
                                            const status = studentCheckIns[student.id];
                                            return (
                                                <div
                                                    key={student.id}
                                                    className={`p-5 rounded-xl text-center border-3 transition-all ${
                                                        status === 'present'
                                                            ? 'bg-green-500 text-white border-green-600'
                                                            : status === 'absent'
                                                            ? 'bg-red-500 text-white line-through border-red-600'
                                                            : 'bg-white/30 border-white hover:bg-white/50'
                                                    }`}
                                                >
                                                    <div className="font-bold text-base">{student.name}</div>
                                                    {!status && (
                                                        <button
                                                            onClick={() => checkInStudent(student.id)}
                                                            className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:scale-110 transition"
                                                        >
                                                            CÓ MẶT
                                                        </button>
                                                    )}
                                                    {status === 'present' && <CheckCircle className="w-8 h-8 mx-auto mt-2" />}
                                                    {status === 'absent' && <XCircle className="w-8 h-8 mx-auto mt-2" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* NÚT RỜI TRẠM THỦ CÔNG */}
                                {forceDepart && (
                                    <div className="text-center mt-6">
                                        <button
                                            onClick={forceDepart}
                                            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xl hover:scale-110 transition"
                                        >
                                            RỜI TRẠM NGAY (Bỏ qua chờ)
                                        </button>
                                    </div>
                                )}

                                <div className="text-center mt-6 text-lg">
                                    {allChecked && totalAtStation > 0 && (
                                        <div className="text-2xl font-bold text-yellow-200 animate-bounce">
                                            ĐÃ CHECK ĐỦ – XE SẼ CHẠY SAU 3S!
                                        </div>
                                    )}
                                    {stationTimer <= 10 && !allChecked && totalAtStation > 0 && (
                                        <div className="text-2xl font-bold text-red-300 animate-pulse">
                                            HẾT GIỜ! CHƯA CHECK SẼ BỊ VẮNG
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* THỐNG KÊ NHỎ GỌN */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-indigo-200">
                        <Users className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">28</div>
                        <div className="text-sm text-gray-600">Tổng học sinh</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-green-300">
                        <UserCheck className="w-10 h-10 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">{totalChecked}</div>
                        <div className="text-sm text-gray-600">Đã check-in</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-purple-200">
                        <Timer className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                            {isCheckingIn ? stationTimer : '--'}
                        </div>
                        <div className="text-sm text-gray-600">Giây còn lại</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-gray-200">
                        <Bus className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{stations.length}</div>
                        <div className="text-sm text-gray-600">Tổng trạm</div>
                    </div>
                </div>

                {/* DANH SÁCH TRẠM NHỎ */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-gray-200">
                    <h3 className="text-xl font-bold text-center mb-5">Các điểm dừng hôm nay</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stations.map((s, i) => (
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