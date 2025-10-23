import React, { useEffect } from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import setMetaTags from '../utils/seo';

const palette = {
  rose: '#E7CCCC',
  sand: '#EDE8DC',
  leaf: '#A5B68D',
  mint: '#C1CFA1',
};

const About: React.FC = () => {
  useEffect(() => {
    setMetaTags({
      title: 'Hakkımızda — İngilizce Hazırlık',
      description: 'İngilizce Hazırlık hakkında bilgi. Amacımız Erasmus ve üniversite hazırlığı için ücretsiz içerikler sunmaktır.',
      keywords: 'hakkımızda, ingilizce hazırlık, erasmus',
      canonical: '/about',
      ogImage: '/social-preview.svg'
    });
  }, []);

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
    
      <Paper 
        elevation={6} 
        sx={{ 
          maxWidth: 1100, 
          width: '100%', 
          borderRadius: 4, 
          overflow: 'hidden', 
          mt: { xs: 1, md: '15px' },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Gradient header like Categories/Questions/Rankings */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', 
          color: '#fff', 
          p: { xs: 3, md: 5 }, 
          borderRadius: 0,
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
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(4px)',
            zIndex: 0,
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" fontWeight={800} mb={1}>Hakkımızda</Typography>
            <Typography variant="h6" sx={{ opacity: 0.95 }}>İngilizceye hazırlıkta yalın, modern ve hızlı bir deneyim</Typography>
          </Box>
        </Box>

        {/* Features section - frosted card */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 184, 148, 0.2)',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            p: { xs: 2.5, md: 3 },
            mb: 3
          }}>
            <Typography variant="h5" fontWeight={700} mb={2} color="#00695c">Öne Çıkanlar</Typography>
            <List sx={{ maxWidth: 900, '& .MuiListItem-root': { py: 0.5 } }}>
              <ListItem disableGutters>
                <ListItemText primary="✨ A1, A2, B1, B2 seviyelerinde testler" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="📊 Detaylı istatistikler ve sıralamalar" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="👤 Profil ve gelişim takibi" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="🎯 Ücretsiz ve kolay kullanım" />
              </ListItem>
            </List>
          </Box>

          {/* Stats grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, 
            gap: 3,
            mb: 3
          }}>
            {([
              { value: '6', label: 'Oyun' },
              { value: '1000+', label: 'Soru' },
              { value: '4', label: 'Sınav Seviyesi', sub: 'A1 • A2 • B1 • B2' },
              { value: '2025', label: 'Güncel İçerik' },
            ] as Array<{ value: string; label: string; sub?: string }>).map((s) => (
              <Box key={s.label} sx={{ 
                textAlign: 'center', 
                p: 2.5, 
                background: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: 3, 
                border: '1px solid rgba(0, 184, 148, 0.2)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }
              }}>
                <Typography variant="h4" fontWeight={800} color="#00695c">{s.value}</Typography>
                <Typography color="#455a64">{s.label}</Typography>
                {s.sub && (
                  <Typography variant="caption" sx={{ display: 'block', color: '#78909c', mt: 0.5, fontSize: 12 }}>
                    {s.sub}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* Technologies */}
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 184, 148, 0.2)',
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            p: { xs: 2.5, md: 3 },
          }}>
            <Typography variant="h5" fontWeight={700} mb={3} color="#00695c">Teknolojiler</Typography>
            {(() => {
              const techs = [
                { label: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
                { label: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
                { label: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
                { label: 'Material UI', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg' },
                { label: 'MySQL Database', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
              ];
              return (
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, minmax(120px, 1fr))' },
                  gap: { xs: 1.5, md: 2.5 },
                  justifyItems: 'center',
                  alignItems: 'stretch'
                }}>
                  {techs.map((t) => (
                    <Box
                      key={t.label}
                      tabIndex={0}
                      aria-label={t.label}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        px: { xs: 1.5, md: 2 },
                        py: { xs: 1.2, md: 1.5 },
                        width: '100%',
                        borderRadius: 2,
                        background: 'linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.95))',
                        border: '1px solid rgba(0, 184, 148, 0.18)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        cursor: 'default',
                        transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms cubic-bezier(.2,.8,.2,1), border-color 220ms',
                        outline: 'none',
                        '& img': {
                          transition: 'transform 220ms cubic-bezier(.2,.8,.2,1)',
                          filter: 'drop-shadow(0 1px 0 rgba(0,0,0,.04))',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: '50%',
                          bottom: -6,
                          width: '70%',
                          height: 10,
                          transform: 'translateX(-50%)',
                          background: 'radial-gradient(50% 60% at 50% 50%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 70%)',
                          filter: 'blur(6px)',
                          opacity: 0,
                          transition: 'opacity 220ms ease',
                          pointerEvents: 'none',
                        },
                        '&:hover, &:focus-visible': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                          borderColor: 'rgba(0, 184, 148, 0.55)',
                          '& img': { transform: 'scale(1.06)' },
                          '&::before': { opacity: 1 },
                        },
                        '&:focus-visible': {
                          outline: '2px solid #00b894',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <img
                        src={t.src}
                        alt={t.label}
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <Typography fontSize={13} fontWeight={700} sx={{ mt: 1 }}>{t.label}</Typography>
                    </Box>
                  ))}
                </Box>
              );
            })()}
          </Box>

          {/* CTA Buttons removed */}
        </Box>
      </Paper>
    </Box>
  );
};

export default About;
