import React, { useState } from 'react';

interface Props {
  token?: string;
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(25,55,109,0.10)',
  padding: '24px',
  minWidth: '220px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
};

const iconStyle: React.CSSProperties = {
  fontSize: '32px',
  marginBottom: '8px',
  color: '#19376D',
};

const searchItems = [
  { label: 'Erasmus Hazırlık', url: '/categories' },
  { label: 'Genel İngilizce', url: '/categories' },
  { label: 'Üniversite Hazırlık', url: '/categories' },
  { label: 'Seri Soru Çözümü', url: '/kelime-avi' },
  { label: 'Yazı Yazma', url: '/yazi-yazma' },
  { label: 'Essay', url: '/bosluk-doldurma' },
  { label: 'Profil', url: '/profile' },
  { label: 'Kategoriler', url: '/categories' },
  { label: 'Sınavlar', url: '/questions' },
  { label: 'Sıralamalar', url: '/rankings' },
];

const HomePage: React.FC<Props> = ({ token }) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = searchItems.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase()) && search.length > 0
  );

  return (
    <div style={{ minHeight: '100vh', background: '#b2dfdb', padding: '0 0 48px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        <h1 style={{ color: '#19376D', fontWeight: 800, fontSize: 44, textAlign: 'center', marginBottom: 8 }}>Hazırlığını Başlat</h1>
        <div style={{ color: '#19376D', fontSize: 22, textAlign: 'center', marginBottom: 32 }}>
          İngilizce Sınavlarına Güçlü Bir Başlangıç Yap
        </div>
        {/* Site Search Bar with Autocomplete */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
            <input
              type="text"
              placeholder="Site içi arama..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: 18,
                borderRadius: 8,
                border: '1px solid #b6d4fa',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(25,55,109,0.05)',
                color: '#19376D',
                background: '#fff',
                fontWeight: 500,
                transition: 'border 0.2s',
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            {showDropdown && filtered.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(25,55,109,0.10)',
                zIndex: 10,
                border: '1px solid #e3eafc',
                padding: '4px 0',
              }}>
                {filtered.map(item => (
                  <div
                    key={item.label}
                    style={{
                      padding: '10px 20px',
                      fontSize: 17,
                      color: '#19376D',
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'background 0.15s',
                    }}
                    onMouseDown={() => {
                      window.location.href = item.url;
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sınav Türleri */}
        <h2 style={{ color: '#19376D', fontWeight: 700, fontSize: 26, marginBottom: 16 }}>Sınav Türleri</h2>
        <div style={{ display: 'flex', gap: 18, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={cardStyle}>
            <span style={iconStyle}>🎓</span>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Erasmus Hazırlık</div>
            <div style={{ color: '#64748b', fontSize: 16 }}>Cesitli egitim duzeydeki universitelrin erasmus sinavlari incelenerek hazirlanmis sorular ve testler</div>
          </div>
          <div style={cardStyle}>
            <span style={iconStyle}>✅</span>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Genel İngilizce</div>
            <div style={{ color: '#64748b', fontSize: 16 }}>Genel seviye belirleme yds ve okullardaki genel sinavlara hazirlik kategorisnde olup bir cok kaynaktam toplanarak hazirlanmis testler</div>
          </div>
          <div style={cardStyle}>
            <span style={iconStyle}>🏛️</span>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Üniversite Hazırlık</div>
            <div style={{ color: '#64748b', fontSize: 16 }}>universite hazirlik gecme sinavlari icin birebir sinavlar gorece erasmus ve genel ingilizce sinavlarindan daha zor olmakla birlikte universitelerin ornek sinavlarindam hazirlanarak hazirlanmistir</div>
          </div>
        </div>

        {/* Kategorilerimiz */}
        <div style={{ background: '#e3eafc', borderRadius: 12, padding: 18, marginBottom: 32, textAlign: 'center', fontSize: 18, color: '#19376D', fontWeight: 600 }}>
          Kategorilerimiz: Okuma, Yazma, Dinleme, Kelime, Essay ve daha fazlası ile seviyene uygun içerikler ile ingilizceni gelistir hem egitim hem gunluk hayatta ingilizce kullanmaya basla!
        </div>

        {/* Oyunlarımız */}
        <h2 style={{ color: '#19376D', fontWeight: 700, fontSize: 26, marginBottom: 16 }}>Oyunlarımız</h2>
        <div style={{ display: 'flex', gap: 18, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={cardStyle}>
            <span style={iconStyle}>🔢</span>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Seri Soru Çözümü</div>
            <div style={{ color: '#64748b', fontSize: 16 }}>A1 A2 B1 B2 seviyelerinde ardışık kelime bulma oyunu bu oyunla kelime haznenizi gelistirecek ve grammeri daha iyi sekilde birlestirip anlayacaksiniz</div>
          </div>
          <div style={cardStyle}>
            <span style={iconStyle}>⌨️</span>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Yazı Yazma</div>
            <div style={{ color: '#64748b', fontSize: 16 }}>Türkçe kelimenin İngilizcesini yaz, anında geri bildirim al essay mektup dilekce ve profesyonel yazismalarda hatayi en aza indir</div>
          </div>
          <div style={cardStyle}>
            <span style={iconStyle}>📝</span>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Essay</div>
            <div style={{ color: '#64748b', fontSize: 16 }}>yapay zeka tarafindan degerlendirelecek essayler yazabilirsiniz ve kac puan alcaginizi gorursunuz her turlu seviyeye uyan bu oyunumuz lise ve erasmus sinavina hazirlananlar icin bire bir</div>
          </div>
        </div>

        {/* Neden Kayıt Olmalısınız? - Sadece login olmamış kullanıcılar için */}
        {!token && (
          <>
            <h2 style={{ color: '#19376D', fontWeight: 700, fontSize: 26, marginBottom: 16 }}>Neden Kayıt Olmalısınız?</h2>
            <div style={{ display: 'flex', gap: 18, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={cardStyle}>
                <span style={iconStyle}>👤</span>
                <div style={{ fontWeight: 700, fontSize: 20 }}>Profil oluşturup ilerleme kaydetme</div>
                <div style={{ color: '#64748b', fontSize: 16 }}>Profil oluşturup puan ve ilerlemeni takip edebilirsin</div>
              </div>
              <div style={cardStyle}>
                <span style={iconStyle}>💬</span>
                <div style={{ fontWeight: 700, fontSize: 20 }}>Yorum yapabilme</div>
                <div style={{ color: '#64748b', fontSize: 16 }}>Sorulara ve testlere yorum ekleyebilirsin</div>
              </div>
              <div style={cardStyle}>
                <span style={iconStyle}>📊</span>
                <div style={{ fontWeight: 700, fontSize: 20 }}>Geçmiş sonuçları görüntüleyebilme</div>
                <div style={{ color: '#64748b', fontSize: 16 }}>Daha önceki sınav ve oyun sonuçlarını görebilirsin</div>
              </div>
            </div>

            {/* Kayıt Ol Button - Sadece login olmamış kullanıcılar için */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
              <button style={{ background: '#ff6b0a', color: '#fff', fontWeight: 700, fontSize: 20, borderRadius: 8, padding: '12px 48px', border: 'none', boxShadow: '0 2px 8px rgba(255,107,10,0.10)', cursor: 'pointer' }}
                onClick={() => window.location.href = '/register'}>
                Kayıt Ol
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
