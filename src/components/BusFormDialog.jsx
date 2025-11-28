import React, { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from "@mui/material"

const statuses = [
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Không hoạt động" },
  { value: "MAINTENANCE", label: "Bảo trì" },
]

export default function BusFormDialog({ open, onClose, initialValue, onSubmit }) {
  const [form, setForm] = useState({ plate_number: '', model: '', capacity: '', status: 'ACTIVE' })

  useEffect(() => {
    if (initialValue) setForm(initialValue)
    else setForm({ plate_number: '', model: '', capacity: '', status: 'ACTIVE' })
  }, [initialValue, open])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValue ? 'Sửa xe buýt' : 'Thêm xe buýt'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Biển số" name="plate_number" value={form.plate_number} onChange={handleChange} fullWidth />
          <TextField label="Model" name="model" value={form.model} onChange={handleChange} fullWidth />
          <TextField label="Sức chứa" name="capacity" type="number" value={form.capacity} onChange={handleChange} fullWidth />
          <TextField select label="Trạng thái" name="status" value={form.status} onChange={handleChange} fullWidth>
            {statuses.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSubmit(form)}>Lưu</Button>
      </DialogActions>
    </Dialog>
  )
}
