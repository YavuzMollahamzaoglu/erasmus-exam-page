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
import AdbIcon from '@mui/icons-material/Adb';

interface Props {
  onNavigate: (page: string) => void;
  token: string;
  onLogout: () => void;
  userImage?: string; // profil fotoğrafı
}


const allPages = [
  { label: 'Profile', value: 'profile', auth: true },
  { label: 'Questions', value: 'questions', auth: false },
  { label: 'Rankings', value: 'rankings', auth: false },
  { label: 'History', value: 'history', auth: true },
  { label: 'Categories', value: 'categories', auth: false },
  { label: 'About Us', value: 'about', auth: false }
  // Login ve Register menüde gösterilmeyecek, sadece sağda buton olarak olacak
];

// Login and Register are not navigation pages, only right-side buttons
const Navbar: React.FC<Props> = ({ onNavigate, token, onLogout, userImage }) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);


  // Pages to show depending on login state
  const pages = token
    ? allPages // logged in: show all
    : allPages.filter((p) => !p.auth); // not logged in: only those with auth: false

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
      bgcolor: '#1A4D7A',
      color: '#fff',
      minHeight: 64,
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
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

          {/* Desktop Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#5CC9F5' }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => onNavigate('home')}
              sx={{
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: { md: '1.3rem', lg: '1.5rem', xl: '1.8rem' },
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
                lineHeight: 1.1,
              }}
            >
              <span style={{ color: '#fff', fontWeight: 700 }}>İngilizce</span>{' '}
              <span style={{ color: '#5CC9F5', fontWeight: 700 }}>Hazırlık</span>
            </Typography>
            
            {/* Mobile Logo and Title */}
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#5CC9F5' }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => onNavigate('home')}
              sx={{
                display: { xs: 'flex', md: 'none' },
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.2rem' },
                letterSpacing: '.05rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
                lineHeight: 1.1,
              }}
            >
              <span style={{ color: '#fff', fontWeight: 700 }}>İngilizce</span>{' '}
              <span style={{ color: '#5CC9F5', fontWeight: 700 }}>Hazırlık</span>
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
                    transition: 'color 0.2s, box-shadow 0.2s',
                    boxShadow: 'none',
                    '&:hover': {
                      color: '#5CC9F5',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      textDecoration: 'none',
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
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Profile"
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
                  <Typography textAlign="center">My Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseUserMenu(); onLogout(); }}>
                  <Typography textAlign="center" color="error">Logout</Typography>
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
                  fontWeight: 500, 
                  fontSize: { xs: '0.85rem', sm: '0.95rem', lg: '1rem' }, 
                  px: { xs: 1, sm: 1.5, lg: 2 }, 
                  py: 1, 
                  borderRadius: 2, 
                  '&:hover': { 
                    color: '#5CC9F5', 
                    backgroundColor: 'rgba(255,255,255,0.04)', 
                    textDecoration: 'underline' 
                  } 
                }} 
                onClick={() => onNavigate('login')}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                sx={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 500, 
                  fontSize: { xs: '0.85rem', sm: '0.95rem', lg: '1rem' }, 
                  px: { xs: 1, sm: 1.5, lg: 2 }, 
                  py: 1, 
                  borderRadius: 2, 
                  '&:hover': { 
                    color: '#5CC9F5', 
                    backgroundColor: 'rgba(255,255,255,0.04)', 
                    textDecoration: 'underline' 
                  } 
                }} 
                onClick={() => onNavigate('register')}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
