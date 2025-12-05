// // src/pages/driver/DriverOperations.jsx
// import React, { useState } from 'react';
// import { 
//   PlayCircle, PauseCircle, AlertTriangle, Phone, UserCheck, MessageCircle,
//   Siren, Bus, CheckCircle, CloudRain, MapPin, Clock, Users, X
// } from 'lucide-react';
// import { useRouteTracking } from '../../context/RouteTrackingContext';
// import { useAuth } from '../../hooks/useAuth';

// const quickMessages = [
//   "Xe đang đến trạm đón",
//   "Xe bị trễ 10 phút do kẹt xe",
//   "Học sinh đã lên xe an toàn",
//   "Xe đã đến trường",
//   "Có mưa lớn, xe đi chậm",
// ];

// const incidentTypes = [
//   { id: 'traffic',    label: 'Kẹt xe',          icon: AlertTriangle },
//   { id: 'breakdown',  label: 'Hỏng xe',         icon: Siren },
//   { id: 'accident',   label: 'Tai nạn',         icon: AlertTriangle },
//   { id: 'weather',    label: 'Thời tiết xấu',   icon: CloudRain },
//   { id: 'other',      label: 'Khác',            icon: MessageCircle },
// ];

// const initialStudents = [
//   { id: 's1', name: 'Nguyễn Thị An', class: '6A1', stopName: 'Trạm A - Nguyễn Trãi', status: 'waiting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An' },
//   { id: 's2', name: 'Trần Văn Bình', class: '7B2', stopName: 'Trạm B - Lê Văn Sỹ', status: 'waiting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh' },
//   { id: 's3', name: 'Lê Minh Cường', class: '8A3', stopName: 'Trạm C - Cách Mạng Tháng 8', status: 'waiting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong' },
//   { id: 's4', name: 'Phạm Hồng Đào', class: '6A2', stopName: 'Trạm A - Nguyễn Trãi', status: 'waiting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dao' },
// ];

// export default function DriverOperations() {
//   const { user } = useAuth();
//   const {
//     isTracking,
//     startTracking,
//     stopTracking,
//     currentStation,
//     currentRoute,           // <- để gửi quick messages đến phụ huynh trong tuyến
//     allStudentsForContact,  // <- danh sách toàn bộ học sinh (để map parent)
//   } = useRouteTracking();
  
//   const [showIncidentModal, setShowIncidentModal] = useState(false);
//   const [selectedIncident, setSelectedIncident] = useState('');
//   const [incidentNote, setIncidentNote] = useState('');
//   const [students, setStudents] = useState(initialStudents);
//   const [currentStop] = useState('Trạm A - Nguyễn Trãi');
//   const [showCheckinModal, setShowCheckinModal] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   // --- helper để ghi message vào storage + broadcast event ---
//   const pushChatMessage = (threadId, msgObj) => {
//     try {
//       const KEY = 'chat_messages';
//       const raw = localStorage.getItem(KEY);
//       let store = raw ? JSON.parse(raw) : {};
//       if (!store[threadId]) store[threadId] = [];
//       store[threadId].push(msgObj);
//       localStorage.setItem(KEY, JSON.stringify(store));
//       // broadcast to any listener in the app
//       window.dispatchEvent(new CustomEvent('chat_message', { detail: { threadId, message: msgObj } }));
//     } catch (e) {
//       console.error('pushChatMessage error', e);
//     }
//   };

//   const nowTime = () => new Date().toTimeString().slice(0,5);

//   const handleStartTrip = () => {
//     startTracking();
//   };

//   const handleEndTrip = () => {
//     if (confirm('Kết thúc chuyến đi?')) {
//       stopTracking();
//     }
//   };

//   const handleCheckIn = (id) => {
//     const student = students.find(s => s.id === id);
//     if (student) {
//       setSelectedStudent(student);
//       setShowCheckinModal(true);
//     }
//   };

//   const confirmCheckIn = () => {
//     if (!selectedStudent) return;
//     setStudents(prev => prev.map(s => 
//       s.id === selectedStudent.id ? { ...s, status: 'onboard' } : s
//     ));
//     setShowCheckinModal(false);
//     // gửi message nội bộ tới admin rằng đã đón (cũng ghi vào admin thread)
//     const text = `Đã đón ${selectedStudent.name} (${selectedStudent.class}) tại ${currentStop}`;
//     const m = { id: Date.now(), sender: 'driver', text, time: nowTime() };
//     pushChatMessage('admin', m);

//     setSelectedStudent(null);
//     alert(`Đã đón ${selectedStudent.name}`);
//   };

//   const markAbsent = (id) => {
//     const st = students.find(s => s.id === id);
//     setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'absent' } : s));
//     // push to admin
//     const text = `Đã đánh dấu vắng: ${st?.name || id} tại ${currentStop}`;
//     pushChatMessage('admin', { id: Date.now(), sender: 'driver', text, time: nowTime() });

//     alert('Đã đánh dấu vắng mặt');
//   };

//   const handleSendIncident = () => {
//     if (!selectedIncident) return;
//     const typeLabel = incidentTypes.find(t => t.id === selectedIncident)?.label;
//     const text = `BÁO CÁO: ${typeLabel} — ${incidentNote || 'Không có ghi chú'} (Trạm: ${currentStation?.name || currentStop})`;
//     const msg = { id: Date.now(), sender: 'driver', text, time: nowTime() };

//     // push into admin thread + broadcast
//     pushChatMessage('admin', msg);

//     alert(`ĐÃ BÁO CÁO: ${typeLabel}\nGhi chú: ${incidentNote || 'Không có'}`);
//     setShowIncidentModal(false);
//     setSelectedIncident('');
//     setIncidentNote('');
//   };

//   const handleQuickMessage = (msg) => {
//     // Tìm tất cả học sinh trong tuyến hiện tại (nếu có), gửi message cho từng phụ huynh (thread parent-{studentId})
//     if (!currentRoute) {
//       alert('Không có tuyến hiện tại để gửi tin nhắn nhanh.');
//       return;
//     }

//     // Lấy danh sách station ids của tuyến hiện tại
//     const stationIds = (currentRoute.stations || []).map(s => s.id);

//     // Tìm các học sinh trong allStudentsForContact có stop thuộc stationIds
//     const parents = (allStudentsForContact || []).filter(s => stationIds.includes(s.stop));

//     // Nếu không tìm thấy, fallback: gửi cho tất cả parents
//     const targets = parents.length > 0 ? parents : (allStudentsForContact || []);

//     const now = nowTime();
//     targets.forEach(parent => {
//       const threadId = `parent-${parent.id}`;
//       const text = `[Tin nhanh từ tài xế] ${msg}`;
//       const messageObj = { id: Date.now() + Math.floor(Math.random()*1000), sender: 'driver', text, time: now };
//       pushChatMessage(threadId, messageObj);
//     });

//     // cũng ghi 1 record vào admin thread để quản lý biết tin nhắn đã gửi (log)
//     pushChatMessage('admin', { id: Date.now()+1, sender: 'driver', text: `Đã gửi tin nhanh: "${msg}" tới ${targets.length} PH`, time: now });

//     alert(`ĐÃ GỬI: "${msg}"\n→ ${targets.length} phụ huynh trong tuyến`);
//   };

//   const handleEmergencyCall = () => {
//     if (confirm('Gọi khẩn cấp đến quản lý và 113?')) {
//       alert('Đang kết nối khẩn cấp...');
//       // log to admin thread
//       pushChatMessage('admin', { id: Date.now(), sender: 'driver', text: 'Cuộc gọi khẩn cấp được thực hiện bởi tài xế', time: nowTime() });
//     }
//   };

//   const stats = {
//     waiting: students.filter(s => s.stopName === currentStop && s.status === 'waiting').length,
//     onboard: students.filter(s => s.status === 'onboard').length,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Header + Start/Stop Button */}
//         <header className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center gap-3">
//                 <Bus className="w-10 h-10" /> Thao tác nhanh
//               </h1>
//               <p className="text-lg opacity-90 mt-1">Tài xế: {user?.name || 'Tài xế'}</p>
//               <p className="text-base opacity-75 mt-2 flex items-center gap-2">
//                 <MapPin className="w-5 h-5" /> Trạm hiện tại: {currentStation?.name || currentStop}
//               </p>
//             </div>
//             <button
//               onClick={isTracking ? handleEndTrip : handleStartTrip}
//               className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 whitespace-nowrap ${
//                 isTracking
//                   ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
//                   : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
//               }`}
//             >
//               {isTracking ? (
//                 <>
//                   <PauseCircle className="w-7 h-7" />
//                   DỪNG CHUYẾN
//                 </>
//               ) : (
//                 <>
//                   <PlayCircle className="w-7 h-7" />
//                   BẮT ĐẦU CHUYẾN
//                 </>
//               )}
//             </button>
//           </div>
//         </header>

//         {/* Trạng thái chuyến & Khẩn cấp */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div className={`rounded-2xl p-8 text-center shadow-xl border-4 transition-all ${isTracking ? 'bg-green-50 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
//             <div className="text-6xl mb-4">{isTracking ? <PlayCircle className="text-green-600 mx-auto" /> : <PauseCircle className="text-gray-500 mx-auto" />}</div>
//             <h2 className="text-3xl font-bold mb-6">{isTracking ? 'ĐANG CHẠY' : 'ĐÃ DỪNG'}</h2>
//             {isTracking && (
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-white rounded-xl p-4 shadow">
//                   <div className="text-3xl font-bold text-green-600">{stats.onboard}</div>
//                   <div className="text-sm text-gray-600">Đã đón</div>
//                 </div>
//                 <div className="bg-white rounded-xl p-4 shadow">
//                   <div className="text-3xl font-bold text-blue-600">{stats.waiting}</div>
//                   <div className="text-sm text-gray-600">Chờ đón</div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="rounded-2xl p-8 text-center bg-red-50 border-4 border-red-500 shadow-xl">
//             <Siren className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
//             <h2 className="text-2xl font-bold text-red-700 mb-4">KHẨN CẤP</h2>
//             <p className="text-red-600 mb-6">Trên xe: {stats.onboard} học sinh</p>
//             <button onClick={handleEmergencyCall} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition flex items-center justify-center gap-3">
//               <Phone className="w-7 h-7" /> GỌI CỨU HỘ
//             </button>
//           </div>
//         </div>

//         {/* Check-in học sinh */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="text-2xl font-bold flex items-center gap-3 text-blue-700">
//               <UserCheck className="w-8 h-8" /> Check-in học sinh
//             </h2>
//             <span className="text-lg font-medium text-gray-600">Còn {stats.waiting} em</span>
//           </div>

//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {students
//               .filter(s => s.stopName === currentStop && s.status === 'waiting')
//               .map((student) => (
//                 <div key={student.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition">
//                   <div className="flex items-center gap-4">
//                     <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full ring-2 ring-blue-300" />
//                     <div>
//                       <div className="font-semibold">{student.name}</div>
//                       <div className="text-sm text-gray-600">{student.class}</div>
//                     </div>
//                   </div>
//                   <div className="flex gap-3">
//                     <button onClick={() => handleCheckIn(student.id)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow hover:scale-105 transition flex items-center gap-1">
//                       <CheckCircle className="w-4 h-4" /> Đón
//                     </button>
//                     <button onClick={() => markAbsent(student.id)} className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium rounded-lg shadow hover:scale-105 transition">
//                       Vắng
//                     </button>
//                   </div>
//                 </div>
//               ))}
//           </div>

//           {stats.waiting === 0 && (
//             <div className="text-center py-10 text-gray-500">
//               <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
//               <p className="font-medium">Đã hoàn thành check-in tại {currentStop}</p>
//             </div>
//           )}
//         </div>

//         {/* Báo cáo & Tin nhắn nhanh */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-200">
//             <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-orange-600">
//               <AlertTriangle className="w-7 h-7" /> Báo cáo sự cố
//             </h2>
//             <button onClick={() => setShowIncidentModal(true)} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition">
//               Báo cáo ngay
//             </button>
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-200">
//             <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-indigo-600">
//               <MessageCircle className="w-7 h-7" /> Tin nhắn nhanh
//             </h2>
//             <div className="space-y-3">
//               {quickMessages.slice(0, 3).map((msg, i) => (
//                 <button key={i} onClick={() => handleQuickMessage(msg)} className="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 text-sm font-medium transition">
//                   {msg}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Modal báo cáo sự cố */}
//         {showIncidentModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-bold text-red-600">Báo cáo sự cố</h3>
//                 <button onClick={() => setShowIncidentModal(false)} className="text-gray-500 hover:text-gray-700">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 {incidentTypes.map((type) => {
//                   const Icon = type.icon;
//                   return (
//                     <label key={type.id} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
//                       <input type="radio" name="incident" value={type.id} checked={selectedIncident === type.id} onChange={(e) => setSelectedIncident(e.target.value)} className="w-5 h-5 text-red-600" />
//                       <Icon className="w-6 h-6 text-red-600" />
//                       <span className="font-medium">{type.label}</span>
//                     </label>
//                   );
//                 })}
//                 <textarea placeholder="Ghi chú (tùy chọn)" value={incidentNote} onChange={(e) => setIncidentNote(e.target.value)} className="w-full p-3 border rounded-lg resize-none" rows="2" />
//                 <div className="flex gap-3">
//                   <button onClick={handleSendIncident} disabled={!selectedIncident} className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition">
//                     Gửi
//                   </button>
//                   <button onClick={() => setShowIncidentModal(false)} className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition">
//                     Hủy
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal check-in */}
//         {showCheckinModal && selectedStudent && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
//               <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-24 h-24 rounded-full mx-auto ring-4 ring-blue-300 mb-4" />
//               <h3 className="text-2xl font-bold mb-2">{selectedStudent.name}</h3>
//               <p className="text-gray-600 mb-6">{selectedStudent.class}</p>
//               <div className="space-y-3 mb-8">
//                 <div className="flex items-center justify-center gap-2 text-green-600">
//                   <MapPin className="w-5 h-5" /> {currentStop}
//                 </div>
//                 <div className="flex items-center justify-center gap-2 text-blue-600">
//                   <Clock className="w-5 h-5" /> {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
//                 </div>
//               </div>
//               <div className="flex gap-4">
//                 <button onClick={confirmCheckIn} className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition">
//                   XÁC NHẬN ĐÓN
//                 </button>
//                 <button onClick={() => { markAbsent(selectedStudent.id); setShowCheckinModal(false); setSelectedStudent(null); }} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition">
//                   VẮNG
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/driver/DriverOperations.jsx
import React, { useState } from 'react';
import { 
  AlertTriangle, Phone, MessageCircle,
  Siren, MapPin, Clock, Users, X, Bus
} from 'lucide-react';
import { useRouteTracking } from '../../context/RouteTrackingContext';
import { useAuth } from '../../hooks/useAuth';

const quickMessages = [
  "Xe đang đến trạm đón",
  "Xe bị trễ 10 phút do kẹt xe",
  "Học sinh đã lên xe an toàn",
  "Xe đã đến trường",
  "Có mưa lớn, xe đi chậm",
];

const incidentTypes = [
  { id: 'traffic',    label: 'Kẹt xe',          icon: AlertTriangle },
  { id: 'breakdown',  label: 'Hỏng xe',         icon: Siren },
  { id: 'accident',   label: 'Tai nạn',         icon: AlertTriangle },
  { id: 'weather',    label: 'Thời tiết xấu',   icon: MapPin },
  { id: 'other',      label: 'Khác',            icon: MessageCircle },
];

export default function DriverOperations() {
  const { user } = useAuth();
  const {
    currentStation,
    currentRoute,
    routesToday,
    allStudentsForContact = [],
    studentCheckIns = {},
  } = useRouteTracking();

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState('');
  const [incidentNote, setIncidentNote] = useState('');

  // --- helper để ghi message vào storage + broadcast event ---
  const pushChatMessage = (threadId, msgObj) => {
    try {
      const KEY = 'chat_messages';
      const raw = localStorage.getItem(KEY);
      let store = raw ? JSON.parse(raw) : {};
      if (!store[threadId]) store[threadId] = [];
      // avoid duplicate ids (very naive)
      if (!store[threadId].some(m => m.id === msgObj.id)) {
        store[threadId].push(msgObj);
        localStorage.setItem(KEY, JSON.stringify(store));
      }
      window.dispatchEvent(new CustomEvent('chat_message', { detail: { threadId, message: msgObj } }));
    } catch (e) {
      console.error('pushChatMessage error', e);
    }
  };

  const nowTime = () => new Date().toTimeString().slice(0,5);

  // Báo sự cố → gửi vào luồng admin
  const handleSendIncident = () => {
    if (!selectedIncident) return;
    const typeLabel = incidentTypes.find(t => t.id === selectedIncident)?.label;
    const text = `BÁO CÁO: ${typeLabel} — ${incidentNote || 'Không có ghi chú'} (Trạm: ${currentStation?.name || 'N/A'})`;
    const msg = { id: Date.now(), sender: 'driver', text, time: nowTime() };

    pushChatMessage('admin', msg);

    alert(`ĐÃ BÁO CÁO: ${typeLabel}\nGhi chú: ${incidentNote || 'Không có'}`);
    setShowIncidentModal(false);
    setSelectedIncident('');
    setIncidentNote('');
  };

  // Tin nhắn nhanh → gửi riêng cho từng phụ huynh của tuyến hiện tại
  const handleQuickMessage = (msg) => {
    if (!currentRoute) {
      alert('Không có tuyến hiện tại để gửi tin nhắn nhanh.');
      return;
    }

    const stationIds = (currentRoute.stations || []).map(s => s.id);
    const parents = (allStudentsForContact || []).filter(s => stationIds.includes(s.stop));
    const targets = parents.length > 0 ? parents : (allStudentsForContact || []);

    const now = nowTime();
    targets.forEach(parent => {
      const threadId = `parent-${parent.id}`;
      const text = `[Tin nhanh từ tài xế] ${msg}`;
      const messageObj = { id: Date.now() + Math.floor(Math.random()*1000), sender: 'driver', text, time: now };
      pushChatMessage(threadId, messageObj);
    });

    pushChatMessage('admin', { id: Date.now()+1, sender: 'driver', text: `Đã gửi tin nhanh: "${msg}" tới ${targets.length} PH`, time: now });

    alert(`ĐÃ GỬI: "${msg}"\n→ ${targets.length} phụ huynh trong tuyến`);
  };

  // Gọi khẩn cấp -> log vào admin
  const handleEmergencyCall = () => {
    if (confirm('Gọi khẩn cấp đến quản lý và 113?')) {
      alert('Đang kết nối khẩn cấp...');
      pushChatMessage('admin', { id: Date.now(), sender: 'driver', text: 'Cuộc gọi khẩn cấp được thực hiện bởi tài xế', time: nowTime() });
    }
  };

  // ---------------- New: thống kê học sinh theo từng tuyến ----------------
  const statsByRoute = (routesToday || []).map(route => {
    const stationIds = (route.stations || []).map(s => s.id);
    const students = (allStudentsForContact || []).filter(s => stationIds.includes(s.stop));
    const total = students.length;
    const onboard = students.filter(s => studentCheckIns[s.id] === 'present').length;
    const absent = students.filter(s => studentCheckIns[s.id] === 'absent').length;
    const waiting = total - onboard - absent;
    return {
      id: route.id,
      name: route.name,
      time: route.time,
      total,
      onboard,
      absent,
      waiting,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header (compact) */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Bus className="w-8 h-8" /> Thao tác nhanh
              </h1>
              <p className="text-base opacity-90 mt-1">Tài xế: {user?.name || 'Tài xế'}</p>
              <p className="text-sm opacity-80 mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Trạm hiện tại: {currentStation?.name || '—'}
              </p>
            </div>

            <div className="text-right text-sm opacity-90">
              <div className="font-semibold">Lịch tuyến hôm nay</div>
              <div className="mt-2">
                {currentRoute ? (
                  <div>{currentRoute.name} • {currentRoute.time}</div>
                ) : (
                  <div>Chưa chọn tuyến</div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Bảng thống kê học sinh theo tuyến */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Thống kê học sinh theo tuyến</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Tuyến</th>
                  <th className="px-4 py-2 text-left">Thời gian</th>
                  <th className="px-4 py-2 text-center">Tổng HS</th>
                  <th className="px-4 py-2 text-center">Đã lên</th>
                  <th className="px-4 py-2 text-center">Vắng</th>
                  <th className="px-4 py-2 text-center">Chờ</th>
                </tr>
              </thead>
              <tbody>
                {statsByRoute.map(r => (
                  <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3">{r.time}</td>
                    <td className="px-4 py-3 text-center font-medium">{r.total}</td>
                    <td className="px-4 py-3 text-center text-green-700 font-semibold">{r.onboard}</td>
                    <td className="px-4 py-3 text-center text-red-600 font-semibold">{r.absent}</td>
                    <td className="px-4 py-3 text-center text-yellow-700 font-semibold">{r.waiting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Báo cáo & Tin nhắn nhanh */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-orange-600">
              <AlertTriangle className="w-6 h-6" /> Báo cáo sự cố
            </h2>
            <button onClick={() => setShowIncidentModal(true)} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition">
              Báo cáo ngay
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-indigo-600">
              <MessageCircle className="w-6 h-6" /> Tin nhắn nhanh
            </h2>
            <div className="space-y-3">
              {quickMessages.slice(0, 3).map((msg, i) => (
                <button key={i} onClick={() => handleQuickMessage(msg)} className="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 text-sm font-medium transition">
                  {msg}
                </button>
              ))}
              <button onClick={() => handleQuickMessage(quickMessages[3])} className="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 text-sm font-medium transition">
                {quickMessages[3]}
              </button>
            </div>
          </div>
        </div>

        {/* Gọi khẩn cấp */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-200">
          <div className="flex items-center gap-4">
            <Siren className="w-10 h-10 text-red-600" />
            <div>
              <h3 className="text-lg font-bold text-red-700">Khẩn cấp</h3>
              <p className="text-sm text-gray-600">Gọi ngay khi có tình huống cần hỗ trợ.</p>
            </div>
            <div className="ml-auto">
              <button onClick={handleEmergencyCall} className="px-5 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">
                <Phone className="w-4 h-4 inline-block mr-2" /> GỌI CỨU HỘ
              </button>
            </div>
          </div>
        </div>

        {/* Modal báo cáo sự cố */}
        {showIncidentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">Báo cáo sự cố</h3>
                <button onClick={() => setShowIncidentModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                {incidentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <label key={type.id} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                      <input type="radio" name="incident" value={type.id} checked={selectedIncident === type.id} onChange={(e) => setSelectedIncident(e.target.value)} className="w-5 h-5 text-red-600" />
                      <Icon className="w-6 h-6 text-red-600" />
                      <span className="font-medium">{type.label}</span>
                    </label>
                  );
                })}
                <textarea placeholder="Ghi chú (tùy chọn)" value={incidentNote} onChange={(e) => setIncidentNote(e.target.value)} className="w-full p-3 border rounded-lg resize-none" rows="2" />
                <div className="flex gap-3">
                  <button onClick={handleSendIncident} disabled={!selectedIncident} className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition">
                    Gửi
                  </button>
                  <button onClick={() => setShowIncidentModal(false)} className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
