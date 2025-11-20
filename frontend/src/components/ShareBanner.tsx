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
}

const ShareBanner: React.FC<Props> = ({ path, campaign = 'site-share', label = 'Faydalı bulduysan paylaş' }) => {
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

  return (
    <Box sx={{ mt: 0, p: 0, textAlign: 'center', color: 'inherit' }}>
      <Typography fontWeight={700} sx={{ mb: 0.5, fontSize: 14 }}>{label}</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap sx={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        {shareTargets.map((t) => (
          <Button key={t.name} component="a" href={t.href} target="_blank" rel="noopener" variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 999 }}>
            {t.icon}&nbsp;{t.name}
          </Button>
        ))}
        <Button onClick={copyLink} variant="contained" size="small" sx={{ textTransform: 'none', borderRadius: 999, background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' }}>
          <ContentCopyIcon sx={{ fontSize: 18, mr: 0.5 }} /> Kopyala
        </Button>
      </Stack>
    </Box>
  );
};

export default ShareBanner;
