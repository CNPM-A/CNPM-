import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Stack, Chip } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import WarningIcon from '@mui/icons-material/Warning'
import { AdminService } from '../api/services'

export default function Alerts() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await AdminService.listAlerts()
      console. log('Alerts data:', data)
      setRows(data || [])
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Cảnh báo hệ thống
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Theo dõi các sự cố và cảnh báo ({rows.length} cảnh báo)
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData} sx={{ borderRadius: 2 }}>
          Làm mới
        </Button>
      </Stack>

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fee2e2', color: '#dc2626', borderRadius: 2 }}>
          Lỗi: {error}
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nội dung</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Xe</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow key={row._id || row.alert_id || index} hover>
                    <TableCell>
                      <Chip 
                        icon={<WarningIcon />}
                        size="small" 
                        label={row.type || 'INFO'} 
                        color={row.type === 'SOS' ? 'error' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>{row.message}</TableCell>
                    <TableCell>{row.bus_plate || row.busId?. licensePlate || '—'}</TableCell>
                    <TableCell>
                      {row.createdAt ?  new Date(row.createdAt).toLocaleString('vi-VN') : '—'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text. secondary">Không có cảnh báo nào</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}