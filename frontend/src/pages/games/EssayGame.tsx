import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

interface ParagraphQuestion {
  id: number;
  title: string;
  text: string;
  options: string[];
  correctAnswers: string[];
}

function EssayGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); 
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [paragraphQuestions, setParagraphQuestions] = useState<ParagraphQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/games/fill-in-the-blanks/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setParagraphQuestions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Sorular yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        // Fallback to hard coded data
        setParagraphQuestions([
          {
            id: 1,
            title: "Technology and Communication",
            text: "Technology has dramatically changed the way we communicate with each other. Social media platforms have made it possible to connect with people from all around the world ______. However, some experts argue that digital communication lacks the ______ connection that face-to-face interactions provide. Despite this concern, many businesses have successfully adapted to remote work environments. The ability to collaborate ______ has become essential in today's global economy. As we move forward, finding the right balance between digital and ______ communication will be crucial for maintaining healthy relationships.",
            options: ["instantly", "emotional", "remotely", "personal", "gradually"],
            correctAnswers: ["instantly", "emotional", "remotely", "personal"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const question = paragraphQuestions[currentQuestion];

  useEffect(() => {
    if (timerActive && !gameCompleted) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, gameCompleted]);

  useEffect(() => {
    if (!timerActive) setTimerActive(true);
  }, []);

  useEffect(() => {
    // Soruyu değiştirdiğimizde seçenekleri karıştır
    if (question && question.options && question.correctAnswers) {
      const shuffled = [...question.options].sort(() => Math.random() - 0.5);
      setAvailableOptions(shuffled);
      setSelectedAnswers(new Array(question.correctAnswers.length).fill(''));
    }
  }, [currentQuestion, question]);

  const handleDragStart = (e: React.DragEvent, word: string) => {
    setDraggedWord(word);
    e.dataTransfer.effectAllowed = 'move';
    // Sürüklenen elementi gizle
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.5';
    }, 0);
  };

  const handleDragStartFromBlank = (e: React.DragEvent, word: string, blankIndex: number) => {
    setDraggedWord(word);
    e.dataTransfer.effectAllowed = 'move';
    // Sürüklenen elementi gizle
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.5';
    }, 0);
    
    // Bu kelimeyi boşluktan çıkar ve availableOptions'a geri ekle
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[blankIndex] = '';
    setSelectedAnswers(newSelectedAnswers);
    setAvailableOptions(prev => [...prev, word]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Drag işlemi bittiğinde opacity'yi geri yükle
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedWord(null);
  };

  const handleDrop = (e: React.DragEvent, blankIndex: number) => {
    e.preventDefault();
    if (draggedWord) {
      // Eğer o pozisyonda kelime varsa, onu geri availableOptions'a ekle
      if (selectedAnswers[blankIndex]) {
        setAvailableOptions(prev => [...prev, selectedAnswers[blankIndex]]);
      }
      
      // Yeni kelimeyi pozisyona koy
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[blankIndex] = draggedWord;
      setSelectedAnswers(newSelectedAnswers);
      
      // Kullanılan kelimeyi availableOptions'dan çıkar
      setAvailableOptions(prev => prev.filter(option => option !== draggedWord));
      
      setDraggedWord(null);
      
      // Tüm elementlerin opacity'sini geri yükle
      const draggedElements = document.querySelectorAll('[draggable="true"]');
      draggedElements.forEach(el => {
        (el as HTMLElement).style.opacity = '1';
      });
    }
  };

  const handleDropToOptions = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedWord) {
      // Kelime zaten availableOptions'da değilse ekle
      setAvailableOptions(prev => {
        if (!prev.includes(draggedWord)) {
          return [...prev, draggedWord];
        }
        return prev;
      });
      
      setDraggedWord(null);
      
      // Tüm elementlerin opacity'sini geri yükle
      const draggedElements = document.querySelectorAll('[draggable="true"]');
      draggedElements.forEach(el => {
        (el as HTMLElement).style.opacity = '1';
      });
    }
  };

  const handleWordClick = (word: string) => {
    // İlk boş pozisyonu bul
    const firstEmptyIndex = selectedAnswers.findIndex(answer => answer === '');
    if (firstEmptyIndex !== -1) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[firstEmptyIndex] = word;
      setSelectedAnswers(newSelectedAnswers);
      setAvailableOptions(prev => prev.filter(option => option !== word));
    }
  };

  const handleRemoveWord = (index: number) => {
    const word = selectedAnswers[index];
    if (word) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[index] = '';
      setSelectedAnswers(newSelectedAnswers);
      setAvailableOptions(prev => [...prev, word]);
    }
  };

  const renderTextWithBlanks = () => {
    if (!question || !question.text) return null;
    
    const parts = question.text.split('______');
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      result.push(
        <span key={`text-${i}`}>{parts[i]}</span>
      );
      
      if (i < parts.length - 1) {
        const blankIndex = i;
        const selectedAnswer = selectedAnswers[blankIndex];
        
        result.push(
          <Box
            key={`blank-${i}`}
            component="span"
            draggable={!!selectedAnswer}
            onDragStart={(e) => selectedAnswer && handleDragStartFromBlank(e, selectedAnswer, blankIndex)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, blankIndex)}
            onClick={() => selectedAnswer && handleRemoveWord(blankIndex)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 80,
              height: 28,
              mx: 0.5,
              px: 1.5,
              py: 0.5,
              bgcolor: selectedAnswer ? "#e3f2fd" : "#f5f5f5",
              border: selectedAnswer ? "1px solid #1976d2" : "1px dashed #ccc",
              borderRadius: 1.5,
              fontSize: 14,
              fontWeight: selectedAnswer ? 500 : 400,
              color: selectedAnswer ? "#1976d2" : "#999",
              cursor: selectedAnswer ? "grab" : "default",
              transition: "all 0.2s",
              verticalAlign: "middle",
              "&:hover": {
                bgcolor: selectedAnswer ? "#bbdefb" : "#e0e0e0"
              },
              "&:active": {
                cursor: selectedAnswer ? "grabbing" : "default"
              }
            }}
          >
            {selectedAnswer || `Boşluk ${blankIndex + 1}`}
          </Box>
        );
      }
    }
    
    return result;
  };

  const checkAnswers = () => {
    if (!question || !question.correctAnswers) return;
    
    // Timer'ı durdur
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const results = selectedAnswers.map((answer, index) => 
      answer === question.correctAnswers[index]
    );
    setUserAnswers(results.map(r => r ? "correct" : "incorrect"));
    setShowResults(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < paragraphQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswers([]);
      setShowResults(false);
      setUserAnswers([]);
      // Timer'ı yeniden başlat
      setTimerActive(true);
    } else {
      setGameCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setUserAnswers([]);
    setGameCompleted(false);
    setTimer(0);
    setTimerActive(true);
  };

  const getScore = () => {
    return userAnswers.filter(answer => answer === "correct").length;
  };

  const isAllAnswered = () => {
    return selectedAnswers.every(answer => answer !== '');
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#b2dfdb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
        <CircularProgress size={60} sx={{ color: "#19376D", mb: 2 }} />
        <Typography variant="h6" color="#19376D">Sorular yükleniyor...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#b2dfdb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper sx={{ p: 4, maxWidth: 600, width: "100%", textAlign: "center", borderRadius: 4 }}>
          <Typography variant="h6" color="error" mb={2}>{error}</Typography>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/questions'}
            sx={{ bgcolor: "#19376D", "&:hover": { bgcolor: "#0f2149" } }}
          >
            Geri Dön
          </Button>
        </Paper>
      </Box>
    );
  }

  // No questions available
  if (!question) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#b2dfdb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper sx={{ p: 4, maxWidth: 600, width: "100%", textAlign: "center", borderRadius: 4 }}>
          <Typography variant="h6" color="#19376D" mb={2}>Henüz soru bulunmuyor</Typography>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/questions'}
            sx={{ bgcolor: "#19376D", "&:hover": { bgcolor: "#0f2149" } }}
          >
            Geri Dön
          </Button>
        </Paper>
      </Box>
    );
  }

  if (gameCompleted) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#b2dfdb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper sx={{ p: 4, maxWidth: 600, width: "100%", textAlign: "center", borderRadius: 4 }}>
          <Typography variant="h4" fontWeight={700} mb={2} color="#19376D">
            🎉 Tebrikler!
          </Typography>
          <Typography variant="h6" mb={2}>
            Tüm paragrafları tamamladınız!
          </Typography>
          <Typography variant="h5" fontWeight={600} mb={3} color="#1976d2">
            Süre: {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={restartGame}
              sx={{ bgcolor: "#19376D", "&:hover": { bgcolor: "#0f2149" } }}
            >
              Tekrar Oyna
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/questions'}
              sx={{ color: "#19376D", borderColor: "#19376D" }}
            >
              Ana Menü
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#b2dfdb", display: "flex", flexDirection: "column", alignItems: "center", px: 2, pt: { xs: 3, sm: 5 } }}>
      
      <Box sx={{ width: '100%', maxWidth: { xs: 700, md: 900 }, bgcolor: "#fff", borderRadius: 4, boxShadow: 6, p: { xs: 3, md: 4 }, mb: 2, position: "relative" }}>
        
        {/* Timer at top right inside card */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            bgcolor: !timerActive ? '#ffeb3b' : '#b6d4fa',
            color: '#19376D',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 18,
            boxShadow: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'background-color 0.3s ease',
          }}
        >
          {!timerActive && <span>⏸️</span>}
          {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
        </Box>
        
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <IconButton 
            sx={{ color: "#19376D" }} 
            onClick={() => window.location.href = '/questions'}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="#19376D">
            {question?.title || 'Soru Yükleniyor...'} ({currentQuestion + 1}/{paragraphQuestions.length})
          </Typography>
          <Box sx={{ width: 40 }} /> {/* Spacer for balance */}
        </Box>

        {/* Progress Bar */}
        <Box sx={{ width: "100%", height: 6, bgcolor: "#e0e0e0", borderRadius: 3, mb: 4 }}>
          <Box
            sx={{
              width: `${((currentQuestion + 1) / paragraphQuestions.length) * 100}%`,
              height: "100%",
              bgcolor: "#19376D",
              borderRadius: 3,
              transition: "width 0.3s"
            }}
          />
        </Box>

        {/* Paragraph with blanks */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: "#f9f9f9", borderRadius: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              lineHeight: 2, 
              fontSize: { xs: 16, md: 18 },
              color: "#333"
            }}
          >
            {renderTextWithBlanks()}
          </Typography>
        </Paper>

        {/* Available Options */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={2} color="#19376D">
            Kelime Seçenekleri (Sürükle & Bırak veya Tıkla):
          </Typography>
          <Box 
            onDragOver={handleDragOver}
            onDrop={handleDropToOptions}
            sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 3, bgcolor: "#f5f5f5", borderRadius: 3, minHeight: 80 }}
          >
            {availableOptions.map((option, index) => (
              <Box
                key={`${option}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, option)}
                onDragEnd={handleDragEnd}
                onClick={() => handleWordClick(option)}
                sx={{
                  bgcolor: "#1976d2",
                  color: "white",
                  fontWeight: 500,
                  cursor: "grab",
                  px: 1.5,
                  py: 0.7,
                  borderRadius: 1.5,
                  fontSize: 13,
                  userSelect: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#1565c0",
                    transform: "translateY(-1px)",
                    boxShadow: 2
                  },
                  "&:active": {
                    cursor: "grabbing",
                    transform: "translateY(0px)"
                  }
                }}
              >
                {option}
              </Box>
            ))}
            {availableOptions.length === 0 && (
              <Typography color="#999" sx={{ width: "100%", textAlign: "center", py: 2 }}>
                Tüm kelimeler kullanıldı
              </Typography>
            )}
          </Box>
        </Box>

        {/* Results */}
        {showResults && question && question.correctAnswers && (
          <Alert 
            severity={getScore() === question.correctAnswers.length ? "success" : "warning"} 
            sx={{ mb: 3 }}
          >
            <Typography fontWeight={600}>
              Sonuç: {getScore()}/{question.correctAnswers.length} doğru cevap!
            </Typography>
            {question.correctAnswers.map((correct, index) => (
              <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                Boşluk {index + 1}: <strong>{correct}</strong>
                {selectedAnswers[index] !== correct && (
                  <span style={{ color: "#d32f2f" }}> (Seçiminiz: {selectedAnswers[index]})</span>
                )}
              </Typography>
            ))}
          </Alert>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          {!showResults ? (
            <Button
              variant="contained"
              onClick={checkAnswers}
              disabled={!isAllAnswered()}
              sx={{
                bgcolor: "#19376D",
                "&:hover": { bgcolor: "#0f2149" },
                px: 4,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600
              }}
            >
              Cevapları Kontrol Et
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={nextQuestion}
              sx={{
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
                px: 4,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600
              }}
            >
              {currentQuestion < paragraphQuestions.length - 1 ? "Sonraki Paragraf" : "Oyunu Bitir"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default EssayGame;
