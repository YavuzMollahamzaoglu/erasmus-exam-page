import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const ModernLoader: React.FC<{ text?: string }> = ({ text = 'Yükleniyor...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      width: '100%',
      gap: 2,
      background: 'transparent',
    }}
  >
    <CircularProgress size={60} thickness={4.5} sx={{ color: '#00b894' }} />
    <Typography
      variant="body1"
      fontWeight={500}
      sx={{ color: '#00897b', mt: 2, fontSize: 18, letterSpacing: 0.2 }}
    >
      {text}
    </Typography>
  </Box>
);

export default ModernLoader;
