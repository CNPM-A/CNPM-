import React, { useEffect, useMemo, useState } from 'react'
import { Paper, Typography, IconButton, Stack, Button, Toolbar, Box } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { AdminService } from '../api/services'
import { useOutletContext } from 'react-router-dom'
import StudentFormDialog from '../components/StudentFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import { DataGrid } from '@mui/x-data-grid'
import { useNotify } from '../hooks/useNotify'

export default function Students() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, row: null })
  const { q } = useOutletContext()
  const notify = useNotify()

  useEffect(() => {
    setLoading(true)
    AdminService.listStudents(q).then(setRows).finally(() => setLoading(false))
  }, [q])

  const refresh = () => { setLoading(true); return AdminService.listStudents(q).then(setRows).finally(() => setLoading(false)) }
  const onAdd = () => { setEditing(null); setOpen(true) }
  const onEdit = (row) => { setEditing(row); setOpen(true) }
  const onDelete = async (row) => { setConfirm({ open: true, row }) }

  const confirmDelete = async () => {
    try {
      if (confirm.row) await AdminService.deleteStudent(confirm.row.student_id)
      notify.success('Xóa thành công')
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setConfirm({ open: false, row: null })
    refresh()
  }

  const onSubmit = async (form) => {
    try {
      if (editing) { await AdminService.updateStudent(editing.student_id, form); notify.success('Cập nhật thành công') }
      else { await AdminService.createStudent(form); notify.success('Tạo thành công') }
    } catch {
      notify.error('Có lỗi xảy ra')
    }
    setOpen(false); setEditing(null); refresh()
  }

  const columns = useMemo(() => [
    { field: 'student_id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Họ tên', flex: 1, minWidth: 160 },
    { field: 'class', headerName: 'Lớp', width: 120 },
    { field: 'gender', headerName: 'Giới tính', width: 120 },
    { field: 'date_of_birth', headerName: 'Ngày sinh', width: 150 },
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
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Học sinh</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={onAdd}>Thêm học sinh</Button>
      </Stack>
      <Paper sx={{ height: 520, width: '100%' }}>
        <Toolbar variant="dense" />
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(r) => r.student_id}
          pagination
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          loading={loading}
        />
      </Paper>
      <StudentFormDialog open={open} onClose={() => setOpen(false)} initialValue={editing} onSubmit={onSubmit} />
      <ConfirmDialog
        open={confirm.open}
        title="Xóa học sinh"
        message={`Bạn có chắc muốn xóa học sinh "${confirm.row?.name}"?`}
        cancelText="Hủy"
        okText="Xóa"
        onCancel={() => setConfirm({ open: false, row: null })}
        onOk={confirmDelete}
      />
    </Box>
  )
}
