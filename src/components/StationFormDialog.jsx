import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogActions, Button, TextField, Stack, Box, Typography, Alert } from "@mui/material"
import PlaceIcon from '@mui/icons-material/Place'

export default function StationFormDialog({ open, onClose, initialValue, onSubmit }) {
  const [form, setForm] = useState({ name: '', fullAddress: '', district: '', city: '', latitude: '', longitude: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || '',
        fullAddress: initialValue.address || initialValue.fullAddress || initialValue.address?.fullAddress || '',
        district: initialValue.district || initialValue.address?.district || '',
        city: initialValue.city || initialValue.address?.city || 'TP.HCM',
        latitude: initialValue.latitude || initialValue.address?.latitude || '',
        longitude: initialValue.longitude || initialValue.address?.longitude || ''
      })
    } else {
      setForm({ name: '', fullAddress: '', district: '', city: 'TP.HCM', latitude: '', longitude: '' })
    }
    setError('')
  }, [initialValue, open])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.name || !form.fullAddress) {
      setError('Vui lòng điền tên trạm và địa chỉ')
      return
    }
    if (!form.latitude || !form.longitude) {
      setError('Vui lòng nhập tọa độ (latitude, longitude)')
      return
    }
    onSubmit({
      name: form.name,
      address: form.fullAddress,
      fullAddress: form.fullAddress,
      district: form.district,
      city: form.city,
      latitude: form.latitude,
      longitude: form.longitude
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
      <Box sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', pt: 3, pb: 2, px: 3, textAlign: 'center' }}>
        <Box sx={{ width: 80, height: 80, bgcolor: 'white', borderRadius: '50%', mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <PlaceIcon sx={{ fontSize: 45, color: '#8b5cf6' }} />
        </Box>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
          {initialValue ? '✏️ Sửa thông tin trạm' : '📍 Thêm trạm mới'}
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        
        <Stack spacing={2.5}>
          <TextField label="Tên trạm *" name="name" value={form.name} onChange={handleChange} fullWidth placeholder="VD: Trường THPT Nguyễn Huệ" InputProps={{ sx: { borderRadius: 2 } }} />
          <TextField label="Địa chỉ đầy đủ *" name="fullAddress" value={form.fullAddress} onChange={handleChange} fullWidth multiline rows={2} placeholder="VD: 123 Lê Lợi, Quận 1" InputProps={{ sx: { borderRadius: 2 } }} />
          <Stack direction="row" spacing={2}>
            <TextField label="Quận/Huyện" name="district" value={form.district} onChange={handleChange} fullWidth placeholder="Quận 1" InputProps={{ sx: { borderRadius: 2 } }} />
            <TextField label="Thành phố" name="city" value={form.city} onChange={handleChange} fullWidth InputProps={{ sx: { borderRadius: 2 } }} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField label="Vĩ độ (Latitude) *" name="latitude" type="number" value={form.latitude} onChange={handleChange} fullWidth placeholder="10. 7769" InputProps={{ sx: { borderRadius: 2 } }} />
            <TextField label="Kinh độ (Longitude) *" name="longitude" type="number" value={form.longitude} onChange={handleChange} fullWidth placeholder="106.7009" InputProps={{ sx: { borderRadius: 2 } }} />
          </Stack>
          <Alert severity="info" sx={{ borderRadius: 2 }}>Có thể lấy tọa độ từ Google Maps bằng cách click chuột phải vào vị trí. </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2, px: 3 }}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 2, px: 3, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
          {initialValue ? 'Cập nhật' : 'Thêm trạm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}