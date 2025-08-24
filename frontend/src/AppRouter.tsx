import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Exam from './pages/Exam';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Questions from './pages/Questions';
import Rankings from './pages/Rankings';
import Categories from './pages/Categories';
import About from './pages/About';
import HomePage from './pages/HomePage';
import History from './pages/History';
import Navbar from './components/Navbar';
import WordHuntGame from './pages/games/WordHuntGame';
import WritingGame from './pages/games/WritingGame';
import SelectLevel from './pages/games/SelectLevel';
import EssayGame from './pages/games/EssayGame';
import EssayWriting from './pages/EssayWriting';
import Words from './pages/Words';
import FillInTheBlanksGame from './pages/games/FillInTheBlanksGame';



const AppRouter: React.FC = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [userImage, setUserImage] = useState<string | undefined>(undefined);

  // Hydrate user image on first load if token exists
  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (!jwt) return;
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await res.json();
        if (data?.user?.profilePhoto) {
          setUserImage(data.user.profilePhoto);
        }
      } catch {}
    })();
  }, []);

  // On login, save token and fetch profile to get photo
  const handleLogin = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem('token', jwt);
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await res.json();
        if (data?.user?.profilePhoto) setUserImage(data.user.profilePhoto);
      } catch {}
    })();
  };

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
      } else {
        navigate('/' + target);
      }
    };
    const handleLogoutNav = () => handleLogout(navigate);
    return <Navbar onNavigate={handleNavigate} token={token} onLogout={handleLogoutNav} userImage={userImage} />;
  };



  return (
    <Router>
      <NavbarWithNavigate userImage={userImage} />
      <Routes>
        <Route path="/" element={<HomePage token={token} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} onShowRegister={() => {}} />} />
        <Route path="/register" element={<Register onShowLogin={() => {}} />} />
        <Route path="/profile" element={token ? <Profile token={token} onProfilePhotoChange={setUserImage} /> : <Navigate to="/login" replace />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/kelime-avi" element={<SelectLevel game="kelime-avi" />} />
        <Route path="/kelime-avi-game" element={<WordHuntGame />} />
        <Route path="/yazi-yazma" element={<SelectLevel game="yazi-yazma" />} />
        <Route path="/yazi-yazma-game" element={<WritingGame />} />
        <Route path="/bosluk-doldurma" element={<FillInTheBlanksGame />} />
        <Route path="/essay-writing" element={<EssayWriting />} />
        <Route path="/rankings" element={<Rankings token={token} />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/words" element={<Words />} />
        <Route path="/history" element={<History token={token} />} />
        <Route path="/exam/:testId" element={<Exam />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
