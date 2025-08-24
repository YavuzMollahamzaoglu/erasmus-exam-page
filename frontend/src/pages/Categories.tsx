import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';


// Type for test objects
type TestType = {
  id: number | string;
  name: string;
  description: string;
  img: string;
  isDynamic?: boolean;
};


// Hardcoded test data grouped by category and type (A1/A2/B1/B2, 3 sınav türü)
const testData: {
  [key: string]: {
    [key: string]: TestType[];
  };
} = {
  A1: {
    'Erasmus Sınavı 1': [
      {
        id: 'dynamic-a1',
        name: 'Erasmus Sınavı 1',
        description: 'A1 seviyesinde Erasmus Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isDynamic: true,
      },
    ],
    'Genel İngilizce 1': [
      {
        id: 'a1-genel',
        name: 'Genel İngilizce 1',
        description: 'A1 seviyesinde Genel İngilizce 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Üniversite Hazırlık Sınavı 1': [
      {
        id: 'a1-uni',
        name: 'Üniversite Hazırlık Sınavı 1',
        description: 'A1 seviyesinde Üniversite Hazırlık Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      },
    ],
  },
  A2: {
    'Erasmus Sınavı 1': [
      {
        id: 'dynamic',
        name: 'Erasmus Sınavı 1',
        description: 'A2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isDynamic: true,
      },
    ],
    'Genel İngilizce 1': [
      {
        id: 'a2-genel',
        name: 'Genel İngilizce 1',
        description: 'A2 seviyesinde Genel İngilizce 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Üniversite Hazırlık Sınavı 1': [
      {
        id: 'a2-uni',
        name: 'Üniversite Hazırlık Sınavı 1',
        description: 'A2 seviyesinde Üniversite Hazırlık Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      },
    ],
  },
  B1: {
    'Erasmus Sınavı 1': [
      {
        id: 'dynamic-b1',
        name: 'Erasmus Sınavı 1',
        description: 'B1 Testlerine Erasmus Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isDynamic: true,
      },
    ],
    'Genel İngilizce 1': [
      {
        id: 'b1-genel',
        name: 'Genel İngilizce 1',
        description: 'B1 seviyesinde Genel İngilizce 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Üniversite Hazırlık Sınavı 1': [
      {
        id: 'b1-uni',
        name: 'Üniversite Hazırlık Sınavı 1',
        description: 'B1 seviyesinde Üniversite Hazırlık Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      },
    ],
  },
  B2: {
    'Erasmus Sınavı 1': [
      {
        id: 'dynamic-b2',
        name: 'Erasmus Sınavı 1',
        description: 'B2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isDynamic: true,
      },
    ],
    'Genel İngilizce 1': [
      {
        id: 'b2-genel',
        name: 'Genel İngilizce 1',
        description: 'B2 seviyesinde Genel İngilizce 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Üniversite Hazırlık Sınavı 1': [
      {
        id: 'b2-uni',
        name: 'Üniversite Hazırlık Sınavı 1',
        description: 'B2 seviyesinde Üniversite Hazırlık Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      },
    ],
  },
};

const categoryTitles = {
  A1: 'A1 Testleri',
  A2: 'A2 Testleri',
  B1: 'B1 Testleri',
  B2: 'B2 Testleri',
};

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const [serverOnline, setServerOnline] = useState(true);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch(`${API_URL}/health`, { cache: 'no-store' });
      setServerOnline(res.ok);
    } catch (e) {
      setServerOnline(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#b2dfdb',
      px: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      pb: { xs: 7, md: 8 },
      pt: 0
    }}>
      {/* Server offline banner */}
      {!serverOnline && (
        <Box sx={{ bgcolor: '#ffebee', color: '#c62828', p: 2, borderRadius: 2, mt: 2, width: '100%', maxWidth: 900 }}>
          <Typography fontWeight={700}>Sunucu çevrimdışı</Typography>
          <Typography fontSize={14}>Lütfen backend'i başlatın ve tekrar deneyin.</Typography>
          <Box sx={{ mt: 1 }}>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={checkHealth}>
              {checking ? 'Kontrol ediliyor...' : 'Tekrar Dene'}
            </span>
          </Box>
        </Box>
      )}

      <Paper 
        elevation={6} 
        sx={{ 
          maxWidth: 1200, 
          width: '100%', 
          borderRadius: 4, 
          overflow: 'hidden', 
          mt: '15px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Gradient header like Rankings, merged with top and inheriting radii */}
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            zIndex: 0,
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" fontWeight={700} mb={1} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: { xs: '2rem', md: '2.5rem' } }}>Sınav Kategorileri</Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>Seviyene ve kategorine uygun testi seç</Typography>
          </Box>
        </Box>

        {/* Inner content padding wrapper */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          {Object.entries(testData).map(([categoryKey, types]) => (
            <Box key={categoryKey} sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={800} mb={2} sx={{ color: '#00695c' }}>
                {categoryTitles[categoryKey as keyof typeof categoryTitles]}
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 3
              }}>
                {Object.entries(types).map(([typeKey, tests]) => (
                  <React.Fragment key={typeKey}>
                    {tests.map((test: TestType) =>
                      test.isDynamic ? (
                        test.id === 'dynamic' ? (
                          <DynamicA2Card key={test.id} serverOnline={serverOnline} onCheck={checkHealth} checking={checking} />
                        ) : test.id === 'dynamic-a1' ? (
                          <DynamicA1Card key={test.id} serverOnline={serverOnline} onCheck={checkHealth} checking={checking} />
                        ) : test.id === 'dynamic-b1' ? (
                          <DynamicB1Card key={test.id} serverOnline={serverOnline} onCheck={checkHealth} checking={checking} />
                        ) : test.id === 'dynamic-b2' ? (
                          <DynamicB2Card key={test.id} serverOnline={serverOnline} onCheck={checkHealth} checking={checking} />
                        ) : null
                      ) : (
                        <Box
                          key={test.id}
                          sx={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid rgba(0, 184, 148, 0.2)',
                            borderRadius: 3,
                            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                            p: 2.5,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': { boxShadow: '0 12px 30px rgba(0,0,0,0.12)', transform: 'translateY(-3px)' },
                          }}
                          onClick={() => navigate(`/exam/${test.id}`)}
                        >
                          <img src={test.img} alt={test.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }} />
                          <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">{test.name}</Typography>
                          <Typography fontSize={14} color="#455a64">{test.description}</Typography>
                        </Box>
                      )
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

// Dynamic card component for A1 Erasmus Sınavı 1
const DynamicA1Card: React.FC<{ serverOnline: boolean; onCheck: () => void; checking: boolean }> = ({ serverOnline, onCheck, checking }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!serverOnline) {
      await onCheck();
      if (!serverOnline) {
        alert(checking ? 'Sunucu durumu kontrol ediliyor...' : 'Sunucu kapalı. Lütfen backend\'i başlatın.');
        return;
      }
    }
    navigate('/exam/dynamic-a1');
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 184, 148, 0.2)',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
        opacity: serverOnline ? 1 : 0.9,
      }}
      onClick={handleClick}
    >
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Erasmus Sınavı 1" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }} />
      <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#455a64">A1 seviyesinde Erasmus Sınavı 1 soruları için tıklayın.</Typography>
    </Box>
  );
};

// Dynamic card component for A2 Erasmus Sınavı 1
const DynamicA2Card: React.FC<{ serverOnline: boolean; onCheck: () => void; checking: boolean }> = ({ serverOnline, onCheck, checking }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!serverOnline) {
      await onCheck();
      if (!serverOnline) {
        alert(checking ? 'Sunucu durumu kontrol ediliyor...' : 'Sunucu kapalı. Lütfen backend\'i başlatın.');
        return;
      }
    }
    navigate('/exam/dynamic-a2');
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 184, 148, 0.2)',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
        opacity: serverOnline ? 1 : 0.9,
      }}
      onClick={handleClick}
    >
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Erasmus Sınavı 1" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }} />
      <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#455a64">A2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.</Typography>
    </Box>
  );
};

// Dynamic card component for B1 Erasmus Sınavı 1
const DynamicB1Card: React.FC<{ serverOnline: boolean; onCheck: () => void; checking: boolean }> = ({ serverOnline, onCheck, checking }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!serverOnline) {
      await onCheck();
      if (!serverOnline) {
        alert(checking ? 'Sunucu durumu kontrol ediliyor...' : 'Sunucu kapalı. Lütfen backend\'i başlatın.');
        return;
      }
    }
    navigate('/exam/dynamic-b1');
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 184, 148, 0.2)',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
        opacity: serverOnline ? 1 : 0.9,
      }}
      onClick={handleClick}
    >
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Erasmus Sınavı 1" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }} />
      <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#455a64">B1 Testlerine Erasmus Sınavı 1 soruları için tıklayın.</Typography>
    </Box>
  );
};

// Dynamic card component for B2 Erasmus Sınavı 1
const DynamicB2Card: React.FC<{ serverOnline: boolean; onCheck: () => void; checking: boolean }> = ({ serverOnline, onCheck, checking }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!serverOnline) {
      await onCheck();
      if (!serverOnline) {
        alert(checking ? 'Sunucu durumu kontrol ediliyor...' : 'Sunucu kapalı. Lütfen backend\'i başlatın.');
        return;
      }
    }
    navigate('/exam/dynamic-b2');
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 184, 148, 0.2)',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
        opacity: serverOnline ? 1 : 0.9,
      }}
      onClick={handleClick}
    >
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Erasmus Sınavı 1" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }} />
      <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#455a64">B2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.</Typography>
    </Box>
  );
};

export default Categories;
