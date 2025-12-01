// // src/pages/driver/DriverOperations.jsx
// import React from 'react';

// const operations = [
//   { id: 'o1', name: 'Bắt đầu chuyến', desc: 'Bắt đầu ghi nhận lộ trình và thời gian.' },
//   { id: 'o2', name: 'Kết thúc chuyến', desc: 'Kết thúc ghi nhận, gửi báo cáo.' },
//   { id: 'o3', name: 'Báo cáo sự cố', desc: 'Gửi báo cáo nhanh sự cố.' },
// ];

// export default function DriverOperations() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {operations.map(op => (
//         <div key={op.id} className="bg-white rounded shadow p-4 border">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="font-medium">{op.name}</div>
//               <div className="text-xs text-gray-500 mt-1">{op.desc}</div>
//             </div>
//             <div>
//               <button className="px-3 py-1 rounded bg-indigo-600 text-white">Thực hiện</button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
// src/pages/driver/DriverOperations.jsx
import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  AlertTriangle, 
  Phone,           // Thay PhoneEmergency → Phone
  UserCheck, 
  MessageCircle,
  Siren,
  Bus,
  CheckCircle,
  CloudRain
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

export default function DriverOperations() {
  const { user } = useAuth();
  const { isTracking, startTracking, stopTracking } = useDriverRouteLogic();
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState('');
  const [incidentNote, setIncidentNote] = useState('');

  const handleStartTrip = () => {
    startTracking();
    alert('Chuyến đi đã bắt đầu! Phụ huynh được thông báo');
  };

  const handleEndTrip = () => {
    if (confirm('Kết thúc chuyến đi? Báo cáo sẽ được gửi.')) {
      stopTracking();
      alert('Chuyến đi kết thúc thành công!');
    }
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
    alert(`ĐÃ GỬI TIN NHẮN:\n"${msg}"\n→ Toàn bộ phụ huynh`);
  };

  const handleEmergencyCall = () => {
    if (confirm('Gọi khẩn cấp đến quản lý và tổng đài 113?')) {
      alert('Đang kết nối khẩn cấp...');
      // window.location.href = 'tel:113';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bus className="w-10 h-10" />
          Thao tác nhanh
        </h1>
        <p className="mt-2 opacity-90">Tài xế: {user?.name || 'Tài xế'}</p>
      </div>

      {/* TRẠNG THÁI CHUYẾN ĐI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-8 text-center shadow-lg border-4 transition-all ${isTracking ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
          <div className="text-6xl mb-4">{isTracking ? <Play className="text-green-600 inline" /> : <Square className="text-gray-600 inline" />}</div>
          <h2 className="text-2xl font-bold mb-4">{isTracking ? 'ĐANG CHẠY' : 'ĐÃ DỪNG'}</h2>
          <div className="space-x-4">
            {!isTracking ? (
              <button onClick={handleStartTrip} className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg transform hover:scale-105 transition">
                BẮT ĐẦU CHUYẾN
              </button>
            ) : (
              <button onClick={handleEndTrip} className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 shadow-lg transform hover:scale-105 transition">
                KẾT THÚC CHUYẾN
              </button>
            )}
          </div>
        </div>

        {/* KHẨN CẤP */}
        <div className="rounded-xl p-8 text-center bg-red-50 border-4 border-red-500 shadow-lg">
          <Siren className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-red-700 mb-4">KHẨN CẤP</h2>
          <button 
            onClick={handleEmergencyCall}
            className="px-10 py-6 bg-red-600 text-white rounded-xl font-bold text-xl hover:bg-red-700 shadow-2xl transform hover:scale-110 transition flex items-center justify-center gap-3 mx-auto"
          >
            <Phone className="w-8 h-8" />
            GỌI CỨU HỘ NGAY
          </button>
        </div>
      </div>

      {/* BÁO CÁO SỰ CỐ */}
      <div className="bg-white rounded-xl shadow-lg p-6 border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="text-orange-600" /> Báo cáo sự cố
        </h2>
        <button
          onClick={() => setShowIncidentModal(true)}
          className="w-full py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Báo cáo ngay
        </button>
      </div>

      {/* CHECK-IN NHANH & TIN NHẮN */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Check-in nhanh */}
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserCheck className="text-blue-600" /> Check-in học sinh
          </h2>
          <div className="space-y-3">
            {['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Cường', 'Phạm Hồng Đào'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{name}</span>
                <div className="space-x-2">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">Đã đón</button>
                  <button className="px-4 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500">Vắng</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tin nhắn nhanh */}
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="text-indigo-600" /> Gửi tin nhắn nhanh
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {quickMessages.map((msg, i) => (
              <button
                key={i}
                onClick={() => handleQuickMessage(msg)}
                className="text-left p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL BÁO CÁO SỰ CỐ */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-red-600">Báo cáo sự cố</h2>
            <div className="space-y-4">
              {incidentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label key={type.id} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="incident"
                      value={type.id}
                      checked={selectedIncident === type.id}
                      onChange={(e) => setSelectedIncident(e.target.value)}
                      className="w-5 h-5 text-red-600"
                    />
                    <Icon className="w-6 h-6 text-red-600" />
                    <span className="font-medium">{type.label}</span>
                  </label>
                );
              })}
              <textarea
                placeholder="Ghi chú thêm (không bắt buộc)"
                value={incidentNote}
                onChange={(e) => setIncidentNote(e.target.value)}
                className="w-full p-3 border rounded-lg resize-none"
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSendIncident}
                  disabled={!selectedIncident}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
                >
                  Gửi báo cáo
                </button>
                <button
                  onClick={() => setShowIncidentModal(false)}
                  className="flex-1 py-3 bg-gray-300 rounded-lg font-bold hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}