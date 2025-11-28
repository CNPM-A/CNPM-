import React, { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from "@mui/material"

export default function RouteFormDialog({ open, onClose, initialValue, onSubmit }) {
  const [form, setForm] = useState({ name: '', description: '' })

  useEffect(() => {
    if (initialValue) setForm(initialValue)
    else setForm({ name: '', description: '' })
  }, [initialValue, open])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValue ? 'Sửa tuyến đường' : 'Thêm tuyến đường'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Tên tuyến" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Mô tả" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSubmit(form)}>Lưu</Button>
      </DialogActions>
    </Dialog>
  )
}
