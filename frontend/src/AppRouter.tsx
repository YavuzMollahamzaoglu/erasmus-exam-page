
import React, { useState, useEffect, lazy, Suspense } from 'react';
import ModernLoader from './components/ModernLoader';
import Box from '@mui/material/Box';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SkipLink from './components/SkipLink';
import { installAuthFetchInterceptor } from './utils/installAuthFetchInterceptor';

const Login = lazy(() => import('./pages/Login'));
const Exam = lazy(() => import('./pages/Exam'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Questions = lazy(() => import('./pages/Questions'));
const Rankings = lazy(() => import('./pages/Rankings'));
const Categories = lazy(() => import('./pages/Categories'));
const About = lazy(() => import('./pages/About'));
const TopicsPage = lazy(() => import('./pages/TopicsPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const History = lazy(() => import('./pages/History'));
const WordHuntGame = lazy(() => import('./pages/games/WordHuntGame'));
const WritingGame = lazy(() => import('./pages/games/WritingGame'));
const SelectLevel = lazy(() => import('./pages/games/SelectLevel'));
const EssayGame = lazy(() => import('./pages/games/EssayGame'));
const EssayWriting = lazy(() => import('./pages/EssayWriting'));
const Words = lazy(() => import('./pages/Words'));
const FillInTheBlanksGame = lazy(() => import('./pages/games/FillInTheBlanksGame'));
const WordMatchingGame = lazy(() => import('./pages/WordMatchingGame'));
const ReadingGame = lazy(() => import('./pages/games/ReadingGame'));
 



const AppRouter: React.FC = () => {
  // On login, save token and fetch profile to get photo
  const handleLogin = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem('token', jwt);
    (async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${jwt}` },
        });
        const data = await res.json();
        // avatar veya profilePhoto varsa onu kullan
        if (data?.user?.avatar) setUserAvatar(data.user.avatar);
        else if (data?.user?.profilePhoto) setUserAvatar(data.user.profilePhoto);
        else setUserAvatar(undefined);
        if (data?.user?.name) setUserInitial(data.user.name[0]?.toUpperCase() || '?');
        else setUserInitial('?');
      } catch {
        setUserAvatar(undefined);
        setUserInitial('?');
      }
    })();
  };
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [userInitial, setUserInitial] = useState<string>('?');
  // no dialog; we'll redirect to login with a popup message there

  // Install global interceptor once
  useEffect(() => {
    installAuthFetchInterceptor(() => {
      setToken('');
      localStorage.removeItem('token');
      window.location.href = '/login?session=expired';
    });
  }, []);

  // On logout, clear token from localStorage
  const handleLogout = (navigate: (path: string) => void) => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Wrapper to use navigate in Navbar
  const NavbarWithNavigate = (props: any) => {
    const navigate = useNavigate();
    const handleNavigate = (target: string) => {
      if (target === 'home') {
        navigate('/');
      } else if (target === 'topics') {
        navigate('/topics');
      } else {
        navigate('/' + target);
      }
    };
    const handleLogoutNav = () => handleLogout(navigate);
  return <Navbar onNavigate={handleNavigate} token={token} onLogout={handleLogoutNav} userAvatar={userAvatar} userInitial={userInitial} />;
  };



  return (
    <Router>
      <SkipLink />
  <NavbarWithNavigate userAvatar={userAvatar} userInitial={userInitial} />
      {/* Fixed AppBar spacer to avoid content jump under navbar */}
      <Box sx={{ height: { xs: 56, md: 64 } }} />
  <Suspense fallback={<ModernLoader text="Yükleniyor..." />}> 
        <Routes>
          <Route path="/" element={<Box component="main" id="main-content"><HomePage token={token} /></Box>} />
          <Route path="/topics" element={<Box component="main" id="main-content"><TopicsPage /></Box>} />
          <Route path="/login" element={<Login onLogin={handleLogin} onShowRegister={() => {}} />} />
          <Route path="/register" element={<Register onShowLogin={() => {}} />} />
          <Route path="/profile" element={token ? <Box component="main" id="main-content"><Profile token={token} onAvatarChange={a => setUserAvatar(a || undefined)} onInitialChange={setUserInitial} /></Box> : <Navigate to="/login" replace />} />
          <Route path="/questions" element={<Box component="main" id="main-content"><Questions /></Box>} />
          <Route path="/kelime-avi" element={<SelectLevel game="kelime-avi" />} />
          <Route path="/kelime-avi-game" element={<WordHuntGame />} />
          <Route path="/yazi-yazma" element={<SelectLevel game="yazi-yazma" />} />
          <Route path="/yazi-yazma-game" element={<WritingGame />} />
          <Route path="/bosluk-doldurma" element={<FillInTheBlanksGame />} />
          <Route path="/essay-writing" element={<EssayWriting />} />
          <Route path="/kelime-eslestirme" element={<SelectLevel game="kelime-eslestirme" />} />
          <Route path="/kelime-eslestirme-game" element={<WordMatchingGame />} />
          <Route path="/okuma" element={<SelectLevel game="okuma" />} />
          <Route path="/okuma-game" element={<ReadingGame />} />
          <Route path="/rankings" element={<Box component="main" id="main-content"><Rankings token={token} /></Box>} />
          <Route path="/categories" element={<Box component="main" id="main-content"><Categories /></Box>} />
          <Route path="/about" element={<Box component="main" id="main-content"><About /></Box>} />
          <Route path="/words" element={<Box component="main" id="main-content"><Words /></Box>} />
          <Route path="/history" element={token ? <Box component="main" id="main-content"><History token={token} /></Box> : <Navigate to="/login" replace />} />
          <Route path="/exam/:testId" element={<Box component="main" id="main-content"><Exam /></Box>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
