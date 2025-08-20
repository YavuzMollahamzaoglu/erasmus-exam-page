
import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

const games = [
  {
    title: 'Kelime Avı Oyunu',
    description: 'Türkçe kelimenin İngilizcesini kartlardan seç!',
    icon: (
      <svg width="48" height="48" fill="none"><circle cx="24" cy="24" r="20" fill="#F9D923"/><path d="M32 32l8 8" stroke="#19376D" strokeWidth="3" strokeLinecap="round"/><circle cx="24" cy="24" r="10" stroke="#19376D" strokeWidth="3"/></svg>
    ),
    color: '#F9D923',
    link: '/kelime-avi'
  },
  {
    title: 'Yazı Yazma Oyunu',
    description: 'Türkçe kelimeyi İngilizce doğru yaz!',
    icon: (
      <svg width="48" height="48" fill="none"><rect x="10" y="34" width="28" height="4" rx="2" fill="#36AE7C"/><path d="M14 34L34 14" stroke="#19376D" strokeWidth="3"/><rect x="32" y="12" width="4" height="8" rx="2" fill="#36AE7C"/></svg>
    ),
    color: '#36AE7C',
    link: '/yazi-yazma'
  },
  {
    title: 'Boşluk Doldurma Oyunu',
    description: 'Paragraftaki boşlukları doğru kelimelerle doldur!',
    icon: (
      <svg width="48" height="48" fill="none"><rect x="8" y="12" width="32" height="24" rx="4" fill="#1877F2"/><rect x="12" y="16" width="24" height="4" rx="2" fill="#fff"/><rect x="12" y="24" width="16" height="4" rx="2" fill="#fff"/></svg>
    ),
    color: '#1877F2',
    link: '/bosluk-doldurma'
  },
  {
    title: 'AI Essay Değerlendirici',
    description: 'AI ile essay yazın ve detaylı değerlendirme alın!',
    icon: (
      <svg width="48" height="48" fill="none"><rect x="6" y="10" width="36" height="28" rx="4" fill="#9C27B0"/><circle cx="18" cy="20" r="3" fill="#fff"/><circle cx="30" cy="20" r="3" fill="#fff"/><path d="M15 28c3 2 15 2 18 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    color: '#9C27B0',
    link: '/essay-writing'
  }
];

const Questions: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 4 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, minWidth: 340, bgcolor: '#fff', color: '#1a237e', boxShadow: 6, width: '100%', maxWidth: 900, mt: { xs: 2, md: 4 }, mb: { xs: 3, md: 4 } }}>
        <Typography variant="h4" fontWeight={700} mb={4} align="center">
          İngilizce Oyunları
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {games.map((game) => (
            <Box
              key={game.title}
              sx={{
                flex: '1 1 260px',
                maxWidth: 280,
                bgcolor: '#f3f3f3',
                borderRadius: 3,
                boxShadow: 2,
                mb: 2,
                p: 3,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: '0.2s',
                '&:hover': { boxShadow: 6, transform: 'scale(1.05)' },
              }}
              onClick={() => window.location.href = game.link}
            >
              <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: game.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, boxShadow: 1 }}>
                {game.icon}
              </Box>
              <Typography fontWeight={600} fontSize={20} mb={1} color="#19376D" align="center">{game.title}</Typography>
              <Typography fontSize={15} color="#555" align="center" mb={2}>{game.description}</Typography>
              <Button variant="contained" sx={{
                background: 'linear-gradient(90deg, #19376D 60%, #0A1D56 100%)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                boxShadow: 2,
                textTransform: 'none',
                fontSize: 16,
                mt: 'auto',
                '&:hover': {
                  background: 'linear-gradient(90deg, #0A1D56 60%, #19376D 100%)',
                  boxShadow: 4,
                  transform: 'scale(1.07)'
                }
              }}
              onClick={e => { e.stopPropagation(); window.location.href = game.link; }}
              >Başla</Button>
            </Box>
          ))}
        </Box>
        <Typography fontSize={15} color="#888" align="center" mt={4}>
          Başlamak için bir oyun seçin
        </Typography>

      </Paper>
    </Box>
  );
};

export default Questions;
