import React, { useEffect } from 'react';
import setMetaTags from '../utils/seo';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setMetaTags({
      title: 'Sayfa Bulunamadı — 404',
      description: 'Aradığınız sayfa bulunamadı. Ana sayfaya dönebilir veya popüler sayfalarımıza gidebilirsiniz.',
      keywords: '404, sayfa bulunamadı, ingilizce hazırlık',
      canonical: '/404'
    });
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2, pt: 0, pb: { xs: 12, md: 16 } }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, maxWidth: 720, width: '100%', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography component="h1" variant="h4" fontWeight={800} color="#00695c" gutterBottom>Sayfa Bulunamadı</Typography>
        <Typography sx={{ color: '#455a64', mb: 3 }}>Üzgünüz, aradığınız sayfa taşınmış olabilir ya da hiç var olmamış olabilir.</Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button onClick={() => navigate('/')} variant="contained" sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff' }}>Ana Sayfa</Button>
          <Button onClick={() => navigate('/topics')} variant="outlined">Konular</Button>
          <Button onClick={() => navigate('/words')} variant="outlined">Kelimeler</Button>
          <Button onClick={() => navigate('/questions')} variant="outlined">Testler</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;
