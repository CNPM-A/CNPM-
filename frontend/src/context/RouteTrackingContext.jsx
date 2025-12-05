// // src/context/RouteTrackingContext.jsx
// import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

// const RouteTrackingContext = createContext();

// export const useRouteTracking = () => {
//   const context = useContext(RouteTrackingContext);
//   if (!context) throw new Error('useRouteTracking must be used within RouteTrackingProvider');
//   return context;
// };

// // -------------------- Mock data (unchanged) --------------------
// const STUDENTS_DATABASE = {
//   hs1: { id: 'hs1', name: 'Nguyễn Văn An', class: '6A1', stop: 'st1', parentName: 'Cô Lan', parentPhone: '0901234567', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An' },
//   hs2: { id: 'hs2', name: 'Trần Thị Bé', class: '6A2', stop: 'st1', parentName: 'Anh Hùng', parentPhone: '0902345678', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Be' },
//   hs3: { id: 'hs3', name: 'Lê Minh Cường', class: '7A1', stop: 'st1', parentName: 'Cô Mai', parentPhone: '0903456789', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong' },
//   hs4: { id: 'hs4', name: 'Phạm Ngọc Dũng', class: '8A3', stop: 'st1', parentName: 'Chú Tuấn', parentPhone: '0904567890', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dung' },
//   hs5: { id: 'hs5', name: 'Hoàng Thị Em', class: '9A1', stop: 'st2', parentName: 'Chị Hoa', parentPhone: '0905678901', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Em' },
//   hs6: { id: 'hs6', name: 'Vũ Văn Bình', class: '7A2', stop: 'st2', parentName: 'Anh Nam', parentPhone: '0906789012', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh' },
//   hs7: { id: 'hs7', name: 'Đỗ Thị Hương', class: '8A1', stop: 'st2', parentName: 'Cô Ngọc', parentPhone: '0907890123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huong' },
//   hs8: { id: 'hs8', name: 'Ngô Minh Khang', class: '9A2', stop: 'st3', parentName: 'Chú Long', parentPhone: '0908901234', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khang' },
//   hs9: { id: 'hs9', name: 'Bùi Thị Lan', class: '6A3', stop: 'st3', parentName: 'Cô Thảo', parentPhone: '0909012345', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lan' },
// };

// const ROUTES_TODAY = [
//   {
//     id: 'route1',
//     name: 'Tuyến 01 - Sáng',
//     time: '06:30 - 07:30',
//     totalStudents: 28,
//     stations: [
//       { id: 'st1', name: 'Trạm A - Nguyễn Trãi', position: [10.7628, 106.6602], time: '06:35' },
//       { id: 'st2', name: 'Trạm B - Lê Văn Sỹ', position: [10.7640, 106.6670], time: '06:42' },
//       { id: 'st3', name: 'Trạm C - CMT8', position: [10.7715, 106.6780], time: '06:50' },
//       { id: 'st4', name: 'THPT Lê Quý Đôn', position: [10.7800, 106.6950], time: '07:05' },
//     ],
//   },
//   {
//     id: 'route2',
//     name: 'Tuyến 02 - Chiều',
//     time: '16:00 - 17:00',
//     totalStudents: 25,
//     stations: [
//       { id: 'st5', name: 'THPT Lê Quý Đôn', position: [10.7800, 106.6950], time: '16:00' },
//       { id: 'st6', name: 'Trạm D - Nguyễn Thị Minh Khai', position: [10.7680, 106.6850], time: '16:20' },
//       { id: 'st7', name: 'Trạm E - Võ Thị Sáu', position: [10.7750, 106.6900], time: '16:35' },
//     ],
//   },
// ];

// const createStudentsByRoute = () => {
//   const studentsByStation = {};
//   ROUTES_TODAY.forEach(route => {
//     route.stations.forEach(station => {
//       studentsByStation[station.id] = [];
//     });
//   });

//   const route1Students = [
//     STUDENTS_DATABASE.hs1, STUDENTS_DATABASE.hs2, STUDENTS_DATABASE.hs3, STUDENTS_DATABASE.hs4,
//     STUDENTS_DATABASE.hs5, STUDENTS_DATABASE.hs6, STUDENTS_DATABASE.hs7,
//     STUDENTS_DATABASE.hs8, STUDENTS_DATABASE.hs9,
//   ];

//   studentsByStation['st1'] = route1Students.slice(0, 4);
//   studentsByStation['st2'] = route1Students.slice(4, 7);
//   studentsByStation['st3'] = route1Students.slice(7, 9);
//   studentsByStation['st4'] = [];

//   studentsByStation['st5'] = [];
//   studentsByStation['st6'] = route1Students.slice(0, 5);
//   studentsByStation['st7'] = route1Students.slice(5, 9);

//   return studentsByStation;
// };

// const STUDENTS_BY_STATION = createStudentsByRoute();

// const PRE_ARRIVAL_DELAY_MS = 3000;
// const CHECKIN_SECONDS = 60;
// const AFTER_ALL_CHECKED_DELAY_MS = 3000;

// // -------------------- Provider --------------------
// export const RouteTrackingProvider = ({ children }) => {
//   // trip state
//   const [isTracking, setIsTracking] = useState(false);
//   const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
//   const [currentStationIndex, setCurrentStationIndex] = useState(-1);
//   const [studentCheckIns, setStudentCheckIns] = useState({}); // { studentId: 'present'|'absent'|undefined }
//   const [stationTimer, setStationTimer] = useState(0);
//   const [isStationActive, setIsStationActive] = useState(false); // xe đang dừng ở trạm (trước khi depart)
//   const [lastStoppedState, setLastStoppedState] = useState(() => {
//     try {
//       const s = localStorage.getItem('lastStoppedBusState');
//       return s ? JSON.parse(s) : null;
//     } catch {
//       return null;
//     }
//   });

//   // refs for timers and stable read of studentCheckIns inside intervals
//   const timerRef = useRef(null);
//   const delayRef = useRef(null);
//   const studentCheckInsRef = useRef(studentCheckIns);

//   // keep ref in sync
//   useEffect(() => { studentCheckInsRef.current = studentCheckIns; }, [studentCheckIns]);

//   // derived route/station
//   const currentRoute = ROUTES_TODAY[currentRouteIndex] || null;
//   const stations = currentRoute?.stations || [];
//   const currentStation = (stations && currentStationIndex >= 0 && currentStationIndex < stations.length) ? stations[currentStationIndex] : null;
//   const currentStudents = useMemo(() => (currentStation ? (STUDENTS_BY_STATION[currentStation.id] || []) : []), [currentStation]);

//   const allStudentsForContact = useMemo(() => Object.values(STUDENTS_DATABASE), []);

//   // isCheckingIn and isMoving as requested
//   const isCheckingIn = stationTimer > 0;
//   const isMoving = useMemo(() => !!isTracking && !isStationActive && !isCheckingIn, [isTracking, isStationActive, isCheckingIn]);

//   // ---------------- Actions ----------------
//   const checkInStudent = useCallback((studentId) => {
//     setStudentCheckIns(prev => {
//       if (prev[studentId] === 'present') return prev;
//       return { ...prev, [studentId]: 'present' };
//     });
//   }, []);

//   const forceDepart = useCallback(() => {
//     if (!currentStation) return;
//     const students = STUDENTS_BY_STATION[currentStation.id] || [];

//     // mark remaining as absent
//     setStudentCheckIns(prev => {
//       const copy = { ...prev };
//       students.forEach(s => {
//         if (!copy[s.id]) copy[s.id] = 'absent';
//       });
//       return copy;
//     });

//     clearInterval(timerRef.current);
//     clearTimeout(delayRef.current);
//     setIsStationActive(false);
//     setStationTimer(0);
//     setCurrentStationIndex(i => i + 1);
//   }, [currentStation]);

//   const moveToNextRoute = useCallback(() => {
//     if (currentRouteIndex < ROUTES_TODAY.length - 1) {
//       setCurrentRouteIndex(i => i + 1);
//       setCurrentStationIndex(0);
//       setStudentCheckIns({});
//       setIsStationActive(false);
//       setStationTimer(0);
//     } else {
//       alert('HOÀN THÀNH TẤT CẢ CÁC CHUYẾN ĐI HÔM NAY!');
//       setIsTracking(false);
//       setCurrentRouteIndex(0);
//       setCurrentStationIndex(-1);
//       setStudentCheckIns({});
//     }
//   }, [currentRouteIndex]);

//   const startTracking = useCallback(() => {
//     clearInterval(timerRef.current);
//     clearTimeout(delayRef.current);

//     setIsTracking(true);
//     setCurrentRouteIndex(0);
//     setCurrentStationIndex(0);
//     setStudentCheckIns({});
//     setStationTimer(0);
//     setIsStationActive(false);
//     setLastStoppedState(null);
//     localStorage.removeItem('lastStoppedBusState');
//   }, []);

//   const stopTracking = useCallback(() => {
//     // persist stopped state
//     clearInterval(timerRef.current);
//     clearTimeout(delayRef.current);

//     const now = new Date().toLocaleString('vi-VN');
//     const pickedUp = Object.values(studentCheckIns).filter(v => v === 'present').length;

//     const stoppedData = {
//       routeIndex: currentRouteIndex,
//       routeName: currentRoute?.name || 'Chưa xuất phát',
//       stationIndex: currentStationIndex,
//       stationName: currentStation?.name || 'Chưa xuất phát',
//       position: currentStation?.position || null,
//       time: now,
//       pickedUpStudents: pickedUp,
//       checkInData: studentCheckIns,
//     };

//     setLastStoppedState(stoppedData);
//     try { localStorage.setItem('lastStoppedBusState', JSON.stringify(stoppedData)); } catch (e) {console.error(e);}

//     setIsTracking(false);
//     setCurrentRouteIndex(0);
//     setCurrentStationIndex(-1);
//     setStationTimer(0);
//     setIsStationActive(false);
//   }, [currentRouteIndex, currentRoute, currentStationIndex, currentStation, studentCheckIns]);

//   const resumeFromLastStopped = useCallback(() => {
//     try {
//       const saved = localStorage.getItem('lastStoppedBusState');
//       if (!saved) return false;
//       const data = JSON.parse(saved);
//       setLastStoppedState(data);
//       if (data.checkInData) setStudentCheckIns(data.checkInData);
//       if (typeof data.stationIndex === 'number') setCurrentStationIndex(data.stationIndex);
//       setIsTracking(true);
//       return true;
//     } catch (e) {console.error(e);
//       return false;
//     }
//   }, []);

//   // ---------------- Core auto logic: arrive -> check-in -> depart ----------------
//   useEffect(() => {
//     // cleanup previous timers
//     clearInterval(timerRef.current);
//     clearTimeout(delayRef.current);

//     if (!isTracking || !currentRoute) {
//       setIsStationActive(false);
//       setStationTimer(0);
//       return;
//     }

//     // if beyond stations -> move to next route
//     if (currentStationIndex >= stations.length) {
//       moveToNextRoute();
//       return;
//     }

//     // arrive at new station => stop vehicle for check-in sequence
//     setIsStationActive(true);
//     setStationTimer(0);

//     // if final station: short pause then next route
//     if (currentStationIndex === stations.length - 1) {
//       delayRef.current = setTimeout(() => {
//         setIsStationActive(false);
//         moveToNextRoute();
//       }, 2000);
//       return;
//     }

//     // start check-in after small pre-arrival delay
//     delayRef.current = setTimeout(() => {
//       // initialize missing keys for current station students (so UI shows them as unknown until present/absent)
//       const students = STUDENTS_BY_STATION[currentStation?.id] || [];
//       setStudentCheckIns(prev => {
//         const copy = { ...prev };
//         students.forEach(s => { if (!(s.id in copy)) copy[s.id] = undefined; });
//         return copy;
//       });

//       setStationTimer(CHECKIN_SECONDS);

//       // start countdown
//       timerRef.current = setInterval(() => {
//         setStationTimer(prev => {
//           // prev is the current timer value (state)
//           if (prev <= 1) {
//             // timer ended: mark remaining undefined students as absent
//             const studentsNow = STUDENTS_BY_STATION[currentStation?.id] || [];
//             studentsNow.forEach(s => {
//               // use functional update to avoid stale closure
//               setStudentCheckIns(prevMap => {
//                 if (prevMap[s.id]) return prevMap; // already present/absent
//                 return { ...prevMap, [s.id]: 'absent' };
//               });
//             });

//             clearInterval(timerRef.current);
//             setIsStationActive(false);
//             setCurrentStationIndex(i => i + 1);
//             return 0;
//           }

//           // check if all students for this station are present => depart early
//           const studentsForThis = STUDENTS_BY_STATION[currentStation?.id] || [];
//           const presentCount = studentsForThis.filter(s => studentCheckInsRef.current[s.id] === 'present').length;

//           if (studentsForThis.length > 0 && presentCount === studentsForThis.length) {
//             // all present: stop timer and depart after small delay
//             clearInterval(timerRef.current);
//             setTimeout(() => {
//               setIsStationActive(false);
//               setCurrentStationIndex(i => i + 1);
//             }, AFTER_ALL_CHECKED_DELAY_MS);
//             return 0;
//           }

//           return prev - 1;
//         });
//       }, 1000);
//     }, PRE_ARRIVAL_DELAY_MS);

//     // cleanup when effect deps change or unmount
//     return () => {
//       clearInterval(timerRef.current);
//       clearTimeout(delayRef.current);
//     };
//     // deps: when station index, tracking, route, students or checkins change, reevaluate
//   }, [currentStationIndex, isTracking, currentRoute, currentStation, stations.length, moveToNextRoute]);

//   // cleanup on unmount
//   useEffect(() => {
//     return () => {
//       clearInterval(timerRef.current);
//       clearTimeout(delayRef.current);
//     };
//   }, []);

//   // ---------------- Expose context ----------------
//   return (
//     <RouteTrackingContext.Provider value={{
//       // status
//       isTracking,
//       isCheckingIn,
//       isMoving,
//       currentRouteIndex,
//       currentRoute,
//       routesToday: ROUTES_TODAY,
//       currentStationIndex,
//       currentStation,
//       stations,
//       currentStudents,
//       studentCheckIns,
//       stationTimer,
//       isStationActive,
//       lastStoppedState,
//       allStudentsForContact,

//       // actions
//       startTracking,
//       stopTracking,
//       resumeFromLastStopped,
//       checkInStudent,
//       forceDepart,
//       moveToNextRoute,
//     }}>
//       {children}
//     </RouteTrackingContext.Provider>
//   );
// };

// export default RouteTrackingContext;
/* src/context/RouteTrackingContext.jsx */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

const RouteTrackingContext = createContext();

export const useRouteTracking = () => {
  const context = useContext(RouteTrackingContext);
  if (!context) throw new Error('useRouteTracking must be used within RouteTrackingProvider');
  return context;
};

// -------------------- Mock data --------------------
const STUDENTS_DATABASE = {
  hs1: { 
    id: 'hs1', 
    name: 'Nguyễn Văn An', 
    class: '6A1', 
    stop: 'st1', 
    parentName: 'Cô Lan', 
    parentPhone: '0901234567', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An' 
  },
  hs2: { 
    id: 'hs2', 
    name: 'Trần Thị Bé', 
    class: '6A2', 
    stop: 'st1', 
    parentName: 'Anh Hùng', 
    parentPhone: '0902345678', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Be' 
  },
  hs3: { 
    id: 'hs3', 
    name: 'Lê Minh Cường', 
    class: '7A1', 
    stop: 'st1', 
    parentName: 'Cô Mai', 
    parentPhone: '0903456789', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong' 
  },
  hs4: { 
    id: 'hs4', 
    name: 'Phạm Ngọc Dũng', 
    class: '8A3', 
    stop: 'st1', 
    parentName: 'Chú Tuấn', 
    parentPhone: '0904567890', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dung' 
  },
  hs5: { 
    id: 'hs5', 
    name: 'Hoàng Thị Em', 
    class: '9A1', 
    stop: 'st2', 
    parentName: 'Chị Hoa', 
    parentPhone: '0905678901', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Em' 
  },
  hs6: { 
    id: 'hs6', 
    name: 'Vũ Văn Bình', 
    class: '7A2', 
    stop: 'st2', 
    parentName: 'Anh Nam', 
    parentPhone: '0906789012', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh' 
  },
  hs7: { 
    id: 'hs7', 
    name: 'Đỗ Thị Hương', 
    class: '8A1', 
    stop: 'st2', 
    parentName: 'Cô Ngọc', 
    parentPhone: '0907890123', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huong' 
  },
  hs8: { 
    id: 'hs8', 
    name: 'Ngô Minh Khang', 
    class: '9A2', 
    stop: 'st3', 
    parentName: 'Chú Long', 
    parentPhone: '0908901234', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khang' 
  },
  hs9: { 
    id: 'hs9', 
    name: 'Bùi Thị Lan', 
    class: '6A3', 
    stop: 'st3', 
    parentName: 'Cô Thảo', 
    parentPhone: '0909012345', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lan' 
  },
};

const ROUTES_TODAY = [
  {
    id: 'route1',
    name: 'Tuyến 01 - Sáng',
    time: '06:30 - 07:30',
    totalStudents: 28,
    stations: [
      { id: 'st1', name: 'Trạm A - Nguyễn Trãi', position: [10.7628, 106.6602], time: '06:35' },
      { id: 'st2', name: 'Trạm B - Lê Văn Sỹ', position: [10.7640, 106.6670], time: '06:42' },
      { id: 'st3', name: 'Trạm C - CMT8', position: [10.7715, 106.6780], time: '06:50' },
      { id: 'st4', name: 'THPT Lê Quý Đôn', position: [10.7800, 106.6950], time: '07:05' },
    ],
  },
  {
    id: 'route2',
    name: 'Tuyến 02 - Chiều',
    time: '16:00 - 17:00',
    totalStudents: 25,
    stations: [
      { id: 'st5', name: 'THPT Lê Quý Đôn', position: [10.7800, 106.6950], time: '16:00' },
      { id: 'st6', name: 'Trạm D - Nguyễn Thị Minh Khai', position: [10.7680, 106.6850], time: '16:20' },
      { id: 'st7', name: 'Trạm E - Võ Thị Sáu', position: [10.7750, 106.6900], time: '16:35' },
    ],
  },
];

const createStudentsByRoute = () => {
  const studentsByStation = {};
  ROUTES_TODAY.forEach(route => {
    route.stations.forEach(station => {
      studentsByStation[station.id] = [];
    });
  });

  const route1Students = [
    STUDENTS_DATABASE.hs1, STUDENTS_DATABASE.hs2, STUDENTS_DATABASE.hs3, STUDENTS_DATABASE.hs4,
    STUDENTS_DATABASE.hs5, STUDENTS_DATABASE.hs6, STUDENTS_DATABASE.hs7,
    STUDENTS_DATABASE.hs8, STUDENTS_DATABASE.hs9,
  ];

  studentsByStation['st1'] = route1Students.slice(0, 4);
  studentsByStation['st2'] = route1Students.slice(4, 7);
  studentsByStation['st3'] = route1Students.slice(7, 9);
  studentsByStation['st4'] = [];

  studentsByStation['st5'] = [];
  studentsByStation['st6'] = route1Students.slice(0, 5);
  studentsByStation['st7'] = route1Students.slice(5, 9);

  return studentsByStation;
};

const STUDENTS_BY_STATION = createStudentsByRoute();

// config
const PRE_ARRIVAL_DELAY_MS = 3000;
const CHECKIN_SECONDS = 60;
const AFTER_ALL_CHECKED_DELAY_MS = 3000;

// -------------------- Provider --------------------
export const RouteTrackingProvider = ({ children }) => {
  // trip state
  const [isTracking, setIsTracking] = useState(false);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [currentStationIndex, setCurrentStationIndex] = useState(-1);
  const [studentCheckIns, setStudentCheckIns] = useState({}); // { studentId: 'present'|'absent'|undefined }
  const [stationTimer, setStationTimer] = useState(0);
  const [isStationActive, setIsStationActive] = useState(false); // xe đang dừng ở trạm (trước khi depart)
  const [lastStoppedState, setLastStoppedState] = useState(() => {
    try {
      const s = localStorage.getItem('lastStoppedBusState');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  // refs for timers and stable read
  const timerRef = useRef(null);
  const delayRef = useRef(null);
  const studentCheckInsRef = useRef(studentCheckIns);

  // sync ref
  useEffect(() => { 
    studentCheckInsRef.current = studentCheckIns; 
  }, [studentCheckIns]);

  // derived
  const currentRoute = ROUTES_TODAY[currentRouteIndex] || null;
  const stations = currentRoute?.stations || [];
  const currentStation = (stations && currentStationIndex >= 0 && currentStationIndex < stations.length) 
    ? stations[currentStationIndex] 
    : null;
  const currentStudents = useMemo(() => 
    (currentStation ? (STUDENTS_BY_STATION[currentStation.id] || []) : []), 
    [currentStation]
  );
  const allStudentsForContact = useMemo(() => Object.values(STUDENTS_DATABASE), []);

  // derived flags
  const isCheckingIn = stationTimer > 0;
  const isMoving = useMemo(() => 
    !!isTracking && !isStationActive && !isCheckingIn, 
    [isTracking, isStationActive, isCheckingIn]
  );

  // ---------------- Actions ----------------
  const checkInStudent = useCallback((studentId) => {
    setStudentCheckIns(prev => {
      if (prev[studentId] === 'present') return prev;
      return { ...prev, [studentId]: 'present' };
    });
  }, []);

  const forceDepart = useCallback(() => {
    if (!currentStation) return;
    const students = STUDENTS_BY_STATION[currentStation.id] || [];

    // mark remaining as absent
    setStudentCheckIns(prev => {
      const copy = { ...prev };
      students.forEach(s => {
        if (!copy[s.id]) copy[s.id] = 'absent';
      });
      return copy;
    });

    // clear timers
    if (timerRef.current) { 
      clearInterval(timerRef.current); 
      timerRef.current = null; 
    }
    if (delayRef.current) { 
      clearTimeout(delayRef.current); 
      delayRef.current = null; 
    }

    setIsStationActive(false);
    setStationTimer(0);
    setCurrentStationIndex(i => i + 1);
  }, [currentStation]);

  const moveToNextRoute = useCallback(() => {
    if (currentRouteIndex < ROUTES_TODAY.length - 1) {
      setCurrentRouteIndex(i => i + 1);
      setCurrentStationIndex(0);
      setStudentCheckIns({});
      setIsStationActive(false);
      setStationTimer(0);
    } else {
      alert('HOÀN THÀNH TẤT CẢ CÁC CHUYẾN ĐI HÔM NAY!');
      setIsTracking(false);
      setCurrentRouteIndex(0);
      setCurrentStationIndex(-1);
      setStudentCheckIns({});
    }
  }, [currentRouteIndex]);

  const startTracking = useCallback(() => {
    if (timerRef.current) { 
      clearInterval(timerRef.current); 
      timerRef.current = null; 
    }
    if (delayRef.current) { 
      clearTimeout(delayRef.current); 
      delayRef.current = null; 
    }

    setIsTracking(true);
    setCurrentRouteIndex(0);
    setCurrentStationIndex(0);
    setStudentCheckIns({});
    setStationTimer(0);
    setIsStationActive(false);
    setLastStoppedState(null);
    
    try { 
      localStorage.removeItem('lastStoppedBusState'); 
    } catch (e){console.error(e);}
  }, []);

  const stopTracking = useCallback(() => {
    if (timerRef.current) { 
      clearInterval(timerRef.current); 
      timerRef.current = null; 
    }
    if (delayRef.current) { 
      clearTimeout(delayRef.current); 
      delayRef.current = null; 
    }

    const now = new Date().toLocaleString('vi-VN');
    const pickedUp = Object.values(studentCheckIns).filter(v => v === 'present').length;

    const stoppedData = {
      routeIndex: currentRouteIndex,
      routeName: currentRoute?.name || 'Chưa xuất phát',
      stationIndex: currentStationIndex,
      stationName: currentStation?.name || 'Chưa xuất phát',
      position: currentStation?.position || null,
      time: now,
      pickedUpStudents: pickedUp,
      checkInData: studentCheckIns,
    };

    setLastStoppedState(stoppedData);
    try { 
      localStorage.setItem('lastStoppedBusState', JSON.stringify(stoppedData)); 
    } catch (e) { 
      console.error(e); 
    }

    setIsTracking(false);
    setCurrentRouteIndex(0);
    setCurrentStationIndex(-1);
    setStationTimer(0);
    setIsStationActive(false);
  }, [currentRouteIndex, currentRoute, currentStationIndex, currentStation, studentCheckIns]);

  const resumeFromLastStopped = useCallback(() => {
    try {
      const saved = localStorage.getItem('lastStoppedBusState');
      if (!saved) return false;
      const data = JSON.parse(saved);
      setLastStoppedState(data);
      if (data.checkInData) setStudentCheckIns(data.checkInData);
      if (typeof data.stationIndex === 'number') setCurrentStationIndex(data.stationIndex);
      setIsTracking(true);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  // ---------------- Core auto logic: arrive -> check-in -> depart ----------------
  useEffect(() => {
    // clear any previous timers
    if (timerRef.current) { 
      clearInterval(timerRef.current); 
      timerRef.current = null; 
    }
    if (delayRef.current) { 
      clearTimeout(delayRef.current); 
      delayRef.current = null; 
    }

    if (!isTracking || !currentRoute) {
      setIsStationActive(false);
      setStationTimer(0);
      return;
    }

    // if beyond stations -> move to next route
    if (currentStationIndex >= stations.length) {
      moveToNextRoute();
      return;
    }

    // ARRIVE: stop vehicle for check-in sequence
    setIsStationActive(true);
    setStationTimer(0);

    // if final station: short pause then next route
    if (currentStationIndex === stations.length - 1) {
      delayRef.current = setTimeout(() => {
        setIsStationActive(false);
        moveToNextRoute();
      }, 2000);
      return;
    }

    // start check-in after pre-arrival delay
    delayRef.current = setTimeout(() => {
      // ensure studentCheckIns has keys for current station students (undefined if not set)
      const students = STUDENTS_BY_STATION[currentStation?.id] || [];
      setStudentCheckIns(prev => {
        const copy = { ...prev };
        students.forEach(s => { 
          if (!(s.id in copy)) copy[s.id] = undefined; 
        });
        return copy;
      });

      // init countdown
      setStationTimer(CHECKIN_SECONDS);

      // start timer
      timerRef.current = setInterval(() => {
        setStationTimer(prev => {
          // timer expired
          if (prev <= 1) {
            const studentsNow = STUDENTS_BY_STATION[currentStation?.id] || [];
            studentsNow.forEach(s => {
              setStudentCheckIns(prevMap => {
                if (prevMap[s.id]) return prevMap;
                return { ...prevMap, [s.id]: 'absent' };
              });
            });

            if (timerRef.current) { 
              clearInterval(timerRef.current); 
              timerRef.current = null; 
            }

            setIsStationActive(false);
            setCurrentStationIndex(i => i + 1);
            return 0;
          }

          // early finish: if all present -> depart early
          const studentsForThis = STUDENTS_BY_STATION[currentStation?.id] || [];
          const presentCount = studentsForThis.filter(
            s => !!studentCheckInsRef.current[s.id] && studentCheckInsRef.current[s.id] === 'present'
          ).length;

          if (studentsForThis.length > 0 && presentCount === studentsForThis.length) {
            if (timerRef.current) { 
              clearInterval(timerRef.current); 
              timerRef.current = null; 
            }

            setTimeout(() => {
              setIsStationActive(false);
              setCurrentStationIndex(i => i + 1);
            }, AFTER_ALL_CHECKED_DELAY_MS);

            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }, PRE_ARRIVAL_DELAY_MS);

    // cleanup when dep changes
    return () => {
      if (timerRef.current) { 
        clearInterval(timerRef.current); 
        timerRef.current = null; 
      }
      if (delayRef.current) { 
        clearTimeout(delayRef.current); 
        delayRef.current = null; 
      }
    };
  }, [currentStationIndex, isTracking, currentRoute, currentStation, stations.length, moveToNextRoute]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, []);

  // ---------------- Expose context ----------------
  return (
    <RouteTrackingContext.Provider 
      value={{
        // status
        isTracking,
        isCheckingIn,
        isMoving,
        currentRouteIndex,
        currentRoute,
        routesToday: ROUTES_TODAY,
        currentStationIndex,
        currentStation,
        stations,
        currentStudents,
        studentCheckIns,
        stationTimer,
        isStationActive,
        lastStoppedState,
        allStudentsForContact,

        // actions
        startTracking,
        stopTracking,
        resumeFromLastStopped,
        checkInStudent,
        forceDepart,
        moveToNextRoute,
      }}
    >
      {children}
    </RouteTrackingContext.Provider>
  );
};

export default RouteTrackingContext;