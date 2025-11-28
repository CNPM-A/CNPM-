import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Chip, Stack, Typography, Button, IconButton, Tooltip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { AdminService } from '../api/services'
import RouteFormDialog from '../components/RouteFormDialog'
import StopFormDialog from '../components/StopFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { useNotify } from '../hooks/useNotify'

export default function RoutesPage() {
  const [rows, setRows] = useState([])
  const [routeOpen, setRouteOpen] = useState(false)
  const [stopOpen, setStopOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  const [editingStop, setEditingStop] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, type: '', payload: null })
  const notify = useNotify()

  useEffect(() => {
    AdminService.listRoutes().then(setRows)
  }, [])

  const refresh = () => AdminService.listRoutes().then(setRows)
  const onAddRoute = () => { setEditingRoute(null); setRouteOpen(true) }
  const onEditRoute = (r) => { setEditingRoute(r); setRouteOpen(true) }
  const onDeleteRoute = (r) => setConfirm({ open: true, type: 'route', payload: r })

  const onSubmitRoute = async (form) => {
    try {
      if (editingRoute) { await AdminService.updateRoute(editingRoute.route_id, form); notify.success('Cập nhật thành công') }
      else { await AdminService.createRoute(form); notify.success('Tạo thành công') }
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setRouteOpen(false); setEditingRoute(null); refresh()
  }

  const onAddStop = (route) => { setEditingStop({ route_id: route.route_id, name: '', address: '', latitude: '', longitude: '', seq_index: (route.stops?.length || 0) + 1 }); setStopOpen(true) }
  const onEditStop = (stop) => { setEditingStop(stop); setStopOpen(true) }
  const onDeleteStop = (stop) => setConfirm({ open: true, type: 'stop', payload: stop })

  const onSubmitStop = async (form) => {
    try {
      if (editingStop?.stop_id) { await AdminService.updateStop(editingStop.stop_id, form); notify.success('Cập nhật thành công') }
      else { await AdminService.createStop(form); notify.success('Tạo thành công') }
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setStopOpen(false); setEditingStop(null); refresh()
  }

  const confirmDelete = async () => {
    try {
      if (confirm.type === 'route') await AdminService.deleteRoute(confirm.payload.route_id)
      if (confirm.type === 'stop') await AdminService.deleteStop(confirm.payload.stop_id)
      notify.success('Xóa thành công')
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setConfirm({ open: false, type: '', payload: null })
    refresh()
  }

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Tuyến đường</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={onAddRoute}>Thêm tuyến</Button>
      </Stack>
      <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên tuyến</TableCell>
              <TableCell>Điểm đầu</TableCell>
              <TableCell>Điểm cuối</TableCell>
              <TableCell>Số điểm dừng</TableCell>
              <TableCell>Khoảng cách</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((route) => (
              <TableRow key={route.route_id}>
                <TableCell>{route.route_id}</TableCell>
                <TableCell>{route.name}</TableCell>
                <TableCell>{route.start}</TableCell>
                <TableCell>{route.end}</TableCell>
                <TableCell>{route.stops?.length}</TableCell>
                <TableCell>{route.distance}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => onEditRoute(route)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => onDeleteRoute(route)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <RouteFormDialog open={routeOpen} onClose={() => setRouteOpen(false)} initialValue={editingRoute} onSubmit={onSubmitRoute} />
      <StopFormDialog open={stopOpen} onClose={() => setStopOpen(false)} initialValue={editingStop} onSubmit={onSubmitStop} />
      <ConfirmDialog
        open={confirm.open}
        title={confirm.type === 'route' ? 'Xóa tuyến đường' : 'Xóa điểm dừng'}
        message={confirm.type === 'route' ? `Bạn có chắc muốn xóa tuyến "${confirm.payload?.name}"?` : `Bạn có chắc muốn xóa điểm dừng "${confirm.payload?.name}"?`}
        cancelText="Hủy"
        okText="Xóa"
        onCancel={() => setConfirm({ open: false, type: '', payload: null })}
        onOk={confirmDelete}
      />
    </>
  )
}
