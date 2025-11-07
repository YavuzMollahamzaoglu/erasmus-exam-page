import React, { useState, useEffect } from 'react';
import setMetaTags from '../utils/seo';
import { Paper, Tabs, Tab, Box, Typography, TextField, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Topic = { title: string; summary: string; example?: string; tip?: string };
type LevelKey = 'A1' | 'A2' | 'B1' | 'B2';

const topicsData: Record<LevelKey, Topic[]> = {
  A1: [
    { title: '"To Be" Fiili (am, is, are)', summary: 'Temel tanımlama ve kimlik cümlelerinde kullanılan en önemli fiildir; örnekler ve basit kullanım.', example: '' },
    { title: 'Simple Present Tense', summary: 'Geniş zaman: alışkanlıklar, genel doğrular ve tekrarlayan eylemler için kullanılır.', example: 'I work every day. (Her gün çalışırım.)' },
    { title: 'This, That, These, Those', summary: 'Yakınlık ve sayı farkına göre nesne ve kişileri işaret etmek için kullanılır.', example: 'This is a book. (Bu bir kitaptır.)' },
    { title: 'There is / There are', summary: 'Bir şeyin varlığını veya yokluğunu belirtmek için kullanılır; tekil/çoğul ayrımı önemlidir.', example: 'There is a cat in the garden. (Bahçede bir kedi var.)' },
    { title: 'Can / Can\'t (Yetenek Bildiren Cümleler)', summary: 'Yetenek, izin, olasılık ve rica gibi anlamları olan modal yapıdır; özne ne olursa olsun "can" sabittir ve fiilden sonra V1 gelir.', example: 'I can swim. (Yüzebilirim.)' },
    { title: 'Basic Question Forms (Temel Soru Kalıpları)', summary: 'Yes/No ve WH- soruları: yardımcı fiili başa alıp soru kurarız. Örnek: Is he a teacher? Where did she go?', example: 'Do you like music? (Müziği sever misin?)' }
  ],

  A2: [
    {
      title: 'Simple Past Tense (Geçmiş Zaman)',
      summary: `Merhaba! Bugünkü konumuz İngilizcede en çok kullanılan ve en temel zamanlardan biri olan Simple Past Tense, yani Türkçedeki -dı / -di'li Geçmiş Zaman.

Bu zamanı, geçmişte belirli bir zamanda başlamış, olmuş ve tamamlanmış eylemleri anlatmak için kullanırız. Eylemin ne zaman yapıldığı (dün, geçen hafta, 2 yıl önce) genellikle bellidir veya cümlenin gelişinden anlaşılır.

## Temel Kural: "V2" ve "Did"
Bu zamanda iki kilit oyuncumuz var:

- Fiilin 2. Hali (V2): Sadece olumlu cümlelerde kullanılır.
- "did" (Yardımcı Fiil): Sadece olumsuz (didn't) ve soru (Did...?) cümlelerinde kullanılır.

❗️ DİKKAT! EN ÖNEMLİ KURAL! "Simple Past Tense" konusundaki en önemli kural şudur:

Bir cümlede did veya didn't varsa, fiil her zaman yalın (1. hal - V1) kullanılır.

Bir cümlede did veya didn't yoksa (yani cümle olumluysa), fiil 2. hal (V2) olarak kullanılır.

## ⚙️ Simple Past Tense Cümle Yapısı
Olumlu (Affirmative): Özne + Fiilin 2. Hali (V2)
Olumsuz (Negative): Özne + didn't + Fiilin 1. Hali (V1)
Soru (Interrogative): Did + Özne + Fiilin 1. Hali (V1) + ...?

### 1. Olumlu Cümleler (+)
Olumlu cümlede fiil 2. haldedir. Örnek: I watched TV last night. (Dün gece televizyon seyrettim.)

### 2. Olumsuz Cümleler (-)
Olumsuz cümlede didn't kullanılır ve fiil yalındır: I didn't go to a movie last night.

### 3. Soru Cümleleri (?)
Soru cümlesinde Did yardımcı fiili başa gelir ve fiil yalındır: Did you sleep well last night?

## "To Be" Fiilinin Geçmiş Hali: "Was / Were"
"To be" kendi geçmiş çekimlerine sahiptir ve did almaz: I was, You were, He was, They were.

## 📌 Simple Past Tense Kullanım Alanları
- Geçmişte Tamamlanmış Eylemler
- Art Arda Yaşanan Eylemler
- Geçmişte Belli Bir Süre Devam Eden Durumlar
- Geçmişteki Alışkanlıklar

## Fiillerin 2. Halleri: Düzenli ve Düzensiz Fiiller
- Düzenli: play → played, watch → watched
- Düzensiz: go → went, see → saw

## Gelişmiş Kullanımlar (WH- Soruları ve Pasif Yapı)
WH- sorularında Did başa gelir: Where did your mother live when she was a child?
Passive: Nesne + was/were + V3 → The car was washed by him.

## Karıştırılan Konular: Simple Past vs Present Perfect / Past Continuous
Simple Past: Zaman bellidir (I saw him yesterday.)
Present Perfect: Zaman belirsiz veya etkisi şimdiki zamana uzanır (I have seen him.)

`,
      example: 'I watched TV last night. (Dün gece televizyon seyrettim.)',
      tip: 'Did/didn\'t varsa fiil yalın (V1) olur; olumlu cümlede fiil V2 kullanılır.'
    },
    {
      title: 'Present Continuous Tense (Şimdiki Zaman)',
      summary: `Merhaba! Bugünkü konumuz, İngilizcedeki en temel zamanlardan biri olan Present Continuous Tense. Bu zaman, Türkçedeki "-yor" ekinin (geliyorum, yapıyorsun, koşuyor) tam karşılığıdır.

Temel olarak, konuşma anında yapmakta olduğumuz eylemleri anlatmak için kullanılır. Ancak, birazdan göreceğimiz gibi, tek kullanımı bu değildir.

Bu zamanı kurmanın anahtarı iki parçadan oluşur:

"To be" fiili: Özneye göre am, is, veya are olarak çekimlenir.

Fiil + -ing eki: Asıl fiilimize -ing takısını ekleriz.

## ⚙️ Present Continuous Tense Cümle Yapısı
Önce cümle yapımızın temelini oturtalım. Hangi öznenin hangi yardımcı fiili aldığı çok önemlidir:

Özne	Yardımcı Fiil
I	am
He / She / It	is
You / We / They	are

Şimdi bu yapıyı olumlu, olumsuz ve soru cümlelerinde görelim.

### 1. Olumlu Cümleler (+)
Formül: Özne + am/is/are + Fiil(-ing)

I am reading a book right now. (Şu anda bir kitap okuyorum.)

She is studying for her exam. (O, sınavına çalışıyor.)

We are walking home. (Eve yürüyoruz.)

People are waiting for the bus. (İnsanlar otobüs bekliyor.)

### 2. Olumsuz Cümleler (-)
Olumsuz cümle yapmak için yardımcı fiile (am, is, are) sadece "not" ekleriz.

Formül: Özne + am/is/are + not + Fiil(-ing)

Kısaltmalar: is not → isn't / are not → aren't

DİKKAT: "am not" yapısı "amn't" olarak kısalmaz. Bunun yerine "I'm not" şeklinde özne ile yardımcı fiili birleştiririz.

Örnekler:

I 'm not looking for a textbook. (Bir ders kitabı aramıyorum.)

She isn't driving now, she took the bus. (Şu an araba sürmüyor, otobüse bindi.)

They are not (aren't) talking to each other. (Onlar birbirleriyle konuşmuyorlar.)

### 3. Soru Cümleleri (?)
Soru yapmak için tek yapmamız gereken, am, is, are yardımcı fiillerini cümlenin başına, yani öznenin önüne almaktır.

Formül: Am/Is/Are + Özne + Fiil(-ing)?

A: Are you coming to the party tonight? (Bu akşam partiye geliyor musun?)

B: Yes, I am. / No, I am not. (Evet, geliyorum. / Hayır, gelmiyorum.)

A: Is she playing football with them? (Onlarla futbol mu oynuyor?)

B: Yes, she is. (Evet, oynuyor.)

A: Why are you carrying an umbrella? (Neden şemsiye taşıyorsun?)

B: It’s going to rain soon. (Yakında yağmur yağacak.)

## 📌 Present Continuous Tense Kullanım Alanları
Bu zamanı sadece "şimdi" olan şeyler için kullanmayız. Dört temel kullanım alanı vardır:

### 1. "Now" (Tam Şu Anda)
En yaygın kullanımıdır. Konuşma anında, "tam şu anda" gerçekleşen eylemleri anlatır.

You are learning English now. (Şu anda İngilizce öğreniyorsun.)

I am sitting. (Oturuyorum.)

Why aren’t you doing your homework? (Niye ödevini yapmıyorsun?)

### 2. Halen Devam Eden Uzun Süreli Olaylar
Bir eylemin tam şu anda yapılıyor olması gerekmez. İçinde bulunduğumuz "süreç" ("bu ay", "bu yıl", "bugünlerde") içinde devam eden eylemleri anlatır.

I am studying to become a doctor. (Doktor olmak için okuyorum.)

I am reading a great book. (Harika bir kitap okuyorum.)

Are you working on any special projects? (Özel bir proje üzerinde çalışıyor musun?)

### 3. Yakın Gelecek (Near Future)
Planlanmış, organize edilmiş yakın gelecek eylemleri için kullanılır.

I am meeting some friends after work. (İşten sonra arkadaşlarla buluşuyorum/buluşacağım.)

I am not going to the party tonight. (Bu gece partiye gitmiyorum.)

We are going to the festival with Leslie next week. (Leslie ile haftaya festivale gidiyoruz.)

### 4. "Always" ile Şikayet ve Yakınma
always, constantly veya forever ile kullanıldığında, eylemden duyduğumuz rahatsızlığı ve şikayeti belirtir.

She is always coming to class late. (Derse hep geç kalıyor!)

He is constantly talking. (O, sürekli konuşuyor! [ve bu sinir bozucu])

I don’t like them because they are always complaining. (Onları sevmem çünkü hep şikayet ederler.)

## ❗ Püf Noktaları: "Stative Verbs" (Durum Fiilleri)
Bazı fiiller eylem değil, durum bildirir. Bu fiiller genellikle Present Continuous'te kullanılmazlar.

Örnekler: love, like, hate, want, need, know, understand, have (sahiplik), see, hear

Yanlış: She ~~is loving~~ chocolate. Doğru: She loves chocolate.

### "Hem Durum Hem Eylem" Olan Fiiller
Bazı fiiller (think, have, smell gibi) hem durum hem de eylem bildirebilir. Bu durumda anlamları değişir:

THINK:
(Durum - Fikir): I think he is a nice man. (Bence o iyi bir adam.)
(Eylem - Düşünme): I am thinking about the exam. (Sınavı düşünüyorum.)

HAVE:
(Durum - Sahiplik): I have two cats. (İki kedim var.)
(Eylem - Deneyimleme): I am having a nice time. (Güzel vakit geçiriyorum.)

SMELL:
(Durum - Kokmak): All flowers smell nice. (Bütün çiçekler güzel kokar.)
(Eylem - Koklamak): The little girl is smelling the flowers. (Küçük kız çiçekleri kokluyor.)

## ✍️ "-ing" Takısının Yazılışı (Spelling)
Fiillere "-ing" eklerken bazı yazım kurallarına dikkat etmeliyiz:

Sonu 'e' ile Bitenler: Sondaki '-e' düşer.

dance → dancing
ride → riding
take → taking

Sessiz + Sesli + Sessiz (CVC) Kuralı: Son üç harfi bu kurala uyan tek heceli fiillerde, sondaki sessiz harf çift yazılır.

cut → cutting
plan → planning
run → running
beg → begging

İstisnalar:

Sondaki harf 'w', 'y' veya 'x' ise çift yazılmaz: snow → snowing, fix → fixing, pay → paying

Sonu iki sesli + bir sessiz ile biterse çift yazılmaz: keep → keeping, read → reading

## 🕒 Zaman İfadeleri (Time Expressions)
Hangi tense olduğunu anlamak için bu ipuçlarına bakabilirsiniz:

now (şimdi)
at the moment (şu anda)
at present (şu anda)
for the time being (şu esnada)

Look! (Bak!)
Listen! (Dinle!)

Look! A car is coming. (Bak! Bir araba geliyor.)
Listen! Somebody is following us. (Dinle! Birisi bizi takip ediyor.)
`,
      example: 'She is studying now. (O şimdi ders çalışıyor.)'
    },
    {
      title: 'Countable & Uncountable Nouns (Sayılabilen & Sayılamayan İsimler)',
      summary: `Merhaba! Bugünkü konumuz, İngilizce öğrenirken pek çoğumuzun kafasını karıştıran, ancak mantığını kavradığımızda aslında çok kolay olan bir konu: Sayılabilen (Countable) ve Sayılamayan (Uncountable) isimler.

Bu konudaki en büyük problem, anadilimiz olan Türkçe gibi düşünmeye çalışmamızdan kaynaklanıyor. O yüzden ilk kuralımız: Bu konuyu öğrenirken Türkçe düşünmeyi bir kenara bırakıyoruz!

## Neden Zorlanıyoruz? "Türkçe Düşünme" Hatası
Kendi dilimizde "Sular kesik", "Çaylar taze", "Karlar eriyor" gibi çoğul ifadeler kullanmamız çok normaldir.

Ancak İngilizler bu kavramlara farklı bakar: "water", "electricity", "tea", "snow" gibi maddelerin kendisi adet olarak sayılamaz. Bu yüzden bu kelimeler her zaman tekildir.

## Countable Nouns (Sayılabilen İsimler)
Adı üzerinde, "bir, iki, üç..." diye sayabildiğimiz, adet olarak ifade edebildiğimiz isimlerdir.

- Hem tekil (singular) hem de çoğul (plural) halleri vardır.
- Tekil hallerinde başlarına a veya an alabilirler.

Örnekler: a cat → two cats, a book → three books, pictures, houses, birds, doors, pencils

## Uncountable Nouns (Sayılamayan İsimler)
"Bir, iki, üç..." diye adet olarak sayamadığımız isimlerdir. Bu isimleri saymak istediğimizde mutlaka bir ölçü birimi, kap veya miktar kalıbı kullanmamız gerekir.

- Her zaman tekildirler. Çoğul yapılamazlar.
- Başlarına doğrudan a veya an alamazlar.
- Cümlede her zaman tekil fiil alırlar (is, was, looks, has vb.).

Kategoriler: Sıvılar (water, coffee, milk), Tanecikli/Toz Gıdalar (rice, sugar), Maddeler/Malzemeler (wood, glass, paper), Soyut Kavramlar (love, happiness, knowledge), Grup İsimleri (furniture, luggage, money), Diğerleri (weather, traffic, hair)

## En Sık Karıştırılanlar: Örnekler
- Bread: a slice of bread / a loaf of bread
- Money: one dollar → two dollars (money kelimesi sayılamaz)
- Furniture: a piece of furniture / two chairs
- Information / Advice: a piece of advice
- News: tekil (This news is important.)

## Ölçü Kalıpları (Quantifiers) — Sayılamayanları Sayılabilir Yapmak
Sayılamayan isimlerin miktarını belirtmek için ölçü kalıpları kullanırız:

Examples:
a glass of water → two glasses of water
a bottle of milk → three bottles of milk
a slice of bread → five slices of bread
a piece of news
a loaf of bread → two loaves of bread
a bowl of soup
a kilo of sugar

## Miktar Belirteçleri (Some, Any, Much, Many)
- Sayılabilen: many, a few, few, several
- Sayılamayan: much, a little, little
- Her ikisiyle: some, any, a lot of, plenty of

## Hem Sayılabilen Hem Sayılamayan (Anlam Değişimi)
Bazı kelimeler bağlama göre değişir: noise, hair, paper, glass, time, chicken, iron, work vs. Örnek: "I heard a loud noise" (sayılabilir) vs "There is too much noise" (sayılamayan).

## Fiil Çekimi (En Önemli Kural!)
- Sayılabilenler: tekilse tekil fiil, çoğulsa çoğul fiil.
- Sayılamayanlar: HER ZAMAN TEKİL fiil alır.

Ölçü birimi kullanıldığında fiil, ölçü birimine göre çekimlenir: "A slice of pizza is not enough." / "Two bottles of milk are enough."
`,
      example: 'Many apples (countable), much water (uncountable).'
    },
    {
      title: 'Adjectives & Adverbs (Sıfatlar ve Zarflar)',
      summary: `Merhaba! Bugünkü dersimizde İngilizcedeki en çok karıştırılan iki konuyu, sıfatları ve zarfları ele alacağız. Bu ikisinin arasındaki farkı anladığınızda, cümleleriniz çok daha profesyonel ve doğru hale gelecek.

## Temel Fark: Kimi Niteliyorlar?
Bu iki kelime türünün arasındaki en temel fark, cümlede neyi niteledikleri ile ilgilidir:

Adjectives (Sıfatlar):
- İsimleri veya zamirleri niteler.
- İsme sorulan "Nasıl?" sorusuna cevap verir.

Adverbs (Zarflar):
- Fiilleri, sıfatları veya başka zarfları niteler.
- Fiile sorulan "Nasıl?", "Ne zaman?", "Nerede?" veya "Ne kadar?" sorularına cevap verir.

Örnek:
He is a slow player. (Burada "slow" isim olan "player"ı niteler → sıfat.)
He plays slowly. (Burada "slowly" fiili niteler → zarf.)

## Kural 1: Düzenli Zarflar (Sıfata "-ly" Eki)
Çoğu zarf, bir sıfatın sonuna -ly takısı getirilerek oluşturulur.

Örnekler:
quick → quickly
bad → badly
happy → happily

John is a quick player. → John plays quickly.

## Kural 2: Düzensiz Zarflar (Irregular Adverbs)
Bazı sıfatlar -ly kuralına uymaz. En önemli örnek: good → well

Mr Halloway is a good teacher. → He teaches well.

## Kural 3: Değişmeyenler (Hem Sıfat Hem Zarf)
Bazı kelimeler hem sıfat hem de zarf olarak aynı formu alır: fast, hard, early, late, high, low, near, far, deep, wrong, straight

Örnekler:
I want a fast car. (sıfat)
My car must go fast. (zarf)

## Kural 4: Anlamı Tamamen Değişen Zarflar
Bazı kelimeler -ly alarak anlam değiştirir: hard → hardly, late → lately, near → nearly, high → highly, short → shortly

Örnek:
He works hard. (sıkı çalışır)
He hardly works. (neredeyse hiç çalışmaz)

## "-ly" ile Biten Sıfatlar (İstisna)
Bazı -ly ile biten kelimeler SIFATtır: friendly, lovely, lively, lonely, silly, elderly

Çoğu durumda bunların zarf halini yapmak için "in a ... way/manner" gibi yapılar kullanılır: They behave in a friendly way.

`,
      example: 'She dances happily. / She is a happy dancer.'
    },
    { title: 'Have to / Need to (Zorunluluk Bildiren Yapılar)', summary: 'Zorunluluk, gereklilik ve izin ifadelerinde have to / need to kullanımı.', example: 'I have to go to work. (İşe gitmem gerekiyor.)' }
  ],
  B1: [
    {
      title: 'Present Perfect Tense',
      summary: `İngilizce öğrenenlerin belki de en çok zorlandığı, Türkçede tam karşılığı olmayan ama mantığını kavradığınızda İngilizcenizin seviye atlamasını sağlayacak o meşhur konuyu ele alacağız.
Sizin için sağladığınız tüm bu değerli bilgileri bir araya getirerek, "Present Perfect Tense" konusunu en net ve en kapsamlı haliyle anlatan bir rehber hazırladım.İşte "Present Perfect Tense" hakkında bilmeniz gereken her şey:
🚀 Present Perfect Tense (Belirsiz Geçmiş Zaman) Kapsamlı Konu Anlatımı

Merhaba! Bugünkü konumuz, İngilizce öğrenen Türklerin en çok zorlandığı zaman olan Present Perfect Tense. Bu Tense'in bu kadar kafa karıştırıcı olmasının tek bir sebebi var: Türkçede tam bir karşılığının olmaması.
Biz bu konuyu genelde "Yakın Geçmiş Zaman" olarak duysak da, bu tanım eksiktir. En doğru tanım, "Belirsiz Geçmiş Zaman" veya "Etkisi Süren Geçmiş Zaman" olabilir.

Bu zamanda kilit nokta şudur: Olayın ne zaman (dün, geçen hafta) yapıldığı önemli değildir. Önemli olan, geçmişte yaşanan o olayın şu anki etkisi veya sonucudur.

## En Büyük Soru: Simple Past (Dİ'li Geçmiş) ile Farkı Nedir?
Bu konuyu anlamanın tek yolu, onu "Simple Past Tense" (Dün yaptım, geçen yıl gittim) ile net bir şekilde ayırmaktır.

Simple Past Tense (V2)
Present Perfect Tense (Have/Has + V3)
Olay geçmişte belirli bir zamanda oldu ve bitti.
Olay geçmişte belirsiz bir zamanda oldu.
Zaman önemlidir.
Zaman önemsizdir, sonuç önemlidir.
Tom was a teacher in 2002. (Tom 2002'de öğretmendi. Artık değil, olay bitti.)
Tom has been a teacher for 20 years. (Tom 20 yıldır öğretmen. Hala öğretmen.)
I lost my keys yesterday. (Dün anahtarlarımı kaybettim. Belki buldum, belki bulamadım, zamanı belli.)
I have lost my keys. (Anahtarlarımı kaybettim. [Sonuç: Şu an içeri giremiyorum.])
Kesin zaman zarfları (yesterday, last week, in 1999) kullanılır.
Kesin zaman zarfları KULLANILMAZ.

## ⚙️ Present Perfect Tense Cümle Yapısı
Bu zamanı kurmak için iki şeye ihtiyacımız var:
Yardımcı Fiil: Özneye göre have veya has
Ana Fiil: Fiilin 3. Hali (Past Participle - V3)

ÖzneYardımcı FiilFiilin 3. HaliI / You / We / Theyhave ('ve)V3 (watched, gone, seen)He / She / Ithas ('s)V3 (watched, gone, seen)

### 1. Olumlu Cümleler (+)
Formül: Özne + have/has + Fiilin 3. Hali (V3)
I have already done my homework. (Ödevimi çoktan yaptım.)(Sonuç: Ödevim şu an bitmiş durumda.)
She has made so many mistakes. (Çok fazla hata yaptı.)(Sonuç: Bu hataların etkisi şu an mevcut.)
The teacher has declared the exam results. (Öğretmen sınav sonuçlarını duyurdu.)(Sonuç: Sonuçları şu an biliyoruz.)

### 2. Olumsuz Cümleler (-)
Formül: Özne + haven't / hasn't + Fiilin 3. Hali (V3)
I haven't had my breakfast yet. (Kahvaltımı henüz yapmadım.)(Sonuç: Şu an açım.)
He hasn't started to cook. (Yemek yapmaya başlamadı.)
They haven't met with their lawyer yet. (Henüz avukatlarıyla tanışmadılar.)

### 3. Soru Cümleleri (?)
Formül: Have/Has + Özne + Fiilin 3. Hali (V3)?
Have you seen this movie before? (Bu filmi daha önce izledin mi?)
Has she gone to shopping? (Alışverişe gitti mi?)
Haven't you listened to Taylor Swift’s new song? (Taylor Swift’in yeni şarkısını dinlemedin mi?)

## 📌 Present Perfect Tense Kullanım Alanları
Bu zamanı ne zaman kullanacağımızı 4 ana başlıkta özetleyebiliriz:

### 1. Tecrübeler ve Hayat Deneyimleri (Experience)
Hayatınızda bir şeyi hiç yapıp yapmadığınızı sorarken veya söylerken kullanılır. Ne zaman yaptığınızın hiçbir önemi yoktur, önemli olan o tecrübeye sahip olmanızdır.
I have been to France. (Fransa'da bulundum.) [Ne zaman gittiğim önemli değil, tecrübe bende.]
Have you ever met him? (Onunla hiç karşılaştın mı?)
She has never traveled by train. (O, trenle hiç seyahat etmedi.)

### 2. Geçmişte Başlayıp Bugüne Devam Eden Eylemler (Duration)
Bu, en yaygın kullanımdır. Eylem geçmişte bir noktada başlar ve konuşma anında hâlâ devam ediyordur.
Bu kullanımda for (süreç) ve since (başlangıç noktası) kilit kelimelerdir.
Turkey has been a republic since 1923. (Türkiye 1923'ten beri bir cumhuriyettir.) [Hala cumhuriyet.]
She has written articles for a month. (Bir aydır makaleler yazıyor.) [Hala yazıyor.]
Jill has known Jack since the elementary school. (Jill, Jack’i ilkokuldan beri tanıyor.) [Hala tanıyor.]

### 3. Etkisi Süren Yakın Geçmiş Olayları (Result)
Olay daha yeni bitmiştir ve sonucu (etkisi) şu anda görülebilir veya hissedilebilir durumdadır.
I have cleaned the table. (Masayı temizledim.) [Sonuç: Masa şu an temiz.]
He has opened the window. (Pencereyi açtı.) [Sonuç: Pencere şu an açık.]
Bill has still not arrived. (Bill hâlâ gelmedi.) [Sonuç: Hâlâ bekliyoruz.]

### 4. Zaman İçindeki Değişim ve Başarılar (Change & Accomplishments)
Bir süreç içinde meydana gelen değişiklikleri veya elde edilen başarıları anlatır.
Man has walked on the moon. (İnsan Ay'da yürüdü.) [Bu bir başarıdır.]
You have grown since the last time I saw you. (Seni son gördüğümden beri büyümüşsün.) [Değişim.]
My English has really improved. (İngilizcem gerçekten gelişti.) [Değişim.]

## 🔑 Kilit Zaman Zarfları (Sinyal Kelimeler)
Bu kelimeleri gördüğünüzde aklınıza Present Perfect Tense gelmelidir:

### For (Süreç) vs. Since (Başlangıç)
For: Eylemin ne kadar süredir yapıldığını gösterir (süreç)....for 12 years. (12 yıldır.)...for a month. (Bir aydır.)...for an hour. (Bir saattir.)
Since: Eylemin ne zaman başladığını gösterir (başlangıç noktası)....since 1923. (1923'ten beri.)...since February. (Şubat'tan beri.)...since last week. (Geçen haftadan beri.)

### Just / Already / Yet
Just: "Henüz, az önce, tam şimdi" anlamı katar.We have just finished eating lunch. (Öğle yemeğini yemeyi henüz bitirdik.)Already: "Çoktan, zaten, halihazırda" anlamı katar.I've already finished my homework. (Ödevimi çoktan bitirdim.)Yet: "Henüz, hâlâ" anlamı katar. Sadece olumsuz cümlelerde ve soru cümlelerinde, cümlenin sonunda kullanılır.I haven't written my essay yet. (Makalemi henüz yazmadım.)Have you read the book yet? (Kitabı okudun mu?)

### Ever / NeverEver: "Şimdiye kadar, hiç" anlamındadır. Genellikle sorularda kullanılır.Have you ever driven a car? (Şimdiye kadar hiç araba sürdün mü?)Never: "Hiç" anlamındadır. Cümleyi olumlu yapıda kursa da anlamı olumsuz yapar. (not ile birlikte kullanılmaz.)I have never eaten meat. (Hiç et yemedim.)

## Gelişmiş Kullanımlar (Passive ve WH- Soruları)
### Edilgen (Passive) Cümleler
Eylemi yapanın değil, eylemden etkilenenin önemli olduğu durumlardır.Formül: Nesne + have/has + been + Fiilin 3. Hali (V3)The walls have been painted by them. (Duvarlar onlar tarafından boyandı.)The interns have been trained very well. (Stajyerler çok iyi eğitildiler.)Has the essay been written by you? (Makale senin tarafından yazıldı mı?)Haven't the applications been submitted yet? (Başvurular henüz gönderilmedi mi?)

### WH- Soru Cümleleri (Soru Zarflı Cümleler)
Formül: WH- + have/has + Özne + V3?Where have they found such a rare car? (Bu kadar nadir bir arabayı nerede buldular?)How have you met your husband? (Kocanla nasıl tanıştın?)

## ❗️ Klasik Hata: "Been" mi, "Gone" mu?
Bu Tense'te "gitmek" fiili için iki kelime kullanılır ve anlamları farklıdır:Gone (Gitti, Hâlâ Orada):She has gone to Paris. (O, Paris'e gitti.)Anlamı: Şu anda Paris'te, geri dönmedi.Been (Gitti, Geri Geldi / Bulundu):She has been to Paris. (O, Paris'te bulundu.)Anlamı: Hayatında bir kez Paris'e gitti ama şimdi geri döndü (ya da orada yaşıyordu).I have never been to Madrid. (Hiç Madrid'de bulunmadım.)
`,
      example: 'I have lived here for three years. (Üç yıldır burada yaşıyorum.)'
    },
    {
      title: 'Past Perfect Tense',
      summary: `İngilizce'de "iki geçmiş" olduğunda hangisini önce söyleyeceğimizi belirleyen, hikaye anlatımının kilit taşı olan bu konuyu sizin için en net haliyle derledim.
Sağladığınız tüm bu bilgileri birleştirerek, "Past Perfect Tense" konusunu sıfırdan zirveye taşıyacak, net ve kapsamlı bir konu anlatımı hazırladım.İşte "Past Perfect Tense" (-Miş'li Geçmiş Zaman) rehberimiz:
🚀 Past Perfect Tense (-Miş'li Geçmiş Zaman) Konu Anlatımı

Merhaba! Bugünkü konumuz, İngilizce'de "geçmişin de geçmişini" anlatmak için kullandığımız Past Perfect Tense. Türkçedeki "-mişti, -mıştı" ekinin tam karşılığıdır.
Bu zamanı, Present Perfect Tense'in (şu ana etkisi olan geçmiş) bir nevi geçmiş zaman hali olarak düşünebilirsiniz.

## Neden Bu Zamana İhtiyacımız Var? (Temel Mantık)
Bu zamanın tek bir ana görevi vardır: Geçmişte olan iki olaydan, hangisinin daha önce olduğunu vurgulamak.
Eğer bu zamanı kullanmazsak, eylemlerin sırası karışabilir. En klasik örnekle farkı görelim:
Simple Past Tense:
When I came home, my mother left.(Eve geldiğimde, annem çıktı.)
Anlamı: Önce ben eve geldim, sonra (belki kapıda karşılaştık) annem evden çıktı. (Olay sırası: 1. Ben geldim. 2. Annem çıktı.)
Past Perfect Tense:
When I came home, my mother had left.(Eve geldiğimde, annem çoktan çıkmıştı.)
Anlamı: Önce annem evden çıktı. Ben eve geldiğimde o evde değildi. (Olay sırası: 1. Annem çıktı. 2. Ben geldim.)
Gördüğünüz gibi, "-mişti" anlamı katarak, bir eylemin diğerinden daha önce olduğunu netleştirmiş olduk.

## ⚙️ Past Perfect Tense Cümle Yapısı
Bu zamanın yapısı belki de en kolayıdır, çünkü özne ne olursa olsun kural değişmez! (I, you, he, she, it, we, they... hepsi aynıdır).

Kural: had + Fiilin 3. Hali (V3)

### 1. Olumlu Cümleler (+)
Formül: Özne + had + Fiilin 3. Hali (V3)
Kısaltma: had → 'd (I'd, you'd, she'd...)
She had met him before the meeting. (Onunla toplantıdan önce tanışmıştı.)
The train had left before I arrived at the station. (Ben istasyona varmadan önce tren kalkmıştı.)
I had read a lot about Scotland before I went there. (İskoçya'ya gitmeden önce hakkında çok şey okumuştum.)

### 2. Olumsuz Cümleler (-)
Formül: Özne + had not (hadn't) + Fiilin 3. Hali (V3)
I hadn't cleaned the house. (Evi temizlememiştim.)
She hadn't done her homework before she went out. (Dışarı çıkmadan önce ödevini yapmamıştı.)
They had not gone to Istanbul for 3 years. (İstanbul'a üç yıldır gitmemişlerdi.)

### 3. Soru Cümleleri (?)
Formül: Had + Özne + Fiilin 3. Hali (V3)?
Had you cleaned the house? (Evi temizlemiş miydin?)
Had he called her before he came? (O gelmeden önce, onu aramış mıydı?)
Hadn't you eaten already? (Zaten yemek yememiş miydin?)

## Özet Tablo: Cümle Dizilimi
Olumlu CümleOlumsuz CümleSoru CümlesiI had cleaned... (Temizlemiştim)I hadn't cleaned... (Temizlememiştim)Had I cleaned...? (Temizlemiş miydim?)He had cleaned...He hadn't cleaned...Had he cleaned...?They had cleaned...They hadn't cleaned...Had they cleaned...?

## 📌 Past Perfect Tense Kullanım Alanları
### 1. Geçmişteki İki Olaydan Önce Olanı Belirtmek (Ana Kullanım)
Bir "ana" geçmiş zamanımız (Simple Past - V2) ve bir de "daha eski" geçmiş zamanımız (Past Perfect - had V3) vardır.
By the time we got to the theatre, the play had already started.(Biz tiyatroya vardığımızda [Geçmiş Olay 2], oyun çoktan başlamıştı [Geçmiş Olay 1].)
I had never seen such a nice beach before I went to Side.(Side'ye gitmeden önce [Geçmiş Olay 2] böyle güzel bir sahil hiç görmemiştim [Geçmiş Olay 1].)

### 2. Geçmişteki Belirli Bir Zamandan Önceki Süreci Anlatmak
Bir eylemin, geçmişteki başka bir andan önce ne kadar süredir devam ettiğini belirtir.
We had had that car for ten years before it broke down.(O araba bozulmadan önce [Geçmiş Olay], on yıldır bizdeydi [Önceki Süreç].)
By the time Alex finished his studies, he had been in London for over eight years.(Alex eğitimini bitirdiğinde [Geçmiş Olay], sekiz yıldan fazla bir süredir Londra'da bulunmaktaydı [Önceki Süreç].)

### 3. Geçmişte Gerçekleşmemiş Niyet ve Ümitler
Yapmayı planladığımız veya ümit ettiğimiz ancak yapamadığımız eylemleri anlatır (hope, want, expect gibi fiillerle).
I had wanted to visit the gallery before I left Paris, but it was closed.(Paris'ten ayrılmadan önce galeriyi ziyaret etmek istemiştim [Niyet], ama Pazar günleri kapalıymış.)
Jane had hoped to retire at 60, but they persuaded her to stay.(Jane 60 yaşında emekli olmayı ümit etmişti [Ümit], ama kalması için onu ikna ettiler.)

## 💡 Önemli İpucu: "Before" ve "After" Kullanımı
Eğer cümlede "before" (önce) veya "after" (sonra) bağlaçları varsa, eylemlerin sırası zaten bellidir. Bu durumda, Past Perfect Tense kullanmak zorunlu değildir, yerine Simple Past Tense de tercih edilebilir.
After the meeting (had) finished, everybody went home.(Toplantı bittikten sonra herkes evine gitti.)
Jack (had) left before I got to the office.(Ben ofise gitmeden önce Jack çıkmıştı.)

## Gelişmiş Kullanımlar (Passive ve WH- Soruları)
### Edilgen (Passive) Cümleler
Eylemi yapanın değil, eylemden etkilenenin önemli olduğu durumlardır.Formül: Nesne + had + been + Fiilin 3. Hali (V3)The car had been washed before they bought it. (Onlar satın almadan önce araba yıkanmıştı.)The problems had been solved before we knew about them. (Biz sorunları duymadan önce çözülmüştüler.)Had the party been organized by their friends? (Parti arkadaşları tarafından mı organize edilmişti?)
### WH- Soru Cümleleri (Soru Zarflı Cümleler)
Formül: WH- + had + Özne + V3?What had she done to him? (Ona ne yapmıştı?)Where had they met each other? (Nerede tanışmıştılar?)Who had seen them? (Onları kim görmüştü?).  
`,
      example: 'She had left before I arrived. (Ben gelmeden önce o gitmişti.)'
    },
    {
      title: 'First Conditional',
      summary: `Merhaba! Bugünkü konumuz, İngilizcedeki şartlı cümlelerin (Conditionals) en önemlilerinden biri olan "First Conditional" ya da diğer adıyla "If Clause Type 1".

Bu yapı, Türkçede "Eğer şöyle olursa, böyle olacak" dediğimiz cümlelerin ta kendisidir.

## "First Conditional" Nedir? Ne Zaman Kullanılır?
En basit tanımıyla, gelecekte gerçekleşmesi muhtemel, olası ve gerçekçi durumlardan bahsederken bu yapıyı kullanırız.

Burada bahsettiğimiz şart "hayali" veya "imkansız" değildir (Piyangoyu kazanırsam... gibi değil). Tamamen gerçekleşebilir bir koşula bağlı gerçekçi bir sonuçtan bahsederiz.

## Hangi Durumlarda Kullanırız?

Günlük Planlar:

If it doesn't rain tomorrow, we can go for a picnic. (Yarın yağmur yağmazsa pikniğe gidebiliriz.)

Alışveriş:

If there are fresh strawberries at the market, I'll buy some. (Eğer markette taze çilek varsa biraz alacağım.)

Tahminler ve Sonuçlar:

If she studies hard, she will pass the exam. (Eğer sıkı çalışırsa sınavı geçecektir.)

Uyarılar:

If you don't hurry, you will miss the bus. (Eğer acele etmezsen otobüsü kaçıracaksın.)

## ⚙️ "If Clause Type 1" Cümle Yapısı
Bu yapıda cümlemiz iki bölümden oluşur:

"If Clause" (Şart Cümlesi): "Eğer" dediğimiz, koşulu belirten kısımdır.

"Main Clause" (Ana Cümle): Bu koşul gerçekleşirse ne olacağını söyleyen sonuç kısmıdır.

Temel formülümüz şudur:

If Clause (Şart)	Main Clause (Sonuç)
If + Simple Present Tense	Simple Future Tense (Will)
If it rains... (Eğer yağmur yağarsa...)	...I will stay at home. (...evde kalacağım.)

Örnekler:

If it rains, you will get wet. (Yağmur yağarsa ıslanırsın.)

If Sally is late again, I will be mad. (Eğer Sally yine geç kalırsa çıldıracağım.)

If I have time, I'll finish that letter. (Vaktim olursa o mektubu bitireceğim.)

### ❗️ Cümle Sırası ve Virgül Kuralı
Cümlelerin sırasını değiştirmek anlamı bozmaz, sadece virgül kuralını etkiler:

If ile başlarsa: "If Clause" bittiğinde araya virgül (,) konur.

If you don't hurry, you will miss the bus.

Ana Cümle ile başlarsa: Araya virgül (,) konulmaz.

You will miss the bus if you don't hurry.

## 📌 Temel Yapının Dışına Çıkmak: Alternatif Kullanımlar
"Type 1" her zaman "Present Simple + Will" kalıbına sıkışmak zorunda değildir. Hem şart (if) hem de sonuç (will) cümlesi için birçok alternatifimiz var:

### 1. Ana Cümle (Sonuç) İçin "Will" Yerine Kullanılabilecekler
May / Might (Olasılık):

If you drop that glass, it might break. (O bardağı düşürürsen kırılabilir.)

Can (Yetenek / İzin / Olasılık):

If he brings all the documents, he can apply for the visa. (Tüm belgeleri getirirse vizeye başvurabilir.)

Should (Tavsiye):

If you're studying right now, you should take a short break. (Eğer şu an ders çalışıyorsan kısa bir mola vermelisin.)

Must (Zorunluluk):

If you want to pass, you must study harder. (Geçmek istiyorsan daha sıkı çalışmalısın.)

Imperative (Emir Kipi): Bir emir veya talimat vermek için doğrudan fiili kullanırız.

If he calls you, go. (Seni ararsa git.)

### 2. Şart Cümlesi (If) İçin "Present Simple" Yerine Kullanılabilecekler
Present Continuous: Şu anda devam eden veya planlanmış bir eylem şart ise.

If they are going to the party tonight, we will join them. (Eğer bu gece partiye gidiyorlarsa onlara katılacağız.)

Present Perfect: Şart, "o zamana kadar tamamlanmış bir eylem" ise.

If she has finished her homework, she might go to the cinema. (Eğer ödevini bitirdiyse sinemaya gidebilir.)

## 💡 "If" Yerine Kullanılabilecek Diğer Bağlaçlar
Unless (Eğer ...-mezse / -mazsa): "If... not..." demenin kısa yoludur.

Unless you study, you will fail the exam. (Eğer ders çalışmazsan sınavdan kalacaksın.)

Provided (that) / As long as (Şartıyla / Sürece): "If" ile aynı anlamdadır.

Provided that you sign the contract, we will give you access. (Kontratı imzalamanız şartıyla size erişim vereceğiz.)

Should (Resmi Kullanım):
Should you need any help, I will be available. (Yardıma ihtiyacınız olursa burada olacağım.)

## "Type 1" ile Diğer Tipler Arasındaki Farklar
Type 1 vs. Type 0 (Zero Conditional):

Type 0 (Genel Gerçekler): If you heat water, it boils. (Suyu ısıtırsan kaynar.)

Type 1 (Olası Gelecek): If it rains, we will stay home. (Yağmur yağarsa evde kalacağız.)

Type 1 vs. Type 2 (Second Conditional):

Type 1 (Gerçekçi): If I get a new job, I will buy a new car. (Yeni bir işe girersem yeni bir araba alacağım.)

Type 2 (Hayali/İmkansız): If I won the lottery, I would travel the world. (Piyangoyu kazansam dünyayı gezerdim.)
`,
      example: 'If it rains, you will get wet. (Yağmur yağarsa ıslanırsın.)'
    },
    {
      title: 'Probability / Modals',
      summary: `Merhaba! Bugünkü konumuz, İngilizcede "tahmin yürütmek" veya "çıkarım yapmak" için kullandığımız özel yardımcı fiiller (modals). Bu kelimeler; bir eylemin, durumun veya yeteneğin değil, bir şeyin ne kadar olası olduğunu belirtir.

Bu konuyu iki ana bölümde inceleyeceğiz:

Şimdiki Zaman ve Gelecek (Present & Future) Olasılıkları

Geçmiş Zaman (Past) Olasılıkları

## 1. Şimdiki Zaman ve Gelecek İçin Olasılık (Present/Future Probability)
Bir durum hakkında şu an veya yakın gelecek için tahmin yürütürken bu yapıları kullanırız. Önemli olan, tahminimizden ne kadar emin olduğumuzdur.

Formül: Modal + Fiil (Yalın Hali - V1)

### 1A. Güçlü Çıkarım (Neredeyse Eminiz - %90-100)
MUST (Olmalı - Olumlu Çıkarım) Kanıtlara veya güçlü bir hisse dayanarak bir şeyin "öyle olması gerektiği" sonucuna vardığımızda kullanılır.

She must be on the bus. (Otobüste olmalı.) (Kanıt/Düşünce: "Normalde bu saatte yolda olur, tek mantıklı yer otobüs.")

CAN'T (Olamaz - Olumsuz Çıkarım) Bir şeyin "mümkün olmadığına" dair güçlü bir çıkarım yaparken kullanılır. DİKKAT: Çıkarım yaparken must fiilinin olumsuzu mustn't değil, can't fiilidir.

She can't be at home. (Evde olamaz.) (Kanıt/Düşünce: "Az önce telefonda dışarıda olduğunu söyledi.")

WILL / WON'T (Kesinlik) Bir durumdan çok emin olduğumuzda veya durumun kaçınılmaz olduğunu bildiğimizde kullanılır.

She'll be at work now. (O, şu an iştedir.)

The underground will be very busy now. (Metro şu an çok kalabalıktır.)

### 1B. Olasılık (Belki - %30-60)
MAY / MIGHT / COULD (Olabilir) Bu üç kelime de "belki", "-ebilir" anlamındadır ve bir şeyin mümkün olduğunu ama emin olmadığımızı gösterir. Genellikle birbirlerinin yerine kullanılabilirler.

It may rain tomorrow. (Yarın yağmur yağabilir.)

I’m not sure, but they might visit us this evening. (Emin değilim ama bu akşam bizi ziyaret edebilirler.)

"Where’s the cat?" "I don’t know. It could be in the garden." ("Kedi nerede?" "Bilmem. Bahçede olabilir.")

Not: Bazı kaynaklara göre may, might ve could kelimelerinden biraz daha yüksek bir olasılık bildirir (may > might > could), ancak günlük kullanımda bu fark neredeyse yok denecek kadar azdır.

Olumsuz halleri may not ve might not (mightn't) şeklindedir:

Jerry might not want to help us. (Jerry bize yardım etmek istemeyebilir.)

### 1C. Beklenti (Mantıken Olması Gereken - %80)
SHOULD / SHOULDN'T (Gerekir / Olması Lazım) Bu kullanım, "tavsiye" anlamındaki should değildir. Burada, "eğer her şey normal seyrindeyse, beklediğimiz budur" anlamında bir varsayım yaparız.

They should be there by now. (Şu ana kadar oraya varmış olmaları lazım.)

It shouldn't take long to drive here. (Buraya arabayla gelmek uzun sürmemeli.)

## 2. Özel Durum: "Can" vs. "May/Might/Could" (Genel vs. Özel Olasılık)
Bu, en çok karıştırılan noktalardan biridir.

CAN (Genel Olasılık) Can, belirli bir anda olan bir olasılıktan çok, bir şeyin genel olarak mümkün olduğunu veya bazen öyle olduğunu anlatır.

Prices can be high in London. (Londra'da fiyatlar yüksek olabilir.) (Bu genel bir gerçektir; bazen olur.)

It can snow in Denizli. (Denizli’de kar yağabilir.) (Genel olarak Denizli'ye kar yağması mümkündür.)

MAY / MIGHT / COULD (Özel Olasılık) Bu yapılar ise belirli bir duruma (spesifik bir ana veya olaya) odaklanır.

He could be on the bus. (O, otobüste olabilir.) (Spesifik olarak şu anda otobüste olma ihtimalinden bahsediyoruz. He can be on the bus denmez.)

It may snow in Denizli tomorrow. (Yarın Denizli’de kar yağabilir.) (Spesifik olarak yarınki durumdan bahsediyoruz.)

COULD (Geçmişteki Genel Olasılık) Could, aynı zamanda can fiilinin geçmiş hali olarak, geçmişteki genel olasılıkları anlatabilir.

The exams could be boring when I was at high school. (Ben lisedeyken sınavlar sıkıcı olabilirdi.)

## 3. Geçmiş Zaman İçin Olasılık (Past Probability)
Geçmişte olmuş bir olay hakkında tahmin yürütürken veya çıkarım yaparken kullanılır.

Formül: Modal + have + Fiilin 3. Hali (V3)

### 3A. Güçlü Çıkarım (Neredeyse Eminiz)
MUST HAVE + V3 (-mış olmalı) Geçmişte bir şeyin olduğuna dair güçlü kanıtlara dayalı çıkarım yaparız.

She must have forgotten about our date. (Randevumuzu unutmuş olmalı.) (Çıkarım: "Çünkü gelmedi ve o asla unutmazdı.")

CAN'T HAVE + V3 (-mış olamaz) Geçmişte bir şeyin olmasının imkansız olduğuna dair güçlü çıkarım yaparız.

She can't have stayed at home. (Evde kalmış olamaz.) (Çıkarım: "Çünkü evini aradım, açan olmadı.")

### 3B. Olasılık (Belki Olmuştur)
MAY HAVE + V3 / MIGHT HAVE + V3 / COULD HAVE + V3 (-mış olabilir) Geçmişte bir şeyin olmuş olabileceğini, ancak emin olmadığımızı belirtir.

"Where did the children go?" "They might have visited their grandfather." ("Çocuklar nereye gitti?" "Dedelerini ziyaret etmiş olabilirler.")

You may have lost your key in the car. (Anahtarını arabada kaybetmiş olabilirsin.)

He could have been at the cinema, but I’m not sure. (Sinemada olmuş olabilir ama emin değilim.)

### 3C. Beklenti (Olması Gerekirdi)
SHOULD HAVE + V3 (-mış olması gerekirdi) Her şey yolunda gittiyse, geçmişte bir olayın gerçekleşmiş olduğunu varsaydığımızı belirtiriz.

The train should have left by now. (Tren şimdiye kadar kalkmış olmalıydı.)

## 4. Çok Önemli Özel Kullanım: "Could Have V3" (Olabilirdi ama Olmadı)
Bu yapı, diğerlerinden farklı özel bir anlam daha taşır: Geçmişte bir şeyin olması mümkündü (potansiyel vardı), ancak olmadı.

I forgot to lock the car. Someone could have stolen it. (Arabayı kilitlemeyi unuttum. Birisi onu çalabilirdi.) (Potansiyel: Çalınma potansiyeli vardı. / Sonuç: Ama çalınmadı.)

"We played football with that bomb." "You fool! It could have gone off! You might have died!" ("Şu bombayla futbol oynadık." "Seni aptal! Patlayabilirdi! Ölebilirdiniz!") (Potansiyel: Patlama ve ölme potansiyeli vardı. / Sonuç: Ama olmadı.)
`,
      example: 'She must be on the bus. (Otobüste olmalı.)'
    },
    {
      title: 'Reflexive Pronouns (Dönüşlülük Zamirleri)',
      summary: `Merhaba! Bugünkü konumuz, İngilizcede eylemin "dönüp dolaşıp" özneye geri döndüğünü gösteren "Reflexive Pronouns" (Dönüşlülük Zamirleri). Bu zamirler, Türkçedeki "kendi kendime", "bizzat kendisi" gibi anlamları karşılar ve cümlelerimizi daha akıcı hale getirmek için kritik bir rol oynar.

Bu zamirleri, kelimelerin sonundaki -self (tekil) veya -selves (çoğul) eklerinden tanıyabilirsiniz.

## Dönüşlülük Zamirleri Listesi
Her özne zamirinin (I, you, he...) kendine ait bir dönüşlülük zamiri vardır. Temel listemiz şu şekildedir:

Özne (Subject)	Dönüşlülük Zamiri (Reflexive Pronoun)	Türkçe Karşılığı
I (Ben)	myself	kendim
You (Sen - Tekil)	yourself	kendin
He (O - Erkek)	himself	kendisi
She (O - Kadın)	herself	kendisi
It (O - Cansız/Hayvan)	itself	kendisi
We (Biz)	ourselves	kendimiz
You (Siz - Çoğul)	yourselves	kendiniz
They (Onlar)	themselves	kendileri

## 1. Temel Kullanım: Özne ve Nesne Aynı Olduğunda
Dönüşlülük zamirlerinin en temel ve en önemli görevi budur: Bir cümlenin öznesi (eylemi yapan) ile nesnesi (eylemden etkilenen) aynı kişi veya şey olduğunda kullanılır.

Bu kuralı anlamak için şu iki cümleye bakalım:
John saw him in the mirror. (John, aynada onu [başka bir erkeği] gördü.)
John saw himself in the mirror. (John, aynada kendini [John'u] gördü.)

Diğer Örnekler:
He cut himself while chopping vegetables. (Sebze doğrarken kendini kesti.)
My mother often talks to herself. (Annem sık sık kendi kendine konuşur.)
The band call themselves "The Beatles". (Grup, kendilerine "The Beatles" diyor.)

## 2. Vurgu Amaçlı Kullanım (Intensive Pronouns)
Bazen bu zamirleri, cümlenin nesnesi olarak değil, özneyi vurgulamak için kullanırız. Bu durumda anlam "bizzat", "...nın ta kendisi" şeklinde olur ve cümleden çıkarılsa bile cümlenin anlamı bozulmaz.

Kullanım 1: Özneden Hemen Sonra (Bizzat...)
I myself drew this picture. (Bu resmi bizzat kendim çizdim.)
The boss himself congratulated the team. (Patronun ta kendisi ekibi tebrik etti.)
NASA itself has refuted all claims. (NASA'nın ta kendisi tüm iddiaları çürüttü.)

Kullanım 2: Cümlenin Sonunda (Vurgu)
I wrote this essay myself. (Bu makaleyi kendim yazdım.) [Başkasından yardım almadım anlamında]
She learned Spanish herself. (İspanyolcayı kendisi öğrendi.)

## 3. "By + Reflexive Pronoun" Kullanımı (Kendi Başına)
Bu zamirleri "by" edatıyla birlikte kullandığımızda, cümleye "yalnız", "kendi başına", "yardım almadan" anlamı katarız. Bu kalıp on my own, on his own vb. yapılarıyla eş anlamlıdır.

I don’t like eating by myself. (Kendi başıma / Yalnız yemek yemeyi sevmiyorum.)
She learned Spanish by herself in a year. (Bir yılda kendi kendine İspanyolca öğrendi.)
The baby opened the door by himself. (Bebek kapıyı kendi başına açtı.)

## 4. Bazı Özel Fiillerle Kalıplaşmış Kullanımlar
Bazı fiiller dönüşlülük zamirleriyle kalıplaşmış ifadeler oluşturur:
Enjoy oneself: Keyifli vakit geçirmek, eğlenmek.
I would love to lay down on the beach and enjoy myself. (Plajda uzanıp keyif yapmayı çok isterdim.)
Behave oneself: Düzgün davranmak, uslu durmak.
You have to behave yourself while talking to your teacher. (Öğretmeninle konuşurken düzgün davranman gerekir.)
Help oneself to something: Bir yiyecek/içecekten (serbestçe) almak, ikram almak.
Please, help yourself to some cake. (Lütfen, biraz kek alın.)

## ❗️ En Sık Yapılan Hatalar ve Önemli Uyarılar
ÖZNE OLARAK KULLANILAMAZ! Bu, en sık yapılan hatadır. Dönüşlülük zamirleri asla cümlenin öznesi olamaz.
Yanlış: ~~Herself~~ sent the email.
Doğru: She sent the email herself. (E-postayı bizzat kendisi gönderdi.)
Yanlış: ~~John and myself~~ will help you.
Doğru: John and I will help you.

NESNE OLARAK KULLANIM YANLIŞI
Sıradan bir nesne zamiri ("me", "you", "him") yerine dönüşlülük zamiri kullanamazsınız.
Yanlış: Please reach out to Jane or ~~myself~~.
Doğru: Please reach out to Jane or me.

YIKLIŞ OLUŞTURMA
himself ve themselves formlarına dikkat edin.
Yanlış: ~~hisself~~
Doğru: himself
Yanlış: ~~theirselves~~
Doğru: themselves

ÇOĞUL EKİNE DİKKAT! Çoğul zamirlerde (we, you [çoğul], they) sondaki -self, -selves olur.
Yanlış: ~~ourself~~, ~~themself~~
Doğru: ourselves, themselves
`,
      example: 'He cut himself while chopping vegetables. (Sebze doğrarken kendini kesti.)'
    }
  ],
  B2: [
    {
      title: 'Passive Voice (Edilgen Yapı)',
      summary: `Merhaba! Bugünkü konumuz, İngilizcenin en temel gramer yapılarından biri olan Passive Voice, yani Türkçedeki Edilgen Çatı.
Bu yapıyı anlamak için önce "Active" (Etken) cümlenin ne olduğunu bilmeliyiz.

Active (Etken) Cümle: Eylemi kimin yaptığını vurgular. Özne (işi yapan) cümlenin başındadır.
Active: I saw him. (Onu gördüm.) -> (İşi yapan: Ben)

Passive (Edilgen) Cümle: Eylemin kendisini veya eylemden etkilenen nesneyi vurgular.
Passive: He was seen (by me). (O (benim tarafımdan) görüldü.) -> (Önemli olan "onun" görülmesidir.)

## Passive Voice Neden ve Ne Zaman Kullanılır?
Passive Voice'u üç ana durumda tercih ederiz:

Eylemi Yapan Bilinmiyorsa: My money was stolen. (Param çalındı.) (Kimin çaldığını bilmiyoruz.)

Eylemi Yapan Önemli Değilse (Önemli Olan Eylemin Kendisiyse): The window was broken. (Cam kırıldı.) (Kimin kırdığının bir önemi yok, sonuçta cam kırık.)

Eylemden Etkilenen Nesneyi Vurgulamak İstediğimizde: Istanbul was conquered by Mehmet the Second. (İstanbul, İkinci Mehmet tarafından fethedildi.) (Odağımız "İstanbul"dur, "Mehmet the Second" değil.)

## ❗️ Önemli Kural: Hangi Fiiller "Passive" Olamaz?
Passive cümle kurabilmek için, fiilin "geçişli" (transitive), yani nesne alabilen bir fiil olması gerekir.
Eğer bir fiil "neyi?", "kimi?" sorularına cevap veremiyorsa (yani nesne alamıyorsa), o fiil "geçişsiz"dir (intransitive) ve PASSIVE YAPILAMAZ.

Geçişsiz Fiil (Nesne Almaz): uyumak, yüzmek, gitmek, gelmek, yağmur yağmak
Active: Ben iyi yüzerim.
Passive: ~~Ben iyi yüzülürüm.~~ (Anlamsız ve yanlıştır.)

Geçişli Fiil (Nesne Alır): kırmak (neyi? camı), görmek (kimi? onu), temizlemek (neyi? odayı)
Active: Çocuk camları kırdı.
Passive: Camlar (çocuk tarafından) kırıldı. (Anlamlı ve doğrudur.)

## Temel Formül: BE + V3 (Fiilin 3. Hali)
Passive Voice'un "Altın Kuralı" budur. Hangi Tense'i kullanırsak kullanalım, kural değişmez: "to be" fiilini cümlenin zamanına göre çekimleriz (is, was, has been, will be vb.) ve ana fiili her zaman 3. halinde (V3 - Past Participle) kullanırız.

## Aktif Cümleyi Pasif Cümleye Çevirme
Aktif cümlenin nesnesini alır, pasif cümlenin öznesi yaparız. Cümlenin zamanına göre BE + V3 kuralını uygularız. (İsteğe bağlı) Aktif cümlenin öznesini, pasif cümlenin sonuna "by" ile ekleriz.
Active: My mother (Özne) is cleaning (Fiil) our windows (Nesne).
Passive: Our windows (Yeni Özne) are being cleaned (Fiil) by my mother (Opsiyonel).

## Tüm Zamanlarda (Tenses) Passive Voice Yapıları
İşte tüm zamanların Active-Passive dönüşüm tablosu (kısa özet):

Simple Present
Active: The boy breaks the windows.
Passive: The windows are broken.

Present Continuous
Active: The boy is breaking the windows.
Passive: The windows are being broken.

Simple Past
Active: The boy broke the windows.
Passive: The windows were broken.

Past Continuous
Active: The boy was breaking the windows.
Passive: The windows were being broken.

Present Perfect
Active: The boy has broken the windows.
Passive: The windows have been broken.

Past Perfect
Active: The boy had broken the windows.
Passive: The windows had been broken.

Future (Will)
Active: The boy will break the windows.
Passive: The windows will be broken.

Future (Going to)
Active: The boy is going to break the windows.
Passive: The windows are going to be broken.

Modals (can, must...)
Active: The boy can break the windows.
Passive: The windows can be broken.

Perfect Modals
Active: The boy must have broken the windows.
Passive: The windows must have been broken.

## ✍️ Passive Voice Püf Noktaları ve Özel Kurallar

### 1. Çift Nesneli Cümleler (Two Objects)
Bazı fiiller (give, send, show) iki nesne alır: biri dolaylı (kime?), biri dolaysız (neyi?).
Active: My parents gave me a book. (My parents gave me a book.)
Pasif yaparken, kişiyi (dolaylı nesneyi) özne yapmak daha yaygındır:
Tercih Edilen: I was given a book. (Bana bir kitap verildi.)
Mümkün Olan: A book was given to me. (Bana bir kitap verildi.) (Burada "to" eklemeye dikkat edin.)

### 2. Edatlı Fiiller (Prepositional Verbs)
Eğer fiilin bir edatı varsa (look for, blow up, look after), bu edat pasif cümlede fiilden ayrılmaz, hemen arkasında kalır.
Active: They were looking for the pet. (Ev hayvanını arıyorlardı.)
Passive: The pet was being looked for. (Ev hayvanı aranıyordu.)
Active: You should blow up the tyres. (Lastikleri şişirmelisin.)
Passive: The tyres should be blown up. (Lastikler şişirilmeli.)

### 3. Raporlama Fiilleri (say, believe, think, know)
say, believe, think gibi fiillerle pasif cümle kurmanın iki yaygın yolu vardır:
Active: People say that that man is a thief. (İnsanlar o adamın hırsız olduğunu söylüyor.)
Yol 1: "It" ile Başlamak
Passive: It is said that that man is a thief. (O adamın hırsız olduğu söyleniyor.)
Yol 2: Kişiyi Özne Yapmak (daha yaygın)
Passive: That man is said to be a thief. (O adamın hırsız olduğu söyleniyor.)
Geçmiş bir durumu raporluyorsak "to have V3" kullanılır:Active: Everybody knows he was rich. (Herkes onun zengin olduğunu biliyor.)
Passive: He is known to have been rich. (Onun zengin olduğu biliniyor.)

### 4. Olumsuz Cümle Dönüşümleri (any / no)
any, anybody gibi kelimeler içeren olumsuz cümleler pasife çevrilirken no, nobody vb. yapılara dönüşür ve cümle olumlu hale gelir:
Active: They didn't bring any flowers. (Hiç çiçek getirmediler.)
Passive: No flowers were brought. (Hiç çiçek getirilmedi.)
Active: They haven't arrested anybody. (Hiç kimseyi tutuklamadılar.)
Passive: Nobody has been arrested. (Hiç kimse tutuklanmadı.)

### 5. "Who" ile Başlayan Soru Cümleleri
Active: Who killed the man? (Adamı kim öldürdü?)
Yol 1: (Yaygın Konuşma Dili)Passive: Who was the man killed by? 
Yol 2: (Resmi Yazı Dili)Passive: By whom was the man killed?
`,
      example: 'The cake was eaten. (Kek yendi.)'
    },
    {
    title: 'Reported Speech (Indirect Speech)',
    summary: `Merhaba! Bugünkü konumuz, İngilizcede bir başkasının söylediği cümleyi aktarmanın yolları: Reported Speech (veya Indirect Speech).
Bu konuyu iki temel başlıkta inceleyebiliriz:

Direct Speech (Doğrudan Anlatım): Bir kişinin sözlerini hiç değiştirmeden, tırnak işaretleri ("...") içinde aktarmaktır.
Direct: She said, "I am hungry." ("Açım," dedi.)

Reported Speech (Dolaylı Anlatım): Bir kişinin sözlerini, kendi cümlemizin içine katarak, anlamı koruyarak ama yapıyı değiştirerek aktarmaktır.
Reported: She said that she was hungry. (Aç olduğunu söyledi.)

## Altın Kural: "Bir Adım Geri" (One Step Back)
Dolaylı anlatımın temel kuralı budur. Eğer bir sözü geçmiş zamanda (He said..., She told me... gibi) aktarıyorsak, orijinal cümlenin zamanını (tense) bir adım geçmişe alırız.

Geniş Zaman → Geçmiş Zaman
Şimdiki Zaman → Geçmiş Zaman (Continuous)
Geçmiş Zaman → Miş'li Geçmiş Zaman

Bu aktarım sırasında 3 temel değişiklik yaparız:
Zaman (Tense) Değişikliği
Zamir (Pronoun) Değişikliği
Zaman/Yer Zarflarının Değişikliği

## 1. Zaman ve Modal Değişiklikleri (Tense Backshift)
Aktarılan cümlenin zamanını bir adım geriye alırız.

Direct Speech (Orijinal Cümle)	Indirect Speech (Aktarılan Cümle)
Simple Present (Geniş Zaman)	Simple Past (Geçmiş Zaman)
"I live in Paris." 	He said he lived in Paris.
Present Continuous	Past Continuous
"I am cooking dinner." 	He said he was cooking dinner.
Simple Past	Past Perfect (Miş'li Geçmiş Zaman)
"I went to New York." 	He said he had gone to New York.
Present Perfect	Past Perfect
"I have visited London." 	He said he had visited London.
Past Perfect	Past Perfect (Değişmez)
"I had already eaten." 	He said he had already eaten.
Will (Gelecek Zaman)	Would
"I will call Jack." 	He said he would call Jack.
Can (-ebilmek)	Could
"I can come tonight." 	He said he could come that night.
May (Olasılık)	Might
"I may buy a new car." 	He said he might buy a new car.
Must (Zorunluluk)	Had to
"I must give Ken a call." 	He said he had to give Ken a call.
Should / Might / Could / Would	(Değişmez)
"I should see a doctor." 	He said he should see a doctor.

## 2. Zamir Değişiklikleri (Pronoun Changes)
Aktarımı yapan kişinin bakış açısına göre zamirler değişmek zorundadır.
Direct: She said, "I want to bring my children."
Reported: She said she wanted to bring her children. ("I" → "she" ve "my" → "her".)

Direct: Jack said, "My wife went with me."
Reported: Jack said his wife had gone with him.

## 3. Zaman ve Yer Zarflarının Değişikliği
Orijinal cümlenin söylendiği "an" ve "yer" ile, bizim onu aktardığımız "an" ve "yer" farklıdır. Bu nedenle zaman ve yer zarflarını da güncellememiz gerekir.

Direct Speech	Reported Speech
today	that day
tonight	that night
now	then / at that moment
yesterday	the day before / the previous day
... days ago	... days before
last week	the week before / the previous week
tomorrow	the next day / the following day
next week	the following week
this	that
these	those
here	there

## Kritik Fark: Say vs. Tell
Say vs. Tell kullanımı sıkça karıştırılır. Kısa kural:
1) SAY: Kime söylediğimizi belirtmek için "to" kullanılır. Kime söylemediğimizi belirtmiyorsak hiçbir şey yok.
  - He said that he was tired.
  - He said to me that he was tired.

2) TELL: Tell fiilinden sonra, kime söylediğimizi belirten bir nesne (me, him, her, us) kullanmalıyız. Asla "to" almaz.
  - He told me that he was tired.

## Gelişmiş Konular: Soru ve Emir Cümlelerini Aktarma
### 1. Soru Cümlelerini Aktarma (Reporting Questions)
Soru cümlelerini aktarırken said yerine asked (sordu) fiilini kullanırız ve aktarılan cümle soru formundan çıkar, düz cümleye dönüşür.

A) Evet/Hayır Soruları (Yes/No Questions):
Direct: She asked, "Did you finish your homework?"
Reported: She asked if I had finished my homework.

B) WH- Soruları (What, Where, When...):
Direct: He asked, "Where is the nearest post office?"
Reported: He asked where the nearest post office was.

### 2. Emir ve Rica Cümlelerini Aktarma (Reporting Commands)
Emirleri veya ricaları aktarırken told, asked, reminded gibi fiillerden sonra to + Fiil (V1) veya olumsuzsa not to + Fiil (V1) yapısını kullanırız.
Direct: He said, "Please, call me when you arrive."
Reported: He asked me to call him when I arrived.

Direct: He reminded her, "Don't forget to buy milk."
Reported: He reminded her not to forget to buy milk.

## ❗️ İstisnalar: Ne Zaman "Bir Adım Geri" Kuralı Uygulanmaz?
1) Genel Geçer Doğrular (General Truths): Bilimsel gerçek ve genel doğrular backshift uygulanmaz.
  - Direct: The teacher said, "Phrasal verbs are very important."
  - Reported: The teacher said that phrasal verbs are very important.

2) Aktarım Fiili Geniş Zaman İse (Present Reporting Verb): He says..., She tells me... gibi geniş zamanda yapılan aktarımlarda backshift uygulanmaz.
  - Direct: He says, "The test is difficult."
  - Reported: He says the test is difficult.
`,
  example: 'She said that she was hungry. (Aç olduğunu söyledi.)'
   },
   {
  title: 'Relative Clauses (Sıfat Cümlecikleri)',
  summary: `🚀 Relative Clauses (Sıfat Cümlecikleri) Kapsamlı Konu Anlatımı
Merhaba! Bugünkü konumuz, İngilizce cümlelerimizi çok daha zengin ve akıcı hale getirmemizi sağlayan "Relative Clauses". Bu konuyu Türkçe'de "Sıfat Cümlecikleri" veya "İlgi Tümceleri" olarak da duyabilirsiniz.

Peki, ne işe yarar bu "Relative Clauses"? Temel amacı, bir cümle içindeki bir ismi (kişi, yer, nesne) nitelemek ve o isim hakkında bize fazladan bilgi vermektir.

Bu yapı sayesinde:

İki ayrı cümleyi tek bir akıcı cümlede birleştirebiliriz.

Hangi kişi veya nesneden bahsettiğimizi daha net tanımlayabiliriz.

Cümlelerimize ekstra detaylar katabiliriz.

## Temel Kural: İki Cümleyi Birleştirmek
Bu konunun ana mantığı, ortak bir ögeye sahip iki cümleyi birleştirmektir.

Cümle 1: A woman opened the door. (Kapıyı bir kadın açtı.)

Cümle 2: She was wearing a white dress. (Beyaz bir elbise giyiyordu.)

Bu iki cümlede ortak olan öge "A woman" (bir kadın) ve "She" (o). İkinci cümle, birinci cümledeki kadın hakkında bize fazladan bilgi veriyor. İşte bu bilgiyi, "Relative Clause" kullanarak tek cümlede birleştiriyoruz:

Birleşik Cümle: The woman **who** was wearing a white dress opened the door. (Beyaz elbise giyen kadın kapıyı açtı.)

Gördüğünüz gibi, ikinci cümleyi "who" zamirini kullanarak bir sıfat cümleciğine dönüştürdük ve nitelediği isim olan "The woman" kelimesinden hemen sonraya koyduk.

## Relative Pronouns (İlgi Zamirleri): Who, Which, That
"Relative Clause"ları ana cümleye bağlamak için "Relative Pronouns" (İlgi Zamirleri) kullanırız. Bunlar soru kelimeleri gibi görünse de, burada görevleri soru sormak değil, bağlaç olmaktır.

### 1. WHO (Kişiler için)
Nitelediğimiz isim bir insan ise "who" kullanırız.

Cümleye "...-en, ...-an" anlamı katar.

Örnek: Graham Bell is the man **who** invented the telephone. (Graham Bell, telefonu icat eden adamdır.)

Örnek: The workers **who** I met were tired. (Karşılaştığım işçiler yorgundu.)

### 2. WHICH (Nesneler ve Hayvanlar için)
Nitelediğimiz isim bir nesne veya hayvan ise "which" kullanırız.

Örnek: This is the building **which** my grandfather built. (Bu, dedemin inşa ettiği binadır.)

Örnek: I found the book **which** was important. (Önemli olan kitabı buldum.)

Örnek: This is a race horse **which** runs very fast. (Bu, çok hızlı koşan bir yarış atıdır.)

### 3. THAT (Joker Zamir)
Hem "who" (insanlar) hem de "which" (nesneler) yerine kullanılabilen joker bir zamirdir.

Genellikle günlük konuşma dilinde daha yaygındır.

Örnek: The man **that** sold the world... (Dünyayı satan adam...)

Örnek: The cake **that** she baked was delicious. (Onun pişirdiği kek lezzetliydi.)

## En Önemli Ayrım: Defining vs. Non-Defining Clauses
Bu konunun en kritik noktası bu iki yapı arasındaki farktır. Bu farkı anlamak, virgül (,) kullanıp kullanmayacağımızı ve "that" kullanıp kullanamayacağımızı belirler.

### 1. Defining Relative Clause (Tanımlayıcı Sıfat Cümleciği)
Görevi: Cümlenin anlaşılması için gerekli olan, hayati bilgiyi verir.

"Hangi" sorusunun cevabıdır. (Hangi adam? Bankayı soyan adam.)

Bu cümlecik cümleden atılırsa, cümlenin anlamı bozulur veya eksik kalır.

Virgül (,) KULLANILMAZ.

"who" ve "which" yerine "that" KULLANILABİLİR.

Örnek: The man **who robbed the bank** was caught. (Bankayı soyan adam yakalandı.)

(Buradaki who robbed the bank cümlesi hangi adamdan bahsettiğimizi tanımlar. Bu bilgiyi çıkarırsak, The man was caught. [Adam yakalandı] kalır. Hangi adam? Cümle eksik kalır.)

Örnek: I can’t find the shirt **that I bought last year**. (Geçen sene aldığım gömleği bulamıyorum.)

(Hangi gömlek? Geçen sene aldığım.)

### 2. Non-Defining Relative Clause (Tanımlayıcı Olmayan Cümlecik)
Görevi: Zaten kimi veya neyi kastettiğimizi bildiğimiz bir isim hakkında ekstra bilgi verir.

Bu cümlecik cümleden atılırsa, cümlenin ana anlamı bozulmaz.

Cümleciğin başına ve sonuna mutlaka Virgül (,) konulur.

KESİNLİKLE "THAT" KULLANILMAZ! (Sadece "who" veya "which" kullanılır.)

Örnek: My friend, **who is from Antalya**, is going to visit me tomorrow. (Arkadaşım, ki kendisi Antalyalıdır, yarın beni ziyaret edecek.)

(Buradaki who is from Antalya bilgisi ekstradır. Çıkarsak bile My friend is going to visit me tomorrow. [Arkadaşım yarın beni ziyaret edecek] cümlesi anlamlıdır.)

Örnek: Our school, **which was built in 1995**, is the oldest school. (Okulumuz, ki 1995'te inşa edilmiştir, en eski okuldur.)

("Okulumuz" zaten belirli bir yerdir. Ne zaman yapıldığı ekstra bilgidir.)

## Zamirin Cümleden Atılması (Omission)
Peki, who, which veya that zamirlerini cümleden ne zaman atabiliriz? Kural çok basittir:

Eğer nitelediğimiz isim, sıfat cümleciğinin öznesi değil de nesnesi ise, zamiri atabiliriz.

Peki, özne mi nesne mi nasıl anlarız?

Zamirden (who/which/that) sonra hemen bir fiil (is, plays, was) geliyorsa, o zamir ÖZNEDİR ve ATILAMAZ.

The man **who plays** tennis... ("plays" fiildir, "who" atılamaz.)

Zamirden sonra yeni bir özne (I, she, they, my mom) geliyorsa, o zamir NESNEDİR ve ATILABİLİR.

I sang the song **(that) she wrote**.

(Burada "that"ten sonra yeni bir özne olan "she" gelmiştir. "that" atılabilir.)

Örnek: We cannot find the parcel **(which) you sent** us last week. (Geçen hafta gönderdiğiniz paketi bulamıyoruz.)

Örnek: The teachers **(who) we take lessons from**... (Ders aldığımız öğretmenler...)

## Diğer Relative Zamir ve Zarfları
### WHOSE (Sahiplik Bildiren / -nin, -nın)
Kişi veya nesnelerin kime ait olduğunu belirtir.

his, her, my, its gibi iyelik sıfatlarının yerine geçer.

Hem insanlar hem de nesneler için kullanılabilir.

Örnek: The girl **whose** family is very poor studies at Harvard. (Ailesi çok fakir olan kız Harvard'da okuyor.)

Örnek: This is the car **whose** key you own. (Bu, anahtarına sahip olduğun arabadır.)

### WHERE (Yer Bildiren / -dığı yer)
Bir mekanı niteler. in which, at which yerine kullanılır.

Örnek: We stayed in a hotel **where** there were many tourists. (Çok fazla turistin olduğu bir otelde kaldık.)

Örnek: The city **where** I was born is famous. (Doğduğum şehir ünlüdür.)

### WHEN (Zaman Bildiren / -dığı zaman)
Bir zaman dilimini niteler. on which, in which yerine kullanılır.

Örnek: Sunday is the day **when** we do not work. (Pazar, çalışmadığımız gündür.)

Örnek: The year **when** we first met was unforgettable. (İlk tanıştığımız yıl unutulmazdı.)

### WHY (Neden Bildiren)
Genellikle "the reason" (sebep) kelimesinden sonra kullanılır.

Örnek: The reason **why** I couldn’t attend the meeting was I was ill. (Toplantıya katılamamamın sebebi hasta olmamdı.)
`,
  example: 'The woman who was wearing a white dress opened the door. (Beyaz elbise giyen kadın kapıyı açtı.)'
   }
   ,
   {
  title: 'Third Conditional (If Clause Type 3)',
  summary: `Merhaba! Bugünkü konumuz, şartlı cümlelerin (Conditionals) belki de en melankolik olanı: "Third Conditional" ya da diğer adıyla "If Clause Type 3".

Bu yapıyı, geçmişte kalmış, artık değiştirilmesi imkansız olan, hayali durumları ve bu durumların yine geçmişte kalmış hayali sonuçlarını anlatmak için kullanırız.

Kısacası, bu Tense tamamen pişmanlıklar ve gerçekleşmemiş olasılıklar üzerinedir. Türkçedeki "Eğer öyle olsaydı, böyle olurdu" kalıbının tam karşılığıdır.

Gerçek Durum: Dün ders çalışmadım ve sınavdan kaldım.

Hayali Durum (Type 3): If I had studied harder, I would have passed the exam. (Eğer daha sıkı çalışsaydım, sınavı geçerdim.)

Gördüğünüz gibi, artık çok geçtir ve sadece geçmişe yönelik bir varsayımda bulunuyoruz.

## ⚙️ "If Clause Type 3" Cümle Yapısı
Bu yapıda cümlemiz iki bölümden oluşur:

"If Clause" (Hayali Şart): Geçmişte olmamış olan şartı belirtir.

"Main Clause" (Hayali Sonuç): O şarta bağlı olarak geçmişte yaşanacak hayali sonucu belirtir.

Temel formülümüz şudur:

If Clause (Hayali Şart)\tMain Clause (Hayali Sonuç)
If + Past Perfect Tense (had + V3)\tPerfect Conditional (would have + V3)
If I had known... (Eğer bilseydim...)\t...I would have come. (...gelirdim.)
If it had rained... (Eğer yağmur yağsaydı...)\t...you would have gotten wet. (...ıslanırdın.)

## Örnekler
If I had studied harder, I would have passed the exam. (Eğer daha çok çalışmış olsaydım, sınavı geçerdim.)

You would have passed your exam if you had worked harder. (Eğer daha sıkı çalışmış olsaydın sınavını geçerdin.)

If I had known you were in hospital, I would have visited you. (Hastanede olduğunu bilseydim seni ziyaret ederdim.)

## 💡 Kısaltmalar: " 'd " Nerede "had", Nerede "would"?
If I'd known... / ...I'd have visited...

If'd lerdeki 'd ayrımına dikkat edin: If li cümlenin içindeki 'd genelde had'in kısaltmasıdır. Sonuç kısmında görülen "I'd have" ise "I would have" demektir.

## 📌 Alternatif Modallar ve Kullanımlar
Ana cümlede might have / could have gibi farklı modal yapılar kullanılabilir:

If she had taken the earlier flight, she might have arrived on time.
If they had arrived on time, they could have caught the train.

## 🗣️ Inversion (Devrik Yapı)
Resmi yazılarda "if" kullanmadan "Had" ile devrik yapı kurabiliriz:

Had I known the truth... (Gerçeği bilmiş olsaydım...)

## Tip: Type 3 ile Diğer Tiplerin Farkı
Type 1: If I study harder, I will pass.
Type 2: If I studied harder, I would pass.
Type 3: If I had studied harder, I would have passed.
`,
  example: 'If I had studied harder, I would have passed the exam. (Eğer daha çok çalışmış olsaydım, sınavı geçerdim.)'
   }
  ,
   {
    title: 'Causative / Ettirgen Çatı',
    summary: `Merhaba! Bugünkü konumuz, Türkçede "-dırtmak, -tirmek" (yaptırmak, kestirmek, temizletmek) gibi eklerle ifade ettiğimiz "Ettirgen Çatı".

İngilizcede bu anlamı vermek için have, get, make, let ve help gibi özel fiiller kullanırız. Bu fiiller, bir işi başkasına yaptırdığımızı belirtir ancak aralarında önemli anlam farkları vardır.

Bu konuyu iki ana bölümde inceleyeceğiz:

1) Aktif Ettirgen Çatı: İşi kime yaptırdığımızın belli olduğu durumlar.
2) Pasif Ettirgen Çatı: İşi kimin yaptığının önemli olmadığı, sadece hizmetin alındığının vurgulandığı durumlar (en yaygın kullanım).

## 1. Aktif Ettirgen Çatı (İşi Yapan Belli Olduğunda)
Burada, eylemi kime yaptırdığımızı (sekreter, tamirci, vb.) cümlede belirtiriz. Kullandığımız fiil (make, have, get, let, help) eylemin nasıl yaptırıldığını (zorla, rica ederek, ikna ederek) belirler.

### MAKE (Zorla yaptırmak)
Formül: Make + somebody + do (V1)
I made my students come to class on time. (Öğrencilerimi derse zamanında gelmeye zorladım.)

### HAVE (Rica ederek / görevlendirerek yaptırmak)
Formül: Have + somebody + do (V1)
I will have the mechanic fix the car. (Tamirciye arabayı tamir ettireceğim.)

### GET (İkna ederek yaptırmak)
Formül: Get + somebody + to + do (V1)
I got her to tell me the truth. (Onu gerçeği söylemeye ikna ettim.)

### LET (İzin vermek)
Formül: Let + somebody + do (V1)
My boss let me take a day off. (Patronum bir gün izin almama izin verdi.)

### HELP (Yardım etmek)
Formül: Help + somebody + (to) + do (V1)
I helped him water the plants. (Bitkileri sulamasına yardım ettim.)

## 2. Pasif Ettirgen Çatı (İşi Yapan Önemli Olmadığında)
Günlük İngilizcede en sık kullanılan form budur. "Saçımı kestirdim" gibi cümlelerde işi yapan kişi önemsizdir; önemli olan hizmetin yapılmış olmasıdır.

Formül: Have / Get + something + done (V3)
I had my hair cut. (Saçımı kestirdim / kestirdim.)
I got my car washed. (Arabamı yıkattırdım.)

Aktif → Pasif dönüşümü örnek:
Aktif (yapan belli): I have the barber cut my hair.
Pasif (iş önemli): I have my hair cut.

## 3. Örnek Tablo (Kısa Özet)
Zaman | Aktif Ettirgen (yapan belli) | Pasif Ettirgen (iş önemli)
Present | I have the barber cut my hair. | I have my hair cut.
Past    | I had the students read many books. | I had many books read.
Future  | I'll have the shoeman mend my shoes. | I'll have my shoes mended.

## 4. Dikkat Edilmesi Gerekenler
- MAKE pasif olduğunda: be made to do (zorla yaptırılma)
- LET pasif olduğunda genelde be allowed to do (izin verilme)
- GET yapısında aktif halinde genelde "to" kullanılır (get somebody to do)

## 5. Kaza / Olay Anlatımı
Bu yapı olumsuz olayları anlatırken de kullanılır: I had my wallet stolen. (Cüzdanımı çaldırdım.)
`,
    example: 'I had my hair cut. (Saçımı kestirdim.)'
   }
  ]
};

const levels: LevelKey[] = ['A1', 'A2', 'B1', 'B2'];

const renderRichText = (text?: string) => {
  if (!text) return null;
  return text.split(/\n{2,}/).map((block, i) => {
    const trimmed = block.trim();
    if (/^##\s*/.test(trimmed)) {
      return (
        <Typography key={i} variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>{trimmed.replace(/^##\s*/, '')}</Typography>
      );
    }
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    const firstLine = lines[0] || '';
    const startsWithUpper = /^[A-ZÇĞİÖŞÜ]/.test(firstLine);
    const isShortFirst = firstLine.length > 0 && firstLine.length < 100;
    if (lines.length > 1 && startsWithUpper && isShortFirst) {
      const rest = lines.slice(1).join('\n\n');
      return (
        <Box key={i}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>{firstLine}</Typography>
          <Typography component="div" variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', mb: 1.5, lineHeight: 1.7 }}>{rest}</Typography>
        </Box>
      );
    }
    const isShort = firstLine.length > 0 && firstLine.length < 80 && lines.length === 1;
    if (isShort && startsWithUpper) {
      return (
        <Typography key={i} variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>{trimmed}</Typography>
      );
    }
    return (
      <Typography key={i} component="div" variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary', mb: 1.5, lineHeight: 1.7 }}>{trimmed}</Typography>
    );
  });
};

const TopicsPage: React.FC = () => {
  useEffect(() => {
    setMetaTags({
      title: 'Konular — Dilbilgisi Konuları ve Örnekler',
      description: 'A1-B2 seviyeleri için temel dilbilgisi konuları, örnekler ve ipuçları.',
      canonical: '/topics',
      ogImage: '/social-preview.svg'
    });
  }, []);

  const [selectedLevel, setSelectedLevel] = useState<LevelKey>('A1');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

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

  const allTopics = topicsData[selectedLevel];
  const query = search.trim();
  const displayTopics = query
    ? allTopics.filter(t => normalizeTR(`${t.title} ${t.summary}`).includes(normalizeTR(query)))
    : allTopics;

  const handleAccordionChange = (panel: string) => (_: any, isExpanded: boolean) => setExpanded(isExpanded ? panel : false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#b2dfdb', px: 2, pt: 0, pb: { xs: 12, md: 16 }, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ width: '100%', maxWidth: 900, borderRadius: 4, p: 0, mt: { xs: 1, md: '15px' }, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', textAlign: 'center' }}>
          <Typography component="h1" variant="h3" fontWeight={700} mb={1} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: { xs: '2rem', md: '2.5rem' } }}>Konular</Typography>
          <Typography component="h2" variant="h6" sx={{ opacity: 0.95 }}>A1–B2 seviyelerinde özet ve örneklerle İngilizce konuları</Typography>
        </Box>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Tabs
            value={selectedLevel}
            onChange={(_, val) => setSelectedLevel(val)}
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              '& .MuiTabs-flexContainer': { justifyContent: 'center' },
              '& .MuiTab-root': { minWidth: 72, px: 2, textTransform: 'none', color: 'rgba(0,0,0,0.48)', fontWeight: 700 },
              '& .MuiTab-root.Mui-selected': { color: '#0b3b66' }
            }}
            TabIndicatorProps={{ sx: { bgcolor: '#0b3b66', height: 3, borderRadius: 2 } }}
          >
            {levels.map(level => (
              <Tab key={level} value={level} label={level} />
            ))}
          </Tabs>

          <TextField fullWidth placeholder="Konu ara..." value={search} onChange={e => setSearch(e.target.value)} sx={{ mb: 3 }} />

          <Box>
            {displayTopics.map((topic, idx) => (
              <Accordion key={idx} expanded={expanded === `panel${idx}`} onChange={handleAccordionChange(`panel${idx}`)} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight={700} color="#00695c">{topic.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderRichText(topic.summary)}
                  {topic.example && (
                    <Paper elevation={0} sx={{ backgroundColor: 'rgba(0,0,0,0.03)', p: 2, borderRadius: 2, mt: 1 }}>
                      <Typography component="div" variant="body2" sx={{ whiteSpace: 'pre-line', color: 'text.secondary', fontStyle: 'italic' }}>{topic.example}</Typography>
                    </Paper>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TopicsPage;
