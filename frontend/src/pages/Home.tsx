import React, { useEffect } from 'react';
import setMetaTags from '../utils/seo';

const Home: React.FC = () => {
  useEffect(() => {
    setMetaTags({
      title: 'Ana Sayfa — İngilizce Hazırlık',
      description: 'İngilizce pratik yapabileceğiniz ücretsiz testler, kelime çalışmaları ve dinleme alıştırmaları.',
      keywords: 'ingilizce hazırlık, ücretsiz testler, kelime çalışmaları',
      canonical: '/',
      ogImage: '/social-preview.svg'
    });
  }, []);

  return (
    <div>
      <h1>İngilizce Hazırlık</h1>
      <p>Ücretsiz İngilizce testleri, kelime çalışmaları ve sınav pratikleri.</p>
    </div>
  );
};

export default Home;
