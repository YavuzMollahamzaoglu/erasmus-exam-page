import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import setMetaTags from '../utils/seo';

interface Topic {
  id: number;
  title: string;
  content: string;
  level: string;
}

const TopicsPage: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('A1');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setMetaTags({
      title: 'Konular — Dilbilgisi Konuları ve Örnekler',
      description: 'A1-B2 seviyeleri için temel dilbilgisi konuları, örnekler ve ipuçları.',
      canonical: '/topics',
      ogImage: '/social-preview.svg'
    });
  }, []);

  useEffect(() => {
    // Simulate an API call
    setTimeout(() => {
      setTopics([
        // Sample data
        { id: 1, title: 'Present Simple', content: 'The present simple tense is used to describe habitual actions, general truths, and fixed arrangements.', level: 'A1' },
        { id: 2, title: 'Past Simple', content: 'The past simple tense is used to describe completed actions that happened at a specific time in the past.', level: 'A1' },
        { id: 3, title: 'Future Simple', content: 'The future simple tense is used to describe actions that will happen at a later time.', level: 'A1' },
        { id: 4, title: 'Present Continuous', content: 'The present continuous tense is used to describe actions that are happening at the moment of speaking.', level: 'A2' },
        { id: 5, title: 'Past Continuous', content: 'The past continuous tense is used to describe actions that were in progress at a specific time in the past.', level: 'A2' },
        { id: 6, title: 'Future Continuous', content: 'The future continuous tense is used to describe actions that will be in progress at a specific time in the future.', level: 'A2' },
        { id: 7, title: 'Present Perfect', content: 'The present perfect tense is used to describe actions that happened at an unspecified time and have relevance to the present moment.', level: 'B1' },
        { id: 8, title: 'Past Perfect', content: 'The past perfect tense is used to describe actions that were completed before a certain point in the past.', level: 'B1' },
        { id: 9, title: 'Future Perfect', content: 'The future perfect tense is used to describe actions that will be completed before a certain point in the future.', level: 'B1' },
        { id: 10, title: 'Zero Conditional', content: 'The zero conditional is used to talk about general truths or scientific facts.', level: 'B2' },
        { id: 11, title: 'First Conditional', content: 'The first conditional is used to talk about real and possible situations.', level: 'B2' },
        { id: 12, title: 'Second Conditional', content: 'The second conditional is used to talk about unreal or hypothetical situations.', level: 'B2' },
        { id: 13, title: 'Third Conditional', content: 'The third conditional is used to talk about past situations that are hypothetical or unreal.', level: 'B2' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLevelChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedLevel(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTopics = topics
    .filter((topic) => topic.level === selectedLevel)
    .filter((topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const levels = ['A1', 'A2', 'B1', 'B2'];

  return (
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={6}
        sx={{
          maxWidth: { md: 900, lg: 1000, xl: 1200 },
          width: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          mt: { xs: 1, md: '15px' },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
        }}>
          <Typography variant="h4" fontWeight={800} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Konu Anlatımları
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mt: 1, textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
            İngilizce gramer konularını keşfedin
          </Typography>
        </Box>

        {/* Tabs and Search */}
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider', background: 'rgba(255,255,255,0.7)' }}>
          <Tabs
            value={selectedLevel}
            onChange={handleLevelChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{
              mb: 2,
              '& .MuiTabs-indicator': {
                backgroundColor: '#00b894',
                height: 4,
                borderRadius: '4px 4px 0 0',
              },
              '& .MuiTab-root': {
                fontWeight: 700,
                color: '#6c757d',
                '&.Mui-selected': {
                  color: '#00b894',
                },
              },
            }}
          >
            {levels.map((level) => (
              <Tab key={level} label={level} value={level} />
            ))}
          </Tabs>
          <TextField
            fullWidth
            placeholder="Konu ara..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00b894',
                },
              },
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 3 }, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          {loading && <Typography sx={{ textAlign: 'center', color: '#00b894' }}>Yükleniyor...</Typography>}
          {error && <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>}
          {!loading && !error && (
            filteredTopics.length > 0 ? (
              filteredTopics.map((topic, index) => (
                <Accordion
                  key={topic.id}
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0, 184, 148, 0.2)',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: '0 0 12px 0',
                      boxShadow: '0 8px 20px rgba(0, 184, 148, 0.15)',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#00b894' }} />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: 2,
                      '&:hover': { background: 'rgba(0, 184, 148, 0.05)' },
                      '& .MuiAccordionSummary-content': {
                        margin: '12px 0',
                      },
                    }}
                  >
                    <Typography fontWeight={600} color="#00897b">
                      {topic.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ background: '#f7fdfc', p: 2, borderTop: '1px solid rgba(0, 184, 148, 0.1)' }}>
                    <Typography
                      component="div"
                      dangerouslySetInnerHTML={{ __html: topic.content }}
                      sx={{
                        color: '#34495e',
                        lineHeight: 1.7,
                        '& h2': { color: '#00b894', borderBottom: '2px solid #00cec9', paddingBottom: '8px', marginBottom: '16px' },
                        '& p': { marginBottom: '12px' },
                        '& strong': { color: '#2c3e50' },
                        '& ul, & ol': { paddingLeft: '24px', marginBottom: '16px' },
                        '& li': { marginBottom: '8px' },
                        '& code': {
                          background: 'rgba(0, 184, 148, 0.1)',
                          color: '#00897b',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                        },
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', color: '#666', mt: 4 }}>
                Aradığınız kriterlere uygun konu bulunamadı.
              </Typography>
            )
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TopicsPage;
