import React, { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from "@mui/material"

const genders = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
]

export default function StudentFormDialog({ open, onClose, initialValue, onSubmit }) {
  const [form, setForm] = useState({ name: '', class: '', gender: '', date_of_birth: '' })

  useEffect(() => {
    if (initialValue) setForm(initialValue)
    else setForm({ name: '', class: '', gender: '', date_of_birth: '' })
  }, [initialValue, open])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValue ? 'Sửa học sinh' : 'Thêm học sinh'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Họ tên" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Lớp" name="class" value={form.class} onChange={handleChange} fullWidth />
          <TextField select label="Giới tính" name="gender" value={form.gender} onChange={handleChange} fullWidth>
            {genders.map((g) => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
          </TextField>
          <TextField label="Ngày sinh" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSubmit(form)}>Lưu</Button>
      </DialogActions>
    </Dialog>
  )
}
