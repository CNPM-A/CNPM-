import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Box, InputBase, Badge } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import LogoutIcon from '@mui/icons-material/Logout'
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ onSearch }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', color: '#1e293b' }} elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsBusFilledIcon sx={{ color: '#6366f1', fontSize: 32 }} />
          <Typography variant="h6" fontWeight="bold">
            Safe To School
          </Typography>
        </Box>

        {/* Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f1f5f9',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            width: 300,
          }}
        >
          <SearchIcon sx={{ color: '#94a3b8', mr: 1 }} />
          <InputBase placeholder="Tìm kiếm..." sx={{ flex: 1 }} onChange={(e) => onSearch?.(e.target.value)} />
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
