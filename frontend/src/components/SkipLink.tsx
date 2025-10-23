import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      style={{
        position: 'fixed',
        left: 8,
        top: 8,
        padding: '8px 12px',
        background: '#ffffff',
        color: '#0d47a1',
        border: '2px solid #0d47a1',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 2000,
        transform: 'translateY(-120%)',
        transition: 'transform 120ms ease',
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-120%)';
      }}
    >
      İçeriğe atla
    </a>
  );
};

export default SkipLink;
