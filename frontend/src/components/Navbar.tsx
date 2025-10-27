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
import Fade from '@mui/material/Fade';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
// Divider removed from mobile popup to keep uniform spacing
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  onNavigate: (page: string) => void;
  token: string;
  onLogout: () => void;
  userAvatar?: string; // emoji avatar
  userInitial?: string; // baş harf fallback
}


const allPages = [
  { label: 'Profil', value: 'profile', auth: true },
  { label: 'Sorular', value: 'questions', auth: false },
  { label: 'Sıralamalar', value: 'rankings', auth: false },
  { label: 'Geçmiş', value: 'history', auth: true },
  { label: 'Kategoriler', value: 'categories', auth: false },
  { label: 'Kelimeler', value: 'words', auth: false },
  { label: 'Konular', value: 'topics', auth: false },
  { label: 'Hakkımızda', value: 'about', auth: false }
  // Login ve Register menüde gösterilmeyecek, sadece sağda buton olarak olacak
];

// Login and Register are not navigation pages, only right-side buttons
// basit emoji tespiti (tek karakterlik emoji)
const isSingleEmoji = (s?: string) => {
  if (!s) return false;
  // geniş piktograf aralığı için unicode regex
  try {
    return (s.match(/\p{Extended_Pictographic}/u)?.length || 0) >= 1 && [...s.trim()].length === 1;
  } catch {
    return false;
  }
};

const Navbar: React.FC<Props> = ({ onNavigate, token, onLogout, userAvatar, userInitial }) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));


  // Pages to show depending on login state (custom order requested)
  const pages = React.useMemo(() => {
    if (token) {
      // Giriş yapanlar - Profil en sonda
      return [
        { label: 'Ana Sayfa', value: 'home', auth: false },
        { label: 'Testler', value: 'categories', auth: false },
        { label: 'Klasik Sorular', value: 'questions', auth: false },
        { label: 'Kelimeler', value: 'words', auth: false },
        { label: 'Konular', value: 'topics', auth: false },
        { label: 'Geçmiş', value: 'history', auth: true },
        { label: 'Sıralamalar', value: 'rankings', auth: false },
        { label: 'Hakkımızda', value: 'about', auth: false },
        { label: 'Profil', value: 'profile', auth: true }, // Profil EN SONDA
      ];
    }
    // Giriş yapmayanlar
    return [
      { label: 'Ana Sayfa', value: 'home', auth: false },
      { label: 'Testler', value: 'categories', auth: false },
      { label: 'Klasik Sorular', value: 'questions', auth: false },
      { label: 'Kelimeler', value: 'words', auth: false },
      { label: 'Konular', value: 'topics', auth: false },
      { label: 'Sıralamalar', value: 'rankings', auth: false },
      { label: 'Hakkımızda', value: 'about', auth: false },
    ];
  }, [token]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => { 
    // Blur trigger to avoid a11y warning when dialog sets aria-hidden on #root
    (event.currentTarget as HTMLElement)?.blur?.();
    if (isLgUp) setAnchorElNav(event.currentTarget);
    else setMobileNavOpen(true);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    (event.currentTarget as HTMLElement)?.blur?.();
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  setMobileNavOpen(false);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // The Poppins font should be loaded in public/index.html, not here
  const location = useLocation();
  // Aktif path'i bulmak için
  const currentPath = location.pathname.replace(/^\//, '');
  return (
    <AppBar position="fixed" elevation={0} sx={{
      background: 'linear-gradient(90deg, rgba(13,82,166,0.92) 0%, rgba(24,110,200,0.92) 100%)',
      backdropFilter: 'saturate(160%) blur(6px)',
      WebkitBackdropFilter: 'saturate(160%) blur(6px)',
      color: 'rgba(255,255,255,0.98)',
      minHeight: { xs: 56, md: 64 },
      boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      fontFamily: 'Poppins, sans-serif',
      top: 0,
      zIndex: (theme) => (theme.zIndex?.appBar ?? 1100) + 10,
      // Make nav text and buttons more prominent on the translucent background
      '& .MuiButton-root': {
        color: 'rgba(255,255,255,0.98)',
        fontWeight: 600,
      },
      '& .MuiTypography-root': {
        color: 'rgba(255,255,255,0.98)'
      }
    }}>
      <Container maxWidth="xl">
  <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 56, md: 64 }, pl: 0, pr: 1, overflow: 'visible' }}>
          {/* Mobile menu icon */}
            <Box sx={{ width: { xs: '56px', sm: '96px', md: '120px', lg: 'auto' }, display: { xs: 'flex', lg: 'none' }, alignItems: 'center', justifyContent: 'center', pr: { xs: 0.5, sm: 1 } }}>
              <IconButton
                size="large"
                aria-label="Ana menüyü aç"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                aria-expanded={Boolean(anchorElNav) ? 'true' : undefined}
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{ p: 0 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
  <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 220 }}
              PaperProps={{
                elevation: 8,
                sx: {
      mt: 0,
                  borderRadius: 2,
                  p: 0.5,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                  animation: 'menuIn 180ms cubic-bezier(0.22, 1, 0.36, 1)',
                  '@keyframes menuIn': {
                    '0%': { opacity: 0, transform: 'translateY(-6px) scale(0.98)' },
                    '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                  },
                },
              }}
              sx={{ display: { xs: 'block', lg: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.value} 
                  onClick={() => { 
                    console.log('Navbar mobile menu onNavigate value:', page.value);
                    handleCloseNavMenu(); 
                    onNavigate(page.value); 
                  }}
                  sx={{
                    borderRadius: 1.5,
                    mx: 0.5,
                    my: 0.25,
                    '&:hover': { backgroundColor: 'rgba(45,91,186,0.08)' },
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }} aria-current={(currentPath === page.value) || (page.value === 'home' && currentPath === '') ? 'page' : undefined}>{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>

            {/* Mobile popup dialog for navigation */}
            <Dialog
              open={mobileNavOpen}
              onClose={handleCloseNavMenu}
              fullWidth
              maxWidth="xs"
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  // page card vibe: soft white with a hint of tint and gentle shadow
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 100%)',
                  backdropFilter: 'saturate(180%) blur(8px)',
                  border: '1px solid rgba(45,91,186,0.12)',
                  boxShadow: '0 18px 44px rgba(0,0,0,0.18)'
                }
              }}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 220 }}
            >
              <DialogTitle
                sx={{
                  p: 2,
                  pb: 1.5,
                  borderRadius: '12px 12px 0 0',
                  color: '#fff',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2D5BBA 0%, #20C4A4 100%)',
                  boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography sx={{ fontSize: '1.15rem', letterSpacing: '.06rem', fontWeight: 800, textAlign: 'center' }}>İNGİLİZCE HAZIRLIK</Typography>
              </DialogTitle>
              <DialogContent sx={{ pt: 0, pb: 1 }}>
                <List sx={{ py: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {pages.map((page) => (
                    <ListItemButton
                      key={page.value}
                      onClick={() => { 
                        handleCloseNavMenu(); 
                        // Defer navigation one tick so aria-hidden is removed before focus moves
                        setTimeout(() => onNavigate(page.value), 0);
                      }}
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        minHeight: 44,
                        '&:hover': { backgroundColor: 'rgba(45,91,186,0.06)' },
                        ...(((currentPath === page.value) || (page.value === 'home' && currentPath === '')) && {
                          backgroundColor: 'rgba(45,91,186,0.08)',
                          boxShadow: 'inset 0 0 0 1px rgba(45,91,186,0.18)'
                        })
                      }}
                    >
                      <ListItemText primaryTypographyProps={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }} primary={page.label} />
                    </ListItemButton>
                  ))}
                </List>
              </DialogContent>
            </Dialog>
          {/* Small screen brand logo (left of menu icon) - compact */}
          {/* Removed redundant small logo-only box */}

          {/* Brand Logo (click to home) */}
          <Box
            component="span"
            onClick={() => onNavigate('home')}
            aria-label="Ana sayfa"
            sx={{
              display: { xs: 'none', lg: 'inline-flex' },
              alignItems: 'center',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 3000,
              ml: '-8px',
              mr: '8px',
              // constrain the wrapper height to keep the navbar size unchanged
              height: '64px',
              overflow: 'visible',
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="İngilizce Hazırlık"
              sx={{
                  // responsive visual size: larger logo on wide screens for stronger branding
                  height: { xs: '64px', sm: '120px', md: '96px', lg: '140px' },
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                position: 'relative',
                  top: { xs: '-2px', sm: '-4px', md: '0px' },
                transition: 'height 160ms ease, top 160ms ease'
              }}
            />
          </Box>

          <Box sx={{ position: { lg: 'relative' }, left: { lg: 'auto' }, transform: { lg: 'none' }, display: { xs: 'none', sm: 'none', md: 'none', lg: 'inline-flex' }, alignItems: 'center', pointerEvents: 'none', overflow: 'visible' }}>
            <Typography
              component="span"
              onClick={() => onNavigate('home')}
                sx={{
                alignItems: 'center',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.3rem' },
                letterSpacing: '.05rem',
                color: 'white',
                userSelect: 'none',
                cursor: 'pointer',
                lineHeight: 1,
                // force a hard left margin so the title doesn't get pushed; keep it from shrinking
                // keep a small visual gap from the logo (approx 4-8px)
                ml: { sm: '-3px', md: '-3px', lg: '-3px' },
                position: 'relative',
                left: { lg: '-3px' },
                pointerEvents: 'auto',
                flexShrink: 0,
                minWidth: 0,
                // use important via nested selector to ensure the computed margin wins over inline styles
                '&, & .MuiTypography-root': {
                  marginLeft: '-3px !important'
                }
              }}
            >
              <span style={{ color: '#fff', fontWeight: 700 }}>İngilizce</span>
              <span style={{ color: '#fff', fontWeight: 700, marginLeft: 3 }}>Hazırlık</span>
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', lg: 'flex' }, 
            gap: { md: 0.8, lg: 1, xl: 2 }, 
            alignItems: 'center', 
            height: 64,
            justifyContent: 'flex-start',
            ml: 3
          }}>
            {pages.filter(p => p.value !== 'home').map((page) => {
              const isActive = (currentPath === page.value) || 
                              (page.value === 'profile' && currentPath === 'profile') || 
                              (page.value === 'about' && currentPath === 'about');
              return (
                  <Button
                    key={page.value}
                    onClick={() => {
                      console.log('Navbar onNavigate value:', page.value);
                      onNavigate(page.value);
                    }}
                  aria-current={isActive ? 'page' : undefined}
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
              justifyContent: 'flex-end',
              // reserve width on small/tablet screens so title can be centered visually
              minWidth: { xs: '56px', sm: '96px', md: '120px', lg: 'auto' }
            }}>
              <Tooltip title="Kullanıcı menüsü">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          {
            // Görsel mi, emoji mi karar verip Avatar'a uygun şekilde verelim
          }
          <Avatar
            alt="Profil"
            sx={{
              width: 36,
              height: 36,
              minWidth: 36,
              minHeight: 36,
              maxWidth: 36,
              maxHeight: 36,
              borderRadius: '50%',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              bgcolor: '#26c6da',
              boxShadow: 2,
              border: '2px solid rgba(255,255,255,0.85)',
              fontWeight: 700,
              userSelect: 'none',
            }}
            src={(() => {
              if (!userAvatar) return undefined;
              if (isSingleEmoji(userAvatar)) return undefined; // emoji ise children'da göster
              const isHttp = userAvatar.startsWith('http');
              const isAbsolute = userAvatar.startsWith('/');
              const base = process.env.REACT_APP_API_URL || '';
              return isHttp
                ? userAvatar
                : `${base}${isAbsolute ? userAvatar : '/uploads/profile-photos/' + userAvatar}`;
            })()}
          >
            {isSingleEmoji(userAvatar) ? userAvatar : (userInitial || '?')}
          </Avatar>
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
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 220 }}
                PaperProps={{
                  elevation: 10,
                  sx: {
                    borderRadius: 2,
                    p: 0.5,
                    background: 'rgba(255,255,255,0.96)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 14px 38px rgba(0,0,0,0.18)',
                    animation: 'menuIn 190ms cubic-bezier(0.22, 1, 0.36, 1)',
                    '@keyframes menuIn': {
                      '0%': { opacity: 0, transform: 'translateY(-6px) scale(0.98)' },
                      '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                    },
                  },
                }}
              >
                <MenuItem role="menuitem" sx={{ borderRadius: 1.5, mx: 0.5, my: 0.25, '&:hover': { backgroundColor: 'rgba(45,91,186,0.08)' } }} onClick={() => { handleCloseUserMenu(); onNavigate('profile'); }}>
                  <Typography textAlign="center">Profilim</Typography>
                </MenuItem>
                <MenuItem role="menuitem" sx={{ borderRadius: 1.5, mx: 0.5, my: 0.25, '&:hover': { backgroundColor: 'rgba(45,91,186,0.08)' } }} onClick={() => { handleCloseUserMenu(); onLogout(); }}>
                  <Typography textAlign="center" color="error">Çıkış Yap</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ 
              flexGrow: 0, 
              display: 'flex', 
              gap: { xs: 0.4, sm: 1 }, 
              alignItems: 'center', 
              justifyContent: 'flex-end',
              // Reserve the same width on the right as the left mobile menu spacer
              // so the absolutely-centered title stays visually centered on xs/sm/md
              minWidth: { xs: '56px', sm: '96px', md: '120px', lg: 'auto' }
            }}>
              <Button 
                color="inherit" 
                sx={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 600, 
                  fontSize: { xs: '0.72rem', sm: '0.95rem', lg: '1rem' }, 
                  px: { xs: 1, sm: 2, lg: 2.5 }, 
                  py: { xs: 0.5, sm: 1 }, 
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
                  fontSize: { xs: '0.72rem', sm: '0.95rem', lg: '1rem' }, 
                  px: { xs: 1, sm: 2, lg: 2.5 }, 
                  py: { xs: 0.5, sm: 1 }, 
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
