import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';

interface Props {
  onShowLogin: () => void;
}

const Register: React.FC<Props> = ({ onShowLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setMessage('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, minWidth: 340, bgcolor: '#fff', color: '#1a237e', boxShadow: 6 }}>
        <Typography variant="h4" fontWeight={700} mb={3} align="center">Register</Typography>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ padding: 12, borderRadius: 6, border: '1px solid #38bdf8', fontSize: 16 }}
          />
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
          <button type="submit" style={{ padding: 12, background: '#38bdf8', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, marginTop: 8 }}>Register</button>
        </form>
        {message && <Typography color="error" align="center" mt={2}>{message}</Typography>}
        {showSuccess && (
          <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <Paper sx={{ p: 4, borderRadius: 3, minWidth: 280, textAlign: 'center' }}>
              <Typography variant="h5" mb={2}>Registration Successful!</Typography>
              <Typography mb={3}>You can now log in.</Typography>
              <button
                style={{ padding: 10, background: '#38bdf8', color: '#fff', border: 'none', borderRadius: 4, width: '100%', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}
                onClick={() => {
                  setShowSuccess(false);
                  navigate('/login');
                }}
              >
                Go to Login
              </button>
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Register;
