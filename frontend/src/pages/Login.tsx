import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';

interface Props {
  onLogin: (token: string) => void;
  onShowRegister: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
        navigate('/');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#b2dfdb', 
      display: 'flex', 
      alignItems: 'flex-start',
      justifyContent: 'center',
      px: { xs: 2, md: 6 },
      pt: { xs: 10, md: 14 },
      pb: { xs: 7, md: 10 }
    }}>
      {/* Two-column layout like the old page */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 1200,
        gap: { xs: 3, md: 6 }
      }}>
        {/* Left hero: title + subtitle */}
        <Box sx={{ 
          flexGrow: 0,
          flexBasis: { md: '65%' },
          maxWidth: { md: '65%' },
          minWidth: 0, 
          pl: { md: 6 }, 
          pr: { md: 2 }, 
          py: { xs: 2, md: 4 } 
        }}>
          <Typography 
            variant="h2" 
            fontWeight={800} 
            mb={2}
            sx={{ fontSize: { xs: 36, md: 52 }, lineHeight: 1.15, textShadow: '0 2px 6px rgba(0,0,0,0.12)' }}
          >
            <Box component="span" sx={{ color: '#fff' }}>İngilizce</Box>{' '}
            <Box component="span" sx={{ color: '#fff' }}>Hazırlık</Box>
          </Typography>
          <Typography 
            variant="h5" 
            fontWeight={400} 
            color="#19376D"
            sx={{ fontSize: { xs: 18, md: 22 } }}
          >
            İngilizce hazırlık sürecinde giriş yap ve ilerlemeni takip et.
          </Typography>
        </Box>

        {/* Right column: the new styled login card */}
        <Box sx={{ 
          flexGrow: 0,
          flexBasis: { md: '35%' },
          maxWidth: { md: '35%' },
          minWidth: 0, 
          display: 'flex', 
          justifyContent: 'center' 
        }}>
          <Paper 
            elevation={6}
            sx={{
              p: 0,
              borderRadius: 4,
              width: '100%',
              maxWidth: 400,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Header merged with top */}
            <Box sx={{
              background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
              color: '#fff',
              p: { xs: 3, md: 4 },
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(4px)'
              }
            }}>
              <Box sx={{ position: 'relative' }}>
                <Typography variant="h4" fontWeight={800} mb={1}>Giriş Yap</Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.95 }}>Hesabına giriş yap ve ilerlemeni takip et</Typography>
              </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <form onSubmit={handleLogin}>
                <TextField 
                  fullWidth 
                  label="Email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                />
                <TextField 
                  fullWidth 
                  label="Parola" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                />
                {message && (
                  <Typography color="error" variant="body2" mt={1}>{message}</Typography>
                )}
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button 
                    type="submit" 
                    variant="contained"
                    sx={{
                      flex: 1,
                      background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      textTransform: 'none',
                      py: 1.1,
                      '&:hover': { background: 'linear-gradient(90deg, #00cec9 0%, #00b894 100%)' }
                    }}
                  >Giriş Yap</Button>
                  <Button 
                    type="button" 
                    variant="outlined"
                    onClick={() => navigate('/register')}
                    sx={{
                      flex: 1,
                      borderColor: '#00b894',
                      color: '#00695c',
                      fontWeight: 700,
                      textTransform: 'none',
                      py: 1.05,
                      '&:hover': { borderColor: '#00cec9', backgroundColor: 'rgba(0,206,201,0.08)' }
                    }}
                  >Kayıt Ol</Button>
                </Box>
              </form>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
