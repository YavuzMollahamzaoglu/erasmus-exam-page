import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';

type Topic = { title: string; summary: string; example: string; tip?: string };
type LevelKey = 'A1' | 'A2' | 'B1' | 'B2';
const topicsData: Partial<Record<LevelKey, Topic[]>> = {
  A1: [
    { title: 'To Be Fiili: "am", "is", "are" çekimleri ve olumlu, olumsuz, soru cümleleri', summary: '', example: '', tip: '' },
    { title: 'Simple Present Tense: Günlük rutinler, "do/does" kullanımı ve geniş zamanı anlatan diğer yapılar', summary: 'Tanım:\nSimple Present Tense, İngilizcede geniş zaman olarak bilinir ve alışkanlıklar, genel gerçekler, tekrarlanan eylemler ve rutinler için kullanılır.\n\nKullanım:\nOlumlu cümlelerde özne + fiil (he/she/it ile fiile -s takısı eklenir).\nOlumsuz cümlelerde don’t/doesn’t yardımcı fiili kullanılır, fiil yalın kalır.\nSoru cümlelerinde do/does başa gelir, fiil yine yalın olur.\n\nÖnemli Noktalar:\n- He/she/it ile olumlu cümlede fiile -s takısı gelir.\n- Olumsuz ve soru cümlelerinde -s takısı kullanılmaz.\n- Sıklık zarfları (always, usually, often, sometimes, never) geniş zamanda sıkça kullanılır.\n- Genel doğrular, alışkanlıklar ve tekrar eden olaylar için uygundur.\n\nZaman İfadeleri:\n- every day, always, usually, often, sometimes, never, on Sundays, in the morning gibi ifadeler geniş zamanla kullanılır.', example: 'Olumlu:\n- I walk to school every morning.\n- She drinks tea at breakfast.\n- The shop opens at 9 o’clock.\n- He plays football on weekends.\n- They study English on Mondays.\n\nOlumsuz:\n- I do not (don’t) eat meat.\n- He does not (doesn’t) like coffee.\n- We do not watch TV at night.\n- She does not go to the gym.\n- It does not rain much here.\n\nSoru:\n- Do you play chess?\n- Does he live in this city?\n- Do they come to school by bus?\n- Does your mother cook well?\n- Do we have class today?', tip: '' },
    {
      title: 'Present Continuous Tense: Şimdiki zamanı ve devam eden eylemleri ifade etmek için kullanılır',
      summary: 'Tanım:\nPresent Continuous Tense, İngilizcede şimdiki zamanı anlatır. Konuşma anında yapılan işleri, geçici durumları ve yakın gelecekte planlanan olayları ifade etmek için kullanılır.\n\nKullanım:\nCümle yapısı: özne + am/is/are + fiil-ing\nOlumlu: I am reading. / She is playing. / We are watching TV.\nOlumsuz: I am not reading. / He is not playing. / They are not coming.\nSoru: Are you listening? / Is he sleeping? / Am I late?\n\nÖnemli Noktalar:\n- Şu anda olan veya geçici olarak devam eden eylemler için kullanılır.\n- "Now, at the moment, today, this week" gibi zaman ifadeleriyle sıkça kullanılır.\n- "Always, constantly, forever" gibi kelimelerle şikayet belirtmek için de kullanılabilir.\n- State verbs (love, know, understand, have, want, need, like, belong, see, hear, taste, smell, believe, prefer, own, seem, appear, contain, consist, include) genellikle -ing ile kullanılmaz.\n- Fiil + -ing ekinde yazım kurallarına dikkat edilir: run-running, swim-swimming, write-writing, make-making.\n\nZaman İfadeleri:\n- now, at the moment, right now, today, this week, currently, look!, listen!\n\n',
      example: 'Olumlu:\n- I am eating breakfast now.\n- She is studying in her room.\n- We are playing football at the park.\n- They are watching a movie.\n- The baby is sleeping.\n\nOlumsuz:\n- I am not going to the party.\n- He is not listening to music.\n- We are not working today.\n- She is not wearing a jacket.\n- It is not raining.\n\nSoru:\n- Are you coming with us?\n- Is he reading a book?\n- Are they waiting for the bus?\n- Is it snowing?\n- Am I speaking too fast?\n\nŞikayet/Alışkanlık:\n- She is always losing her keys.\n- He is constantly talking during class.\n- You are forever forgetting your homework.',
      tip: ''
    },
    {
      title: 'Temel Soru Kalıpları: "What, Where, When, Who, Why, How" gibi soru kelimeleri',
      summary: 'Tanım:\nİngilizcede iki ana soru tipi vardır: Yes/No Questions (evet/hayır ile cevaplanan) ve WH Questions (soru kelimeleriyle başlayan). WH Questions, bilgi almak için kullanılır ve cevabı evet/hayır değildir.\n\nKullanım:\nSoru kelimesi (What, Where, When, Who, Why, How, Which, Whose, How many, How much, How long, How far, How often) + yardımcı fiil + özne + fiil\n\nÖnemli Noktalar:\n- Soru kelimesinden sonra genellikle yardımcı fiil gelir.\n- "Who" ve "What" bazen özne olarak kullanılır, bu durumda yardımcı fiil gelmez.\n- "How" ile farklı sorular türetilebilir: how many, how much, how long, how far, how often, how old, how tall, how fast, how heavy.\n\nSık Kullanılan Soru Kelimeleri ve Örnekler:\nWhat: What is your name?\nWhere: Where do you live?\nWhen: When do you get up?\nWho: Who plays the piano?\nWhose: Whose bag is this?\nWhich: Which book do you want?\nWhy: Why are you sad?\nHow: How are you today?\nHow many: How many students are there?\nHow much: How much water do you drink?\nHow long: How long is the lesson?\nHow far: How far is your school?\nHow often: How often do you play tennis?',
      example: 'Olumlu/Soru Örnekleri:\n- What do you do after school?\n- Where is your brother?\n- When does the lesson start?\n- Who helps you with homework?\n- Whose pencil is this?\n- Which color do you like?\n- Why are you laughing?\n- How do you go to school?\n- How many apples are there?\n- How much money do you have?\n- How long does it take to get home?\n- How far is the park from here?\n- How often do you visit your grandparents?',
      tip: ''
    },
    {
      title: 'Modal Fiiller: "Can", "Could", "Be able to" (yetenek bildiren fiiller)',
      summary: 'Tanım:\n"Can" fiili, bir kişinin veya nesnenin bir işi yapabilme yeteneğini, imkânını veya olasılığını belirtir. Türkçede "-ebilmek/-abilmek" anlamına gelir. "Could" geçmiş zaman hali, "be able to" ise tüm zamanlarda yetenek veya imkân anlatmak için kullanılır.\n\nKullanım:\nOlumlu: özne + can/could/be able to + fiil\nOlumsuz: özne + cannot (can’t)/could not (couldn’t)/be not able to + fiil\nSoru: Can/Could/Be able to + özne + fiil\n\nÖnemli Noktalar:\n- "Can" şimdiki zaman, "could" geçmiş zaman, "be able to" ise tüm zamanlarda kullanılır.\n- "Can" gelecek zaman için kullanılmaz, onun yerine "will be able to" kullanılır.\n- "Could" ve "be able to" geçmişte genel yetenekler için kullanılabilir.\n- "Be able to" bir kereye mahsus başarılan eylemler için zorunludur.\n- Duyu fiillerinde (see, hear, feel) geçmişte hem "could" hem "was/were able to" kullanılabilir.\n\n',
      example: 'Olumlu:\n- I can swim.\n- She can speak Spanish.\n- We can solve this problem.\n- My friend could play the piano when he was a child.\n- The woman was able to lift the box.\n- You will be able to travel next year.\n\nOlumsuz:\n- I can’t drive.\n- He cannot play chess.\n- They couldn’t finish the project.\n- She wasn’t able to come yesterday.\n- I won’t be able to join the meeting.\n\nSoru:\n- Can you help me?\n- Could you open the window?\n- Were you able to find your keys?\n- Will she be able to pass the exam?\n\nOlasılık/İzin:\n- You can see the doctor at 3 o’clock.\n- You can’t buy bread at the pharmacy.\n- Sue can come to the party tonight.',
      tip: ''
    },
    {
      title: 'Zamirler: Kişi zamirleri, iyelik sıfatları ve zamirleri',
      summary: 'Tanım:\nZamirler, isimlerin yerine geçerek cümlede tekrarları önler. İngilizcede zamirler, özne, nesne, iyelik ve dönüşlülük gibi farklı görevlerde kullanılır.\n\nKişi Zamirleri (Subject Pronouns):\nI, you, he, she, it, we, you, they\n\nNesne Zamirleri (Object Pronouns):\nme, you, him, her, it, us, you, them\n\nİyelik Sıfatları (Possessive Adjectives):\nmy, your, his, her, its, our, your, their\n\nİyelik Zamirleri (Possessive Pronouns):\nmine, yours, his, hers, its, ours, yours, theirs\n\nDönüşlülük/Vurgu Zamirleri (Reflexive/Emphatic Pronouns):\nmyself, yourself, himself, herself, itself, ourselves, yourselves, themselves\n\nÖnemli Noktalar:\n- "He, she, it" üçüncü tekil şahıslar için cinsiyet ayrımı yapar.\n- "You" hem tekil hem çoğul için aynıdır.\n- Dönüşlülük zamirleri özneyle aynı kişiyi gösterir.\n- İyelik sıfatı bir ismin önüne gelir, iyelik zamiri ise ismin yerine geçer.',
      example: 'Özne Zamiri:\n- I am ready.\n- She is my friend.\n- They are here.\n\nNesne Zamiri:\n- Give it to me.\n- We saw them at the park.\n- Can you help us?\n\nİyelik Sıfatı:\n- My bag is blue.\n- Their house is big.\n- His car is new.\n\nİyelik Zamiri:\n- This book is mine.\n- Is that yours?\n- The red one is hers.\n\nDönüşlülük/Vurgu Zamiri:\n- I made this myself.\n- She herself cleaned the room.\n- The children can dress themselves.',
      tip: ''
    },
    { title: 'There is / There are: Bir varlığı ifade etmek için kullanılır', summary: '', example: '', tip: '' },
    { title: 'Edatlar (Prepositions): Yer (in, on, under) ve zaman (in, on, at) edatları', summary: '', example: '', tip: '' },
    { title: 'İsimler: Sayılabilen ve sayılamayan isimler ile "a, an, some, any" kullanımı', summary: '', example: '', tip: '' },
    { title: 'Sıfatlar: Renkler, boyutlar ve kişilik gibi temel sıfatlar', summary: '', example: '', tip: '' },
    { title: 'Karşılaştırmalar: Kısa sıfatların karşılaştırma hali ("taller than")', summary: '', example: '', tip: '' },
    { title: 'Emir Cümleleri (Imperatives): "Sit down" veya "Don\'t talk" gibi emir ifadeleri', summary: '', example: '', tip: '' },
    { title: 'Diğer Önemli Konular', summary: '', example: '', tip: '' }
  ],
  A2: [],
  B1: [],
  B2: []
};

const TopicsPage: React.FC = () => {
  const [level, setLevel] = useState<LevelKey>('A1');
  return (
    <Box p={2}>
      <Typography variant="h4">Konular Sayfası</Typography>
      <Tabs value={level} onChange={(_, v) => setLevel(v)} sx={{ mb: 2 }}>
        <Tab label="A1" value="A1" />
        <Tab label="A2" value="A2" />
        <Tab label="B1" value="B1" />
        <Tab label="B2" value="B2" />
      </Tabs>
      <Box>
        {(topicsData[level] && topicsData[level]!.length > 0) ? (
          topicsData[level]!.map((topic, i) => (
            <Box key={i} mb={3}>
              <Typography variant="h6">{topic.title}</Typography>
              {topic.summary && <Typography sx={{ whiteSpace: 'pre-line', mb: 1 }}>{topic.summary}</Typography>}
              {topic.example && <Typography sx={{ whiteSpace: 'pre-line', color: 'grey.700' }}>{topic.example}</Typography>}
              {topic.tip && topic.tip.trim() && <Typography sx={{ fontStyle: 'italic', color: 'primary.main' }}>{topic.tip}</Typography>}
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">Bu seviyede henüz konu eklenmedi.</Typography>
        )}
      </Box>
    </Box>
  );
}


