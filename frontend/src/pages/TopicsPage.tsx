import React, { useState, useEffect } from 'react';
import setMetaTags from '../utils/seo';
import { Paper, Tabs, Tab, Box, Typography, TextField, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';


type Topic = { title: string; summary: string; example: string; tip?: string };
type LevelKey = 'A1' | 'A2' | 'B1' | 'B2';
const topicsData: Record<LevelKey, Topic[]> = {
  A1: [
    {
      title: '"To Be" Fiili (am, is, are)',
      summary: `İngilizce öğrenirken karşınıza çıkacak ilk ve en önemli fiil "to be" (olmak) fiilidir. Bu fiil, bir cümlenin temel taşıdır ve etrafımızdaki nesneleri, kişileri ve durumları nitelemek, özelliklerini, yerlerini ve kimliklerini belirtmek için kullanılır. Türkçedeki "dır/dir, -ım/im, -sın/sin" gibi eklerin İngilizcedeki karşılığıdır.

"To Be" Neden Bu Kadar Önemli?
Türkçede "Jane güzeldir" veya "Mary bir öğretmendir" dediğimizde, bu cümleler isim veya sıfat cümlesi olarak kabul edilir. Ancak İngilizcede her cümlenin mutlaka bir yüklemi (fiili) olmak zorundadır. İşte "to be" fiili, içinde "gitmek, koşmak, yapmak" gibi bir eylem (hareket) barındırmayan bu tür durum, kimlik ve sıfat cümlelerini kurmamızı sağlayan temel fiildir.

"To Be" Fiilinin Temel Kullanım Alanları
"To be" fiili kesinlikle bir eylem (koşmak, gitmek, gelmek) anlatmaz. Bir durumu veya özelliği belirtir.

To be + İsim (Kimlik/Meslek Belirtme)
Mary is a teacher. (Mary bir öğretmendir.)
She is my sister. (O benim kız kardeşim.)
It is Linda's bag. (O Linda'nın çantası.)

To be + Sıfat (Nitelik/Özellik Belirtme)
John is handsome. (John yakışıklıdır.)
His shoes are dirty. (Onun ayakkabıları kirli.)
The movie is wonderful. (Film harika.)
Tom is tired. (Tom yorgun.)

To be + Yer (Konum Belirtme)
Jane is at home. (Jane evde.)
They are in the kitchen. (Onlar mutfaktalar.)

Önemli Kural: "To be" fiilinden sonra asla yalın halde başka bir eylem fiili gelmez.
Yanlış: I am go.
Yanlış: She is study.

"To Be" Fiilinin Zamanlara Göre Çekimleri
"To be" fiili, kullanıldığı zamana ve özneye göre şekil değiştirir.
1. Geniş Zaman (Present Tense): AM / IS / ARE
Bu form, günümüzdeki durumları, genel geçer doğruları ve özellikleri anlatır.

Normal Yazılış    Kısaltma   Türkçe Anlamı
I am              I'm         Ben ...-ım/im
You are           You're      Sen ...-sın/sin
He is             He's        O (erkek) ...-dır/dir
She is            She's       O (kız) ...-dır/dir
It is             It's        O (cansız/hayvan) ...-dır/dir
We are            We're       Biz ...-ız/iz
They are          They're     Onlar ...-dırlar/dirler

Kullanım 1: Durum Bildirme (Simple Present)
I am a lawyer. (Ben bir avukatım.)
We are students. (Biz öğrenciyiz.)

Kullanım 2: Şimdiki Zaman (Present Continuous)
Burada "to be" bir yardımcı fiildir ve asıl fiile -ing eki gelerek eylemin şu anda yapıldığını gösterir.
They are walking on the beach. (Onlar sahilde yürüyorlar.)
He is studying right now. (O şu anda ders çalışıyor.)

2. Geçmiş Zaman (Past Tense): WAS / WERE
Geçmişteki durumları, özellikleri veya konumları belirtmek için kullanılır.
I / He / She / It ile WAS
You / We / They ile WERE

Kullanım 1: Durum Bildirme (Past Simple)
The dog was very hungry. (Köpek çok açtı.)
They were tired. (Onlar yorgundu.)

Kullanım 2: Geçmişte Süreklilik (Past Continuous)
I was playing guitar. (Gitar çalıyordum.)
You were driving. (Araba sürüyordun.)

3. Diğer "To Be" Formları
Been (Perfect Hali): have/has/had gibi yardımcı fiillerden sonra (Perfect Tense) kullanılır.
I have been a mother for 10 years. (10 yıldır anneyim.)
She has been a great host. (Çok iyi bir ev sahibi oldu.)

Being (Gerund Hali): Cümlede özne olarak veya edatlardan sonra kullanılır.
Being healthy is the most important thing. (Sağlıklı olmak en önemli şeydir.)
He is scared of being left alone. (Yalnız kalmaktan korkuyor.)

To be (Infinitive / Mastar Hali): will, should, could, want gibi yapılardan sonra kullanılır.
I will be in Ankara tomorrow. (Yarın Ankara'da olacağım.)
She could be a great doctor. (Harika bir doktor olabilirdi.)

Olumsuz ve Soru Cümleleri (Am / Is / Are)
"To be" fiili ile cümle kurmanın en kolay yanlarından biri, soru ve olumsuz yapılarının basitliğidir.

1. Olumsuz Cümleler (Negatives)
Olumsuz yapmak için am / is / are yardımcı fiilinden sonra "not" kelimesi getirilir.
Normal Yazılış   Kısaltma
I am not (Kısalmaz)
You are not / You aren't
He is not / He isn't
She is not / She isn't
It is not / It isn't
We are not / We aren't
They are not / They aren't

Örnekler:
Tom isn't tired. (Tom yorgun değildir.)
Shops aren't closed. (Dükkanlar kapalı değildir.)
Beyza isn't playing basketball. (Beyza basketbol oynamıyor.)

2. Soru Cümleleri (Questions)
Soru yapmak için am / is / are yardımcı fiili cümlenin başına getirilir.
Is Tom tired? (Tom yorgun mu?)
Are shops closed? (Mağazalar kapalı mı?)
Is Jane at home? (Jane evde mi?)

"To Be" ile Sık Kullanılan Sıfatlar
Kişilik Sıfatları: Patient, Honest, Talkative, Shy, Hardworking, Lazy, Angry
Dış Görünüş Sıfatları: Beautiful, Handsome, Tall, Short, Thin, Overweight, Curly
Diğer Genel Sıfatlar: Good/Bad, New/Old, Big/Little, Important, Correct/Wrong

"To Be" İçeren Yaygın Deyimler
To be in hot water: Başı belada olmak.
To be over the moon: Çok mutlu olmak.
To be in the same boat: Aynı durumda olmak.
To be on the fence: Kararsız olmak.
To be under the weather: Keyifsiz hissetmek.
To be a piece of cake: Çok kolay olmak.
`,
      example: ''
    },
    {
      title: 'Simple Present Tense (Geniş Zaman)',
      summary: `Simple Present Tense, Türkçedeki geniş zamanın karşılığıdır ve İngilizcede en yaygın kullanılan zaman kiplerinden biridir. Temel olarak alışkanlıkları, değişmeyen durumları, genel gerçekleri ve planlanmış eylemleri ifade etmek için kullanılır.

## 📌 Simple Present Tense Ne Zaman Kullanılır?
Geniş zamanın kullanıldığı başlıca durumlar şunlardır:

Rutinler, Alışkanlıklar ve Tekrarlanan Eylemler
Belli bir süre zarfında veya düzenli olarak tekrarlanan eylemleri anlatır.
I drink two cups of coffee every morning. (Her sabah iki fincan kahve içerim.)
He goes to the theater once a week. (O, haftada bir kez tiyatroya gider.)

Genel Geçer Gerçekler ve Doğrular
Herkes tarafından bilinen, bilimsel veya değişmez gerçekleri ifade ederken kullanılır.
The sun sets in the west. (Güneş batıdan batar.)
Water boils at 100°C. (Su, 100 derecede kaynar.)
Cats like milk. (Kediler süt sever.)

Değişmeyen Durumlar, Duygular ve Arzular
Uzun süreli devam eden durumları, hisleri, düşünceleri veya tercihleri belirtir.
She works in London. (O, Londra'da çalışır.)
I like chocolate. (Çikolata severim.)
I don’t believe you. (Sana inanmıyorum.)

Planlanmış Eylemler ve Zaman Çizelgeleri
Gelecek zamanda gerçekleşmesi kesin olan, bir takvime veya programa (otobüs, tren, sınav, ders) bağlanmış olayları anlatırken kullanılır. Cümle gelecek zaman anlamı taşısa da yapı olarak geniş zamandır.
The exam starts at 10 o’clock tomorrow. (Sınav yarın saat 10'da başlıyor.)
My family come to us on Monday. (Ailem pazartesi günü bize geliyor.)
The train leaves every morning at 8 am. (Tren her sabah saat 8'de kalkar.)

Talimatlar ve Yön Bildirme
Birine talimat verirken veya yol tarifi yaparken kullanılır (Emir cümleleri).
You take the No:12 bus to Kadıköy. (Kadıköy'e gitmek için 12 No'lu otobüse binersiniz.)
Follow the rules! (Kurallara uy!)

Hikaye Anlatımı
Özellikle masal, fıkra veya kitap özetlerinde hikaye anlatırken olayları daha canlı aktarmak için kullanılır.
The giant attacks the city. (Dev şehre saldırır.)

## ⚙️ Simple Present Tense Cümle Yapısı
Geniş zamanda cümle kurmak için "do" ve "does" yardımcı fiilleri kullanılır. Ancak bu yardımcı fiiller çoğunlukla olumsuz ve soru cümlelerinde ortaya çıkar.

### 1. Olumlu Cümleler (Affirmative)
Formül oldukça basittir. Özneden sonra fiilin 1. hali (V1) getirilir.
Kural: Subject + Verb (V1) + Object
Buradaki en önemli kural, üçüncü tekil şahıslarda (He, She, It) fiilin sonuna "-s" takısı almasıdır.
I / You / We / They + Verb (V1)
He / She / It + Verb (V1) + s
Örnekler:
You work at the weekends. (Hafta sonları çalışırsın.)
She gets up early. (O, erken kalkar.)
My dad goes to work every day. (Babam her gün işe gider.)

DİKKAT: Özneye dikkat edin. "Bizim arkadaşımız" gibi ifadeler tekil sayılır.
Our friend lives in London. (Bizim arkadaşımız Londra'da yaşar.)(Burada özne "biz" değil, "bizim arkadaşımız"dır, yani "he" veya "she"dir.)

### 2. Olumsuz Cümleler (Negative)
Olumsuz cümle yapmak için don't (do not) veya doesn't (does not) yardımcı fiilleri kullanılır.
Kural: Subject + do/does + not + Verb (V1) + Object
I / You / We / They + don't + Verb (V1)
He / She / It + doesn't + Verb (V1)
Önemli Kural: Üçüncü tekil şahıslarda (He, She, It) olumsuz cümle kurarken doesn't kullanıldığı için, asıl fiil "-s" takısı almaz ve mastar (yalın) halde kalır.
Örnekler:
I don’t drink milk. (Süt içmem.)
We don’t speak Turkish. (Türkçe konuşmayız.)
She doesn’t like football. (O, futbolu sevmez.)
He doesn’t want ice cream. (O, dondurma istemez.)

### 3. Soru Cümleleri (Interrogative)
Soru yapmak için Do veya Does yardımcı fiilleri cümlenin başına getirilir.
Kural: Do/Does + Subject + Verb (V1) + Object?
Do + I / You / We / They + Verb (V1)?
Does + He / She / It + Verb (V1)?
Önemli Kural: Tıpkı olumsuz cümlede olduğu gibi, soru cümlesinde de Does kullanıldığı için asıl fiil "-s" takısı almaz ve mastar (yalın) halde kalır.
Örnekler:
Do I like Maths? (Matematiği sever miyim?)
Do they play football? (Onlar futbol oynar mı?)
Does it eat dried cat food? (O, kuru kedi maması yer mi?)
Does she want ice cream? (O, dondurma istiyor mu?)

### 💡 "-s Takısı" İçin Hatırlatıcı Senaryo
Geniş zamanı bir şirket gibi düşünün. Does ve doesn’t şirketin patronları, -s takısı ise sekreterdir.
Olumlu Durum: Şirkette her şey yolundayken (cümle olumlu), tüm işlere sekreter (-s) bakar. ( She works. )
Olumsuz Durum / Sorun: Şirkette bir sorun (olumsuz cümle) veya bir soru (soru cümlesi) olduğunda, patronlar (doesn’t / Does) devreye girer. Patronlar gelince sekreter (-s) doğal olarak aradan çekilir.
She doesn’t work. (Patron geldi, -s gitti.)
Does she work? (Patron geldi, -s gitti.)

## 📖 Özet Tablo: Fiil Çekimleri
Olumlu (Affirmative)Olumsuz (Negative)Soru (Interrogative)I sleep (Uyurum)I don't sleep (Uyumam)Do I sleep? (Uyur muyum?)You sleep (Uyursun)You don't sleep (Uyumazsın)Do you sleep? (Uyur musun?)He/She/It sleeps (O uyur)He/She/It doesn't sleep (O uyumaz)Does he/she/it sleep? (O uyur mu?)We sleep (Uyuruz)We don't sleep (Uyumayız)Do we sleep? (Uyur muyuz?)You sleep (Uyursunuz)You don't sleep (Uyumazsınız)Do you sleep? (Uyur musunuz?)They sleep (Uyurlar)They don't sleep (Uyumazlar)Do they sleep? (Uyurlar mı?)

## ✍️ Üçüncü Tekil Şahıs (-s, -es, -ies) Kuralları
"He, She, It" özneleriyle olumlu cümle kurarken fiillere eklenen "-s" takısının özel kuralları vardır:Genel Kural: Çoğu fiil sadece -s alır.think → thinksgive → giveswant → wantsplay → plays (Sessiz harf + y kuralının istisnasıdır, vowel+y olduğu için sadece -s alır.)-ss, -x, -ch, -sh ile Bitenler: Fiilin sonu bu harflerle bitiyorsa -es takısı alır.pass → passesfix → fixescatch → catchespush → pushesgo → goes (Bu kurala uyar)do → does (Bu kurala uyar)Sessiz Harf + y ile Bitenler: Fiilin sonu sessiz bir harf ve ardından -y ile bitiyorsa, -y harfi düşer ve yerine -ies gelir.fly → fliescry → criesmarry → marriesstudy → studies

## 🕒 Simple Present Tense Zaman Zarfları (Sıklık Zarfları)
Geniş zaman cümleleri, eylemin ne sıklıkla yapıldığını belirten zarflarla kullanılır.
Zarf (Adverb)TürkçesiÖrnek Cümlealwaysdaima, her zamanI always love you. (Seni her zaman severim.)usuallygenellikleI usually listen to classical music. (Genellikle klasik müzik dinlerim.)oftensık sıkI often visit him. (Onu sık sık ziyaret ederim.)sometimesbazen, ara sıraI sometimes go to the cinema. (Bazen sinemaya giderim.)rarelynadirenI rarely smoke. (Nadiren sigara içerim.)neverasla, hiçI never smoke. (Asla sigara içmem.)every...her...I go fishing every Monday. (Her pazar balık tutmaya giderim.)

Önemli Not: "Never" (asla) kelimesi cümleye zaten olumsuz bir anlam katar. Bu nedenle "never" kullanılan cümlelerde ayrıca don't veya doesn't gibi olumsuz bir yardımcı fiil kullanılmaz.
He never eats broccoli. (O asla brokoli yemez.)`,
      example: 'She works in a bank. (O bir bankada çalışır.)'
    },
    {
      title: 'This, That, These, Those',
      summary: 'İşaret zamirleri ve işaret sıfatlarının kullanımı; yakın/uzak ayrımı.',
      example: 'This is my book. (Bu benim kitabım.)'
    },
    {
      title: 'There is / There are',
      summary: 'Bir yerde bir şeyin varlığını veya yokluğunu ifade etme yapıları.',
      example: 'There is a cat in the garden. (Bahçede bir kedi var.)'
    },
    {
      title: 'Can / Can’t (Yetenek Bildiren Cümleler)',
      summary: 'Yetenek, izin veya basit olasılık ifade ederken kullanılan yapı.',
      example: 'I can swim. (Yüzebilirim.)'
    },
    {
      title: 'Basic Question Forms (Temel Soru Kalıpları)',
      summary: 'Yes/No ve Wh- soru kalıpları ile temel soru oluşturma.',
      example: 'Do you like music? (Müziği sever misin?)'
    }
  ],
  A2: [
    {
      title: 'Simple Past Tense (Geçmiş Zaman)',
      summary: 'Geçmişte belirli bir zamanda tamamlanmış eylemler ve zaman ifadeleri.',
      example: 'I visited London last year. (Geçen yıl Londra’yı ziyaret ettim.)'
    },
    {
      title: 'Present Continuous Tense (Şimdiki Zaman)',
      summary: 'Şu anda devam eden veya geçici durumları anlatmak için kullanılır.',
      example: 'She is studying now. (O şimdi ders çalışıyor.)'
    },
    {
      title: 'Countable & Uncountable Nouns',
      summary: 'Sayılabilen ve sayılamayan isimlerin ayrımı ve miktar ifadeleriyle kullanımı.',
      example: 'Many apples (countable), much water (uncountable).'
    },
    {
      title: 'Adjectives & Adverbs (Sıfatlar ve Zarflar)',
      summary: 'Sıfatların ve zarfların kullanımı, sıfat-zarf dönüşümleri ve yerleri.',
      example: 'He is a fast runner. / He runs quickly.'
    },
    {
      title: 'Have to / Need to (Zorunluluk Bildiren Yapılar)',
      summary: 'Zorunluluk, gereklilik ve izin ifadelerinde have to / need to kullanımı.',
      example: 'I have to go to work. (İşe gitmem gerekiyor.)'
    }
  ],
  B1: [
    {
      title: 'Present Perfect Tense',
      summary: 'Geçmişte başlayıp şu ana etkisi veya bağlantısı olan eylemler.',
      example: 'I have lived here for three years. (Üç yıldır burada yaşıyorum.)'
    },
    {
      title: 'Past Perfect Tense',
      summary: 'Geçmişteki iki olaydan önce gerçekleşmiş eylemi anlatmak için kullanılır.',
      example: 'She had left before I arrived. (Ben gelmeden önce o gitmişti.)'
    },
    {
      title: 'First Conditional (1. Tip Koşul Cümleleri)',
      summary: 'Gerçekleşme ihtimali yüksek olan koşullar için if + present → will + fiil yapısı.',
      example: 'If it rains, I will stay home. (Yağmur yağarsa evde kalırım.)'
    },
    {
      title: 'Modals of Probability (İhtimal Bildiren Modal Yapılar)',
      summary: 'may, might, must gibi modal fiillerle olasılık derecelerini ifade etme.',
      example: 'He might come later. (Belki sonra gelir.)'
    },
    {
      title: 'Reflexive Pronouns (Dönüşlülük Zamirleri)',
      summary: 'myself, yourself, himself ... gibi zamirlerin doğru kullanımı.',
      example: 'She did it herself. (Bunu kendisi yaptı.)'
    }
  ],
  B2: [
    {
      title: 'Passive Voice (Edilgen Yapı)',
      summary: 'Eylemin failinin önemsiz olduğu veya bilinmediği durumlarda kullanılır.',
      example: 'The cake was eaten. (Kek yendi.)'
    },
    {
      title: 'Reported Speech (Dolaylı Anlatım)',
      summary: 'Başkasının sözünü dolaylı biçimde aktarma ve zaman uyumu kuralları.',
      example: 'She said that she was tired. (Yorgun olduğunu söyledi.)'
    },
    {
      title: 'Relative Clauses (İlgi Cümlecikleri)',
      summary: 'Noun phrase’i niteleyen who/which/that ile başlayan yan cümleler.',
      example: 'The man who called is my uncle. (Arayan adam benim amcamdır.)'
    },
    {
      title: 'Third Conditional (3. Tip Koşul Cümleleri)',
      summary: 'Geçmişte gerçekleşmemiş durumların hayali sonuçlarını ifade eder.',
      example: 'If I had known, I would have helped. (Bilseydim yardım ederdim.)'
    },
    {
      title: 'Causative (Ettirgen Yapılar)',
      summary: 'Have/get something done yapısıyla bir işi başkasına yaptırma.',
      example: 'I had my car cleaned. (Arabamı temizlettim.)'
    }
  ]
};

const levels = ['A1', 'A2', 'B1', 'B2'];

const frostedPaper = {
  maxWidth: 1200,
  width: '100%',
  borderRadius: 4,
  overflow: 'hidden',
  mt: { xs: 1, md: '15px' },
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: { xs: '0 8px 18px rgba(0,0,0,0.08)', md: '0 20px 40px rgba(0,0,0,0.1)' },
} as const;

const TopicsPage: React.FC = () => {
  useEffect(() => {
    setMetaTags({
      title: 'Konular — Dilbilgisi Konuları ve Örnekler',
      description: 'A1-B2 seviyeleri için temel dilbilgisi konuları, örnekler ve ipuçları. Sınav hazırlığına uygun açıklamalar.',
      keywords: 'dilbilgisi konuları, grammar konuları, a1 a2 b1 b2',
      canonical: '/topics',
      ogImage: '/social-preview.svg'
    });
  }, []);
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Türkçe karakter ve büyük/küçük harf uyumlu arama
  const normalizeTR = (s: string) =>
    s
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'g')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'c')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'u');

  // Tüm konuları göster; arama varsa başlık/özet içinde filtrele (Türkçe uyumlu)
  const allTopics = topicsData[selectedLevel as LevelKey];
  const query = search.trim();
  const displayTopics = query
    ? allTopics.filter(t => {
        const haystack = `${t.title} ${t.summary}`;
        return normalizeTR(haystack).includes(normalizeTR(query));
      })
    : allTopics;

  // Render simple markdown-like headings in topic summaries:
  const renderRichText = (text?: string) => {
    if (!text) return null;
    return text
      .split(/\n{2,}/)
      .map((block, i) => {
        const trimmed = block.trim();
        if (/^##\s*/.test(trimmed)) {
          return (
            <Typography key={i} variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 700, fontSize: { xs: 15, md: 16 } }}>
              {trimmed.replace(/^##\s*/, '')}
            </Typography>
          );
        }
        if (/^###\s*/.test(trimmed)) {
          return (
            <Typography key={i} variant="subtitle1" sx={{ mt: 1, mb: 1, fontWeight: 700, fontSize: { xs: 14, md: 15 } }}>
              {trimmed.replace(/^###\s*/, '')}
            </Typography>
          );
        }
        return (
          <Typography key={i} component="div" variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', mb: 1.5, lineHeight: 1.7 }}>
            {trimmed}
          </Typography>
        );
      });
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', px: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0, pb: { xs: 12, md: 16 }, overflowX: 'hidden' }}>
      <Paper elevation={6} sx={frostedPaper}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)', zIndex: 0 } }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography component="h1" variant="h4" fontWeight={700} mb={2} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: 'clamp(1.3rem, 2vw, 2rem)' }}>Konular</Typography>
            <Typography component="h2" variant="h6" sx={{ opacity: 0.95, fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)' }}>A1–B2 seviyelerinde özet ve örneklerle İngilizce konuları</Typography>
          </Box>
        </Box>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Tabs
            value={selectedLevel}
            onChange={(_, val) => setSelectedLevel(val)}
            variant={window.innerWidth < 600 ? 'scrollable' : 'fullWidth'}
            scrollButtons={window.innerWidth < 600 ? 'auto' : false}
            allowScrollButtonsMobile
            sx={{ mb: 2, overflowX: { xs: 'auto', sm: 'visible' }, minWidth: { xs: 340, sm: 'unset' }, justifyContent: { xs: 'center', sm: 'flex-start' }, display: 'flex' }}
          >
            {levels.map(level => (
              <Tab key={level} value={level} label={level} sx={{ minWidth: 80 }} />
            ))}
          </Tabs>
          <TextField
            fullWidth
            placeholder="Konu ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          {/* Topics as Accordions */}
          <Box sx={{ mb: 3 }}>
            {displayTopics.map((topic: Topic, idx: number) => (
              <Accordion 
                key={idx}
                expanded={expanded === `panel${idx}`}
                onChange={handleAccordionChange(`panel${idx}`)}
                sx={{
                  mb: 2,
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0, 184, 148, 0.15)',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: '0 0 16px 0',
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#00695c' }} />}
                  sx={{
                    backgroundColor: 'rgba(0, 184, 148, 0.05)',
                    borderBottom: expanded === `panel${idx}` ? '1px solid rgba(0, 184, 148, 0.15)' : 'none',
                    minHeight: '64px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 184, 148, 0.1)',
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0',
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={700} 
                    color="#00695c" 
                    sx={{ fontSize: { xs: 18, md: 20 } }}
                  >
                    {topic.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    p: { xs: 2.5, md: 4 },
                    backgroundColor: '#fff',
                  }}
                >
                  {/* Summary with improved readability (supports simple markdown-like headings) */}
                  {renderRichText(topic.summary)}

                  {/* Example shown in a subtle card for better scannability */}
                  {topic.example && (
                    <Paper elevation={0} sx={{ backgroundColor: 'rgba(0,0,0,0.03)', p: 2, borderRadius: 2, mt: 1 }}>
                      <Typography component="div" variant="body2" sx={{ whiteSpace: 'pre-line', color: 'text.secondary', fontStyle: 'italic', fontSize: { xs: 13, md: 14 } }}>
                        {topic.example}
                      </Typography>
                    </Paper>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
            {displayTopics.length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Bu seviyede aradığınız konu bulunamadı.
              </Typography>
            )}
            {/* Editor note removed as requested */}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TopicsPage;
