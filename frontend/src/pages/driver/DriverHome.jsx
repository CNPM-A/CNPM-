// src/pages/driver/DriverHome.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  MapPin,
  Users,
  Bus,
  PlayCircle,
  PauseCircle,
  Timer,
  UserCheck,
  CheckCircle,
  XCircle,
  Loader2,
  History,
  AlertCircle,
} from 'lucide-react';

import RouteMap from '../../components/maps/RouteMap';
import FaceIDCheckin from '../../components/driver/FaceIDCheckin';
import { useRouteTracking } from '../../context/RouteTrackingContext';
import { getMySchedule, getTrip, transformTripToUIFormat } from '../../services/tripService';
import {
  connectSocket,
  joinTripRoom,
  removeAllTripListeners,
  onStudentsMarkedAbsent,
  onBusApproaching,
  onBusArrived,
  onBusDeparted,
  onAlertNew,
  emitStartTrip,
  emitEndTrip,
} from '../../services/socketService';

export default function DriverHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [apiStations, setApiStations] = useState([]);
  const [tripCompleted, setTripCompleted] = useState(false);
  const [socketAlert, setSocketAlert] = useState(null); // For toast notifications

  const {
    isTracking,
    currentStationIndex,
    currentStation,
    currentRoute,
    stations = [],
    currentStudents = [],
    studentCheckIns = {},
    checkInStudent = () => { },
    markAbsentStudent = () => { },
    stationTimer = 0,
    isStationActive = false,
    startTracking,
    stopTracking,
    lastStoppedState,
    forceDepart,
    // Context sẽ có hàm init nếu bạn dùng (khuyến khích)
    initializeTracking,
  } = useRouteTracking();

  // Tính toán trạng thái - Ưu tiên dùng tripData từ API
  const effectiveStations = apiStations.length > 0 ? apiStations : stations;
  const effectiveTotalStudents = tripData?.totalStudents || 0;
  const effectiveCompletedStudents = tripData?.completedStudents || 0;
  const effectiveCurrentStationIdx = tripData?.nextStationIndex || currentStationIndex;
  const effectiveCurrentStation = effectiveStations[effectiveCurrentStationIdx] || currentStation;

  // Students tại trạm hiện tại từ API
  const studentsAtCurrentStation = useMemo(() => {
    if (!tripData?.students || !effectiveCurrentStation) return [];
    return tripData.students.filter(s => s.stationId === effectiveCurrentStation.id);
  }, [tripData?.students, effectiveCurrentStation]);

  const checkedCount = studentsAtCurrentStation.filter(
    s => s.status === 'PICKED_UP' || s.status === 'DROPPED_OFF'
  ).length;
  const totalAtStation = studentsAtCurrentStation.length;
  const allChecked = totalAtStation > 0 && checkedCount === totalAtStation;
  const isWaitingToStartCheckIn = isStationActive && stationTimer === 0;
  const isCheckingIn = isStationActive && stationTimer > 0;
  const isMoving = isTracking && !isStationActive && !isCheckingIn;

  // Tự động fetch lịch trình và chi tiết trip khi vào trang
  // Có caching trong localStorage để tránh gọi API liên tục
  useEffect(() => {
    const initSchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const routeCacheKey = `driver_route_cache_${today}`; // Cache từ login prefetch
        const tripCacheKey = `driver_trip_${today}`; // Cache cũ
        const cacheExpiry = 30 * 60 * 1000; // 30 phút

        // 1. Kiểm tra cache từ login prefetch (ưu tiên cao nhất)
        const routeCache = localStorage.getItem(routeCacheKey);
        if (routeCache) {
          try {
            const { routeData, activeTrip, timestamp } = JSON.parse(routeCache);
            if (Date.now() - timestamp < cacheExpiry && routeData) {
              console.log('[DriverHome] Using login prefetch cache');

              // Transform routeData sang format cần thiết
              const transformed = {
                id: activeTrip?._id,
                routeName: routeData.routeName,
                routeShape: routeData.shape,
                stations: routeData.stops?.map((stop, idx) => ({
                  id: stop._id,
                  name: stop.name,
                  position: stop.address?.location?.coordinates
                    ? [stop.address.location.coordinates[1], stop.address.location.coordinates[0]] // [lat, lng]
                    : null,
                  order: idx
                })) || [],
                totalStudents: activeTrip?.studentStops?.length || 0,
                distance: routeData.distance,
                duration: routeData.duration
              };

              setTripData(transformed);
              setApiStations(transformed.stations);
              if (initializeTracking && activeTrip) {
                initializeTracking(activeTrip);
              }
              setLoading(false);
              return; // Dùng cache, không gọi API
            }
          } catch (e) {
            console.warn('[DriverHome] Route cache parse failed');
          }
        }

        // 2. Kiểm tra cache cũ (driver_trip)
        const tripCache = localStorage.getItem(tripCacheKey);
        if (tripCache) {
          try {
            const { data, timestamp } = JSON.parse(tripCache);
            if (Date.now() - timestamp < cacheExpiry) {
              console.log('[DriverHome] Using trip cache');
              setTripData(data.tripData);
              setApiStations(data.apiStations || []);
              if (initializeTracking && data.activeTrip) {
                initializeTracking(data.activeTrip);
              }
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn('[DriverHome] Trip cache parse failed');
          }
        }

        // 1. Lấy danh sách trips hôm nay
        const schedule = await getMySchedule();
        console.log('[DriverHome] Schedule loaded:', schedule?.length, 'trips');

        if (!schedule || schedule.length === 0) {
          setError('Không có lịch trình hôm nay.');
          setLoading(false);
          return;
        }

        // 2. Tìm chuyến đang chạy hoặc sắp tới
        const now = new Date();
        const activeTrip = schedule.find(trip =>
          trip.status === 'IN_PROGRESS' ||
          (trip.status === 'NOT_STARTED' && new Date(trip.tripDate) <= now)
        ) || schedule[0];

        if (activeTrip?._id) {
          // 3. Gọi getTrip để lấy full details (routeId.shape, orderedStops, studentStops)
          console.log('[DriverHome] Fetching trip details for:', activeTrip._id);
          const tripDetail = await getTrip(activeTrip._id);

          if (tripDetail) {
            // 4. Transform sang UI format
            const transformed = transformTripToUIFormat(tripDetail);
            setTripData(transformed);

            // 5. Set stations từ API
            const stations = transformed?.stations || [];
            if (stations.length > 0) {
              setApiStations(stations);
              console.log('[DriverHome] API stations loaded:', stations.length);
            }

            // 6. Lưu vào cache
            localStorage.setItem(cacheKey, JSON.stringify({
              data: { tripData: transformed, apiStations: stations, activeTrip },
              timestamp: Date.now()
            }));
            console.log('[DriverHome] Trip data cached');
          }

          // Vẫn gọi initializeTracking nếu context cần
          if (initializeTracking) {
            initializeTracking(activeTrip);
          }
        }
      } catch (err) {
        console.error('[DriverHome] Lỗi tải dữ liệu:', err);
        setError('Không thể tải lịch trình. Đang dùng dữ liệu mẫu.');
      } finally {
        setLoading(false);
      }
    };

    initSchedule();
  }, []);

  // === Socket.IO: Lắng nghe sự kiện real-time ===
  // Lưu ý: joinTripRoom đã được gọi trong RouteTrackingContext
  // Ở đây chỉ đăng ký listeners cho events cụ thể của DriverHome
  const socketListenersSetRef = useRef(false);

  useEffect(() => {
    if (!tripData?.id) return;
    if (socketListenersSetRef.current) return; // Đã set listeners rồi, không set lại

    const socket = connectSocket();
    if (!socket) {
      console.warn('[DriverHome] Không thể kết nối Socket.IO');
      return;
    }

    // Không join room ở đây - RouteTrackingContext đã làm
    console.log('[DriverHome] Đăng ký socket listeners cho trip:', tripData.id);

    // Lắng nghe học sinh bị đánh dấu vắng
    onStudentsMarkedAbsent((data) => {
      console.log('[Socket] trip:students_marked_absent:', data);
      setSocketAlert({ type: 'warning', message: `${data.count || 1} học sinh được đánh dấu vắng` });
      // Refresh tripData
      getTrip(tripData.id).then(detail => {
        if (detail) setTripData(transformTripToUIFormat(detail));
      });
    });

    // Lắng nghe xe sắp tới trạm
    onBusApproaching((data) => {
      console.log('[Socket] bus:approaching_station:', data);
      setSocketAlert({ type: 'info', message: `Sắp tới trạm: ${data.stationName || 'Trạm tiếp theo'}` });
    });

    // Lắng nghe xe đã tới trạm
    onBusArrived((data) => {
      console.log('[Socket] bus:arrived_at_station:', data);
      setSocketAlert({ type: 'success', message: `Đã tới trạm: ${data.stationName || ''}` });
    });

    // Lắng nghe xe rời trạm
    onBusDeparted((data) => {
      console.log('[Socket] bus:departed_from_station:', data);
      setSocketAlert({ type: 'info', message: 'Xe đã rời trạm, đang di chuyển...' });
    });

    // Lắng nghe cảnh báo mới
    onAlertNew((data) => {
      console.log('[Socket] alert:new:', data);
      setSocketAlert({ type: 'error', message: data.message || 'Có cảnh báo mới' });
    });

    socketListenersSetRef.current = true;

    return () => {
      removeAllTripListeners();
      socketListenersSetRef.current = false;
      console.log('[DriverHome] Đã cleanup socket listeners');
    };
  }, [tripData?.id]);

  // Hiển thị loading hoặc lỗi
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-indigo-700">Đang tải lịch trình...</p>
        </div>
      </div>
    );
  }

  if (error && !currentRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Lỗi kết nối</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-8">
      {/* TOAST NOTIFICATION */}
      {socketAlert && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-xl text-white font-medium flex items-center gap-3 animate-pulse ${socketAlert.type === 'success' ? 'bg-green-500' :
            socketAlert.type === 'warning' ? 'bg-yellow-500' :
              socketAlert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          onClick={() => setSocketAlert(null)}
        >
          <AlertCircle className="w-5 h-5" />
          {socketAlert.message}
          <button className="ml-2 text-white/80 hover:text-white" onClick={() => setSocketAlert(null)}>✕</button>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">Chào buổi sáng, Tài xế!</h1>
              <p className="text-indigo-100 text-sm mt-1">
                {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* TRẠM HIỆN TẠI */}
              <div className="bg-white/10 backdrop-blur-lg rounded-lg px-4 py-3 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <div className="font-bold text-sm">TRẠM HIỆN TẠI</div>
                    <div className="text-xs opacity-90">
                      {effectiveCurrentStation ? effectiveCurrentStation.name : 'Chưa xuất phát'}
                    </div>
                  </div>
                </div>
              </div>

              {/* TRẠNG THÁI */}
              <div
                className={`px-4 py-2 rounded-lg text-sm font-bold shadow-lg ${isMoving ? 'bg-emerald-500' :
                  isCheckingIn ? 'bg-yellow-500' :
                    isTracking ? 'bg-indigo-500' : 'bg-gray-500'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Bus className="w-5 h-5" />
                  {isMoving ? 'ĐANG DI CHUYỂN' :
                    isCheckingIn ? 'DỪNG CHECK-IN' :
                      isTracking ? 'TẠM DỪNG' : 'CHƯA BẮT ĐẦU'}
                </div>
              </div>

              {/* NÚT BẮT ĐẦU / TẠM DỪNG */}
              {!tripCompleted && (
                <button
                  onClick={() => {
                    if (isTracking) {
                      stopTracking();
                    } else {
                      if (tripData?.id) emitStartTrip(tripData.id);
                      startTracking();
                    }
                  }}
                  disabled={loading || !tripData?.id}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-lg shadow-2xl transition-all transform hover:scale-105 disabled:opacity-70 ${isTracking
                    ? 'bg-gradient-to-r from-red-500 to-pink-600'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600'
                    }`}
                >
                  {isTracking ? (
                    <>
                      <PauseCircle className="w-8 h-8" />
                      TẠM DỪNG
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-8 h-8" />
                      BẮT ĐẦU
                    </>
                  )}
                </button>
              )}

              {/* NÚT HOÀN THÀNH CHUYẾN */}
              {isTracking && !tripCompleted && (
                <button
                  onClick={() => {
                    if (tripData?.id) {
                      emitEndTrip(tripData.id);
                      stopTracking();
                      setTripCompleted(true);
                      setSocketAlert({ type: 'success', message: 'Đã hoàn thành chuyến đi!' });
                    }
                  }}
                  disabled={!tripData?.id}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-lg shadow-2xl transition-all transform hover:scale-105 bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <CheckCircle className="w-8 h-8" />
                  HOÀN THÀNH
                </button>
              )}

              {/* Hiển thị khi đã hoàn thành */}
              {tripCompleted && (
                <div className="flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-lg bg-green-100 text-green-800 border-2 border-green-500">
                  <CheckCircle className="w-8 h-8" />
                  ĐÃ HOÀN THÀNH
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* THỐNG KÊ NHANH */}
        <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Thống kê chuyến đi</h3>
            <span className="text-sm text-gray-500">{effectiveStations.length} điểm dừng</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
              <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Tổng học sinh</div>
              <div className="text-2xl font-bold text-indigo-700">
                {effectiveTotalStudents}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Đã lên xe</div>
              <div className="text-2xl font-bold text-green-700">{effectiveCompletedStudents}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-100">
              <Timer className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Thời gian dừng</div>
              <div className="text-2xl font-bold text-yellow-700">
                {isCheckingIn ? `${stationTimer}s` : '--'}
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
              <Bus className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Trạm hiện tại</div>
              <div className="text-2xl font-bold text-purple-700">
                {effectiveCurrentStationIdx + 1}/{effectiveStations.length}
              </div>
            </div>
          </div>
        </div>

        {/* BẢN ĐỒ */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-indigo-100">
          <div className="h-96">
            <RouteMap
              center={(apiStations[0]?.position || stations[0]?.position) || [10.7623, 106.7056]}
              stops={(apiStations.length > 0 ? apiStations : stations).map(s => ({
                id: s.id,
                name: s.name,
                position: s.position,
                time: s.time,
              }))}
              routeShape={tripData?.routeShape}
              isTracking={isTracking}
              isCheckingIn={isCheckingIn}
              isAtStation={isStationActive}
              isMoving={isMoving}
              currentStationIndex={currentStationIndex}
              lastStoppedPosition={lastStoppedState?.position}
            />
          </div>
        </div>

        {/* LẦN DỪNG GẦN NHẤT */}
        {lastStoppedState && !isTracking && (
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-400 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <History className="w-6 h-6 text-amber-700" />
              <div>
                <span className="font-bold text-amber-900">Dừng gần nhất:</span>
                <span className="ml-2 font-semibold">
                  {lastStoppedState.stationName} • {lastStoppedState.time}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CHECK-IN PANEL */}
        {isTracking && isStationActive && currentStationIndex < stations.length - 1 && (
          <div className="bg-gradient-to-br from-purple-700 via-pink-600 to-red-600 text-white rounded-3xl shadow-2xl p-6 border-4 border-white">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold flex items-center justify-center gap-4">
                <Bus className="w-10 h-10 animate-bounce" />
                ĐANG DỪNG TẠI: {currentStation?.name?.toUpperCase()}
              </h3>

              {isWaitingToStartCheckIn && (
                <div className="mt-4 flex items-center justify-center gap-3 text-2xl font-bold text-yellow-300">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  Chuẩn bị check-in...
                </div>
              )}

              {isCheckingIn && (
                <div className={`mt-4 text-5xl font-bold ${stationTimer <= 10 ? 'text-red-300 animate-pulse' : 'text-yellow-200'}`}>
                  {stationTimer}s
                </div>
              )}

              {allChecked && (
                <div className="mt-4 text-2xl font-bold text-yellow-200 animate-bounce">
                  READY! Xe sẽ rời trạm trong giây lát
                </div>
              )}
            </div>

            {isCheckingIn && (
              <div className="bg-white/25 backdrop-blur-md rounded-2xl p-5 border-4 border-white/50">
                <h4 className="text-xl font-bold text-center mb-4">
                  CHECK-IN ({checkedCount}/{totalAtStation})
                </h4>

                {totalAtStation === 0 ? (
                  <p className="text-center py-8 text-lg opacity-90">Trạm trường - Không có học sinh</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentStudents.map(student => {
                      const status = studentCheckIns[student.id];
                      return (
                        <div
                          key={student.id}
                          className={`p-4 rounded-2xl text-center border-4 transition-all transform hover:scale-105 ${status === 'present'
                            ? 'bg-green-600 border-green-400 shadow-lg'
                            : status === 'absent'
                              ? 'bg-red-600 border-red-400 line-through'
                              : 'bg-white/40 border-white hover:bg-white/60'
                            }`}
                        >
                          <p className="font-bold text-sm mb-2">{student.name}</p>
                          <img
                            src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                            alt={student.name}
                            className="w-16 h-16 rounded-full mx-auto mb-3 shadow-lg"
                          />

                          {!status && (
                            <div className="space-y-2">
                              <button
                                onClick={() => checkInStudent(student.id)}
                                className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-lg text-sm shadow-lg"
                              >
                                CÓ MẶT
                              </button>
                              <FaceIDCheckin
                                student={student}
                                onCheckIn={checkInStudent}
                                isCheckedIn={false}
                              />
                              <button
                                onClick={() => markAbsentStudent?.(student.id)}
                                className="w-full py-1 text-xs bg-red-500 hover:bg-red-600 rounded"
                              >
                                Vắng
                              </button>
                            </div>
                          )}

                          {status === 'present' && <CheckCircle className="w-10 h-10 mx-auto mt-3" />}
                          {status === 'absent' && <XCircle className="w-10 h-10 mx-auto mt-3" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {forceDepart && (
                  <div className="text-center mt-6">
                    <button
                      onClick={forceDepart}
                      className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-full shadow-2xl hover:scale-110 transition"
                    >
                      RỜI TRẠM NGAY
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* DANH SÁCH TRẠM - Dùng dữ liệu từ API */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-gray-200">
          <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
            Lộ trình hôm nay ({effectiveStations.length} trạm)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {effectiveStations.map((s, i) => (
              <div
                key={s.id}
                className={`p-5 rounded-2xl text-center font-bold transition-all shadow-md ${i < effectiveCurrentStationIdx
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                  : i === effectiveCurrentStationIdx
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-110 shadow-2xl'
                    : 'bg-gray-100 text-gray-600'
                  }`}
              >
                <div className="text-2xl mb-1">{i + 1}</div>
                <div className="text-sm">{s.name}</div>
                <div className="text-xs opacity-80 mt-1">{s.time || '--:--'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}