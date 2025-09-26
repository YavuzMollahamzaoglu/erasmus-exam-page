import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography, Button, Alert, Fade } from '@mui/material';
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
  const [elapsed, setElapsed] = useState(0); // stopwatch seconds (hidden while playing)
  const [playing, setPlaying] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [wrongMsg, setWrongMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Prepare game by fetching: if setId is provided, use that set; otherwise choose 15 random from words API
  const initGame = async () => {
    try {
      let pairs: WordPair[] = [];
      if (setId) {
        const res = await fetch(`http://localhost:4000/api/games/word-matching/sets/${setId}`, { cache: 'no-store' });
        const data = await res.json();
        const items: Array<{ english: string; turkish: string }> = Array.isArray(data?.items) ? data.items : [];
        pairs = items.slice(0, GAME_WORD_COUNT).map((w, idx) => ({ id: idx + 1, english: w.english, turkish: w.turkish }));
      } else {
        const apiLevel = ['A1','A2','B1','B2'].includes(level) ? level : 'A1';
        const res = await fetch(`http://localhost:4000/api/words?level=${apiLevel}&limit=200`, { cache: 'no-store' });
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
      <Paper elevation={6} sx={{ p: 0, borderRadius: 4, minWidth: 340, width: '100%', maxWidth: 1000, mt: { xs: 1, md: '15px' }, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        {/* Header */}
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/kelime-eslestirme')} sx={{ color: '#fff', fontWeight: 600 }}>
            Geri
          </Button>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="h5" fontWeight={700} mb={1}>
              Kelime Eşleştirme
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Seviye: {level}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Button startIcon={<RefreshIcon />} onClick={handleNewWords} sx={{ color: '#fff', fontWeight: 600 }}>
              Yeni Kelimeler
            </Button>
          </Box>
        </Box>
        {/* Simple progress text (no filling bar, no live time) */}
        <Box sx={{ p: 3, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="#00695c" fontWeight={600}>
              İlerleme: {matched}/{targets.length || GAME_WORD_COUNT}
            </Typography>
            {setId && sets.length > 0 && (
              <Typography variant="body2" color="#00695c" sx={{ opacity: 0.8 }}>
                Set: {sets.find((s) => s.id === setId)?.title || ''}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Alerts */}
        <Box sx={{ px: 3 }}>
          {wrongMsg && (
            <Fade in={wrongMsg}>
              <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2, borderRadius: 2 }}>
                Yanlış eşleşme! Tekrar deneyin.
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

        {/* Top pool (English words) fixed to two rows) */}
        <Box sx={{ px: 3, pb: 1 }}>
          {(() => {
            const half = Math.ceil(pool.length / 2);
            const rows = [pool.slice(0, half), pool.slice(half)];
            return (
              <>
                {rows.map((row, idx) => (
                  <Box key={idx} sx={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '1fr', gap: 1.5, overflowX: { xs: 'auto', md: 'visible' }, pb: 1 }}>
                    {row.map((w) => (
                      <Box
                        key={w.id}
                        draggable={!w.used && playing}
                        onDragStart={(e) => onDragStart(e, w.id)}
                        onClick={() => handleWordClick(w.id)}
                        sx={{
                          userSelect: 'none',
                          cursor: w.used || !playing ? 'default' : 'grab',
                          opacity: w.used ? 0.35 : 1,
                          borderRadius: 2,
                          p: 1.2,
                          textAlign: 'center',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: { xs: 12, sm: 14 },
                          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                          outline: selectedWordId === w.id ? '3px solid rgba(0, 184, 148, 0.9)' : 'none',
                          background: `linear-gradient(135deg, ${['#42a5f5','#ffca28','#ab47bc','#26a69a','#ef5350','#8d6e63','#66bb6a'][w.id % 7]} 0%, rgba(255,255,255,0.15) 100%)`,
                          transition: 'transform .15s ease',
                          '&:active': { transform: 'scale(0.98)' },
                          minWidth: 88,
                        }}
                      >
                        {w.text}
                      </Box>
                    ))}
                  </Box>
                ))}
              </>
            );
          })()}
        </Box>

        {/* Bottom targets (Turkish labels) - fixed 3x5 grid */}
        <Box sx={{ p: 3, pt: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
            {targets.map((t) => (
              <Box key={t.id} onDragOver={onDragOver} onDrop={(e) => onDrop(e, t.id)} onClick={() => handleTargetClick(t.id)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                  width: '100%',
                  height: 54,
                  borderRadius: 2,
                  border: t.matched
                    ? '2px solid #4CAF50'
                    : t.wrongFlash
                    ? '2px solid #ef5350'
                    : selectedWordId != null
                    ? '2px dashed #00b894'
                    : '2px dashed rgba(0,0,0,0.25)',
                  background: t.matched
                    ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)'
                    : 'rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: t.matched ? '#fff' : 'inherit',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                  transition: 'all .15s ease',
                }}>
                  {t.matched ? t.english : ''}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#37474F', textAlign: 'center' }}>
                  {t.turkish}
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
      </Paper>
    </Box>
  );
}
