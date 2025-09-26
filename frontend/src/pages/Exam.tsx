import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Question {
  id: string;
  text: string;
  options: string[];
  correct: string;
  explanation: string;
  categoryId: number;
  seriesId: string;
}

const Exam: React.FC = () => {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [time, setTime] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [timerPaused, setTimerPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format text: first letter uppercase, rest lowercase
  const formatText = (text: string) => {
    if (!text || text.length === 0) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Helper function for case insensitive comparison
  const compareAnswers = (answer1: string, answer2: string) => {
    return answer1.toLowerCase() === answer2.toLowerCase();
  };

  useEffect(() => {
    // Fetch if no state or empty state provided
    if (!location.state?.questions || location.state.questions.length === 0) {
      setLoading(true);
      setError(null);
      
      // For dynamic tests, use the questions endpoint directly with filters
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      let apiUrl: string;
      
      if (testId === 'dynamic' || testId?.startsWith('dynamic-')) {
        apiUrl = `${API_URL}/api/questions`;

        // Add category filter based on testId and lock series to Erasmus Sınavı
        // so Üniversite Hazırlık soruları dinamik Erasmus kartlarına karışmasın.
        const params = new URLSearchParams();
        if (testId === 'dynamic-a1') {
          params.set('category', 'A1');
        } else if (testId === 'dynamic-a2' || testId === 'dynamic') {
          params.set('category', 'A2');
        } else if (testId === 'dynamic-b1') {
          params.set('category', 'B1');
        } else if (testId === 'dynamic-b2') {
          params.set('category', 'B2');
        }
        // Restrict to Erasmus series explicitly
        params.set('series', 'Erasmus Sınavı');
        apiUrl += `?${params.toString()}`;
      } else {
        apiUrl = `${API_URL}/api/tests/${testId}/questions`;
      }
      
      console.log(`Fetching questions from: ${apiUrl}`);
      
      const load = async () => {
        try {
          const res = await fetch(apiUrl);
          console.log('API Response status:', res.status);
          if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
          const data = await res.json();
          let questionsData = data.questions || data || [];
          // Fallback: if tests endpoint returned empty, try querying by seriesId directly
          if ((!questionsData || questionsData.length === 0) && testId && !(testId === 'dynamic' || testId.startsWith('dynamic-'))) {
            const API_URL2 = process.env.REACT_APP_API_URL || 'http://localhost:4000';
            const altUrl = `${API_URL2}/api/questions?seriesId=${encodeURIComponent(testId)}`;
            console.log('Primary returned empty, trying fallback:', altUrl);
            const res2 = await fetch(altUrl);
            if (res2.ok) {
              const d2 = await res2.json();
              questionsData = d2.questions || d2 || [];
            }
          }
          console.log('Questions data length:', questionsData.length);

          const formattedQuestions = questionsData.map((q: Question) => {
            // Parse options if they're in string format
            let optionsArray: string[] = [];
            if (Array.isArray(q.options)) {
              optionsArray = q.options.map(formatText);
            } else if (typeof q.options === 'string') {
              try {
                optionsArray = JSON.parse(q.options).map(formatText);
              } catch {
                optionsArray = [];
              }
            }

            // Convert correct answer to letter if it's a word
            let correctLetter = q.correct;
            if (q.correct && q.correct.length > 1) {
              // If correct is a word, find its index in options and convert to letter
              const correctIndex = optionsArray.findIndex(option => 
                option.toLowerCase() === q.correct.toLowerCase()
              );
              if (correctIndex !== -1) {
                correctLetter = String.fromCharCode(65 + correctIndex); // A, B, C, D
                console.log(`Converted "${q.correct}" to letter "${correctLetter}"`);
              }
            }

            return {
              ...q,
              options: optionsArray,
              correct: correctLetter
            };
          });
          console.log(`Loaded ${formattedQuestions.length} questions`);
          setQuestions(formattedQuestions);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch questions:', error);
          setError('Sunucuya ulaşılamıyor. Lütfen sunucuyu başlatıp tekrar deneyin.');
          setLoading(false);
        }
      };
      load();
    } else {
      // Format questions from state as well
      const formattedQuestions = location.state.questions.map((q: Question) => {
        // Parse options if they're in string format
        let optionsArray: string[] = [];
        if (Array.isArray(q.options)) {
          optionsArray = q.options.map(formatText);
        } else if (typeof q.options === 'string') {
          try {
            optionsArray = JSON.parse(q.options).map(formatText);
          } catch {
            optionsArray = [];
          }
        }

        // Convert correct answer to letter if it's a word
        let correctLetter = q.correct;
        if (q.correct && q.correct.length > 1) {
          // If correct is a word, find its index in options and convert to letter
          const correctIndex = optionsArray.findIndex(option => 
            option.toLowerCase() === q.correct.toLowerCase()
          );
          if (correctIndex !== -1) {
            correctLetter = String.fromCharCode(65 + correctIndex); // A, B, C, D
            console.log(`Converted "${q.correct}" to letter "${correctLetter}"`);
          }
        }

        return {
          ...q,
          options: optionsArray,
          correct: correctLetter
        };
      });
      setQuestions(formattedQuestions);
      setLoading(false);
    }
  }, [location.state, testId]);

  // Initialize answers array when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && answers.length !== questions.length) {
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions, answers.length]);

  // Timer logic - pause when answer is selected or exam is finished
  useEffect(() => {
    if (showSummary || timerPaused) return;
    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showSummary, timerPaused]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#b2ebf2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <CircularProgress sx={{ color: '#00b894', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 600 }}>
            Sorular Yükleniyor...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#b2ebf2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#c62828', fontWeight: 600, mb: 2 }}>{error}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>Tekrar Dene</Button>
        </Box>
      </Box>
    );
  }

  if (!questions.length) {
    return <Typography align="center" mt={8}>Bu sınav için soru bulunamadı.</Typography>;
  }

  const q = questions[current];
  // Ensure options is always an array
  let options: string[] = [];
  if (Array.isArray(q.options)) {
    options = q.options;
  } else if (typeof q.options === 'string') {
    try {
      options = JSON.parse(q.options);
    } catch {
      options = [];
    }
  }

  // Helper function to get correct answer text
  const getCorrectAnswerText = () => {
    if (!q.correct || options.length === 0) return q.correct;
    const correctIndex = q.correct.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
    const correctText = options[correctIndex];
    return correctText ? `${q.correct}) ${correctText}` : q.correct;
  };

  const handleSelect = (optionIndex: number) => {
    const selectedLetter = String.fromCharCode(65 + optionIndex); // 0->A, 1->B, 2->C, 3->D
    console.log('Selected option index:', optionIndex);
    console.log('Selected letter:', selectedLetter);
    console.log('Question correct answer:', q.correct);
    console.log('Question correct answer type:', typeof q.correct);
    
    setSelected(selectedLetter);
    setShowResult(true);
    setTimerPaused(true); // Pause timer when answer is selected
    setAnswers((prev) => {
      const copy = [...prev];
      copy[current] = selectedLetter;
      return copy;
    });
    if (compareAnswers(selectedLetter, q.correct)) {
      setScore((s) => s + 1);
    } else {
      setMistakes((m) => m + 1);
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(answers[current + 1] || null);
      setShowResult(!!answers[current + 1]);
      setShowExplanation(false);
      setTimerPaused(false); // Resume timer when moving to next question
    }
  };

  // Sınavı history'ye kaydet (explicit payload to avoid stale state)
  const saveToHistory = async (payload?: { correct: number; incorrect: number; duration: number; answersArray: (string | null)[] }) => {
  const token = localStorage.getItem('token');
  // Kullanıcı giriş yapmadıysa history kaydı denemeyelim; sessizce çık
  if (!token) return;
    try {
      const res = await fetch('http://localhost:4000/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          category: typeof questions[0]?.categoryId === 'string' ? questions[0]?.categoryId : String(questions[0]?.categoryId),
          seriesId: questions[0]?.seriesId || null,
          duration: payload ? payload.duration : time,
          correct: payload ? payload.correct : score,
          incorrect: payload ? payload.incorrect : mistakes,
          questions: questions.map((q, idx) => ({
            questionId: q.id,
            userAnswer: (payload ? payload.answersArray[idx] : answers[idx]),
            isCorrect: (() => {
              const ua = payload ? payload.answersArray[idx] : answers[idx];
              return ua ? compareAnswers(ua!, q.correct) : false;
            })()
          }))
        })
      });
      if (!res.ok) {
        try {
          const data = await res.json();
          // eslint-disable-next-line no-console
          console.error('History save error:', data);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('History save error (no json):', res.status, res.statusText);
        }
        // Do not alert here; interceptor will handle auth expiry. Avoid noisy UI.
      }
    } catch (e) {
      // eslint-disable-next-line no-console
  console.error('History save network error:', e);
  // silence network errors for history save to avoid user confusion
    }
  };

  const handleFinish = async () => {
    // Ensure answers array is properly sized
    const finalizedAnswers = Array.from({ length: questions.length }, (_, i) => (answers[i] !== undefined ? answers[i] : null));
    if (answers.length === 0 || answers.length !== questions.length) {
      setAnswers(finalizedAnswers);
    }
    
    // Calculate final scores
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    
    questions.forEach((question, idx) => {
      const userAnswer = finalizedAnswers[idx];
      if (userAnswer === null || userAnswer === undefined || userAnswer === '') {
        unansweredCount++;
      } else if (compareAnswers(userAnswer, question.correct)) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });
    
    // Update state with calculated scores
    setScore(correctCount);
    setMistakes(incorrectCount);
    
    setShowSummary(true);
    setReviewMode(false);
    setTimerPaused(true); // Permanently pause timer when exam is finished
    if (timerRef.current) clearInterval(timerRef.current);
    
    await saveToHistory({
      correct: correctCount,
      incorrect: incorrectCount,
      duration: time,
      answersArray: finalizedAnswers,
    });
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setReviewMode(false);
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setShowExplanation(false);
    setScore(0);
    setMistakes(0);
    setTime(0);
    setAnswers([]);
  };

  const handleAddRanking = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page if not logged in
      navigate('/login');
      return;
    }

    // Determine current level from route
    let examLevel: 'A1' | 'A2' | 'B1' | 'B2' | undefined;
    if (testId === 'dynamic-a1') examLevel = 'A1';
    else if (testId === 'dynamic-a2' || testId === 'dynamic') examLevel = 'A2';
    else if (testId === 'dynamic-b1') examLevel = 'B1';
    else if (testId === 'dynamic-b2') examLevel = 'B2';

    // Send all relevant exam result data to backend
    const categoryId = q.categoryId;
    const seriesId = q.seriesId;
    fetch('http://localhost:4000/api/rankings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ score, time, categoryId, seriesId, correct: score, mistakes }),
    })
      .then(async res => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          data = {};
        }
        if (!res.ok) {
          console.error('Ranking save error:', data);
          let errorMessage = 'Sıralamaya eklenemedi: ' + (data?.message || res.statusText);

          // Auth-related errors
          if (data?.message === 'Authorization header missing' || res.status === 401) {
            errorMessage = 'Sıralamaya eklemek için giriş yapmalısınız.';
          }
          // Backend may block creating ranking-only rows to prevent "Detay Yok" duplicates
          if (typeof data?.error === 'string' && data.error.includes('Detailed test record not found')) {
            errorMessage = 'Önce sınavı başarıyla bitirip kaydettiğinizden emin olun, sonra sıralamaya ekleyin.';
          }

          alert(errorMessage);
          return;
        }
        setShowSummary(false);
        // Navigate to rankings filtered by the user's level
        navigate(examLevel ? `/rankings?exam=${examLevel}` : '/rankings');
      })
      .catch(err => {
        console.error('Ranking save error:', err);
        alert('Failed to save ranking. Network error.');
      });
  };

  const prevQuestion = () => {
    if (current > 0) {
      setCurrent(c => c - 1);
      setSelected(answers[current - 1] || null);
      setShowResult(!!answers[current - 1]);
      setShowExplanation(false);
      // If the previous question was already answered, keep timer paused
      setTimerPaused(!!answers[current - 1]);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#b2ebf2', 
      display: 'flex', 
      alignItems: { xs: 'center', md: 'flex-start' },
      justifyContent: 'center', 
      position: 'relative',
      pt: { xs: 2, md: 4, lg: 6 },
      pb: { xs: 12, md: 16 }
    }}>
      {/* Fixed timer for tablet/desktop (sticky at top-right) */}
    <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'fixed',
      top: { md: 84, lg: 96 },
          right: { md: 20, lg: 28 },
          zIndex: 1200,
          background: timerPaused
            ? 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)'
            : 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          px: { md: 2, lg: 2.5 },
          py: { md: 0.75, lg: 1 },
          borderRadius: 3,
          fontWeight: 800,
          fontSize: { md: 16, lg: 18 },
          boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
          alignItems: 'center',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
          gap: 1
        }}
        aria-label="exam-timer-desktop"
      >
        {timerPaused && <span>⏸️</span>}
        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
      </Box>
  {/* Timer now lives inside the main Paper (card) */}
      {/* Navigation buttons outside the card */}
      <IconButton
        sx={{
          display: { xs: 'none', md: 'inline-flex' },
          position: 'absolute',
          left: { xs: 8, md: 32 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          background: current > 0 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)'
            : 'rgba(255,255,255,0.4)',
          color: current > 0 ? '#00b894' : '#bdc3c7',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: current > 0 ? '0 8px 25px rgba(0, 184, 148, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
          borderRadius: 3,
          p: 2,
          cursor: current > 0 ? 'pointer' : 'default',
          opacity: current > 0 ? 1 : 0.5,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: current > 0 ? 'translateY(-50%) translateX(-3px)' : 'translateY(-50%)',
            background: current > 0 
              ? 'linear-gradient(135deg, rgba(0, 184, 148, 0.1) 0%, rgba(0, 206, 201, 0.1) 100%)'
              : 'rgba(255,255,255,0.4)',
            boxShadow: current > 0 ? '0 12px 30px rgba(0, 184, 148, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
          },
        }}
        onClick={prevQuestion}
        disabled={current === 0}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>
      <IconButton
        sx={{
          display: { xs: 'none', md: 'inline-flex' },
          position: 'absolute',
          right: { xs: 8, md: 32 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          background: current < questions.length - 1 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)'
            : 'rgba(255,255,255,0.4)',
          color: current < questions.length - 1 ? '#00b894' : '#bdc3c7',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: current < questions.length - 1 ? '0 8px 25px rgba(0, 184, 148, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
          borderRadius: 3,
          p: 2,
          cursor: current < questions.length - 1 ? 'pointer' : 'default',
          opacity: current < questions.length - 1 ? 1 : 0.5,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: current < questions.length - 1 ? 'translateY(-50%) translateX(3px)' : 'translateY(-50%)',
            background: current < questions.length - 1 
              ? 'linear-gradient(135deg, rgba(0, 184, 148, 0.1) 0%, rgba(0, 206, 201, 0.1) 100%)'
              : 'rgba(255,255,255,0.4)',
            boxShadow: current < questions.length - 1 ? '0 12px 30px rgba(0, 184, 148, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
          },
        }}
        onClick={nextQuestion}
        disabled={current === questions.length - 1}
      >
        <ArrowForwardIcon fontSize="large" />
      </IconButton>
      {!reviewMode && (
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 5 },
            position: 'relative',
            borderRadius: 4, 
            width: '100%', 
            maxWidth: { xs: 360, sm: 560, md: 600 },
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}
        >
      {/* Inset timer at top-right inside the card (mobile only) */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: { xs: 18, md: 10 },
              zIndex: 2,
        display: { xs: 'flex', md: 'none' },
              background: timerPaused 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)' 
                : 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
              color: '#fff',
              px: { xs: 1.25, md: 3 },
              py: { xs: 0.5, md: 1 },
              borderRadius: { xs: 2, md: 3 },
              fontWeight: 700,
              fontSize: { xs: 13, md: 18 },
              boxShadow: '0 6px 16px rgba(0, 184, 148, 0.4)',
              alignItems: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              gap: { xs: 0.5, md: 1 },
              transition: 'background-color 0.3s ease',
            }}
          >
            {timerPaused && <span>⏸️</span>}
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              align="center"
              sx={{
                background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Soru {current + 1} / {questions.length}
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            mb={3}
            sx={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              lineHeight: 1.6,
              textAlign: 'center',
              p: { xs: 1.25, sm: 1.5, md: 2 },
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 184, 148, 0.2)',
            }}
          >
            {q.text}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {options.length > 0 ? (
              options.map((opt, idx) => {
                const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = selected === optionLetter;
                const isCorrect = compareAnswers(optionLetter, q.correct);
                const showColor = !!selected;
                return (
          <Button
                    key={idx}
                    variant={isSelected ? 'contained' : 'outlined'}
                    color={showColor ? (isCorrect ? 'primary' : isSelected ? 'error' : 'primary') : 'primary'}
                    sx={{
                      textAlign: 'left',
                      fontWeight: 600,
            fontSize: { xs: 15, sm: 16, md: 18 },
                      textTransform: 'none',
                      borderRadius: 4,
            py: { xs: 1.25, sm: 1.5, md: 2 },
            px: { xs: 1.5, sm: 2 },
                      background: !showColor 
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
                        : isSelected
                          ? (isCorrect
                              ? 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
                              : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)')
                          : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                      color: showColor && isSelected ? '#ffffff' : '#2c3e50',
                      border: showColor && isSelected
                        ? 'none'
                        : '2px solid rgba(0, 184, 148, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: isSelected 
                        ? '0 8px 25px rgba(0, 184, 148, 0.3)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: !selected ? 'translateY(-2px)' : 'none',
                        background: !showColor 
                          ? 'linear-gradient(135deg, rgba(0, 184, 148, 0.1) 0%, rgba(0, 206, 201, 0.1) 100%)' 
                          : undefined,
                        boxShadow: !selected 
                          ? '0 8px 25px rgba(0, 184, 148, 0.2)' 
                          : undefined,
                      },
                    }}
                    onClick={() => !showResult && handleSelect(idx)}
                    disabled={!!selected}
                  >
                    <span style={{ position: 'relative', zIndex: 2 }}>{String.fromCharCode(65 + idx)}) {formatText(opt)}</span>
                    {showColor && isSelected && (
                      <span style={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#ffffff',
                        background: isCorrect 
                          ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' 
                          : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                        borderRadius: 12,
                        padding: '4px 12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        zIndex: 3,
                      }}>
                        {isCorrect ? '✓ Doğru' : '✗ Yanlış'}
                      </span>
                    )}
                  </Button>
                );
              })
            ) : (
              <Typography color="error" fontWeight={600} mb={2}>Bu sorunun seçenekleri eksik veya hatalı.</Typography>
            )}
          </Box>
          {showResult && (
            <Box sx={{ mb: 2 }}>
              <Typography color="success.main" fontWeight={700} mb={1}>
                {compareAnswers(selected || '', q.correct) ? 'Doğru!' : `Doğru Yanıt: ${getCorrectAnswerText()}`}
              </Typography>
              <Button variant="text" onClick={() => setShowExplanation(e => !e)}>
                {showExplanation ? 'Çözümü Gizle' : 'Çözümü Göster'}
              </Button>
              {showExplanation && (
                <Typography mt={2} color="text.secondary">{q.explanation}</Typography>
              )}
            </Box>
          )}
          {/* Bottom controls: mobile shows Önceki/Bitir/Sonraki, desktop shows only Bitir */}
          {!showSummary && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'space-between', md: 'center' }, gap: 1.5, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={prevQuestion}
                disabled={current === 0}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderWidth: 2,
                  borderColor: '#00b894',
                  color: '#00b894',
                  '&:hover': { borderColor: '#00cec9', background: 'rgba(0,206,201,0.08)' },
                  display: { xs: 'inline-flex', md: 'none' },
                }}
              >
                Önceki
              </Button>
              <Button
                variant="contained"
                onClick={handleFinish}
                sx={{
                  textTransform: 'none',
                  fontWeight: 800,
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  boxShadow: 2,
                  background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                  color: '#fff',
                  '&:hover': { background: 'linear-gradient(135deg, #00a085 0%, #00b8b3 100%)' }
                }}
              >
                Testi Bitir
              </Button>
              <Button
                variant="outlined"
                onClick={nextQuestion}
                disabled={current === questions.length - 1}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderWidth: 2,
                  borderColor: '#00b894',
                  color: '#00b894',
                  '&:hover': { borderColor: '#00cec9', background: 'rgba(0,206,201,0.08)' },
                  display: { xs: 'inline-flex', md: 'none' },
                }}
              >
                Sonraki
              </Button>
            </Box>
          )}
        </Paper>
      )}
      {/* Result popup bubble with question review */}
      {showSummary && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(10,29,86,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: 6, boxShadow: 8, p: 4, minWidth: 320, maxWidth: '90vw', textAlign: 'center', position: 'relative' }}>
            <Typography variant="h5" fontWeight={700} color="#19376D" mb={2}>Sınav Sonucu</Typography>
            <Typography fontSize={20} fontWeight={600} color="#43ea7c" mb={1}>Doğru: {score}</Typography>
            <Typography fontSize={20} fontWeight={600} color="#e74c3c" mb={1}>Yanlış: {mistakes}</Typography>
            <Typography fontSize={20} fontWeight={600} color="#f39c12" mb={1}>Boş: {answers.filter(answer => answer === null || answer === undefined || answer === '').length}</Typography>
            <Typography fontSize={18} fontWeight={500} color="#19376D" mb={2}>Süre: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</Typography>
            {/* Question review list */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
              {questions.map((question, idx) => {
                const userAnswer = answers[idx];
                const isUnanswered = userAnswer === null || userAnswer === undefined || userAnswer === '';
                const isCorrect = !isUnanswered && compareAnswers(userAnswer, question.correct);
                
                // Determine colors based on answer status
                let borderColor, textColor, backgroundColor, hoverColor;
                if (isUnanswered) {
                  // Boş bırakılan sorular - turuncu
                  borderColor = '#f39c12';
                  textColor = '#f39c12';
                  backgroundColor = '#fdf6e3';
                  hoverColor = '#f8e49a';
                } else if (isCorrect) {
                  // Doğru cevaplar - yeşil
                  borderColor = '#43ea7c';
                  textColor = '#43ea7c';
                  backgroundColor = '#eafaf3';
                  hoverColor = '#c6f7e2';
                } else {
                  // Yanlış cevaplar - kırmızı
                  borderColor = '#e74c3c';
                  textColor = '#e74c3c';
                  backgroundColor = '#fff0f0';
                  hoverColor = '#ffe3e3';
                }
                
                return (
                  <Button
                    key={idx}
                    variant="outlined"
                    sx={{
                      minWidth: 48,
                      height: 48,
                      fontWeight: 700,
                      fontSize: 18,
                      borderRadius: 3,
                      border: 'none',
                      color: '#ffffff',
                      background: !answers[idx] 
                        ? 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
                        : isCorrect
                          ? 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
                          : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                      mx: 0.5,
                      my: 0.5,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                    onClick={() => {
                      setReviewMode(true);
                      setShowSummary(false);
                      setCurrent(idx);
                      setSelected(answers[idx] || null);
                      setShowResult(!!answers[idx]);
                      setShowExplanation(false);
                    }}
                  >
                    {idx + 1}
                  </Button>
                );
              })}
            </Box>
            <Typography fontSize={15} color="#19376D" mb={2}>
              Soruları incelemek için tıklayın. Yeşil: Doğru, Kırmızı: Yanlış, Turuncu: Boş
            </Typography>
            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="success"
                sx={{ fontWeight: 700, fontSize: 16, borderRadius: 3, px: 4, py: 1.2, boxShadow: 2, textTransform: 'none' }}
                onClick={handleAddRanking}
              >
                Sıralamaya Ekle
              </Button>
              <Button
                variant="outlined"
                color="primary"
                sx={{ fontWeight: 700, fontSize: 16, borderRadius: 3, px: 4, py: 1.2, boxShadow: 2, textTransform: 'none' }}
                onClick={() => {
                  navigate('/categories');
                }}
              >
                Kapat
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontWeight: 700, fontSize: 16, borderRadius: 3, px: 4, py: 1.2, boxShadow: 2, textTransform: 'none' }}
                onClick={() => {
                  handleCloseSummary();
                }}
              >
                Tekrar Çöz
              </Button>
            </Box>
            {/* Login warning text */}
            {!localStorage.getItem('token') && (
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  textAlign: 'center', 
                  mt: 1, 
                  fontSize: '0.75rem',
                  color: '#666',
                  fontStyle: 'italic'
                }}
              >
                Sıralamaya eklemek için üye girişi gerekli veya kayıt olmalısınız
              </Typography>
            )}
          </Box>
        </Box>
      )}
      {reviewMode && (
        <Paper 
          elevation={6} 
          sx={{ 
            p: 5, 
            borderRadius: 4, 
            minWidth: 340, 
            maxWidth: 600, 
            width: '100%', 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              align="center"
              sx={{
                background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Soru {current + 1} / {questions.length} (İnceleme)
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            mb={3}
            sx={{
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '1.2rem',
              lineHeight: 1.6,
              textAlign: 'center',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 184, 148, 0.2)',
            }}
          >
            {q.text}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {options.length > 0 ? (
              options.map((opt, idx) => {
                const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = answers[current] === optionLetter;
                const isCorrect = compareAnswers(optionLetter, q.correct);
                const showColor = !!answers[current];
                return (
                  <Button
                    key={idx}
                    variant={isSelected ? 'contained' : 'outlined'}
                    color={showColor ? (isCorrect ? 'primary' : isSelected ? 'error' : 'primary') : 'primary'}
                    sx={{
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: 18,
                      borderRadius: 4,
                      py: 2,
                      px: 2,
                      background: !showColor 
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
                        : isSelected
                          ? (isCorrect
                              ? 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
                              : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)')
                          : (isCorrect
                              ? 'linear-gradient(135deg, rgba(0, 184, 148, 0.1) 0%, rgba(0, 206, 201, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'),
                      color: showColor && isSelected ? '#ffffff' : isCorrect && showColor ? '#00b894' : '#2c3e50',
                      border: isCorrect && showColor && !isSelected
                        ? '2px solid #00b894'
                        : showColor && isSelected
                          ? 'none'
                          : '2px solid rgba(0, 184, 148, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: isSelected 
                        ? '0 8px 25px rgba(0, 184, 148, 0.3)' 
                        : isCorrect && showColor
                          ? '0 4px 15px rgba(0, 184, 148, 0.2)'
                          : '0 4px 15px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      pointerEvents: 'none',
                    }}
                    disabled
                  >
                    <span style={{ position: 'relative', zIndex: 2 }}>{String.fromCharCode(65 + idx)}) {opt}</span>
                    {showColor && isSelected && (
                      <span style={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontWeight: 700,
                        fontSize: 18,
                        color: isCorrect ? '#43ea7c' : '#e74c3c',
                        background: isCorrect ? '#eafaf3' : '#fff0f0',
                        borderRadius: 8,
                        padding: '2px 12px',
                        boxShadow: '0 2px 8px rgba(67,234,124,0.08)',
                        zIndex: 3,
                      }}>
                        {isCorrect ? 'Doğru' : 'Yanlış'}
                      </span>
                    )}
                  </Button>
                );
              })
            ) : (
              <Typography color="error" fontWeight={600} mb={2}>Bu sorunun seçenekleri eksik veya hatalı.</Typography>
            )}
          </Box>
          {/* Show explanation toggle and content in review mode */}
          {!!q.explanation && (
            <Box sx={{ mb: 2 }}>
              <Button variant="text" onClick={() => setShowExplanation(e => !e)}>
                {showExplanation ? 'Çözümü Gizle' : 'Çözümü Göster'}
              </Button>
              {showExplanation && (
                <Typography mt={2} color="text.secondary">{q.explanation}</Typography>
              )}
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 700, fontSize: 16, borderRadius: 3, px: 4, py: 1.2, boxShadow: 2, textTransform: 'none' }}
              onClick={() => {
                setReviewMode(false);
                setShowSummary(true);
                setShowExplanation(false);
              }}
            >
              Sonuçlara Dön
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Exam;
