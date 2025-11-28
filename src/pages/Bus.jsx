import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Chip, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { AdminService } from '../api/services'
import { useOutletContext } from 'react-router-dom'
import BusFormDialog from '../components/BusFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { DataGrid } from '@mui/x-data-grid'
import { useNotify } from '../hooks/useNotify'
import { StatusChip } from '../utils/status'

export default function Buses() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, row: null })
  const { q } = useOutletContext()
  const notify = useNotify()

  useEffect(() => {
    setLoading(true)
    AdminService.listBuses(q).then(setRows).finally(() => setLoading(false))
  }, [q])

  const refresh = () => { setLoading(true); return AdminService.listBuses(q).then(setRows).finally(() => setLoading(false)) }
  const onAdd = () => { setEditing(null); setOpen(true) }
  const onEdit = (row) => { setEditing(row); setOpen(true) }
  const onDelete = (row) => setConfirm({ open: true, row })

  const confirmDelete = async () => {
    try {
      if (confirm.row) await AdminService.deleteBus(confirm.row.bus_id)
      notify.success('Xóa thành công')
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setConfirm({ open: false, row: null })
    refresh()
  }

  const onSubmit = async (form) => {
    try {
      if (editing) { await AdminService.updateBus(editing.bus_id, form); notify.success('Cập nhật thành công') }
      else { await AdminService.createBus(form); notify.success('Tạo thành công') }
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setOpen(false); setEditing(null); refresh()
  }

  const columns = useMemo(() => [
    { field: 'bus_id', headerName: 'ID', width: 90 },
    { field: 'plate_number', headerName: 'Biển số', width: 160 },
    { field: 'model', headerName: 'Model', flex: 1, minWidth: 160 },
    { field: 'capacity', headerName: 'Sức chứa', width: 120 },
    {
      field: 'status', headerName: 'Trạng thái', width: 150,
      renderCell: (params) => <StatusChip code={params.value} />
    },
    {
      field: 'actions', headerName: 'Hành động', width: 120, sortable: false, filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => onEdit(params.row)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => onDelete(params.row)}><DeleteIcon fontSize="small" /></IconButton>
        </Stack>
      )
    },
  ], [])

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Xe buýt</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={onAdd}>Thêm xe</Button>
      </Stack>
      <Paper sx={{ height: 520, width: '100%' }}>
        <Toolbar variant="dense" />
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(r) => r.bus_id}
          pagination
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          loading={loading}
        />
      </Paper>
      <BusFormDialog open={open} onClose={() => setOpen(false)} initialValue={editing} onSubmit={onSubmit} />
      <ConfirmDialog
        open={confirm.open}
        title="Xóa xe buýt"
        message={`Bạn có chắc muốn xóa xe buýt "${confirm.row?.plate_number}"?`}
        cancelText="Hủy"
        okText="Xóa"
        onCancel={() => setConfirm({ open: false, row: null })}
        onOk={confirmDelete}
      />
    </>
  )
}
