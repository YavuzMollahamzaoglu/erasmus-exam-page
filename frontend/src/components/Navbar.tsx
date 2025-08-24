import React from 'react';
import { useLocation } from 'react-router-dom';
// Add Poppins font import for the whole app (for local dev, add to index.html as well)
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

interface Props {
  onNavigate: (page: string) => void;
  token: string;
  onLogout: () => void;
  userImage?: string; // profil fotoğrafı
}


const allPages = [
  { label: 'Profil', value: 'profile', auth: true },
  { label: 'Sorular', value: 'questions', auth: false },
  { label: 'Sıralamalar', value: 'rankings', auth: false },
  { label: 'Geçmiş', value: 'history', auth: true },
  { label: 'Kategoriler', value: 'categories', auth: false },
  { label: 'Kelimeler', value: 'words', auth: false },
  { label: 'Hakkımızda', value: 'about', auth: false }
  // Login ve Register menüde gösterilmeyecek, sadece sağda buton olarak olacak
];

// Login and Register are not navigation pages, only right-side buttons
const Navbar: React.FC<Props> = ({ onNavigate, token, onLogout, userImage }) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);


  // Pages to show depending on login state (custom order requested)
  const pages = React.useMemo(() => {
    if (token) {
      // Giriş yapanlar
      return [
        { label: 'Profil', value: 'profile', auth: true },           // 1
        { label: 'Testler', value: 'categories', auth: false },       // 2
        { label: 'Klasik Sorular', value: 'questions', auth: false }, // 3 (yer değiştirildi)
        { label: 'Kelimeler', value: 'words', auth: false },          // 4 (yer değiştirildi)
        { label: 'Geçmiş', value: 'history', auth: true },            // 5
        { label: 'Sıralamalar', value: 'rankings', auth: false },     // 6
        { label: 'Hakkımızda', value: 'about', auth: false },         // 7
      ];
    }
    // Giriş yapmayanlar
    return [
      { label: 'Testler', value: 'categories', auth: false },        // 1
      { label: 'Klasik Sorular', value: 'questions', auth: false },  // 2
      { label: 'Kelimeler', value: 'words', auth: false },           // 3
      { label: 'Sıralamalar', value: 'rankings', auth: false },      // 4
      { label: 'Hakkımızda', value: 'about', auth: false },          // 5
    ];
  }, [token]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => { 
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // The Poppins font should be loaded in public/index.html, not here
  const location = useLocation();
  // Aktif path'i bulmak için
  const currentPath = location.pathname.replace(/^\//, '');
  return (
    <AppBar position="static" elevation={0} sx={{
      bgcolor: '#2D5BBA',
      color: '#fff',
      minHeight: 64,
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 64, pl: 1, pr: 1 }}>
          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.value} onClick={() => { handleCloseNavMenu(); onNavigate(page.value); }}>
                  <Typography sx={{ textAlign: 'center' }}>{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Brand Logo (click to home) */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 0, cursor: 'pointer', height: 40 }}
            onClick={() => onNavigate('home')}
          >
            <img
              src="/assets/ingilizcehazirlik-logo.svg"
              alt="İngilizce Hazırlık"
              height={40}
              style={{ display: 'block', transform: 'translateY(-3px)' }}
            />
            <Typography
              component="span"
              sx={{
                ml: 0.5,
                display: 'flex',
                alignItems: 'center',
                height: 40,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem', lg: '1.5rem' },
                letterSpacing: '.05rem',
                color: 'inherit',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 700 }}>İngilizce</span>
              <span style={{ color: '#fff', fontWeight: 700, marginLeft: 6 }}>Hazırlık</span>
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' }, 
            gap: { md: 0.8, lg: 1, xl: 2 }, 
            alignItems: 'center', 
            height: 64,
            justifyContent: 'flex-start',
            ml: 3
          }}>
            {pages.map((page) => {
              const isActive = (currentPath === page.value) || 
                              (page.value === 'profile' && currentPath === 'profile') || 
                              (page.value === 'about' && currentPath === 'about');
              return (
                <Button
                  key={page.value}
                  onClick={() => onNavigate(page.value)}
                  sx={{
                    my: 0,
                    mx: { md: 0.3, lg: 0.5, xl: 1 },
                    color: isActive ? '#5CC9F5' : '#fff',
                    display: 'block',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: { md: '0.85rem', lg: '0.9rem', xl: '1rem' },
                    padding: { md: '6px 10px', lg: '6px 12px', xl: '8px 16px' },
                    borderRadius: 2,
                    minHeight: 36,
                    borderBottom: 'none',
                    transition: 'color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, text-decoration-color 0.2s ease',
                    boxShadow: 'none',
                    textDecoration: isActive ? 'underline' : 'none',
                    textUnderlineOffset: isActive ? 4 : undefined,
                    '&:hover': {
                      color: '#5CC9F5',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      textDecoration: 'underline',
                      textUnderlineOffset: 4,
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                    },
                  }}
                >
                  {page.label}
                </Button>
              );
            })}
          </Box>
          {/* User Menu or Login/Register */}
          {token ? (
            <Box sx={{ 
              flexGrow: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end' 
            }}>
              <Tooltip title="Ayarlar">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Profil"
                    src={userImage ? `http://localhost:4000${userImage}?t=${Date.now()}` : "https://www.gravatar.com/avatar/?d=mp"}
                    sx={{ width: 36, height: 36, bgcolor: '#26c6da', boxShadow: 2 }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar-user"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => { handleCloseUserMenu(); onNavigate('profile'); }}>
                  <Typography textAlign="center">Profilim</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseUserMenu(); onLogout(); }}>
                  <Typography textAlign="center" color="error">Çıkış Yap</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ 
              flexGrow: 0, 
              display: 'flex', 
              gap: { xs: 0.5, sm: 1 }, 
              alignItems: 'center', 
              justifyContent: 'flex-end' 
            }}>
              <Button 
                color="inherit" 
                sx={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 600, 
                  fontSize: { xs: '0.85rem', sm: '0.95rem', lg: '1rem' }, 
                  px: { xs: 1.5, sm: 2, lg: 2.5 }, 
                  py: 1, 
                  borderRadius: 2, 
                  border: '1px solid rgba(255,255,255,0.7)',
                  color: '#fff',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: '#fff', 
                    backgroundColor: 'rgba(255,255,255,0.10)', 
                    borderColor: '#fff',
                  } 
                }} 
                onClick={() => onNavigate('login')}
              >
                Giriş Yap
              </Button>
              <Button 
                color="inherit" 
                sx={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 600, 
                  fontSize: { xs: '0.85rem', sm: '0.95rem', lg: '1rem' }, 
                  px: { xs: 1.5, sm: 2, lg: 2.5 }, 
                  py: 1, 
                  borderRadius: 2, 
                  border: '1px solid rgba(255,255,255,0.7)',
                  color: '#fff',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: '#fff', 
                    backgroundColor: 'rgba(255,255,255,0.10)', 
                    borderColor: '#fff',
                  } 
                }} 
                onClick={() => onNavigate('register')}
              >
                Kayıt Ol
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
