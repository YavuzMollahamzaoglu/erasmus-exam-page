import React, { useEffect, useMemo, useState } from 'react';
import setMetaTags from '../utils/seo';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';
import TopicPreview from '../components/TopicPreview';
import TopicPreviewDialog from '../components/TopicPreviewDialog';

// Default images (place your provided images under public/assets with these names)
const DEFAULT_IMG = {
  genel: '/assets/genel-ingilizce.jpg',
  erasmus: '/assets/erasmus-exam.jpg',
  uni: '/assets/university-prep.jpg',
};

// Fallback images (kept local to avoid large external requests)
// Drop your own files into public/assets with these exact names or update the paths here.
const FALLBACK_IMG = {
  genel: '/assets/genel-ingilizce.jpg',
  erasmus: '/assets/erasmus-exam.jpg',
  uni: '/assets/university-prep.jpg',
};

// Normalize TR text and map test names to default images
const normalizeTR = (s: string) =>
  s
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

// Fix common Turkish diacritic issues in titles coming from DB (e.g., Ingilizce -> İngilizce, Universite -> Üniversite, Sinavi -> Sınavı)
const fixTurkish = (title: string) => {
  let t = title;
  t = t.replace(/genel\s+ingilizce/gi, 'Genel İngilizce');
  t = t.replace(/ingilizce/gi, 'İngilizce');
  t = t.replace(/universite/gi, 'Üniversite');
  t = t.replace(/hazirlik/gi, 'Hazırlık');
  t = t.replace(/sinavi/gi, 'Sınavı');
  // Ensure title-case for the whole string (basic)
  t = t
    .split(/\s+/)
    .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
    .join(' ');
  return t.trim();
};

const getCardImage = (name: string, fallback: string) => {
  const n = normalizeTR(name);
  if (n.includes('genel ingilizce')) return DEFAULT_IMG.genel;
  if (n.includes('erasmus')) return DEFAULT_IMG.erasmus;
  if (n.includes('universite')) return DEFAULT_IMG.uni; // üniversite -> universite after normalize
  return fallback;
};


// Type for test objects
type TestType = {
  id: number | string;
  name: string;
  description: string;
  img: string;
  isDynamic?: boolean;
};


// Hardcoded test data grouped by category and type (A1/A2/B1/B2, 3 sınav türü)
const testData: {
  [key: string]: {
    [key: string]: TestType[];
  };
} = {
  A1: {
    'Erasmus Sınavı 2': [
      {
        id: 'a1-erasmus-2',
        name: 'Erasmus Sınavı 2',
        description: 'A1 seviyesinde Erasmus Sınavı 2 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      },
    ],
    'Erasmus Sınavı 1': [
      {
        id: 'dynamic-a1',
        name: 'Erasmus Sınavı 1',
        description: 'A1 seviyesinde Erasmus Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isDynamic: true,
      },
    ],
    'Genel İngilizce Sınavı 2': [
      {
        id: 'a1-genel-2',
        name: 'Genel İngilizce Sınavı 2',
        description: 'A1 seviyesinde Genel İngilizce Sınavı 2 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Üniversite Hazırlık Sınavı 1': [
      {
        id: 'a1-uni',
        name: 'Üniversite Hazırlık Sınavı 1',
        description: 'A1 seviyesinde Üniversite Hazırlık Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      },
    ],
  },
  A2: {
    'Erasmus Sınavı 2': [
      {
        id: 'a2-erasmus-2',
        name: 'Erasmus Sınavı 2',
        description: 'A2 seviyesinde Erasmus Sınavı 2 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      },
    ],
    'Erasmus Sınavı 1': [
      {
        id: 'dynamic',
        name: 'Erasmus Sınavı 1',
        description: 'A2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isDynamic: true,
      },
    ],
    'Genel İngilizce Sınavı 2': [
      {
        id: 'a2-genel-2',
        name: 'Genel İngilizce Sınavı 2',
        description: 'A2 seviyesinde Genel İngilizce Sınavı 2 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Üniversite Hazırlık Sınavı 1': [
      {
        id: 'a2-uni',
        name: 'Üniversite Hazırlık Sınavı 1',
        description: 'A2 seviyesinde Üniversite Hazırlık Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      },
    ],
  },
  B1: {
    'Erasmus Sınavı 2': [
      {
        id: 'b1-erasmus-2',
        name: 'Erasmus Sınavı 2',
        description: 'B1 seviyesinde Erasmus Sınavı 2 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1523246190605-794f60787378',
      },
    ],
    'Genel İngilizce Sınavı 2': [
      {
        id: 'b1-genel-2',
        name: 'Genel İngilizce Sınavı 2',
        description: 'B1 seviyesinde Genel İngilizce Sınavı 2 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Erasmus Sınavı 1': [
      {
        id: 'dynamic-b1',
        name: 'Erasmus Sınavı 1',
        description: 'B1 Testlerine Erasmus Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isDynamic: true,
      },
    ],
    'Genel İngilizce 1': [
      {
        id: 'b1-genel',
        name: 'Genel İngilizce 1',
        description: 'B1 seviyesinde Genel İngilizce 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Üniversite Hazırlık Sınavı 1': [
      {
        id: 'b1-uni',
        name: 'Üniversite Hazırlık Sınavı 1',
        description: 'B1 seviyesinde Üniversite Hazırlık Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      },
    ],
  },
  B2: {
    'Genel İngilizce Sınavı 2': [
      {
        id: 'b2-genel-2',
        name: 'Genel İngilizce Sınavı 2',
        description: 'B2 seviyesinde Genel İngilizce Sınavı 2 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Erasmus Sınavı 2': [
      {
        id: 'b2-erasmus-2',
        name: 'Erasmus Sınavı 2',
        description: 'B2 seviyesinde Erasmus Sınavı 2 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      },
    ],
    'Erasmus Sınavı 1': [
      {
        id: 'dynamic-b2',
        name: 'Erasmus Sınavı 1',
        description: 'B2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isDynamic: true,
      },
    ],
    'Genel İngilizce 1': [
      {
        id: 'b2-genel',
        name: 'Genel İngilizce 1',
        description: 'B2 seviyesinde Genel İngilizce 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      },
    ],
    'Üniversite Hazırlık Sınavı 1': [
      {
        id: 'b2-uni',
        name: 'Üniversite Hazırlık Sınavı 1',
        description: 'B2 seviyesinde Üniversite Hazırlık Sınavı 1 soruları için tıklayın.',
        img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      },
    ],
  },
};

const categoryTitles = {
  A1: 'A1 Testleri',
  A2: 'A2 Testleri',
  B1: 'B1 Testleri',
  B2: 'B2 Testleri',
};

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [serverOnline, setServerOnline] = useState(true);
  const [checking, setChecking] = useState(false);
  const [preview, setPreview] = useState<{ open: boolean; category?: string; series?: string; seriesId?: string }>(() => ({ open: false }));
  const [seriesList, setSeriesList] = useState<Array<{ id: string; name: string }>>([]);
  const [createdA2Genel2, setCreatedA2Genel2] = useState(false);
  const [createdA1Erasmus2, setCreatedA1Erasmus2] = useState(false);
  const [createdA2Erasmus2, setCreatedA2Erasmus2] = useState(false);
  const [createdB1Erasmus2, setCreatedB1Erasmus2] = useState(false);
  const [createdB2Erasmus2, setCreatedB2Erasmus2] = useState(false);
  const [createdB1Genel2, setCreatedB1Genel2] = useState(false);
  const [createdB2Genel2, setCreatedB2Genel2] = useState(false);

  // Find a QuestionSeries by combining level (categoryKey) and test name, return its id
  const resolveSeriesId = async (categoryKey: string, testName: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/api/series`, { cache: 'no-store' });
      if (!res.ok) return null;
      const list: Array<{ id: string; name: string }> = await res.json();
      const norm = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const target = norm(`${categoryKey} ${testName}`);
      // Prefer startsWith match, else contains
      const exact = list.find(s => norm(s.name).startsWith(target));
      if (exact) return exact.id;
      const contains = list.find(s => norm(s.name).includes(target));
      return contains ? contains.id : null;
    } catch {
      return null;
    }
  };

  // Try to find seriesId locally from already-fetched seriesList
  const findSeriesIdLocal = (categoryKey: string, testName: string): string | null => {
    if (!seriesList.length) return null;
    const norm = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const target = norm(`${categoryKey} ${testName}`);
    const exact = seriesList.find(s => norm(s.name).startsWith(target));
    if (exact) return exact.id;
    const contains = seriesList.find(s => norm(s.name).includes(target));
    return contains ? contains.id : null;
  };

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch(`${API_URL}/health`, { cache: 'no-store' });
      setServerOnline(res.ok);
    } catch (e) {
      setServerOnline(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    setMetaTags({
      title: 'Kategoriler — Sınav Türlerine Göre Alıştırmalar',
      description: 'Erasmus ve üniversite hazırlığı için kategori bazlı sınavlar ve alıştırmalar. Dilbilgisi ve kelime pratiğinizi kategoriye göre geliştirin.',
      keywords: 'sınav kategorileri, erasmus sınavları, ingilizce pratik kategori',
      canonical: '/categories',
      ogImage: '/social-preview.svg'
    });
    checkHealth();
  }, []);

  // Ensure a series exists on the backend; if missing, create and return its id
  const ensureSeriesId = async (categoryKey: string, testName: string): Promise<string | null> => {
    // Prefer existing in local state first
    const local = findSeriesIdLocal(categoryKey, testName);
    if (local) return local;
    // Try resolving from backend list
    const resolved = await resolveSeriesId(categoryKey, testName);
    if (resolved) return resolved;
    // Create new series
    try {
      const name = `${categoryKey} ${testName}`;
      const res = await fetch(`${API_URL}/api/series`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) return null;
      const created: { id: string; name: string } = await res.json();
      setSeriesList((prev) => [...prev, created]);
      return created.id;
    } catch {
      return null;
    }
  };

  // Fetch QuestionSeries list to bind cards to real series IDs
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await fetch(`${API_URL}/api/series`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setSeriesList(data);
      } catch {}
    };
    fetchSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dynamicData = useMemo(() => {
    if (!seriesList.length) return null;
    const byLevel: Record<string, Record<string, TestType[]>> = { A1: {}, A2: {}, B1: {}, B2: {} };
    const ensure = (lvl: string, key: string) => (byLevel[lvl][key] = byLevel[lvl][key] || []);
    const norm = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const seen = new Set<string>(); // dedupe per level by display name
    const typeFrom = (name: string) => {
      const n = norm(name);
      if (n.includes('erasmus')) return 'Erasmus Sınavı 1';
      if (n.includes('universite') || n.includes('hazirlik')) return 'Üniversite Hazırlık Sınavı 1';
      if (n.includes('genel ingilizce')) return 'Genel İngilizce 1';
      return 'Diğer';
    };
    for (const s of seriesList) {
      const m = s.name.match(/^(A1|A2|B1|B2)\b/i);
      if (!m) continue;
      const lvl = m[0].toUpperCase();
      const key = typeFrom(s.name);
      const displayRaw = s.name.replace(/^\s*(A1|A2|B1|B2)\s*/i, '').trim() || key;
      const display = fixTurkish(displayRaw);
      // Skip rendering of 'Genel İngilizce 1' cards as requested
      if (display.trim().toLocaleLowerCase('tr-TR') === 'genel ingilizce 1') continue;
      // Dedupe by (level, display)
      const dedupeKey = `${lvl}:${norm(display.replace(/\s+/g, ' ').trim())}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      ensure(lvl, key).push({
        id: s.id,
        name: display,
        description: `${lvl} seviyesinde ${display} soruları için tıklayın.`,
        img: getCardImage(key, DEFAULT_IMG.erasmus),
      });
    }
    // Ensure only one Erasmus card per level (prefer 'Sınavı 2' if present)
    const enforceSingleErasmus = (lvl: 'A1' | 'A2' | 'B1' | 'B2') => {
      const types = byLevel[lvl];
      if (!types) return;
      const candidates: Array<{ key: string; idx: number; test: TestType }> = [];
      Object.entries(types).forEach(([k, arr]) => {
        arr.forEach((t, i) => {
          const n = norm(String(t.name));
          if (n.includes('erasmus') && n.includes('sinavi')) candidates.push({ key: k, idx: i, test: t });
        });
      });
      if (candidates.length <= 1) return;
      const preferred = candidates.find(c => norm(String(c.test.name)).includes('sinavi 2')) || candidates[0];
      candidates.forEach(c => {
        if (c !== preferred) {
          types[c.key] = types[c.key].filter((_, i) => i !== c.idx);
        }
      });
    };
    enforceSingleErasmus('A1');
    enforceSingleErasmus('A2');
    enforceSingleErasmus('B1');
    enforceSingleErasmus('B2');
    return byLevel;
  }, [seriesList]);

  // Ensure 'A2 Genel İngilizce Sınavı 2' exists so its card appears even in dynamic mode
  useEffect(() => {
    const allowAuto = String(process.env.REACT_APP_ALLOW_AUTO_SERIES_CREATE || '').toLowerCase();
    if (allowAuto !== '1' && allowAuto !== 'true') return; // auto-creates disabled by default
    const run = async () => {
      if (createdA2Genel2) return;
      const targetName = 'A2 Genel İngilizce Sınavı 2';
      const normalizeName = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
      const exists = seriesList.some(s => normalizeName(s.name) === normalizeName(targetName));
      if (exists) { setCreatedA2Genel2(true); return; }
      try {
        const res = await fetch(`${API_URL}/api/series`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: targetName })
        });
        if (res.ok) {
          const created = await res.json();
          setSeriesList(prev => [...prev, created]);
          setCreatedA2Genel2(true);
        }
      } catch {
        // ignore; user can still create on first click via ensureSeriesId
      }
    };
    if (seriesList) run();
  }, [seriesList, API_URL, createdA2Genel2]);

  // Ensure 'A1 Erasmus Sınavı 2'
  useEffect(() => {
    const allowAuto = String(process.env.REACT_APP_ALLOW_AUTO_SERIES_CREATE || '').toLowerCase();
    if (allowAuto !== '1' && allowAuto !== 'true') return;
    const run = async () => {
      if (createdA1Erasmus2) return;
      const targetName = 'A1 Erasmus Sınavı 2';
      const normalizeName = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
      const exists = seriesList.some(s => normalizeName(s.name) === normalizeName(targetName));
      if (exists) { setCreatedA1Erasmus2(true); return; }
      try {
        const res = await fetch(`${API_URL}/api/series`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: targetName })
        });
        if (res.ok) {
          const created = await res.json();
          setSeriesList(prev => [...prev, created]);
          setCreatedA1Erasmus2(true);
        }
      } catch {}
    };
    if (seriesList) run();
  }, [seriesList, API_URL, createdA1Erasmus2]);

  // Ensure 'A2 Erasmus Sınavı 2'
  useEffect(() => {
    const allowAuto = String(process.env.REACT_APP_ALLOW_AUTO_SERIES_CREATE || '').toLowerCase();
    if (allowAuto !== '1' && allowAuto !== 'true') return;
    const run = async () => {
      if (createdA2Erasmus2) return;
      const targetName = 'A2 Erasmus Sınavı 2';
      const normalizeName = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
      const exists = seriesList.some(s => normalizeName(s.name) === normalizeName(targetName));
      if (exists) { setCreatedA2Erasmus2(true); return; }
      try {
        const res = await fetch(`${API_URL}/api/series`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: targetName })
        });
        if (res.ok) {
          const created = await res.json();
          setSeriesList(prev => [...prev, created]);
          setCreatedA2Erasmus2(true);
        }
      } catch {}
    };
    if (seriesList) run();
  }, [seriesList, API_URL, createdA2Erasmus2]);

  // Ensure 'B1 Erasmus Sınavı 2'
  useEffect(() => {
    const allowAuto = String(process.env.REACT_APP_ALLOW_AUTO_SERIES_CREATE || '').toLowerCase();
    if (allowAuto !== '1' && allowAuto !== 'true') return;
    const run = async () => {
      if (createdB1Erasmus2) return;
      const targetName = 'B1 Erasmus Sınavı 2';
      const normalizeName = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
      const exists = seriesList.some(s => normalizeName(s.name) === normalizeName(targetName));
      if (exists) { setCreatedB1Erasmus2(true); return; }
      try {
        const res = await fetch(`${API_URL}/api/series`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: targetName })
        });
        if (res.ok) {
          const created = await res.json();
          setSeriesList(prev => [...prev, created]);
          setCreatedB1Erasmus2(true);
        }
      } catch {}
    };
    if (seriesList) run();
  }, [seriesList, API_URL, createdB1Erasmus2]);

  // Ensure 'B2 Erasmus Sınavı 2'
  useEffect(() => {
    const allowAuto = String(process.env.REACT_APP_ALLOW_AUTO_SERIES_CREATE || '').toLowerCase();
    if (allowAuto !== '1' && allowAuto !== 'true') return;
    const run = async () => {
      if (createdB2Erasmus2) return;
      const targetName = 'B2 Erasmus Sınavı 2';
      const normalizeName = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
      const exists = seriesList.some(s => normalizeName(s.name) === normalizeName(targetName));
      if (exists) { setCreatedB2Erasmus2(true); return; }
      try {
        const res = await fetch(`${API_URL}/api/series`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: targetName })
        });
        if (res.ok) {
          const created = await res.json();
          setSeriesList(prev => [...prev, created]);
          setCreatedB2Erasmus2(true);
        }
      } catch {}
    };
    if (seriesList) run();
  }, [seriesList, API_URL, createdB2Erasmus2]);

  // Ensure 'B1 Genel İngilizce Sınavı 2'
  useEffect(() => {
    const allowAuto = String(process.env.REACT_APP_ALLOW_AUTO_SERIES_CREATE || '').toLowerCase();
    if (allowAuto !== '1' && allowAuto !== 'true') return;
    const run = async () => {
      if (createdB1Genel2) return;
      const targetName = 'B1 Genel İngilizce Sınavı 2';
      const normalizeName = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
      const exists = seriesList.some(s => normalizeName(s.name) === normalizeName(targetName));
      if (exists) { setCreatedB1Genel2(true); return; }
      try {
        const res = await fetch(`${API_URL}/api/series`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: targetName })
        });
        if (res.ok) {
          const created = await res.json();
          setSeriesList(prev => [...prev, created]);
          setCreatedB1Genel2(true);
        }
      } catch {}
    };
    if (seriesList) run();
  }, [seriesList, API_URL, createdB1Genel2]);

  // Ensure 'B2 Genel İngilizce Sınavı 2'
  useEffect(() => {
    const allowAuto = String(process.env.REACT_APP_ALLOW_AUTO_SERIES_CREATE || '').toLowerCase();
    if (allowAuto !== '1' && allowAuto !== 'true') return;
    const run = async () => {
      if (createdB2Genel2) return;
      const targetName = 'B2 Genel İngilizce Sınavı 2';
      const normalizeName = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
      const exists = seriesList.some(s => normalizeName(s.name) === normalizeName(targetName));
      if (exists) { setCreatedB2Genel2(true); return; }
      try {
        const res = await fetch(`${API_URL}/api/series`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: targetName })
        });
        if (res.ok) {
          const created = await res.json();
          setSeriesList(prev => [...prev, created]);
          setCreatedB2Genel2(true);
        }
      } catch {}
    };
    if (seriesList) run();
  }, [seriesList, API_URL, createdB2Genel2]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#b2dfdb',
      px: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      pb: { xs: 12, md: 16 },
      pt: 0
    }}>
      {/* Server offline banner */}
      {!serverOnline && (
        <Box sx={{ bgcolor: '#ffebee', color: '#c62828', p: 2, borderRadius: 2, mt: 2, width: '100%', maxWidth: 900 }}>
          <Typography fontWeight={700}>Sunucu çevrimdışı</Typography>
          <Typography fontSize={14}>Lütfen backend'i başlatın ve tekrar deneyin.</Typography>
          <Box sx={{ mt: 1 }}>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={checkHealth}>
              {checking ? 'Kontrol ediliyor...' : 'Tekrar Dene'}
            </span>
          </Box>
        </Box>
      )}

      <Paper
        elevation={6}
        sx={{
          maxWidth: 1200,
          width: '100%',
          borderRadius: 4,
          overflow: 'visible',
          mt: { xs: 1, md: '15px' },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Gradient header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
          color: '#fff',
          p: { xs: 3, md: 4 },
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          textAlign: 'center',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            zIndex: 0
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1, overflow: 'visible' }}>
            <Typography
              variant="h3"
              fontWeight={700}
              mb={1}
              sx={{
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                fontSize: { xs: '2rem', md: '2.5rem' },
                position: 'relative',
                left: { xs: '-3px', md: '-3px' },
                ml: { xs: '-3px', md: '-3px' },
                overflow: 'visible'
              }}
            >
              Sınav Kategorileri
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>Seviyene ve kategorine uygun testi seç</Typography>

            {/* Bilgilendirme metni */}
            <Typography variant="body1" sx={{
              opacity: 1,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              lineHeight: 1.7,
              maxWidth: 900,
              mx: 'auto',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              mt: 2
            }}>
              Bazı testlerde 4, bazılarında 5 seçenekli sorular bulunabilir ve bu durum üniversite sınavlarındaki çeşitliliği yansıtmaktadır.
              Genel İngilizce testleri aynı zamanda akademik İngilizce sınavlarına uygun içerik sunar ve sorular genel olarak kelime bilgisi
              ile gramer konularını ölçmektedir. Sınavların kendi seviyesinde zorluk dereceleri değişmektedir. Her testten önce ön izlemeyi
              inceleyerek nelerle karşılaşacağınız hakkında bilgi alabilirsiniz.
            </Typography>
          </Box>
        </Box>

        {/* Inner content padding wrapper */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          {Object.entries((dynamicData || testData)).map(([categoryKey, types]) => (
            <Box key={categoryKey} sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={800} mb={2} sx={{ color: '#00695c' }}>
                {categoryTitles[categoryKey as keyof typeof categoryTitles]}
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 3
              }}>
                {Object.entries(types)
                  .sort(([a], [b]) => {
                    // Sıralama: Genel İngilizce -> Üniversite Hazırlık -> Erasmus 1 -> Erasmus 2
                    const order = [
                      'Genel İngilizce Sınavı 1',
                      'Genel İngilizce Sınavı 2',
                      'Üniversite Hazırlık Sınavı 1',
                      'Erasmus Sınavı 1',
                      'Erasmus Sınavı 2',
                    ];
                    const idxA = order.findIndex(t => a.includes(t));
                    const idxB = order.findIndex(t => b.includes(t));
                    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
                  })
                  .map(([typeKey, tests]) => (
                    <React.Fragment key={typeKey}>
                      {tests.map((test: TestType) => {
                      // If we have real series from backend, hide dynamic placeholders
                      if (dynamicData && test.isDynamic) return null;

                      // When no backend series yet, render dynamic cards
                      if (!dynamicData && test.isDynamic) {
                        if (test.id === 'dynamic') return (
                          <DynamicA2Card key={String(test.id)} serverOnline={serverOnline} onCheck={checkHealth} checking={checking} onPreview={(cat, ser)=> setPreview({ open: true, category: cat, series: ser })} />
                        );
                        if (test.id === 'dynamic-a1') return (
                          <DynamicA1Card key={String(test.id)} serverOnline={serverOnline} onCheck={checkHealth} checking={checking} onPreview={(cat, ser)=> setPreview({ open: true, category: cat, series: ser })} />
                        );
                        if (test.id === 'dynamic-b1') return (
                          <DynamicB1Card key={String(test.id)} serverOnline={serverOnline} onCheck={checkHealth} checking={checking} onPreview={(cat, ser)=> setPreview({ open: true, category: cat, series: ser })} />
                        );
                        if (test.id === 'dynamic-b2') return (
                          <DynamicB2Card key={String(test.id)} serverOnline={serverOnline} onCheck={checkHealth} checking={checking} onPreview={(cat, ser)=> setPreview({ open: true, category: cat, series: ser })} />
                        );
                        return null;
                      }

                      // Otherwise render a normal series-bound card (test.id is seriesId when dynamicData exists)
                      return (
                        <Box
                          key={String(test.id)}
                          sx={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid rgba(0, 184, 148, 0.2)',
                            borderRadius: 3,
                            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                            p: 2.5,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': { boxShadow: '0 12px 30px rgba(0,0,0,0.12)', transform: 'translateY(-3px)' },
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`${categoryKey} ${test.name} kartı, tıklayın`}
                          onClick={async () => {
                            if (dynamicData) {
                              navigate(`/exam/${test.id}`);
                            } else {
                              // Ensure a real series exists, create if needed
                              const sid = await ensureSeriesId(categoryKey, test.name);
                              if (sid) navigate(`/exam/${sid}`);
                              else {
                                const fallback = await resolveSeriesId(categoryKey, test.name);
                                navigate(`/exam/${fallback || test.id}`);
                              }
                            }
                          }}
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (dynamicData) {
                                navigate(`/exam/${test.id}`);
                              } else {
                                const sid = await resolveSeriesId(categoryKey, test.name);
                                navigate(`/exam/${sid || test.id}`);
                              }
                            }
                          }}
                        >
                          <Box
                            component="img"
                            src={getCardImage(test.name as string, (test as any).img)}
                            alt={test.name as string}
                            loading="lazy"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              const n = normalizeTR(String(test.name));
                              const target = e.currentTarget as HTMLImageElement;
                              if (n.includes('genel ingilizce')) target.src = FALLBACK_IMG.genel;
                              else if (n.includes('erasmus')) target.src = FALLBACK_IMG.erasmus;
                              else if (n.includes('universite')) target.src = FALLBACK_IMG.uni;
                              else target.src = (test as any).img;
                              target.onerror = null;
                            }}
                            sx={{ width: '100%', height: { xs: 160, sm: 180 }, objectFit: 'cover', objectPosition: '50% 40%', borderRadius: '12px', mb: 1.25 }}
                          />
                          <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">{String(test.name)}</Typography>
                          <Typography fontSize={14} color="#455a64">{(test as any).description}</Typography>
                          {/* Topic preview (AI/heuristic) */}
                          <TopicPreview 
                            category={dynamicData ? undefined : categoryKey}
                            series={dynamicData ? undefined : String(test.name).replace(/\s*\d+$/, '')}
                            seriesId={dynamicData ? String(test.id) : (findSeriesIdLocal(categoryKey, String(test.name)) || undefined)}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={async (e) => { 
                                e.stopPropagation(); 
                                if (dynamicData) {
                                  setPreview({ open: true, seriesId: String(test.id) } as any);
                                } else {
                                  // Create series if missing so preview can analyze
                                  const sid = await ensureSeriesId(categoryKey, String(test.name));
                                  if (sid) setPreview({ open: true, seriesId: sid } as any);
                                  else setPreview({ open: true, category: categoryKey, series: String(test.name).replace(/\s*\d+$/, '') });
                                }
                              }}
                              sx={{ textTransform: 'none', borderColor: '#00b894', color: '#00b894', '&:hover': { borderColor: '#00cec9', background: 'rgba(0,206,201,0.08)' } }}
                            >
                              Ön İzleme
                            </Button>
                          </Box>
                        </Box>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
  <TopicPreviewDialog open={preview.open} onClose={() => setPreview({ open: false })} category={preview.category} series={preview.series} seriesId={preview.seriesId} />
    </Box>
  );
};

// Dynamic card component for A1 Erasmus Sınavı 1
const DynamicA1Card: React.FC<{ serverOnline: boolean; onCheck: () => void; checking: boolean; onPreview?: (category: string, series: string) => void; }> = ({ serverOnline, onCheck, checking, onPreview }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!serverOnline) {
      await onCheck();
      if (!serverOnline) {
        alert(checking ? 'Sunucu durumu kontrol ediliyor...' : 'Sunucu kapalı. Lütfen backend\'i başlatın.');
        return;
      }
    }
    navigate('/exam/dynamic-a1');
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 184, 148, 0.2)',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
        opacity: serverOnline ? 1 : 0.9,
      }}
      role="button"
      tabIndex={0}
      aria-label={`A1 Erasmus Sınavı 1 kartı, tıklayın`}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
    >
      <Box
        component="img"
        src={DEFAULT_IMG.erasmus}
        alt="Erasmus Sınavı 1"
        loading="lazy"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.currentTarget as HTMLImageElement;
          target.src = FALLBACK_IMG.erasmus;
          target.onerror = null;
        }}
        sx={{ width: '100%', height: { xs: 160, sm: 180 }, objectFit: 'cover', objectPosition: '50% 40%', borderRadius: '12px', mb: 1.25 }}
      />
      <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#455a64">A1 seviyesinde Erasmus Sınavı 1 soruları için tıklayın.</Typography>
      <TopicPreview category="A1" series="Erasmus Sınavı" />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button size="small" variant="outlined" onClick={(e)=>{ e.stopPropagation(); onPreview?.('A1','Erasmus Sınavı'); }} sx={{ textTransform: 'none', borderColor: '#00b894', color: '#00b894', '&:hover': { borderColor: '#00cec9', background: 'rgba(0,206,201,0.08)' } }}>Ön İzleme</Button>
      </Box>
    </Box>
  );
};

// Dynamic card component for A2 Erasmus Sınavı 1
const DynamicA2Card: React.FC<{ serverOnline: boolean; onCheck: () => void; checking: boolean; onPreview?: (category: string, series: string) => void; }> = ({ serverOnline, onCheck, checking, onPreview }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!serverOnline) {
      await onCheck();
      if (!serverOnline) {
        alert(checking ? 'Sunucu durumu kontrol ediliyor...' : 'Sunucu kapalı. Lütfen backend\'i başlatın.');
        return;
      }
    }
    navigate('/exam/dynamic-a2');
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 184, 148, 0.2)',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
        opacity: serverOnline ? 1 : 0.9,
      }}
      role="button"
      tabIndex={0}
      aria-label={`A2 Erasmus Sınavı 1 kartı, tıklayın`}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
    >
      <Box
        component="img"
        src={DEFAULT_IMG.erasmus}
        alt="Erasmus Sınavı 1"
        loading="lazy"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.currentTarget as HTMLImageElement;
          target.src = FALLBACK_IMG.erasmus;
          target.onerror = null;
        }}
        sx={{ width: '100%', height: { xs: 160, sm: 180 }, objectFit: 'cover', objectPosition: '50% 40%', borderRadius: '12px', mb: 1.25 }}
      />
      <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#455a64">A2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.</Typography>
      <TopicPreview category="A2" series="Erasmus Sınavı" />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button size="small" variant="outlined" onClick={(e)=>{ e.stopPropagation(); onPreview?.('A2','Erasmus Sınavı'); }} sx={{ textTransform: 'none', borderColor: '#00b894', color: '#00b894', '&:hover': { borderColor: '#00cec9', background: 'rgba(0,206,201,0.08)' } }}>Ön İzleme</Button>
      </Box>
    </Box>
  );
};

// Dynamic card component for B1 Erasmus Sınavı 1
const DynamicB1Card: React.FC<{ serverOnline: boolean; onCheck: () => void; checking: boolean; onPreview?: (category: string, series: string) => void; }> = ({ serverOnline, onCheck, checking, onPreview }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!serverOnline) {
      await onCheck();
      if (!serverOnline) {
        alert(checking ? 'Sunucu durumu kontrol ediliyor...' : 'Sunucu kapalı. Lütfen backend\'i başlatın.');
        return;
      }
    }
    navigate('/exam/dynamic-b1');
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 184, 148, 0.2)',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
        opacity: serverOnline ? 1 : 0.9,
      }}
      role="button"
      tabIndex={0}
      aria-label={`B1 Erasmus Sınavı 1 kartı, tıklayın`}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
    >
      <Box
        component="img"
        src={DEFAULT_IMG.erasmus}
        alt="Erasmus Sınavı 1"
        loading="lazy"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.currentTarget as HTMLImageElement;
          target.src = FALLBACK_IMG.erasmus;
          target.onerror = null;
        }}
        sx={{ width: '100%', height: { xs: 160, sm: 180 }, objectFit: 'cover', objectPosition: '50% 40%', borderRadius: '12px', mb: 1.25 }}
      />
      <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#455a64">B1 Testlerine Erasmus Sınavı 1 soruları için tıklayın.</Typography>
      <TopicPreview category="B1" series="Erasmus Sınavı" />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button size="small" variant="outlined" onClick={(e)=>{ e.stopPropagation(); onPreview?.('B1','Erasmus Sınavı'); }} sx={{ textTransform: 'none', borderColor: '#00b894', color: '#00b894', '&:hover': { borderColor: '#00cec9', background: 'rgba(0,206,201,0.08)' } }}>Ön İzleme</Button>
      </Box>
    </Box>
  );
};

// Dynamic card component for B2 Erasmus Sınavı 1
const DynamicB2Card: React.FC<{ serverOnline: boolean; onCheck: () => void; checking: boolean; onPreview?: (category: string, series: string) => void; }> = ({ serverOnline, onCheck, checking, onPreview }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!serverOnline) {
      await onCheck();
      if (!serverOnline) {
        alert(checking ? 'Sunucu durumu kontrol ediliyor...' : 'Sunucu kapalı. Lütfen backend\'i başlatın.');
        return;
      }
    }
    navigate('/exam/dynamic-b2');
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 184, 148, 0.2)',
        borderRadius: 3,
        p: 2.5,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' },
        opacity: serverOnline ? 1 : 0.9,
      }}
      role="button"
      tabIndex={0}
      aria-label={`B2 Erasmus Sınavı 1 kartı, tıklayın`}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
    >
      <Box
        component="img"
        src={DEFAULT_IMG.erasmus}
        alt="Erasmus Sınavı 1"
        loading="lazy"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.currentTarget as HTMLImageElement;
          target.src = FALLBACK_IMG.erasmus;
          target.onerror = null;
        }}
        sx={{ width: '100%', height: { xs: 160, sm: 180 }, objectFit: 'cover', objectPosition: '50% 40%', borderRadius: '12px', mb: 1.25 }}
      />
      <Typography fontWeight={700} fontSize={18} mb={0.5} color="#00695c">Erasmus Sınavı 1</Typography>
      <Typography fontSize={14} color="#455a64">B2 Testlerine Erasmus Sınavı 1 soruları için tıklayın.</Typography>
      <TopicPreview category="B2" series="Erasmus Sınavı" />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Button size="small" variant="outlined" onClick={(e)=>{ e.stopPropagation(); onPreview?.('B2','Erasmus Sınavı'); }} sx={{ textTransform: 'none', borderColor: '#00b894', color: '#00b894', '&:hover': { borderColor: '#00cec9', background: 'rgba(0,206,201,0.08)' } }}>Ön İzleme</Button>
      </Box>
    </Box>
  );
};

export default Categories;
