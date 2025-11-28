import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Collapse,
  Stack
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { AdminService } from '../api/services'
import TripFormDialog from '../components/TripFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { useNotify } from '../hooks/useNotify'
import { StatusChip } from '../utils/status'

export default function Schedules() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, row: null })
  const [expandedIds, setExpandedIds] = useState(new Set())
  const notify = useNotify()

  const fetchTrips = useCallback(async () => {
    setLoading(true)
    try {
      const data = await AdminService.listTrips()
      setRows(data)
    } catch {
      notify.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  const onAdd = () => {
    setEditing(null)
    setOpen(true)
  }

  const onEdit = (row) => {
    setEditing({
      ...row,
      route_id: row.route?.route_id,
      bus_id: row.bus?.bus_id,
      stop_ids: row.stops?.map((s) => s.stop_id) || [],
      student_ids: row.passengers?.map((p) => p.student_id) || []
    })
    setOpen(true)
  }

  const onDelete = (row) => setConfirm({ open: true, row })

  const confirmDelete = async () => {
    try {
      if (confirm.row) {
        await AdminService.deleteTrip(confirm.row.trip_id)
        notify.success('Xóa thành công')
        fetchTrips()
      }
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setConfirm({ open: false, row: null })
  }

  const onSubmit = async (form) => {
    try {
      if (editing) {
        await AdminService.updateTrip(editing.trip_id, form)
        notify.success('Cập nhật thành công')
      } else {
        await AdminService.createTrip(form)
        notify.success('Tạo thành công')
      }
      setOpen(false)
      setEditing(null)
      fetchTrips()
    } catch {
      notify.error('Có lỗi xảy ra')
    }
  }

  const formatDateTime = (value) => {
    if (!value) return '—'
    try {
      let date = new Date(value)
      if (isNaN(date.getTime()) && typeof value === 'string') {
        date = new Date(value.includes('Z') ? value : value + 'Z')
      }
      if (isNaN(date.getTime())) return '—'
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return '—'
    }
  }

  const toggleExpand = (tripId) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tripId)) {
        newSet.delete(tripId)
      } else {
        newSet.add(tripId)
      }
      return newSet
    })
  }

  const DetailPanel = ({ row }) => {
    const isExpanded = expandedIds.has(row.trip_id)
    return (
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, bgcolor: 'action.hover', borderTop: 1, borderColor: 'divider' }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                📍 Điểm dừng ({row.stops?.length || 0})
              </Typography>
              {row.stops && row.stops.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {row.stops.map((stop, idx) => (
                    <Chip
                      key={stop.stop_id}
                      size="small"
                      label={`${idx + 1}. ${stop.name}`}
                      variant="outlined"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">Chưa có điểm dừng</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                👥 Hành khách ({row.passengers?.length || 0})
              </Typography>
              {row.passengers && row.passengers.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {row.passengers.map((passenger) => (
                    <Chip
                      key={passenger.student_id}
                      size="small"
                      label={passenger.name}
                      color="primary"
                      variant="outlined"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">Chưa có hành khách</Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Collapse>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Lịch trình</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={onAdd} size="large">Thêm chuyến</Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tuyến đường</TableCell>
              <TableCell>Xe</TableCell>
              <TableCell>Tài xế</TableCell>
              <TableCell>Giờ khởi hành</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((schedule) => (
              <React.Fragment key={schedule.trip_id}>
                <TableRow>
                  <TableCell>{schedule.trip_id}</TableCell>
                  <TableCell>{schedule.route?.name}</TableCell>
                  <TableCell>{schedule.bus?.plate_number}</TableCell>
                  <TableCell>{schedule.driver}</TableCell>
                  <TableCell>{formatDateTime(schedule.start_time)}</TableCell>
                  <TableCell><StatusChip code={schedule.status} /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={expandedIds.has(schedule.trip_id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        onClick={(e) => { e.stopPropagation(); toggleExpand(schedule.trip_id) }}
                        sx={{ minWidth: 'auto', px: 1, fontSize: '0.75rem' }}
                      >
                        Chi tiết
                      </Button>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(schedule) }} sx={{ color: 'primary.main' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(schedule) }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                    <DetailPanel row={schedule} />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TripFormDialog open={open} onClose={() => setOpen(false)} initialValue={editing} onSubmit={onSubmit} />
      <ConfirmDialog
        open={confirm.open}
        title="Xóa chuyến"
        message={`Bạn có chắc muốn xóa chuyến #${confirm.row?.trip_id}?`}
        cancelText="Hủy"
        okText="Xóa"
        onCancel={() => setConfirm({ open: false, row: null })}
        onOk={confirmDelete}
      />
    </Box>
  )
}