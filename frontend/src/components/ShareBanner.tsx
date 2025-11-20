import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import withUtm from '../utils/utm';

interface Props {
  path?: string; // relative path to share; defaults to current path
  campaign?: string; // utm_campaign
  label?: string; // heading text
  variant?: 'default' | 'footer'; // styling variant
}

const ShareBanner: React.FC<Props> = ({ path, campaign = 'site-share', label = 'Faydalı bulduysan paylaş', variant = 'default' }) => {
  const url = React.useMemo(() => {
    const p = path || (typeof window !== 'undefined' ? window.location.pathname : '/');
    return withUtm(p, { source: 'share', medium: 'social', campaign });
  }, [path, campaign]);

  const text = encodeURIComponent('İngilizce Hazırlık — ücretsiz testler ve kelime oyunları');

  const shareTargets = [
    { name: 'WhatsApp', icon: <WhatsAppIcon sx={{ fontSize: 20 }} />, href: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}` },
    { name: 'Telegram', icon: <TelegramIcon sx={{ fontSize: 20 }} />, href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}` },
    { name: 'Twitter', icon: <TwitterIcon sx={{ fontSize: 20 }} />, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Bağlantı kopyalandı!');
    } catch {}
  };

  const footerMode = variant === 'footer';

  return (
    <Box sx={{
      mt: 0,
      p: 0,
      textAlign: 'center',
      color: footerMode ? '#e3eafc' : 'inherit'
    }}>
      <Typography fontWeight={700} sx={{ mb: 0.75, fontSize: footerMode ? 13 : 14, letterSpacing: 0.2 }}>
        {label}
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={footerMode ? 0.5 : 1}
        useFlexGap
        sx={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}
      >
        {shareTargets.map((t) => (
          <Button
            key={t.name}
            component="a"
            href={t.href}
            target="_blank"
            rel="noopener"
            variant={footerMode ? 'text' : 'outlined'}
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: 999,
              px: footerMode ? 1.2 : 1.6,
              minHeight: 30,
              fontSize: 12,
              color: footerMode ? '#e3eafc' : 'inherit',
              ...(footerMode ? {
                '&:hover': { background: 'rgba(255,255,255,0.08)' }
              } : {}),
            }}
          >
            {t.icon}&nbsp;{t.name}
          </Button>
        ))}
        <Button
          onClick={copyLink}
          variant={'contained'}
          size="small"
          sx={{
            textTransform: 'none',
            borderRadius: 999,
            fontSize: 12,
            px: 1.6,
            background: 'linear-gradient(135deg,#00b894 0%,#00cec9 100%)',
            boxShadow: 'none',
            '&:hover': { background: 'linear-gradient(135deg,#00a884 0%,#00bcbc 100%)' }
          }}
        >
          <ContentCopyIcon sx={{ fontSize: 16, mr: 0.5 }} /> Kopyala
        </Button>
      </Stack>
    </Box>
  );
};

export default ShareBanner;
