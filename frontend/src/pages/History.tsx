import React, { useEffect, useMemo, useState } from 'react';
import setMetaTags from '../utils/seo';
import { useLocation } from 'react-router-dom';
import { Box, Paper, Typography, Button, Collapse, Chip, Select, MenuItem, Dialog, DialogTitle, DialogContent, IconButton, FormControl, InputLabel, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const palette = {
  bg: '#b2dfdb',
  card: '#fff',
  accent: '#1976d2',
  correct: '#43a047',
  wrong: '#e53935',
  gray: '#e3eafc',
};


interface HistoryProps {
  token: string;
}

const History: React.FC<HistoryProps> = ({ token }) => {
  // Redirect in effect to keep hooks order intact
  useEffect(() => {
    if (typeof window !== 'undefined' && (!token || !localStorage.getItem('token'))) {
      window.location.href = '/login?session=expired';
    }
  }, [token]);
  const [history, setHistory] = useState<any[]>([]);
  const [allHistory, setAllHistory] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [questionDialog, setQuestionDialog] = useState<{ open: boolean, question: any, idx: number, qIdx: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('desc');
  const [categoryTypeFilter, setCategoryTypeFilter] = useState('all');
  const location = useLocation();

  // Helpers
  function getExamCategoryType(exam: any): 'ERASMUS' | 'GENEL' | 'HAZIRLIK' | null {
    const title = (exam.title || exam.examTitle || '').toString().toLowerCase();
    const catName = (exam.categoryName || exam.category || '').toString().toLowerCase();
    const s = `${title} ${catName}`;
    if (s.includes('erasmus')) return 'ERASMUS';
    if (s.includes('genel') || s.includes('general')) return 'GENEL';
    if (s.includes('hazırlık') || s.includes('hazirlik')) return 'HAZIRLIK';
    return null;
  }

  function matchCategory(exam: any, value: string) {
    if (value === 'all') return true;
    const title = (exam.title || exam.examTitle || '').toString().toUpperCase();
    const cat = (exam.category || exam.categoryName || exam.level || '').toString().toUpperCase();
    return title.includes(value.toUpperCase()) || cat === value.toUpperCase();
  }

  function getDateValue(exam: any): number {
    const d = exam.date || exam.completedAt || exam.createdAt;
    const dt = d ? new Date(d) : null;
    return dt ? dt.getTime() : 0;
  }

  function applyFilters(source: any[]) {
    let list = source;
    // Level (A1/A2/B1/B2)
    if (filter !== 'all') list = list.filter((exam) => matchCategory(exam, filter));
    // Category type (Erasmus/Genel/Hazırlık)
    if (categoryTypeFilter !== 'all') {
      const want = categoryTypeFilter.toUpperCase();
      list = list.filter((exam) => getExamCategoryType(exam) === (want === 'GENEL İNGİLİZCE' ? 'GENEL' : (want as any)));
    }
    // Sort by date
    list = [...list].sort((a, b) => getDateValue(b) - getDateValue(a));
    if (sort === 'asc') list.reverse();
    setHistory(list);
  }

  // Initial load + parse URL filters
  useEffect(() => {
    setMetaTags({
      title: 'Geçmiş — Çözdüğünüz Testler',
      description: 'Daha önce çözdüğünüz sınavların detayları ve istatistikleri. Performansınızı takip edin.',
      keywords: 'geçmiş testler, sınav geçmişi, sınav sonuçları',
      canonical: '/history',
      ogImage: '/social-preview.svg'
    });
    if (!token) return; // defensive: avoid fetching without token
    setLoading(true);
    const params = new URLSearchParams(location.search);
    const qCategoryLegacy = params.get('category');
    const qLevel = params.get('level');
    const qCatType = params.get('cat');
    // Backward compat: category=A1|A2.. used as level; if it's a known type, map accordingly
    if (qLevel) setFilter(qLevel);
    if (qCatType) setCategoryTypeFilter(qCatType);
    if (qCategoryLegacy) {
      const val = qCategoryLegacy.toUpperCase();
      if (['A1', 'A2', 'B1', 'B2'].includes(val)) setFilter(val);
      else if (['ERASMUS', 'HAZIRLIK', 'GENEL', 'GENEL İNGİLİZCE', 'GENEL INGILIZCE'].includes(val)) setCategoryTypeFilter(qCategoryLegacy);
    }
  fetch(`${process.env.REACT_APP_API_URL}/api/history`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
      .then(res => res.json())
      .then(data => {
        const list = data.history || [];
        setAllHistory(list);
        applyFilters(list);
        setLoading(false);
      })
      .catch(() => {
        setAllHistory([]);
        setHistory([]);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-apply filters when controls change or data changes
  useEffect(() => {
    applyFilters(allHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sort, categoryTypeFilter, allHistory]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: palette.bg, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          px: 2 
        }}
      >
        <Typography fontSize={22}>Yükleniyor...</Typography>
      </Box>
    );
  }

  if (allHistory.length === 0) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: palette.bg, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          px: 2 
        }}
      >
        <Typography variant="h5" color={palette.accent} fontWeight={700}>Henüz test çözmediniz!</Typography>
        <Typography color="text.secondary" mt={1}>Çözdüğünüz sınavlar burada listelenecek.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: palette.bg, pt: 0, pb: { xs: 12, md: 16 }, px: { xs: 1, md: 4 }, display: 'flex', flexDirection: 'column' }}>
      <Paper 
        elevation={6} 
        sx={{ 
          width: '100%', 
          maxWidth: 1300, 
          mx: 'auto', 
          p: 0,
          mt: { xs: 1, md: '15px' },
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Merged gradient header like other pages */}
        <Box sx={{
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          p: { xs: 3, md: 5 },
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(4px)'
          }
        }}>
          <Box sx={{ position: 'relative' }}>
            <Typography variant="h4" fontWeight={800} mb={1} sx={{ color: '#fff' }}>Geçmiş Testleriniz</Typography>
            <Typography sx={{ opacity: 0.95, color: '#fff' }}>Daha önce çözdüğünüz testlerin detaylarını burada görebilirsiniz.</Typography>
            {/* Filters in header, styled like Rankings */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)', '&.Mui-focused': { color: 'rgba(255, 255, 255, 0.9)' } }}>Seviye</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Seviye"
                  sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.9)' }, '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.9)' } }}
                >
                  <MenuItem value="all">Tüm Kategoriler</MenuItem>
                  <MenuItem value="A1">A1</MenuItem>
                  <MenuItem value="A2">A2</MenuItem>
                  <MenuItem value="B1">B1</MenuItem>
                  <MenuItem value="B2">B2</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ minWidth: 180 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)', '&.Mui-focused': { color: 'rgba(255, 255, 255, 0.9)' } }}>Kategori</InputLabel>
                <Select
                  value={categoryTypeFilter}
                  onChange={(e) => setCategoryTypeFilter(e.target.value)}
                  label="Kategori"
                  sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.9)' }, '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.9)' } }}
                >
                  <MenuItem value="all">Tümü</MenuItem>
                  <MenuItem value="Erasmus">Erasmus</MenuItem>
                  <MenuItem value="Hazırlık">Hazırlık</MenuItem>
                  <MenuItem value="Genel İngilizce">Genel İngilizce</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ minWidth: 160 }}>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)', '&.Mui-focused': { color: 'rgba(255, 255, 255, 0.9)' } }}>Sıralama</InputLabel>
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  label="Sıralama"
                  sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.9)' }, '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.9)' } }}
                >
                  <MenuItem value="desc">En Yeni</MenuItem>
                  <MenuItem value="asc">En Eski</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* Content wrapper */}
        <Box sx={{ p: { xs: 2, sm: 4, md: 5 } }}>
          {/* No results for current filters */}
          {history.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color={palette.accent} fontWeight={700}>Bu filtrelere uygun kayıt bulunamadı.</Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => { setFilter('all'); setCategoryTypeFilter('all'); }}>
                Filtreleri Temizle
              </Button>
            </Box>
          )}

          {/* Cards grid */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 1280,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: '15px',
            }}
          >
            {history.map((exam, idx) => (
        <Paper
                key={exam.id}
                elevation={4}
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  minWidth: 260,
          p: 3,
                  borderRadius: 3,
                  mb: 2,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: expanded === `card-${idx}` ? '0 12px 30px rgba(0,0,0,0.12)' : '0 6px 20px rgba(0,0,0,0.08)',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 184, 148, 0.2)',
          alignSelf: 'start',
          minHeight: 180,
          position: 'relative',
                }}
              >
              {(() => {
                // Colored number badge at top-right (single badge)
                const lvl = (exam.title || exam.examTitle || '').toString().toUpperCase().match(/\b(A1|A2|B1|B2)\b/);
                const levelIndex = lvl ? (['A1','A2','B1','B2'].indexOf(lvl[1]) + 1) : 1;
                // Normalize difficulty and add robust fallbacks
                const totalAns = (Number(exam.correct || 0) + Number(exam.incorrect || 0)) || 0;
                const ratio = totalAns > 0 ? Number(exam.correct || 0) / totalAns : null;
                let diffRaw = (exam.difficultyOverall || (exam.difficulty || '')).toString().toLowerCase();
                if (!diffRaw) {
                  if (ratio == null) diffRaw = 'orta';
                  else if (ratio >= 0.75) diffRaw = 'kolay';
                  else if (ratio <= 0.4) diffRaw = 'zor';
                  else diffRaw = 'orta';
                }
                // Map: kolay/çok kolay -> yellow, orta -> blue, zor/çok zor -> red
                let bg = '#90caf9'; // default blue for orta
                let fg = '#0d47a1';
                if (diffRaw.includes('kolay')) { bg = '#ffd54f'; fg = '#5d4037'; }
                if (diffRaw.includes('zor')) { bg = '#ef5350'; fg = '#fff'; }
                const titleTxt = `Zorluk: ${diffRaw}`;
                return (
                  <Tooltip title={titleTxt} placement="left">
                    <Box sx={{ position: 'absolute', top: 8, right: 8, width: 36, height: 36, borderRadius: '50%', bgcolor: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', border: '2px solid #fff', zIndex: 2 }}>
                      {levelIndex}
                    </Box>
                  </Tooltip>
                );
              })()}
              {/** Some older records may not have per-question answers saved. */}
              {/** Detect if this record actually has question details we can show. */}
              {(() => {
                /* no render here; used only to keep types happy in JSX scope */
                return null;
              })()}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 1 }}>
                <Typography fontWeight={700} fontSize={18}>{exam.title || exam.examTitle}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%', pr: 6 }}>
                <Typography color="text.secondary" fontSize={15} sx={{ flex: 1 }}>
                  {(() => {
                    let dateObj = null;
                    if (exam.date) dateObj = new Date(exam.date);
                    else if (exam.completedAt) dateObj = new Date(exam.completedAt);
                    if (dateObj) {
                      const dateStr = dateObj.toLocaleDateString('tr-TR');
                      const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
                      return `📅 ${dateStr} - ${timeStr}`;
                    }
                    return '';
                  })()}
                </Typography>
                <Box sx={{ minWidth: 90, display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 0 }}>
                  <Chip
                    label={(() => {
                      const duration = exam.duration || exam.totalDuration;
                      if (!duration) return '⏱ -';
                      if (typeof duration === 'string' && isNaN(Number(duration))) {
                        return `⏱ ${duration}`;
                      }
                      if (!isNaN(Number(duration))) {
                        const min = Math.floor(Number(duration) / 60);
                        const sec = Number(duration) % 60;
                        return `⏱ ${min} dk${sec > 0 ? ' ' + sec + ' sn' : ''}`;
                      }
                      return `⏱ ${duration}`;
                    })()}
                    sx={{ bgcolor: '#e3eafc', color: '#19376D', fontWeight: 700, fontSize: 15 }}
                    size="small"
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Chip label={`✅ ${exam.correct ?? exam.totalCorrectAnswers ?? 0}`} sx={{ bgcolor: palette.correct, color: '#fff' }} />
                <Chip label={`❌ ${exam.incorrect ?? exam.totalIncorrectAnswers ?? 0}`} sx={{ bgcolor: palette.wrong, color: '#fff' }} />
              </Box>
              {(() => {
                const hasDetails = (exam.questions && exam.questions.length > 0) || (exam.answers && exam.answers.length > 0);
                return (
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1, borderRadius: 2, fontWeight: 700 }}
                disabled={!hasDetails}
                onClick={() => {
                  if (!hasDetails) return;
                  setExpanded(expanded === `card-${idx}` ? null : `card-${idx}`);
                }}
              >
                {!hasDetails ? 'Detay Yok' : expanded === `card-${idx}` ? 'Detayı Gizle' : 'Detayları Gör'}
              </Button>
                );
              })()}
              {/* Removed extra message to keep card heights equal in collapsed view */}
              <Collapse in={expanded === `card-${idx}`}> 
                <Box mt={2}>
                  {(() => {
                    const hasDetails = (exam.questions && exam.questions.length > 0) || (exam.answers && exam.answers.length > 0);
                    if (!hasDetails) {
                      return (
                        <Typography mt={1} color="text.secondary" fontSize={13}>
                          Bu test için soru bazlı detay kaydı bulunmuyor (eski kayıt).
                        </Typography>
                      );
                    }
                    return null;
                  })()}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {(exam.questions || exam.answers || []).map((q: any, i: number) => (
                      <Box
                        key={i}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: q.isCorrect ? palette.correct : palette.wrong,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 18,
                          cursor: 'pointer',
                          border: '2px solid #fff',
                          boxShadow: '0 1px 4px #0001',
                          transition: 'transform 0.1s',
                          '&:hover': { transform: 'scale(1.12)' },
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setQuestionDialog({ open: true, question: q, idx, qIdx: i });
                        }}
                      >
                        {i + 1}
                      </Box>
                    ))}
                  </Box>
                  <Dialog
                    open={!!questionDialog && questionDialog.open && questionDialog.idx === idx}
                    onClose={() => setQuestionDialog(null)}
                    maxWidth="sm"
                    fullWidth
                  >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
                      <span>Soru {questionDialog?.qIdx !== undefined ? questionDialog.qIdx + 1 : ''}</span>
                      <IconButton onClick={() => setQuestionDialog(null)} size="small"><CloseIcon /></IconButton>
                    </DialogTitle>
                    <DialogContent>
                      {questionDialog?.question && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          {questionDialog.question.isCorrect
                            ? <CheckCircleIcon sx={{ color: palette.correct }} />
                            : <CancelIcon sx={{ color: palette.wrong }} />}
                          <Typography fontWeight={600}>{questionDialog.question.text || questionDialog.question.questionText}</Typography>
                        </Box>
                      )}
                      {questionDialog?.question && (
                        <>
                          <Typography fontSize={15} color={questionDialog.question.isCorrect ? palette.correct : palette.wrong} mb={1}>
                            Senin cevabın: {questionDialog.question.userAnswer} {questionDialog.question.isCorrect ? '(Doğru)' : '(Yanlış)'}
                          </Typography>
                          {!questionDialog.question.isCorrect && (
                            <Typography fontSize={15} color={palette.accent} mb={1}>
                              Doğru cevap: {questionDialog.question.correctAnswer}
                            </Typography>
                          )}
                          {questionDialog.question.explanation && (
                            <Box mt={2}>
                              <Typography fontWeight={700} fontSize={15} color={palette.accent} mb={0.5}>Açıklama</Typography>
                              <Typography fontSize={15} color="text.secondary">{questionDialog.question.explanation}</Typography>
                            </Box>
                          )}
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </Box>
              </Collapse>
            </Paper>
          ))}
        </Box>
        {/* Close content wrapper */}
        </Box>
       </Paper>
     </Box>
   );
 }

export default History;
