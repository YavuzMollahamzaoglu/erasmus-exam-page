import React, { useEffect, useState } from 'react';
import setMetaTags from '../utils/seo';
import { Box, Paper, Typography, Button, Alert, Fade, IconButton, LinearProgress } from '@mui/material';
import MoreLearningLinks from '../components/MoreLearningLinks';
import Breadcrumb from '../components/Breadcrumb';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate, useSearchParams } from 'react-router-dom';
 

type WordPair = {
  id: number; // internal sequential id for matching
  turkish: string;
  english: string;
};

type PoolWord = {
  id: number; // pair id
  text: string; // english
  used: boolean;
};

type Target = {
  id: number; // pair id
  turkish: string;
  english: string; // reveal when matched
  example?: string;
  matched: boolean;
  wrongFlash: boolean;
};

// Words will come from backend (MySQL via Prisma)

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, '0');
  const s = (secs % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Capitalize helpers (English and Turkish-aware first-letter only)
const capFirstEn = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const capFirstTr = (s: string) => {
  if (!s) return s;
  const first = s[0];
  let up = first;
  if (first === 'i') up = 'İ';
  else if (first === 'ı') up = 'I';
  else up = first.toUpperCase();
  return up + s.slice(1);
};

export default function WordMatchingGame() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const level = (searchParams.get('level') || 'a1').toUpperCase();
  const setId = searchParams.get('setId');
  const [sets, setSets] = useState<Array<{ id: string; title: string }>>([]);

  const GAME_WORD_COUNT = 15; // each game will have 15 words

  const [pool, setPool] = useState<PoolWord[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [matched, setMatched] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null); // tap support
  const [gameCompleted, setGameCompleted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setMetaTags({
      title: 'Kelime Eşleştirme Oyunu | İngilizce - Türkçe Kelime Oyunu',
      description: 'İngilizce kelimeleri Türkçe karşılıklarıyla eşleştirin. A1-B2 seviye kelime ezberlemek ve vocabulary geliştirmek için ideal oyun.',
      keywords: 'kelime eşleştirme, word matching game, ingilizce türkçe kelime, vocabulary game, kelime oyunu',
      canonical: '/kelime-eslestirme'
    });
    (async () => {
      if (setId) {
        // Fetch specific set
        try {
          const API_URL = process.env.REACT_APP_API_URL;
          const res = await fetch(`${API_URL}/api/games/word-matching/set/${setId}`);
          if (!res.ok) throw new Error('Failed to fetch set');
          const data = await res.json();
          if (data.words) {
            setPool(data.words.map((w: any, i: number) => ({ id: i, en: w.word, tr: w.translation })));
          }
        } catch {
          console.error('Set yüklenemedi.');
        }
      } else {
        // Fetch random words by level
        try {
          const API_URL = process.env.REACT_APP_API_URL;
          const res = await fetch(`${API_URL}/api/games/word-matching/words?level=${level}&count=30`);
          if (!res.ok) throw new Error('Failed to fetch words');
          const data = await res.json();
          setPool(data.map((w: any, i: number) => ({ id: i, en: w.word, tr: w.translation })));
        } catch {
          console.error('Kelimeler yüklenemedi.');
        }
      }
    })();
  }, [level, setId]);

  const [elapsed, setElapsed] = useState(0); // stopwatch seconds (hidden while playing)
  const [wrongMsg, setWrongMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Prepare game by fetching: if setId is provided, use that set; otherwise choose 15 random from words API
  const API_URL = process.env.REACT_APP_API_URL;
  const initGame = async () => {
    try {
      let pairs: WordPair[] = [];
      if (setId) {
        const res = await fetch(`${API_URL}/api/games/word-matching/sets/${setId}`, { cache: 'no-store' });
        const data = await res.json();
        const items: Array<{ english: string; turkish: string }> = Array.isArray(data?.items) ? data.items : [];
        pairs = items.slice(0, GAME_WORD_COUNT).map((w, idx) => ({ id: idx + 1, english: w.english, turkish: w.turkish }));
      } else {
        const apiLevel = ['A1','A2','B1','B2'].includes(level) ? level : 'A1';
        const res = await fetch(`${API_URL}/api/words?level=${apiLevel}&limit=200`, { cache: 'no-store' });
        const data = await res.json();
        const raw: Array<{ id: string; english: string; turkish: string }> = Array.isArray(data?.words) ? data.words : [];
        const chosen = shuffle(raw).slice(0, GAME_WORD_COUNT);
        pairs = chosen.map((w, idx) => ({ id: idx + 1, english: w.english, turkish: w.turkish }));
      }

      const newPool: PoolWord[] = shuffle(
        pairs.map((p) => ({ id: p.id, text: p.english, used: false }))
      );
      const newTargets: Target[] = pairs.map((p) => ({
        id: p.id,
        turkish: p.turkish,
        english: p.english,
        example: (p as any).example || (p as any).sentence || '',
        matched: false,
        wrongFlash: false,
      }));

      setPool(newPool);
      setTargets(newTargets);
      setMatched(0);
      setSelectedWordId(null);
      setElapsed(0);
      setPlaying(true);
      setGameCompleted(false);
      setWrongMsg(false);
      setSuccessMsg(false);
    } catch (e) {
      // Fallback: basic static list if API is unreachable
      const fallback: WordPair[] = [
        { id: 1, turkish: 'merhaba', english: 'hello' },
        { id: 2, turkish: 'dünya', english: 'world' },
        { id: 3, turkish: 'aile', english: 'family' },
        { id: 4, turkish: 'okul', english: 'school' },
        { id: 5, turkish: 'kitap', english: 'book' },
        { id: 6, turkish: 'su', english: 'water' },
        { id: 7, turkish: 'ev', english: 'house' },
        { id: 8, turkish: 'araba', english: 'car' },
        { id: 9, turkish: 'yemek', english: 'food' },
        { id: 10, turkish: 'zaman', english: 'time' },
        { id: 11, turkish: 'para', english: 'money' },
        { id: 12, turkish: 'çalışma', english: 'work' },
        { id: 13, turkish: 'oyun', english: 'game' },
        { id: 14, turkish: 'müzik', english: 'music' },
      ];
      const pairs = shuffle(fallback).slice(0, GAME_WORD_COUNT).map((p, i) => ({ ...p, id: i + 1 }));
      const newPool: PoolWord[] = shuffle(
        pairs.map((p) => ({ id: p.id, text: p.english, used: false }))
      );
      const newTargets: Target[] = pairs.map((p) => ({
        id: p.id,
        turkish: p.turkish,
        english: p.english,
        example: (p as any).example || (p as any).sentence || '',
        matched: false,
        wrongFlash: false,
      }));
      setPool(newPool);
      setTargets(newTargets);
      setMatched(0);
      setSelectedWordId(null);
      setElapsed(0);
      setPlaying(true);
      setGameCompleted(false);
      setWrongMsg(false);
      setSuccessMsg(false);
    }
  };

  // Load game whenever level or setId changes
  useEffect(() => {
    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, setId]);

  // Fetch available sets for arrows
  useEffect(() => {
    const loadSets = async () => {
      try {
        const apiLevel = ['A1','A2','B1','B2'].includes(level) ? level : 'A1';
        const res = await fetch(`http://localhost:4000/api/games/word-matching/sets?level=${apiLevel}`, { cache: 'no-store' });
        const data = await res.json();
        const list: Array<{ id: string; title: string }> = Array.isArray(data?.sets) ? data.sets.map((s: any) => ({ id: s.id, title: s.title })) : [];
        setSets(list);
      } catch {}
    };
    loadSets();
  }, [level]);

  // Stopwatch (hidden while playing)
  useEffect(() => {
    if (!playing || gameCompleted) return;
    const t = setInterval(() => setElapsed((c) => c + 1), 1000);
    return () => clearInterval(t);
  }, [playing, gameCompleted]);

  // Drag handlers
  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    wordId: number
  ) => {
    if (!playing) return;
    e.dataTransfer.setData('text/plain', String(wordId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!playing) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const tryMatch = (targetId: number, wordId: number) => {
    if (!playing) return;
    if (targets.find((t) => t.id === targetId)?.matched) return;
    if (pool.find((p) => p.id === wordId)?.used) return;

  if (targetId === wordId) {
      // success
      setTargets((prev) =>
        prev.map((t) => (t.id === targetId ? { ...t, matched: true } : t))
      );
      setPool((prev) => prev.map((w) => (w.id === wordId ? { ...w, used: true } : w)));
      setMatched((m) => m + 1);
      setSelectedWordId(null);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 800);
    } else {
      // wrong
      setTargets((prev) =>
        prev.map((t) =>
          t.id === targetId ? { ...t, wrongFlash: true } : t
        )
      );
      setWrongMsg(true);
      setTimeout(() => {
        setWrongMsg(false);
        setTargets((prev) => prev.map((t) => ({ ...t, wrongFlash: false })));
      }, 650);
    }
  };

  const onDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetId: number
  ) => {
    if (!playing) return;
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const wordId = Number(data);
    if (!Number.isFinite(wordId)) return;
    tryMatch(targetId, wordId);
  };

  // Tap/click support
  const handleWordClick = (wordId: number) => {
    if (!playing) return;
    const word = pool.find((w) => w.id === wordId);
    if (!word || word.used) return;
    setSelectedWordId((prev) => (prev === wordId ? null : wordId));
  };

  const handleTargetClick = (targetId: number) => {
    if (!playing) return;
    if (selectedWordId == null) return;
    tryMatch(targetId, selectedWordId);
  };

  // Complete detection
  useEffect(() => {
    if (targets.length > 0 && matched === targets.length) {
      setPlaying(false);
      setGameCompleted(true);
    }
  }, [matched, targets.length]);

  const reset = () => initGame();

  const handleNewWords = () => {
    if (setId && sets.length > 1) {
      // pick a different random set
      const others = sets.filter((s) => s.id !== setId);
      const next = others[Math.floor(Math.random() * others.length)];
      navigate(`/kelime-eslestirme-game?level=${level.toLowerCase()}&setId=${next.id}`);
    } else {
      // no set: re-fetch and sample a new random 15
      reset();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', display: 'flex', flexDirection: 'column', alignItems: 'center', pb: { xs: 12, md: 16 }, pt: 0, px: 2 }}>
      <Box sx={{ maxWidth: 1000, width: '100%', pt: 2, display: 'flex', justifyContent: 'center' }}>
        <Breadcrumb items={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Oyunlar', href: '/#games' },
          { label: 'Kelime Eşleştirme' }
        ]} />
      </Box>
      <Paper elevation={6} sx={{ p: 0, borderRadius: 4, minWidth: 340, width: '100%', maxWidth: 1000, mt: { xs: 1, md: '15px' }, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        {/* Header */}
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {/* Mobile stacked back (icon above label) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 56 }}>
            <IconButton onClick={() => navigate('/kelime-eslestirme')} sx={{ color: '#fff', p: 0.5 }} aria-label="Geri">
              <ArrowBackIcon sx={{ fontSize: 26 }} />
            </IconButton>
            <Typography variant="caption" sx={{ mt: 0.25, color: '#fff', fontWeight: 700 }}>Geri</Typography>
          </Box>

          {/* Desktop back button - restore left-side back button */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, minWidth: 56 }}>
            <IconButton onClick={() => navigate('/kelime-eslestirme')} sx={{ color: '#fff' }} aria-label="Geri">
              <ArrowBackIcon sx={{ fontSize: 26 }} />
            </IconButton>
          </Box>

          {/* Title - centered on all viewports using absolute positioning */}
          <Box sx={{ textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
            <Typography variant="h5" fontWeight={700} mb={1} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
              Kelime Eşleştirme
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Seviye: {level}
            </Typography>
          </Box>

          {/* Right controls - shrink on mobile and tighten icon spacing */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Mobile: stacked refresh icon + short label */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 56 }}>
                <IconButton onClick={handleNewWords} sx={{ color: '#fff', p: 0.5 }} aria-label="Yeni Kelimeler">
                  <RefreshIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <Typography variant="caption" sx={{ mt: 0.25, color: '#fff', fontWeight: 700, lineHeight: 1 }}>
                  <span style={{ display: 'block' }}>Yeni</span>
                  <span style={{ display: 'block', fontSize: 11 }}>Kelimeler</span>
                </Typography>
              </Box>

            {/* Desktop: full text button */}
            <Button onClick={handleNewWords} startIcon={<RefreshIcon sx={{ fontSize: 20 }} />} sx={{ display: { xs: 'none', md: 'inline-flex' }, color: '#fff', fontWeight: 600, textTransform: 'none', px: 2, py: 0.5 }}>
              Yeni Kelimeler
            </Button>
          </Box>
        </Box>
        {/* Progress Bar Section */}
        <Box sx={{ px: 4, py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" color="#00695c" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              İlerleme
              <Box component="span" sx={{ 
                bgcolor: '#e0f2f1', 
                color: '#00897b', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: 2, 
                fontSize: '0.9rem' 
              }}>
                {matched} / {targets.length || GAME_WORD_COUNT}
              </Box>
            </Typography>
            {setId && sets.length > 0 && (
              <Typography variant="body2" color="#00695c" sx={{ opacity: 0.8, fontWeight: 500 }}>
                Set: {sets.find((s) => s.id === setId)?.title || ''}
              </Typography>
            )}
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(matched / (targets.length || GAME_WORD_COUNT)) * 100} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: '#e0f2f1',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)',
              }
            }} 
          />
        </Box>

        {/* Alerts */}
        <Box sx={{ px: 3 }}>
          {wrongMsg && (
            <Fade in={wrongMsg}>
              <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2, borderRadius: 2 }}>
                <div>Yanlış eşleşme! Tekrar deneyin.</div>
              </Alert>
            </Fade>
          )}
          {successMsg && (
            <Fade in={successMsg}>
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2, borderRadius: 2 }}>
                Doğru! Devam.
              </Alert>
            </Fade>
          )}
          {gameCompleted && (
            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3, borderRadius: 2, fontSize: 16 }}>
              Tebrikler! Tüm eşleşmeler tamamlandı. Süreniz: {formatTime(elapsed)}
            </Alert>
          )}
        </Box>

        {/* Top pool (English words) fixed to two rows) - polished pill UI */}
        <Box sx={{ px: 4, pb: 2 }}>
          {(() => {
            const half = Math.ceil(pool.length / 2);
            const rows = [pool.slice(0, half), pool.slice(half)];
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {rows.map((row, idx) => (
                  <Box key={idx} sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center', 
                    gap: 1.5 
                  }}>
                    {row.map((w, wordIdx) => {
                      // More vibrant, modern palette
                      const colorPalette = [
                        { bg: '#FF6B6B', shadow: '#EE5253' }, // Red
                        { bg: '#4ECDC4', shadow: '#22A6B3' }, // Teal
                        { bg: '#45B7D1', shadow: '#2D98DA' }, // Blue
                        { bg: '#96CEB4', shadow: '#58B19F' }, // Green
                        { bg: '#FFEEAD', shadow: '#F7D794', text: '#555' }, // Yellow
                        { bg: '#D4A5A5', shadow: '#B33771' }, // Pinkish
                        { bg: '#9B59B6', shadow: '#8E44AD' }, // Purple
                        { bg: '#34495E', shadow: '#2C3E50' }, // Dark Blue
                      ];
                      const theme = colorPalette[(w.id + wordIdx) % colorPalette.length];
                      const isSelected = selectedWordId === w.id;
                      
                      return (
                      <Box
                        key={w.id}
                        draggable={!w.used && playing}
                        onDragStart={(e) => onDragStart(e, w.id)}
                        onClick={() => handleWordClick(w.id)}
                        sx={{
                          userSelect: 'none',
                          cursor: w.used || !playing ? 'default' : 'grab',
                          opacity: w.used ? 0.2 : 1,
                          transform: w.used ? 'scale(0.9)' : (isSelected ? 'scale(1.05)' : 'scale(1)'),
                          borderRadius: 3,
                          px: 2.5,
                          py: 1.2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.text || '#fff',
                          fontWeight: 800,
                          fontSize: { xs: 13, sm: 15 },
                          minWidth: 100,
                          boxShadow: w.used 
                            ? 'none' 
                            : isSelected 
                              ? `0 8px 20px ${theme.shadow}66` 
                              : `0 4px 0 ${theme.shadow}`,
                          border: isSelected ? `2px solid ${theme.shadow}` : 'none',
                          background: theme.bg,
                          transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          '&:hover': {
                            transform: !w.used && playing ? 'translateY(-2px)' : 'none',
                            boxShadow: !w.used && playing ? `0 6px 0 ${theme.shadow}` : 'none',
                          },
                          '&:active': { 
                            transform: !w.used && playing ? 'translateY(2px)' : 'none',
                            boxShadow: !w.used && playing ? `0 2px 0 ${theme.shadow}` : 'none',
                          },
                        }}
                      >
                        {capFirstEn(String(w.text).toLowerCase())}
                      </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            );
          })()}
        </Box>

        {/* Bottom targets (Turkish labels) - fixed 3x5 grid with clearer slots */}
        <Box sx={{ p: 4, pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2.5 }}>
            {targets.map((t) => (
              <Box 
                key={t.id} 
                onDragOver={onDragOver} 
                onDrop={(e) => onDrop(e, t.id)} 
                onClick={() => handleTargetClick(t.id)} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 1,
                  cursor: t.matched ? 'default' : 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: !t.matched && selectedWordId ? 'scale(1.02)' : 'none'
                  }
                }}
              >
                <Box sx={{
                  width: '100%',
                  height: 64,
                  borderRadius: 3,
                  border: t.matched
                    ? 'none'
                    : t.wrongFlash
                    ? '2px solid #ef5350'
                    : selectedWordId != null
                    ? '2px dashed #00b894'
                    : '2px dashed #cfd8dc',
                  background: t.matched
                    ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
                    : t.wrongFlash
                    ? '#ffebee'
                    : selectedWordId != null
                    ? 'rgba(0, 184, 148, 0.05)'
                    : '#f8f9fa',
                  boxShadow: t.matched 
                    ? '0 4px 12px rgba(46, 204, 113, 0.4)' 
                    : 'inset 0 2px 4px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: t.matched ? '#fff' : '#546e7a',
                  fontWeight: 800,
                  fontSize: 15,
                  textTransform: 'capitalize',
                  letterSpacing: 0.4,
                  transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {t.matched && (
                    <CheckCircleIcon sx={{ 
                      position: 'absolute', 
                      top: 4, 
                      right: 4, 
                      fontSize: 16, 
                      opacity: 0.8 
                    }} />
                  )}
                  {t.matched ? capFirstEn(String(t.english).toLowerCase()) : (selectedWordId ? 'Buraya Bırak' : '')}
                </Box>
                <Typography variant="body2" sx={{ 
                  fontWeight: 700, 
                  color: t.matched ? '#2ecc71' : '#455a64', 
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s ease'
                }}>
                  {capFirstTr(String(t.turkish).toLocaleLowerCase('tr'))}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1.5 }}>
            <Button variant="outlined" onClick={() => navigate('/kelime-eslestirme')} sx={{ borderColor: '#00b894', color: '#00695c', fontWeight: 600, borderRadius: 2, px: 3, mb: '15px', '&:hover': { borderColor: '#00cec9', backgroundColor: 'rgba(0, 184, 148, 0.04)' } }}>
              Seviye Değiştir
            </Button>
            {gameCompleted && (
              <Button variant="contained" onClick={reset} sx={{ background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)', color: '#fff', fontWeight: 600, borderRadius: 2, px: 3, '&:hover': { background: 'linear-gradient(90deg, #00cec9 0%, #00b894 100%)' } }}>
                Tekrar Oyna
              </Button>
            )}
          </Box>
          {/* Finish button below actions to go to classic questions */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5, mb: 3 }}>
            <Button
              aria-label="Bitir ve Klasik Sorulara Dön"
              onClick={() => navigate('/questions')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 3,
                px: 3,
                py: 1.1,
                background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                color: '#fff',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                '&:hover': { background: 'linear-gradient(135deg, #00a085 0%, #00b8b3 100%)' }
              }}
              variant="contained"
            >
              Bitir
            </Button>
          </Box>
      </Paper>
      <MoreLearningLinks />
      
    </Box>
  );
}
