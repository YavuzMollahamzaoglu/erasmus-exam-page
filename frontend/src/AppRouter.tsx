import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Exam from './pages/Exam';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Questions from './pages/Questions';
import Rankings from './pages/Rankings';
import Categories from './pages/Categories';
import About from './pages/About';
import TopicsPage from './pages/TopicsPage';
import HomePage from './pages/HomePage';
import History from './pages/History';
import Navbar from './components/Navbar';
import SkipLink from './components/SkipLink';
import WordHuntGame from './pages/games/WordHuntGame';
import WritingGame from './pages/games/WritingGame';
import SelectLevel from './pages/games/SelectLevel';
import EssayGame from './pages/games/EssayGame';
import EssayWriting from './pages/EssayWriting';
import Words from './pages/Words';
import FillInTheBlanksGame from './pages/games/FillInTheBlanksGame';
import WordMatchingGame from './pages/WordMatchingGame';
import ReadingGame from './pages/games/ReadingGame';
import { installAuthFetchInterceptor } from './utils/installAuthFetchInterceptor';
 



const AppRouter: React.FC = () => {
  // On login, save token and fetch profile to get photo
  const handleLogin = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem('token', jwt);
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/me');
        const data = await res.json();
        if (data?.user?.profilePhoto) setUserImage(data.user.profilePhoto);
      } catch {}
    })();
  };
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
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
    return <Navbar onNavigate={handleNavigate} token={token} onLogout={handleLogoutNav} userImage={userImage} />;
  };



  return (
    <Router>
  <SkipLink />
  <NavbarWithNavigate userImage={userImage} />
  {/* Fixed AppBar spacer to avoid content jump under navbar */}
  <Box sx={{ height: { xs: 56, md: 64 } }} />
      
      <Routes>
  <Route path="/" element={<Box component="main" id="main-content"><HomePage token={token} /></Box>} />
  <Route path="/topics" element={<Box component="main" id="main-content"><TopicsPage /></Box>} />
        <Route path="/login" element={<Login onLogin={handleLogin} onShowRegister={() => {}} />} />
        <Route path="/register" element={<Register onShowLogin={() => {}} />} />
    <Route path="/profile" element={token ? <Box component="main" id="main-content"><Profile token={token} onProfilePhotoChange={setUserImage} /></Box> : <Navigate to="/login" replace />} />
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
    </Router>
  );
};

export default AppRouter;
