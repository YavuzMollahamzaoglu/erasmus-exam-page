import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const About: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #b2ebf2 0%, #80deea 50%, #4dd0e1 100%)', 
      px: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      pb: { xs: 7, md: 8 } 
    }}>
      <Paper 
        elevation={6} 
        sx={{ 
          maxWidth: 1200, 
          width: '100%', 
          borderRadius: 4, 
          overflow: 'hidden', 
          mt: { xs: 2.625, md: 4.625 },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',   
          minHeight: '600px' 
        }}>
          {/* Sol Kolon */}
          <Box sx={{ 
            flex: 1,
            background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', 
            color: '#fff', 
            p: { xs: 4, md: 6 }, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
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
              <Typography 
                variant="h3" 
                fontWeight={700} 
                mb={3}
                sx={{
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}
              >
                İngilizce Hazırlık Platformu
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight={700} 
                mb={3} 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.95)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Hazırlan. Çalış. Başar.
              </Typography>
              <Typography 
                variant="body1" 
                mb={4} 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                Erasmus'a ve İngilizce sınavlarına hazırlanmanın en gerçekçi ve eğlenceli yolu! Gerçek sınav formatında testler, anlık geri bildirimler ve rekabetçi sıralamalarla başarıya bir adım daha yaklaş.
              </Typography>
              <List sx={{ '& .MuiListItem-root': { py: 0.5 } }}>
                <ListItem disableGutters>
                  <ListItemText primary="✨ Geniş kategori ve seviye yelpazesi (A1, A2, B1, B2)" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="📊 Detaylı istatistikler ve sıralama sistemi" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="👤 Kullanıcı profili ve gelişim takibi" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="🎯 Ücretsiz ve kolay kullanım" />
                </ListItem>
              </List>
            </Box>
          </Box>

          {/* Orta Kolon -> Platform Özellikleri */}
          <Box sx={{ 
            flex: 1,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
            backdropFilter: 'blur(5px)',
            color: '#2c3e50', 
            p: { xs: 4, md: 6 }, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center'
          }}>
            <Typography variant="h5" fontWeight={700} mb={4} textAlign="center">
              Platform Özellikleri
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5, justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#00b894' }}>500+</Typography>
                <Typography variant="body1">Aktif Kullanıcı</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#00b894' }}>1000+</Typography>
                <Typography variant="body1">Soru Bankası</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#00b894' }}>4</Typography>
                <Typography variant="body1">Sınav Seviyesi</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} sx={{ color: '#00b894' }}>2025</Typography>
                <Typography variant="body1">Güncel İçerik</Typography>
              </Box>
            </Box>
          </Box>

          {/* Sağ Kolon -> Kullandığımız Teknolojiler */}
          <Box sx={{ 
            flex: 1,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            backdropFilter: 'blur(5px)',
            color: '#2c3e50', 
            p: { xs: 4, md: 6 }, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center'
          }}>
            <Typography variant="h5" fontWeight={700} mb={4} textAlign="center">
              Kullandığımız Teknolojiler
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width={40} height={40} />
                <Typography fontSize={14} fontWeight={600} sx={{ ml: 1 }}>React</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width={40} height={40} />
                <Typography fontSize={14} fontWeight={600} sx={{ ml: 1 }}>TypeScript</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width={40} height={40} />
                <Typography fontSize={14} fontWeight={600} sx={{ ml: 1 }}>Node.js</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" alt="Material UI" width={40} height={40} />
                <Typography fontSize={14} fontWeight={600} sx={{ ml: 1 }}>Material UI</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" width={40} height={40} />
                <Typography fontSize={14} fontWeight={600} sx={{ ml: 1 }}>MySQL Database</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default About;
