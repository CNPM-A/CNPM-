import React, { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, FormControlLabel, Switch } from "@mui/material"

export default function DriverFormDialog({ open, onClose, initialValue, onSubmit }) {
  const [form, setForm] = useState({ name: '', phone_number: '', email: '', license_number: '', is_active: true })

  useEffect(() => {
    if (initialValue) setForm(initialValue)
    else setForm({ name: '', phone_number: '', email: '', license_number: '', is_active: true })
  }, [initialValue, open])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValue ? 'Sửa tài xế' : 'Thêm tài xế'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Họ tên" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Số điện thoại" name="phone_number" value={form.phone_number} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
          <TextField label="Số bằng lái" name="license_number" value={form.license_number} onChange={handleChange} fullWidth />
          <FormControlLabel
            control={<Switch checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />}
            label="Hoạt động"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSubmit(form)}>Lưu</Button>
      </DialogActions>
    </Dialog>
  )
}
