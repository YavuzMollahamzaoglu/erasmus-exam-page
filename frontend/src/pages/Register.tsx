import React, { useState, useEffect } from 'react';
import setMetaTags from '../utils/seo';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface Props {
  onShowLogin?: () => void;
}

const Register: React.FC<Props> = () => {
  useEffect(() => {
    setMetaTags({
      title: 'Kayıt Ol — Hesap Oluştur',
      description: 'Hesap oluşturun ve İngilizce pratik yapmaya hemen başlayın. Basit kayıt formu ile üye olun.',
      keywords: 'kayıt ol, üye ol, hesap oluştur',
      canonical: '/register',
      ogImage: '/social-preview.svg'
    });
  }, []);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; name?: string; general?: string } >({});
  const [showSuccess, setShowSuccess] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const validateClient = () => {
    const errs: { email?: string; password?: string; name?: string } = {};
    const emailTrim = email.trim();
    const nameTrim = name.trim();
    // Basic email format check
    const emailOk = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(emailTrim);
    if (!emailTrim) errs.email = 'Email zorunludur';
    else if (!emailOk) errs.email = 'Geçerli bir email giriniz';
    if (!password) errs.password = 'Şifre zorunludur';
    else if (password.length < 6) errs.password = 'Şifre en az 6 karakter olmalı';
    // Name required + min length 2
    if (!nameTrim) errs.name = 'Ad Soyad zorunludur';
    else if (nameTrim.length < 2) errs.name = 'Ad Soyad en az 2 karakter olmalı';
    return errs;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setFieldErrors({});
    // Client-side validation first
    const clientErrs = validateClient();
    if (clientErrs.email || clientErrs.password || clientErrs.name) {
      setFieldErrors(clientErrs);
      return;
    }
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
        // Map express-validator errors
        if (Array.isArray(data?.errors) && data.errors.length) {
          const errs: { email?: string; password?: string; name?: string } = {};
          for (const err of data.errors) {
            if (err?.param === 'email' && !errs.email) errs.email = err.msg;
            else if (err?.param === 'password' && !errs.password) errs.password = err.msg;
            else if (err?.param === 'name' && !errs.name) errs.name = err.msg;
          }
          setFieldErrors(errs);
          if (!errs.email && !errs.password && !errs.name) {
            setMessage(data.errors[0]?.msg || 'Registration failed');
          }
        } else if (data?.error) {
          // Backend explicit error shape
          const errMsg: string = data.error;
          const errs: { email?: string; password?: string; name?: string } = {};
          if (errMsg.toLowerCase().includes('exists')) {
            errs.email = 'Bu email ile kayıtlı kullanıcı zaten var';
          }
          if (errs.email || errs.password || errs.name) {
            setFieldErrors(errs);
            // Field hatası varsa genel mesaj göstermeyelim (duplikeyi önle)
          } else {
            setMessage(errMsg);
          }
        } else if (data?.message) {
          // Sadece alan bazlı hata yoksa genel mesaj göster
          if (!fieldErrors.email && !fieldErrors.password && !fieldErrors.name) {
            setMessage(data.message);
          }
        } else {
          setMessage('Registration failed');
        }
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', px: 2, pt: { xs: 4, md: 6 }, pb: { xs: 12, md: 16 } }}>
      <Paper elevation={6} sx={{ p: 0, borderRadius: 4, width: '100%', maxWidth: 520, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)' } }}>
          <Box sx={{ position: 'relative' }}>
            <Typography variant="h4" fontWeight={800} mb={1}>Kayıt Ol</Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.95 }}>
              İngilizce hazırlık sayfamıza kayıt olun ve İngilizce gelişiminize katkıda bulunun.<br/>
              Sınavlara özel içerikler, pratik testler ve gelişmiş analizlerle İngilizcenizi bir üst seviyeye taşıyın. Hemen üye olun, avantajlardan faydalanmaya başlayın!
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <form onSubmit={handleRegister}>
            <TextField fullWidth label="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} margin="normal" error={Boolean(fieldErrors.name)} helperText={fieldErrors.name} />
            <TextField fullWidth label="Email (Giriş için)" placeholder="ornek@site.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" error={Boolean(fieldErrors.email)} helperText={fieldErrors.email}
              inputProps={{
                onInvalid: (e: React.FormEvent<HTMLInputElement>) => {
                  (e.currentTarget as HTMLInputElement).setCustomValidity('Geçerli bir e-posta adresi girin (ör: ornek@site.com)');
                },
                onInput: (e: React.FormEvent<HTMLInputElement>) => {
                  (e.currentTarget as HTMLInputElement).setCustomValidity('');
                },
              }}
            />
            <TextField fullWidth label="Parola" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" error={Boolean(fieldErrors.password)} helperText={fieldErrors.password} />
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
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={() => { setShowSuccess(false); navigate('/login'); }}
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)',
              px: 3,
              fontWeight: 800
            }}
          >
            GİRİŞ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register;
