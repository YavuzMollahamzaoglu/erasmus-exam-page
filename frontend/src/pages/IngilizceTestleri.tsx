import React, { useEffect } from 'react';
import setMetaTags from '../utils/seo';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
// Removed ShareBanner import (share only in footer)
import { Link } from 'react-router-dom';

const IngilizceTestleri: React.FC = () => {
  useEffect(() => {
    setMetaTags({
      title: 'İngilizce Testleri — Online Denemeler ve Oyunlar',
      description: 'İngilizce testleri ve oyunları: deneme sınavları, kelime avı, kelime eşleştirme, okuma ve yazma. Erasmus ve üniversite hazırlık için pratik yap.',
      keywords: 'ingilizce testleri, online ingilizce test, ingilizce deneme, erasmus ingilizce test, üniversite hazırlık test',
      canonical: '/ingilizce-testleri',
      ogImage: '/assets/social/ingilizce-testleri-1200x630.svg'
    });

    const list = document.createElement('script');
    list.id = 'itemlist-testleri';
    list.type = 'application/ld+json';
    list.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'İngilizce Testleri ve Oyunları',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Deneme Testleri', 'url': '/questions' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Kelime Avı', 'url': '/kelime-avi' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Kelime Eşleştirme', 'url': '/kelime-eslestirme' },
        { '@type': 'ListItem', 'position': 4, 'name': 'Okuma Oyunu', 'url': '/okuma' },
        { '@type': 'ListItem', 'position': 5, 'name': 'Yazma Oyunu', 'url': '/yazi-yazma' },
        { '@type': 'ListItem', 'position': 6, 'name': 'Boşluk Doldurma', 'url': '/bosluk-doldurma' }
      ]
    });
    document.head.appendChild(list);
    return () => { list.remove(); };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', px: 2, pt: 0, pb: { xs: 12, md: 16 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ width: '100%', maxWidth: 980, borderRadius: 4, p: 0, mt: { xs: 1, md: '15px' }, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 5 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', textAlign: 'center' }}>
          <Typography component="h1" variant="h3" fontWeight={700} mb={1} sx={{ textShadow: '0 4px 8px rgba(0,0,0,0.25)', fontSize: { xs: '2rem', md: '2.6rem' } }}>İngilizce Testleri</Typography>
          <Typography component="h2" variant="h6" sx={{ opacity: 0.95, mb: 2 }}>Deneme sınavları ve interaktif oyunlarla pratik yap</Typography>
          <Button component={Link} to="/questions" variant="contained" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 3, px: 3, py: 1.2, boxShadow: '0 12px 28px rgba(0,184,148,0.35)', background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(6px)', '&:hover': { background: 'rgba(255,255,255,0.25)' } }}>Deneme Testlerini Aç</Button>
        </Box>
        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {[{ t: 'Deneme Testleri', d: 'Gerçek süreli sınav deneyimi ile tüm seviyelerde deneme çöz.', to: '/questions' },
              { t: 'Kelime Avı', d: 'Seviyeye göre kelime bilgini hızla ölç ve geliştir.', to: '/kelime-avi' },
              { t: 'Kelime Eşleştirme', d: 'Anlam ve kelimeyi doğru eşleştir, hafızanı güçlendir.', to: '/kelime-eslestirme' },
              { t: 'Okuma Oyunu', d: 'Paragraf içinde doğru seçeneği bularak anlama pratiği yap.', to: '/okuma' },
              { t: 'Yazma Oyunu', d: 'İpucuyla cümle üret, yazma hızını artır.', to: '/yazi-yazma' },
              { t: 'Boşluk Doldurma', d: 'Bağlamdan doğru kelimeyi seç, dil bilgisini pekiştir.', to: '/bosluk-doldurma' }].map((c) => (
              <Paper key={c.t} sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(0,184,148,0.18)' }}>
                <Typography fontWeight={700} color="#00695c" gutterBottom>{c.t}</Typography>
                <Typography color="#2c3e50" gutterBottom>{c.d}</Typography>
                <Button component={Link} to={c.to} variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>Başla</Button>
              </Paper>
            ))}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" color="text.secondary">Bu sayfa "ingilizce testleri", "online ingilizce test" ve benzeri aramalar için optimize edilmiştir.</Typography>
        </Box>
      </Paper>
  {/* Share banner removed per request */}
    </Box>
  );
};

export default IngilizceTestleri;
