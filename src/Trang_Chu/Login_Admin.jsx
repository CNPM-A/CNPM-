import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField,
  Button,
  Paper,
  Stack,
  Link
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';

export default function Login_Admin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // TODO: Thêm logic xác thực đăng nhập
    console.log('Admin login:', { email, password });
    
    // Chuyển đến Dashboard sau khi đăng nhập
    navigate('/admin/dashboard');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: '#f1f5f9',
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={6}
          sx={{ 
            p: 5,
            borderRadius: 4,
            bgcolor: 'white'
          }}
        >
          {/* Header */}
          <Stack alignItems="center" sx={{ mb: 4 }}>
            <Box 
              sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: '#6366f1',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mb: 2
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e293b' }}>
              Đăng nhập Admin
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
              Vui lòng nhập thông tin đăng nhập của bạn
            </Typography>
          </Stack>

          {/* Form */}
          <Box component="form" onSubmit={handleLogin}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, color: '#1e293b' }}>
              Email
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập email của bạn"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />

            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, color: '#1e293b' }}>
              Mật khẩu
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              sx={{ 
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link href="#" underline="hover" sx={{ fontSize: '0.875rem', color: '#6366f1' }}>
                Quên mật khẩu?
              </Link>
            </Box>

            <Button 
              fullWidth 
              type="submit"
              variant="contained"
              sx={{ 
                bgcolor: '#6366f1',
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                mb: 2,
                '&:hover': { bgcolor: '#4f46e5' }
              }}
            >
              Đăng nhập
            </Button>

            <Button 
              fullWidth 
              variant="text"
              onClick={() => navigate('/')}
              sx={{ 
                color: '#64748b',
                textTransform: 'none',
              }}
            >
              ← Quay lại chọn vai trò
            </Button>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
}