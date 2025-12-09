import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Paper, Stack, Button, Chip, CircularProgress,
  Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider,
  IconButton, Alert, Card, CardContent, LinearProgress, Tooltip, Badge
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import ScheduleIcon from '@mui/icons-material/Schedule'
import PersonIcon from '@mui/icons-material/Person'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import PlaceIcon from '@mui/icons-material/Place'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import RouteIcon from '@mui/icons-material/Route'
import SchoolIcon from '@mui/icons-material/School'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import WifiIcon from '@mui/icons-material/Wifi'
import WifiOffIcon from '@mui/icons-material/WifiOff'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AdminService } from '../api/services'
import { useNotify } from '../hooks/useNotify'
import { useSocket } from '../hooks/useSocket'

// Fix icon Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon. Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x. png',
  iconUrl: 'https://cdnjs. cloudflare.com/ajax/libs/leaflet/1. 7.1/images/marker-icon. png',
  shadowUrl: 'https://cdnjs. cloudflare.com/ajax/libs/leaflet/1. 7.1/images/marker-shadow. png',
})

// Custom icon cho trạm
const createStationIcon = (color, number) => L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="
      background: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      color: white;
    ">
      ${number}
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

// Custom icon cho xe buýt
const createBusIcon = () => L.divIcon({
  className: 'bus-marker',
  html: `
    <div style="
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    ">
      <span style="font-size: 24px;">🚌</span>
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(245, 158, 11, 0.5); }
        50% { transform: scale(1.1); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.7); }
      }
    </style>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 44],
})

// Component fit bounds
function FitBounds({ coordinates }) {
  const map = useMap()
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const bounds = coordinates. map(coord => [coord[1], coord[0]])
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [coordinates, map])
  return null
}

// Component cập nhật vị trí xe trên map
function BusMarker({ position }) {
  const map = useMap()
  
  useEffect(() => {
    if (position) {
      map.panTo(position, { animate: true, duration: 1 })
    }
  }, [position, map])

  if (!position) return null

  return (
    <Marker position={position} icon={createBusIcon()}>
      <Popup>
        <Typography variant="subtitle2" fontWeight="bold">
          🚌 Vị trí xe hiện tại
        </Typography>
        <Typography variant="caption" color="text. secondary">
          Cập nhật realtime
        </Typography>
      </Popup>
    </Marker>
  )
}

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notify = useNotify()

  // States
  const [loading, setLoading] = useState(true)
  const [tripData, setTripData] = useState(null)
  const [busPosition, setBusPosition] = useState(null)
  const [recentEvents, setRecentEvents] = useState([])

  // Socket. IO
  const { 
    connected, 
    joinTrip, 
    leaveTrip, 
    onStudentCheckedIn, 
    onBusLocationUpdate,
    onBusApproaching,
    onBusArrived 
  } = useSocket()

  // Fetch trip data
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await AdminService. getTrip(id)
      console.log('Trip data:', response)
      setTripData(response)
    } catch (error) {
      console.error('Error:', error)
      notify. error('Không thể tải thông tin chuyến đi')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [id])

  // Socket. IO connection
  useEffect(() => {
    if (id && connected) {
      console.log('🔌 Joining trip room:', id)
      joinTrip(id)

      // Cleanup khi rời trang
      return () => {
        console. log('🔌 Leaving trip room:', id)
        leaveTrip(id)
      }
    }
  }, [id, connected, joinTrip, leaveTrip])

  // Lắng nghe sự kiện check-in
  useEffect(() => {
    if (connected) {
      const cleanup = onStudentCheckedIn((data) => {
        console.log('🎉 Student checked in:', data)
        
        // Cập nhật UI realtime
        setTripData(prev => {
          if (! prev) return prev
          
          const updatedStudentStops = prev.studentStops.map(ss => 
            ss.studentId?._id === data.studentId || ss.studentId === data.studentId
              ? { ...ss, action: data.action, timestamp: new Date().toISOString() }
              : ss
          )
          
          return { ...prev, studentStops: updatedStudentStops }
        })

        // Thêm vào recent events
        setRecentEvents(prev => [{
          type: 'check_in',
          action: data.action,
          studentId: data.studentId,
          timestamp: new Date(),
          message: data.action === 'PICKED_UP' ? 'Học sinh đã lên xe' : 
                   data.action === 'DROPPED_OFF' ? 'Học sinh đã xuống xe' : 
                   'Học sinh vắng mặt'
        }, ...prev. slice(0, 9)])

        // Hiển thị notification
        const actionText = data.action === 'PICKED_UP' ? 'đã lên xe' : 
                          data.action === 'DROPPED_OFF' ? 'đã xuống xe' : 
                          'vắng mặt'
        notify.success(`🎉 Học sinh ${actionText}! `)
      })

      return cleanup
    }
  }, [connected, onStudentCheckedIn, notify])

  // Lắng nghe vị trí xe
  useEffect(() => {
    if (connected) {
      const cleanup = onBusLocationUpdate((data) => {
        if (data.tripId === id) {
          setBusPosition([data.latitude, data.longitude])
        }
      })

      return cleanup
    }
  }, [connected, id, onBusLocationUpdate])

  // Lắng nghe xe sắp đến
  useEffect(() => {
    if (connected) {
      const cleanup = onBusApproaching((data) => {
        notify.info(`🚌 Xe sắp đến trạm: ${data.stationName || 'Trạm tiếp theo'}`)
        setRecentEvents(prev => [{
          type: 'approaching',
          stationName: data. stationName,
          timestamp: new Date(),
          message: `Xe sắp đến ${data. stationName}`
        }, ...prev.slice(0, 9)])
      })

      return cleanup
    }
  }, [connected, onBusApproaching, notify])

  // Lắng nghe xe đã đến
  useEffect(() => {
    if (connected) {
      const cleanup = onBusArrived((data) => {
        notify.success(`🚌 Xe đã đến trạm: ${data.stationName || 'Trạm'}`)
        setRecentEvents(prev => [{
          type: 'arrived',
          stationName: data.stationName,
          timestamp: new Date(),
          message: `Xe đã đến ${data.stationName}`
        }, ... prev.slice(0, 9)])
      })

      return cleanup
    }
  }, [connected, onBusArrived, notify])

  // Auto refresh khi đang IN_PROGRESS (fallback nếu socket không hoạt động)
  useEffect(() => {
    let interval
    if (tripData?. status === 'IN_PROGRESS' && !connected) {
      interval = setInterval(fetchData, 30000) // 30s
    }
    return () => clearInterval(interval)
  }, [tripData?. status, connected])

  // Status config
  const getStatusConfig = (status) => {
    const configs = {
      'NOT_STARTED': { 
        label: 'Chưa bắt đầu', 
        color: '#64748b',
        bgcolor: '#f1f5f9',
        icon: <ScheduleIcon />
      },
      'IN_PROGRESS': { 
        label: 'Đang chạy', 
        color: '#1d4ed8',
        bgcolor: '#dbeafe',
        icon: <PlayArrowIcon />
      },
      'COMPLETED': { 
        label: 'Hoàn thành', 
        color: '#166534',
        bgcolor: '#dcfce7',
        icon: <CheckCircleIcon />
      },
      'CANCELLED': { 
        label: 'Đã hủy', 
        color: '#dc2626',
        bgcolor: '#fee2e2',
        icon: <CancelIcon />
      }
    }
    return configs[status] || configs['NOT_STARTED']
  }

  // Student status
  const getStudentStatusConfig = (action) => {
    const configs = {
      'PENDING': { 
        label: 'Chờ đón', 
        color: '#64748b', 
        bgcolor: '#f1f5f9',
        icon: <ScheduleIcon />
      },
      'PICKED_UP': { 
        label: 'Đã lên xe', 
        color: '#166534', 
        bgcolor: '#dcfce7',
        icon: <CheckCircleIcon />
      },
      'DROPPED_OFF': { 
        label: 'Đã xuống xe', 
        color: '#1d4ed8', 
        bgcolor: '#dbeafe',
        icon: <CheckCircleIcon />
      },
      'ABSENT': { 
        label: 'Vắng mặt', 
        color: '#dc2626', 
        bgcolor: '#fee2e2',
        icon: <CancelIcon />
      }
    }
    return configs[action] || configs['PENDING']
  }

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} sx={{ color: '#6366f1' }} />
        <Typography sx={{ mt: 2, color: '#64748b' }}>Đang tải thông tin chuyến đi...</Typography>
      </Box>
    )
  }

  // Error state
  if (! tripData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>Không tìm thấy thông tin chuyến đi</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/trips')} sx={{ mt: 2 }}>
          Quay lại
        </Button>
      </Box>
    )
  }

  const statusConfig = getStatusConfig(tripData. status)
  const polylinePositions = tripData. routeId?. shape?.coordinates?. map(coord => [coord[1], coord[0]]) || []
  
  // Calculate stats
  const studentStops = tripData.studentStops || []
  const totalStudents = studentStops.length
  const pickedUp = studentStops. filter(s => s.action === 'PICKED_UP' || s.action === 'DROPPED_OFF').length
  const absent = studentStops. filter(s => s.action === 'ABSENT').length
  const pending = studentStops. filter(s => s.action === 'PENDING').length
  const progressPercent = totalStudents > 0 ? Math.round((pickedUp / totalStudents) * 100) : 0

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton 
              onClick={() => navigate('/admin/trips')}
              sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  {tripData.routeId?.name || 'Chi tiết chuyến đi'}
                </Typography>
                <Chip
                  icon={tripData.direction === 'PICK_UP' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  label={tripData.direction === 'PICK_UP' ? 'Đón học sinh' : 'Trả học sinh'}
                  size="small"
                  sx={{
                    bgcolor: tripData.direction === 'PICK_UP' ? '#dcfce7' : '#dbeafe',
                    color: tripData.direction === 'PICK_UP' ? '#166534' : '#1d4ed8'
                  }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                📅 {tripData.tripDate ?  new Date(tripData.tripDate).toLocaleDateString('vi-VN', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }) : '—'}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Socket connection status */}
            <Tooltip title={connected ? 'Đang kết nối realtime' : 'Không có kết nối realtime'}>
              <Chip
                icon={connected ? <WifiIcon /> : <WifiOffIcon />}
                label={connected ? 'Live' : 'Offline'}
                size="small"
                sx={{
                  bgcolor: connected ? '#dcfce7' : '#fee2e2',
                  color: connected ? '#166534' : '#dc2626',
                  fontWeight: 600,
                  animation: connected ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 }
                  }
                }}
              />
            </Tooltip>
            
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              sx={{
                bgcolor: statusConfig.bgcolor,
                color: statusConfig.color,
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 2,
                '& .MuiChip-icon': { color: statusConfig. color }
              }}
            />
            <Button startIcon={<RefreshIcon />} onClick={fetchData} variant="outlined" sx={{ borderRadius: 2 }}>
              Làm mới
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        {/* Cột trái - Bản đồ */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ height: 500, borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'relative' }}>
            <MapContainer
              center={[10.7769, 106.7009]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {tripData.routeId?. shape?. coordinates && (
                <FitBounds coordinates={tripData.routeId.shape.coordinates} />
              )}

              {/* Vẽ tuyến đường */}
              {polylinePositions.length > 0 && (
                <Polyline
                  positions={polylinePositions}
                  pathOptions={{ color: '#6366f1', weight: 5, opacity: 0.8 }}
                />
              )}

              {/* Vẽ các trạm */}
              {tripData. routeId?.orderedStops?.map((station, index) => {
                const isFirst = index === 0
                const isLast = index === tripData.routeId.orderedStops.length - 1
                const isCurrentStop = index === tripData.nextStationIndex
                const color = isFirst ?  '#22c55e' : isLast ? '#ef4444' : isCurrentStop ? '#f59e0b' : '#6366f1'
                
                return (
                  <React.Fragment key={station._id}>
                    <Marker
                      position={[station.address.latitude, station. address.longitude]}
                      icon={createStationIcon(color, index + 1)}
                    >
                      <Popup>
                        <Box sx={{ minWidth: 180 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {index + 1}.  {station.name}
                          </Typography>
                          <Typography variant="caption" color="text. secondary">
                            {station.address. fullAddress}
                          </Typography>
                          {isCurrentStop && tripData.status === 'IN_PROGRESS' && (
                            <Chip 
                              label="Trạm tiếp theo" 
                              size="small" 
                              color="warning" 
                              sx={{ mt: 1, display: 'block' }} 
                            />
                          )}
                        </Box>
                      </Popup>
                    </Marker>
                    
                    {/* Vòng tròn cho trạm hiện tại */}
                    {isCurrentStop && tripData.status === 'IN_PROGRESS' && (
                      <Circle
                        center={[station.address.latitude, station.address.longitude]}
                        radius={100}
                        pathOptions={{ color: '#f59e0b', fillColor: '#fef3c7', fillOpacity: 0.3 }}
                      />
                    )}
                  </React.Fragment>
                )
              })}

              {/* Vị trí xe buýt realtime */}
              <BusMarker position={busPosition} />
            </MapContainer>

            {/* Legend */}
            <Paper sx={{ 
              position: 'absolute', 
              bottom: 16, 
              left: 16, 
              p: 1.5, 
              borderRadius: 2, 
              zIndex: 1000,
              bgcolor: 'rgba(255,255,255,0.95)'
            }}>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#22c55e' }} />
                  <Typography variant="caption">Xuất phát</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                  <Typography variant="caption">Trạm tiếp theo</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ef4444' }} />
                  <Typography variant="caption">Điểm đích</Typography>
                </Stack>
              </Stack>
            </Paper>
          </Paper>

          {/* Thông tin chuyến */}
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderRadius: 2, bgcolor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <DirectionsBusIcon sx={{ fontSize: 32, color: '#f59e0b', mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" display="block">Biển số xe</Typography>
                  <Typography variant="body1" fontWeight="bold">{tripData.busId?. licensePlate || '—'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderRadius: 2, bgcolor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <PersonIcon sx={{ fontSize: 32, color: '#6366f1', mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" display="block">Tài xế</Typography>
                  <Typography variant="body1" fontWeight="bold">{tripData. driverId?.name || '—'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderRadius: 2, bgcolor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <PlaceIcon sx={{ fontSize: 32, color: '#8b5cf6', mb: 1 }} />
                  <Typography variant="caption" color="text. secondary" display="block">Số trạm</Typography>
                  <Typography variant="body1" fontWeight="bold">{tripData.routeId?.orderedStops?.length || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card sx={{ borderRadius: 2, bgcolor: '#f8fafc', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <AccessTimeIcon sx={{ fontSize: 32, color: '#22c55e', mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" display="block">Bắt đầu</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {tripData.actualStartTime 
                      ? new Date(tripData. actualStartTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                      : '—'
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Cột phải - Trạng thái học sinh */}
        <Grid item xs={12} lg={5}>
          {/* Progress Card */}
          <Paper sx={{ p: 2.5, mb: 2, borderRadius: 3, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
              Tiến độ đưa đón
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h3" fontWeight="bold">{progressPercent}%</Typography>
              <Box sx={{ flex: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercent} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 5 }
                  }}
                />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {pickedUp}/{totalStudents} học sinh
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {absent > 0 && `${absent} vắng`}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: '#dcfce7', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#166534' }}>{pickedUp}</Typography>
                <Typography variant="caption" sx={{ color: '#166534' }}>Đã đón/trả</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fef3c7', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#92400e' }}>{pending}</Typography>
                <Typography variant="caption" sx={{ color: '#92400e' }}>Chờ đón</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fee2e2', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#dc2626' }}>{absent}</Typography>
                <Typography variant="caption" sx={{ color: '#dc2626' }}>Vắng mặt</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Events (Realtime) */}
          {recentEvents.length > 0 && (
            <Paper sx={{ p: 2, mb: 2, borderRadius: 3, bgcolor: '#fffbeb', border: '1px solid #fcd34d' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <NotificationsActiveIcon sx={{ color: '#f59e0b' }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#92400e' }}>
                  Hoạt động gần đây
                </Typography>
                {connected && (
                  <Chip label="LIVE" size="small" sx={{ bgcolor: '#22c55e', color: 'white', height: 20, fontSize: '0.65rem' }} />
                )}
              </Stack>
              <Stack spacing={1}>
                {recentEvents. slice(0, 3). map((event, idx) => (
                  <Stack key={idx} direction="row" spacing={1.5} alignItems="center" sx={{ p: 1, bgcolor: 'white', borderRadius: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: event.type === 'check_in' ? '#22c55e' : '#f59e0b' 
                    }} />
                    <Typography variant="caption" sx={{ flex: 1 }}>{event.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(event.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Danh sách học sinh */}
          <Paper sx={{ borderRadius: 3, overflow: 'hidden', maxHeight: recentEvents.length > 0 ? 300 : 400 }}>
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SchoolIcon sx={{ color: '#6366f1' }} />
                <Typography variant="subtitle1" fontWeight="600">
                  Danh sách học sinh ({totalStudents})
                </Typography>
              </Stack>
            </Box>
            
            <List sx={{ maxHeight: recentEvents.length > 0 ? 240 : 340, overflow: 'auto', p: 1 }}>
              {studentStops.length > 0 ?  (
                studentStops.map((ss, index) => {
                  const statusCfg = getStudentStatusConfig(ss.action)
                  const studentName = ss.studentId?.name || `Học sinh ${index + 1}`
                  const stationName = ss. stationId?.name || ''
                  
                  return (
                    <React.Fragment key={ss. studentId?._id || index}>
                      <ListItem sx={{ 
                        borderRadius: 2, 
                        mb: 0.5,
                        bgcolor: statusCfg.bgcolor,
                        border: `1px solid ${statusCfg.color}20`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: statusCfg.color, width: 40, height: 40 }}>
                            {statusCfg.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={600}>{studentName}</Typography>
                          }
                          secondary={
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                              <Chip 
                                label={statusCfg.label} 
                                size="small" 
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.7rem',
                                  bgcolor: 'white',
                                  color: statusCfg.color,
                                  fontWeight: 500
                                }} 
                              />
                              {ss.timestamp && (
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(ss. timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                              )}
                            </Stack>
                          }
                        />
                        {stationName && (
                          <Tooltip title={`Trạm: ${stationName}`}>
                            <PlaceIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                          </Tooltip>
                        )}
                      </ListItem>
                    </React.Fragment>
                  )
                })
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <HelpOutlineIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 1 }} />
                  <Typography color="text.secondary">Chưa có học sinh trong chuyến</Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}