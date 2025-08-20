import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';

interface Props {
  onLogin: (token: string) => void;
  onShowRegister: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', px: { xs: 2, md: 6 }, pt: { xs: 12, md: 24 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 1200,
          gap: 4,
        }}
      >
        {/* Sol Sütun: Başlık ve açıklama */}
        <Box sx={{ flex: 1, minWidth: 0, pl: { md: 6 }, pr: { md: 4 }, py: { xs: 4, md: 8 } }}>
          <Typography variant="h2" fontWeight={700} mb={2} color="#19376D" sx={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '.02em' }}>
            İngilizce Hazırlık
          </Typography>
          <Typography variant="h5" fontWeight={400} mb={2} color="#19376D">
            İngilizce hazırlık sürecinde giriş yap ve ilerlemeni takip et.
          </Typography>
        </Box>
        {/* Sağ Sütun: Login Kartı */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, minWidth: 340, bgcolor: '#fff', color: '#1a237e', boxShadow: 6, maxWidth: 400, mx: 'auto' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ padding: 12, borderRadius: 6, border: '1px solid #38bdf8', fontSize: 16 }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ padding: 12, borderRadius: 6, border: '1px solid #38bdf8', fontSize: 16 }}
              />
              <button type="submit" style={{ padding: 12, background: '#38bdf8', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, marginTop: 8, cursor: 'pointer' }}>Giriş Yap</button>
              <button type="button" style={{ padding: 12, background: '#fff', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: 6, fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={() => navigate('/register')}>Hesap Oluştur</button>
            </form>
            {message && <Typography color="error" align="center" mt={2}>{message}</Typography>}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
