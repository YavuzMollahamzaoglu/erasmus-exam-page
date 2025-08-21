import React, { useState } from 'react';
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
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', display: 'flex', flexDirection: 'column', alignItems: 'center', pb: { xs: 7, md: 8 } }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, minWidth: 340, bgcolor: '#fff', color: '#1a237e', boxShadow: 6, width: '100%', maxWidth: 900, mt: { xs: 2, md: 4 } }}>
        {Object.entries(testData).map(([categoryKey, types]) => (
          <Box key={categoryKey} sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              {categoryTitles[categoryKey as keyof typeof categoryTitles]}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {Object.entries(types).map(([typeKey, tests]) => (
                <React.Fragment key={typeKey}>
                  {tests.map((test: TestType) =>
                    test.isDynamic ? (
                      test.id === 'dynamic' ? (
                        <DynamicA2Card key={test.id} />
                      ) : test.id === 'dynamic-a1' ? (
                        <DynamicA1Card key={test.id} />
                      ) : test.id === 'dynamic-b1' ? (
                        <DynamicB1Card key={test.id} />
                      ) : test.id === 'dynamic-b2' ? (
                        <DynamicB2Card key={test.id} />
                      ) : null
                    ) : (
                      <Box
                        key={test.id}
                        sx={{
                          flex: '1 1 220px',
                          maxWidth: 260,
                          bgcolor: '#f3f3f3',
                          borderRadius: 2,
                          boxShadow: 1,
                          mb: 2,
                          p: 2,
                          cursor: 'pointer',
                          transition: '0.2s',
                          '&:hover': { boxShadow: 6, transform: 'scale(1.03)' },
                        }}
                        onClick={() => navigate(`/exam/${test.id}`)}
                      >
                        <img src={test.img} alt={test.name} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                        <Typography fontWeight={600} fontSize={18} mb={0.5}>{test.name}</Typography>
                        <Typography fontSize={14} color="#555">{test.description}</Typography>
                      </Box>
                    )
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

// Dynamic card component for A1 Erasmus Sınavı 1
const DynamicA1Card: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use env variable or fallback to localhost:4000
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the backend tests endpoint which filters by category name and series name
      const res = await fetch(`${API_URL}/api/tests/a1-erasmus/questions`);
      if (!res.ok) throw new Error('Sunucuya bağlanılamadı.');
      const data = await res.json();
      const questions = data.questions || data;
      navigate('/exam/dynamic', { state: { questions } });
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: '1 1 220px',
        maxWidth: 260,
        bgcolor: '#f3f3f3',
        borderRadius: 3,
        p: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
      }}
      onClick={handleClick}
    >
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Erasmus Sınavı 1" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
      <Typography fontWeight={600} fontSize={18} mb={0.5}>Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#555">A1 seviyesinde Erasmus Sınavı 1 soruları için tıklayın.</Typography>
      {loading && <Typography fontSize={14} color="primary" sx={{ mt: 2 }}>Yükleniyor...</Typography>}
      {error && <Typography fontSize={14} color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

// Dynamic card component for A2 Erasmus Sınavı 1
const DynamicA2Card: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use env variable or fallback to localhost:4000
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/tests/a2-erasmus/questions`);
      if (!res.ok) throw new Error('Sunucuya bağlanılamadı.');
      const data = await res.json();
      const questions = data.questions || data;
      navigate('/exam/dynamic', { state: { questions } });
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: '1 1 220px',
        maxWidth: 260,
        bgcolor: '#f3f3f3',
        borderRadius: 2,
        boxShadow: 1,
        mb: 2,
        p: 2,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': { boxShadow: 6, transform: 'scale(1.03)' },
      }}
      onClick={handleClick}
    >
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Erasmus Sınavı 1" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
      <Typography fontWeight={600} fontSize={18} mb={0.5}>Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#555">A2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.</Typography>
      {loading && <Typography fontSize={14} color="primary" sx={{ mt: 2 }}>Yükleniyor...</Typography>}
      {error && <Typography fontSize={14} color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

// Dynamic card component for B1 Erasmus Sınavı 1
const DynamicB1Card: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use env variable or fallback to localhost:4000
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/tests/b1-erasmus/questions`);
      if (!res.ok) throw new Error('Sunucuya bağlanılamadı.');
      const data = await res.json();
      const questions = data.questions || data;
      navigate('/exam/dynamic', { state: { questions } });
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: '1 1 220px',
        maxWidth: 260,
        bgcolor: '#f3f3f3',
        borderRadius: 3,
        p: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
      }}
      onClick={handleClick}
    >
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Erasmus Sınavı 1" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
      <Typography fontWeight={600} fontSize={18} mb={0.5}>Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#555">B1 Testlerine Erasmus Sınavı 1 soruları için tıklayın.</Typography>
      {loading && <Typography fontSize={14} color="primary" sx={{ mt: 2 }}>Yükleniyor...</Typography>}
      {error && <Typography fontSize={14} color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

// Dynamic card component for B2 Erasmus Sınavı 1
const DynamicB2Card: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use env variable or fallback to localhost:4000
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/tests/b2-erasmus/questions`);
      if (!res.ok) throw new Error('Sunucuya bağlanılamadı.');
      const data = await res.json();
      const questions = data.questions || data;
      navigate('/exam/dynamic', { state: { questions } });
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: '1 1 220px',
        maxWidth: 260,
        bgcolor: '#f3f3f3',
        borderRadius: 3,
        p: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
      }}
      onClick={handleClick}
    >
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Erasmus Sınavı 1" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
      <Typography fontWeight={600} fontSize={18} mb={0.5}>Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#555">B2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.</Typography>
      {loading && <Typography fontSize={14} color="primary" sx={{ mt: 2 }}>Yükleniyor...</Typography>}
      {error && <Typography fontSize={14} color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default Categories;
