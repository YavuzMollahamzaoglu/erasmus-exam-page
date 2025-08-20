import React from 'react';
import AppRouter from './AppRouter';
import Footer from './components/Footer';


function App() {
  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppRouter />
      <Footer />
    </div>
  );
}

export default App;
