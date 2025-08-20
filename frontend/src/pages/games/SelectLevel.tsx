import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const levels = [
  { label: "A1", value: "a1" },
  { label: "A2", value: "a2" },
  { label: "B1", value: "b1" },
  { label: "B2", value: "b2" },
];

export default function SelectLevel({ game }: { game: "kelime-avi" | "yazi-yazma" }) {
  const navigate = useNavigate();
  const handleSelect = (level: string) => {
    if (game === 'kelime-avi') {
      navigate(`/kelime-avi-game?level=${level}`);
    } else {
      navigate(`/yazi-yazma-game?level=${level}`);
    }
  };
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#b2ebf2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", pt: { xs: 8, sm: 12 } }}>
      <Box sx={{ bgcolor: "#19376D", borderRadius: 4, boxShadow: 6, p: 4, minWidth: 320, maxWidth: "90vw", color: "#fff", textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} mb={3}>Seviye Seçin</Typography>
        <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
          {levels.map((level) => (
            <Button
              key={level.value}
              variant="contained"
              sx={{
                bgcolor: "#43ea7c",
                color: "#19376D",
                fontWeight: 700,
                fontSize: 20,
                borderRadius: 3,
                px: 4,
                py: 2,
                boxShadow: 2,
                '&:hover': { bgcolor: '#2bbd6d' },
              }}
              onClick={() => handleSelect(level.value)}
            >
              {level.label}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
