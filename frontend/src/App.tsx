import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import AppRouter from './AppRouter';
import Footer from './components/Footer';


function App() {
  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppRouter />
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
