import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert, IconButton, LinearProgress, CircularProgress } from '@mui/material';
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

const FillInTheBlanksGame: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<FillInTheBlanksQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(0);

  // Backend'den soruları çek
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/games/fill-in-the-blanks/questions');
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
          if (data.length > 0) {
            resetCurrentQuestion(data[0]);
          }
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
        resetCurrentQuestion(sampleQuestions[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const resetCurrentQuestion = (question: FillInTheBlanksQuestion) => {
    setUserAnswers(Array(question.correctAnswers.length).fill(null));
    setAvailableOptions([...question.options]);
    setIsSubmitted(false);
    setShowResults(false);
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

  const handleRemoveAnswer = (blankIndex: number) => {
    if (userAnswers[blankIndex] && !isSubmitted) {
      setAvailableOptions(prev => [...prev, userAnswers[blankIndex] as string]);
      const newAnswers = [...userAnswers];
      newAnswers[blankIndex] = null;
      setUserAnswers(newAnswers);
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
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetCurrentQuestion(questions[currentIndex + 1]);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetCurrentQuestion(questions[currentIndex - 1]);
    }
  };

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
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, blankIndex)}
            onClick={() => handleRemoveAnswer(blankIndex)}
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
              cursor: userAnswer && !isSubmitted ? 'pointer' : 'default',
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
      pt: 0
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
        overflow: 'hidden', 
        border: "1px solid rgba(255,255,255,0.2)",
        mt: '15px'
      }}>
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
        <Box sx={{ p: 3, mb: 3, backgroundColor: 'rgba(116, 185, 255, 0.1)', borderRadius: 3, border: "1px solid rgba(116, 185, 255, 0.2)" }}>
          <Typography variant="h6" gutterBottom sx={{ color: "#2c3e50", fontWeight: 600 }}>
            Seçenekler:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {availableOptions.map((option, index) => (
              <Box
                key={`option-${index}`}
                draggable={!isSubmitted}
                onDragStart={(e) => handleDragStart(e, option)}
                sx={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                  color: '#fff',
                  borderRadius: 1,
                  cursor: isSubmitted ? 'default' : 'grab',
                  userSelect: 'none',
                  opacity: isSubmitted ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(116, 185, 255, 0.3)',
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

        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 2 }}>
          <button
            style={{
              background: currentIndex === 0 ? 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)' : 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
              color: currentIndex === 0 ? '#666' : '#fff',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              borderRadius: 12,
              padding: '12px 24px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === 0 ? 0.7 : 1,
              minWidth: 100,
              boxShadow: currentIndex === 0 ? 'none' : '0 4px 12px rgba(0, 184, 148, 0.3)',
              transition: 'all 0.3s ease',
              transform: currentIndex === 0 ? 'none' : 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (currentIndex !== 0) {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 6px 16px rgba(0, 184, 148, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentIndex !== 0) {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 4px 12px rgba(0, 184, 148, 0.3)';
              }
            }}
            onClick={prevQuestion}
            disabled={currentIndex === 0}
          >
            ← Önceki
          </button>
          <button
            style={{
              background: currentIndex === questions.length - 1 ? 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' : 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              borderRadius: 12,
              padding: '12px 24px',
              cursor: (currentIndex === questions.length - 1 && (userAnswers.some(a => a === null) || isSubmitted)) ? 'not-allowed' : 'pointer',
              minWidth: 100,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
              opacity: (currentIndex === questions.length - 1 && (userAnswers.some(a => a === null) || isSubmitted)) ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onClick={() => {
              if (currentIndex < questions.length - 1) {
                nextQuestion();
              } else {
                // Last question: swap behavior -> Kontrol Et here
                if (!userAnswers.some(a => a === null) && !isSubmitted) {
                  handleSubmit();
                }
              }
            }}
            disabled={currentIndex === questions.length - 1 && (userAnswers.some(a => a === null) || isSubmitted)}
          >
            {currentIndex < questions.length - 1 ? 'Sonraki →' : 'Kontrol Et'}
          </button>
        </Box>

        {/* Action buttons (Bitir moved here) */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
          {currentIndex === questions.length - 1 && isSubmitted && (
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
              onClick={() => navigate('/questions')}
            >
              Bitir
            </button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FillInTheBlanksGame;
