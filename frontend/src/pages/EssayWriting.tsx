import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  LinearProgress,
  IconButton,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';

interface EssayScores {
  task_response: number;
  coherence_cohesion: number;
  lexical_resource: number;
  grammar: number;
  overall: number;
}

interface EssayEvaluation {
  scores: EssayScores;
  feedback: string;
}

const EssayTopics = [
  "Some people think that social media has a negative impact on society. Do you agree or disagree?",
  "Many people believe that learning a foreign language is essential for career success. What is your opinion?",
  "Some argue that technology has made people less social. Discuss both views and give your opinion.",
  "Education should be free for everyone. Do you agree or disagree with this statement?",
  "The environment should be the government's top priority. Discuss your views on this topic."
];

export default function EssayWriting() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [essayText, setEssayText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EssayEvaluation | null>(null);
  const [error, setError] = useState<string>('');
  const [showTopicDialog, setShowTopicDialog] = useState<boolean>(true);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [turkishCharCount, setTurkishCharCount] = useState<number>(0);
  const [showLangDialog, setShowLangDialog] = useState<boolean>(false);

  // Parse feedback into readable bullet points
  const feedbackBullets = React.useMemo(() => {
    const text = (evaluation?.feedback || '').trim();
    if (!text) return [] as string[];
    // Prefer double-newline paragraph splits; otherwise split by sentence boundaries.
    const paragraphs = text.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
    if (paragraphs.length > 1) return paragraphs;
    const sentences = text
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
    return sentences;
  }, [evaluation?.feedback]);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setShowTopicDialog(false);
  };

  const handleCustomTopic = () => {
    if (customTopic.trim()) {
      setSelectedTopic(customTopic);
      setShowTopicDialog(false);
    }
  };

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEssayText(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  setCharCount(text.trim().length);

  // Count Turkish-specific characters (ı,ğ,ş,ç,ö,ü and uppercase variants)
  const trMatches = text.match(/[ığüşöçİĞÜŞÖÇ]/g) || [];
  setTurkishCharCount(trMatches.length);
  };

  const evaluateEssay = async () => {
    if (!essayText.trim()) {
      setError('Lütfen essay metninizi yazın.');
      return;
    }

    if (charCount < 100) {
      setError("Essay’inizin değerlendirilebilmesi için minimum 100 karakter olmalıdır.");
      return;
    }

    // Block evaluation if Turkish character count exceeds the limit
    if (turkishCharCount > 10) {
      setShowLangDialog(true);
      return;
    }

    setIsEvaluating(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/essays/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ essayText, topic: selectedTopic })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Essay değerlendirme hatası');
      }

      setEvaluation(data);
    } catch (err: any) {
      console.error('Essay evaluation error:', err);
      setError(err.message || 'Essay değerlendirme sırasında hata oluştu.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number, isOverall: boolean = false) => {
    if (isOverall) {
      // Overall score is 0-100
      if (score >= 80) return '#4caf50'; // Green
      if (score >= 60) return '#ff9800'; // Orange
      return '#f44336'; // Red
    } else {
      // Sub-scores are 1-10
      if (score >= 8) return '#4caf50'; // Green
      if (score >= 6) return '#ff9800'; // Orange
      return '#f44336'; // Red
    }
  };

  const getScoreLabel = (score: number, isOverall: boolean = false) => {
    if (isOverall) {
      // Overall score is 0-100
      if (score >= 90) return 'Mükemmel';
      if (score >= 80) return 'Çok İyi';
      if (score >= 70) return 'İyi';
      if (score >= 60) return 'Yeterli';
      if (score >= 50) return 'Orta';
      return 'Geliştirilmeli';
    } else {
      // Sub-scores are 1-10
      if (score >= 9) return 'Mükemmel';
      if (score >= 8) return 'Çok İyi';
      if (score >= 7) return 'İyi';
      if (score >= 6) return 'Yeterli';
      if (score >= 5) return 'Orta';
      return 'Geliştirilmeli';
    }
  };

  const resetEssay = () => {
    setEssayText('');
    setEvaluation(null);
    setError('');
    setWordCount(0);
    setShowTopicDialog(true);
    setSelectedTopic('');
    setCustomTopic('');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#b2dfdb',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      px: 2,
      pt: 0,
      pb: { xs: 12, md: 16 },
    }}>
      {/* Topic Selection Dialog - themed */}
      <Dialog 
        open={showTopicDialog} 
        onClose={() => setShowTopicDialog(false)}
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 700,
        }}>
          <AutoAwesomeIcon sx={{ mr: 1 }} /> Essay Konusu Seçin
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', mt: '10px' }}>
            Önerilen Konular:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {EssayTopics.map((topic, index) => (
              <Card 
                key={index}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#e3f2fd',
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  },
                  transition: 'all 0.3s'
                }}
                onClick={() => handleTopicSelect(topic)}
              >
                <CardContent>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {topic}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#333' }}>
            Veya Kendi Konunuzu Yazın:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Kendi essay konunuzu yazın..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            onClick={handleCustomTopic}
            disabled={!customTopic.trim()}
            sx={{
              background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #00a085 0%, #00b8b3 100%)',
              }
            }}
          >
            Özel Konu Kullan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Card */}
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 1000,
          borderRadius: 4,
          overflow: 'hidden',
          mt: { xs: 1, md: '15px' },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Gradient Header merged with card */}
        <Box sx={{
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(5px)',
          }
        }}>
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              minHeight: { xs: 56, md: 'auto' },
              display: { xs: 'block', md: 'flex' },
              alignItems: { md: 'center' },
            }}
          >
            {/* Back button: fixed left on mobile, inline on md+ */}
            <IconButton
              onClick={() => navigate('/questions')}
              sx={{
                color: '#fff',
                position: { xs: 'absolute', md: 'static' },
                left: { xs: 8, md: 'auto' },
                top: { xs: '50%', md: 'auto' },
                transform: { xs: 'translateY(-50%)', md: 'none' },
              }}
              aria-label="Geri dön"
            >
              <ArrowBackIcon />
            </IconButton>

            {/* Title: perfectly centered on mobile */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                position: { xs: 'absolute', md: 'static' },
                left: { xs: '50%', md: 'auto' },
                top: { xs: '50%', md: 'auto' },
                transform: { xs: 'translate(-50%, -50%)', md: 'none' },
                width: { xs: '80%', md: 'auto' },
                fontSize: { xs: '1.35rem', md: '2rem' },
                mx: { md: 'auto' },
                whiteSpace: { xs: 'nowrap', md: 'normal' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <AutoAwesomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> AI Essay Değerlendirici
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {/* Selected Topic */}
          {selectedTopic && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#00695c' }}>Seçilen Konu:</Typography>
              <Paper sx={{ p: 2, background: 'rgba(0, 184, 148, 0.08)', border: '1px solid rgba(0, 184, 148, 0.25)', borderRadius: 2 }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"{selectedTopic}"</Typography>
              </Paper>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowTopicDialog(true)}
                sx={{
                  mt: 1,
                  borderColor: 'rgba(0, 184, 148, 0.5)',
                  color: '#00796b',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { borderColor: '#00b894', background: 'rgba(0, 184, 148, 0.08)' }
                }}
              >
                Konu Değiştir
              </Button>
            </Box>
          )}

          {/* Layout */}
          <Box sx={{ display: 'flex', flexDirection: evaluation ? 'row' : 'column', gap: 3, '@media (max-width: 900px)': { flexDirection: 'column' } }}>
            {/* Writing Area */}
            <Box sx={{ flex: evaluation ? 1 : 'auto', minWidth: 0 }}>
              <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0, 184, 148, 0.15)' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { xs: 'flex-start', sm: 'space-between' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 1.5,
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#2c3e50', whiteSpace: { xs: 'nowrap', sm: 'normal' } }}
                  >
                    Essay Yazma Alanı
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: { xs: 0.5, sm: 0 } }}>
                    <Chip 
                      label={`${wordCount} kelime`}
                      sx={{
                        borderColor: 'rgba(0, 184, 148, 0.4)',
                        color: '#00695c',
                        fontWeight: 600
                      }}
                      variant="outlined"
                    />
                    <Chip 
                      label={`${charCount} karakter`}
                      sx={{
                        borderColor: 'rgba(0, 184, 148, 0.4)',
                        color: '#00695c',
                        fontWeight: 600
                      }}
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: '#607d8b' }}>
                  Kelime sayısı yalnızca bilgilendirme amaçlıdır; herhangi bir sınırlama yoktur.
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  value={essayText}
                  onChange={handleEssayChange}
                  placeholder="Essay’inizi buraya yazınız..."
                  variant="outlined"
                  sx={{
                    mb: 1,
                    '& .MuiInputBase-root': { background: 'rgba(255,255,255,0.95)' },
                    '& .MuiInputBase-input': { fontSize: '16px', lineHeight: 1.6 }
                  }}
                />

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: charCount < 100 ? '#e53935' : '#2e7d32' }}>
                  Essay’inizin değerlendirilebilmesi için minimum 100 karakter olmalıdır.
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#00695c' }}>
                  İpucu: Ortalama bilgilendirici bir essay için <strong>170–190 kelime</strong> aralığı idealdir (zorunlu değildir).
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}


                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    onClick={evaluateEssay}
                    disabled={isEvaluating || charCount < 100}
                    startIcon={isEvaluating ? null : <SendIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: 2,
                      px: 3,
                      textTransform: 'none',
                      '&:hover': { background: 'linear-gradient(135deg, #00a085 0%, #00b8b3 100%)' }
                    }}
                  >
                    {isEvaluating ? 'Değerlendiriliyor...' : "Essay'i Değerlendir"}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={resetEssay}
                    disabled={isEvaluating}
                    sx={{
                      borderColor: 'rgba(0, 184, 148, 0.5)',
                      color: '#00796b',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { borderColor: '#00b894', background: 'rgba(0, 184, 148, 0.08)' }
                    }}
                  >
                    Yeni Essay
                  </Button>
                </Box>

                {/* Blocking popup if Turkish character count exceeds 10 */}
                <Dialog open={showLangDialog} onClose={() => setShowLangDialog(false)} maxWidth="xs" fullWidth>
                  <DialogTitle>Essay Dili Hakkında</DialogTitle>
                  <DialogContent>
                    <Typography>
                      Metninizde <strong>{turkishCharCount}</strong> adet Türkçe karakter tespit edildi. Lütfen essay’i İngilizce yazın.
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setShowLangDialog(false)} autoFocus>
                      Tamam
                    </Button>
                  </DialogActions>
                </Dialog>

                {isEvaluating && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(0, 184, 148, 0.1)',
                      '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)' }
                    }} />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: '#00695c' }}>
                      AI essay'inizi analiz ediyor...
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>

            {/* Evaluation Results */}
            {evaluation && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0, 184, 148, 0.15)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#2c3e50' }}>
                    <AutoAwesomeIcon sx={{ mr: 1 }} /> AI Değerlendirme Sonucu
                  </Typography>

                  {/* Overall Score */}
                  <Card sx={{ mb: 3, background: 'rgba(0, 184, 148, 0.06)', border: '1px solid rgba(0, 184, 148, 0.15)' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: getScoreColor(evaluation.scores.overall, true), mb: 1 }}>
                        {evaluation.scores.overall}/100
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#666' }}>Genel Puan</Typography>
                      <Chip 
                        label={getScoreLabel(evaluation.scores.overall, true)}
                        sx={{ bgcolor: getScoreColor(evaluation.scores.overall, true), color: 'white', fontWeight: 600, mt: 1 }}
                      />
                    </CardContent>
                  </Card>

                  {/* Detailed Scores */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Detaylı Puanlama:
                    </Typography>
                    
                    {[
                      { key: 'task_response', label: 'Görev Yanıtı' },
                      { key: 'coherence_cohesion', label: 'Tutarlılık & Bağlantı' },
                      { key: 'lexical_resource', label: 'Kelime Bilgisi' },
                      { key: 'grammar', label: 'Dilbilgisi' }
                    ].map(({ key, label }) => {
                      const score = evaluation.scores[key as keyof EssayScores];
                      return (
                        <Box key={key} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1">{label}</Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 600,
                                color: getScoreColor(score)
                              }}
                            >
                              {score}/9
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(score / 9) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getScoreColor(score),
                                borderRadius: 4
                              }
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Feedback */}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      AI Geri Bildirim:
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                      {feedbackBullets.length <= 1 ? (
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {evaluation.feedback}
                        </Typography>
                      ) : (
                        <Box component="ul" sx={{ m: 0, pl: 3 }}>
                          {feedbackBullets.map((b, idx) => (
                            <Box component="li" key={idx} sx={{ mb: 1.2 }}>
                              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>{b}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Paper>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
