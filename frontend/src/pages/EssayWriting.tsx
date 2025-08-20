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
    setWordCount(text.trim().split(/\\s+/).filter(word => word.length > 0).length);
  };

  const evaluateEssay = async () => {
    if (!essayText.trim()) {
      setError('Lütfen essay metninizi yazın.');
      return;
    }

    if (essayText.trim().length < 50) {
      setError('Essay en az 50 karakter olmalıdır.');
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
        body: JSON.stringify({ essayText })
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
      bgcolor: '#f5f5f5', 
      py: 3 
    }}>
      {/* Topic Selection Dialog */}
      <Dialog 
        open={showTopicDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#1976d2', 
          color: 'white', 
          textAlign: 'center',
          fontWeight: 700 
        }}>
          <AutoAwesomeIcon sx={{ mr: 1 }} />
          Essay Konusu Seçin
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
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
            sx={{ mr: 1 }}
          >
            Özel Konu Kullan
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton 
              onClick={() => navigate('/questions')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
              <AutoAwesomeIcon sx={{ mr: 1 }} />
              AI Essay Değerlendirici
            </Typography>
          </Box>
          
          {selectedTopic && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
                Seçilen Konu:
              </Typography>
              <Paper sx={{ 
                p: 2, 
                bgcolor: '#e3f2fd', 
                border: '1px solid #1976d2' 
              }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "{selectedTopic}"
                </Typography>
              </Paper>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowTopicDialog(true)}
                sx={{ mt: 1 }}
              >
                Konu Değiştir
              </Button>
            </Box>
          )}
        </Paper>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: evaluation ? 'row' : 'column',
          gap: 3,
          '@media (max-width: 900px)': {
            flexDirection: 'column'
          }
        }}>
          {/* Essay Writing Area */}
          <Box sx={{ 
            flex: evaluation ? 1 : 'auto',
            minWidth: 0
          }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Essay Yazma Alanı
                </Typography>
                <Chip 
                  label={`${wordCount} kelime`}
                  color={wordCount >= 250 ? 'success' : wordCount >= 150 ? 'warning' : 'default'}
                  variant="outlined"
                />
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={20}
                value={essayText}
                onChange={handleEssayChange}
                placeholder="Essay'inizi buraya yazın... (Minimum 250 kelime önerilir)"
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                    fontSize: '16px',
                    lineHeight: 1.6
                  }
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={evaluateEssay}
                  disabled={isEvaluating || !essayText.trim()}
                  startIcon={isEvaluating ? null : <SendIcon />}
                  sx={{ 
                    bgcolor: '#1976d2',
                    '&:hover': { bgcolor: '#1565c0' },
                    fontWeight: 600
                  }}
                >
                  {isEvaluating ? 'Değerlendiriliyor...' : 'Essay\'i Değerlendir'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={resetEssay}
                  disabled={isEvaluating}
                >
                  Yeni Essay
                </Button>
              </Box>

              {isEvaluating && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    AI essay'inizi analiz ediyor...
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Evaluation Results */}
          {evaluation && (
            <Box sx={{ 
              flex: 1,
              minWidth: 0
            }}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  <AutoAwesomeIcon sx={{ mr: 1 }} />
                  AI Değerlendirme Sonucu
                </Typography>

                {/* Overall Score */}
                <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700, 
                      color: getScoreColor(evaluation.scores.overall, true),
                      mb: 1 
                    }}>
                      {evaluation.scores.overall}/100
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#666' }}>
                      Genel Puan
                    </Typography>
                    <Chip 
                      label={getScoreLabel(evaluation.scores.overall, true)}
                      sx={{ 
                        bgcolor: getScoreColor(evaluation.scores.overall, true),
                        color: 'white',
                        fontWeight: 600,
                        mt: 1
                      }}
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
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: '#f8f9fa',
                    border: '1px solid #e0e0e0'
                  }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.7,
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {evaluation.feedback}
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
