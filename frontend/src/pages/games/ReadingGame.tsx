import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Button, RadioGroup, FormControlLabel, Radio, Alert, Chip, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type Passage = { id: string; title: string; text: string; level: string };
type ReadingQuestion = { id: string; question: string; options: string[]; correctIndex: number; explanation?: string };

const API = 'http://localhost:4000/api/games/reading';

const ReadingGame: React.FC = () => {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const levelParam = (sp.get('level') || 'a1').toUpperCase();

  const [passages, setPassages] = useState<Passage[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [current, setCurrent] = useState<Passage | null>(null);
  const [questions, setQuestions] = useState<ReadingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load list of passages for the selected level
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/passages?level=${encodeURIComponent(levelParam)}`);
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        const list: Passage[] = (data.passages || []).map((p: any) => ({ id: p.id, title: p.title, text: '', level: p.level }));
        setPassages(list);
        setCurrentIdx(0);
      } catch (e) {
        setError('Paragraflar yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [levelParam]);

  // Load current passage content + questions
  useEffect(() => {
    const id = passages[currentIdx]?.id;
    if (!id) { setCurrent(null); setQuestions([]); return; }
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/passages/${id}`);
        if (!res.ok) throw new Error('not ok');
        const data = await res.json();
        setCurrent(data.passage);
        setQuestions(data.questions || []);
        setAnswers({});
        setSubmitted(false);
      } catch (e) {
        setError('Paragraf yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, [passages, currentIdx]);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((acc, q) => acc + ((answers[q.id] ?? -1) === q.correctIndex ? 1 : 0), 0);
  }, [submitted, questions, answers]);

  const handleSubmit = () => setSubmitted(true);
  const next = () => setCurrentIdx((i) => Math.min(i + 1, Math.max(0, passages.length - 1)));
  const prev = () => setCurrentIdx((i) => Math.max(0, i - 1));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', px: 2, pb: { xs: 12, md: 16 }, pt: 0 }}>
      <Paper elevation={6} sx={{ width: '100%', maxWidth: 920, borderRadius: 4, overflow: 'hidden', mt: { xs: 1, md: '15px' }, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        {/* Header */}
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, textAlign: 'center', position: 'relative' }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" fontWeight={800}>Okuma Oyunu</Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.95, mt: 0.5 }}>Seviye: <b>{levelParam}</b></Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {/* Nav */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => navigate(-1)} aria-label="Geri">
                <ArrowBackIcon />
              </IconButton>
              <Chip label={`Paragraf ${passages.length ? currentIdx + 1 : 0}/${passages.length}`} color="success" variant="outlined" />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Önceki Paragraf"><span><IconButton disabled={currentIdx <= 0} onClick={prev}><ArrowBackIcon /></IconButton></span></Tooltip>
              <Tooltip title="Sonraki Paragraf"><span><IconButton disabled={currentIdx >= passages.length - 1} onClick={next}><ArrowForwardIcon /></IconButton></span></Tooltip>
            </Box>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}><CircularProgress /></Box>
          )}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {current && (
            <>
              {/* Passage */}
              <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #e3eafc', background: '#fff', mb: 2 }}>
                <Typography variant="h6" fontWeight={800} color="#00695c" mb={1}>{current.title}</Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, color: '#2c3e50' }}>{current.text}</Typography>
              </Paper>

              {/* Questions */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {questions.map((q, idx) => {
                  const selected = answers[q.id] ?? null;
                  const isCorrect = submitted && selected === q.correctIndex;
                  const isWrong = submitted && selected !== null && selected !== q.correctIndex;
                  return (
                    <Paper key={q.id} elevation={0} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, border: '1px solid #e3eafc', background: isCorrect ? '#e6ffe6' : isWrong ? '#ffe6e6' : '#fff' }}>
                      <Typography fontWeight={700} color="#19376D" mb={1}>{idx + 1}. {q.question}</Typography>
                      <RadioGroup value={selected ?? -1} onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: parseInt(e.target.value, 10) }))}>
                        {q.options.map((opt, i) => (
                          <FormControlLabel key={i} value={i} control={<Radio disabled={submitted} />} label={opt} />
                        ))}
                      </RadioGroup>
                      {submitted && q.explanation && (
                        <Alert severity="info" sx={{ mt: 1 }}>{q.explanation}</Alert>
                      )}
                    </Paper>
                  );
                })}
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                {!submitted ? (
                  <Button onClick={handleSubmit} variant="contained" sx={{ background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)', color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, py: 1.1, textTransform: 'none' }}>Cevapları Gönder</Button>
                ) : (
                  <>
                    <Alert severity="success">Skor: {score}/{questions.length}</Alert>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button onClick={() => { setSubmitted(false); setAnswers({}); }} variant="outlined">Tekrar İşaretle</Button>
                      <Button onClick={next} variant="contained" sx={{ background: 'linear-gradient(90deg, #00cec9 0%, #00b894 100%)', color: '#fff', fontWeight: 700, borderRadius: 2, px: 2.5, py: 1, textTransform: 'none' }}>Sonraki</Button>
                    </Box>
                  </>
                )}
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ReadingGame;
