import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Paper, Typography, Breadcrumbs } from '@mui/material';
import MoreLearningLinks from '../components/MoreLearningLinks';
import setMetaTags from '../utils/seo';
import { findTopicBySlug, topicsIndex } from '../data/topicsIndex';

const TopicDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const topic = slug ? findTopicBySlug(slug) : undefined;

  useEffect(() => {
    if (!topic) return;
    const title = `${topic.title} — İngilizce Konu Anlatımı (${topic.level})`;
    setMetaTags({
      title,
      description: topic.excerpt,
      keywords: `${topic.title}, ingilizce ${topic.level}, konu anlatımı, grammar, örnek cümleler`,
      canonical: `/topics/${topic.slug}`,
      ogImage: '/social-preview.svg'
    });

    // JSON-LD: Article + BreadcrumbList
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': topic.title,
      'description': topic.excerpt,
      'inLanguage': 'tr',
      'articleSection': topic.level,
      'mainEntityOfPage': `${window.location.origin}/topics/${topic.slug}`
    };
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Konular', 'item': `${window.location.origin}/topics` },
        { '@type': 'ListItem', 'position': 2, 'name': topic.title, 'item': `${window.location.origin}/topics/${topic.slug}` }
      ]
    };
    const s1 = document.createElement('script');
    s1.type = 'application/ld+json';
    s1.innerHTML = JSON.stringify(jsonLd);
    const s2 = document.createElement('script');
    s2.type = 'application/ld+json';
    s2.innerHTML = JSON.stringify(breadcrumb);
    document.head.appendChild(s1);
    document.head.appendChild(s2);
    return () => { document.head.removeChild(s1); document.head.removeChild(s2); };
  }, [topic]);

  if (!topic) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Typography>Bu konu bulunamadı.</Typography>
      </Box>
    );
  }

  return (
    <>
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', px: 2, py: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ maxWidth: 900, width: '100%', borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 } }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            <Link to="/topics" style={{ color: 'inherit' }}>Konular</Link>
            <Typography color="inherit">{topic.title}</Typography>
          </Breadcrumbs>
          <Typography variant="h3" fontWeight={800} mt={1}>{topic.title}</Typography>
          <Typography sx={{ opacity: 0.9, mt: 1 }}>{topic.excerpt}</Typography>
        </Box>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Typography component="div" sx={{ lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: topic.content }} />
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Diğer konular</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {topicsIndex.filter(t => t.slug !== topic.slug).slice(0, 6).map(t => (
                <Link key={t.slug} to={`/topics/${t.slug}`} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: '#00b894' }}>{t.title}</Typography>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
    <MoreLearningLinks />
    </>
  );
};

export default TopicDetail;
