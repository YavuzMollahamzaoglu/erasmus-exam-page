import React, { useEffect } from 'react';
import setMetaTags from '../utils/seo';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const ErasmusExamLanding: React.FC = () => {
  useEffect(() => {
    setMetaTags({
      title: 'Erasmus İngilizce Sınavı Hazırlık — Online Deneme Testleri',
      description: 'Erasmus İngilizce sınavı için seviyeye göre (A1 A2 B1 B2) ücretsiz online deneme testleri, kelime listeleri, okuma ve yazma oyunları. Gerçek süreli sınav pratiği yap.',
      keywords: 'erasmus ingilizce sınavı, erasmus deneme sınavı, erasmus ingilizce test, erasmus ingilizce hazırlık, erasmus kelimeler',
      canonical: '/erasmus-ingilizce-sinavi',
      ogImage: '/social-preview.svg'
    });

    // FAQ + ItemList schema injection
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.id = 'faq-erasmus';
    faqScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Erasmus İngilizce sınavı için hangi seviyeden başlamalıyım?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Seviyen A2 veya B1 altındaysa önce A1-A2 kelime ve temel grammar konularını tamamlayıp sonra sınav denemelerine geçmelisin.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Erasmus sınavı için kaç deneme çözmeliyim?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'En az 5 farklı deneme çözerek süre yönetimi ve soru tipi tanıma becerini güçlendirebilirsin.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Erasmus İngilizce sınavında hangi bölümler var?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Genellikle kelime ve yapı bilgisi, okuma, dinleme (bazı üniversitelerde), yazma ve bazen konuşma bölümleri bulunur.'
          }
        }
      ]
    });
    const listScript = document.createElement('script');
    listScript.type = 'application/ld+json';
    listScript.id = 'itemlist-erasmus';
    listScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Erasmus İngilizce Sınavı Kaynakları',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Seviye Bazlı Kelime Listeleri', 'url': '/ingilizce-kelimeler' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Grammar Konuları', 'url': '/topics' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Okuma Oyunu', 'url': '/okuma' },
        { '@type': 'ListItem', 'position': 4, 'name': 'Yazma Oyunu', 'url': '/yazi-yazma' },
        { '@type': 'ListItem', 'position': 5, 'name': 'Kelime Avı Oyunu', 'url': '/kelime-avi' },
        { '@type': 'ListItem', 'position': 6, 'name': 'Deneme Testleri', 'url': '/questions' }
      ]
    });
    document.head.appendChild(faqScript);
    document.head.appendChild(listScript);
    return () => {
      faqScript.remove();
      listScript.remove();
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', px: 2, pt: 0, pb: { xs: 12, md: 16 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ width: '100%', maxWidth: 960, borderRadius: 4, p: 0, mt: { xs: 1, md: '15px' }, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 5 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', textAlign: 'center' }}>
          <Typography component="h1" variant="h3" fontWeight={700} mb={1} sx={{ textShadow: '0 4px 8px rgba(0,0,0,0.25)', fontSize: { xs: '2rem', md: '2.7rem' } }}>Erasmus İngilizce Sınavı Hazırlık</Typography>
          <Typography component="h2" variant="h6" sx={{ opacity: 0.95, mb: 2 }}>Seviye bazlı kelime + grammar + deneme testleri</Typography>
          <Button component={Link} to="/questions" variant="contained" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 3, px: 3, py: 1.2, boxShadow: '0 12px 28px rgba(0,184,148,0.35)', background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(6px)', '&:hover': { background: 'rgba(255,255,255,0.25)' } }}>Deneme Testlerini Aç</Button>
        </Box>
        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} mb={2} color="#00695c">Neden bu kaynak?</Typography>
          <Typography mb={2}>Gerçek sınav hızını kazanmak için zaman tutan deneme testleri, eksik olduğun kelime/grammar konularını hızlıca tamamlamak için A1-A2-B1-B2 kelime listeleri ve interaktif oyunlar bir arada.</Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight={700} mb={2}>Adım Adım Erasmus Hazırlık</Typography>
          <List>
            {[
              'Seviyeni belirle: A1/A2 ise önce temel kelime + cümle yapılarını tamamla.',
              'Kelime avı ve eşleştirme oyunları ile 5-10 dakikalık günlük tekrar yap.',
              'Okuma oyunu ile bağlam içinde kelime & yapı tanımlama pratiği yap.',
              'Yazma mini oyunlarında cümle üretimini hızlandır.',
              'Her hafta en az 2 süreli deneme testi çözerek gelişimini ölç.',
              'Yanlışlara açıklama kısmını inceleyip kişisel not çıkar.'
            ].map((step, idx) => (
              <ListItem key={idx} sx={{ pl: 0 }}>
                <ListItemText primaryTypographyProps={{ fontSize: 15 }} primary={`${idx + 1}. ${step}`} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight={700} mb={2}>Hızlı Erişim</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
            <Button component={Link} to="/ingilizce-kelimeler" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>İngilizce Kelimeler</Button>
            <Button component={Link} to="/topics" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>Grammar Konuları</Button>
            <Button component={Link} to="/questions" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>Deneme Testleri</Button>
            <Button component={Link} to="/okuma" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>Okuma Oyunu</Button>
            <Button component={Link} to="/yazi-yazma" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999 }}>Yazma Oyunu</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErasmusExamLanding;
