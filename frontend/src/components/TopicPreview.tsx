import React, { useEffect, useState } from 'react';
import { Box, Chip, LinearProgress, Typography, Tooltip } from '@mui/material';
import { API_URL } from '../utils/api';

type Topic = { name: string; count: number; percentage?: number };

interface Props {
  category?: string; // A1, A2, ... or id
  series?: string; // Erasmus, Genel İngilizce ... or id
  categoryId?: number;
  seriesId?: string;
}

const COLORS = ['#00b894', '#0984e3', '#fdcb6e', '#e17055', '#6c5ce7', '#00cec9'];

const TopicPreview: React.FC<Props> = ({ category, series, categoryId, seriesId }) => {
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [grammar, setGrammar] = useState<Topic[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    // If seriesId is known, use only seriesId to prevent general mixing
    if (seriesId) {
      params.set('seriesId', String(seriesId));
    } else {
      if (category) params.set('category', category);
      if (series) params.set('series', series);
      if (categoryId) params.set('categoryId', String(categoryId));
    }
    if (!seriesId) params.set('limit', '60');

  setLoading(true);
  fetch(`${API_URL}/api/topics/preview?${params.toString()}`)
      .then(async (r) => {
        const ct = r.headers.get('content-type') || '';
        if (!r.ok || !ct.includes('application/json')) {
          throw new Error(`status ${r.status}`);
        }
        return r.json();
      })
      .then(json => {
        setTopics(json.topics || []);
    setGrammar(json.grammar || null);
        setTotal(json.total || 0);
        setLoading(false);
      })
      .catch((e) => {
        setError('öngörü alınamadı');
        setLoading(false);
      });
  }, [category, series, categoryId, seriesId]);

  if (loading) {
    return (
      <Box sx={{ mt: 1 }}>
        <LinearProgress sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.06)', '& .MuiLinearProgress-bar': { bgcolor: '#00b894' } }} />
      </Box>
    );
  }
  const useItems: Topic[] = (grammar && grammar.length ? grammar : topics) || [];
  if (error || !useItems.length) return null;

  const trMap: Record<string, string> = {
    'vocabulary': 'Kelime Bilgisi',
    'pronouns': 'Zamirler',
    'prepositions': 'Edatlar',
    'question forms': 'Soru Cümleleri',
    'tenses': 'Zamanlar',
    'conditionals': 'Koşul Cümleleri',
    'articles': 'Tanımlıklar',
    'modal verbs': 'Yardımcı Fiiller',
    'passive voice': 'Edilgen Çatı',
    'comparatives/superlatives': 'Karşılaştırma/Üstünlük',
    'gerund/infinitive': 'Fiilimsi/Yalın Fiil',
    'relative clauses': 'İlgi Cümleleri',
    'phrasal verbs': 'Deyimsel Fiiller',
    'reading': 'Okuma',
    'grammar': 'Dilbilgisi',
    'general': 'Genel',
  };
  const labelTR = (name: string) => {
    const key = name.toLowerCase();
    const tr = trMap[key];
    return tr ? `${name} (${tr})` : name;
  };

  return (
    <Box sx={{ mt: 1.25 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
  {useItems.slice(0, 4).map((t, i) => (
          <Chip key={t.name}
            size="small"
            label={`${labelTR(t.name)} • ${t.percentage ?? Math.round((t.count/(total||1))*100)}% • ${t.count} soru`}
            sx={{ bgcolor: `${COLORS[i % COLORS.length]}22`, color: '#004d40', border: `1px solid ${COLORS[i % COLORS.length]}55` }}
          />
        ))}
      </Box>
      {(() => {
        // Build exact percentage segments by count/total and ensure full 100% fill
        const items = useItems.filter(it => (it.count ?? 0) > 0);
        const segs = items.map((t, i) => ({
          name: t.name,
          count: t.count,
          pct: total > 0 ? (t.count / total) * 100 : 0,
          color: COLORS[i % COLORS.length],
        }));
        const knownCount = segs.reduce((a, s) => a + s.count, 0);
        if (total > knownCount) {
          // Add an explicit remainder segment so the bar never stays colorless
          const otherCount = total - knownCount;
          segs.push({ name: '__other__', count: otherCount, pct: (otherCount / total) * 100, color: '#90a4ae' });
        }
        const sum = segs.reduce((a, s) => a + s.pct, 0);
        if (segs.length && sum !== 100) {
          // Assign floating remainder (or deficit) to the last visible segment
          segs[segs.length - 1].pct += (100 - sum);
        }
        return (
          <Box sx={{ display: 'flex', height: 8, borderRadius: 6, overflow: 'hidden', bgcolor: 'rgba(0,0,0,0.06)' }}>
            {segs.map((s) => {
              const pctRoundedForLabel = Math.round((s.count / (total || 1)) * 100);
              const label = s.name === '__other__' ? `Diğer` : labelTR(s.name);
              return (
                <Tooltip key={s.name} title={`${label}: ${pctRoundedForLabel}% (${s.count})`}>
                  <Box sx={{ width: `${s.pct}%`, bgcolor: s.color }} />
                </Tooltip>
              );
            })}
          </Box>
        );
      })()}
      <Typography variant="caption" sx={{ color: '#546e7a' }}>{total} sorudan öngörü</Typography>
    </Box>
  );
};

export default TopicPreview;
