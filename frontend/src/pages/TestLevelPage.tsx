import React, { useEffect, useState } from 'react';
import setMetaTags from '../utils/seo';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';

interface Test {
  id: string;
  name: string;
  category: string;
  description?: string;
  level?: string;
}

// Test seviyeleri ve açıklamaları
const TEST_LEVELS: Record<string, { title: string; description: string; keywords: string }> = {
  'a1-hazirlik': {
    title: 'A1 Hazırlık - İngilizce Sınav Soruları ve Testleri',
    description: 'A1 seviyesi İngilizce sınav hazırlığı için kapsamlı soru ve test koleksiyonu. Temel İngilizce becerilerini geliştirin ve sınavda başarılı olun.',
    keywords: 'A1 hazırlık, A1 İngilizce, A1 sınav, A1 testleri, başlangıç İngilizce'
  },
  'a1-universite-gecis': {
    title: 'A1 Üniversite Geçiş - İngilizce Sınav Hazırlığı',
    description: 'Üniversite geçiş sınavı için A1 seviyesi İngilizce hazırlığı. Gerçek sınav sorularıyla uyumlu pratik testleri çözün.',
    keywords: 'A1 üniversite geçiş, üniversite İngilizce sınavı, A1 giriş sınavı'
  },
  'a2-hazirlik': {
    title: 'A2 Hazırlık - İngilizce Sınav Soruları ve Testleri',
    description: 'A2 seviyesi İngilizce sınav hazırlığı için kapsamlı soru ve test koleksiyonu. İngilizce becerilerinizi geliştirecek yüzlerce soru.',
    keywords: 'A2 hazırlık, A2 İngilizce, A2 sınav, A2 testleri, temel İngilizce'
  },
  'a2-universite-gecis': {
    title: 'A2 Üniversite Geçiş - İngilizce Sınav Hazırlığı',
    description: 'Üniversite giriş sınavı için A2 seviyesi İngilizce hazırlığı. Etkili test çözümleri ve başarı stratejileriyle sınava hazırlanın.',
    keywords: 'A2 üniversite geçiş, üniversite giriş İngilizce, A2 sınav'
  },
  'b1-hazirlik': {
    title: 'B1 Hazırlık - İngilizce Sınav Soruları ve Testleri',
    description: 'B1 seviyesi İngilizce sınav hazırlığı. Orta seviye İngilizce becerilerinizi geliştirin ve sınava hazırlanın.',
    keywords: 'B1 hazırlık, B1 İngilizce, B1 sınav, B1 testleri, orta seviye İngilizce'
  },
  'b1-universite-gecis': {
    title: 'B1 Üniversite Geçiş - İngilizce Sınav Hazırlığı',
    description: 'Üniversite sınavı için B1 seviyesi İngilizce hazırlığı. Yüksek kaliteli pratik testleriyle başarıya ulaşın.',
    keywords: 'B1 üniversite geçiş, B1 giriş sınavı, üniversite İngilizce'
  },
  'b2-hazirlik': {
    title: 'B2 Hazırlık - İngilizce Sınav Soruları ve Testleri',
    description: 'B2 seviyesi İngilizce sınav hazırlığı. İleri seviye İngilizce becerilerinizi test edin ve geliştirin.',
    keywords: 'B2 hazırlık, B2 İngilizce, B2 sınav, B2 testleri, ileri seviye İngilizce'
  },
  'b2-universite-gecis': {
    title: 'B2 Üniversite Geçiş - İngilizce Sınav Hazırlığı',
    description: 'Üniversite sınavı için B2 seviyesi İngilizce hazırlığı. Kapsamlı test ve soru bankasıyla sınava tam hazır olun.',
    keywords: 'B2 üniversite geçiş, B2 giriş sınavı, ileri İngilizce'
  },
  'erasmus-a1': {
    title: 'Erasmus A1 - İngilizce Sınav Soruları ve Hazırlığı',
    description: 'Erasmus programı için A1 seviyesi İngilizce sınav hazırlığı. Yurtdışında okuma imkanını elde etmek için gereken testler.',
    keywords: 'Erasmus A1, Erasmus İngilizce, Erasmus sınavı, A1 yurtdışı'
  },
  'erasmus-a2': {
    title: 'Erasmus A2 - İngilizce Sınav Soruları ve Hazırlığı',
    description: 'Erasmus programı için A2 seviyesi İngilizce hazırlığı. Yurtdışında eğitim görmek için gerekli İngilizce bilgisini geliştirin.',
    keywords: 'Erasmus A2, Erasmus İngilizce, Erasmus testleri'
  },
  'erasmus-b1': {
    title: 'Erasmus B1 - İngilizce Sınav Soruları ve Hazırlığı',
    description: 'Erasmus burs programı için B1 seviyesi İngilizce sınav hazırlığı. Yurtdışı eğitim fırsatlarını değerlendirin.',
    keywords: 'Erasmus B1, Erasmus burs, B1 İngilizce, yurtdışı eğitim'
  },
  'erasmus-b2': {
    title: 'Erasmus B2 - İngilizce Sınav Soruları ve Hazırlığı',
    description: 'Erasmus programı için B2 seviyesi İngilizce sınav hazırlığı. İleri seviye İngilizce bilgisiyle yurtdışında başarılı olun.',
    keywords: 'Erasmus B2, Erasmus ileri seviye, B2 İngilizce sınavı'
  }
};

const TestLevelPage: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  const levelInfo = level && TEST_LEVELS[level];

  useEffect(() => {
    if (levelInfo) {
      setMetaTags({ 
        title: levelInfo.title, 
        description: levelInfo.description, 
        keywords: levelInfo.keywords 
      });
    }
    
    // Test verilerini API'den getir
    const fetchTests = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/questions?level=${level}`);
        if (res.ok) {
          const data = await res.json();
          // Serileri Test'e dönüştür
          const testList = data.series?.map((s: any) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            description: s.description,
            level: level
          })) || [];
          setTests(testList);
        }
      } catch (err) {
        console.error('Error fetching tests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [level, levelInfo]);

  if (!levelInfo) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <Typography color="error">Seçilen seviye bulunamadı.</Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Başlık ve Açıklama */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{
          fontSize: { xs: '1.8rem', md: '2.5rem' },
          fontWeight: 700,
          mb: 2,
          color: '#00b894'
        }}>
          {levelInfo.title}
        </Typography>
        <Typography variant="body1" sx={{
          fontSize: { xs: '0.95rem', md: '1.1rem' },
          color: '#555',
          lineHeight: 1.6,
          mb: 3
        }}>
          {levelInfo.description}
        </Typography>
      </Box>

      {/* Testler Listesi */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#00b894' }} />
        </Box>
      ) : tests.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {tests.map((test) => (
            <Card key={test.id} sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, boxShadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,184,148,0.2)'
              }
            }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#00b894',
                  mb: 1
                }}>
                  {test.name}
                </Typography>
                {test.description && (
                  <Typography variant="body2" color="textSecondary">
                    {test.description}
                  </Typography>
                )}
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                  onClick={() => navigate(`/exam/${test.id}`)}
                >
                  Teste Başla
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Bu seviye için şu anda hiç test bulunmuyor. Lütfen daha sonra tekrar deneyin.
          </Typography>
        </Paper>
      )}

      {/* Yapılandırılmış Veri (Schema) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationEvent',
          name: levelInfo.title,
          description: levelInfo.description,
          url: `https://erasmus-exam-page.vercel.app/test-level/${level}`,
          organizer: {
            '@type': 'Organization',
            name: 'İngilizce Hazırlık',
            url: 'https://erasmus-exam-page.vercel.app'
          },
          eventType: 'Online'
        })}
      </script>
    </Box>
  );
};

export default TestLevelPage;
