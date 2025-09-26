import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const levels = [
  { label: "A1", value: "a1" },
  { label: "A2", value: "a2" },
  { label: "B1", value: "b1" },
  { label: "B2", value: "b2" },
];

export default function SelectLevel({ game }: { game: "kelime-avi" | "yazi-yazma" | "kelime-eslestirme" | "okuma" }) {
  const navigate = useNavigate();
  const handleSelect = (level: string) => {
    if (game === 'kelime-avi') {
      navigate(`/kelime-avi-game?level=${level}`);
    } else if (game === 'yazi-yazma') {
      navigate(`/yazi-yazma-game?level=${level}`);
    } else if (game === 'kelime-eslestirme') {
      navigate(`/kelime-eslestirme-game?level=${level}`);
    } else if (game === 'okuma') {
      navigate(`/okuma-game?level=${level}`);
    }
  };
  
  const gameTitle = 
    game === 'kelime-avi' ? 'Kelime Avı Oyunu' : 
    game === 'yazi-yazma' ? 'Yazı Yazma Oyunu' :
    game === 'kelime-eslestirme' ? 'Kelime Eşleştirme Oyunu' :
    'Okuma Oyunu';

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#b2dfdb", display: "flex", alignItems: "flex-start", justifyContent: "center", px: 2, pb: { xs: 12, md: 16 }, pt: 0 }}>
      <Paper elevation={6} sx={{
        width: '100%',
        maxWidth: 820,
        borderRadius: 4,
        overflow: 'hidden',
  mt: { xs: 1, md: '15px' },
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Gradient header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(5px)'
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" fontWeight={800} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
              Seviye Seçin
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.95, mt: 0.5 }}>{gameTitle}</Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 3.5 }, flexWrap: 'wrap' }}>
            {levels.map((level) => (
              <Button
                key={level.value}
                onClick={() => handleSelect(level.value)}
                aria-label={`Seviye ${level.label}`}
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #43ea7c 0%, #00d4b0 100%)',
                  color: '#0d2b52',
                  fontWeight: 900,
                  fontSize: 22,
                  boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
                  textTransform: 'none',
                  '&:hover': {
                    filter: 'brightness(0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 14px 28px rgba(0,0,0,0.14)'
                  }
                }}
              >
                {level.label}
              </Button>
            ))}
          </Box>

          {/* helper text */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#607d8b' }}>
              Seviyenizi bilmiyorsanız A1 ile başlayıp ilerleyebilirsiniz. Dilediğiniz an geri dönebilirsiniz.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
