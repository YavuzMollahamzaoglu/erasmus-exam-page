import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, InputAdornment, List, ListItemButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  token?: string;
}

// Enhanced search index covering all main pages and games
const searchItems: Array<{ label: string; url: string; keywords?: string[] }> = [
  { label: 'Sınavlar', url: '/questions', keywords: ['questions', 'testler', 'sinavlar', 'quiz'] },
  { label: 'Kategoriler', url: '/categories', keywords: ['categories', 'sinav kategorileri', 'erasmus', 'genel ingilizce', 'universite hazirlik'] },
  { label: 'Kelimeler', url: '/words', keywords: ['words', 'vocabulary', 'kelime', 'kelimeler'] },
  { label: 'Kelime Avı Oyunu', url: '/kelime-avi', keywords: ['word hunt', 'kelime avi', 'game', 'oyun', 'seri soru', 'seri soru çözümü'] },
  { label: 'Yazı Yazma Oyunu', url: '/yazi-yazma', keywords: ['writing', 'typing', 'yazi yazma', 'oyun'] },
  { label: 'Boşluk Doldurma Oyunu', url: '/bosluk-doldurma', keywords: ['fill in the blanks', 'bosluk doldurma', 'paragraph'] },
  { label: 'Essay Writing', url: '/essay-writing', keywords: ['essay', 'yapay zeka', 'degerlendirme'] },
  { label: 'Sıralamalar', url: '/rankings', keywords: ['leaderboard', 'puan', 'siralama'] },
  { label: 'Geçmiş', url: '/history', keywords: ['history', 'gecmis', 'sonuclar'] },
  { label: 'Profil', url: '/profile', keywords: ['profile', 'hesabim'] },
  { label: 'Hakkımızda', url: '/about', keywords: ['about', 'hakkimizda', 'bilgi'] },
  { label: 'Giriş', url: '/login', keywords: ['login', 'giris'] },
  { label: 'Kayıt Ol', url: '/register', keywords: ['register', 'kayit'] },
  { label: 'Erasmus Hazırlık', url: '/categories', keywords: ['erasmus', 'hazirlik'] },
  { label: 'Genel İngilizce', url: '/categories', keywords: ['genel', 'ingilizce'] },
  { label: 'Üniversite Hazırlık', url: '/categories', keywords: ['universite', 'hazirlik'] },
];

const frostedPaper = {
  maxWidth: 1200,
  width: '100%',
  borderRadius: 4,
  overflow: 'hidden',
  mt: '15px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
} as const;

const cardSx = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(0, 184, 148, 0.2)',
  borderRadius: 3,
  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  p: 2.5,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
} as const;

const HomePage: React.FC<Props> = ({ token }) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = searchItems.filter(item => {
    const q = search.toLowerCase().trim();
    if (!q) return false;
    return (
      item.label.toLowerCase().includes(q) ||
      (item.keywords?.some(k => k.toLowerCase().includes(q)) ?? false)
    );
  }).slice(0, 10);

  return (
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', pb: { xs: 7, md: 8 }, pt: 0 }}>
      <Paper elevation={6} sx={frostedPaper}>
        {/* Gradient header */}
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
            inset: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            zIndex: 0,
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" fontWeight={700} mb={2} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: { xs: '2rem', md: '2.5rem' } }}>Hazırlığını Başlat</Typography>
            <Typography variant="h6" sx={{ opacity: 0.95 }}>İngilizce sınavlarına güçlü bir başlangıç yap</Typography>
          </Box>
        </Box>

        {/* Inner content */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          {/* Search */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box sx={{ width: '100%', maxWidth: 520, position: 'relative' }}>
              <TextField
                fullWidth
                placeholder="Site içi arama..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#607d8b' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fff',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(25,55,109,0.05)'
                  }
                }}
              />
              {showDropdown && filtered.length > 0 && (
                <Paper elevation={6} sx={{ position: 'absolute', top: '100%', left: 0, width: '100%', mt: 1, borderRadius: 2, overflow: 'hidden', border: '1px solid #e3eafc' }}>
                  <List sx={{ p: 0 }}>
                    {filtered.map((item) => (
                      <ListItemButton key={item.label} onMouseDown={() => { window.location.href = item.url; }} sx={{ py: 1.2 }}>
                        <Typography sx={{ color: '#19376D', fontWeight: 500 }}>{item.label}</Typography>
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </Box>

          {/* Sınav Türleri */}
          <Typography variant="h6" fontWeight={800} mb={2} sx={{ color: '#00695c' }}>Sınav Türleri</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2.5, mb: 3 }}>
            <Box sx={cardSx as any}>
              <Typography fontSize={28} mb={1}>🎓</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Erasmus Hazırlık</Typography>
              <Typography fontSize={14} color="#455a64">Çeşitli üniversitelerin Erasmus sınavları örnek alınarak hazırlanmış test ve sorular.</Typography>
            </Box>
            <Box sx={cardSx as any}>
              <Typography fontSize={28} mb={1}>✅</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Genel İngilizce</Typography>
              <Typography fontSize={14} color="#455a64">Seviye belirleme ve genel sınavlara yönelik, farklı kaynaklardan derlenmiş testler.</Typography>
            </Box>
            <Box sx={cardSx as any}>
              <Typography fontSize={28} mb={1}>🏛️</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Üniversite Hazırlık</Typography>
              <Typography fontSize={14} color="#455a64">Üniversite hazırlık geçme sınavlarına uygun, daha zorlu içerikler.</Typography>
            </Box>
          </Box>

          {/* Bilgi şeridi */}
          <Box sx={{ background: '#e3eafc', borderRadius: 2, p: 2.25, mb: 4, textAlign: 'center', fontSize: 18, color: '#19376D', fontWeight: 600 }}>
            Kategorilerimiz: Okuma, Yazma, Dinleme, Kelime, Essay ve daha fazlası ile seviyene uygun içerikler.
          </Box>

          {/* Oyunlarımız */}
          <Typography variant="h6" fontWeight={800} mb={2} sx={{ color: '#00695c' }}>Oyunlarımız</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2.5, mb: 3 }}>
            <Box sx={cardSx as any}>
              <Typography fontSize={28} mb={1}>🔢</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Seri Soru Çözümü</Typography>
              <Typography fontSize={14} color="#455a64">A1–B2 seviyelerinde kelime odaklı ardışık soru çözümü.</Typography>
            </Box>
            <Box sx={cardSx as any}>
              <Typography fontSize={28} mb={1}>⌨️</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Yazı Yazma</Typography>
              <Typography fontSize={14} color="#455a64">Türkçe kelimenin İngilizcesini yaz, anında geri bildirim al.</Typography>
            </Box>
            <Box sx={cardSx as any}>
              <Typography fontSize={28} mb={1}>📝</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Essay</Typography>
              <Typography fontSize={14} color="#455a64">Yapay zekâ ile değerlendirilen essay yazma deneyimi.</Typography>
            </Box>
          </Box>

          {/* Call to action for guests */}
          {!token && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                onClick={() => (window.location.href = '/register')}
                sx={{
                  background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18,
                  borderRadius: 2,
                  px: 5,
                  py: 1.5,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                  textTransform: 'none',
                  '&:hover': { filter: 'brightness(0.95)' }
                }}
              >
                Kayıt Ol
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default HomePage;
