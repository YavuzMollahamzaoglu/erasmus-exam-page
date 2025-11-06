import React, { useState, useEffect } from 'react';
import setMetaTags from '../utils/seo';
import { Paper, Tabs, Tab, Box, Typography, TextField, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';


type Topic = { title: string; summary: string; example: string; tip?: string };
type LevelKey = 'A1' | 'A2' | 'B1' | 'B2';
const topicsData: Record<LevelKey, Topic[]> = {
  A1: [
    {
      title: '"To Be" Fiili (am, is, are) – "I am a student."',
      summary: 'Temel "to be" kullanımı: durum, kimlik ve yer belirtme.',
      example: 'I am a student. (Ben bir öğrenciyim.)'
    },
    {
      title: 'Simple Present Tense (Geniş Zaman) – "She works in a bank."',
      summary: 'Günlük rutinler ve genel doğrular için kullanılır.',
      example: 'She works in a bank. (O bir bankada çalışır.)'
    },
    {
      title: 'This, That, These, Those – "This is my book."',
      summary: 'Yakın/uzak işaret zamirleri.',
      example: 'This is my book. (Bu benim kitabım.)'
    },
    {
      title: 'There is / There are – "There is a cat in the garden."',
      summary: 'Bir yerde bir şeyin varlığını ifade eder.',
      example: 'There is a cat in the garden. (Bahçede bir kedi var.)'
    },
    {
      title: 'Can / Can’t (Yetenek Bildiren Cümleler) – "I can swim."',
      summary: 'Yetenek, izin veya olasılık için kullanılır.',
      example: 'I can swim. (Yüzebilirim.)'
    },
    {
      title: 'Basic Question Forms (Temel Soru Kalıpları) – "Do you like music?"',
      summary: 'Yes/No ve Wh- soruları için temel kalıplar.',
      example: 'Do you like music? (Müziği sever misin?)'
    }
  ],
  A2: [
    {
      title: 'İhtimal anlatan ifadeler – "She may come tomorrow."',
      summary: 'may, might, could, must, can’t ile olasılık ve kesinlik.',
      example: 'She may come tomorrow. (Yarın gelebilir.)'
    },
    {
      title: 'Phrasal Verbs – "Please turn on the lights."',
      summary: 'Fiil + edat/zarf ile anlam değiştiren yapılar.',
      example: 'Please turn on the lights. (Lütfen ışıkları aç.)'
    }
  ],
  B1: [],
  B2: []
};

const levels = ['A1', 'A2', 'B1', 'B2'];

const frostedPaper = {
  maxWidth: 1200,
  width: '100%',
  borderRadius: 4,
  overflow: 'hidden',
  mt: { xs: 1, md: '15px' },
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: { xs: '0 8px 18px rgba(0,0,0,0.08)', md: '0 20px 40px rgba(0,0,0,0.1)' },
} as const;

const TopicsPage: React.FC = () => {
  useEffect(() => {
    setMetaTags({
      title: 'Konular — Dilbilgisi Konuları ve Örnekler',
      description: 'A1-B2 seviyeleri için temel dilbilgisi konuları, örnekler ve ipuçları. Sınav hazırlığına uygun açıklamalar.',
      keywords: 'dilbilgisi konuları, grammar konuları, a1 a2 b1 b2',
      canonical: '/topics',
      ogImage: '/social-preview.svg'
    });
  }, []);
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Türkçe karakter ve büyük/küçük harf uyumlu arama
  const normalizeTR = (s: string) =>
    s
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'g')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'c')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'u');

  // For now keep accordion structure but show only 1-2 dummy topics per level
  // (content will be filled later by the editor). This prevents large blocks
  // of content showing while we prepare the final material.
  const displayTopics = topicsData[selectedLevel as LevelKey].slice(0, 2);

  return (
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', px: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0, pb: { xs: 12, md: 16 }, overflowX: 'hidden' }}>
      <Paper elevation={6} sx={frostedPaper}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)', zIndex: 0 } }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography component="h1" variant="h4" fontWeight={700} mb={2} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: 'clamp(1.3rem, 2vw, 2rem)' }}>Konular</Typography>
            <Typography component="h2" variant="h6" sx={{ opacity: 0.95, fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)' }}>A1–B2 seviyelerinde özet ve örneklerle İngilizce konuları</Typography>
          </Box>
        </Box>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Tabs
            value={selectedLevel}
            onChange={(_, val) => setSelectedLevel(val)}
            variant={window.innerWidth < 600 ? 'scrollable' : 'fullWidth'}
            scrollButtons={window.innerWidth < 600 ? 'auto' : false}
            allowScrollButtonsMobile
            sx={{ mb: 2, overflowX: { xs: 'auto', sm: 'visible' }, minWidth: { xs: 340, sm: 'unset' }, justifyContent: { xs: 'center', sm: 'flex-start' }, display: 'flex' }}
          >
            {levels.map(level => (
              <Tab key={level} value={level} label={level} sx={{ minWidth: 80 }} />
            ))}
          </Tabs>
          <TextField
            fullWidth
            placeholder="Konu ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          {/* Topics as Accordions */}
          <Box sx={{ mb: 3 }}>
            {displayTopics.map((topic: Topic, idx: number) => (
              <Accordion 
                key={idx}
                expanded={expanded === `panel${idx}`}
                onChange={handleAccordionChange(`panel${idx}`)}
                sx={{
                  mb: 2,
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0, 184, 148, 0.15)',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: '0 0 16px 0',
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#00695c' }} />}
                  sx={{
                    backgroundColor: 'rgba(0, 184, 148, 0.05)',
                    borderBottom: expanded === `panel${idx}` ? '1px solid rgba(0, 184, 148, 0.15)' : 'none',
                    minHeight: '64px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 184, 148, 0.1)',
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0',
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={700} 
                    color="#00695c" 
                    sx={{ fontSize: { xs: 18, md: 20 } }}
                  >
                    {topic.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    p: { xs: 2.5, md: 4 },
                    backgroundColor: '#fff',
                  }}
                >
                  {/* İçerikler geçici olarak kaldırıldı - sadece yapı kalsın */}
                  <Box sx={{
                    mb: 1,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(0,184,148,0.05)',
                    border: '1px dashed rgba(0,184,148,0.25)',
                    color: '#00695c',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    Bu konu içerikleri güncelleniyor. Yakında eklenecek.
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
            {displayTopics.length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Bu seviyede aradığınız konu bulunamadı.
              </Typography>
            )}
            {/* Informational note for editors */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'transparent', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Gelecekte konu başlıklarını ve içeriklerini göndereceğim, şu an sadece yapı ve iyileştirmeleri yap.</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TopicsPage;
