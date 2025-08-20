import React from 'react';

const footerStyle: React.CSSProperties = {
  width: '100%',
  background: '#19376D',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 0 4px 0',
  minHeight: '48px',
  maxHeight: '8.3vh', // 1/12 oranı yaklaşık
  fontSize: 15,
  position: 'relative',
  left: 0,
  bottom: 0,
  zIndex: 100,
  marginTop: 'auto',
};

const iconStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: 22,
  margin: '0 10px',
  verticalAlign: 'middle',
  transition: 'color 0.2s',
};

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={{ marginBottom: 2, display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="https://github.com/YavuzMollahamzaoglu" target="_blank" rel="noopener noreferrer" style={iconStyle} title="GitHub">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/yavuz-mollahamzaoğlu-59a2531b9" target="_blank" rel="noopener noreferrer" style={iconStyle} title="LinkedIn">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
        </a>
        <a href="mailto:ingilizcehazirlikdestek@gmail.com" style={iconStyle} title="Mail">
          {/* Daha belirgin bir zarf ikonu (Heroicons'dan alınan) */}
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75zm1.5 0v.638l8.25 6.188 8.25-6.188V6.75a.75.75 0 0 0-.75-.75h-15a.75.75 0 0 0-.75.75zm16.5 1.974-7.728 5.797a.75.75 0 0 1-.894 0L3.75 8.724v8.526c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V8.724z"/></svg>
        </a>
      </div>
      <div style={{ fontSize: 13, color: '#e3eafc', marginTop: 2, textAlign: 'center' }}>
        İletişime geçmek, şikayet ve önerileriniz için:
        <a href="https://github.com/YavuzMollahamzaoglu" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline', margin: '0 8px' }}>GitHub</a>
        |
        <a href="https://www.linkedin.com/in/yavuz-mollahamzaoğlu-59a2531b9" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline', margin: '0 8px' }}>LinkedIn</a>
        |
        <a href="mailto:ingilizcehazirlikdestek@gmail.com" style={{ color: '#fff', textDecoration: 'underline', margin: '0 8px' }}>Mail</a>
      </div>
    </footer>
  );
};

export default Footer;
