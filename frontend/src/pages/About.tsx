import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const palette = {
  rose: '#E7CCCC',
  sand: '#EDE8DC',
  leaf: '#A5B68D',
  mint: '#C1CFA1',
};

const About: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#b2dfdb',
      px: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      pb: { xs: 7, md: 8 },
      pt: 0
    }}>
      <Paper 
        elevation={6} 
        sx={{ 
          maxWidth: 1100, 
          width: '100%', 
          borderRadius: 4, 
          overflow: 'hidden', 
          mt: '15px',
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
            {[
              { value: '500+', label: 'Aktif Kullanıcı' },
              { value: '1000+', label: 'Soru Bankası' },
              { value: '4', label: 'Sınav Seviyesi' },
              { value: '2025', label: 'Güncel İçerik' },
            ].map((s) => (
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
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              columnGap: 3,
              rowGap: 2
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 1, minWidth: 120 }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width={40} height={40} />
                <Typography fontSize={13} fontWeight={700} sx={{ mt: 1 }}>React</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 1, minWidth: 120, borderLeft: '1px solid rgba(0, 184, 148, 0.25)', pl: 2 }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width={40} height={40} />
                <Typography fontSize={13} fontWeight={700} sx={{ mt: 1 }}>TypeScript</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 1, minWidth: 120, borderLeft: '1px solid rgba(0, 184, 148, 0.25)', pl: 2 }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width={40} height={40} />
                <Typography fontSize={13} fontWeight={700} sx={{ mt: 1 }}>Node.js</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 1, minWidth: 120, borderLeft: '1px solid rgba(0, 184, 148, 0.25)', pl: 2 }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" alt="Material UI" width={40} height={40} />
                <Typography fontSize={13} fontWeight={700} sx={{ mt: 1 }}>Material UI</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 1, minWidth: 120, borderLeft: '1px solid rgba(0, 184, 148, 0.25)', pl: 2 }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" width={40} height={40} />
                <Typography fontSize={13} fontWeight={700} sx={{ mt: 1 }}>MySQL Database</Typography>
              </Box>
            </Box>
          </Box>

          {/* CTA Buttons removed */}
        </Box>
      </Paper>
    </Box>
  );
};

export default About;
