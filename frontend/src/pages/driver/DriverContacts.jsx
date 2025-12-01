// // src/pages/driver/DriverContacts.jsx
// import React from 'react';
// import StudentList from '../../components/driver/StudentList';
// import NotificationsPanel from '../../components/driver/NotificationsPanel';

// const sampleStudents = [
//   { id: 's1', name: 'An', school: 'Trường 1', stopName: 'Trạm A' },
//   { id: 's2', name: 'Bình', school: 'Trường 1', stopName: 'Trạm B' },
//   { id: 's3', name: 'Cường', school: 'Trường 2', stopName: 'Trạm C' },
// ];

// const sampleContacts = [
//   { id: 'c1', name: 'Phụ huynh An', phone: '090-123-456', relation: 'Mẹ', student: 'An' },
//   { id: 'c2', name: 'Phụ huynh Bình', phone: '091-222-333', relation: 'Bố', student: 'Bình' },
// ];

// export default function DriverContacts() {
//   return (
//     <div className="grid lg:grid-cols-3 gap-6">
//       <div className="lg:col-span-2 space-y-4">
//         <div className="bg-white rounded p-4 shadow">
//           <h3 className="font-semibold mb-2">Danh sách học sinh</h3>
//           <StudentList students={sampleStudents} />
//         </div>

//         <div className="bg-white rounded p-4 shadow">
//           <h3 className="font-semibold mb-2">Danh sách liên hệ</h3>
//           <div className="space-y-3">
//             {sampleContacts.map(c => (
//               <div key={c.id} className="p-3 border rounded flex justify-between items-center">
//                 <div>
//                   <div className="font-medium">{c.name} ({c.relation})</div>
//                   <div className="text-xs text-gray-500">Học sinh: {c.student}</div>
//                 </div>
//                 <a href={`tel:${c.phone}`} className="text-indigo-600">{c.phone}</a>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <NotificationsPanel notifications={[
//           {id:'n1', title:'Cập nhật lộ trình', time:'07:50 25/11/2025', body:'Lộ trình thay đổi do tắc đường' }
//         ]} />
//       </div>
//     </div>
//   );
// }
// src/pages/driver/DriverContacts.jsx
// src/pages/driver/DriverContacts.jsx
import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  Search, 
  MapPin, 
  School, 
  User, 
  Bell, 
  Clock, 
  AlertCircle,
  CloudRain   // ĐÃ THÊM DÒNG NÀY – SỬA LỖI HOÀN TOÀN
} from 'lucide-react';

const students = [
  {
    id: 's1',
    name: 'Nguyễn Thị An',
    class: '6A1',
    school: 'THCS Lê Quý Đôn',
    stopName: 'Trạm A - Nguyễn Trãi',
    status: 'onboard',
    parentName: 'Cô Lan',
    parentPhone: '0901234567',
    parentRelation: 'Mẹ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An'
  },
  {
    id: 's2',
    name: 'Trần Văn Bình',
    class: '7B2',
    school: 'THCS Lê Quý Đôn',
    stopName: 'Trạm B - Lê Văn Sỹ',
    status: 'onboard',
    parentName: 'Chú Hùng',
    parentPhone: '0912223334',
    parentRelation: 'Bố',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh'
  },
  {
    id: 's3',
    name: 'Lê Minh Cường',
    class: '8A3',
    school: 'THPT Nguyễn Thị Minh Khai',
    stopName: 'Trạm C - Cách Mạng Tháng 8',
    status: 'absent',
    parentName: 'Cô Mai',
    parentPhone: '0934445556',
    parentRelation: 'Mẹ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong'
  },
  {
    id: 's4',
    name: 'Phạm Hồng Đào',
    class: '6A2',
    school: 'THCS Lê Quý Đôn',
    stopName: 'Trạm A - Nguyễn Trãi',
    status: 'late',
    parentName: 'Chị Hoa',
    parentPhone: '0987654321',
    parentRelation: 'Chị',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dao'
  },
];

const notifications = [
  { id: 'n1', title: 'Học sinh vắng', time: '07:15', body: 'Cường chưa lên xe hôm nay', type: 'warning' },
  { id: 'n2', title: 'Cập nhật lộ trình', time: '07:50', body: 'Đi đường vòng do tắc Nguyễn Trãi', type: 'info' },
  { id: 'n3', title: 'Thời tiết xấu', time: '08:05', body: 'Mưa lớn, xe chạy chậm, phụ huynh yên tâm', type: 'weather' },
];

export default function DriverContacts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.includes(searchTerm) ||
      s.stopName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'onboard': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Đã lên xe</span>;
      case 'absent': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Vắng</span>;
      case 'late': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Trễ</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Phone className="w-10 h-10" />
          Danh bạ & Học sinh
        </h1>
        <p className="mt-2 opacity-90">Quản lý học sinh, liên lạc phụ huynh nhanh</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Danh sách học sinh + Tìm kiếm */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thanh tìm kiếm */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm học sinh theo tên, lớp, trạm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Danh sách học sinh */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-xl font-bold">Danh sách học sinh ({filteredStudents.length})</h2>
            </div>
            <div className="divide-y">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="p-5 hover:bg-indigo-50 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-14 h-14 rounded-full ring-2 ring-indigo-200"
                    />
                    <div>
                      <div className="font-semibold text-lg">{student.name}</div>
                      <div className="text-sm text-gray-600">
                        {student.class} • {student.school}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {student.stopName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(student.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Thông báo */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-5">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-indigo-600" />
              Thông báo hôm nay
            </h3>
            <div className="space-y-3">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-4 rounded-lg border-l-4 ${
                  notif.type === 'warning' ? 'border-red-500 bg-red-50' :
                  notif.type === 'weather' ? 'border-blue-500 bg-blue-50' :
                  'border-indigo-500 bg-indigo-50'
                }`}>
                  <div className="flex items-start gap-3">
                    {notif.type === 'warning' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                    {notif.type === 'weather' && <CloudRain className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                    {notif.type === 'info' && <Bell className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
                    <div>
                      <div className="font-semibold text-sm">{notif.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{notif.body}</div>
                      <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {notif.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHI TIẾT HỌC SINH */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Thông tin học sinh</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 text-3xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="text-center">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-28 h-28 rounded-full mx-auto ring-4 ring-indigo-200"
                />
                <h3 className="text-2xl font-bold mt-4">{selectedStudent.name}</h3>
                <p className="text-gray-600">{selectedStudent.class} • {selectedStudent.school}</p>
                {getStatusBadge(selectedStudent.status)}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">Điểm đón</div>
                    <div className="text-sm text-gray-600">{selectedStudent.stopName}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" /> Phụ huynh
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="font-medium">{selectedStudent.parentName} ({selectedStudent.parentRelation})</div>
                    <a
                      href={`tel:${selectedStudent.parentPhone}`}
                      className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg"
                    >
                      <Phone className="w-5 h-5" />
                      Gọi ngay: {selectedStudent.parentPhone}
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-3 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}