// // src/components/maps/RouteMap.jsx
// import React, { useEffect, useState, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import '../../fixLeafletIcon.js';

// // 🚌 ICON BUS ĐẸP
// const busIcon = L.divIcon({
//   html: `
//     <div style="
//       background: linear-gradient(135deg, #1d4ed8, #3b82f6);
//       color: white;
//       width: 56px; height: 56px;
//       border-radius: 50%;
//       display: flex; align-items: center; justify-content: center;
//       font-weight: bold; font-size: 18px;
//       border: 6px solid white;
//       box-shadow: 0 8px 30px rgba(0,0,0,0.5);
//       animation: float 3s ease-in-out infinite;
//     ">BUS</div>

//     <style>
//       @keyframes float {
//         0%,100% { transform: translateY(0); }
//         50% { transform: translateY(-8px); }
//       }
//     </style>
//   `,
//   className: '',
//   iconSize: [56, 56],
//   iconAnchor: [28, 56],
// });

// /* ======================================================
//    🚍 Animated Bus – FULLY UPDATED
//    - Dừng tại trạm theo lastStoppedPosition
//    - Resume từ đúng vị trí đã dừng
//    - Tương thích với useDriverRouteLogic mới
// ========================================================= */
// function AnimatedBus({
//   path,
//   isTracking,
//   isAtStation,
//   lastStoppedPosition,
// }) {
//   const map = useMap();
//   const [position, setPosition] = useState(null);

//   const rafRef = useRef(null);
//   const startRef = useRef(null);
//   const pausedElapsedRef = useRef(0);

//   // Tìm index gần nhất từ lastStoppedPosition
//   const findClosestIndex = (pt) => {
//     if (!path || path.length === 0) return 0;
//     let bestIndex = 0;
//     let bestDist = Infinity;

//     for (let i = 0; i < path.length; i++) {
//       const dist =
//         (path[i][0] - pt[0]) ** 2 + (path[i][1] - pt[1]) ** 2;
//       if (dist < bestDist) {
//         bestDist = dist;
//         bestIndex = i;
//       }
//     }
//     return bestIndex;
//   };

//   // --- MAIN EFFECT ---
//   useEffect(() => {
//     // ❌ STOP
//     if (!isTracking) {
//       if (lastStoppedPosition) {
//         setPosition(lastStoppedPosition);
//         map.panTo(lastStoppedPosition);
//       } else if (path.length > 0) {
//         setPosition(path[0]);
//         map.panTo(path[0]);
//       }

//       cancelAnimationFrame(rafRef.current);
//       return;
//     }

//     // 🚏 Nếu đang ở trạm -> DỪNG HOÀN TOÀN
//     if (isAtStation && lastStoppedPosition) {
//       setPosition(lastStoppedPosition);
//       map.panTo(lastStoppedPosition);
//       cancelAnimationFrame(rafRef.current);
//       startRef.current = null;
//       return;
//     }

//     // ▶ RESUME từ lastStoppedPosition
//     if (!startRef.current) {
//       const totalDuration = 240000;

//       if (lastStoppedPosition) {
//         const idx = findClosestIndex(lastStoppedPosition);
//         const progress = idx / (path.length - 1);

//         pausedElapsedRef.current = progress * totalDuration;
//         startRef.current = Date.now() - pausedElapsedRef.current;

//         setPosition(lastStoppedPosition);
//         map.panTo(lastStoppedPosition);
//       } else {
//         startRef.current = Date.now();
//         setPosition(path[0]);
//         map.panTo(path[0]);
//       }
//     }

//     const animate = () => {
//       const totalDuration = 240000;
//       const elapsed = Date.now() - startRef.current;
//       const progress = Math.min(elapsed / totalDuration, 1);

//       const idx = Math.floor(progress * (path.length - 1));
//       const pos = path[idx];

//       setPosition(pos);
//       map.panTo(pos, { animate: true, duration: 0.6 });

//       if (progress < 1) {
//         rafRef.current = requestAnimationFrame(animate);
//       }
//     };

//     rafRef.current = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(rafRef.current);
//   }, [isTracking, isAtStation, path, lastStoppedPosition, map]);

//   if (!position) return null;

//   return (
//     <Marker position={position} icon={busIcon}>
//       <Popup>
//         <div className="font-bold">
//           {isAtStation ? "Xe đang dừng để check-in" : "Đang di chuyển"}
//         </div>
//       </Popup>
//     </Marker>
//   );
// }

// /* ======================================================
//    🗺️ RouteMap – FULLY UPDATED
// ========================================================= */
// export default function RouteMap({
//   center = [10.77, 106.68],
//   zoom = 14,
//   stops = [],
//   isTracking = false,
//   isAtStation = false,
//   currentStationIndex = -1,
//   lastStoppedPosition = null,
// }) {
//   const [realPath, setRealPath] = useState([]);

//   // Lấy route từ OSRM
//   useEffect(() => {
//     if (stops.length < 2) return;

//     const coords = stops.map(s => `${s.position[1]},${s.position[0]}`).join(';');

//     fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
//       .then(r => r.json())
//       .then(data => {
//         if (data.routes?.[0]?.geometry?.coordinates) {
//           setRealPath(
//             data.routes[0].geometry.coordinates.map(c => [c[1], c[0]])
//           );
//         } else {
//           setRealPath(stops.map(s => s.position));
//         }
//       })
//       .catch(() => setRealPath(stops.map(s => s.position)));
//   }, [stops]);

//   // Icon trạm
//   const createStopIcon = (index, isCurrent) =>
//     L.divIcon({
//       html: `
//         <div style="
//           background: ${isCurrent ? '#8b5cf6' : '#10b981'};
//           color: white;
//           width:48px; height:48px;
//           border-radius:50%;
//           display:flex; align-items:center; justify-content:center;
//           font-weight:bold; font-size:20px;
//           border:6px solid white;
//           box-shadow:0 8px 25px rgba(0,0,0,0.4);
//           animation:${isCurrent ? "pulse 2s infinite" : "none"};
//         ">${index + 1}</div>

//         <style>
//           @keyframes pulse {
//             0% { box-shadow:0 0 0 0 rgba(139,92,246,0.7); }
//             70% { box-shadow:0 0 0 20px rgba(139,92,246,0); }
//             100% { box-shadow:0 0 0 0 rgba(139,92,246,0); }
//           }
//         </style>
//       `,
//       iconSize: [48, 48],
//       iconAnchor: [24, 48],
//     });

//   return (
//     <div className="h-96 w-full rounded-xl overflow-hidden shadow-2xl border-4 border-indigo-100">
//       <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {realPath.length > 1 && (
//           <Polyline positions={realPath} color="#4f46e5" weight={9} opacity={0.9} />
//         )}

//         {/* Trạm */}
//         {stops.map((stop, idx) => (
//           <Marker
//             key={stop.id}
//             position={stop.position}
//             icon={createStopIcon(idx, idx === currentStationIndex)}
//           >
//             <Popup>
//               <div className="text-center">
//                 <div className="font-bold text-xl text-indigo-700">{stop.name}</div>
//                 <div className="text-sm text-gray-600">Dự kiến: {stop.time}</div>

//                 {idx === currentStationIndex && (
//                   <div className="mt-3 px-4 py-2 bg-green-500 text-white rounded-full text-lg font-bold animate-pulse">
//                     ĐANG CHECK-IN
//                   </div>
//                 )}
//               </div>
//             </Popup>
//           </Marker>
//         ))}

//         {/* 🚌 Animated bus */}
//         <AnimatedBus
//           path={realPath.length > 0 ? realPath : stops.map(s => s.position)}
//           isTracking={isTracking}
//           isAtStation={isAtStation}
//           lastStoppedPosition={lastStoppedPosition}
//         />
//       </MapContainer>
//     </div>
//   );
// }
// src/components/maps/RouteMap.jsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../fixLeafletIcon.js";

/* ============================================================
   🚌 ICON BUS
============================================================ */
const busIcon = L.divIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, #1d4ed8, #3b82f6);
      color: white;
      width: 56px; height: 56px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: bold;
      border: 6px solid white;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      animation: float 3s ease-in-out infinite;
    ">BUS</div>

    <style>
      @keyframes float {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
    </style>
  `,
  className: "",
  iconSize: [56, 56],
  iconAnchor: [28, 56],
});

/* ============================================================
   🚍 Animated Bus (UPDATED WITH CHECK-IN LOGIC)
============================================================ */
function AnimatedBus({
  path,
  isTracking,
  isAtStation,
  isCheckingIn,
  lastStoppedPosition,
}) {
  const map = useMap();
  const [position, setPosition] = useState(null);

  const rafRef = useRef(null);
  const startRef = useRef(null);
  const pausedElapsedRef = useRef(0);

  // Tìm index gần nhất trên path
  const findClosestIndex = (pt) => {
    if (!path?.length) return 0;
    let best = 0, min = Infinity;

    for (let i = 0; i < path.length; i++) {
      const d = (path[i][0] - pt[0]) ** 2 + (path[i][1] - pt[1]) ** 2;
      if (d < min) {
        min = d;
        best = i;
      }
    }
    return best;
  };

  /* MAIN EFFECT ------------------------------------------------- */
  useEffect(() => {
    // ❌ STOP animation
    if (!isTracking) {
      cancelAnimationFrame(rafRef.current);

      if (lastStoppedPosition) {
        setPosition(lastStoppedPosition);
        map.panTo(lastStoppedPosition);
      } else if (path.length > 0) {
        setPosition(path[0]);
        map.panTo(path[0]);
      }
      startRef.current = null;
      return;
    }

    // 🚏 DỪNG TẠI TRẠM CHECK-IN
    if (isAtStation || isCheckingIn) {
      cancelAnimationFrame(rafRef.current);
      if (lastStoppedPosition) {
        setPosition(lastStoppedPosition);
        map.panTo(lastStoppedPosition);
      }
      return;
    }

    // ▶ Resume from lastStoppedPosition
    if (!startRef.current) {
      const total = 240000; // 4 phút animation

      if (lastStoppedPosition) {
        const idx = findClosestIndex(lastStoppedPosition);
        const progress = idx / (path.length - 1);
        pausedElapsedRef.current = total * progress;

        startRef.current = Date.now() - pausedElapsedRef.current;

        setPosition(lastStoppedPosition);
        map.panTo(lastStoppedPosition);
      } else {
        startRef.current = Date.now();
        setPosition(path[0]);
        map.panTo(path[0]);
      }
    }

    const animate = () => {
      const total = 240000;
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(elapsed / total, 1);

      const idx = Math.floor(progress * (path.length - 1));
      const pos = path[idx];

      setPosition(pos);
      map.panTo(pos, { animate: true, duration: 0.6 });

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [isTracking, isAtStation, isCheckingIn, path, lastStoppedPosition, map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={busIcon}>
      <Popup>
        <div className="font-bold">
          {isCheckingIn
            ? "🚏 Đang check-in học sinh"
            : isAtStation
            ? "🅿 Đang dừng tại trạm"
            : "🚌 Đang di chuyển"}
        </div>
      </Popup>
    </Marker>
  );
}

/* ============================================================
   🗺️ RouteMap — FULL LOGIC UPDATE
============================================================ */
export default function RouteMap({
  center = [10.77, 106.68],
  zoom = 14,
  stops = [],
  isTracking,
  isAtStation,
  isCheckingIn,
  currentStationIndex,
  lastStoppedPosition,
}) {
  const [realPath, setRealPath] = useState([]);

  /* Tạo tuyến OSRM ------------------------------------------------- */
  useEffect(() => {
    if (stops.length < 2) return;

    const coords = stops
      .map((s) => `${s.position[1]},${s.position[0]}`)
      .join(";");

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.routes?.[0]?.geometry?.coordinates) {
          setRealPath(
            d.routes[0].geometry.coordinates.map((c) => [c[1], c[0]])
          );
        } else {
          setRealPath(stops.map((s) => s.position));
        }
      })
      .catch(() => setRealPath(stops.map((s) => s.position)));
  }, [stops]);

  /* Icon trạm ------------------------------------------------------ */
  const stopIcon = (index, isCurrent) =>
    L.divIcon({
      html: `
        <div style="
          background: ${isCurrent ? "#8b5cf6" : "#10b981"};
          color: white;
          width: 48px; height: 48px;
          border-radius: 50%;
          display: flex; justify-content:center; align-items:center;
          font-size: 20px; font-weight: bold;
          border: 6px solid white;
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
          animation: ${isCurrent ? "pulse 2s infinite" : "none"};
        ">${index + 1}</div>

        <style>
          @keyframes pulse {
            0% { box-shadow:0 0 0 0 rgba(139,92,246,0.7) }
            70% { box-shadow:0 0 0 20px rgba(139,92,246,0) }
            100% { box-shadow:0 0 0 0 rgba(139,92,246,0) }
          }
        </style>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
    });

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden shadow-2xl border-4 border-indigo-100">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {realPath.length > 1 && (
          <Polyline positions={realPath} color="#4f46e5" weight={9} opacity={0.9} />
        )}

        {/* Trạm */}
        {stops.map((stop, idx) => (
          <Marker
            key={stop.id}
            position={stop.position}
            icon={stopIcon(idx, idx === currentStationIndex)}
          >
            <Popup>
              <div className="text-center">
                <div className="font-bold text-xl text-indigo-700">{stop.name}</div>
                <div className="text-sm text-gray-600">Dự kiến: {stop.time}</div>

                {idx === currentStationIndex && (
                  <div className="mt-3 px-4 py-2 bg-green-600 text-white rounded-full text-lg font-bold animate-pulse">
                    ĐANG CHECK-IN
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 🚌 Animated Bus */}
        <AnimatedBus
          path={realPath.length ? realPath : stops.map((s) => s.position)}
          isTracking={isTracking}
          isAtStation={isAtStation}
          isCheckingIn={isCheckingIn}
          lastStoppedPosition={lastStoppedPosition}
        />
      </MapContainer>
    </div>
  );
}
