import React, { useEffect } from 'react';
import setMetaTags from '../utils/seo';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const UniversiteHazirlikIngilizce: React.FC = () => {
  useEffect(() => {
    setMetaTags({
      title: 'Üniversite İngilizce Hazırlık — Kelimeler, Konular ve Deneme Testleri',
      description: 'Üniversite İngilizce hazırlık için seviyeye göre (A1-A2-B1-B2) kelimeler, grammar konu anlatımları, okuma-yazma oyunları ve süreli deneme testleri.',
      keywords: 'üniversite ingilizce hazırlık, hazırlık ingilizce test, ingilizce hazırlık kelimeler, hazırlık atlama ingilizce',
      canonical: '/universite-ingilizce-hazirlik',
      ogImage: '/social-preview.svg'
    });

    // FAQ + ItemList schema
    const faq = document.createElement('script');
    faq.id = 'faq-universite';
    faq.type = 'application/ld+json';
    faq.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Hazırlık atlama için kaç puan gerekir?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Üniversiteye göre değişir; genellikle 60-80 arası. Kendi okulunun yönergesine bakmalısın.' } },
        { '@type': 'Question', 'name': 'Günde ne kadar çalışmalıyım?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'En az 30-45 dakika kelime + 20-30 dakika okuma/yazma; haftada 2 deneme hedeflenebilir.' } },
        { '@type': 'Question', 'name': 'Hangi kaynaklardan başlamalıyım?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A1-A2 temel kelime ve cümle yapıları, ardından bağlaç/edat ve okuma parçalarıyla devam.' } }
      ]
    });
    const list = document.createElement('script');
    list.id = 'itemlist-universite';
    list.type = 'application/ld+json';
    list.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Üniversite İngilizce Hazırlık Kaynakları',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'İngilizce Kelimeler', 'url': '/ingilizce-kelimeler' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Grammar Konuları', 'url': '/topics' },
        { '@type': 'ListItem', 'position': 3, 'name': 'İngilizce Testleri', 'url': '/ingilizce-testleri' },
        { '@type': 'ListItem', 'position': 4, 'name': 'Deneme Testleri', 'url': '/questions' }
      ]
    });
    document.head.appendChild(faq);
    document.head.appendChild(list);
    return () => { faq.remove(); list.remove(); };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', px: 2, pt: 0, pb: { xs: 12, md: 16 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ width: '100%', maxWidth: 960, borderRadius: 4, p: 0, mt: { xs: 1, md: '15px' }, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 5 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', textAlign: 'center' }}>
          <Typography component="h1" variant="h3" fontWeight={700} mb={1} sx={{ textShadow: '0 4px 8px rgba(0,0,0,0.25)', fontSize: { xs: '2rem', md: '2.7rem' } }}>Üniversite İngilizce Hazırlık</Typography>
          <Typography component="h2" variant="h6" sx={{ opacity: 0.95, mb: 2 }}>Kelimeler + Konular + Online Deneme Testleri</Typography>
          <Button component={Link} to="/ingilizce-kelimeler" variant="contained" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 3, px: 3, py: 1.2, boxShadow: '0 12px 28px rgba(0,184,148,0.35)', background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(6px)', '&:hover': { background: 'rgba(255,255,255,0.25)' } }}>İngilizce Kelimelere Git</Button>
        </Box>
        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="#00695c">Nasıl Çalışmalı?</Typography>
          <List>
            {[
              'A1/A2 kelimeleri tamamlayıp örnek cümlelerle pekiştir.',
              'Grammar konularında bağlaçlar, edatlar ve zamanlara odaklan.',
              'Okuma oyunu ile paragraf anlama hızını artır.',
              'Her hafta süreli deneme çözerek ölç; yanlışların üstünden geç.',
            ].map((s, i) => (
              <ListItem key={i} sx={{ pl: 0 }}>
                <ListItemText primaryTypographyProps={{ fontSize: 15 }} primary={`${i + 1}. ${s}`} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight={700} mb={2}>Hızlı Erişim</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
            <Button component={Link} to="/ingilizce-testleri" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>İngilizce Testleri</Button>
            <Button component={Link} to="/questions" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>Deneme Testleri</Button>
            <Button component={Link} to="/okuma" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>Okuma Oyunu</Button>
            <Button component={Link} to="/yazi-yazma" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>Yazma Oyunu</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UniversiteHazirlikIngilizce;
