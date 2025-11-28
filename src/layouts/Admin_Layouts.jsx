import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Toolbar } from '@mui/material'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function Admin_Layouts() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Nội dung chính */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <Topbar />

        {/* Nội dung trang */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f1f5f9' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
