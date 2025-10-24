import React, { useEffect, useState } from 'react';
import setMetaTags from '../utils/seo';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

interface Props {
  onLogin: (token: string) => void;
  onShowRegister: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;

  // Show popup if redirected with session=expired
  useEffect(() => {
    setMetaTags({
      title: 'Giriş — Hesabınıza Erişin',
      description: 'Hesabınıza giriş yaparak sınavlarınızı çözün ve ilerlemenizi takip edin.',
      keywords: 'giriş, hesabım, oturum aç',
      canonical: '/login',
      ogImage: '/social-preview.svg'
    });
    const params = new URLSearchParams(location.search);
    if (params.get('session') === 'expired') {
      setSnackOpen(true);
      // Clean the query to avoid re-showing on refresh
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [location.search]);

  const validateClient = () => {
    const errs: { email?: string; password?: string } = {};
    const emailTrim = email.trim();
    const emailOk = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(emailTrim);
    if (!emailTrim) errs.email = 'Email zorunludur';
    else if (!emailOk) errs.email = 'Geçerli bir email giriniz';
    if (!password) errs.password = 'Şifre zorunludur';
    return errs;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setFieldErrors({});
    const clientErrs = validateClient();
    if (clientErrs.email || clientErrs.password) {
      setFieldErrors(clientErrs);
      return;
    }
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
        // Try to map error to specific field when possible (and localize to TR)
        const apiErr: string | undefined = data?.error || data?.message;
        if (typeof apiErr === 'string') {
          const lower = apiErr.toLowerCase();
          const errs: { email?: string; password?: string } = {};
          if (lower.includes('email is incorrect')) {
            errs.email = 'E-posta adresi hatalı';
            setFieldErrors(errs);
            // Alan hatası gösterildiğinde genel mesajı tekrar göstermeyelim
            return;
          }
          if (lower.includes('password is incorrect')) {
            errs.password = 'Parola hatalı';
            setFieldErrors(errs);
            // Alan hatası gösterildiğinde genel mesajı tekrar göstermeyelim
            return;
          }
          if (lower.includes('email')) errs.email = 'E-posta ile ilgili bir hata oluştu';
          if (lower.includes('password') || lower.includes('şifre')) errs.password = 'Parola ile ilgili bir hata oluştu';
          if (Object.keys(errs).length) {
            setFieldErrors(errs);
            // Spesifik alan hataları varsa genel mesajı gösterme
          } else {
            setMessage('Giriş başarısız');
          }
        } else {
          setMessage('Giriş başarısız');
        }
      }
    } catch (err) {
      setMessage('Ağ hatası');
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
  // Pull the page content even higher on mobile
  pt: { xs: 3, md: 14 },
      pb: { xs: 12, md: 16 }
    }}>
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackOpen(false)} severity="info" variant="filled" sx={{ width: '100%', background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)' }}>
          Oturum süreniz bitmiştir. Lütfen tekrar giriş yapın.
        </Alert>
      </Snackbar>
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
          py: { xs: 2, md: 4 },
          // Center hero texts on mobile
          textAlign: { xs: 'center', md: 'left' }
        }}>
          <Typography 
            variant="h2" 
            fontWeight={800} 
            mb={1.5}
            sx={{ 
              fontSize: { xs: 34, sm: 44, md: 56 }, 
              lineHeight: 1.1, 
              letterSpacing: 0.2,
              textShadow: '0 2px 6px rgba(0,0,0,0.12)'
            }}
          >
            <Box component="span" sx={{ color: '#fff' }}>İngilizce</Box>{' '}
            <Box 
              component="span" 
              sx={{ 
                background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent'
              }}
            >
              Hazırlık
            </Box>
          </Typography>
      <Typography 
            variant="h5" 
            fontWeight={500} 
            sx={{ 
              color: 'rgba(44, 62, 80, 0.92)', 
              fontSize: { xs: 17, md: 21 }, 
              lineHeight: 1.5,
              mt: 2,
        maxWidth: '40ch',
        // Keep readable width but center it on mobile
        mx: { xs: 'auto', md: 0 }
            }}
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
                  placeholder="ornek@site.com" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  error={Boolean(fieldErrors.email)}
                  helperText={fieldErrors.email}
                  inputProps={{
                    onInvalid: (e: React.FormEvent<HTMLInputElement>) => {
                      (e.currentTarget as HTMLInputElement).setCustomValidity('Geçerli bir e-posta adresi girin (ör: ornek@site.com)');
                    },
                    onInput: (e: React.FormEvent<HTMLInputElement>) => {
                      (e.currentTarget as HTMLInputElement).setCustomValidity('');
                    },
                  }}
                />
                <TextField 
                  fullWidth 
                  label="Parola" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  error={Boolean(fieldErrors.password)}
                  helperText={fieldErrors.password}
                />
                {message && !fieldErrors.email && !fieldErrors.password && (
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
