import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface Props {
  onShowLogin?: () => void;
}

const Register: React.FC<Props> = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowSuccess(true);
      } else {
        setMessage(data.error || 'Registration failed');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', px: 2, pt: { xs: 4, md: 6 }, pb: { xs: 7, md: 8 } }}>
      <Paper elevation={6} sx={{ p: 0, borderRadius: 4, width: '100%', maxWidth: 520, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)' } }}>
          <Box sx={{ position: 'relative' }}>
            <Typography variant="h4" fontWeight={800} mb={1}>Kayıt Ol</Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.95 }}>Hesap oluştur ve hemen başla</Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <form onSubmit={handleRegister}>
            <TextField fullWidth label="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} margin="normal" />
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
            <TextField fullWidth label="Parola" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />
            {message && <Typography color="error" variant="body2" mt={1}>{message}</Typography>}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button type="submit" variant="contained" sx={{ flex: 1, background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)', color: '#fff', fontWeight: 700, textTransform: 'none', py: 1.1, '&:hover': { background: 'linear-gradient(90deg, #00cec9 0%, #00b894 100%)' } }}>Kayıt Ol</Button>
              <Button type="button" variant="outlined" onClick={() => navigate('/login')} sx={{ flex: 1, borderColor: '#00b894', color: '#00695c', fontWeight: 700, textTransform: 'none', py: 1.05, '&:hover': { borderColor: '#00cec9', backgroundColor: 'rgba(0,206,201,0.08)' } }}>Giriş Yap</Button>
            </Box>
          </form>
        </Box>
      </Paper>

      <Dialog open={showSuccess} onClose={() => setShowSuccess(false)}>
        <DialogTitle>Kayıt Başarılı</DialogTitle>
        <DialogContent>
          <Typography>Giriş yaparak devam edebilirsin.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccess(false)} sx={{ color: '#00695c' }}>Kapat</Button>
          <Button onClick={() => { setShowSuccess(false); navigate('/login'); }} variant="contained" sx={{ background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)' }}>Girişe Git</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register;
