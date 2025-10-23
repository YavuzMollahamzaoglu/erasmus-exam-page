import React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const ORDER = [
  '/kelime-eslestirme-game',
  '/okuma-game',
  '/yazi-yazma-game',
  '/bosluk-doldurma',
  '/kelime-avi-game',
  '/essay-writing',
];

function getNextPath(currentPath: string, search: string): string | null {
  const idx = ORDER.findIndex((p) => currentPath.startsWith(p));
  if (idx === -1) return null;
  const next = ORDER[(idx + 1) % ORDER.length];
  // Preserve level param if present
  const params = new URLSearchParams(search);
  const level = params.get('level');
  if (level && (next.endsWith('-game') || next.includes('okuma'))) {
    return `${next}?level=${encodeURIComponent(level)}`;
  }
  return next;
}

export default function ContinueBanner({ show }: { show: boolean }) {
  const navigate = useNavigate();
  const loc = useLocation();
  if (!show) return null;

  const next = getNextPath(loc.pathname, loc.search);

  return (
    <Paper elevation={6}
      role="region"
      aria-label="Devam seçenekleri"
      sx={{
        position: 'fixed',
        left: '50%',
        bottom: { xs: 12, md: 20 },
        transform: 'translateX(-50%)',
        zIndex: 1200,
        px: 2,
        py: 1,
        borderRadius: 999,
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        bgcolor: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(0,0,0,0.08)'
      }}
    >
      <Button
        onClick={() => navigate('/questions')}
        size="small"
        variant="outlined"
        sx={{ textTransform: 'none', borderColor: '#00b894', color: '#00695c', fontWeight: 700, '&:hover': { borderColor: '#00cec9', backgroundColor: 'rgba(0,206,201,0.08)' } }}
      >
        Klasik Sorulara Dön
      </Button>
      {next && (
        <Button
          onClick={() => navigate(next)}
          size="small"
          variant="contained"
          sx={{ textTransform: 'none', background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)', color: '#fff', fontWeight: 700, '&:hover': { background: 'linear-gradient(90deg, #00cec9 0%, #00b894 100%)' } }}
        >
          Sıradaki Oyun
        </Button>
      )}
    </Paper>
  );
}
