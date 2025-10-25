import React, { useEffect, useState } from 'react';
import setMetaTags from '../utils/seo';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, InputAdornment, List, ListItemButton, Button, Chip } from '@mui/material';
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
  { label: 'Okuma Oyunu', url: '/okuma', keywords: ['reading', 'okuma', 'passage', 'paragraph'] },
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
  mt: { xs: 1, md: '15px' },
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: { xs: '0 8px 18px rgba(0,0,0,0.08)', md: '0 20px 40px rgba(0,0,0,0.1)' },
} as const;

const cardSx = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(0, 184, 148, 0.2)',
  borderRadius: 3,
  boxShadow: { xs: '0 3px 10px rgba(0,0,0,0.06)', md: '0 6px 20px rgba(0,0,0,0.08)' },
  p: { xs: 2, md: 2.5 },
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': { transform: { md: 'translateY(-3px)' }, boxShadow: { md: '0 12px 30px rgba(0,0,0,0.12)' } },
} as const;

const HomePage: React.FC<Props> = ({ token }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastVisited, setLastVisited] = useState<string | null>(null);

  useEffect(() => {
    setMetaTags({
      title: 'İngilizce Hazırlık — Ücretsiz İngilizce Testleri ve Pratik',
      description: 'Erasmus ve üniversite sınavlarına yönelik ücretsiz İngilizce testleri, kelime çalışmaları ve dinleme alıştırmaları. Hemen sınavına hazırlan.',
      keywords: 'İngilizce sınav hazırlık, erasmus hazırlık, ücretsiz ingilizce testleri, kelime çalışmaları, dinleme alıştırmaları',
      ogImage: '/social-preview.svg',
      canonical: '/'
    });
    try {
      const p = localStorage.getItem('lastVisitedPath');
      if (p) setLastVisited(p);
    } catch {}
  }, []);

  const labelForPath = (p: string) => {
    const map: Record<string, string> = {
      '/bosluk-doldurma': 'Boşluk Doldurma',
      '/yazi-yazma': 'Yazı Yazma',
      '/essay-writing': 'Essay',
      '/kelime-avi': 'Kelime Avı',
      '/questions': 'Testler',
      '/words': 'Kelimeler'
    };
    return map[p] || 'İçerik';
  };

  const normalizeTR = (s: string) =>
    s
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'g')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'c')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'u');

  const filtered = searchItems
    .map((item, idx) => {
      const qRaw = search.trim();
      if (!qRaw) return null;
      const q = normalizeTR(qRaw);
      const labelN = normalizeTR(item.label);
      const kwN = (item.keywords || []).map(normalizeTR);

      // Filter: must match label or any keyword
      const labelPos = labelN.indexOf(q);
      const kwPos = kwN.map((k) => k.indexOf(q));
      const isStrict = q.length <= 1; // single letter -> only startsWith
      const matches = isStrict
        ? (labelN.startsWith(q) || kwN.some((k) => k.startsWith(q)))
        : (labelPos >= 0 || kwPos.some((p) => p >= 0));
  if (!matches) return null;

      // Score: startsWith highest, then early contains, then keywords
      let score = 0;
      if (labelN.startsWith(q)) score += 1000;
      if (!isStrict && labelPos >= 0) score += 800 - Math.min(labelPos, 700);
      // keyword startsWith and contains (take best)
      let bestKw = -1;
      for (const p of kwPos) {
        if (p === 0) bestKw = 0; // startsWith
        else if (p > 0) bestKw = bestKw === -1 ? p : Math.min(bestKw, p);
      }
      if (bestKw === 0) score += 400;
      else if (!isStrict && bestKw > 0) score += 300 - Math.min(bestKw, 250);
      // tiny boost for exact label match
      if (labelN === q) score += 50;

      return { item, score, idx };
    })
  .filter((x): x is { item: typeof searchItems[number]; score: number; idx: number } => x !== null)
    .sort((a, b) => (b.score - a.score) || a.item.label.localeCompare(b.item.label))
    .slice(0, 10)
    .map((x) => x.item);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#b2dfdb', 
      px: { xs: 1.5, sm: 2 }, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      pt: 0, 
      pb: { xs: 12, md: 16 }, 
      overflowX: 'hidden' 
    }}>
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
            <Typography variant="h3" fontWeight={700} mb={2} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}>Hazırlığını Başlat</Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)' }}>İngilizce sınavlarına güçlü bir başlangıç yap</Typography>
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

          {/* Resume card (if any) */}
          {lastVisited && (
            <Paper elevation={0} sx={{ mb: 3, p: 2, borderRadius: 2, background: 'rgba(0, 184, 148, 0.08)', border: '1px solid rgba(0, 184, 148, 0.25)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ color: '#00695c', fontWeight: 700 }}>Kaldığın yerden devam et: {labelForPath(lastVisited)}</Typography>
                <Button onClick={() => (window.location.href = lastVisited)} sx={{ textTransform: 'none', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', px: 2.5, py: 0.75, borderRadius: 2 }}>Devam Et</Button>
              </Box>
            </Paper>
          )}

          {/* Öğrenme Akışı (önerilen kullanım) */}
          <Paper elevation={0} sx={{ mb: 4, p: { xs: 2, md: 2.5 }, borderRadius: 3, border: '1px solid #e3eafc', background: '#fff' }}>
            <Typography variant="h6" fontWeight={800} mb={1} sx={{ color: '#00695c' }}>Nasıl çalışmalı?</Typography>
            <Typography fontSize={14} color="#455a64" mb={1.5}>
              Adım adım ilerlemeni öneririz: önce kelimeleri öğren, sonra klasik sorularla pekiştir, ardından gerçek sınav tarzındaki sorularla pratik yap. <br/>
              <b>Küçük not:</b> Konu sayfasında genel konuları öğrenebilir, her konuya özel küçük notlar alarak soruları nasıl çözeceğini görebilirsin.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gridTemplateRows: { xs: 'repeat(6, 1fr)', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              {/* 1. Satır */}
              <Box sx={{ minHeight: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'rgba(0,184,148,0.04)', borderRadius: 2, p: 1.2 }}>
                <Typography fontWeight={700} color="#19376D" mb={0.5}>1) Kelimeleri Öğren</Typography>
                <Typography fontSize={13} color="#607d8b">Kelimeler sayfası, Kelime Avı ve Kelime Eşleştirme oyunları ile seviyene uygun kelime çalış.</Typography>
              </Box>
              <Box sx={{ minHeight: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'rgba(0,184,148,0.04)', borderRadius: 2, p: 1.2 }}>
                <Typography fontWeight={700} color="#19376D" mb={0.5}>2) Konu Sayfasında Çalış</Typography>
                <Typography fontSize={13} color="#607d8b">Konu sayfasında genel konuları öğren, üzerine çalış ve küçük notlar alarak soruları nasıl çözeceğini öğren.</Typography>
              </Box>
              <Box sx={{ minHeight: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'rgba(0,184,148,0.04)', borderRadius: 2, p: 1.2 }}>
                <Typography fontWeight={700} color="#19376D" mb={0.5}>3) Klasik Sorularla Pekiştir</Typography>
                <Typography fontSize={13} color="#607d8b">Testler bölümünde dilbilgisi (grammar) ve kelime (vocabulary) odaklı sorularla pratik yap.</Typography>
              </Box>
              {/* 2. Satır */}
              <Box sx={{ minHeight: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'rgba(0,184,148,0.04)', borderRadius: 2, p: 1.2 }}>
                <Typography fontWeight={700} color="#19376D" mb={0.5}>4) Gerçek Sınav Tarzı</Typography>
                <Typography fontSize={13} color="#607d8b">Üniversite ve kitaplardan derlenmiş, gerçek sınavlara yakın soruları A1, A2, B1 ve B2 seviyelerinde çözerek seviyeni ölç.</Typography>
              </Box>
              <Box sx={{ minHeight: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'rgba(0,184,148,0.04)', borderRadius: 2, p: 1.2 }}>
                <Typography fontWeight={700} color="#19376D" mb={0.5}>5) Okuma (Reading)</Typography>
                <Typography fontSize={13} color="#607d8b">Uzun paragraf + 4–5 çoktan seçmeli soruyla okuduğunu anlama becerini geliştir.</Typography>
              </Box>
              <Box sx={{ minHeight: 90, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'rgba(0,184,148,0.04)', borderRadius: 2, p: 1.2 }}>
                <Typography fontWeight={700} color="#19376D" mb={0.5}>6) 🎧 Listening (Yakında)</Typography>
                <Typography fontSize={13} color="#607d8b">Listening çalışması çok yakında! </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Oyunlarımız */}
          <Typography variant="h6" fontWeight={800} mb={2} sx={{ color: '#00695c' }}>Oyunlarımız</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 2.5 }, mb: 3 }}>
            <Box
              sx={{ ...(cardSx as any), cursor: 'pointer', userSelect: 'none' }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/kelime-avi')}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate('/kelime-avi'); }}
            >
              <Typography fontSize={28} mb={1}>🔢</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Kelime Avı Oyunu</Typography>
              <Typography fontSize={14} color="#455a64">
                Her seviyede 10 kelime sorusunu hızlıca çözerek puan toplarsın. Yanlış cevapta doğru seçeneği ve açıklamasını görürsün. Oyun sonunda toplam puanını ve doğru-yanlışlarını görebilirsin. Seviyeni seçerek kelime bilginin hangi düzeyde olduğunu test edebilirsin. Hedefin, her oynayışta daha yüksek puan almak ve kelime dağarcığını geliştirmek.
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Seviye: A1–B2" variant="outlined" size="small" sx={{ borderColor: 'rgba(0, 184, 148, 0.4)', color: '#00695c' }} />
                <Chip label="Her seviyede 10 soru" size="small" sx={{ bgcolor: 'rgba(116, 185, 255, 0.15)', color: '#0984e3' }} />
              </Box>
            </Box>
            <Box
              sx={{ ...(cardSx as any), cursor: 'pointer', userSelect: 'none' }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/yazi-yazma')}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate('/yazi-yazma'); }}
            >
              <Typography fontSize={28} mb={1}>⌨️</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Yazı Yazma</Typography>
              <Typography fontSize={14} color="#455a64">Ekranda verilen Türkçe kelimenin İngilizcesini yazarsın. Her girişte anında doğru-yanlış geri bildirimi alırsın. Hatalı cevaplarda doğru yazılışı öğrenirsin. Oyun sonunda başarı oranını görebilirsin. Pratik yaparak yazılı kelime bilgin gelişir.</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Zorluk: Kolay" variant="outlined" size="small" sx={{ borderColor: 'rgba(0, 184, 148, 0.4)', color: '#00695c' }} />
                <Chip label="~5 dk" size="small" sx={{ bgcolor: 'rgba(116, 185, 255, 0.15)', color: '#0984e3' }} />
              </Box>
            </Box>
            <Box
              sx={{ ...(cardSx as any), cursor: 'pointer', userSelect: 'none' }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/kelime-eslestirme')}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate('/kelime-eslestirme'); }}
            >
              <Typography fontSize={28} mb={1}>🧩</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Kelime Eşleştirme</Typography>
              <Typography fontSize={14} color="#455a64">15 İngilizce kelimeyi anlamlarıyla eşleştirirsin. Hızlı ve doğru eşleştirme yaparak puan toplarsın. Zaman baskısı ile reflekslerini ve kelime-anlam bağlantılarını güçlendirirsin. Yanlış eşleşmelerde doğru cevabı öğrenirsin. Oyun sonunda performansını görebilirsin.</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Kelime odaklı" variant="outlined" size="small" sx={{ borderColor: 'rgba(0, 184, 148, 0.4)', color: '#00695c' }} />
                <Chip label="Zaman takibi" size="small" sx={{ bgcolor: 'rgba(116, 185, 255, 0.15)', color: '#0984e3' }} />
              </Box>
            </Box>
            <Box
              sx={{ ...(cardSx as any), cursor: 'pointer', userSelect: 'none' }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/okuma')}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate('/okuma'); }}
            >
              <Typography fontSize={28} mb={1}>📖</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Okuma Oyunu</Typography>
              <Typography fontSize={14} color="#455a64">Bir paragrafı okuyup ardından 4-5 çoktan seçmeli soruyu cevaplıyorsun. Her sorudan sonra doğru-yanlış geri bildirimi ve açıklama alırsın. Okuduğunu anlama ve çıkarım yapma becerini geliştirirsin. Oyun sonunda genel başarını görebilirsin. Farklı seviyelerde metinlerle pratik yapabilirsin.</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Reading" variant="outlined" size="small" sx={{ borderColor: 'rgba(0, 184, 148, 0.4)', color: '#00695c' }} />
                <Chip label="Seviye: A1–B2" size="small" sx={{ bgcolor: 'rgba(116, 185, 255, 0.15)', color: '#0984e3' }} />
              </Box>
            </Box>
            <Box
              sx={{ ...(cardSx as any), cursor: 'pointer', userSelect: 'none' }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/bosluk-doldurma')}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate('/bosluk-doldurma'); }}
            >
              <Typography fontSize={28} mb={1}>🧠</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Boşluk Doldurma</Typography>
              <Typography fontSize={14} color="#455a64">Bir paragraftaki boşlukları doğru kelime veya gramer seçeneğiyle doldurursun. Her seçimden sonra anında geri bildirim alırsın. Yanlışlarda açıklama ve doğru cevabı öğrenirsin. Bağlam içinde kelime ve dilbilgisi pratiği yaparsın. Oyun sonunda genel başarını görebilirsin.</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Bağlamlı alıştırma" variant="outlined" size="small" sx={{ borderColor: 'rgba(0, 184, 148, 0.4)', color: '#00695c' }} />
                <Chip label="A1–B2" size="small" sx={{ bgcolor: 'rgba(116, 185, 255, 0.15)', color: '#0984e3' }} />
              </Box>
            </Box>
            <Box
              sx={{ ...(cardSx as any), cursor: 'pointer', userSelect: 'none' }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/essay-writing')}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate('/essay-writing'); }}
            >
              <Typography fontSize={28} mb={1}>📝</Typography>
              <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>Essay</Typography>
              <Typography fontSize={14} color="#455a64">Belirlenen konuda İngilizce essay yazarsın. Yazdığın metin yapay zekâ tarafından değerlendirilir ve puanlanır. Hataların ve güçlü yönlerin detaylı şekilde gösterilir. Gelişim için öneriler alırsın. Her denemede yazma becerini artırabilirsin.</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Zorluk: Orta" variant="outlined" size="small" sx={{ borderColor: 'rgba(0, 184, 148, 0.4)', color: '#00695c' }} />
                <Chip label="~10 dk" size="small" sx={{ bgcolor: 'rgba(116, 185, 255, 0.15)', color: '#0984e3' }} />
              </Box>
            </Box>
          </Box>

          {/* Kısa istatistikler */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: { xs: 1.5, md: 2 }, mb: 2 }}>
            {[{label: 'Test/Quiz', value: '40+'}, {label: 'Soru', value: '500+'}, {label: 'Oyun', value: '6'}, {label: 'Sınav Türü', value: '4'}].map((s) => (
              <Paper key={s.label} sx={{ p: 2, textAlign: 'center', borderRadius: 3, border: '1px solid #e3eafc' }}>
                <Typography fontSize={22} fontWeight={800} color="#19376D">{s.value}</Typography>
                <Typography fontSize={13} color="#607d8b">{s.label}</Typography>
              </Paper>
            ))}
          </Box>

          {/* Guest benefits as cards like Oyunlarımız */}
          {!token && (
            <>
              <Typography variant="h6" fontWeight={800} mb={2} sx={{ color: '#00695c' }}>Üye Olunca Neler Kazanırsın?</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: { xs: 2, md: 2.5 }, mb: 3 }}>
                {[ 
                  { icon: '🏆', title: 'Sıralamalar', desc: 'Puanın ve rozetlerinle listelerde yer al.', href: '/rankings' },
                  { icon: '🕒', title: 'Çözüm Geçmişi', desc: 'Geçmiş sonuçlarını ve gelişimini takip et.', href: '/register' },
                  { icon: '💬', title: 'Yorumlar', desc: 'Sıralama sayfasında yorum yap, iletişime geç.', href: '/register' },
                ].map((f) => (
                  <Box
                    key={f.title}
                    sx={{ ...(cardSx as any), cursor: 'pointer', userSelect: 'none' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${f.title} kartı, ${f.href === '/register' ? 'kayıt ol' : 'sıralamalar'} sayfasına gider`}
                    onClick={() => navigate(f.href)}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(f.href); }}
                  >
                    <Typography fontSize={28} mb={1}>{f.icon}</Typography>
                    <Typography fontWeight={700} fontSize={18} color="#00695c" mb={0.5}>{f.title}</Typography>
                    <Typography fontSize={14} color="#455a64">{f.desc}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Call to action for guests */}
          {!token && (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 3 } }}>
              <Button
                onClick={() => (window.location.href = '/register')}
                sx={{
                  background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                  color: '#fff',
                  fontWeight: 700,
      fontSize: { xs: 16, md: 18 },
                  borderRadius: 2,
      px: { xs: 3.5, md: 5 },
      py: { xs: 1.25, md: 1.5 },
      boxShadow: { xs: '0 4px 14px rgba(0,0,0,0.08)', md: '0 6px 20px rgba(0,0,0,0.08)' },
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
