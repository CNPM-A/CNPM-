import React, { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip,
  Box, Typography, Stack, Grid, ToggleButton, ToggleButtonGroup,
  CircularProgress, Alert, Divider, Paper, IconButton, Tooltip
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import PersonIcon from '@mui/icons-material/Person'
import RouteIcon from '@mui/icons-material/Route'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlaceIcon from '@mui/icons-material/Place'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { AdminService } from '../api/services'

export default function ScheduleFormDialog({ open, onClose, initialValue, onSubmit }) {
  // Form state
  const [form, setForm] = useState({
    routeId: '',
    busId: '',
    driverId: '',
    direction: 'PICK_UP',
    daysOfWeek: [1, 2, 3, 4, 5],
    startDate: dayjs(),
    endDate: dayjs().add(3, 'month'),
    stopTimes: []
  })

  // Data lists
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [drivers, setDrivers] = useState([])

  // Loading states
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Fetch data khi mở dialog
  useEffect(() => {
    if (open) {
      setLoading(true)
      setError('')

      Promise.all([
        AdminService.listRoutes(),
        AdminService.listBuses(),
        AdminService.listDrivers()
      ])
        .then(([routesData, busesData, driversData]) => {
          setRoutes(routesData || [])
          // Lọc xe chưa được gán (hoặc đang edit thì hiển thị xe hiện tại)
          const availableBuses = busesData.filter(b =>
            !b.isAssigned || b._id === initialValue?.busId?._id || b._id === initialValue?.busId
          )
          setBuses(availableBuses || busesData || [])
          setDrivers(driversData || [])
        })
        .catch(err => {
          console.error('Error loading data:', err)
          setError('Không thể tải dữ liệu. Vui lòng thử lại.')
        })
        .finally(() => setLoading(false))
    }
  }, [open, initialValue])

  // Populate form khi edit
  useEffect(() => {
    if (initialValue && open) {
      setForm({
        routeId: initialValue.routeId?._id || initialValue.routeId || '',
        busId: initialValue.busId?._id || initialValue.busId || '',
        driverId: initialValue.driverId?._id || initialValue.driverId || '',
        direction: initialValue.direction || 'PICK_UP',
        daysOfWeek: initialValue.daysOfWeek || [1, 2, 3, 4, 5],
        startDate: initialValue.startDate ? dayjs(initialValue.startDate) : dayjs(),
        endDate: initialValue.endDate ? dayjs(initialValue.endDate) : dayjs().add(3, 'month'),
        stopTimes: initialValue.stopTimes || []
      })
    } else if (!initialValue && open) {
      // Reset form khi tạo mới
      setForm({
        routeId: '',
        busId: '',
        driverId: '',
        direction: 'PICK_UP',
        daysOfWeek: [1, 2, 3, 4, 5],
        startDate: dayjs(),
        endDate: dayjs().add(3, 'month'),
        stopTimes: []
      })
    }
  }, [initialValue, open])

  // Khi chọn Route → tự động tạo stopTimes
  useEffect(() => {
    if (form.routeId && !initialValue) {
      const selectedRoute = routes.find(r => r._id === form.routeId)
      if (selectedRoute?.stops && selectedRoute.stops.length > 0) {
        // Tính giờ dự kiến cho mỗi trạm
        const baseHour = form.direction === 'PICK_UP' ? 6 : 16 // 6h sáng hoặc 4h chiều
        const intervalMinutes = 15 // Mỗi trạm cách nhau 15 phút

        const defaultStopTimes = selectedRoute.stops.map((stop, idx) => {
          const totalMinutes = baseHour * 60 + idx * intervalMinutes
          const hours = Math.floor(totalMinutes / 60)
          const minutes = totalMinutes % 60

          return {
            stationId: stop._id,
            stationName: stop.name, // Để hiển thị UI
            arrivalTime: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
            studentIds: []
          }
        })

        setForm(prev => ({ ...prev, stopTimes: defaultStopTimes }))
      }
    }
  }, [form.routeId, form.direction, routes, initialValue])

  // Days of week options
  const daysOfWeekOptions = [
    { value: 1, label: 'T2', fullLabel: 'Thứ 2' },
    { value: 2, label: 'T3', fullLabel: 'Thứ 3' },
    { value: 3, label: 'T4', fullLabel: 'Thứ 4' },
    { value: 4, label: 'T5', fullLabel: 'Thứ 5' },
    { value: 5, label: 'T6', fullLabel: 'Thứ 6' },
    { value: 6, label: 'T7', fullLabel: 'Thứ 7' },
    { value: 7, label: 'CN', fullLabel: 'Chủ nhật' }
  ]

  // Toggle day selection
  const toggleDay = (dayValue) => {
    setForm(prev => {
      const newDays = prev.daysOfWeek.includes(dayValue)
        ? prev.daysOfWeek.filter(d => d !== dayValue)
        : [...prev.daysOfWeek, dayValue].sort((a, b) => a - b)
      return { ...prev, daysOfWeek: newDays }
    })
  }

  // Update arrival time for a stop
  const updateStopTime = (index, newTime) => {
    setForm(prev => {
      const newStopTimes = [...prev.stopTimes]
      newStopTimes[index] = {
        ...newStopTimes[index],
        arrivalTime: newTime
      }
      return { ...prev, stopTimes: newStopTimes }
    })
  }

  // Validation
  const isValid = () => {
    return form.routeId &&
      form.busId &&
      form.driverId &&
      form.daysOfWeek.length > 0 &&
      form.startDate &&
      form.endDate &&
      form.endDate.isAfter(form.startDate)
  }

  // Submit
  const handleSubmit = async () => {
    if (!isValid()) {
      setError('Vui lòng điền đầy đủ thông tin.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Chuẩn bị payload
      const payload = {
        routeId: form.routeId,
        busId: form.busId,
        driverId: form.driverId,
        direction: form.direction,
        daysOfWeek: form.daysOfWeek,
        startDate: form.startDate.toISOString(),
        endDate: form.endDate.toISOString(),
        stopTimes: form.stopTimes.map(st => ({
          stationId: st.stationId,
          arrivalTime: st.arrivalTime,
          studentIds: st.studentIds || []
        }))
      }

      await onSubmit(payload)
      handleClose()
    } catch (err) {
      console.error('Submit error:', err)
      setError(err.response?.data?.msg || 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  // Close and reset
  const handleClose = () => {
    setError('')
    onClose()
  }

  // Get selected route info
  const selectedRoute = routes.find(r => r._id === form.routeId)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white'
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CalendarMonthIcon />
            <Typography variant="h6" fontWeight={700}>
              {initialValue ? 'Chỉnh sửa lịch trình' : 'Tạo lịch trình mới'}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Error Alert */}
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error" onClose={() => setError('')} sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                </Grid>
              )}

              {/* Chọn tuyến đường */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <RouteIcon fontSize="small" />
                      <span>Tuyến đường</span>
                    </Stack>
                  </InputLabel>
                  <Select
                    value={form.routeId}
                    onChange={(e) => setForm({ ...form, routeId: e.target.value })}
                    label="Tuyến đường"
                  >
                    {routes.map(route => (
                      <MenuItem key={route._id} value={route._id}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                          <RouteIcon sx={{ color: '#6366f1' }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight={600}>{route.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {route.stops?.length || 0} trạm • {route.distance} • {route.duration}
                            </Typography>
                          </Box>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Hiển thị các trạm của tuyến đã chọn */}
              {selectedRoute && form.stopTimes.length > 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: '#475569' }}>
                      <PlaceIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                      Các trạm dừng & giờ dự kiến
                    </Typography>
                    <Stack spacing={1}>
                      {form.stopTimes.map((stop, idx) => (
                        <Stack
                          key={stop.stationId}
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          sx={{
                            p: 1.5,
                            bgcolor: 'white',
                            borderRadius: 1.5,
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <Chip
                            label={idx + 1}
                            size="small"
                            sx={{
                              bgcolor: idx === 0 ? '#22c55e' : idx === form.stopTimes.length - 1 ? '#ef4444' : '#6366f1',
                              color: 'white',
                              fontWeight: 700,
                              minWidth: 32
                            }}
                          />
                          <Typography sx={{ flex: 1, fontWeight: 500 }}>
                            {stop.stationName || selectedRoute.stops?.[idx]?.name || `Trạm ${idx + 1}`}
                          </Typography>
                          <TextField
                            type="time"
                            size="small"
                            value={stop.arrivalTime}
                            onChange={(e) => updateStopTime(idx, e.target.value)}
                            sx={{ width: 120 }}
                            InputProps={{
                              startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#94a3b8', fontSize: 18 }} />
                            }}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              )}

              {/* Xe buýt & Tài xế */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <DirectionsBusIcon fontSize="small" />
                      <span>Xe buýt</span>
                    </Stack>
                  </InputLabel>
                  <Select
                    value={form.busId}
                    onChange={(e) => setForm({ ...form, busId: e.target.value })}
                    label="Xe buýt"
                  >
                    {buses.length === 0 ? (
                      <MenuItem disabled>Không có xe khả dụng</MenuItem>
                    ) : (
                      buses.map(bus => (
                        <MenuItem key={bus._id} value={bus._id}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <DirectionsBusIcon sx={{ color: '#f59e0b' }} />
                            <Box>
                              <Typography fontWeight={600}>{bus.licensePlate}</Typography>
                              {bus.isAssigned && (
                                <Chip label="Đang sử dụng" size="small" color="warning" sx={{ height: 20 }} />
                              )}
                            </Box>
                          </Stack>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon fontSize="small" />
                      <span>Tài xế</span>
                    </Stack>
                  </InputLabel>
                  <Select
                    value={form.driverId}
                    onChange={(e) => setForm({ ...form, driverId: e.target.value })}
                    label="Tài xế"
                  >
                    {drivers.length === 0 ? (
                      <MenuItem disabled>Không có tài xế</MenuItem>
                    ) : (
                      drivers.map(driver => (
                        <MenuItem key={driver._id} value={driver._id}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <PersonIcon sx={{ color: '#6366f1' }} />
                            <Box>
                              <Typography fontWeight={600}>{driver.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {driver.phoneNumber || driver.phone_number}
                              </Typography>
                            </Box>
                          </Stack>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {/* Loại chuyến */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: '#475569' }}>
                  Loại chuyến
                </Typography>
                <ToggleButtonGroup
                  value={form.direction}
                  exclusive
                  onChange={(e, val) => val && setForm({ ...form, direction: val })}
                  fullWidth
                  sx={{
                    '& .MuiToggleButton-root': {
                      py: 1.5,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        fontWeight: 700
                      }
                    }
                  }}
                >
                  <ToggleButton
                    value="PICK_UP"
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: '#dcfce7',
                        color: '#166534',
                        '&:hover': { bgcolor: '#bbf7d0' }
                      }
                    }}
                  >
                    <ArrowUpwardIcon sx={{ mr: 1 }} />
                    🌅 Đón học sinh (Sáng)
                  </ToggleButton>
                  <ToggleButton
                    value="DROP_OFF"
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: '#dbeafe',
                        color: '#1d4ed8',
                        '&:hover': { bgcolor: '#bfdbfe' }
                      }
                    }}
                  >
                    <ArrowDownwardIcon sx={{ mr: 1 }} />
                    🌆 Trả học sinh (Chiều)
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              {/* Ngày trong tuần */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: '#475569' }}>
                  Ngày hoạt động trong tuần
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {daysOfWeekOptions.map(day => (
                    <Tooltip key={day.value} title={day.fullLabel}>
                      <Chip
                        label={day.label}
                        onClick={() => toggleDay(day.value)}
                        color={form.daysOfWeek.includes(day.value) ? 'primary' : 'default'}
                        variant={form.daysOfWeek.includes(day.value) ? 'filled' : 'outlined'}
                        sx={{
                          fontWeight: 600,
                          minWidth: 48,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    </Tooltip>
                  ))}
                </Stack>
                {form.daysOfWeek.length === 0 && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    Vui lòng chọn ít nhất 1 ngày
                  </Typography>
                )}
              </Grid>

              {/* Ngày bắt đầu / kết thúc */}
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={form.startDate}
                  onChange={(val) => setForm({ ...form, startDate: val })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                  minDate={dayjs()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Ngày kết thúc"
                  value={form.endDate}
                  onChange={(val) => setForm({ ...form, endDate: val })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: form.endDate && form.startDate && form.endDate.isBefore(form.startDate),
                      helperText: form.endDate && form.startDate && form.endDate.isBefore(form.startDate)
                        ? 'Ngày kết thúc phải sau ngày bắt đầu'
                        : ''
                    }
                  }}
                  minDate={form.startDate || dayjs()}
                />
              </Grid>

              {/* Thông tin tổng hợp */}
              {isValid() && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      📅 Lịch trình sẽ hoạt động từ <strong>{form.startDate.format('DD/MM/YYYY')}</strong> đến <strong>{form.endDate.format('DD/MM/YYYY')}</strong>
                      {' '}vào các ngày <strong>{form.daysOfWeek.map(d => daysOfWeekOptions.find(o => o.value === d)?.label).join(', ')}</strong>
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc' }}>
          <Button
            onClick={handleClose}
            disabled={submitting}
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValid() || submitting || loading}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
              }
            }}
          >
            {submitting ? 'Đang xử lý...' : (initialValue ? 'Cập nhật' : 'Tạo lịch trình')}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}