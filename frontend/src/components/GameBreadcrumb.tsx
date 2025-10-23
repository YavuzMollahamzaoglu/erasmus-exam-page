import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const GAME_LABELS: Record<string, string> = {
  '/kelime-eslestirme': 'Kelime Eşleştirme (Seviye Seçimi)',
  '/kelime-eslestirme-game': 'Kelime Eşleştirme',
  '/kelime-avi': 'Kelime Avı (Seviye Seçimi)',
  '/kelime-avi-game': 'Kelime Avı',
  '/yazi-yazma': 'Yazı Yazma (Seviye Seçimi)',
  '/yazi-yazma-game': 'Yazı Yazma',
  '/okuma': 'Okuma (Seviye Seçimi)',
  '/okuma-game': 'Okuma',
  '/bosluk-doldurma': 'Boşluk Doldurma',
  '/essay-writing': 'Essay Writing',
};

export default function GameBreadcrumb({ overrideLabel }: { overrideLabel?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = sessionStorage.getItem('lastPath') || '/questions';
  const fromLabel = sessionStorage.getItem('currentLabel') || 'Klasik Sorular';
  const gameLabel = overrideLabel || GAME_LABELS[location.pathname] || 'Oyun';

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(fromPath);
  };

  return (
    <Box sx={{ mb: 2, px: 2, py: 1, bgcolor: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.25)', borderRadius: 2 }} role="navigation" aria-label="Sayfa yolu">
      <Breadcrumbs aria-label="breadcrumb" separator="/">
        <Link href="#" onClick={handleBack} underline="hover" color="#00b894" sx={{ fontWeight: 700 }}>
          {fromLabel}
        </Link>
        <Typography color="text.primary">Oyunlar</Typography>
        <Typography color="text.primary" sx={{ fontWeight: 700 }}>{gameLabel}</Typography>
      </Breadcrumbs>
    </Box>
  );
}
