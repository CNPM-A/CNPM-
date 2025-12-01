// // src/components/driver/StudentList.jsx
// import React from 'react';

// export default function StudentList({ students = [] }) {
//   return (
//     <div className="bg-white rounded-md shadow p-4 border">
//       <h3 className="font-semibold mb-3">Danh sách học sinh</h3>
//       <div className="space-y-2 max-h-64 overflow-auto">
//         {students.map(s => (
//           <div key={s.id} className="flex items-center justify-between">
//             <div>
//               <div className="font-medium">{s.name}</div>
//               <div className="text-xs text-gray-500">Trường: {s.school}</div>
//             </div>
//             <div className="text-xs text-gray-600">Trạm: {s.stopName}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
export default function StudentList({ students = [], onCheckIn }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Danh sách học sinh ({students.length})</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {students.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold
                ${s.status === 'onboard' ? 'bg-green-500' : s.status === 'late' ? 'bg-red-500' : 'bg-gray-400'}
              `}>
                {s.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-500">Lớp {s.class} • {s.school}</div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="font-medium">{s.stopName}</div>
              <div className={`text-xs ${s.status === 'onboard' ? 'text-green-600' : 'text-gray-500'}`}>
                {s.status === 'onboard' ? 'Đã lên xe' : 'Chưa đón'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
