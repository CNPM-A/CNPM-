// // src/context/RouteTrackingContext.jsx
// import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

// const RouteTrackingContext = createContext();

// export const useRouteTracking = () => {
//   const context = useContext(RouteTrackingContext);
//   if (!context) {
//     throw new Error('useRouteTracking must be used within RouteTrackingProvider');
//   }
//   return context;
// };

// // === MOCK DATA HOÀN CHỈNH – ĐÃ CẬP NHẬT ĐỂ DÙNG CHO DANH BẠ + CHAT ===
// const ROUTE_STATIONS = [
//   { id: 'st1', name: 'Trạm A - Nguyễn Trãi', position: [10.7628, 106.6602], time: '06:35' },
//   { id: 'st2', name: 'Trạm B - Lê Văn Sỹ', position: [10.7640, 106.6670], time: '06:42' },
//   { id: 'st3', name: 'Trạm C - CMT8', position: [10.7715, 106.6780], time: '06:50' },
//   { id: 'st4', name: 'THPT Lê Quý Đôn', position: [10.7800, 106.6950], time: '07:05' },
// ];

// // DỮ LIỆU HỌC SINH ĐẦY ĐỦ CHO DANH BẠ + CHAT
// const STUDENTS_DATABASE = {
//   hs1: { id: 'hs1', name: 'Nguyễn Văn An', class: '6A1', stop: 'st1', parentName: 'Cô Lan', parentPhone: '0901234567' },
//   hs2: { id: 'hs2', name: 'Trần Thị Bé', class: '6A2', stop: 'st1', parentName: 'Anh Hùng', parentPhone: '0902345678' },
//   hs3: { id: 'hs3', name: 'Lê Minh Cường', class: '7A1', stop: 'st1', parentName: 'Cô Mai', parentPhone: '0903456789' },
//   hs4: { id: 'hs4', name: 'Phạm Ngọc Dũng', class: '8A3', stop: 'st1', parentName: 'Chú Tuấn', parentPhone: '0904567890' },
//   hs5: { id: 'hs5', name: 'Hoàng Thị Em', class: '9A1', stop: 'st2', parentName: 'Chị Hoa', parentPhone: '0905678901' },
//   hs6: { id: 'hs6', name: 'Vũ Văn Bình', class: '7A2', stop: 'st2', parentName: 'Anh Nam', parentPhone: '0906789012' },
//   hs7: { id: 'hs7', name: 'Đỗ Thị Hương', class: '8A1', stop: 'st2', parentName: 'Cô Ngọc', parentPhone: '0907890123' },
//   hs8: { id: 'hs8', name: 'Ngô Minh Khang', class: '9A2', stop: 'st3', parentName: 'Chú Long', parentPhone: '0908901234' },
//   hs9: { id: 'hs9', name: 'Bùi Thị Lan', class: '6A3', stop: 'st3', parentName: 'Cô Thảo', parentPhone: '0909012345' },
// };

// // Danh sách học sinh theo trạm (dùng cho check-in)
// const STUDENTS_BY_STATION = {
//   st1: Object.values(STUDENTS_DATABASE).filter(s => s.stop === 'st1'),
//   st2: Object.values(STUDENTS_DATABASE).filter(s => s.stop === 'st2'),
//   st3: Object.values(STUDENTS_DATABASE).filter(s => s.stop === 'st3'),
//   st4: [],
// };

// // CONFIG
// const PRE_ARRIVAL_DELAY_MS = 3000;
// const CHECKIN_SECONDS = 60;
// const AFTER_ALL_CHECKED_DELAY_MS = 3000;

// export const RouteTrackingProvider = ({ children }) => {
//   const [isTracking, setIsTracking] = useState(false);
//   const [currentStationIndex, setCurrentStationIndex] = useState(-1);
//   const [studentCheckIns, setStudentCheckIns] = useState({});
//   const [stationTimer, setStationTimer] = useState(0);
//   const [isStationActive, setIsStationActive] = useState(false);
//   const [lastStoppedState, setLastStoppedState] = useState(() => {
//     const saved = localStorage.getItem('lastStoppedBusState');
//     return saved ? JSON.parse(saved) : null;
//   });

//   const timerRef = useRef(null);
//   const delayRef = useRef(null);
//   const studentCheckInsRef = useRef({});
//   const isTrackingRef = useRef(false);

//   useEffect(() => {
//     studentCheckInsRef.current = studentCheckIns;
//     isTrackingRef.current = isTracking;
//   }, [studentCheckIns, isTracking]);

//   // === BẮT ĐẦU CHECK-IN CHO TRẠM ===
//   const beginCheckInForStation = useCallback(() => {
//     const currentStation = ROUTE_STATIONS[currentStationIndex];
//     if (!currentStation) return;

//     const students = STUDENTS_BY_STATION[currentStation.id] || [];

//     setStudentCheckIns(prev => {
//       const copy = { ...prev };
//       students.forEach(s => { copy[s.id] = undefined; });
//       return copy;
//     });

//     if (timerRef.current) clearInterval(timerRef.current);
//     if (delayRef.current) clearTimeout(delayRef.current);

//     delayRef.current = setTimeout(() => {
//       if (!isTrackingRef.current) return;

//       setStationTimer(CHECKIN_SECONDS);

//       timerRef.current = setInterval(() => {
//         setStationTimer(prev => {
//           if (prev <= 1) {
//             students.forEach(s => {
//               if (studentCheckInsRef.current[s.id] === undefined) {
//                 setStudentCheckIns(p => ({ ...p, [s.id]: 'absent' }));
//               }
//             });
//             clearInterval(timerRef.current);
//             setIsStationActive(false);
//             setCurrentStationIndex(i => i + 1);
//             return 0;
//           }

//           const checked = students.filter(s => studentCheckInsRef.current[s.id] === 'present').length;
//           if (students.length > 0 && checked === students.length) {
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
//   }, [currentStationIndex]);

//   // === KHI ĐẾN TRẠM MỚI ===
//   useEffect(() => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     if (delayRef.current) clearTimeout(delayRef.current);

//     if (!isTracking) {
//       setIsStationActive(false);
//       setStationTimer(0);
//       return;
//     }

//     if (currentStationIndex < 0 || currentStationIndex >= ROUTE_STATIONS.length) {
//       setIsStationActive(false);
//       setStationTimer(0);
//       return;
//     }

//     setIsStationActive(true);
//     setStationTimer(0);

//     if (currentStationIndex === ROUTE_STATIONS.length - 1) {
//       setTimeout(() => {
//         alert('HOÀN THÀNH CHUYẾN ĐI!\nĐÃ ĐẾN TRƯỜNG AN TOÀN!');
//         setIsStationActive(false);
//       }, 2000);
//       return;
//     }

//     beginCheckInForStation();
//   }, [currentStationIndex, isTracking, beginCheckInForStation]);

//   // === CHECK-IN HỌC SINH ===
//   const checkInStudent = useCallback((studentId) => {
//     setStudentCheckIns(prev => ({ ...prev, [studentId]: 'present' }));
//   }, []);

//   // === RỜI TRẠM THỦ CÔNG ===
//   const forceDepart = useCallback(() => {
//     const currentStation = ROUTE_STATIONS[currentStationIndex];
//     if (!currentStation) return;

//     const students = STUDENTS_BY_STATION[currentStation.id] || [];
//     setStudentCheckIns(prev => {
//       const updated = { ...prev };
//       students.forEach(s => {
//         if (!updated[s.id]) updated[s.id] = 'absent';
//       });
//       return updated;
//     });

//     if (timerRef.current) clearInterval(timerRef.current);
//     if (delayRef.current) clearTimeout(delayRef.current);

//     setIsStationActive(false);
//     setStationTimer(0);
//     setCurrentStationIndex(i => i + 1);
//   }, [currentStationIndex]);

//   // === BẮT ĐẦU / DỪNG CHUYẾN ===
//   const startTracking = useCallback(() => {
//     setIsTracking(true);
//     setCurrentStationIndex(0);
//     setStudentCheckIns({});
//     setStationTimer(0);
//     setIsStationActive(false);
//     setLastStoppedState(null);
//     localStorage.removeItem('lastStoppedBusState');
//   }, []);

//   const stopTracking = useCallback(() => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     if (delayRef.current) clearTimeout(delayRef.current);

//     const currentStation = currentStationIndex >= 0 ? ROUTE_STATIONS[currentStationIndex] : null;
//     const now = new Date().toLocaleString('vi-VN');
//     const pickedUp = Object.values(studentCheckIns).filter(v => v === 'present').length;

//     const stoppedData = {
//       stationIndex: currentStationIndex,
//       stationName: currentStation?.name || 'Chưa xuất phát',
//       position: currentStation?.position || null,
//       time: now,
//       pickedUpStudents: pickedUp,
//       checkInData: studentCheckIns,
//     };

//     setLastStoppedState(stoppedData);
//     localStorage.setItem('lastStoppedBusState', JSON.stringify(stoppedData));

//     setIsTracking(false);
//     setCurrentStationIndex(-1);
//     setStationTimer(0);
//     setIsStationActive(false);
//   }, [currentStationIndex, studentCheckIns]);

//   // === TIẾP TỤC TỪ CHỖ DỪNG ===
//   const resumeFromLastStopped = useCallback(() => {
//     const saved = localStorage.getItem('lastStoppedBusState');
//     if (!saved) return false;

//     try {
//       const data = JSON.parse(saved);
//       setLastStoppedState(data);
//       setStudentCheckIns(data.checkInData || {});
//       setCurrentStationIndex(data.stationIndex >= 0 ? data.stationIndex : 0);
//       setIsTracking(true);
//       return true;
//     } catch {
//       return false;
//     }
//   }, []);

//   // === DỮ LIỆU XUẤT RA ===
//   const currentStation = currentStationIndex >= 0 && currentStationIndex < ROUTE_STATIONS.length
//     ? ROUTE_STATIONS[currentStationIndex]
//     : null;

//   const currentStudents = currentStation
//     ? (STUDENTS_BY_STATION[currentStation.id] || [])
//     : [];

//   // === DANH BẠ HỌC SINH – DÙNG CHO DriverContacts.jsx ===
//   const allStudentsForContact = Object.values(STUDENTS_DATABASE);

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (delayRef.current) clearTimeout(delayRef.current);
//     };
//   }, []);

//   return (
//     <RouteTrackingContext.Provider value={{
//       // Trạng thái chuyến đi
//       isTracking,
//       currentStationIndex,
//       currentStation,
//       stations: ROUTE_STATIONS,
//       currentStudents,
//       studentCheckIns,
//       stationTimer,
//       isStationActive,
//       lastStoppedState,

//       // Danh bạ học sinh (dùng cho DriverContacts)
//       allStudentsForContact,

//       // Actions
//       startTracking,
//       stopTracking,
//       resumeFromLastStopped,
//       checkInStudent,
//       forceDepart,
//     }}>
//       {children}
//     </RouteTrackingContext.Provider>
//   );
// };

// export default RouteTrackingContext;
// src/context/RouteTrackingContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const RouteTrackingContext = createContext();

export const useRouteTracking = () => {
    const context = useContext(RouteTrackingContext);
    if (!context) {
        throw new Error('useRouteTracking must be used within RouteTrackingProvider');
    }
    return context;
};

// === DỮ LIỆU TRẠM & HỌC SINH ===
const ROUTE_STATIONS = [
    { id: 'st1', name: 'Trạm A - Nguyễn Trãi', position: [10.7628, 106.6602], time: '06:35' },
    { id: 'st2', name: 'Trạm B - Lê Văn Sỹ', position: [10.7640, 106.6670], time: '06:42' },
    { id: 'st3', name: 'Trạm C - CMT8', position: [10.7715, 106.6780], time: '06:50' },
    { id: 'st4', name: 'THPT Lê Quý Đôn', position: [10.7800, 106.6950], time: '07:05' },
];

const STUDENTS_DATABASE = {
    hs1: { id: 'hs1', name: 'Nguyễn Văn An', class: '6A1', stop: 'st1', parentName: 'Cô Lan', parentPhone: '0901234567', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An' },
    hs2: { id: 'hs2', name: 'Trần Thị Bé', class: '6A2', stop: 'st1', parentName: 'Anh Hùng', parentPhone: '0902345678', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Be' },
    hs3: { id: 'hs3', name: 'Lê Minh Cường', class: '7A1', stop: 'st1', parentName: 'Cô Mai', parentPhone: '0903456789', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong' },
    hs4: { id: 'hs4', name: 'Phạm Ngọc Dũng', class: '8A3', stop: 'st1', parentName: 'Chú Tuấn', parentPhone: '0904567890', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dung' },
    hs5: { id: 'hs5', name: 'Hoàng Thị Em', class: '9A1', stop: 'st2', parentName: 'Chị Hoa', parentPhone: '0905678901', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Em' },
    hs6: { id: 'hs6', name: 'Vũ Văn Bình', class: '7A2', stop: 'st2', parentName: 'Anh Nam', parentPhone: '0906789012', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh' },
    hs7: { id: 'hs7', name: 'Đỗ Thị Hương', class: '8A1', stop: 'st2', parentName: 'Cô Ngọc', parentPhone: '0907890123', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huong' },
    hs8: { id: 'hs8', name: 'Ngô Minh Khang', class: '9A2', stop: 'st3', parentName: 'Chú Long', parentPhone: '0908901234', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khang' },
    hs9: { id: 'hs9', name: 'Bùi Thị Lan', class: '6A3', stop: 'st3', parentName: 'Cô Thảo', parentPhone: '0909012345', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lan' },
};

const STUDENTS_BY_STATION = {
    st1: Object.values(STUDENTS_DATABASE).filter(s => s.stop === 'st1'),
    st2: Object.values(STUDENTS_DATABASE).filter(s => s.stop === 'st2'),
    st3: Object.values(STUDENTS_DATABASE).filter(s => s.stop === 'st3'),
    st4: [],
};

const CHECKIN_SECONDS = 60;
const AFTER_ALL_CHECKED_DELAY_MS = 3000;

export const RouteTrackingProvider = ({ children }) => {
    const [isTracking, setIsTracking] = useState(false);
    const [currentStationIndex, setCurrentStationIndex] = useState(-1);
    const [studentCheckIns, setStudentCheckIns] = useState({});
    const [stationTimer, setStationTimer] = useState(0);
    const [isStationActive, setIsStationActive] = useState(false);
    const [lastStoppedState, setLastStoppedState] = useState(null);

    const timerRef = useRef(null);
    const delayRef = useRef(null);

    // Dữ liệu hiện tại
    const currentStation = currentStationIndex >= 0 && currentStationIndex < ROUTE_STATIONS.length
        ? ROUTE_STATIONS[currentStationIndex]
        : null;

    const currentStudents = currentStation ? STUDENTS_BY_STATION[currentStation.id] || [] : [];

    const allStudentsForContact = Object.values(STUDENTS_DATABASE);

    // === CHECK-IN HỌC SINH ===
    const checkInStudent = useCallback((studentId) => {
        setStudentCheckIns(prev => ({ ...prev, [studentId]: 'present' }));
    }, []);

    // === RỜI TRẠM THỦ CÔNG ===
    const forceDepart = useCallback(() => {
        if (!currentStation) return;

        const students = STUDENTS_BY_STATION[currentStation.id] || [];
        setStudentCheckIns(prev => {
            const updated = { ...prev };
            students.forEach(s => {
                if (!updated[s.id]) updated[s.id] = 'absent';
            });
            return updated;
        });

        clearInterval(timerRef.current);
        clearTimeout(delayRef.current);
        setIsStationActive(false);
        setStationTimer(0);
        setCurrentStationIndex(i => i + 1);
    }, [currentStation]);

    // === BẮT ĐẦU CHUYẾN ===
    const startTracking = useCallback(() => {
        setIsTracking(true);
        setCurrentStationIndex(0);
        setStudentCheckIns({});
        setStationTimer(0);
        setIsStationActive(false);
        setLastStoppedState(null);
        localStorage.removeItem('lastStoppedBusState');
    }, []);

    // === DỪNG CHUYẾN ===
    const stopTracking = useCallback(() => {
        clearInterval(timerRef.current);
        clearTimeout(delayRef.current);

        const now = new Date().toLocaleString('vi-VN');
        const pickedUp = Object.values(studentCheckIns).filter(v => v === 'present').length;

        const stoppedData = {
            stationIndex: currentStationIndex,
            stationName: currentStation?.name || 'Chưa xuất phát',
            position: currentStation?.position || null,
            time: now,
            pickedUpStudents: pickedUp,
            checkInData: studentCheckIns,
        };

        setLastStoppedState(stoppedData);
        localStorage.setItem('lastStoppedBusState', JSON.stringify(stoppedData));

        setIsTracking(false);
        setCurrentStationIndex(-1);
        setStationTimer(0);
        setIsStationActive(false);
    }, [currentStationIndex, currentStation, studentCheckIns]);

    // === TỰ ĐỘNG CHUYỂN TRẠM KHI ĐẾN NƠI ===
    useEffect(() => {
        if (!isTracking) {
            setIsStationActive(false);
            setStationTimer(0);
            return;
        }

        if (currentStationIndex >= ROUTE_STATIONS.length) {
            alert('HOÀN THÀNH CHUYẾN ĐI!\nĐÃ ĐẾN TRƯỜNG AN TOÀN!');
            stopTracking();
            return;
        }

        // Đến trạm mới → dừng xe
        setIsStationActive(true);
        setStationTimer(0);

        // Nếu là trạm cuối → kết thúc
        if (currentStationIndex === ROUTE_STATIONS.length - 1) {
  setTimeout(() => {
                setIsStationActive(false);
            }, 2000);
            return;
        }

        // Đợi 3s rồi bắt đầu check-in
        delayRef.current = setTimeout(() => {
            setStationTimer(CHECKIN_SECONDS);

            timerRef.current = setInterval(() => {
                setStationTimer(prev => {
                    if (prev <= 1) {
                        // Hết giờ → đánh dấu vắng + chuyển trạm
                        const students = STUDENTS_BY_STATION[currentStation.id] || [];
                        students.forEach(s => {
                            if (!studentCheckIns[s.id]) {
                                setStudentCheckIns(p => ({ ...p, [s.id]: 'absent' }));
                            }
                        });
                        clearInterval(timerRef.current);
                        setIsStationActive(false);
                        setCurrentStationIndex(i => i + 1);
                        return 0;
                    }

                    // Check đủ → chuyển trạm sớm
                    const checked = currentStudents.filter(s => studentCheckIns[s.id] === 'present').length;
                    if (currentStudents.length > 0 && checked === currentStudents.length) {
                        clearInterval(timerRef.current);
                        setTimeout(() => {
                            setIsStationActive(false);
                            setCurrentStationIndex(i => i + 1);
                        }, AFTER_ALL_CHECKED_DELAY_MS);
                        return 0;
                    }

                    return prev - 1;
                });
            }, 1000);
        }, 3000);
    }, [currentStationIndex, isTracking, currentStudents, studentCheckIns]);

    // Cleanup
    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
            clearTimeout(delayRef.current);
        };
    }, []);

    return (
        <RouteTrackingContext.Provider value={{
            isTracking,
            currentStationIndex,
            currentStation,
            stations: ROUTE_STATIONS,
            currentStudents,
            studentCheckIns,
            stationTimer,
            isStationActive,
            lastStoppedState,
            allStudentsForContact,
            startTracking,
            stopTracking,
            checkInStudent,
            forceDepart,
        }}>
            {children}
        </RouteTrackingContext.Provider>
    );
};