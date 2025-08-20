# summer-internship 2024-2025 

First of all this project will be my 	graduation project from ALKU and i want to do something on my mind whole year. It is about Erasmus exam website with this I will provide questions for people that want to gain exercise about exam.

Technologies I will use;
1) React.js
2) Prisma.js
3) MySQL
4) MUI
5) Figma

Firstly i will improve myself with this technologies than i will start with design of my front-end than i will start combine my data structure with coding all login and questions will be combined with MySQL that is why i prefer Prisma.js for relational database implementing it to my application.
For coding of frontend i will use Next.js for SEO using of it.

This is my first ideas for my intership finish project with time i will improve it.

# Erasmus Exam Page Backend

Bu backend Express.js ve Prisma ORM kullanılarak geliştirilmiştir. Kullanıcılar, sınavlar, sıralamalar, yorumlar ve profil fotoğrafları gibi temel işlevleri sağlar.

## Özellikler
- Kullanıcı kimlik doğrulama (JWT)
- Sınav ve soru yönetimi
- Sıralama tablosu ve puan kaydı
- Yorum ekleme ve listeleme
- Profil fotoğrafı yükleme
- SQLite veritabanı (Prisma ORM ile)

## Başlatma
1. Gerekli paketleri yükleyin:
   ```sh
   npm install
   ```
2. Veritabanı migrasyonlarını çalıştırın:
   ```sh
   npx prisma migrate deploy
   ```
3. Sunucuyu başlatın:
   ```sh
   npm start
   ```

## API Endpointleri
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Profil bilgisi
- `POST /api/auth/upload-profile-photo` - Profil fotoğrafı yükle
- `GET /api/rankings` - Sıralama tablosu
- `POST /api/rankings` - Sıralamaya ekle
- `GET /api/tests/:testId/questions` - Sınav soruları
- `POST /api/history` - Sınav geçmişi kaydet
- `GET /api/comments?exam=EXAM` - Yorumları getir
- `POST /api/comments` - Yorum ekle

## Ortam Değişkenleri
- `.env` dosyasında veritabanı ve JWT ayarlarını yapabilirsiniz.

## Kendi Bilgisayarında Kurmak İçin

1. **Node.js ve npm kurulu olmalı.**
   - [Node.js İndir](https://nodejs.org/)
2. **Projeyi GitHub'dan klonlayın:**
   ```sh
   git clone https://github.com/YavuzMollahamzaoglu/erasmus-exam-page.git
   cd erasmus-exam-page/backend
   ```
3. **Gerekli paketleri yükleyin:**
   ```sh
   npm install
   ```
4. **Veritabanı ayarlarını yapın:**
   - `.env` dosyasını oluşturun ve veritabanı bağlantı bilgisini girin (örnek: `DATABASE_URL="file:./dev.db"`)
5. **Veritabanı migrasyonlarını çalıştırın:**
   ```sh
   npx prisma migrate deploy
   ```
6. **Sunucuyu başlatın:**
   ```sh
   npm start
   ```
7. **Frontend'i başlatmak için:**
   - Ana dizine (`erasmus-exam-page/frontend`) gidin ve aynı şekilde `npm install` ve `npm start` komutlarını çalıştırın.

Artık backend ve frontend localde çalışacaktır. API endpointlerini ve web arayüzünü test edebilirsiniz.

## Geliştirici
- Yavuz Mollahamzaoğlu

---
Daha fazla bilgi için kodu inceleyin veya sorularınızı iletin.
