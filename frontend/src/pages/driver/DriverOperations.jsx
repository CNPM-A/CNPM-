// // src/pages/driver/DriverOperations.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   Play, Square, AlertTriangle, Phone, UserCheck, MessageCircle,
//   Siren, Bus, CheckCircle, CloudRain, MapPin, Clock, Users, X
// } from 'lucide-react';
// import useDriverRouteLogic from '../../hooks/useDriverRouteLogic';
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
//   const { isTracking, startTracking, stopTracking } = useDriverRouteLogic();
//   const [showIncidentModal, setShowIncidentModal] = useState(false);
//   const [selectedIncident, setSelectedIncident] = useState('');
//   const [incidentNote, setIncidentNote] = useState('');
//   const [students, setStudents] = useState(initialStudents);
//   const [currentStop] = useState('Trạm A - Nguyễn Trãi');
//   const [showCheckinModal, setShowCheckinModal] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   useEffect(() => {
//     if (isTracking) {
//       setStudents(prev => prev.map(s => ({ ...s, status: s.status === 'waiting' ? 'waiting' : s.status })));
//     }
//   }, [isTracking]);

//   const handleStartTrip = () => {
//     startTracking();
//     alert('Chuyến đi đã bắt đầu! Phụ huynh được thông báo');
//   };

//   const handleEndTrip = () => {
//     if (confirm('Kết thúc chuyến đi?')) {
//       stopTracking();
//       setStudents(prev => prev.map(s => ({ ...s, status: 'dropped' })));
//       alert('Chuyến đi kết thúc thành công!');
//     }
//   };

//   const handleCheckIn = (studentId) => {
//     const student = students.find(s => s.id === studentId);
//     if (student) {
//       setSelectedStudent(student);
//       setShowCheckinModal(true);
//     }
//   };

//   const confirmCheckIn = () => {
//     if (!selectedStudent) return;
//     const time = new Date().toTimeString().slice(0, 5);
//     setStudents(prev => prev.map(s => 
//       s.id === selectedStudent.id ? { ...s, status: 'onboard' } : s
//     ));
//     setShowCheckinModal(false);
//     setSelectedStudent(null);
//     alert(`Đã đón ${selectedStudent.name} lúc ${time}`);
//   };

//   const markAbsent = (studentId) => {
//     setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'absent' } : s));
//     alert('Đã đánh dấu vắng mặt');
//   };

//   const handleSendIncident = () => {
//     if (!selectedIncident) return;
//     const typeLabel = incidentTypes.find(t => t.id === selectedIncident)?.label;
//     alert(`ĐÃ BÁO CÁO: ${typeLabel}\nGhi chú: ${incidentNote || 'Không có'}`);
//     setShowIncidentModal(false);
//     setSelectedIncident('');
//     setIncidentNote('');
//   };

//   const handleQuickMessage = (msg) => {
//     alert(`ĐÃ GỬI TIN NHẮN:\n"${msg}"\n→ Toàn bộ phụ huynh`);
//   };

//   const handleEmergencyCall = () => {
//     if (confirm('Gọi khẩn cấp đến quản lý và tổng đài 113?')) {
//       alert('Đang kết nối khẩn cấp...');
//     }
//   };

//   const stats = {
//     waiting: students.filter(s => s.stopName === currentStop && s.status === 'waiting').length,
//     onboard: students.filter(s => s.status === 'onboard').length,
//     absent: students.filter(s => s.status === 'absent').length,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto space-y-8">

//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl">
//           <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-5">
//             <Bus className="w-14 h-14" />
//             Thao tác nhanh
//           </h1>
//           <p className="text-xl mt-3 opacity-90">Tài xế: {user?.name || 'Tài xế'}</p>
//           <p className="text-lg opacity-80 mt-1 flex items-center gap-2">
//             <MapPin className="w-5 h-5" /> Trạm hiện tại: <span className="font-bold">{currentStop}</span>
//           </p>
//         </div>

//         {/* Trạng thái chuyến & Khẩn cấp */}
//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Trạng thái chuyến */}
//           <div className={`rounded-3xl p-10 text-center shadow-2xl border-4 transition-all ${isTracking ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-500' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'}`}>
//             <div className="text-8xl mb-6">
//               {isTracking ? <Play className="text-green-600" /> : <Square className="text-gray-600" />}
//             </div>
//             <h2 className="text-4xl font-bold mb-8">{isTracking ? 'ĐANG CHẠY' : 'ĐÃ DỪNG'}</h2>
//             <div className="space-y-6">
//               {!isTracking ? (
//                 <button onClick={handleStartTrip} className="w-full py-6 bg-green-600 hover:bg-green-700 text-white text-2xl font-bold rounded-2xl shadow-xl transform hover:scale-105 transition">
//                   BẮT ĐẦU CHUYẾN
//                 </button>
//               ) : (
//                 <button onClick={handleEndTrip} className="w-full py-6 bg-red-600 hover:bg-red-700 text-white text-2xl font-bold rounded-2xl shadow-xl transform hover:scale-105 transition">
//                   KẾT THÚC CHUYẾN
//                 </button>
//               )}
//               {isTracking && (
//                 <div className="grid grid-cols-2 gap-6 mt-8">
//                   <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
//                     <div className="text-4xl font-bold text-green-600">{stats.onboard}</div>
//                     <div className="text-lg text-green-700">Đã đón</div>
//                   </div>
//                   <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
//                     <div className="text-4xl font-bold text-blue-600">{stats.waiting}</div>
//                     <div className="text-lg text-blue-700">Chờ đón</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Khẩn cấp */}
//           <div className="rounded-3xl p-10 text-center bg-gradient-to-br from-red-50 to-pink-100 border-4 border-red-500 shadow-2xl">
//             <Siren className="w-32 h-32 text-red-600 mx-auto mb-6 animate-pulse" />
//             <h2 className="text-4xl font-bold text-red-700 mb-6">KHẨN CẤP</h2>
//             <p className="text-xl text-red-600 mb-6">Học sinh trên xe: <span className="font-bold">{stats.onboard}</span></p>
//             <button onClick={handleEmergencyCall} className="w-full py-8 bg-red-600 hover:bg-red-700 text-white text-3xl font-bold rounded-3xl shadow-2xl transform hover:scale-110 transition flex items-center justify-center gap-4 mx-auto">
//               <Phone className="w-12 h-12" />
//               GỌI CỨU HỘ NGAY
//             </button>
//           </div>
//         </div>

//         {/* Check-in học sinh */}
//         <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-200">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-3xl font-bold flex items-center gap-4 text-blue-700">
//               <UserCheck className="w-12 h-12" />
//               Check-in học sinh
//             </h2>
//             <div className="text-lg font-medium text-gray-600">
//               Còn lại: <span className="text-3xl font-bold text-blue-600">{stats.waiting}</span>
//             </div>
//           </div>

//           <div className="space-y-4 max-h-96 overflow-y-auto">
//             {students
//               .filter(s => s.stopName === currentStop && s.status === 'waiting')
//               .map((student) => (
//                 <div key={student.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-blue-500 hover:shadow-xl transition">
//                   <div className="flex items-center gap-6">
//                     <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-full ring-4 ring-blue-200" />
//                     <div>
//                       <div className="text-2xl font-bold text-gray-800">{student.name}</div>
//                       <div className="text-lg text-gray-600">{student.class}</div>
//                     </div>
//                   </div>
//                   <div className="flex gap-4">
//                     <button onClick={() => handleCheckIn(student.id)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-110 transition flex items-center gap-2">
//                       <CheckCircle className="w-6 h-6" /> Đón
//                     </button>
//                     <button onClick={() => markAbsent(student.id)} className="px-8 py-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-xl shadow-lg transform hover:scale-110 transition">
//                       Vắng
//                     </button>
//                   </div>
//                 </div>
//               ))}
//           </div>

//           {stats.waiting === 0 && (
//             <div className="text-center py-12">
//               <Users className="w-24 h-24 mx-auto text-gray-300 mb-4" />
//               <p className="text-2xl font-medium text-gray-500">Đã hoàn thành check-in tại {currentStop}</p>
//             </div>
//           )}
//         </div>

//         {/* Báo cáo sự cố & Tin nhắn nhanh */}
//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Báo cáo sự cố */}
//           <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
//             <h2 className="text-3xl font-bold mb-6 flex items-center gap-4 text-orange-600">
//               <AlertTriangle className="w-12 h-12" /> Báo cáo sự cố
//             </h2>
//             <button onClick={() => setShowIncidentModal(true)} className="w-full py-6 bg-orange-600 hover:bg-orange-700 text-white text-2xl font-bold rounded-2xl shadow-xl transform hover:scale-105 transition">
//               Báo cáo ngay
//             </button>
//           </div>

//           {/* Tin nhắn nhanh */}
//           <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-indigo-200">
//             <h2 className="text-3xl font-bold mb-6 flex items-center gap-4 text-indigo-600">
//               <MessageCircle className="w-12 h-12" /> Gửi tin nhắn nhanh
//             </h2>
//             <div className="space-y-4">
//               {quickMessages.map((msg, i) => (
//                 <button
//                   key={i}
//                   onClick={() => handleQuickMessage(msg)}
//                   className="w-full text-left p-6 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-2xl border-2 border-indigo-200 transition transform hover:scale-105 shadow-lg"
//                 >
//                   <span className="text-lg font-medium">{msg}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Modal báo cáo sự cố */}
//         {showIncidentModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-3xl shadow-3xl p-10 max-w-lg w-full">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-red-600 flex items-center gap-4">
//                   <AlertTriangle className="w-12 h-12" /> Báo cáo sự cố
//                 </h2>
//                 <button onClick={() => setShowIncidentModal(false)} className="text-gray-500 hover:text-gray-700">
//                   <X className="w-8 h-8" />
//                 </button>
//               </div>
//               <div className="space-y-6">
//                 {incidentTypes.map((type) => {
//                   const Icon = type.icon;
//                   return (
//                     <label key={type.id} className="flex items-center gap-6 p-6 border-2 rounded-2xl cursor-pointer hover:bg-red-50 transition">
//                       <input type="radio" name="incident" value={type.id} checked={selectedIncident === type.id} onChange={(e) => setSelectedIncident(e.target.value)} className="w-6 h-6 text-red-600" />
//                       <Icon className="w-10 h-10 text-red-600" />
//                       <span className="text-xl font-medium">{type.label}</span>
//                     </label>
//                   );
//                 })}
//                 <textarea placeholder="Ghi chú thêm (không bắt buộc)" value={incidentNote} onChange={(e) => setIncidentNote(e.target.value)} className="w-full p-6 border-2 rounded-2xl resize-none text-lg" rows="4" />
//                 <div className="flex gap-4">
//                   <button onClick={handleSendIncident} disabled={!selectedIncident} className="flex-1 py-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-2xl font-bold rounded-2xl shadow-xl transition">
//                     Gửi báo cáo
//                   </button>
//                   <button onClick={() => setShowIncidentModal(false)} className="flex-1 py-6 bg-gray-300 hover:bg-gray-400 text-gray-800 text-2xl font-bold rounded-2xl shadow-xl transition">
//                     Hủy
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal check-in học sinh */}
//         {showCheckinModal && selectedStudent && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-3xl shadow-3xl p-10 max-w-md w-full text-center">
//               <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-32 h-32 rounded-full mx-auto ring-8 ring-blue-200 mb-6" />
//               <h2 className="text-4xl font-bold mb-4">{selectedStudent.name}</h2>
//               <p className="text-2xl text-gray-600 mb-8">{selectedStudent.class}</p>
//               <div className="space-y-6 mb-10">
//                 <div className="flex items-center justify-center gap-3 text-green-600 text-xl">
//                   <MapPin className="w-8 h-8" /> {currentStop}
//                 </div>
//                 <div className="flex items-center justify-center gap-3 text-blue-600 text-xl">
//                   <Clock className="w-8 h-8" /> {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
//                 </div>
//               </div>
//               <div className="flex gap-6">
//                 <button onClick={confirmCheckIn} className="flex-1 py-8 bg-green-600 hover:bg-green-700 text-white text-3xl font-bold rounded-3xl shadow-2xl transform hover:scale-110 transition">
//                   XÁC NHẬN ĐÓN
//                 </button>
//                 <button onClick={() => { markAbsent(selectedStudent.id); setShowCheckinModal(false); setSelectedStudent(null); }} className="flex-1 py-8 bg-red-600 hover:bg-red-700 text-white text-3xl font-bold rounded-3xl shadow-2xl transform hover:scale-110 transition">
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
  Play, Square, AlertTriangle, Phone, UserCheck, MessageCircle,
  Siren, Bus, CheckCircle, CloudRain, MapPin, Clock, Users, X
} from 'lucide-react';
import useDriverRouteLogic from '../../hooks/useDriverRouteLogic';
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
  { id: 'weather',    label: 'Thời tiết xấu',   icon: CloudRain },
  { id: 'other',      label: 'Khác',            icon: MessageCircle },
];

const initialStudents = [
  { id: 's1', name: 'Nguyễn Thị An', class: '6A1', stopName: 'Trạm A - Nguyễn Trãi', status: 'waiting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An' },
  { id: 's2', name: 'Trần Văn Bình', class: '7B2', stopName: 'Trạm B - Lê Văn Sỹ', status: 'waiting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh' },
  { id: 's3', name: 'Lê Minh Cường', class: '8A3', stopName: 'Trạm C - Cách Mạng Tháng 8', status: 'waiting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong' },
  { id: 's4', name: 'Phạm Hồng Đào', class: '6A2', stopName: 'Trạm A - Nguyễn Trãi', status: 'waiting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dao' },
];

export default function DriverOperations() {
  const { user } = useAuth();
  const { isTracking, startTracking, stopTracking } = useDriverRouteLogic();
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState('');
  const [incidentNote, setIncidentNote] = useState('');
  const [students, setStudents] = useState(initialStudents);
  const [currentStop] = useState('Trạm A - Nguyễn Trãi');
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStartTrip = () => {
    startTracking();
    alert('Chuyến đi đã bắt đầu! Phụ huynh được thông báo');
  };

  const handleEndTrip = () => {
    if (confirm('Kết thúc chuyến đi?')) {
      stopTracking();
      setStudents(prev => prev.map(s => ({ ...s, status: 'dropped' })));
      alert('Chuyến đi kết thúc thành công!');
    }
  };

  const handleCheckIn = (id) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setSelectedStudent(student);
      setShowCheckinModal(true);
    }
  };

  const confirmCheckIn = () => {
    if (!selectedStudent) return;
    setStudents(prev => prev.map(s => 
      s.id === selectedStudent.id ? { ...s, status: 'onboard' } : s
    ));
    setShowCheckinModal(false);
    setSelectedStudent(null);
    alert(`Đã đón ${selectedStudent.name}`);
  };

  const markAbsent = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'absent' } : s));
    alert('Đã đánh dấu vắng mặt');
  };

  const handleSendIncident = () => {
    if (!selectedIncident) return;
    const typeLabel = incidentTypes.find(t => t.id === selectedIncident)?.label;
    alert(`ĐÃ BÁO CÁO: ${typeLabel}\nGhi chú: ${incidentNote || 'Không có'}`);
    setShowIncidentModal(false);
    setSelectedIncident('');
    setIncidentNote('');
  };

  const handleQuickMessage = (msg) => {
    alert(`ĐÃ GỬI: "${msg}"\n→ Tất cả phụ huynh`);
  };

  const handleEmergencyCall = () => {
    if (confirm('Gọi khẩn cấp đến quản lý và 113?')) {
      alert('Đang kết nối khẩn cấp...');
    }
  };

  const stats = {
    waiting: students.filter(s => s.stopName === currentStop && s.status === 'waiting').length,
    onboard: students.filter(s => s.status === 'onboard').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bus className="w-10 h-10" /> Thao tác nhanh
              </h1>
              <p className="text-lg opacity-90 mt-1">Tài xế: {user?.name || 'Tài xế'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Trạm hiện tại</p>
              <p className="text-xl font-bold flex items-center gap-2 justify-end">
                <MapPin className="w-5 h-5" /> {currentStop}
              </p>
            </div>
          </div>
        </div>

        {/* Trạng thái chuyến & Khẩn cấp */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Trạng thái */}
          <div className={`rounded-2xl p-8 text-center shadow-xl border-4 transition-all ${isTracking ? 'bg-green-50 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
            <div className="text-7xl mb-4">{isTracking ? <Play className="text-green-600" /> : <Square className="text-gray-500" />}</div>
            <h2 className="text-3xl font-bold mb-6">{isTracking ? 'ĐANG CHẠY' : 'ĐÃ DỪNG'}</h2>
            {!isTracking ? (
              <button onClick={handleStartTrip} className="w-full py-5 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition">
                BẮT ĐẦU CHUYẾN
              </button>
            ) : (
              <button onClick={handleEndTrip} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition">
                KẾT THÚC CHUYẾN
              </button>
            )}
            {isTracking && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="text-3xl font-bold text-green-600">{stats.onboard}</div>
                  <div className="text-sm text-gray-600">Đã đón</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="text-3xl font-bold text-blue-600">{stats.waiting}</div>
                  <div className="text-sm text-gray-600">Chờ đón</div>
                </div>
              </div>
            )}
          </div>

          {/* Khẩn cấp */}
          <div className="rounded-2xl p-8 text-center bg-red-50 border-4 border-red-500 shadow-xl">
            <Siren className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-red-700 mb-4">KHẨN CẤP</h2>
            <p className="text-red-600 mb-6">Trên xe: {stats.onboard} học sinh</p>
            <button onClick={handleEmergencyCall} className="w-full py-6 bg-red-600 hover:bg-red-700 text-white text-2xl font-bold rounded-xl shadow-lg hover:scale-110 transition flex items-center justify-center gap-3">
              <Phone className="w-8 h-8" /> GỌI CỨU HỘ
            </button>
          </div>
        </div>

        {/* Check-in học sinh */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-blue-700">
              <UserCheck className="w-8 h-8" /> Check-in học sinh
            </h2>
            <span className="text-lg font-medium text-gray-600">Còn {stats.waiting} em</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {students
              .filter(s => s.stopName === currentStop && s.status === 'waiting')
              .map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition">
                  <div className="flex items-center gap-4">
                    <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full ring-2 ring-blue-300" />
                    <div>
                      <div className="font-semibold">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.class}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleCheckIn(student.id)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow hover:scale-105 transition flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Đón
                    </button>
                    <button onClick={() => markAbsent(student.id)} className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium rounded-lg shadow hover:scale-105 transition">
                      Vắng
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {stats.waiting === 0 && (
            <div className="text-center py-10 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Đã hoàn thành check-in tại {currentStop}</p>
            </div>
          )}
        </div>

        {/* Báo cáo & Tin nhắn nhanh */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-orange-600">
              <AlertTriangle className="w-7 h-7" /> Báo cáo sự cố
            </h2>
            <button onClick={() => setShowIncidentModal(true)} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition">
              Báo cáo ngay
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-indigo-600">
              <MessageCircle className="w-7 h-7" /> Tin nhắn nhanh
            </h2>
            <div className="space-y-3">
              {quickMessages.slice(0, 3).map((msg, i) => (
                <button key={i} onClick={() => handleQuickMessage(msg)} className="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 text-sm font-medium transition">
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal báo cáo sự cố - NHỎ GỌN, ĐẸP */}
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

        {/* Modal check-in */}
        {showCheckinModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-24 h-24 rounded-full mx-auto ring-4 ring-blue-300 mb-4" />
              <h3 className="text-2xl font-bold mb-2">{selectedStudent.name}</h3>
              <p className="text-gray-600 mb-6">{selectedStudent.class}</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <MapPin className="w-5 h-5" /> {currentStop}
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Clock className="w-5 h-5" /> {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={confirmCheckIn} className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition">
                  XÁC NHẬN ĐÓN
                </button>
                <button onClick={() => { markAbsent(selectedStudent.id); setShowCheckinModal(false); setSelectedStudent(null); }} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition">
                  VẮNG
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}