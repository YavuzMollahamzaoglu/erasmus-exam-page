import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert, IconButton, LinearProgress, CircularProgress, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface FillInTheBlanksQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswers: string[];
  explanation: string;
}

type QuestionState = {
  userAnswers: (string | null)[];
  availableOptions: string[];
  isSubmitted: boolean;
  showResults: boolean;
  score: number;
};

const FillInTheBlanksGame: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<FillInTheBlanksQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  // Cumulative summary across submitted questions
  const [summary, setSummary] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [showSummary, setShowSummary] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // touch/tap support
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  // Persist each question's state while navigating
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
  // Backend'den soruları çek
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/games/fill-in-the-blanks/questions');
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
          // Initialize state store for questions
          const initialMap: Record<string, QuestionState> = {};
          data.forEach((q: FillInTheBlanksQuestion) => {
            initialMap[q.id] = {
              userAnswers: Array(q.correctAnswers.length).fill(null),
              availableOptions: [...q.options],
              isSubmitted: false,
              showResults: false,
              score: 0,
            };
          });
          setQuestionStates(initialMap);
          setSummary({ correct: 0, total: 0 });
          setError(null);
        } else {
          throw new Error('Failed to fetch questions');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Sorular yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        // Fallback to sample data
        const sampleQuestions: FillInTheBlanksQuestion[] = [
          {
            id: 'fill-1',
            text: 'I __________ from Turkey. My name __________ John. She __________ a student. We __________ happy today. They __________ at home.',
            options: ['am', 'is', 'are', 'was', 'were'],
            correctAnswers: ['am', 'is', 'is', 'are', 'are'],
            explanation: 'Bu soruda "to be" fiilinin doğru kullanımları test ediliyor.'
          }
        ];
  setQuestions(sampleQuestions);
        // Initialize state for fallback sample
        const initialMap: Record<string, QuestionState> = {};
        sampleQuestions.forEach((q) => {
          initialMap[q.id] = {
            userAnswers: Array(q.correctAnswers.length).fill(null),
            availableOptions: [...q.options],
            isSubmitted: false,
            showResults: false,
            score: 0,
          };
        });
        setQuestionStates(initialMap);
  setSummary({ correct: 0, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Load current question state from store or initialize if missing
  const resetCurrentQuestion = (question: FillInTheBlanksQuestion) => {
    const existing = questionStates[question.id];
    if (existing) {
      setUserAnswers(existing.userAnswers);
      setAvailableOptions(existing.availableOptions);
      setIsSubmitted(existing.isSubmitted);
      setShowResults(existing.showResults);
      setScore(existing.score);
  setSelectedOption(null);
    } else {
      const init: QuestionState = {
        userAnswers: Array(question.correctAnswers.length).fill(null),
        availableOptions: [...question.options],
        isSubmitted: false,
        showResults: false,
        score: 0,
      };
      setQuestionStates((prev) => ({ ...prev, [question.id]: init }));
      setUserAnswers(init.userAnswers);
      setAvailableOptions(init.availableOptions);
      setIsSubmitted(false);
      setShowResults(false);
      setScore(0);
  setSelectedOption(null);
    }
  };

  // Timer effect
  useEffect(() => {
    if (showResults) return;
    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [showResults]);

  const currentQuestion = questions[currentIndex];

  // When currentIndex or questions change, load that question's saved state
  useEffect(() => {
    if (!currentQuestion) return;
    resetCurrentQuestion(currentQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions.length]);

  const handleDragStart = (e: React.DragEvent, option: string) => {
    setDraggedItem(option);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, blankIndex: number) => {
    e.preventDefault();
    if (draggedItem && !isSubmitted) {
      // Eğer bu boşlukta zaten bir cevap varsa, onu geri options'a ekle
      if (userAnswers[blankIndex]) {
        setAvailableOptions(prev => [...prev, userAnswers[blankIndex] as string]);
      }

      // Yeni cevabı ekle
      const newAnswers = [...userAnswers];
      newAnswers[blankIndex] = draggedItem;
      setUserAnswers(newAnswers);

      // Kullanılan seçeneği available options'dan çıkar
      setAvailableOptions(prev => prev.filter(option => option !== draggedItem));
      setDraggedItem(null);
    }
  };

  // Drag word from a filled blank back to the options area
  const handleDragStartFromBlank = (e: React.DragEvent, word: string, blankIndex: number) => {
    if (!word || isSubmitted) return;
    setDraggedItem(word);
    e.dataTransfer.effectAllowed = 'move';
    // Visual feedback for the dragged element
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.5';
    }, 0);
    // Remove the word from the blank immediately and return it to the options
    const newAnswers = [...userAnswers];
    newAnswers[blankIndex] = null;
    setUserAnswers(newAnswers);
    setAvailableOptions(prev => [...prev, word]);
  };

  const handleDropToOptions = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && !isSubmitted) {
      setAvailableOptions(prev => prev.includes(draggedItem) ? prev : [...prev, draggedItem]);
      setDraggedItem(null);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  const handleRemoveAnswer = (blankIndex: number) => {
    if (userAnswers[blankIndex] && !isSubmitted) {
      setAvailableOptions(prev => [...prev, userAnswers[blankIndex] as string]);
      const newAnswers = [...userAnswers];
      newAnswers[blankIndex] = null;
      setUserAnswers(newAnswers);
    }
  };

  // Touch-friendly handlers
  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    // Only options listed in availableOptions are tappable to select
    if (!availableOptions.includes(option)) return;
    setSelectedOption((prev) => (prev === option ? null : option));
  };

  const handleBlankClick = (blankIndex: number) => {
    if (isSubmitted) return;
    const current = userAnswers[blankIndex];
    if (selectedOption && !current) {
      // Place selected option into this blank
      const newAnswers = [...userAnswers];
      newAnswers[blankIndex] = selectedOption;
      setUserAnswers(newAnswers);
      setAvailableOptions(prev => prev.filter(o => o !== selectedOption));
      setSelectedOption(null);
      return;
    }
    // If there is already an answer, allow remove by tap
    if (current) {
      handleRemoveAnswer(blankIndex);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    currentQuestion.correctAnswers.forEach((correct, index) => {
      if (userAnswers[index] === correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
    // persist state for this question
    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        userAnswers: [...userAnswers],
        availableOptions: [...availableOptions],
        isSubmitted: true,
        showResults: true,
        score: correctCount,
      },
    }));
    // Update cumulative summary
    setSummary(prev => ({
      correct: prev.correct + correctCount,
      total: prev.total + currentQuestion.correctAnswers.length
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const restartGame = () => {
    if (questions.length === 0) return;
    // Rebuild initial states for all questions
    const initialMap: Record<string, QuestionState> = {};
    questions.forEach((q) => {
      initialMap[q.id] = {
        userAnswers: Array(q.correctAnswers.length).fill(null),
        availableOptions: [...q.options],
        isSubmitted: false,
        showResults: false,
        score: 0,
      };
    });
    setQuestionStates(initialMap);
    setCurrentIndex(0);
    setSummary({ correct: 0, total: 0 });
    setShowSummary(false);
    setTime(0);
    // Load first question fresh
    if (questions[0]) resetCurrentQuestion(questions[0]);
  };

  // Sync current local state back into the questionStates store on any change
  useEffect(() => {
    if (!currentQuestion) return;
    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        userAnswers: [...userAnswers],
        availableOptions: [...availableOptions],
        isSubmitted,
        showResults,
        score,
      },
    }));
  }, [userAnswers, availableOptions, isSubmitted, showResults, score, currentQuestion?.id]);

  const renderTextWithBlanks = () => {
    if (!currentQuestion) return null;

    const parts = currentQuestion.text.split('__________');
    const result: (string | React.ReactNode)[] = [];

    parts.forEach((part, index) => {
      // Her text parçasını span ile sararak ekle
      if (part.trim()) {
        result.push(
          <span key={`text-${index}`} style={{ display: 'inline' }}>
            {part}
          </span>
        );
      }
      
      // Son parça değilse boşluk ekle
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
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, blankIndex)}
            onClick={() => handleBlankClick(blankIndex)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '120px',
              height: '40px',
              border: '2px solid',
              borderRadius: '8px',
              margin: '0 4px',
              padding: '4px 8px',
              textAlign: 'center',
              verticalAlign: 'baseline',
              cursor: !isSubmitted ? 'pointer' : 'default',
              backgroundColor: isSubmitted 
                ? (isCorrect ? '#e6ffe6' : isIncorrect ? '#ffe6e6' : 'rgba(0, 184, 148, 0.1)')
                : userAnswer ? 'rgba(0, 184, 148, 0.2)' : 'rgba(0, 184, 148, 0.1)',
              borderColor: isSubmitted 
                ? (isCorrect ? '#43ea7c' : isIncorrect ? '#e74c3c' : 'rgba(0, 184, 148, 0.3)')
                : userAnswer ? '#00b894' : 'rgba(0, 184, 148, 0.3)',
              transition: 'all 0.3s ease',
              boxShadow: isSubmitted 
                ? (isCorrect ? '0 0 8px #43ea7c88' : isIncorrect ? '0 0 8px #e74c3c88' : '0 2px 4px rgba(0, 184, 148, 0.2)')
                : '0 2px 4px rgba(0, 184, 148, 0.2)',
              '&:hover': {
                backgroundColor: !isSubmitted && userAnswer ? 'rgba(0, 184, 148, 0.3)' : undefined,
                transform: !isSubmitted && userAnswer ? 'translateY(-1px)' : undefined,
              }
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: userAnswer ? 600 : 400,
                color: isSubmitted 
                  ? (isCorrect ? '#43ea7c' : isIncorrect ? '#e74c3c' : '#2c3e50')
                  : userAnswer ? '#00b894' : '#666',
                fontSize: '1rem'
              }}
            >
              {userAnswer || (index + 1)}
            </Typography>
          </Box>
        );
      }
    });

    return (
      <Box sx={{ 
        display: 'inline', 
        lineHeight: 2.5,
        fontSize: '1.2rem'
      }}>
        {result}
      </Box>
    );
  };

  if (!currentQuestion) {
    if (loading) {
      return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#b2ebf2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
          <CircularProgress size={60} sx={{ color: "#00b894", mb: 2 }} />
          <Typography variant="h6" color="#00b894">Sorular yükleniyor...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#b2ebf2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
          <Box sx={{ p: 4, maxWidth: 600, width: "100%", textAlign: "center", borderRadius: 4, background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
            <Typography variant="h6" color="error" mb={2}>{error}</Typography>
            <Typography 
              onClick={() => navigate('/questions')}
              sx={{ 
                background: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)", 
                color: "#fff",
                py: 1.5,
                px: 3,
                borderRadius: 3,
                cursor: "pointer",
                display: "inline-block",
                fontWeight: 600,
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 16px rgba(0, 184, 148, 0.4)" },
                transition: "all 0.3s ease"
              }}
            >
              Geri Dön
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#b2ebf2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Box sx={{ p: 4, maxWidth: 600, width: "100%", textAlign: "center", borderRadius: 4, background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
          <Typography variant="h6" color="#2c3e50" mb={2}>Henüz soru bulunmuyor</Typography>
          <Typography 
            onClick={() => navigate('/questions')}
            sx={{ 
              background: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)", 
              color: "#fff",
              py: 1.5,
              px: 3,
              borderRadius: 3,
              cursor: "pointer",
              display: "inline-block",
              fontWeight: 600,
              "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 16px rgba(0, 184, 148, 0.4)" },
              transition: "all 0.3s ease"
            }}
          >
            Geri Dön
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#b2ebf2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontFamily: 'Inter, Roboto, Open Sans, Arial, sans-serif',
      px: 2,
      pt: 0,
      pb: { xs: 12, md: 16 }
    }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: 800, 
        background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)", 
        borderRadius: 4, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)", 
        p: 4, 
        mb: 2, 
        color: "#2c3e50", 
        position: "relative", 
        mx: 'auto', 
  overflow: 'visible', 
        border: "1px solid rgba(255,255,255,0.2)",
  mt: { xs: 1, md: '15px' },
        // Show nav arrows on hover for desktop
        '&:hover .navArrow': { opacity: 1 }
      }}>
        {/* Overlay navigation arrows */}
        {currentIndex > 0 && (
          <IconButton
            aria-label="Önceki soru"
            onClick={prevQuestion}
            className="navArrow"
            disableRipple
            sx={{
              position: 'absolute',
              // On very small phones: bring arrows to bottom center
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
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: { xs: 'translate(-120%, 0) scale(1.05)', sm: 'translateY(-50%) scale(1.05)' },
                boxShadow: '0 14px 36px rgba(0,0,0,0.2)'
              }
            }}
          >
            <ArrowBackIcon fontSize="medium" sx={{ color: '#00b894' }} />
          </IconButton>
        )}
        {currentIndex < questions.length - 1 && (
          <IconButton
            aria-label="Sonraki soru"
            onClick={nextQuestion}
            className="navArrow"
            disableRipple
            sx={{
              position: 'absolute',
              // On very small phones: bring arrows to bottom center
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
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: { xs: 'translate(20%, 0) scale(1.05)', sm: 'translateY(-50%) scale(1.05)' },
                boxShadow: '0 14px 36px rgba(0,0,0,0.2)'
              }
            }}
          >
            <ArrowForwardIcon fontSize="medium" sx={{ color: '#00b894' }} />
          </IconButton>
        )}
        {/* Header with back button and timer */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton sx={{ 
            color: "#00b894", 
            bgcolor: 'rgba(0, 184, 148, 0.1)', 
            border: "2px solid rgba(0, 184, 148, 0.2)",
            '&:hover': { 
              bgcolor: 'rgba(0, 184, 148, 0.2)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.3s ease'
          }} onClick={() => navigate('/questions')}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ 
            fontWeight: 600, 
            fontSize: 16, 
            color: '#00b894', 
            bgcolor: 'rgba(0, 184, 148, 0.1)', 
            px: 2, 
            py: 1,
            borderRadius: 3,
            border: "1px solid rgba(0, 184, 148, 0.2)"
          }}>
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>

        {/* Title above progress bar */}
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          textAlign: "center", 
          color: "#2c3e50",
          fontSize: { xs: 20, sm: 24 },
          mb: 2,
          textShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          BOŞLUK DOLDURMA OYUNU
        </Typography>

        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={((currentIndex + 1) / questions.length) * 100}
          sx={{
            height: 12,
            borderRadius: 6,
            mb: 2,
            mt: 1,
            bgcolor: "rgba(0, 184, 148, 0.1)",
            border: "1px solid rgba(0, 184, 148, 0.2)",
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)',
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0, 184, 148, 0.3)',
              transition: 'all 0.3s ease',
            },
          }}
        />

        {/* Question Counter */}
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          textAlign: "center", 
          color: "#2c3e50",
          fontSize: { xs: 16, sm: 18 },
          mb: 3,
          p: 2,
          bgcolor: 'rgba(0, 184, 148, 0.1)',
          borderRadius: 3,
          border: "1px solid rgba(0, 184, 148, 0.2)"
        }}>
          Soru {currentIndex + 1} / {questions.length}
        </Typography>

        {/* Text with blanks */}
        <Box sx={{ p: 3, mb: 3, backgroundColor: 'rgba(0, 184, 148, 0.1)', borderRadius: 3, border: "1px solid rgba(0, 184, 148, 0.2)" }}>
          <Box sx={{ 
            fontSize: '1.2rem', 
            lineHeight: 2.5, 
            textAlign: 'justify',
            wordSpacing: '0.1em',
            letterSpacing: '0.02em'
          }}>
            {renderTextWithBlanks()}
          </Box>
        </Box>

        {/* Available Options */}
        <Box 
          sx={{ p: 3, mb: 3, backgroundColor: 'rgba(116, 185, 255, 0.1)', borderRadius: 3, border: "1px solid rgba(116, 185, 255, 0.2)" }}
          onDragOver={handleDragOver}
          onDrop={handleDropToOptions}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "#2c3e50", fontWeight: 600 }}>
            Seçenekler:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {availableOptions.map((option, index) => (
              <Box
                key={`option-${index}`}
                draggable={!isSubmitted}
                onDragStart={(e) => handleDragStart(e, option)}
                onClick={() => handleOptionClick(option)}
                sx={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                  color: '#fff',
                  borderRadius: 1,
                  cursor: isSubmitted ? 'default' : 'pointer',
                  userSelect: 'none',
                  opacity: isSubmitted ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(116, 185, 255, 0.3)',
                  outline: selectedOption === option ? '3px solid rgba(0, 184, 148, 0.6)' : 'none',
                  '&:hover': {
                    transform: !isSubmitted ? 'translateY(-2px)' : undefined,
                    boxShadow: !isSubmitted ? '0 6px 16px rgba(116, 185, 255, 0.4)' : undefined,
                  },
                  '&:active': {
                    cursor: !isSubmitted ? 'grabbing' : 'default',
                  }
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  {option}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {showResults && (
          <Box sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: score === currentQuestion.correctAnswers.length ? '#e6ffe6' : '#fff3cd',
            border: `2px solid ${score === currentQuestion.correctAnswers.length ? '#43ea7c' : '#ffc107'}`,
            borderRadius: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ 
              color: score === currentQuestion.correctAnswers.length ? '#43ea7c' : '#856404',
              fontWeight: 600,
              mb: 2
            }}>
              Sonuç: {score}/{currentQuestion.correctAnswers.length} doğru
            </Typography>
            {currentQuestion.correctAnswers.map((correct, index) => (
              <Typography key={index} variant="body2" sx={{ mt: 1, color: '#2c3e50' }}>
                Boşluk {index + 1}: <strong>{correct}</strong>
                {userAnswers[index] !== correct && userAnswers[index] && 
                  ` (Siz: ${userAnswers[index]})`
                }
              </Typography>
            ))}
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: '#666' }}>
              {currentQuestion.explanation}
            </Typography>
          </Box>
        )}

        {/* While solving: show Önceki - Kontrol Et - Sonraki on one row */}
        {!isSubmitted && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mt: 3, width: '100%' }}>
            {/* Prev */}
            <button
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 100%)',
                color: currentIndex === 0 ? '#b0b0b0' : '#00b894',
                fontWeight: 700,
                fontSize: 15,
                border: `2px solid ${currentIndex === 0 ? '#e0e0e0' : 'rgba(0, 184, 148, 0.4)'}`,
                borderRadius: 12,
                padding: '10px 12px',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                minWidth: 0,
                flex: '1 1 0',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
              }}
              onClick={prevQuestion}
              disabled={currentIndex === 0}
            >
              ← Önceki
            </button>

            {/* Kontrol Et */}
            {(() => {
              const hasBlank = userAnswers.some(a => a === null);
              const Btn = (
                <button
                  style={{
                    background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 16,
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 18px',
                    cursor: hasBlank ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 16px rgba(0, 184, 148, 0.35)',
                    opacity: hasBlank ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    flex: '1.2 1 0',
                    minWidth: 0
                  }}
                  onClick={() => { if (!hasBlank) handleSubmit(); }}
                  disabled={hasBlank}
                >
                  Kontrol Et
                </button>
              );
              return (
                <Tooltip title={hasBlank ? 'Bütün boşlukları doldurmalısınız' : ''} arrow placement="top" disableHoverListener={!hasBlank}>
                  <span style={{ display: 'inline-flex' }}>{Btn}</span>
                </Tooltip>
              );
            })()}

            {/* Next */}
            <button
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 100%)',
                color: currentIndex >= questions.length - 1 ? '#b0b0b0' : '#00b894',
                fontWeight: 700,
                fontSize: 15,
                border: `2px solid ${currentIndex >= questions.length - 1 ? '#e0e0e0' : 'rgba(0, 184, 148, 0.4)'}`,
                borderRadius: 12,
                padding: '10px 12px',
                cursor: currentIndex >= questions.length - 1 ? 'not-allowed' : 'pointer',
                minWidth: 0,
                flex: '1 1 0',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
              }}
              onClick={nextQuestion}
              disabled={currentIndex >= questions.length - 1}
            >
              Sonraki →
            </button>
          </Box>
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
          {isSubmitted && (
            <button
              style={{
                background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                borderRadius: 12,
                padding: '12px 32px',
                cursor: 'pointer',
                minWidth: 120,
                boxShadow: '0 4px 12px rgba(116, 185, 255, 0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 6px 16px rgba(116, 185, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 12px rgba(116, 185, 255, 0.3)';
              }}
              onClick={() => setShowSummary(true)}
            >
              Bitir
            </button>
          )}
        </Box>
        {/* Summary overlay */}
        {showSummary && (
          <Box 
            sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(178,235,242,0.95)', backdropFilter: 'blur(6px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}
          >
            <Box sx={{ background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)', borderRadius: 4, boxShadow: '0 30px 60px rgba(0,0,0,0.2)', p: 4, width: '100%', maxWidth: 520, textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50', mb: 2 }}>Genel Sonuç</Typography>
              <Box sx={{ p: 2, mb: 2, borderRadius: 3, bgcolor: 'rgba(0, 184, 148, 0.06)', border: '1px solid rgba(0, 184, 148, 0.2)' }}>
                <Typography variant="h6" sx={{ color: '#00695c', fontWeight: 700 }}>
                  Doğru: {summary.correct}/{summary.total}
                </Typography>
                <Typography variant="h6" sx={{ color: '#c62828', fontWeight: 700, mt: 1 }}>
                  Yanlış: {summary.total - summary.correct}/{summary.total}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#607d8b', mb: 3 }}>
                Toplam boşluk: {summary.total}. Çözmediğiniz sorular bu toplam dışında kalır.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 16,
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 28px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(116, 185, 255, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => navigate('/questions')}
                >
                  Kapat
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 16,
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 28px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 184, 148, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={restartGame}
                >
                  Yeniden Başla
                </button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FillInTheBlanksGame;
