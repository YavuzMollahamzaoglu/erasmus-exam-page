import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function MoreLearningLinks() {
  return (
    <Box sx={{
      width: '100%',
      maxWidth: 900,
      mx: 'auto',
      mt: 4,
      p: { xs: 2, md: 3 },
      borderRadius: 3,
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid rgba(0, 184, 148, 0.15)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
    }}>
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#00695c', mb: 1.5 }}>
        Diğer Oyunlar ve Konu Anlatımları
      </Typography>
      <Typography variant="body2" sx={{ color: '#47606b', mb: 2 }}>
        Seviyenize uygun diğer pratiklere göz atın ve öğrenmenizi hızlandırın.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Button component={Link} to="/kelime-avi" variant="outlined" size="small" sx={btnSx}>Kelime Avı</Button>
        <Button component={Link} to="/yazi-yazma" variant="outlined" size="small" sx={btnSx}>Yazma Oyunu</Button>
        <Button component={Link} to="/kelime-eslestirme" variant="outlined" size="small" sx={btnSx}>Kelime Eşleştirme</Button>
        <Button component={Link} to="/okuma" variant="outlined" size="small" sx={btnSx}>Okuma Oyunu</Button>
        <Button component={Link} to="/bosluk-doldurma" variant="outlined" size="small" sx={btnSx}>Boşluk Doldurma</Button>
        <Button component={Link} to="/essay-game" variant="outlined" size="small" sx={btnSx}>Essay Oyunu</Button>
        <Button component={Link} to="/topics" variant="contained" size="small" sx={{
          ...btnSx,
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          border: 'none',
          '&:hover': { filter: 'brightness(0.95)' }
        }}>Konu Anlatımları</Button>
      </Stack>
    </Box>
  );
}

const btnSx = {
  textTransform: 'none',
  fontWeight: 700,
  borderColor: 'rgba(0, 184, 148, 0.4)',
  color: '#00695c',
  '&:hover': { borderColor: '#00695c', backgroundColor: 'rgba(0, 184, 148, 0.08)' }
} as const;
