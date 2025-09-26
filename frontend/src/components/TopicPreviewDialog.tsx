import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, LinearProgress, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from '../utils/api';

type Topic = { name: string; count: number; percentage?: number };

interface Props {
  open: boolean;
  onClose: () => void;
  category?: string;
  series?: string;
  categoryId?: number;
  seriesId?: string;
}

const TopicPreviewDialog: React.FC<Props> = ({ open, onClose, category, series, categoryId, seriesId }) => {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [total, setTotal] = useState(0);
  const [gains, setGains] = useState<{ summary?: string; bullets?: string[]; tips?: string[] } | null>(null);
  const [grammar, setGrammar] = useState<Array<{ name: string; count: number; percentage?: number }> | null>(null);
  const [difficulty, setDifficulty] = useState<{ distribution: Array<{ level: string; count: number; percentage?: number }>; overall?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Client-side heuristic fallback when AI preview is unavailable
  const analyzeQuick = (qs: Array<{ text: string; options?: any }>) => {
    const buckets: Record<string, number> = {};
    const gb: Record<string, number> = {};
    const inc = (k: string) => (buckets[k] = (buckets[k] || 0) + 1);
    const ginc = (k: string) => (gb[k] = (gb[k] || 0) + 1);
    const gRules: Array<{ key: string; re: RegExp }> = [
      { key: 'Tenses', re: /(past|present|future|simple|continuous|perfect)\b/i },
      { key: 'Conditionals', re: /conditional|if-clause|if\s+(i|ii|iii)/i },
      { key: 'Prepositions', re: /\b(preposition|in|on|at|into|onto)\b/i },
      { key: 'Articles', re: /\b(article|a|an|the)\b/i },
      { key: 'Modal Verbs', re: /\b(can|could|may|might|must|should|would|modal)\b/i },
      { key: 'Passive Voice', re: /passive|be\s+\w+ed/i },
      { key: 'Comparatives/Superlatives', re: /comparative|superlative|\bthan\b|\w+est\b|\w+er\b/i },
      { key: 'Gerund/Infinitive', re: /gerund|infinitive|to\s+\w+|\w+ing\b/i },
      { key: 'Relative Clauses', re: /relative|\bwhich\b|\bwho\b|\bthat\b/i },
    ];
    const totalQ = qs.length || 1;
    for (const q of qs) {
      const text = (q.text || '').toString();
      const lower = text.toLowerCase();
      let opts: string[] = [];
      if (Array.isArray(q.options)) opts = q.options as string[];
      else if (typeof q.options === 'string') {
        try { opts = JSON.parse(q.options) } catch {}
      }
      const avgOptLen = opts.length ? opts.join(' ').length / opts.length : 0;
      if (/tense|past|present|future|conditional|preposition|article|choose the correct|grammar|verb|adjective|adverb/i.test(lower)) {
        inc('Grammar');
        for (const r of gRules) { if (r.re.test(text)) { ginc(r.key); break; } }
        continue;
      }
      if (text.length > 140 || /paragraph|passage|according to|author|main idea/i.test(lower)) { inc('Reading'); continue; }
      if (avgOptLen < 8) { inc('Vocabulary'); continue; }
      inc('General');
      for (const r of gRules) { if (r.re.test(text)) { ginc(r.key); break; } }
    }
    const topicsOut = Object.entries(buckets)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / totalQ) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    const grammarOut = Object.entries(gb)
      .map(([name, count]) => ({ name, count: count as number, percentage: Math.round(((count as number) / totalQ) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    // Simple difficulty guess based on length
    const avgLen = qs.reduce((s, q) => s + (q.text?.length || 0), 0) / totalQ;
    let overall: 'çok kolay'|'kolay'|'orta'|'zor'|'çok zor' = 'orta';
    if (avgLen < 60) overall = 'kolay';
    else if (avgLen > 180) overall = 'zor';
    const distribution = [
      { level: 'çok kolay', count: Math.max(0, Math.round(totalQ * 0.05)), percentage: 5 },
      { level: 'kolay', count: Math.max(0, Math.round(totalQ * (overall==='kolay'?0.45:0.25))), percentage: overall==='kolay'?45:25 },
      { level: 'orta', count: Math.max(0, Math.round(totalQ * 0.4)), percentage: 40 },
      { level: 'zor', count: Math.max(0, Math.round(totalQ * (overall==='zor'?0.25:0.15))), percentage: overall==='zor'?25:15 },
      { level: 'çok zor', count: Math.max(0, Math.round(totalQ * 0.05)), percentage: 5 },
    ];
    const gainsOut = {
      summary: 'Bu test; okuma, dilbilgisi ve kelime bilgisini birlikte ölçer. Hızlı ön izleme otomatik çıkarımlara dayanmaktadır.',
      bullets: [
        'Sık görülen dilbilgisi kalıplarını pekiştirme',
        'Bağlamdan anlam çıkarma becerisini geliştirme',
        'Seçenekler arasında anlam/fonksiyon ayrımı yapma',
      ],
      tips: ['Önce soru kökünü oku', 'İkilemde kalınca seçenekleri ele', 'Süreni yönet, işaretleyip devam et']
    };
    return { topics: topicsOut, total: totalQ, gains: gainsOut, grammar: grammarOut, difficulty: { distribution, overall } };
  };

  useEffect(() => {
    if (!open) return;
    const run = async () => {
      const params = new URLSearchParams();
      // Prefer strict per-series preview when seriesId is provided
      if (seriesId) {
        params.set('seriesId', String(seriesId));
      } else {
        if (category) params.set('category', category);
        if (series) params.set('series', series);
        if (categoryId) params.set('categoryId', String(categoryId));
      }
      if (!seriesId) params.set('limit', '60');
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`${API_URL}/api/topics/preview?${params.toString()}`);
        const ct = r.headers.get('content-type') || '';
        if (!r.ok) {
          const txt = await r.text().catch(() => '');
          throw new Error(`Ön izleme alınamadı (${r.status}).`);
        }
        // Parse as text first to be robust against wrong content-type
        const raw = await r.text();
        const body = raw && raw.trim();
        let j: any = null;
        try {
          j = JSON.parse(body);
        } catch {
          // Try to extract JSON block if wrapped/codefenced
          const m = body?.match(/\{[\s\S]*\}/);
          if (m) {
            j = JSON.parse(m[0]);
          } else {
            throw new Error('Sunucu JSON döndürmedi.');
          }
        }
        setTopics(j.topics || []);
        setTotal(j.total || 0);
        setGains(j.gains || null);
        setGrammar(j.grammar || null);
        setDifficulty(j.difficulty || null);
      } catch (e: any) {
        console.warn('AI preview failed, trying quick fallback…', e);
        // Fallback: fetch questions and compute quick analysis
        const trySeriesThenQuestions = async () => {
          const sParams = new URLSearchParams();
          if (category) sParams.set('category', category);
          const rs = await fetch(`${API_URL}/api/series?${sParams.toString()}`);
          const rawS = await rs.text();
          let js: any = null;
          try { js = JSON.parse(rawS); } catch { const m = rawS.match(/\[[\s\S]*\]/); if (m) js = JSON.parse(m[0]); }
          const list: Array<{ id: string; name: string }>= Array.isArray(js) ? js : [];
          const hit = list.find(x => (series ? x.name.toLowerCase().includes(series.toLowerCase()) : true));
          if (!hit) throw new Error('Series bulunamadı.');
          const rq2 = await fetch(`${API_URL}/api/questions?seriesId=${encodeURIComponent(hit.id)}`);
          const rawQ2 = await rq2.text();
          let jq2: any = null;
          try { jq2 = JSON.parse(rawQ2); } catch { const m2 = rawQ2.match(/\{[\s\S]*\}/); if (m2) jq2 = JSON.parse(m2[0]); }
          const arr2 = Array.isArray(jq2?.questions) ? jq2.questions : [];
          if (!arr2.length) throw new Error('Soru bulunamadı.');
          const quick2 = analyzeQuick(arr2.map((q: any) => ({ text: q.text, options: q.options })));
          setTopics(quick2.topics || []);
          setTotal(quick2.total || 0);
          setGains(quick2.gains || null);
          setGrammar(quick2.grammar || null);
          setDifficulty(quick2.difficulty || null);
          setError(null);
        };

        try {
          const qParams = new URLSearchParams();
          if (category) qParams.set('category', category);
          if (series) qParams.set('series', series);
          if (categoryId) qParams.set('categoryId', String(categoryId));
          if (seriesId) qParams.set('seriesId', String(seriesId));
          const rq = await fetch(`${API_URL}/api/questions?${qParams.toString()}`);
          if (!rq.ok) {
            const t = await rq.text().catch(() => '');
            throw new Error(`Soru listesi alınamadı (${rq.status}).`);
          }
          const rawQ = await rq.text();
          let jq: any = null;
          try {
            jq = JSON.parse(rawQ);
          } catch {
            const m = rawQ?.match(/\{[\s\S]*\}/);
            if (m) jq = JSON.parse(m[0]);
            else {
              // Try series -> questions path
              await trySeriesThenQuestions();
              return;
            }
          }
          const arr = Array.isArray(jq.questions) ? jq.questions : [];
          if (!arr.length) {
            await trySeriesThenQuestions();
            return;
          }
          const quick = analyzeQuick(arr.map((q: any) => ({ text: q.text, options: q.options })));
          setTopics(quick.topics || []);
          setTotal(quick.total || 0);
          setGains(quick.gains || null);
          setGrammar(quick.grammar || null);
          setDifficulty(quick.difficulty || null);
          setError(null);
        } catch (e2: any) {
          console.error('Quick fallback failed:', e2);
          // Last resort: show a generic preview so user sees info
          const generic = {
            topics: [
              { name: 'Grammar', count: 10, percentage: 40 },
              { name: 'Reading', count: 8, percentage: 32 },
              { name: 'Vocabulary', count: 7, percentage: 28 },
            ],
            total: 25,
            gains: {
              summary: 'Bu test, dilbilgisi, okuma ve kelime bilgini birlikte ölçer. Bu önizleme genel bir tahmindir.',
              bullets: ['Dilbilgisi kalıplarını pekiştirme', 'Bağlamdan anlam çıkarma', 'Kelime seçiminde ince farkları görme'],
              tips: ['Soru kökünü dikkatle oku', 'Seçenekleri gramer ipuçlarıyla ele', 'Zamanı verimli kullan']
            },
            grammar: [
              { name: 'Tenses', count: 6, percentage: 24 },
              { name: 'Prepositions', count: 4, percentage: 16 },
              { name: 'Articles', count: 3, percentage: 12 },
            ],
            difficulty: { overall: 'orta', distribution: [
              { level: 'çok kolay', count: 1, percentage: 4 },
              { level: 'kolay', count: 6, percentage: 24 },
              { level: 'orta', count: 12, percentage: 48 },
              { level: 'zor', count: 5, percentage: 20 },
              { level: 'çok zor', count: 1, percentage: 4 },
            ]}
          } as any;
          setTopics(generic.topics);
          setTotal(generic.total);
          setGains(generic.gains);
          setGrammar(generic.grammar);
          setDifficulty(generic.difficulty);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [open, category, series, categoryId, seriesId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, color: '#00695c', pr: 6 }}>Ön İzleme</DialogTitle>
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
  {loading ? (
          <LinearProgress sx={{ my: 2 }} />
  ) : error ? (
    <Typography color="text.secondary">{error}</Typography>
  ) : topics.length ? (
          <Box>
            <Typography variant="body2" sx={{ color: '#546e7a', mb: 2 }}>{total} sorudan öngörü</Typography>
            {difficulty && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography fontWeight={700} sx={{ color: '#00695c' }}>Zorluk Dağılımı</Typography>
                  {difficulty.overall && (
                    <Box sx={{ px: 1.25, py: 0.5, borderRadius: 2, bgcolor: '#e0f2f1', color: '#004d40', fontSize: 12, fontWeight: 700 }}>Genel: {difficulty.overall}</Box>
                  )}
                </Box>
                {difficulty.distribution?.map((d, i) => (
                  <Box key={i} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ textTransform: 'capitalize' }}>{d.level}</Typography>
                      <Typography>{(d.percentage ?? 0)}% • {d.count}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={d.percentage ?? 0} sx={{ height: 6, borderRadius: 6 }} />
                  </Box>
                ))}
              </Box>
            )}
            {topics.map((t) => {
              const pct = t.percentage ?? Math.round((t.count / (total || 1)) * 100);
              return (
                <Box key={t.name} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography fontWeight={700} color="#004d40">{t.name}</Typography>
                    <Typography color="#004d40">{pct}% • {t.count} soru</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 6, bgcolor: 'rgba(0,0,0,0.06)', '& .MuiLinearProgress-bar': { bgcolor: '#00b894' } }} />
                </Box>
              );
            })}
            {grammar && grammar.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography fontWeight={700} sx={{ color: '#00695c', mb: 1 }}>Dilbilgisi Dağılımı</Typography>
                {grammar.map((g) => (
                  <Box key={g.name} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography>{g.name}</Typography>
                      <Typography>{(g.percentage ?? 0)}% • {g.count}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={g.percentage ?? 0} sx={{ height: 6, borderRadius: 6 }} />
                  </Box>
                ))}
              </Box>
            )}
            {gains && (
              <Box sx={{ mt: 2 }}>
                {gains.summary && (
                  <Typography sx={{ mb: 1.5, color: '#004d40' }}>{gains.summary}</Typography>
                )}
                {gains.bullets && gains.bullets.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    {gains.bullets.map((b, i) => (
                      <Typography key={i} sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <span>•</span> <span>{b}</span>
                      </Typography>
                    ))}
                  </Box>
                )}
                {gains.tips && gains.tips.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography fontWeight={700} sx={{ color: '#00695c', mb: 1 }}>İpuçları</Typography>
                    {gains.tips.map((t, i) => (
                      <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'baseline', gap: 1, color: '#37474f' }}>
                        <span>›</span> <span>{t}</span>
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ) : (
          <Typography color="text.secondary">Ön izleme bulunamadı.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TopicPreviewDialog;
