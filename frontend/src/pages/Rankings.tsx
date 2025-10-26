
import React, { useEffect, useState } from 'react';
import setMetaTags from '../utils/seo';
import { Box, Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Helper to check if a string is a single emoji
function isSingleEmoji(str: string) {
  // This regex matches a single emoji (including most common ones)
  return typeof str === 'string' && str.length <= 3 && /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u.test(str);
}

interface Props {
  token: string;
}

const medalIcons = [
  '🥇', // 1st
  '🥈', // 2nd
  '🥉', // 3rd
];

const examOptions = ['A1', 'A2', 'B1', 'B2'];
const typeOptions = ['Erasmus', 'Genel', 'Hazırlık'];

const Rankings: React.FC<Props> = ({ token }) => {
  const [rankings, setRankings] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('A1');
  const [selectedType, setSelectedType] = useState<string>('Erasmus');
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    setMetaTags({
      title: 'Sıralama — En Başarılı Öğrenciler',
      description: 'Öğrencilerin sınav başarılarına göre sıralandığı tablo. Başarıları takip edin ve kendinizi karşılaştırın.',
      keywords: 'sıralama, leaderboard, sınav puanları',
      canonical: '/rankings',
      ogImage: '/social-preview.svg'
    });
    if (!token) return;
    (async () => {
      try {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setMe(data.user || null);
      } catch { setMe(null); }
    })();
  }, [token]);

  // Initialize selectedExam/type from URL query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const exam = params.get('exam');
    const type = params.get('type');
    if (exam && examOptions.includes(exam)) setSelectedExam(exam);
    if (type && typeOptions.includes(type)) setSelectedType(type);
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = `?exam=${selectedExam}&type=${encodeURIComponent(selectedType)}`;
  fetch(`${process.env.REACT_APP_API_URL}/api/rankings${qs}`, {
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
    // Fetch comments for selected exam (type bağımsız bırakıldı)
  fetch(`${process.env.REACT_APP_API_URL}/api/comments?exam=${selectedExam}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => setComments(data.comments || []))
      .catch(() => setComments([]));
  }, [token, selectedExam, selectedType]);

  // Only show top 20
  const topRankings = rankings.slice(0, 20);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#b2dfdb', 
      px: 2, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      pt: 0, 
      pb: { xs: 12, md: 16 } 
    }}>
      <Paper 
        elevation={6} 
        sx={{ 
          maxWidth: 800, 
          width: '100%', 
          borderRadius: 4, 
          overflow: 'hidden', 
          mt: { xs: 1, md: '15px' },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          // Hover removed on main card
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <Box component="span" sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, lineHeight: 1 }}>🏆</Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  fontSize: { xs: '1.6rem', md: '2.3rem' },
                  whiteSpace: { xs: 'nowrap', md: 'normal' }
                }}
              >
                Sıralama Tablosu
              </Typography>
            </Box>
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
            
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', rowGap: 1 }}>
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)', '&.Mui-focused': { color: 'rgba(255, 255, 255, 0.9)' } }}>Seviye</InputLabel>
                <Select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  label="Seviye"
                  sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.9)' }, '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.9)' } }}
                >
                  {examOptions.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ minWidth: 160 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)', '&.Mui-focused': { color: 'rgba(255, 255, 255, 0.9)' } }}>Kategori</InputLabel>
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  label="Kategori"
                  sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.9)' }, '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.9)' } }}
                >
                  {typeOptions.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, overflow: 'hidden' }}>
                      {r.user?.profilePhoto ? (
                        isSingleEmoji(r.user.profilePhoto) ? (
                          <span style={{ fontSize: 32, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #00b894', background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' }}>{r.user.profilePhoto}</span>
                        ) : (
                          <img loading="lazy"
                            src={`${process.env.REACT_APP_API_URL}${String(r.user.profilePhoto).startsWith('/') ? r.user.profilePhoto : '/uploads/profile-photos/' + r.user.profilePhoto}`}
                            alt={r.user?.name ? `${r.user.name} adlı kullanıcının profili` : 'Kullanıcı profil fotoğrafı'}
                            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #00b894', flex: '0 0 auto' }}
                          />
                        )
                      ) : (
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', border: '2px solid #00b894' }}>
                          {(r.user?.name?.[0] || 'U').toUpperCase()}
                        </Box>
                      )}
                      <Typography 
                        fontWeight={idx < 3 ? 700 : 500} 
                        color={idx < 3 ? '#00b894' : '#2c3e50'}
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={r.user?.name || 'İsimsiz'}
                      >
                        {r.user?.name || 'İsimsiz'}
                      </Typography>
                    </Box>
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
                {me?.profilePhoto ? (
                  isSingleEmoji(me.profilePhoto) ? (
                    <span style={{ fontSize: 32, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #00b894', background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' }}>{me.profilePhoto}</span>
                  ) : (
                    <img loading="lazy"
                      src={`${process.env.REACT_APP_API_URL}${me.profilePhoto}?t=${Date.now()}`}
                      alt={me?.name ? `${me.name} adlı kullanıcının profili` : 'Benim profil fotoğrafım'}
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #00b894' }}
                    />
                  )
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
                    {(me?.name?.charAt(0).toUpperCase()) || 'U'}
                  </Box>
                )}
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
                  await fetch(`${process.env.REACT_APP_API_URL}/api/comments`, {
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
                  fetch(`${process.env.REACT_APP_API_URL}/api/comments?exam=${selectedExam}`, {
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
                  <Box sx={{ mr: 2, minWidth: 40, width: 40, height: 40, position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.user?.profilePhoto && typeof c.user.profilePhoto === 'string' ? (
                      isSingleEmoji(c.user.profilePhoto) ? (
                        <span style={{ fontSize: 32, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #00b894', background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' }}>{c.user.profilePhoto}</span>
                      ) : (
                        <img
                          loading="lazy"
                          src={`${process.env.REACT_APP_API_URL}${String(c.user.profilePhoto).startsWith('/') ? c.user.profilePhoto : '/uploads/profile-photos/' + c.user.profilePhoto}?t=${Date.now()}`}
                          alt={c.user?.name ? `${c.user.name} adlı kullanıcının profil fotoğrafı` : 'Kullanıcı profil fotoğrafı'}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #00b894',
                            display: 'block',
                          }}
                          onError={e => {
                            const img = e.target as HTMLImageElement;
                            img.onerror = null;
                            img.style.display = 'none';
                            const fallback = img.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      )
                    ) : null}
                    {/* Fallback avatar, her zaman DOM'da olsun ki onError'da gösterilebilsin */}
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                      display: c.user?.profilePhoto ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      zIndex: 1
                    }}>
                      {(c.user?.name && typeof c.user.name === 'string' && c.user.name.trim().length > 0) ? c.user.name.charAt(0).toUpperCase() : 'A'}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography fontWeight={600} color="#00b894" sx={{
                        display: 'block',
                        '@media (max-width:600px)': {
                          fontSize: '1rem',
                        }
                      }}>
                        {(c.user?.name && typeof c.user.name === 'string' && c.user.name.trim().length > 0) ? c.user.name : 'Anonim'}
                      </Typography>
                      {/* Tarih sadece gün/ay/yıl, mobilde sağ alt köşe */}
                      <Box
                        sx={{
                          ml: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: { xs: 'flex-end', md: 'flex-start' },
                          width: { xs: '100%', md: 'auto' },
                          position: { xs: 'absolute', md: 'static' },
                          right: { xs: 16, md: 'unset' },
                          bottom: { xs: 8, md: 'unset' },
                          mt: { xs: 0.5, md: 0 },
                        }}
                      >
                        <Typography
                          fontSize="0.8rem"
                          color="#666"
                          sx={{
                            display: 'block',
                            '@media (max-width:600px)': {
                              fontSize: '0.85rem',
                            },
                          }}
                        >
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString('tr-TR') : ''}
                        </Typography>
                      </Box>
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
            <Box sx={{ textAlign: 'center', mt: { xs: 2, md: 4 } }}>
              <Button 
                variant="contained" 
                href="/login"
                sx={{
                  background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: { xs: 2, md: 3 },
                  px: { xs: 2.5, md: 4 },
                  py: { xs: 0.9, md: 1.5 },
                  textTransform: 'none',
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
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
