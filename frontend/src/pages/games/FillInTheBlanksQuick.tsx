import React, { useEffect, useState } from 'react';
import setMetaTags from '../../utils/seo';
import { Box, Typography, IconButton, LinearProgress, CircularProgress, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
 

interface FillInTheBlanksQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswers: string[];
  explanation: string;
}

const TIME_LIMIT = 45; // seconds per question (quick mode)

const FillInTheBlanksQuick: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<FillInTheBlanksQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [summary, setSummary] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setMetaTags({
      title: 'Hızlı Boşluk Doldurma — Pratik Modu',
      description: 'Hızlı boşluk doldurma modu ile hız ve doğruluk geliştir. Kısa sürede çok sayıda soru çözün.',
      keywords: 'hızlı boşluk doldurma, quick fill, pratik modu',
      canonical: '/bosluk-doldurma-quick',
      ogImage: '/social-preview.svg'
    });
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.REACT_APP_API_URL;
        const res = await fetch(`${API_URL}/api/games/fill-in-the-blanks/questions`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data);
        if (data.length > 0) resetCurrentQuestion(data[0]);
        setError(null);
      } catch (e) {
        console.error(e);
        // Minimal fallback
        const sample: FillInTheBlanksQuestion[] = [
          {
            id: 'fill-1',
            text: 'I __________ from Turkey. My name __________ John. She __________ a student. We __________ happy today. They __________ at home.',
            options: ['am', 'is', 'are', 'was', 'were'],
            correctAnswers: ['am', 'is', 'is', 'are', 'are'],
            explanation: 'To be fiili kullanım pratikleri.'
          }
        ];
        setQuestions(sample);
        resetCurrentQuestion(sample[0]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const resetCurrentQuestion = (q: FillInTheBlanksQuestion) => {
    setUserAnswers(Array(q.correctAnswers.length).fill(null));
    // Shuffle options for quick mode
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    setAvailableOptions(shuffled);
    setIsSubmitted(false);
    setShowResults(false);
    setTimeLeft(TIME_LIMIT);
  };

  // Per-question countdown
  useEffect(() => {
    if (loading || error || showSummary) return;
    if (isSubmitted) return; // stop ticking after submit
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          // Auto-submit when time is up
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [loading, error, isSubmitted, showSummary, currentIndex]);

  const currentQuestion = questions[currentIndex];

  const handleDragStart = (e: React.DragEvent, option: string) => {
    setDraggedItem(option);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = (e: React.DragEvent, blankIndex: number) => {
    e.preventDefault();
    if (!draggedItem || isSubmitted) return;
    if (userAnswers[blankIndex]) setAvailableOptions(prev => [...prev, userAnswers[blankIndex] as string]);
    const next = [...userAnswers];
    next[blankIndex] = draggedItem;
    setUserAnswers(next);
    setAvailableOptions(prev => prev.filter(o => o !== draggedItem));
    setDraggedItem(null);
  };
  const handleDragStartFromBlank = (e: React.DragEvent, word: string, blankIndex: number) => {
    if (!word || isSubmitted) return;
    setDraggedItem(word);
    e.dataTransfer.effectAllowed = 'move';
    const next = [...userAnswers];
    next[blankIndex] = null;
    setUserAnswers(next);
    setAvailableOptions(prev => [...prev, word]);
  };
  const handleDropToOptions = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && !isSubmitted) {
      setAvailableOptions(prev => prev.includes(draggedItem) ? prev : [...prev, draggedItem]);
      setDraggedItem(null);
    }
  };

  // Touch-friendly tap handlers
  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    if (!availableOptions.includes(option)) return;
    setSelectedOption(prev => (prev === option ? null : option));
  };

  const handleBlankClick = (blankIndex: number) => {
    if (isSubmitted) return;
    const current = userAnswers[blankIndex];
    if (selectedOption && !current) {
      const newAnswers = [...userAnswers];
      newAnswers[blankIndex] = selectedOption;
      setUserAnswers(newAnswers);
      setAvailableOptions(prev => prev.filter(o => o !== selectedOption));
      setSelectedOption(null);
      return;
    }
    if (current) {
      // remove current answer back to options
      setAvailableOptions(prev => [...prev, current]);
      const newAnswers = [...userAnswers];
      newAnswers[blankIndex] = null;
      setUserAnswers(newAnswers);
    }
  };
  const handleRemoveAnswer = (i: number) => {
    if (userAnswers[i] && !isSubmitted) {
      setAvailableOptions(prev => [...prev, userAnswers[i] as string]);
      const next = [...userAnswers]; next[i] = null; setUserAnswers(next);
    }
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;
    setIsSubmitted(true);
    let correctCount = 0;
    currentQuestion.correctAnswers.forEach((ans, i) => { if (userAnswers[i] === ans) correctCount++; });
    setScore(correctCount);
    setShowResults(true);
    setSummary(prev => ({ correct: prev.correct + correctCount, total: prev.total + currentQuestion.correctAnswers.length }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      resetCurrentQuestion(questions[currentIndex + 1]);
    } else {
      setShowSummary(true);
    }
  };
  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      resetCurrentQuestion(questions[currentIndex - 1]);
    }
  };

  const restartGame = () => {
    if (questions.length === 0) return;
    setCurrentIndex(0);
    resetCurrentQuestion(questions[0]);
    setSummary({ correct: 0, total: 0 });
    setShowSummary(false);
  };

  const renderTextWithBlanks = () => {
    if (!currentQuestion) return null;
    const parts = currentQuestion.text.split('__________');
    const result: (string | React.ReactNode)[] = [];
    parts.forEach((part, index) => {
      if (part.trim()) result.push(<span key={`text-${index}`}>{part}</span>);
      if (index < parts.length - 1) {
        const blankIndex = index;
        const userAnswer = userAnswers[blankIndex];
        const correctAnswer = currentQuestion.correctAnswers[blankIndex];
        const isCorrect = isSubmitted && userAnswer === correctAnswer;
        const isIncorrect = isSubmitted && userAnswer && userAnswer !== correctAnswer;
        result.push(
          <Box
            key={`blank-${index}`}
            draggable={!!userAnswer && !isSubmitted}
            onDragStart={(e) => userAnswer && handleDragStartFromBlank(e, userAnswer, blankIndex)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, blankIndex)}
            onClick={() => handleBlankClick(blankIndex)}
            sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: '120px', height: '40px', border: '2px solid', borderRadius: '8px',
              m: '0 4px', p: '4px 8px', cursor: userAnswer && !isSubmitted ? 'pointer' : 'default',
              backgroundColor: isSubmitted ? (isCorrect ? '#e6ffe6' : isIncorrect ? '#ffe6e6' : 'rgba(0, 184, 148, 0.1)') : userAnswer ? 'rgba(0, 184, 148, 0.2)' : 'rgba(0, 184, 148, 0.1)',
              borderColor: isSubmitted ? (isCorrect ? '#43ea7c' : isIncorrect ? '#e74c3c' : 'rgba(0, 184, 148, 0.3)') : userAnswer ? '#00b894' : 'rgba(0, 184, 148, 0.3)'
            }}
          >
            <Typography sx={{ fontWeight: userAnswer ? 600 : 400, color: isSubmitted ? (isCorrect ? '#43ea7c' : isIncorrect ? '#e74c3c' : '#2c3e50') : userAnswer ? '#00b894' : '#666' }}>
              {userAnswer || (index + 1)}
            </Typography>
          </Box>
        );
      }
    });
    return <Box sx={{ display: 'inline', lineHeight: 2.5, fontSize: '1.2rem' }}>{result}</Box>;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#b2ebf2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ color: '#00b894', mb: 2 }} />
        <Typography color="#00b894">Yükleniyor...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#b2ebf2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2ebf2', display: 'flex', flexDirection: 'column', alignItems: 'center', pb: { xs: 12, md: 16 } }}>
  <Box sx={{ width: '100%', maxWidth: 800, background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', p: 4, mt: { xs: 1, md: '15px' }, position: 'relative', overflow: 'visible', '&:hover .navArrow': { opacity: 1 } }}>
        {/* Overlay nav arrows */}
    {currentIndex > 0 && (
          <IconButton
            onClick={prevQuestion}
            className="navArrow"
            disableRipple
            sx={{
              position: 'absolute',
      left: { xs: '50%', sm: -56, md: -72 },
      right: { xs: 'auto' },
      top: { xs: 'auto', sm: '50%' },
      bottom: { xs: 10, sm: 'auto' },
      transform: { xs: 'translate(-120%, 0)', sm: 'translateY(-50%)' },
              width: { xs: 44, sm: 52 },
              height: { xs: 44, sm: 52 },
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.15)',
              color: '#2c3e50',
              backdropFilter: 'saturate(180%) blur(6px)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 2,
              pointerEvents: 'auto',
              transition: 'opacity .25s ease, transform .2s ease, background-color .2s ease, box-shadow .2s ease',
      opacity: { xs: 1, sm: 0.6 },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)', transform: 'translateY(-50%) scale(1.05)', boxShadow: '0 14px 36px rgba(0,0,0,0.2)' }
            }}
          >
            <ArrowBackIcon fontSize="medium" sx={{ color: '#00b894' }} />
          </IconButton>
        )}
        {currentIndex < questions.length - 1 && (
          <IconButton
            onClick={nextQuestion}
            className="navArrow"
            disableRipple
            sx={{
              position: 'absolute',
      left: { xs: '50%', sm: 'auto' },
      right: { xs: 'auto', sm: -56, md: -72 },
      top: { xs: 'auto', sm: '50%' },
      bottom: { xs: 10, sm: 'auto' },
      transform: { xs: 'translate(20%, 0)', sm: 'translateY(-50%)' },
              width: { xs: 44, sm: 52 },
              height: { xs: 44, sm: 52 },
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.15)',
              color: '#2c3e50',
              backdropFilter: 'saturate(180%) blur(6px)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 2,
              pointerEvents: 'auto',
              transition: 'opacity .25s ease, transform .2s ease, background-color .2s ease, box-shadow .2s ease',
      opacity: { xs: 1, sm: 0.6 },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)', transform: 'translateY(-50%) scale(1.05)', boxShadow: '0 14px 36px rgba(0,0,0,0.2)' }
            }}
          >
            <ArrowForwardIcon fontSize="medium" sx={{ color: '#00b894' }} />
          </IconButton>
        )}

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate('/questions')} sx={{ color: '#00b894', border: '2px solid rgba(0, 184, 148, 0.2)' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontWeight: 700, color: timeLeft <= 10 ? '#e74c3c' : '#00b894', bgcolor: 'rgba(0,0,0,0.04)', px: 2, py: 1, borderRadius: 2 }}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center', mb: 2 }}>BOŞLUK DOLDURMA — Hızlı Mod</Typography>

        <LinearProgress value={((currentIndex + 1) / questions.length) * 100} variant="determinate" sx={{ height: 12, borderRadius: 6, mb: 2 }} />
        <Typography sx={{ textAlign: 'center', fontWeight: 600, mb: 2 }}>Soru {currentIndex + 1} / {questions.length}</Typography>

        <Box sx={{ p: 3, mb: 3, backgroundColor: 'rgba(0, 184, 148, 0.1)', borderRadius: 3, border: '1px solid rgba(0, 184, 148, 0.2)' }}>
          <Box sx={{ fontSize: '1.2rem', lineHeight: 2.5, textAlign: 'justify' }}>{renderTextWithBlanks()}</Box>
        </Box>

        <Box onDragOver={handleDragOver} onDrop={handleDropToOptions} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(116, 185, 255, 0.1)', borderRadius: 3, border: '1px solid rgba(116, 185, 255, 0.2)' }}>
          <Typography variant="h6" gutterBottom>Seçenekler:</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {availableOptions.map((op, i) => (
              <Box key={i} draggable={!isSubmitted} onDragStart={(e) => handleDragStart(e, op)} onClick={() => handleOptionClick(op)} sx={{ padding: '8px 16px', background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', color: '#fff', borderRadius: 1, cursor: isSubmitted ? 'default' : 'pointer', outline: selectedOption === op ? '3px solid rgba(0, 184, 148, 0.6)' : 'none' }}>
                <Typography fontWeight={600}>{op}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {showResults && (
          <Box sx={{ p: 3, mb: 3, textAlign: 'center', borderRadius: 3, backgroundColor: score === currentQuestion.correctAnswers.length ? '#e6ffe6' : '#fff3cd', border: `2px solid ${score === currentQuestion.correctAnswers.length ? '#43ea7c' : '#ffc107'}` }}>
            <Typography sx={{ fontWeight: 700, color: score === currentQuestion.correctAnswers.length ? '#43ea7c' : '#856404', mb: 1 }}>Sonuç: {score}/{currentQuestion.correctAnswers.length} doğru</Typography>
            <Typography variant="body2">Süre dolmadan önce boşlukları doldurun; dolduğunda otomatik kontrol edilir.</Typography>
          </Box>
        )}

        {!isSubmitted && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 2 }}>
            <button
              style={{ background: '#fff', color: currentIndex === 0 ? '#999' : '#00b894', fontWeight: 700, border: `2px solid ${currentIndex === 0 ? '#ddd' : 'rgba(0, 184, 148, 0.5)'}`, borderRadius: 12, padding: '10px 18px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', minWidth: 110 }}
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
            >
              ← Önceki
            </button>
            {(() => {
              const hasBlank = userAnswers.some(a => a === null);
              const Btn = (
                <button
                  style={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', fontWeight: 800, fontSize: 16, border: 'none', borderRadius: 12, padding: '12px 24px', cursor: hasBlank ? 'not-allowed' : 'pointer', opacity: hasBlank ? 0.7 : 1 }}
                  onClick={() => { if (!hasBlank) handleSubmit(); }}
                  disabled={hasBlank}
                >
                  Kontrol Et
                </button>
              );
              return <Tooltip title={hasBlank ? 'Bütün boşlukları doldurmalısınız' : ''} arrow placement="top" disableHoverListener={!hasBlank}><span style={{ display: 'inline-flex' }}>{Btn}</span></Tooltip>;
            })()}
            <button
              style={{ background: '#fff', color: currentIndex >= questions.length - 1 ? '#999' : '#00b894', fontWeight: 700, border: `2px solid ${currentIndex >= questions.length - 1 ? '#ddd' : 'rgba(0, 184, 148, 0.5)'}`, borderRadius: 12, padding: '10px 18px', cursor: currentIndex >= questions.length - 1 ? 'not-allowed' : 'pointer', minWidth: 110 }}
              onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
              disabled={currentIndex >= questions.length - 1}
            >
              Sonraki →
            </button>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
          {isSubmitted && (
            <>
              {currentIndex < questions.length - 1 ? (
                <button style={{ background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 12, padding: '10px 22px' }} onClick={nextQuestion}>Sonraki</button>
              ) : (
                <button style={{ background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 12, padding: '10px 22px' }} onClick={() => setShowSummary(true)}>Bitir</button>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Summary overlay */}
      {showSummary && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(178,235,242,0.95)', backdropFilter: 'blur(6px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
          <Box sx={{ background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', borderRadius: 4, boxShadow: '0 30px 60px rgba(0,0,0,0.2)', p: 4, width: '100%', maxWidth: 520, textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50', mb: 2 }}>Genel Sonuç</Typography>
            <Box sx={{ p: 2, mb: 2, borderRadius: 3, bgcolor: 'rgba(0, 184, 148, 0.06)', border: '1px solid rgba(0, 184, 148, 0.2)' }}>
              <Typography variant="h6" sx={{ color: '#00695c', fontWeight: 700 }}>Doğru: {summary.correct}/{summary.total}</Typography>
              <Typography variant="h6" sx={{ color: '#c62828', fontWeight: 700, mt: 1 }}>Yanlış: {summary.total - summary.correct}/{summary.total}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <button style={{ background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 12, padding: '12px 28px' }} onClick={() => navigate('/questions')}>Kapat</button>
              <button style={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 12, padding: '12px 28px' }} onClick={restartGame}>Yeniden Başla</button>
            </Box>
          </Box>
        </Box>
      )}
      
    </Box>
  );
};

export default FillInTheBlanksQuick;
