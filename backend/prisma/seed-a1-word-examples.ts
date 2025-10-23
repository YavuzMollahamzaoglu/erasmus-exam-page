// This file is intentionally left blank. No longer used.


import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const examples = [
  {
    english: "apple",
  // Çoklu örnek cümleler kaldırıldı. Artık kullanılmıyor.
        sentence: "My teacher is very kind.",
        translation: "Öğretmenim çok naziktir.",
      },
      {
        sentence: "The teacher is in the classroom.",
        translation: "Öğretmen sınıfta.",
      },
      {
        sentence: "I asked my teacher a question.",
        translation: "Öğretmenime bir soru sordum.",
      },
    ],
  },
  {
    english: "school",
    sentences: [
      { sentence: "My school is very big.", translation: "Okulum çok büyük." },
      {
        sentence: "I go to school every day.",
        translation: "Her gün okula giderim.",
      },
      {
        sentence: "The school is near my house.",
        translation: "Okul evime yakın.",
      },
    ],
  },
  {
    english: "table",
    sentences: [
      {
        sentence: "The table is made of wood.",
        translation: "Masa tahtadan yapılmış.",
      },
      {
        sentence: "There are books on the table.",
        translation: "Masada kitaplar var.",
      },
      {
        sentence: "Please clean the table.",
        translation: "Lütfen masayı temizle.",
      },
    ],
  },
  {
    english: "house",
    sentences: [
      { sentence: "My house is white.", translation: "Evimiz beyaz." },
      {
        sentence: "We live in a big house.",
        translation: "Büyük bir evde yaşıyoruz.",
      },
      {
        sentence: "There is a garden behind the house.",
        translation: "Evin arkasında bir bahçe var.",
      },
    ],
  },
  {
    english: "car",
    sentences: [
      {
        sentence: "My father has a red car.",
        translation: "Babamın kırmızı bir arabası var.",
      },
      { sentence: "The car is very fast.", translation: "Araba çok hızlı." },
      {
        sentence: "We washed the car together.",
        translation: "Arabayı birlikte yıkadık.",
      },
    ],
  },
  {
    english: "mother",
    sentences: [
      { sentence: "My mother is a teacher.", translation: "Annem öğretmen." },
      {
        sentence: "I love my mother very much.",
        translation: "Annemi çok severim.",
      },
      {
        sentence: "My mother cooks delicious meals.",
        translation: "Annem lezzetli yemekler yapar.",
      },
    ],
  },
  {
    english: "water",
    sentences: [
      {
        sentence: "I drink water every day.",
        translation: "Her gün su içerim.",
      },
      { sentence: "The water is cold.", translation: "Su soğuk." },
      {
        sentence: "Can I have a glass of water?",
        translation: "Bir bardak su alabilir miyim?",
      },
    ],
  },
  {
    english: "sun",
    sentences: [
      { sentence: "The sun is shining.", translation: "Güneş parlıyor." },
      {
        sentence: "The sun rises in the east.",
        translation: "Güneş doğudan doğar.",
      },
      {
        sentence: "We played under the sun.",
        translation: "Güneşin altında oynadık.",
      },
    ],
  },
  {
    english: "cat",
    sentences: [
      {
        sentence: "The cat is sleeping on the sofa.",
        translation: "Kedi kanepede uyuyor.",
      },
      { sentence: "I have a black cat.", translation: "Siyah bir kedim var." },
      { sentence: "The cat likes milk.", translation: "Kedi süt sever." },
    ],
  },
];
// A2 seviyesindeki kelimeler ve örnek cümleleri
const a2Examples = [
  {
    english: "people",
    sentences: [
      {
        sentence: "People is very important in our life.",
        translation: "İnsanlar hayatımızda çok önemlidir.",
      },
      {
        sentence: "I saw many people yesterday.",
        translation: "Dün birçok insan gördüm.",
      },
      {
        sentence: "Do you like people?",
        translation: "İnsanları sever misin?",
      },
    ],
  },
  {
    english: "history",
    sentences: [
      {
        sentence: "History is very important in our life.",
        translation: "Tarih hayatımızda çok önemlidir.",
      },
      {
        sentence: "I saw many history yesterday.",
        translation: "Dün birçok tarih gördüm.",
      },
      { sentence: "Do you like history?", translation: "Tarih sever misin?" },
    ],
  },
  {
    english: "way",
    sentences: [
      {
        sentence: "Way is very important in our life.",
        translation: "Yol hayatımızda çok önemlidir.",
      },
      {
        sentence: "I saw many way yesterday.",
        translation: "Dün birçok yol gördüm.",
      },
      { sentence: "Do you like way?", translation: "Yol sever misin?" },
    ],
  },
  {
    english: "art",
    sentences: [
      {
        sentence: "Art is very important in our life.",
        translation: "Sanat hayatımızda çok önemlidir.",
      },
      {
        sentence: "I saw many art yesterday.",
        translation: "Dün birçok sanat gördüm.",
      },
      { sentence: "Do you like art?", translation: "Sanat sever misin?" },
    ],
  },
  {
    english: "world",
    sentences: [
      {
        sentence: "World is very important in our life.",
        translation: "Dünya hayatımızda çok önemlidir.",
      },
      {
        sentence: "I saw many world yesterday.",
        translation: "Dün birçok dünya gördüm.",
      },
      { sentence: "Do you like world?", translation: "Dünya sever misin?" },
    ],
  },
  {
    english: "information",
    sentences: [
      {
        sentence: "Information is very important in our life.",
        translation: "Bilgi hayatımızda çok önemlidir.",
      },
      {
        sentence: "I saw many information yesterday.",
        translation: "Dün birçok bilgi gördüm.",
      },
      {
        sentence: "Do you like information?",
        translation: "Bilgi sever misin?",
      },
    ],
  },
  {
    english: "map",
    sentences: [
      {
        sentence: "Map is very important in our life.",
        translation: "Harita hayatımızda çok önemlidir.",
      },
      {
        sentence: "I saw many map yesterday.",
        translation: "Dün birçok harita gördüm.",
      },
      { sentence: "Do you like map?", translation: "Harita sever misin?" },
    ],
  },
];
// B1 seviyesindeki kelimeler ve örnek cümleleri
// Çoklu örnek cümleler kaldırıldı. Artık kullanılmıyor.
      },
      {
        sentence: "I often use the word a.m. in a sentence.",
        translation:
          "Ben sık sık öğleden önce kelimesini bir cümlede kullanırım.",
      },
      {
        sentence: "Can you give me an example with a.m.?",
        translation: "Bana öğleden önce ile bir örnek verebilir misin?",
      },
    ],
  },
  {
    english: "across",
    sentences: [
      {
        sentence: "Across is important in daily life.",
        translation: "Karşısında, karşıya günlük hayatta önemlidir.",
      },
      {
        sentence: "I often use the word across in a sentence.",
        translation:
          "Ben sık sık karşısında, karşıya kelimesini bir cümlede kullanırım.",
      },
      {
        sentence: "Can you give me an example with across?",
        translation: "Bana karşısında, karşıya ile bir örnek verebilir misin?",
      },
    ],
  },
  {
    english: "act",
    sentences: [
      {
        sentence: "Act is important in daily life.",
        translation: "Hareket etmek, rol yapmak günlük hayatta önemlidir.",
      },
      {
        sentence: "I often use the word act in a sentence.",
        translation:
          "Ben sık sık hareket etmek, rol yapmak kelimesini bir cümlede kullanırım.",
      },
      {
        sentence: "Can you give me an example with act?",
        translation:
          "Bana hareket etmek, rol yapmak ile bir örnek verebilir misin?",
      },
    ],
  },
  {
    english: "actor",
    sentences: [
      {
        sentence: "Actor is important in daily life.",
        translation: "Aktör günlük hayatta önemlidir.",
      },
      {
        sentence: "I often use the word actor in a sentence.",
        translation: "Ben sık sık aktör kelimesini bir cümlede kullanırım.",
      },
      {
        sentence: "Can you give me an example with actor?",
        translation: "Bana aktör ile bir örnek verebilir misin?",
      },
    ],
  },
  {
    english: "actually",
    sentences: [
      {
        sentence: "Actually is important in daily life.",
        translation: "Aslında günlük hayatta önemlidir.",
      },
      {
        sentence: "I often use the word actually in a sentence.",
        translation: "Ben sık sık aslında kelimesini bir cümlede kullanırım.",
      },
      {
        sentence: "Can you give me an example with actually?",
        translation: "Bana aslında ile bir örnek verebilir misin?",
      },
    ],
  },
  {
    english: "adventure",
    sentences: [
      {
        sentence: "Adventure is important in daily life.",
        translation: "Macera günlük hayatta önemlidir.",
      },
      {
        sentence: "I often use the word adventure in a sentence.",
        translation: "Ben sık sık macera kelimesini bir cümlede kullanırım.",
      },
      {
        sentence: "Can you give me an example with adventure?",
        translation: "Bana macera ile bir örnek verebilir misin?",
      },
    ],
  },
];

// B1 kelimelerini de seed'le
// Çoklu örnek cümleler kaldırıldı. Artık kullanılmıyor.

async function main() {
  // Çoklu örnek cümleler kaldırıldı. Artık kullanılmıyor.
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
