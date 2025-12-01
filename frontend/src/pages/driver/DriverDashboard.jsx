// // src/pages/driver/DriverDashboard.jsx
// import React, { useState } from 'react';
// import VehicleList from '../../components/driver/VehicleList';
// import StudentList from '../../components/driver/StudentList';
// import NotificationsPanel from '../../components/driver/NotificationsPanel';
// import RouteMap from '../../components/maps/RouteMap';

// const sampleVehicles = [
//   { id: 'v1', name: 'Bus A', plate: '29A-123.45', driver: 'Nguyễn A' },
//   { id: 'v2', name: 'Bus B', plate: '29B-987.65', driver: 'Trần B' },
// ];

// const sampleStudents = [
//   { id: 's1', name: 'An', school: 'Trường 1', stopName: 'Trạm A' },
//   { id: 's2', name: 'Bình', school: 'Trường 1', stopName: 'Trạm B' },
// ];

// const sampleStops = [
//   { id: 'stop1', name: 'Trạm A', position: [10.7628, 106.6602] },
//   { id: 'stop2', name: 'Trạm B', position: [10.7665, 106.6820] },
// ];

// const sampleRoute = [
//   [10.7628, 106.6602],
//   [10.7640, 106.6670],
//   [10.7665, 106.6820],
// ];

// export default function DriverDashboard() {
//   const [selectedVehicle, setSelectedVehicle] = useState(sampleVehicles[0]);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <VehicleList vehicles={sampleVehicles} onSelect={setSelectedVehicle} />
//         <StudentList students={sampleStudents} />
//         <NotificationsPanel notifications={[
//           {id:'n1', title:'Lưu ý giờ xuất phát', time: '08:00 25/11/2025', body: 'Xem lại lịch trình' }
//         ]} />
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="font-semibold mb-3">Bản đồ hành trình ({selectedVehicle.name})</h3>
//         <RouteMap center={sampleRoute[0]} zoom={13} route={sampleRoute} stops={sampleStops} />
//       </div>
//     </div>
//   );
// }
// src/pages/driver/DriverDashboard.jsx
import React, { useState } from 'react';
import VehicleList from '../../components/driver/VehicleList';
import StudentList from '../../components/driver/StudentList';
import NotificationsPanel from '../../components/driver/NotificationsPanel';
import RouteMap from '../../components/maps/RouteMap';

const sampleVehicles = [
  { id: 'v1', name: 'Bus A', plate: '29A-123.45', driver: 'Nguyễn A' },
  { id: 'v2', name: 'Bus B', plate: '29B-987.65', driver: 'Trần B' },
];

const sampleStudents = [
  { id: 's1', name: 'An', school: 'Trường 1', stopName: 'Trạm A' },
  { id: 's2', name: 'Bình', school: 'Trường 1', stopName: 'Trạm B' },
];

const sampleStops = [
  { id: 'stop1', name: 'Trạm A', position: [10.7628, 106.6602] },
  { id: 'stop2', name: 'Trạm B', position: [10.7665, 106.6820] },
];

const sampleRoute = [
  [10.7628, 106.6602],
  [10.7640, 106.6670],
  [10.7665, 106.6820],
];

export default function DriverDashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState(sampleVehicles[0]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VehicleList vehicles={sampleVehicles} onSelect={setSelectedVehicle} />
        <StudentList students={sampleStudents} />
        <NotificationsPanel notifications={[
          {id:'n1', title:'Lưu ý giờ xuất phát', time: '08:00 25/11/2025', body: 'Xem lại lịch trình' }
        ]} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Bản đồ hành trình ({selectedVehicle.name})</h3>
        <RouteMap center={sampleRoute[0]} zoom={13} route={sampleRoute} stops={sampleStops} />
      </div>
    </div>
  );
}
