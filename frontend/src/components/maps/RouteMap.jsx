// // src/components/maps/RouteMap.jsx
// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Đã được fix ở fixLeafletIcon.js → không cần làm gì thêm
// import '../../fixLeafletIcon.js';

// // Icon xe buýt đẹp hơn (tùy chọn)
// const busIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/10435/10435350.png',
//   iconSize: [40, 40],
//   iconAnchor: [20, 40],
//   popupAnchor: [0, -40],
// });

// export default function RouteMap({
//   center = [10.762622, 106.660172],
//   zoom = 13,
//   route = [],
//   stops = [],
//   currentPosition = null,
// }) {
//   return (
//     <div className="h-96 w-full rounded-xl overflow-hidden shadow-xl border border-gray-200">
//       <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Điểm dừng */}
//         {stops.map((stop) => (
//           <Marker key={stop.id} position={stop.position}>
//             <Popup>
//               <div className="text-center">
//                 <div className="font-bold text-indigo-600">{stop.name}</div>
//                 {stop.time && <div className="text-xs text-gray-600">Giờ: {stop.time}</div>}
//               </div>
//             </Popup>
//           </Marker>
//         ))}

//         {/* Vị trí xe hiện tại */}
//         {currentPosition && (
//           <Marker position={currentPosition} icon={busIcon}>
//             <Popup>
//               <div className="text-center font-semibold">
//                 <span role="img" aria-label="bus">Xe buýt</span> Đang ở đây
//               </div>
//             </Popup>
//           </Marker>
//         )}

//         {/* Đường đi */}
//         {route.length > 1 && (
//           <Polyline
//             positions={route}
//             color="#4f46e5"
//             weight={6}
//             opacity={0.8}
//             dashArray="10, 15"
//           />
//         )}
//       </MapContainer>
//     </div>
//   );
// }
// src/components/maps/RouteMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../fixLeafletIcon.js';

// Icon xe buýt đẹp
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/10435/10435350.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function RouteMap({
  center = [10.762622, 106.660172],
  zoom = 13,
  route = [],
  stops = [],
  currentPosition = null,
}) {
  return (
    <div className="h-96 w-full rounded-xl overflow-hidden shadow-xl border border-gray-200 relative">
      {/* THÊM LỚP NÀY ĐỂ FIX ĐÈ HEADER */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-container-fix" // <-- Dòng quan trọng nhất
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Điểm dừng */}
          {stops.map((stop) => (
            <Marker key={stop.id} position={stop.position}>
              <Popup>
                <div className="text-center">
                  <div className="font-bold text-indigo-600">{stop.name}</div>
                  {stop.time && <div className="text-xs text-gray-600">Giờ: {stop.time}</div>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Xe buýt hiện tại */}
          {currentPosition && (
            <Marker position={currentPosition} icon={busIcon}>
              <Popup> Xe buýt đang ở đây</Popup>
            </Marker>
          )}

          {/* Đường đi */}
          {route.length > 1 && (
            <Polyline
              positions={route}
              color="#4f46e5"
              weight={6}
              opacity={0.8}
              dashArray="10, 15"
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}