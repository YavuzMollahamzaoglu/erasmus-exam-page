import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Alert } from '@mui/material';

interface Word { id: string; english: string; turkish: string; example?: string | null; level: string; }

const levels = ['A1','A2','B1','B2'];

// Local brand styles only for this page's button and dialogs
const brand = {
  primary: '#00b894',
  secondary: '#00cec9',
  border: 'rgba(0,184,148,0.18)'
};

const Words: React.FC = () => {
  const [level, setLevel] = useState('A1');
  const [words, setWords] = useState<Word[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/api/words?level=${level}`)
      .then(res => res.json())
      .then(data => setWords(data.words || []))
      .catch(() => setWords([]));
  }, [level]);

  const handleMoreSentences = async (wordId: string, wordText: string) => {
    setCurrentWord(wordText);
    if (!token) {
      setLoginPromptOpen(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/words/${wordId}/examples`);
      const data = await res.json();
      // Deduplicate again on client and remove the card's example to avoid repeating the same sentence
      const raw = Array.isArray(data.sentences) ? data.sentences : [];
      const norm = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/g, '').toLowerCase();
      const uniq: string[] = [];
      const seen = new Set<string>();
      for (const s of raw) {
        const key = norm(s);
        if (!seen.has(key)) { seen.add(key); uniq.push(s); }
      }
      setSentences(uniq.slice(0, 5));
      setOpen(true);
    } catch (e) {
      setSentences([]);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', px: 2, pt: 0, pb: { xs: 12, md: 16 }, display: 'flex', justifyContent: 'center' }}>
  <Paper elevation={6} sx={{ width: '100%', maxWidth: 900, borderRadius: 4, p: 0, mt: { xs: 1, md: '15px' }, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} mb={1} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: { xs: '2rem', md: '2.5rem' } }}>Kelimeler</Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, mb: 2 }}>{level} seviyesindeki kelimeler</Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Select value={level} onChange={(e) => setLevel(e.target.value)} sx={{ bgcolor: 'transparent', color: '#fff', minWidth: 120, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' }, '& .MuiSvgIcon-root': { color: '#fff' } }}>
              {levels.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </Select>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {words.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="#666">Henüz kelime bulunmuyor.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {words.map(w => (
                <Paper key={w.id} sx={{ p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,184,148,0.18)' }}>
                  <Typography fontWeight={800} fontSize={20} color="#00b894">{w.english}</Typography>
                  <Typography fontWeight={600} color="#2c3e50" mb={0.5}>{w.turkish}</Typography>
                  {w.example && (
                    <Typography variant="body2" color="text.secondary">Örnek: {w.example}</Typography>
                  )}
                  <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleMoreSentences(w.id, w.english)}
                      disabled={loading}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 999,
                        px: 1.8,
                        borderWidth: 2,
                        borderColor: brand.primary,
                        color: brand.primary,
                        '&:hover': {
                          borderColor: brand.secondary,
                          bgcolor: 'rgba(0,206,201,0.08)',
                        },
                      }}
                    >
                      Daha fazla cümle
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Sentences Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 100%)',
            border: `1px solid ${brand.border}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          },
        }}
        BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' } }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
            color: '#fff',
            fontWeight: 700,
            py: 2,
          }}
        >
          "{currentWord}" için örnek cümleler
        </DialogTitle>
        <DialogContent dividers>
          {sentences.length === 0 ? (
            <Alert severity="info">Cümle bulunamadı.</Alert>
          ) : (
            <List>
              {sentences.map((s, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={s} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 999,
              borderWidth: 2,
              borderColor: brand.primary,
              color: brand.primary,
              '&:hover': { borderColor: brand.secondary, bgcolor: 'rgba(0,206,201,0.06)' },
            }}
          >
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login Prompt Dialog */}
      <Dialog
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 100%)',
            border: `1px solid ${brand.border}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          },
        }}
        BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' } }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
            color: '#fff',
            fontWeight: 800,
            py: 2,
          }}
        >
          Giriş Yapmalısınız
        </DialogTitle>
        <DialogContent dividers>
          <Typography>Bu özelliği kullanmak için lütfen giriş yapın.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={() => setLoginPromptOpen(false)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 999,
              borderWidth: 2,
              borderColor: brand.primary,
              color: brand.primary,
              '&:hover': { borderColor: brand.secondary, bgcolor: 'rgba(0,206,201,0.06)' },
            }}
          >
            Kapat
          </Button>
          <Button
            onClick={() => { window.location.href = '/login'; }}
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: 999,
              fontWeight: 700,
              px: 2.2,
              background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
              boxShadow: '0 10px 24px rgba(0,184,148,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00a884 0%, #00bcbc 100%)',
                boxShadow: '0 10px 28px rgba(0,184,148,0.45)',
              },
            }}
          >
            Giriş Yap
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Words;
