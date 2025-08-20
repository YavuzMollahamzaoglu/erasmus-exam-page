import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface Props {
  token: string;
}

const medalIcons = [
  '🥇', // 1st
  '🥈', // 2nd
  '🥉', // 3rd
];

const examOptions = ['A1', 'A2', 'B1', 'B2'];

const Rankings: React.FC<Props> = ({ token }) => {
  const [rankings, setRankings] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('A1');
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/api/rankings", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        setRankings(data.rankings || []);
        setLoading(false);
      })
      .catch((err) => {
        setRankings([]);
        setLoading(false);
      });
    // Fetch comments for selected exam
    fetch(`http://localhost:4000/api/comments?exam=${selectedExam}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => setComments(data.comments || []))
      .catch(() => setComments([]));
  }, [token, selectedExam]);

  // Only show top 20
  const topRankings = rankings.slice(0, 20);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #b2ebf2 0%, #80deea 50%, #4dd0e1 100%)', 
      px: 2, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      pt: { xs: 10, md: 12 }, 
      pb: { xs: 7, md: 8 } 
    }}>
      <Paper 
        elevation={6} 
        sx={{ 
          maxWidth: 800, 
          width: '100%', 
          borderRadius: 4, 
          overflow: 'hidden', 
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
        {/* Header */}
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            zIndex: 0,
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h3" 
              fontWeight={700} 
              mb={2}
              sx={{
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              🏆 Sıralama Tablosu
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                mb: 2
              }}
            >
              En başarılı öğrencilerimizi keşfedin
            </Typography>
            
            {/* Exam Selection */}
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&.Mui-focused': { color: 'rgba(255, 255, 255, 0.9)' }
                }}
              >
                Seviye
              </InputLabel>
              <Select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                label="Seviye"
                sx={{
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                {examOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Rankings Table */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="#00b894">Yükleniyor...</Typography>
            </Box>
          ) : rankings.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="#666">Henüz sıralama bulunmuyor.</Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ 
                minWidth: 600,
                background: 'rgba(0, 184, 148, 0.05)',
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid rgba(0, 184, 148, 0.1)'
              }}>
                {/* Table Header */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '60px 1fr 80px 80px 80px 100px',
                  gap: 1,
                  p: 2,
                  background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                  color: '#fff'
                }}>
                  <Typography fontWeight={700} textAlign="center">Sıra</Typography>
                  <Typography fontWeight={700}>İsim</Typography>
                  <Typography fontWeight={700} textAlign="center">Puan</Typography>
                  <Typography fontWeight={700} textAlign="center">Doğru</Typography>
                  <Typography fontWeight={700} textAlign="center">Yanlış</Typography>
                  <Typography fontWeight={700} textAlign="center">Süre</Typography>
                </Box>
                
                {/* Table Rows */}
                {topRankings.map((r, idx) => (
                  <Box 
                    key={r.id || idx}
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '60px 1fr 80px 80px 80px 100px',
                      gap: 1,
                      p: 2,
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 184, 148, 0.02)',
                      borderTop: '1px solid rgba(0, 184, 148, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(0, 184, 148, 0.1)',
                        transform: 'translateX(5px)',
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}>
                      {idx < 3 ? (
                        <span style={{ fontSize: '1.5rem' }}>{medalIcons[idx]}</span>
                      ) : (
                        <Typography color="#00b894" fontWeight={700}>{idx + 1}</Typography>
                      )}
                    </Box>
                    <Typography 
                      fontWeight={idx < 3 ? 700 : 500} 
                      color={idx < 3 ? '#00b894' : '#2c3e50'}
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {r.user?.name || 'İsimsiz'}
                    </Typography>
                    <Typography fontWeight={700} color="#00b894" textAlign="center">
                      {r.score}
                    </Typography>
                    <Typography color="#2c3e50" textAlign="center">
                      {r.correct ?? '-'}
                    </Typography>
                    <Typography color="#e74c3c" textAlign="center">
                      {r.mistakes ?? '-'}
                    </Typography>
                    <Typography color="#2c3e50" textAlign="center" fontSize="0.9rem">
                      {r.time ?? '-'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Comments Section */}
        <Box sx={{ 
          p: { xs: 3, md: 4 }, 
          pt: 0,
          background: 'rgba(0, 184, 148, 0.02)',
          borderTop: '1px solid rgba(0, 184, 148, 0.1)'
        }}>
          <Typography 
            variant="h5" 
            fontWeight={700} 
            mb={3}
            sx={{
              background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            💬 Yorumlar ({comments.length})
          </Typography>
          
          {/* Comment Input */}
          {token && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3, 
              p: 2,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 3,
              border: '1px solid rgba(0, 184, 148, 0.2)',
              backdropFilter: 'blur(5px)'
            }}>
              <Box sx={{ mr: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.2rem'
                }}>
                  {window.localStorage.getItem('userName')?.charAt(0).toUpperCase() || 'U'}
                </Box>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Yorumunuzu yazın..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                sx={{ 
                  mr: 2,
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 184, 148, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 184, 148, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00b894',
                    },
                  }
                }}
              />
              <Button
                variant="contained"
                disabled={commentLoading || !commentText.trim()}
                onClick={async () => {
                  setCommentLoading(true);
                  await fetch('http://localhost:4000/api/comments', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(token ? { Authorization: `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({ text: commentText, exam: selectedExam })
                  });
                  setCommentText('');
                  setCommentLoading(false);
                  // Refetch comments
                  fetch(`http://localhost:4000/api/comments?exam=${selectedExam}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                  })
                    .then(res => res.json())
                    .then(data => setComments(data.comments || []))
                    .catch(() => setComments([]));
                }}
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
                Gönder
              </Button>
            </Box>
          )}
          
          {/* Comments List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {comments.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                color: '#666'
              }}>
                <Typography>Henüz yorum yapılmamış.</Typography>
              </Box>
            ) : (
              comments.map((c, i) => (
                <Box 
                  key={c.id || i} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 3,
                    border: '1px solid rgba(0, 184, 148, 0.1)',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 184, 148, 0.15)',
                    }
                  }}
                >
                  <Box sx={{ mr: 2 }}>
                    {c.user?.profilePhoto ? (
                      <img
                        src={`/uploads/profile-photos/${c.user.profilePhoto}`}
                        alt="profile"
                        style={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          border: '2px solid #00b894'
                        }}
                      />
                    ) : (
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.2rem'
                      }}>
                        {c.user?.name?.charAt(0).toUpperCase() || 'A'}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography fontWeight={600} color="#00b894">
                        {c.user?.name || 'Anonim'}
                      </Typography>
                      <Typography fontSize="0.8rem" color="#666">
                        {c.createdAt ? new Date(c.createdAt).toLocaleString('tr-TR') : ''}
                      </Typography>
                    </Box>
                    <Typography color="#2c3e50" lineHeight={1.5}>
                      {c.text}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
          
          {/* Login Prompt */}
          {!token && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                href="/login"
                sx={{
                  background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00a085 0%, #00b8b3 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 184, 148, 0.3)',
                  }
                }}
              >
                Yorum yapmak için giriş yapın
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Rankings;
