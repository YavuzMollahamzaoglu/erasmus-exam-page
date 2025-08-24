import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton, TextField, LinearProgress, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface WordData {
  tr: string;
  en: string;
}

export default function WritingGame() {
  // Read level from URL (default a1)
  const levelParam = new URLSearchParams(window.location.search).get('level') || 'a1';
  const apiLevel = levelParam.toUpperCase();

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [time, setTime] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/games/writing/questions?level=${apiLevel}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setWords(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Sorular yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        // Fallback to hard coded data
        setWords([
          { tr: "masa", en: "table" },
          { tr: "kitap", en: "book" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [apiLevel]);

  // Restart game state
  const handleRestart = () => {
    setIndex(0);
    setInput("");
    setStatus("idle");
    setScore(0);
    setMistakes(0);
    setShowResult(false);
    setTime(0);
    setShowCorrectAnswer(false);
  };

  useEffect(() => {
    if (showResult) return;
    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showResult]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setStatus("idle");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === words[index].en) {
      setStatus("correct");
      setScore((s) => s + 1);
      setTimeout(() => {
        setStatus("idle");
        setInput("");
        if (index < words.length - 1) {
          setIndex((i) => i + 1);
        } else {
          setShowResult(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 500);
    } else {
      setStatus("wrong");
      setMistakes((m) => m + 1);
      setShowCorrectAnswer(true);
      setTimeout(() => {
        setStatus("idle");
        setShowCorrectAnswer(false);
      }, 2500);
    }
  };

  const handleSkip = () => {
    setStatus("idle");
    setInput("");
    if (index < words.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setShowResult(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setStatus("idle");
      setInput("");
    }
  };

  const handleFinish = () => {
    setShowResult(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setIndex(0);
    setScore(0);
    setMistakes(0);
    setTime(0);
    setInput("");
    setStatus("idle");
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#b2ebf2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
        <CircularProgress size={60} sx={{ color: "#00b894", mb: 2 }} />
        <Typography variant="h6" color="#00b894">Sorular yükleniyor...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#b2ebf2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Box sx={{ p: 4, maxWidth: 600, width: "100%", textAlign: "center", borderRadius: 4, background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
          <Typography variant="h6" color="error" mb={2}>{error}</Typography>
          <Typography 
            onClick={() => window.location.href = '/questions'}
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

  // No questions available
  if (words.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#b2ebf2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Box sx={{ p: 4, maxWidth: 600, width: "100%", textAlign: "center", borderRadius: 4, background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
          <Typography variant="h6" color="#2c3e50" mb={2}>Henüz soru bulunmuyor</Typography>
          <Typography 
            onClick={() => window.location.href = '/questions'}
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#b2ebf2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", fontFamily: "Inter, Roboto, Open Sans, Arial, sans-serif", pt: { xs: 8, sm: 12 } }}>
      <Box sx={{ width: 400, maxWidth: "95vw", background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)", borderRadius: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", p: 4, mb: 2, color: "#2c3e50", position: "relative", border: "1px solid rgba(255,255,255,0.2)" }}>
        {/* Top bar with back button, timer, and gap */}
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
          }} onClick={() => window.location.href = '/questions'}>
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
        <LinearProgress
          variant="determinate"
          value={((index + 1) / words.length) * 100}
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
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          textAlign: "center", 
          color: "#2c3e50",
          fontSize: { xs: 20, sm: 24 },
          mb: 2,
          textShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          YAZI YAZMA OYUNU
        </Typography>
        
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          textAlign: "center", 
          color: "#2c3e50",
          fontSize: { xs: 18, sm: 20 },
          mb: 3,
          p: 2,
          bgcolor: 'rgba(0, 184, 148, 0.1)',
          borderRadius: 3,
          border: "1px solid rgba(0, 184, 148, 0.2)"
        }}>
          Türkçe Kelime: {words[index].tr}
        </Typography>
        
        {/* Wrong answer feedback */}
        {status === "wrong" && (
          <Box sx={{ 
            bgcolor: '#ffe6e6', 
            border: '2px solid #e74c3c',
            borderRadius: 2, 
            p: 2, 
            mb: 2,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <Typography sx={{ color: '#e74c3c', fontWeight: 600, fontSize: 18, mb: 1 }}>
              ❌ Yanlış cevap!
            </Typography>
            <Typography sx={{ color: '#666', fontSize: 14 }}>
              Doğru cevap: <strong>{words[index].en}</strong>
            </Typography>
          </Box>
        )}
        
        {/* Correct answer feedback */}
        {status === "correct" && (
          <Box sx={{ 
            bgcolor: '#e6ffe6', 
            border: '2px solid #43ea7c',
            borderRadius: 2, 
            p: 2, 
            mb: 2,
            textAlign: 'center'
          }}>
            <Typography sx={{ color: '#43ea7c', fontWeight: 600, fontSize: 18 }}>
              ✅ Doğru Cevap! Tebrikler!
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <TextField
              value={input}
              onChange={handleChange}
              placeholder="İngilizcesini yazın"
              variant="outlined"
              fullWidth
              sx={{
                minWidth: 300,
                maxWidth: 600,
                fontSize: 20,
                bgcolor: "#fff",
                borderRadius: 2,
                input: { textAlign: "center", fontSize: 22, fontWeight: 600 },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: status === "correct" ? "#43ea7c" : status === "wrong" ? "#e74c3c" : "#00b894",
                    boxShadow: status === "correct" ? "0 0 8px #43ea7c88" : status === "wrong" ? "0 0 8px #e74c3c88" : undefined,
                    borderWidth: status === "correct" || status === "wrong" ? 3 : 1,
                    transition: "border-color 0.3s, box-shadow 0.3s, border-width 0.3s",
                  },
                },
              }}
            />
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!input.trim() || status !== "idle"}
              style={{
                background: !input.trim() || status !== "idle" ? '#ccc' : 'linear-gradient(90deg,#00cec9,#00b894)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                borderRadius: 8,
                padding: '12px 32px',
                cursor: !input.trim() || status !== "idle" ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(0, 184, 148, 0.3)',
                transition: 'background 0.3s',
                minWidth: 120,
              }}
            >
              Gönder
            </button>
          </Box>
        </form>
        {/* Navigation buttons */}
        {!showResult && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 2 }}>
            <button
              style={{
                background: index === 0 ? 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)' : 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                color: index === 0 ? '#666' : '#fff',
                fontWeight: 700,
                fontSize: 16,
                border: 'none',
                borderRadius: 12,
                padding: '12px 24px',
                cursor: index === 0 ? 'not-allowed' : 'pointer',
                opacity: index === 0 ? 0.7 : 1,
                minWidth: 100,
                boxShadow: index === 0 ? 'none' : '0 4px 12px rgba(0, 184, 148, 0.3)',
                transition: 'all 0.3s ease',
                transform: index === 0 ? 'none' : 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                if (index !== 0) {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 6px 16px rgba(0, 184, 148, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== 0) {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = '0 4px 12px rgba(0, 184, 148, 0.3)';
                }
              }}
              onClick={handlePrev}
              disabled={index === 0}
            >
              ← Geri
            </button>
            <button
              style={{
                background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                border: 'none',
                borderRadius: 12,
                padding: '12px 24px',
                cursor: 'pointer',
                minWidth: 100,
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
              onClick={handleSkip}
            >
              Pas Geç →
            </button>
          </Box>
        )}
        {/* Bitir button, only show if not finished */}
        {!showResult && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <button
              style={{
                background: 'linear-gradient(90deg,#00cec9,#00b894)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                borderRadius: 8,
                padding: '12px 32px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 184, 148, 0.3)',
                transition: 'background 0.3s',
              }}
              onClick={handleFinish}
            >
              Bitir
            </button>
          </Box>
        )}
      </Box>
      {/* Result popup bubble */}
      {showResult && (
        <Box 
          sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: '#b2ebf2', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => {
            // Close popup when clicking on background
            if (e.target === e.currentTarget) {
              setShowResult(false);
            }
          }}
        >
          <Box sx={{ background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)", borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,0.2)", p: 4, minWidth: 320, maxWidth: '90vw', textAlign: 'center', position: 'relative', border: "1px solid rgba(255,255,255,0.3)" }}>
            <Typography variant="h5" fontWeight={700} color="#2c3e50" mb={2}>Oyun Sonucu</Typography>
            <Typography fontSize={20} fontWeight={600} color="#43ea7c" mb={1}>Doğru: {score}</Typography>
            <Typography fontSize={20} fontWeight={600} color="#e74c3c" mb={1}>Yanlış: {mistakes}</Typography>
            <Typography fontSize={18} fontWeight={500} color="#2c3e50" mb={2}>Süre: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
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
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 6px 16px rgba(0, 184, 148, 0.4)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = '0 4px 12px rgba(0, 184, 148, 0.3)';
                }}
                onClick={() => window.location.href = '/questions'}
              >
                Kapat
              </button>
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
                onClick={handleRestart}
              >
                Yeniden Başlat
              </button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
