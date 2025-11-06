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
      title: '"To Be" Fiili (am, is, are)',
      summary: "Temel 'to be' kullanımı: durum, kimlik ve yer belirtme.",
      example: 'I am a student. (Ben bir öğrenciyim.)'
    },
    {
      title: 'Simple Present Tense (Geniş Zaman)',
      summary: 'Günlük rutinler ve genel doğrular için kullanılır; he/she/it -s takısı.',
      example: 'She works in a bank. (O bir bankada çalışır.)'
    },
    {
      title: 'This, That, These, Those',
      summary: 'İşaret zamirleri ve işaret sıfatlarının kullanımı; yakın/uzak ayrımı.',
      example: 'This is my book. (Bu benim kitabım.)'
    },
    {
      title: 'There is / There are',
      summary: 'Bir yerde bir şeyin varlığını veya yokluğunu ifade etme yapıları.',
      example: 'There is a cat in the garden. (Bahçede bir kedi var.)'
    },
    {
      title: 'Can / Can’t (Yetenek Bildiren Cümleler)',
      summary: 'Yetenek, izin veya basit olasılık ifade ederken kullanılan yapı.',
      example: 'I can swim. (Yüzebilirim.)'
    },
    {
      title: 'Basic Question Forms (Temel Soru Kalıpları)',
      summary: 'Yes/No ve Wh- soru kalıpları ile temel soru oluşturma.',
      example: 'Do you like music? (Müziği sever misin?)'
    }
  ],
  A2: [
    {
      title: 'Simple Past Tense (Geçmiş Zaman)',
      summary: 'Geçmişte belirli bir zamanda tamamlanmış eylemler ve zaman ifadeleri.',
      example: 'I visited London last year. (Geçen yıl Londra’yı ziyaret ettim.)'
    },
    {
      title: 'Present Continuous Tense (Şimdiki Zaman)',
      summary: 'Şu anda devam eden veya geçici durumları anlatmak için kullanılır.',
      example: 'She is studying now. (O şimdi ders çalışıyor.)'
    },
    {
      title: 'Countable & Uncountable Nouns',
      summary: 'Sayılabilen ve sayılamayan isimlerin ayrımı ve miktar ifadeleriyle kullanımı.',
      example: 'Many apples (countable), much water (uncountable).'
    },
    {
      title: 'Adjectives & Adverbs (Sıfatlar ve Zarflar)',
      summary: 'Sıfatların ve zarfların kullanımı, sıfat-zarf dönüşümleri ve yerleri.',
      example: 'He is a fast runner. / He runs quickly.'
    },
    {
      title: 'Have to / Need to (Zorunluluk Bildiren Yapılar)',
      summary: 'Zorunluluk, gereklilik ve izin ifadelerinde have to / need to kullanımı.',
      example: 'I have to go to work. (İşe gitmem gerekiyor.)'
    }
  ],
  B1: [
    {
      title: 'Present Perfect Tense',
      summary: 'Geçmişte başlayıp şu ana etkisi veya bağlantısı olan eylemler.',
      example: 'I have lived here for three years. (Üç yıldır burada yaşıyorum.)'
    },
    {
      title: 'Past Perfect Tense',
      summary: 'Geçmişteki iki olaydan önce gerçekleşmiş eylemi anlatmak için kullanılır.',
      example: 'She had left before I arrived. (Ben gelmeden önce o gitmişti.)'
    },
    {
      title: 'First Conditional (1. Tip Koşul Cümleleri)',
      summary: 'Gerçekleşme ihtimali yüksek olan koşullar için if + present → will + fiil yapısı.',
      example: 'If it rains, I will stay home. (Yağmur yağarsa evde kalırım.)'
    },
    {
      title: 'Modals of Probability (İhtimal Bildiren Modal Yapılar)',
      summary: 'may, might, must gibi modal fiillerle olasılık derecelerini ifade etme.',
      example: 'He might come later. (Belki sonra gelir.)'
    },
    {
      title: 'Reflexive Pronouns (Dönüşlülük Zamirleri)',
      summary: 'myself, yourself, himself ... gibi zamirlerin doğru kullanımı.',
      example: 'She did it herself. (Bunu kendisi yaptı.)'
    }
  ],
  B2: [
    {
      title: 'Passive Voice (Edilgen Yapı)',
      summary: 'Eylemin failinin önemsiz olduğu veya bilinmediği durumlarda kullanılır.',
      example: 'The cake was eaten. (Kek yendi.)'
    },
    {
      title: 'Reported Speech (Dolaylı Anlatım)',
      summary: 'Başkasının sözünü dolaylı biçimde aktarma ve zaman uyumu kuralları.',
      example: 'She said that she was tired. (Yorgun olduğunu söyledi.)'
    },
    {
      title: 'Relative Clauses (İlgi Cümlecikleri)',
      summary: 'Noun phrase’i niteleyen who/which/that ile başlayan yan cümleler.',
      example: 'The man who called is my uncle. (Arayan adam benim amcamdır.)'
    },
    {
      title: 'Third Conditional (3. Tip Koşul Cümleleri)',
      summary: 'Geçmişte gerçekleşmemiş durumların hayali sonuçlarını ifade eder.',
      example: 'If I had known, I would have helped. (Bilseydim yardım ederdim.)'
    },
    {
      title: 'Causative (Ettirgen Yapılar)',
      summary: 'Have/get something done yapısıyla bir işi başkasına yaptırma.',
      example: 'I had my car cleaned. (Arabamı temizlettim.)'
    }
  ]
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
