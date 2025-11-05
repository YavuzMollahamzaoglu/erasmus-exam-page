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
      title: 'To Be Fiili (am, is, are)',
      summary: 'Kimlik, durum veya yer belirtmek için kullanılır. Kısa örnek: I am a student.',
      example: 'I am a student. (Ben bir öğrenciyim.)',
      tip: 'İpucu: Am/is/are ile kendi durumlarını sınıfta söyleyerek pratik yapın.'
    },
    {
      title: 'Simple Present Tense (Geniş Zaman)',
      summary: 'Alışkanlıklar ve genel doğrular için kullanılır. Kısa örnek: She works in a bank.',
      example: 'She works in a bank. (O bir bankada çalışır.)',
      tip: 'İpucu: Günlük rutinlerinizi yazarak geniş zamanı kullanın.'
    },
    {
      title: 'This, That, These, Those',
      summary: 'Yakın/uzak nesneleri belirtmek için kullanılır. Kısa örnek: This is my book.',
      example: 'This is my book. (Bu benim kitabım.)',
      tip: 'İpucu: Nesneleri gösterip this/that/these/those ile eşleştirin.'
    },
    {
      title: 'There is / There are',
      summary: 'Bir yerde bir şeyin varlığını anlatmak için kullanılır. Kısa örnek: There is a cat in the garden.',
      example: 'There is a cat in the garden. (Bahçede bir kedi var.)',
      tip: 'İpucu: Sınıfta nesneleri sayıp there is/are ile cümle kurun.'
    },
    {
      title: 'Can / Can’t (Yetenek Bildiren Cümleler)',
      summary: 'Yetenek veya izin belirtmek için can/can’t kullanılır. Kısa örnek: I can swim.',
      example: 'I can swim. (Yüzebilirim.)',
      tip: 'İpucu: Sınıfta kim hangi yeteneğe sahip, can/can’t ile yazın.'
    },
    {
      title: 'Basic Question Forms (Temel Soru Kalıpları)',
      summary: 'Temel soru cümleleri: Do/Does, Wh- soruları vb. Kısa örnek: Do you like tea?',
      example: 'Do you like tea? (Çayı sever misin?)',
      tip: 'İpucu: Öğrenciler eşleştirici oyunla soru-cevap çalışsın.'
    }
  ],
  A2: [
      title: 'Have/Has',
      summary: `Sahip olunan şeyleri anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- I/You/We/They have\n- He/She/It has\n- Olumsuz: don’t/doesn’t have\n- Soru: Do/Does ... have\n\n**Sık Yapılan Hatalar:**\n- ~~He have a bike~~ (yanlış), **He has a bike** (doğru)\n- ~~I has a book~~ (yanlış), **I have a book** (doğru)\n\n**Örnekler:**\n1. He has a bike.\n   - (Onun bir bisikleti var.)\n2. I have a book.\n   - (Bir kitabım var.)\n3. Do you have a pet?\n   - (Evcil hayvanın var mı?)\n4. We don’t have a car.\n   - (Bizim arabamız yok.)`,
      example: `He has a bike. (Onun bir bisikleti var.)\nI have a book. (Bir kitabım var.)\nDo you have a pet? (Evcil hayvanın var mı?)\nWe don’t have a car. (Bizim arabamız yok.)`,
      tip: 'İpucu: Sahip olunan eşyaları resimlerle göstererek cümle kur.'
    },
    {
      title: 'Like/Love/Hate',
      summary: `Duyguları ve tercihleri anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- like/love/hate + isim/fiil-ing\n\n**Sık Yapılan Hatalar:**\n- ~~I like swim~~ (yanlış), **I like swimming** (doğru)\n- **She loves to read** (doğru), **She loves reading** (doğru)\n\n**Örnekler:**\n1. I like apples.\n   - (Elma severim.)\n2. She hates spiders.\n   - (O örümceklerden nefret eder.)\n3. We love reading books.\n   - (Kitap okumayı severiz.)\n4. Do you like music?\n   - (Müzik sever misin?)`,
      example: `I like apples. (Elma severim.)\nShe hates spiders. (O örümceklerden nefret eder.)\nWe love reading books. (Kitap okumayı severiz.)\nDo you like music? (Müzik sever misin?)`,
      tip: 'İpucu: Duyguları ve tercihleri resimlerle veya fiil-ing ile cümle kur.'
    },
    {
      title: 'Imperatives',
      summary: `Emir ve rica cümleleri için kullanılır.\n\n**Kullanım Kuralları:**\n- Olumlu: fiil yalın halde\n- Olumsuz: don’t + fiil\n- Rica: Please + fiil\n\n**Sık Yapılan Hatalar:**\n- ~~Don’t to go~~ (yanlış), **Don’t go** (doğru)\n- ~~Open the window please~~ (yanlış), **Please open the window** (doğru)\n\n**Örnekler:**\n1. Sit down!\n   - (Otur!)\n2. Please open the window.\n   - (Lütfen pencereyi aç.)\n3. Don’t run!\n   - (Koşma!)\n4. Be quiet!\n   - (Sessiz ol!)`,
      example: `Sit down! (Otur!)\nPlease open the window. (Lütfen pencereyi aç.)\nDon’t run! (Koşma!)\nBe quiet! (Sessiz ol!)`,
      tip: 'İpucu: Emir cümlelerini hareketlerle veya resimlerle anlat.'
    },
    {
      title: 'Prepositions of Place',
      summary: `Bir şeyin yerini belirtmek için kullanılır.\n\n**Kullanım Kuralları:**\n- in, on, under, next to, between, behind, in front of\n\n**Sık Yapılan Hatalar:**\n- ~~The cat is in the table~~ (yanlış), **The cat is on the table** (doğru)\n- **The book is under the chair** (doğru)\n\n**Örnekler:**\n1. The cat is under the table.\n   - (Kedi masanın altında.)\n2. The book is on the chair.\n   - (Kitap sandalyenin üstünde.)\n3. The dog is next to the door.\n   - (Köpek kapının yanında.)\n4. The ball is between the shoes.\n   - (Top ayakkabıların arasında.)`,
      example: `The cat is under the table. (Kedi masanın altında.)\nThe book is on the chair. (Kitap sandalyenin üstünde.)\nThe dog is next to the door. (Köpek kapının yanında.)\nThe ball is between the shoes. (Top ayakkabıların arasında.)`,
      tip: 'İpucu: Sınıfta nesnelerin yerini göstererek cümle kur.'
    },
    {
      title: 'Question Words',
      summary: `Soru sormak için kullanılır.\n\n**Kullanım Kuralları:**\n- What, Where, When, Who, Why, How\n\n**Sık Yapılan Hatalar:**\n- ~~Where you live?~~ (yanlış), **Where do you live?** (doğru)\n- **What is your name?** (doğru)\n\n**Örnekler:**\n1. Where do you live?\n   - (Nerede yaşıyorsun?)\n2. What is your name?\n   - (Adın ne?)\n3. Who is she?\n   - (O kim?)\n4. How old are you?\n   - (Kaç yaşındasın?)`,
      example: `Where do you live? (Nerede yaşıyorsun?)\nWhat is your name? (Adın ne?)\nWho is she? (O kim?)\nHow old are you? (Kaç yaşındasın?)`,
      tip: 'İpucu: Soru kelimeleriyle arkadaşına soru sor, cevapları yaz.'
    }
  ],
  A2: [
    {
      title: 'Bağlaçlar (And, But, Or, Nor, So, For)',
      summary: `Cümleleri veya kelimeleri birbirine bağlamak için kullanılır.\n\n**Kullanım Kuralları:**\n- and: iki olumlu veya benzer şeyi bağlar\n- but: zıtlık veya karşıtlık belirtir\n- or: seçenek sunar\n- nor: iki olumsuz şeyi bağlar\n- so: sebep-sonuç\n- for: neden belirtir\n\n**Sık Yapılan Hatalar:**\n- ~~I like tea but I like coffee.~~ (yanlış), **I like tea but I don’t like coffee.** (doğru)\n- ~~Do you want tea and coffee?~~ (yanlış), **Do you want tea or coffee?** (doğru)\n\n**Örnekler:**\n1. I like tea and coffee.\n   - (Çay ve kahveyi severim.)\n2. She is tired but happy.\n   - (O yorgun ama mutlu.)\n3. Do you want tea or coffee?\n   - (Çay mı yoksa kahve mi istersin?)\n4. He neither drinks tea nor coffee.\n   - (Ne çay ne de kahve içer.)`,
      example: `I like tea and coffee. (Çay ve kahveyi severim.)\nShe is tired but happy. (O yorgun ama mutlu.)\nDo you want tea or coffee? (Çay mı yoksa kahve mi istersin?)\nHe neither drinks tea nor coffee. (Ne çay ne de kahve içer.)`,
      tip: 'İpucu: Bağlaçları renkli kartlarla veya cümleleri birleştirerek çalış. Kendi örneklerini yazıp görselleştir.'
    },
    {
      title: 'Gerund',
    summary: `Gerund, fiilin sonuna -ing eklenerek yapılan ve isim gibi kullanılan yapıdır.\n\n**Kullanım Kuralları:**\n- Bazı fiillerden sonra fiil -ing alır: enjoy, like, love, hate, finish, avoid, suggest, recommend\n- Cümlenin başında özne olarak kullanılabilir.\n\n**Sık Yapılan Hatalar:**\n- ~~I enjoy to swim~~ (yanlış), **I enjoy swimming** (doğru)\n- ~~She suggested to go~~ (yanlış), **She suggested going** (doğru)\n\n**Örnekler:**\n1. I enjoy swimming.\n   - (Yüzmekten hoşlanırım.)\n2. Reading is fun.\n   - (Okumak eğlencelidir.)\n3. She avoids eating fast food.\n   - (O, fast food yemekten kaçınır.)\n4. Playing football is my hobby.\n   - (Futbol oynamak benim hobimdir.)`,
      example: `I enjoy swimming. (Yüzmekten hoşlanırım.)\nReading is fun. (Okumak eğlencelidir.)\nShe avoids eating fast food. (O, fast food yemekten kaçınır.)\nPlaying football is my hobby. (Futbol oynamak benim hobimdir.)`,
  tip: 'İpucu: Sevdiğin aktiviteleri -ing ile söyle. "I love dancing", "I hate waiting" gibi cümleler kur.',
    ],
    A2: [
      summary: `Bir grup içinde en üstün (en iyi, en uzun, en pahalı vb.) olanı belirtmek için kullanılır.\n\n**Kullanım Kuralları:**\n- Kısa sıfatlar: the + sıfat-est\n- Uzun sıfatlar: the most/the least + sıfat\n- Düzensizler: good → the best, bad → the worst\n\n**Sık Yapılan Hatalar:**\n- "the most fastest" (yanlış), "the fastest" (doğru)\n- "She is tallest" (yanlış), "She is the tallest" (doğru)\n\n**Örnekler:**\n1. He is the tallest in the class.\n   - (O, sınıftaki en uzun kişidir.)\n2. This is the most expensive phone.\n   - (Bu, en pahalı telefon.)\n3. She is the best student.\n   - (O, en iyi öğrenci.)\n4. Winter is the coldest season.\n   - (Kış en soğuk mevsimdir.)`,
      example: `He is the tallest in the class. (O, sınıftaki en uzun kişidir.)\nThis is the most expensive phone. (Bu, en pahalı telefon.)\nShe is the best student. (O, en iyi öğrenci.)\nWinter is the coldest season. (Kış en soğuk mevsimdir.)`,
      tip: 'İpucu: Bir grup içindeki en üstün olanı belirtirken "the" ile başla. Sınıftaki en uzun, en iyi, en hızlı kişiyi bul ve cümle kur.'
    },
    {
      title: 'Sayılabilen ve sayılamayan isimler',
      summary: `İsimler ikiye ayrılır: sayılabilen (countable) ve sayılamayan (uncountable).\n\n**Sayılabilenler:**\n- Elma, kitap, öğrenci gibi tek tek sayılabilen nesneler.\n- "a/an" veya çoğul (-s) alabilir.\n\n**Sayılamayanlar:**\n- Su, süt, para gibi miktarı ölçülen ama tek tek sayılmayanlar.\n- "a/an" veya çoğul (-s) almaz.\n\n**Sık Yapılan Hatalar:**\n- "an informations" (yanlış), "some information" (doğru)\n- "many money" (yanlış), "much money" (doğru)\n\n**Örnekler:**\n1. I have three apples.\n   - (Üç elmam var.)\n2. I need some water.\n   - (Biraz suya ihtiyacım var.)\n3. There are many students in the class.\n   - (Sınıfta çok öğrenci var.)\n4. She doesn’t eat much bread.\n   - (O, çok ekmek yemez.)`,
      example: `I have three apples. (Üç elmam var.)\nI need some water. (Biraz suya ihtiyacım var.)\nThere are many students in the class. (Sınıfta çok öğrenci var.)\nShe doesn’t eat much bread. (O, çok ekmek yemez.)`,
      tip: 'Dikkat: Sayılabilen ve sayılamayan nesneleri mutfakta veya sınıfta gerçek nesnelerle ayırt ederek çalış.'
    },
    {
      title: 'Simple past tense',
      summary: `Geçmişte olmuş ve bitmiş olayları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- Olumlu: özne + fiilin 2. hali (V2)\n- Olumsuz: did not (didn’t) + fiil (yalın)\n- Soru: Did + özne + fiil (yalın)\n\n**Düzensiz fiiller:**\n- go → went, eat → ate, see → saw\n\n**Sık Yapılan Hatalar:**\n- "I didn’t went" (yanlış), "I didn’t go" (doğru)\n- "Did you saw?" (yanlış), "Did you see?" (doğru)\n\n**Örnekler:**\n1. She visited Paris last year.\n   - (Geçen yıl Paris’i ziyaret etti.)\n2. I watched a movie yesterday.\n   - (Dün bir film izledim.)\n3. Did you call me?\n   - (Beni aradın mı?)\n4. He didn’t eat breakfast.\n   - (O, kahvaltı yapmadı.)`,
      example: `She visited Paris last year. (Geçen yıl Paris’i ziyaret etti.)\nI watched a movie yesterday. (Dün bir film izledim.)\nDid you call me? (Beni aradın mı?)\nHe didn’t eat breakfast. (O, kahvaltı yapmadı.)`,
      tip: 'İpucu: Geçmişte yaptıklarını fotoğraf albümüyle veya takvimle anlat. Düzensiz fiiller için renkli kartlar kullan.'
    },
    {
      title: 'Have got – has got',
      summary: `Bir şeye sahip olduğumuzu anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- I/You/We/They have got\n- He/She/It has got\n- Olumsuz: haven’t got / hasn’t got\n- Soru: Have/Has ... got?\n\n**Sık Yapılan Hatalar:**\n- "She have got" (yanlış), "She has got" (doğru)\n- "I hasn’t got" (yanlış), "I haven’t got" (doğru)\n\n**Örnekler:**\n1. I have got a car.\n   - (Bir arabam var.)\n2. She has got two sisters.\n   - (Onun iki kız kardeşi var.)\n3. Have you got any money?\n   - (Hiç paran var mı?)\n4. We haven’t got a dog.\n   - (Bizim köpeğimiz yok.)`,
      example: `I have got a car. (Bir arabam var.)\nShe has got two sisters. (Onun iki kız kardeşi var.)\nHave you got any money? (Hiç paran var mı?)\nWe haven’t got a dog. (Bizim köpeğimiz yok.)`,
      tip: 'Dikkat: Sahip olduğun şeyleri resimlerle göstererek cümle kur. "have got" ve "has got" farkını tabloyla çalış.'
    },
    {
      title: 'Past continuous tense',
      summary: `Geçmişte belirli bir anda devam eden olayları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- was/were + fiil-ing\n- I/He/She/It was, You/We/They were\n\n**Sık Yapılan Hatalar:**\n- "I were playing" (yanlış), "I was playing" (doğru)\n- "They was watching" (yanlış), "They were watching" (doğru)\n\n**Örnekler:**\n1. I was reading a book at 8.\n   - (Saat 8’de kitap okuyordum.)\n2. They were playing football.\n   - (Onlar futbol oynuyordu.)\n3. She was sleeping when I called.\n   - (Ben aradığımda o uyuyordu.)\n4. We were watching TV last night.\n   - (Dün gece TV izliyorduk.)`,
      example: `I was reading a book at 8. (Saat 8’de kitap okuyordum.)\nThey were playing football. (Onlar futbol oynuyordu.)\nShe was sleeping when I called. (Ben aradığımda o uyuyordu.)\nWe were watching TV last night. (Dün gece TV izliyorduk.)`,
      tip: 'İpucu: Geçmişte bir anda ne yaptığını saat resmiyle veya çizimle anlat. "was/were" farkını renkli kutularla göster.'
    },
    {
      title: 'Present perfect tense',
      summary: `Geçmişte başlayıp şu ana kadar devam eden veya etkisi süren olayları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- have/has + fiilin 3. hali (V3)\n- I/You/We/They have, He/She/It has\n\n**Sık Yapılan Hatalar:**\n- "I have went" (yanlış), "I have gone" (doğru)\n- "She have finished" (yanlış), "She has finished" (doğru)\n\n**Örnekler:**\n1. I have lived here for five years.\n   - (Beş yıldır burada yaşıyorum.)\n2. She has just finished her homework.\n   - (O, ödevini yeni bitirdi.)\n3. We have never been to Paris.\n   - (Hiç Paris’e gitmedik.)\n4. Have you seen this movie?\n   - (Bu filmi gördün mü?)`,
      example: `I have lived here for five years. (Beş yıldır burada yaşıyorum.)\nShe has just finished her homework. (O, ödevini yeni bitirdi.)\nWe have never been to Paris. (Hiç Paris’e gitmedik.)\nHave you seen this movie? (Bu filmi gördün mü?)`,
      tip: 'Dikkat: "have/has + V3" yapısını zaman çizelgesiyle çalış. Geçmişten bugüne gelen olayları anlat.'
    },
    {
      title: 'Simple future tense',
      summary: `Gelecekte olacak olayları anlatmak için "will" kullanılır.\n\n**Kullanım Kuralları:**\n- will + fiil (yalın)\n- Olumsuz: will not (won’t) + fiil\n- Soru: Will + özne + fiil\n\n**Sık Yapılan Hatalar:**\n- "I will to go" (yanlış), "I will go" (doğru)\n\n**Örnekler:**\n1. I will help you.\n   - (Sana yardım edeceğim.)\n2. They will come tomorrow.\n   - (Onlar yarın gelecek.)\n3. Will you call me?\n   - (Beni arayacak mısın?)\n4. She won’t eat meat.\n   - (O, et yemeyecek.)`,
      example: `I will help you. (Sana yardım edeceğim.)\nThey will come tomorrow. (Onlar yarın gelecek.)\nWill you call me? (Beni arayacak mısın?)\nShe won’t eat meat. (O, et yemeyecek.)`,
      tip: 'İpucu: Gelecek planlarını takvim üzerinde işaretle ve "will" ile cümle kur.'
    },
    {
      title: 'Can',
      summary: `Yetenek, izin veya olasılık belirtmek için kullanılır.\n\n**Kullanım Kuralları:**\n- can + fiil (yalın)\n- Olumsuz: cannot (can’t) + fiil\n- Soru: Can + özne + fiil\n\n**Sık Yapılan Hatalar:**\n- "He cans swim" (yanlış), "He can swim" (doğru)\n\n**Örnekler:**\n1. I can swim.\n   - (Yüzebilirim.)\n2. Can I open the window?\n   - (Pencereyi açabilir miyim?)\n3. She can’t drive.\n   - (O, araba süremez.)\n4. Can you help me?\n   - (Bana yardım edebilir misin?)`,
      example: `I can swim. (Yüzebilirim.)\nCan I open the window? (Pencereyi açabilir miyim?)\nShe can’t drive. (O, araba süremez.)\nCan you help me? (Bana yardım edebilir misin?)`,
      tip: 'Dikkat: Yeteneklerini ve izinleri resimlerle veya hareketlerle anlat. "can/can’t" farkını tabloyla göster.'
    },
    {
      title: 'Should',
      summary: `Tavsiye vermek veya bir şeyin doğru olduğunu söylemek için kullanılır.\n\n**Kullanım Kuralları:**\n- should + fiil (yalın)\n- Olumsuz: should not (shouldn’t) + fiil\n- Soru: Should + özne + fiil\n\n**Sık Yapılan Hatalar:**\n- "You should to go" (yanlış), "You should go" (doğru)\n\n**Örnekler:**\n1. You should study.\n   - (Ders çalışmalısın.)\n2. Should I call her?\n   - (Onu aramalı mıyım?)\n3. You shouldn’t eat too much sugar.\n   - (Çok fazla şeker yememelisin.)\n4. Should we leave now?\n   - (Şimdi çıkmalı mıyız?)`,
      example: `You should study. (Ders çalışmalısın.)\nShould I call her? (Onu aramalı mıyım?)\nYou shouldn’t eat too much sugar. (Çok fazla şeker yememelisin.)\nShould we leave now? (Şimdi çıkmalı mıyız?)`,
      tip: 'İpucu: Tavsiye verirken "should" kullan. Arkadaşına öneri cümleleri yazıp paylaş.'
    },
    {
      title: 'Have to',
      summary: `Bir şeyi yapmak zorunda olduğumuzu anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- have to/has to + fiil (yalın)\n- Olumsuz: don’t/doesn’t have to\n- Soru: Do/Does ... have to ...?\n\n**Sık Yapılan Hatalar:**\n- "He have to go" (yanlış), "He has to go" (doğru)\n- "I doesn’t have to" (yanlış), "I don’t have to" (doğru)\n\n**Örnekler:**\n1. I have to go now.\n   - (Şimdi gitmem gerekiyor.)\n2. Do we have to wear a uniform?\n   - (Üniforma giymek zorunda mıyız?)\n3. She has to finish her homework.\n   - (O, ödevini bitirmek zorunda.)\n4. You don’t have to come.\n   - (Gelmek zorunda değilsin.)`,
      example: `I have to go now. (Şimdi gitmem gerekiyor.)\nDo we have to wear a uniform? (Üniforma giymek zorunda mıyız?)\nShe has to finish her homework. (O, ödevini bitirmek zorunda.)\nYou don’t have to come. (Gelmek zorunda değilsin.)`,
      tip: 'Dikkat: Zorunlulukları günlük programında işaretle. "have to/has to" farkını tabloyla çalış.'
    },
    {
      title: 'Much, many, enough',
      summary: `Çokluk (miktar) ve yeterlilik anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- much: sayılamayan isimlerle (water, time, money)\n- many: sayılabilen isimlerle (books, apples, friends)\n- enough: yeterli miktar için\n\n**Sık Yapılan Hatalar:**\n- "much apples" (yanlış), "many apples" (doğru)\n- "many water" (yanlış), "much water" (doğru)\n\n**Örnekler:**\n1. I have many books.\n   - (Çok kitabım var.)\n2. There isn’t much time.\n   - (Çok zaman yok.)\n3. Is there enough food?\n   - (Yeterince yemek var mı?)\n4. She doesn’t have enough money.\n   - (Onun yeterince parası yok.)`,
      example: `I have many books. (Çok kitabım var.)\nThere isn’t much time. (Çok zaman yok.)\nIs there enough food? (Yeterince yemek var mı?)\nShe doesn’t have enough money. (Onun yeterince parası yok.)`,
      tip: 'İpucu: Miktarları gerçek nesnelerle veya çizimlerle göstererek çalış. "much/many/enough" farkını renkli kutularla anlat.'
    },
    {
      title: 'and, but, or, nor, so, for (Bağlaçlar)',
      summary: `Cümleleri veya kelimeleri birbirine bağlamak için kullanılır.\n\n**Bağlaçlar ve Anlamları:**\n- and: ve\n- but: ama, fakat\n- or: veya, ya da\n- nor: ne ... ne de\n- so: bu yüzden, böylece\n- for: çünkü\n\n**Sık Yapılan Hatalar:**\n- "I like tea but I like coffee." (doğru)\n- "I like tea and I don’t like coffee." (doğru)\n\n**Örnekler:**\n1. I like tea and coffee.\n   - (Çay ve kahveyi severim.)\n2. She is tired but happy.\n   - (O yorgun ama mutlu.)\n3. Do you want tea or coffee?\n   - (Çay mı yoksa kahve mi istersin?)\n4. He neither drinks tea nor coffee.\n   - (Ne çay ne de kahve içer.)\n5. It was raining, so I stayed home.\n   - (Yağmur yağıyordu, bu yüzden evde kaldım.)\n6. I went to bed early, for I was tired.\n   - (Erken yattım çünkü yorgundum.)`,
      example: `I like tea and coffee. (Çay ve kahveyi severim.)\nShe is tired but happy. (O yorgun ama mutlu.)\nDo you want tea or coffee? (Çay mı yoksa kahve mi istersin?)\nHe neither drinks tea nor coffee. (Ne çay ne de kahve içer.)\nIt was raining, so I stayed home. (Yağmur yağıyordu, bu yüzden evde kaldım.)\nI went to bed early, for I was tired. (Erken yattım çünkü yorgundum.)`,
      tip: 'Dikkat: Bağlaçları renkli kartlarla veya cümleleri birleştirerek çalış. Kendi örneklerini yazıp görselleştir.'
    },
    {
      title: 'Emir kipi (Imperatives)',
      summary: `Birine bir şey yapmasını veya yapmamasını söylemek için kullanılır.\n\n**Kullanım Kuralları:**\n- Olumlu: fiil yalın halde (Open the window!)\n- Olumsuz: don’t + fiil (Don’t be late!)\n- Rica: Please + fiil (Please sit down.)\n\n**Sık Yapılan Hatalar:**\n- "Don’t to go" (yanlış), "Don’t go" (doğru)\n- "Open the window please" (yanlış), "Please open the window" (doğru)\n\n**Örnekler:**\n1. Open the door!\n   - (Kapıyı aç!)\n2. Don’t run!\n   - (Koşma!)\n3. Please be quiet.\n   - (Lütfen sessiz ol.)\n4. Don’t talk!\n   - (Konuşma!)\n5. Turn off the lights!\n   - (Işıkları kapat!)`,
      example: `Open the door! (Kapıyı aç!)\nDon’t run! (Koşma!)\nPlease be quiet. (Lütfen sessiz ol.)\nDon’t talk! (Konuşma!)\nTurn off the lights! (Işıkları kapat!)`,
      tip: 'İpucu: Emir cümlelerini resimlerle veya hareketlerle anlat. "Please" ile kibarca rica etmeyi unutma.'
    }
  ],
  B1: [
    {
      title: 'Sohbet ifadeleri',
      summary: `Günlük konuşmalarda sıkça kullanılan selamlaşma, vedalaşma ve sohbet başlatma ifadeleri.\n\n**Kullanım Kuralları:**\n- Selamlaşma: Hi! / Hello! / Good morning!\n- Vedalaşma: Bye! / See you! / Take care!\n- Sohbet başlatma: How are you? / What’s up? / How’s it going?\n\n**Sık Yapılan Hatalar:**\n- ~~How are you doing? Fine, thanks.~~ (doğru)\n- ~~What’s up? Nothing much.~~ (doğru)\n\n**Örnekler:**\n1. Hi! How are you?\n   - (Merhaba! Nasılsın?)\n2. I’m fine, thanks.\n   - (İyiyim, teşekkürler.)\n3. See you later!\n   - (Görüşürüz!)\n4. What’s up?\n   - (Naber?)`,
      example: `Hi! How are you? (Merhaba! Nasılsın?)\nI’m fine, thanks. (İyiyim, teşekkürler.)\nSee you later! (Görüşürüz!)\nWhat’s up? (Naber?)`,
      tip: 'İpucu: Günlük sohbetlerde bu ifadeleri kullanarak pratik yap. Arkadaşlarınla diyaloglar oluştur.'
    },
    {
      title: 'İhtimal anlatan ifadeler',
      summary: `Bir olayın olma ihtimalini anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- may, might, could: düşük ihtimal\n- must: yüksek ihtimal\n- can’t: imkansızlık\n\n**Sık Yapılan Hatalar:**\n- ~~He may comes~~ (yanlış), **He may come** (doğru)\n- ~~She could to be at home~~ (yanlış), **She could be at home** (doğru)\n\n**Örnekler:**\n1. She may come tomorrow.\n   - (O, yarın gelebilir.)\n2. He might be busy.\n   - (O, meşgul olabilir.)\n3. It could rain today.\n   - (Bugün yağmur yağabilir.)\n4. You must be tired.\n   - (Kesin yorgunsundur.)`,
      example: `She may come tomorrow. (O, yarın gelebilir.)\nHe might be busy. (O, meşgul olabilir.)\nIt could rain today. (Bugün yağmur yağabilir.)\nYou must be tired. (Kesin yorgunsundur.)`,
      tip: 'İpucu: Olasılık anlatan kelimeleri günlük olaylarla ilişkilendirerek cümle kur.'
    ],
    A2: [
      summary: `İki veya daha fazla şeyi karşılaştırmak için kullanılır.\n\n**Kullanım Kuralları:**\n- more/less + sıfat + than\n- as ... as\n\n**Sık Yapılan Hatalar:**\n- ~~She is more tall than me~~ (yanlış), **She is taller than me** (doğru)\n- ~~He is as fast than me~~ (yanlış), **He is as fast as me** (doğru)\n\n**Örnekler:**\n1. This car is more expensive than that one.\n   - (Bu araba onunkinden daha pahalı.)\n2. She is as smart as her sister.\n   - (O, kız kardeşi kadar zeki.)\n3. My house is less big than yours.\n   - (Benim evim seninkinden daha küçük.)\n4. He is taller than me.\n   - (O benden daha uzun.)`,
      example: `This car is more expensive than that one. (Bu araba onunkinden daha pahalı.)\nShe is as smart as her sister. (O, kız kardeşi kadar zeki.)\nMy house is less big than yours. (Benim evim seninkinden daha küçük.)\nHe is taller than me. (O benden daha uzun.)`,
      tip: 'İpucu: Eşyaları veya kişileri karşılaştırırken cümleler kur. "as ... as" ve "more/less ... than" yapılarını tabloyla çalış.'
    },
    {
      title: 'Future continuous tense',
      summary: `Gelecekte belirli bir anda devam eden eylemleri anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- will be + fiil-ing\n\n**Sık Yapılan Hatalar:**\n- ~~I will be study~~ (yanlış), **I will be studying** (doğru)\n\n**Örnekler:**\n1. I will be working at 8 o’clock.\n   - (Saat 8’de çalışıyor olacağım.)\n2. She will be sleeping when you arrive.\n   - (Sen geldiğinde o uyuyor olacak.)\n3. We will be traveling next week.\n   - (Gelecek hafta seyahat ediyor olacağız.)\n4. They will be playing football tomorrow.\n   - (Yarın futbol oynuyor olacaklar.)`,
      example: `I will be working at 8 o’clock. (Saat 8’de çalışıyor olacağım.)\nShe will be sleeping when you arrive. (Sen geldiğinde o uyuyor olacak.)\nWe will be traveling next week. (Gelecek hafta seyahat ediyor olacağız.)\nThey will be playing football tomorrow. (Yarın futbol oynuyor olacaklar.)`,
      tip: 'İpucu: Gelecekteki planlarını saat ve takvimle ilişkilendirerek "will be + fiil-ing" ile cümle kur.'
    },
    {
      title: 'Past perfect tense',
      summary: `Geçmişte bir olaydan önce gerçekleşmiş başka bir olayı anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- had + fiilin 3. hali (V3)\n\n**Sık Yapılan Hatalar:**\n- ~~I had went home~~ (yanlış), **I had gone home** (doğru)\n\n**Örnekler:**\n1. I had finished my homework before dinner.\n   - (Akşam yemeğinden önce ödevimi bitirmiştim.)\n2. She had left when I arrived.\n   - (Ben vardığımda o gitmişti.)\n3. We had never seen Paris before.\n   - (Daha önce Paris’i hiç görmemiştik.)\n4. They had eaten before the party.\n   - (Partiden önce yemek yemişlerdi.)`,
      example: `I had finished my homework before dinner. (Akşam yemeğinden önce ödevimi bitirmiştim.)\nShe had left when I arrived. (Ben vardığımda o gitmişti.)\nWe had never seen Paris before. (Daha önce Paris’i hiç görmemiştik.)\nThey had eaten before the party. (Partiden önce yemek yemişlerdi.)`,
      tip: 'İpucu: Geçmişteki iki olayı zaman çizelgesiyle göstererek "had + V3" ile cümle kur.'
    },
    {
      title: 'Must',
      summary: `Zorunluluk veya kesinlik belirtmek için kullanılır.\n\n**Kullanım Kuralları:**\n- must + fiil (yalın)\n- Olumsuz: must not (mustn’t)\n\n**Sık Yapılan Hatalar:**\n- ~~You must to go~~ (yanlış), **You must go** (doğru)\n\n**Örnekler:**\n1. You must wear a mask.\n   - (Maske takmalısın.)\n2. Students must do their homework.\n   - (Öğrenciler ödevlerini yapmalı.)\n3. You mustn’t smoke here.\n   - (Burada sigara içmemelisin.)\n4. We must be quiet.\n   - (Sessiz olmalıyız.)`,
      example: `You must wear a mask. (Maske takmalısın.)\nStudents must do their homework. (Öğrenciler ödevlerini yapmalı.)\nYou mustn’t smoke here. (Burada sigara içmemelisin.)\nWe must be quiet. (Sessiz olmalıyız.)`,
      tip: 'İpucu: Zorunlulukları okulda veya evde kurallar listesiyle ilişkilendirerek cümle kur.'
    },
    {
      title: 'Used to',
      summary: `Geçmişte yapılan ama artık yapılmayan alışkanlıkları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- used to + fiil (yalın)\n\n**Sık Yapılan Hatalar:**\n- ~~I use to play football~~ (yanlış), **I used to play football** (doğru)\n\n**Örnekler:**\n1. I used to play football when I was a child.\n   - (Çocukken futbol oynardım.)\n2. She used to live in Ankara.\n   - (Eskiden Ankara’da yaşardı.)\n3. We used to go to the seaside every summer.\n   - (Her yaz deniz kenarına giderdik.)\n4. He used to eat a lot of sweets.\n   - (Eskiden çok şeker yedi.)`,
      example: `I used to play football when I was a child. (Çocukken futbol oynardım.)\nShe used to live in Ankara. (Eskiden Ankara’da yaşardı.)\nWe used to go to the seaside every summer. (Her yaz deniz kenarına giderdik.)\nHe used to eat a lot of sweets. (Eskiden çok şeker yedi.)`,
      tip: 'İpucu: Geçmiş alışkanlıklarını fotoğraflarla veya hikaye ile anlat. "used to" ile cümleler kur.'
    },
    {
      title: 'Be used to',
      summary: `Bir şeye alışkın olmayı anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- be used to + isim/fiil-ing\n\n**Sık Yapılan Hatalar:**\n- ~~I am used to eat spicy food~~ (yanlış), **I am used to eating spicy food** (doğru)\n\n**Örnekler:**\n1. I am used to waking up early.\n   - (Erken kalkmaya alışkınım.)\n2. She is used to living alone.\n   - (Yalnız yaşamaya alışkın.)\n3. We are used to cold weather.\n   - (Soğuk havaya alışığız.)\n4. He is used to driving in traffic.\n   - (Trafikte araba kullanmaya alışkın.)`,
      example: `I am used to waking up early. (Erken kalkmaya alışkınım.)\nShe is used to living alone. (Yalnız yaşamaya alışkın.)\nWe are used to cold weather. (Soğuk havaya alışığız.)\nHe is used to driving in traffic. (Trafikte araba kullanmaya alışkın.)`,
      tip: 'İpucu: Alışkanlıklarını ve alışık olduğun şeyleri "be used to" ile cümle kurarak anlat.'
    },
    {
      title: 'Get used to',
      summary: `Bir şeye alışmaya başlamak için kullanılır.\n\n**Kullanım Kuralları:**\n- get used to + isim/fiil-ing\n\n**Sık Yapılan Hatalar:**\n- ~~I get used to eat early~~ (yanlış), **I get used to eating early** (doğru)\n\n**Örnekler:**\n1. I am getting used to living in a new city.\n   - (Yeni bir şehirde yaşamaya alışıyorum.)\n2. She is getting used to her new job.\n   - (Yeni işine alışıyor.)\n3. We are getting used to online lessons.\n   - (Online derslere alışıyoruz.)\n4. He is getting used to speaking English.\n   - (İngilizce konuşmaya alışıyor.)`,
      example: `I am getting used to living in a new city. (Yeni bir şehirde yaşamaya alışıyorum.)\nShe is getting used to her new job. (Yeni işine alışıyor.)\nWe are getting used to online lessons. (Online derslere alışıyoruz.)\nHe is getting used to speaking English. (İngilizce konuşmaya alışıyor.)`,
      tip: 'İpucu: Yeni alışkanlıklarını "get used to" ile cümle kurarak anlat. Değişen hayatını örneklerle göster.'
    },
    {
      title: 'Would',
      summary: `Geçmişteki alışkanlıklar veya nazik istekler için kullanılır.\n\n**Kullanım Kuralları:**\n- would + fiil (yalın)\n\n**Sık Yapılan Hatalar:**\n- ~~I would to go~~ (yanlış), **I would go** (doğru)\n\n**Örnekler:**\n1. When I was a child, I would play outside every day.\n   - (Çocukken her gün dışarıda oynardım.)\n2. Would you like some tea?\n   - (Biraz çay ister misiniz?)\n3. He would always help his friends.\n   - (O, her zaman arkadaşlarına yardım ederdi.)\n4. We would visit our grandparents every summer.\n   - (Her yaz büyükannemizi ziyaret ederdik.)`,
      example: `When I was a child, I would play outside every day. (Çocukken her gün dışarıda oynardım.)\nWould you like some tea? (Biraz çay ister misiniz?)\nHe would always help his friends. (O, her zaman arkadaşlarına yardım ederdi.)\nWe would visit our grandparents every summer. (Her yaz büyükannemizi ziyaret ederdik.)`,
      tip: 'İpucu: Geçmiş alışkanlıklarını ve nazik istekleri "would" ile cümle kurarak anlat.'
    },
    {
      title: 'Relative clauses',
      summary: `Bir ismi veya zamiri daha fazla bilgiyle tanımlamak için kullanılır.\n\n**Kullanım Kuralları:**\n- who: insanlar için\n- which: nesneler için\n- that: hem insanlar hem nesneler için\n\n**Sık Yapılan Hatalar:**\n- ~~The man which is tall~~ (yanlış), **The man who is tall** (doğru)\n\n**Örnekler:**\n1. The man who is tall is my uncle.\n   - (Uzun olan adam benim amcam.)\n2. The book which is on the table is mine.\n   - (Masadaki kitap benim.)\n3. The girl that is singing is my sister.\n   - (Şarkı söyleyen kız benim kız kardeşim.)\n4. I know someone who can help you.\n   - (Sana yardım edebilecek birini tanıyorum.)`,
      example: `The man who is tall is my uncle. (Uzun olan adam benim amcam.)\nThe book which is on the table is mine. (Masadaki kitap benim.)\nThe girl that is singing is my sister. (Şarkı söyleyen kız benim kız kardeşim.)\nI know someone who can help you. (Sana yardım edebilecek birini tanıyorum.)`,
      tip: 'İpucu: Kişi ve nesneleri tanımlarken "who/which/that" ile cümle kur. Fotoğraflarla örnekler oluştur.'
    },
    {
      title: 'Passive voice',
      summary: `Eylemin kim tarafından yapıldığının önemli olmadığı durumlarda kullanılır.\n\n**Kullanım Kuralları:**\n- be + fiilin 3. hali (V3)\n\n**Sık Yapılan Hatalar:**\n- ~~The cake eaten~~ (yanlış), **The cake was eaten** (doğru)\n\n**Örnekler:**\n1. The cake was eaten.\n   - (Kek yendi.)\n2. The house was built in 1990.\n   - (Ev 1990’da inşa edildi.)\n3. The letter was written by Ali.\n   - (Mektup Ali tarafından yazıldı.)\n4. The window was broken.\n   - (Pencere kırıldı.)`,
      example: `The cake was eaten. (Kek yendi.)\nThe house was built in 1990. (Ev 1990’da inşa edildi.)\nThe letter was written by Ali. (Mektup Ali tarafından yazıldı.)\nThe window was broken. (Pencere kırıldı.)`,
      tip: 'İpucu: Passive voice cümlelerini olaylarla veya resimlerle anlat. "by" ile yapanı eklemeyi unutma.'
    },
    {
      title: 'Reflexive Pronouns',
      summary: `Özne ile nesnenin aynı kişi olduğunu belirtmek için kullanılır.\n\n**Kullanım Kuralları:**\n- myself, yourself, himself, herself, itself, ourselves, yourselves, themselves\n\n**Sık Yapılan Hatalar:**\n- ~~I did it by me~~ (yanlış), **I did it by myself** (doğru)\n\n**Örnekler:**\n1. I did it myself.\n   - (Bunu kendim yaptım.)\n2. She made herself a sandwich.\n   - (Kendine sandviç yaptı.)\n3. We enjoyed ourselves at the party.\n   - (Partide çok eğlendik.)\n4. The cat cleaned itself.\n   - (Kedi kendini temizledi.)`,
      example: `I did it myself. (Bunu kendim yaptım.)\nShe made herself a sandwich. (Kendine sandviç yaptı.)\nWe enjoyed ourselves at the party. (Partide çok eğlendik.)\nThe cat cleaned itself. (Kedi kendini temizledi.)`,
      tip: 'İpucu: Reflexive pronouns ile kendinle ilgili cümleler kur. Ayna karşısında örnekler söyle.'
    },
    {
      title: 'Eklenti soruları (Tag questions)',
      summary: `Cümlenin sonunda onay veya doğrulama almak için kullanılan kısa sorular.\n\n**Kullanım Kuralları:**\n- Olumlu cümlede olumsuz tag: You are happy, aren’t you?\n- Olumsuz cümlede olumlu tag: She isn’t here, is she?\n\n**Sık Yapılan Hatalar:**\n- ~~You are happy, isn’t you?~~ (yanlış), **You are happy, aren’t you?** (doğru)\n\n**Örnekler:**\n1. You are a student, aren’t you?\n   - (Sen öğrencisin, değil mi?)\n2. She isn’t here, is she?\n   - (O burada değil, değil mi?)\n3. We can go, can’t we?\n   - (Gidebiliriz, değil mi?)\n4. It’s cold today, isn’t it?\n   - (Bugün hava soğuk, değil mi?)`,
      example: `You are a student, aren’t you? (Sen öğrencisin, değil mi?)\nShe isn’t here, is she? (O burada değil, değil mi?)\nWe can go, can’t we? (Gidebiliriz, değil mi?)\nIt’s cold today, isn’t it? (Bugün hava soğuk, değil mi?)`,
      tip: 'İpucu: Tag questions ile onay almak için cümleler kur. Arkadaşlarınla diyaloglar oluştur.'
    },
    {
      title: 'Participles',
      summary: `Fiillerin -ing veya -ed takısı almış halleri. Sıfat veya zarf olarak kullanılır.\n\n**Kullanım Kuralları:**\n- Present participle: -ing (running, smiling)\n- Past participle: -ed/-en (bored, broken)\n\n**Sık Yapılan Hatalar:**\n- ~~I am boring~~ (yanlış), **I am bored** (doğru)\n- ~~The brokened window~~ (yanlış), **The broken window** (doğru)\n\n**Örnekler:**\n1. The running boy is my brother.\n   - (Koşan çocuk benim kardeşim.)\n2. I am bored.\n   - (Sıkıldım.)\n3. The broken window was fixed.\n   - (Kırık pencere tamir edildi.)\n4. She is interested in music.\n   - (O, müzikle ilgileniyor.)`,
      example: `The running boy is my brother. (Koşan çocuk benim kardeşim.)\nI am bored. (Sıkıldım.)\nThe broken window was fixed. (Kırık pencere tamir edildi.)\nShe is interested in music. (O, müzikle ilgileniyor.)`,
      tip: 'İpucu: Participles ile sıfat ve zarf cümleleri kur. Resimlerle örnekler oluştur.'
    },
    {
      title: 'Hobi ve kendine zaman ayırma',
  summary: `Örnek: I enjoy painting in my free time.\n\nHobiler ve kendine zaman ayırmak, kişisel gelişim ve mutluluk için önemlidir. İngilizcede hobilerden ve boş zaman aktivitelerinden bahsederken genellikle "like/love/enjoy" + fiil-ing yapısı kullanılır.\n\n**Kullanım Kuralları:**\n- like/love/enjoy + fiil-ing\n- Zaman ayırmak için "spend time" veya "take time for yourself" kullanılır.\n\n**Sık Yapılan Hatalar:**\n- ~~I like to swim~~ (yanlış), **I like swimming** (doğru)\n- ~~I spend time for read~~ (yanlış), **I spend time reading** (doğru)\n\n**Örnekler:**\n1. I enjoy painting in my free time.\n   - (Boş zamanımda resim yapmaktan hoşlanırım.)\n2. She spends time reading books.\n   - (O, kitap okuyarak zaman geçirir.)\n3. We love playing chess together.\n   - (Birlikte satranç oynamayı severiz.)\n4. You should take time for yourself.\n   - (Kendin için zaman ayırmalısın.)`,
      example: `I enjoy painting in my free time. (Boş zamanımda resim yapmaktan hoşlanırım.)\nShe spends time reading books. (O, kitap okuyarak zaman geçirir.)\nWe love playing chess together. (Birlikte satranç oynamayı severiz.)\nYou should take time for yourself. (Kendin için zaman ayırmalısın.)`,
      tip: 'İpucu: Hobilerini ve boş zaman aktivitelerini bir liste yapıp, her biriyle ilgili İngilizce cümleler kur.'
    },
    {
      title: 'Present perfect continuous tense',
      summary: `Geçmişte başlayıp hâlâ devam eden bir eylemi anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- have/has been + fiil-ing\n- Zaman ifadesiyle birlikte kullanılır (for, since).\n\n**Sık Yapılan Hatalar:**\n- ~~I have been study~~ (yanlış), **I have been studying** (doğru)\n- ~~She has been play~~ (yanlış), **She has been playing** (doğru)\n\n**Örnekler:**\n1. I have been learning English for two years.\n   - (İki yıldır İngilizce öğreniyorum.)\n2. She has been working since morning.\n   - (O, sabahtan beri çalışıyor.)\n3. We have been waiting for the bus.\n   - (Otobüsü bekliyoruz.)\n4. He has been playing football all day.\n   - (Bütün gün futbol oynuyor.)`,
      example: `I have been learning English for two years. (İki yıldır İngilizce öğreniyorum.)\nShe has been working since morning. (O, sabahtan beri çalışıyor.)\nWe have been waiting for the bus. (Otobüsü bekliyoruz.)\nHe has been playing football all day. (Bütün gün futbol oynuyor.)`,
      tip: 'İpucu: "have/has been + fiil-ing" yapısını zaman çizelgesiyle çalış. Kendi hayatından örnekler bul.'
    },
    {
      title: 'Must, might ve can’t ile olasılık anlatma',
      summary: `Bir olayın olasılığını, kesinliğini veya imkansızlığını anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- must: kesin olasılık (neredeyse emin)\n- might: düşük olasılık (belki)\n- can’t: imkansızlık\n\n**Sık Yapılan Hatalar:**\n- ~~He must to be tired~~ (yanlış), **He must be tired** (doğru)\n- ~~She can’t to be at home~~ (yanlış), **She can’t be at home** (doğru)\n\n**Örnekler:**\n1. He must be tired.\n   - (O kesin yorgundur.)\n2. She might come later.\n   - (O belki sonra gelir.)\n3. They can’t be at school now.\n   - (Şu anda okulda olamazlar.)\n4. You must be hungry.\n   - (Kesin açsındır.)`,
      example: `He must be tired. (O kesin yorgundur.)\nShe might come later. (O belki sonra gelir.)\nThey can’t be at school now. (Şu anda okulda olamazlar.)\nYou must be hungry. (Kesin açsındır.)`,
      tip: 'İpucu: Olasılık anlatan cümleleri resimlerle veya durumlarla eşleştirerek çalış.'
    },
  ],
  B2: [
    {
      title: 'Noun clauses',
      summary: `Örnek: I know that she is coming.\n\nBir cümlede isim (özne/nesne) gibi kullanılan yan cümlelerdir.\n\n**Kullanım Kuralları:**\n- that, what, who, whether, if ile başlar\n- Cümlede özne veya nesne olabilir\n\n**Sık Yapılan Hatalar:**\n- ~~I know she comes~~ (yanlış), **I know that she comes** (doğru)\n\n**Örnekler:**\n1. I know that she is coming.\n   - (Onun geldiğini biliyorum.)\n2. What you said is true.\n   - (Söylediğin şey doğru.)\n3. I don’t know if he will come.\n   - (Gelip gelmeyeceğini bilmiyorum.)\n4. Who wins the race is important.\n   - (Yarışı kimin kazandığı önemli.)`,
      example: `I know that she is coming. (Onun geldiğini biliyorum.)\nWhat you said is true. (Söylediğin şey doğru.)\nI don’t know if he will come. (Gelip gelmeyeceğini bilmiyorum.)\nWho wins the race is important. (Yarışı kimin kazandığı önemli.)`,
      tip: 'İpucu: Noun clause cümlelerini ana cümleyle birleştirerek kullan. "that" ile başlayan cümleler kur.'
    },
    {
      title: 'Wish clauses',
      summary: `Örnek: I wish I had more time.\n\nGerçekleşmemiş dilek ve pişmanlıkları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- wish + past simple: şimdiki durum için dilek\n- wish + past perfect: geçmiş için pişmanlık\n\n**Sık Yapılan Hatalar:**\n- ~~I wish I have money~~ (yanlış), **I wish I had money** (doğru)\n\n**Örnekler:**\n1. I wish I had more time.\n   - (Keşke daha fazla zamanım olsaydı.)\n2. I wish I could speak English.\n   - (Keşke İngilizce konuşabilseydim.)\n3. I wish I hadn’t eaten so much.\n   - (Keşke bu kadar çok yemeseydim.)\n4. She wishes she lived in Paris.\n   - (Keşke Paris’te yaşasaydı.)`,
      example: `I wish I had more time. (Keşke daha fazla zamanım olsaydı.)\nI wish I could speak English. (Keşke İngilizce konuşabilseydim.)\nI wish I hadn’t eaten so much. (Keşke bu kadar çok yemeseydim.)\nShe wishes she lived in Paris. (Keşke Paris’te yaşasaydı.)`,
      tip: 'İpucu: Hayal ve pişmanlıklarını "wish" ile cümle kurarak anlat. Dilek cümleleri yaz.'
    },
    {
      title: 'Reported speech (Indirect speech)',
      summary: `Örnek: She said that she was tired.\n\nBaşkasının söylediği bir şeyi dolaylı olarak aktarmak için kullanılır.\n\n**Kullanım Kuralları:**\n- Zaman uyumu gerekir (present → past)\n- that ile bağlanır\n\n**Sık Yapılan Hatalar:**\n- ~~She said she is tired~~ (yanlış), **She said that she was tired** (doğru)\n\n**Örnekler:**\n1. She said that she was tired.\n   - (Yorgun olduğunu söyledi.)\n2. He told me that he would come.\n   - (Bana geleceğini söyledi.)\n3. They asked if I was ready.\n   - (Hazır olup olmadığımı sordular.)\n4. I said that I didn’t know.\n   - (Bilmediğimi söyledim.)`,
      example: `She said that she was tired. (Yorgun olduğunu söyledi.)\nHe told me that he would come. (Bana geleceğini söyledi.)\nThey asked if I was ready. (Hazır olup olmadığımı sordular.)\nI said that I didn’t know. (Bilmediğimi söyledim.)`,
      tip: 'İpucu: Reported speech cümlelerini diyaloğu aktarıyormuş gibi yaz. Zaman uyumuna dikkat et.'
    },
    {
      title: 'Tense uyumları',
      summary: `Örnek: He said that he was busy.\n\nBir cümlede ana ve yan cümlenin zamanlarının uyumlu olması gerekir.\n\n**Kullanım Kuralları:**\n- Present → Past\n- Past → Past Perfect\n\n**Sık Yapılan Hatalar:**\n- ~~He said that he is busy~~ (yanlış), **He said that he was busy** (doğru)\n\n**Örnekler:**\n1. He said that he was busy.\n   - (Meşgul olduğunu söyledi.)\n2. She told me that she had finished.\n   - (Bana bitirdiğini söyledi.)\n3. I thought that you would come.\n   - (Geleceğini düşündüm.)\n4. They said that they had seen the movie.\n   - (Filmi gördüklerini söylediler.)`,
      example: `He said that he was busy. (Meşgul olduğunu söyledi.)\nShe told me that she had finished. (Bana bitirdiğini söyledi.)\nI thought that you would come. (Geleceğini düşündüm.)\nThey said that they had seen the movie. (Filmi gördüklerini söylediler.)`,
      tip: 'İpucu: Zaman uyumlarını ana ve yan cümlelerde pratik yaparak öğren. Diyaloglar oluştur.'
    },
    {
      title: 'Type 3 (Third Conditional)',
      summary: `Örnek: If I had known, I would have helped.\n\nGeçmişte gerçekleşmeyen olaylar için kullanılır.\n\n**Kullanım Kuralları:**\n- If + past perfect, would have + fiil 3. hali (V3)\n\n**Sık Yapılan Hatalar:**\n- ~~If I knew, I would have helped~~ (yanlış), **If I had known, I would have helped** (doğru)\n\n**Örnekler:**\n1. If I had known, I would have helped.\n   - (Bilseydim yardım ederdim.)\n2. If she had studied, she would have passed.\n   - (Çalışsaydı geçerdi.)\n3. If we had left earlier, we would have caught the bus.\n   - (Daha erken çıksaydık otobüsü yakalardık.)\n4. If it had rained, the flowers would have grown.\n   - (Yağmur yağsaydı çiçekler büyürdü.)`,
      example: `If I had known, I would have helped. (Bilseydim yardım ederdim.)\nIf she had studied, she would have passed. (Çalışsaydı geçerdi.)\nIf we had left earlier, we would have caught the bus. (Daha erken çıksaydık otobüsü yakalardık.)\nIf it had rained, the flowers would have grown. (Yağmur yağsaydı çiçekler büyürdü.)`,
      tip: 'İpucu: Geçmişteki olasılıkları "If" ile kur. Hayali senaryolar yaz.'
    },
    {
      title: 'Edilgen yapı (Passive voice)',
      summary: `Eylemin kim tarafından yapıldığının önemli olmadığı durumlarda kullanılır.\n\n**Kullanım Kuralları:**\n- be + fiilin 3. hali (V3)\n- Tüm zamanlarda kullanılabilir.\n\n**Sık Yapılan Hatalar:**\n- ~~The cake eaten~~ (yanlış), **The cake was eaten** (doğru)\n- ~~The window broke by Ali~~ (yanlış), **The window was broken by Ali** (doğru)\n\n**Örnekler:**\n1. The cake was eaten.\n   - (Kek yendi.)\n2. The house will be built next year.\n   - (Ev gelecek yıl inşa edilecek.)\n3. The letter has been written.\n   - (Mektup yazıldı.)\n4. The window was broken by Ali.\n   - (Pencere Ali tarafından kırıldı.)`,
      example: `The cake was eaten. (Kek yendi.)\nThe house will be built next year. (Ev gelecek yıl inşa edilecek.)\nThe letter has been written. (Mektup yazıldı.)\nThe window was broken by Ali. (Pencere Ali tarafından kırıldı.)`,
      tip: 'İpucu: Passive voice cümlelerini olaylarla veya resimlerle anlat. "by" ile yapanı eklemeyi unutma.'
    },
    {
      title: 'Future perfect tense',
      summary: `Gelecekte belirli bir zamana kadar tamamlanmış olacak eylemleri anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- will have + fiilin 3. hali (V3)\n\n**Sık Yapılan Hatalar:**\n- ~~I will have finish~~ (yanlış), **I will have finished** (doğru)\n\n**Örnekler:**\n1. I will have finished my homework by 8.\n   - (Saat 8’e kadar ödevimi bitirmiş olacağım.)\n2. She will have left when you arrive.\n   - (Sen geldiğinde o gitmiş olacak.)\n3. They will have built the bridge by next year.\n   - (Köprüyü gelecek yıla kadar inşa etmiş olacaklar.)\n4. We will have eaten dinner by then.\n   - (O zamana kadar akşam yemeğini yemiş olacağız.)`,
      example: `I will have finished my homework by 8. (Saat 8’e kadar ödevimi bitirmiş olacağım.)\nShe will have left when you arrive. (Sen geldiğinde o gitmiş olacak.)\nThey will have built the bridge by next year. (Köprüyü gelecek yıla kadar inşa etmiş olacaklar.)\nWe will have eaten dinner by then. (O zamana kadar akşam yemeğini yemiş olacağız.)`,
      tip: 'İpucu: Gelecekte tamamlanacak işleri takvimle veya zaman çizelgesiyle anlat.'
    },
    {
      title: 'Future perfect continuous tense',
      summary: `Gelecekte belirli bir ana kadar devam etmekte olan eylemleri anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- will have been + fiil-ing\n\n**Sık Yapılan Hatalar:**\n- ~~I will have been study~~ (yanlış), **I will have been studying** (doğru)\n\n**Örnekler:**\n1. By next year, I will have been working here for five years.\n   - (Gelecek yıl, burada beş yıldır çalışıyor olacağım.)\n2. She will have been living in London for a decade.\n   - (O, Londra’da on yıldır yaşıyor olacak.)\n3. They will have been waiting for an hour when the bus arrives.\n   - (Otobüs geldiğinde bir saattir bekliyor olacaklar.)\n4. We will have been studying all night.\n   - (Bütün gece ders çalışıyor olacağız.)`,
      example: `By next year, I will have been working here for five years. (Gelecek yıl, burada beş yıldır çalışıyor olacağım.)\nShe will have been living in London for a decade. (O, Londra’da on yıldır yaşıyor olacak.)\nThey will have been waiting for an hour when the bus arrives. (Otobüs geldiğinde bir saattir bekliyor olacaklar.)\nWe will have been studying all night. (Bütün gece ders çalışıyor olacağız.)`,
      tip: 'İpucu: Uzun süredir devam eden eylemleri zaman çizelgesiyle göstererek "will have been + fiil-ing" ile cümle kur.'
    },
    {
      title: 'Past perfect continuous tense',
      summary: `Geçmişte bir ana kadar devam eden eylemleri anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- had been + fiil-ing\n\n**Sık Yapılan Hatalar:**\n- ~~I had been study~~ (yanlış), **I had been studying** (doğru)\n\n**Örnekler:**\n1. I had been waiting for an hour when he arrived.\n   - (O geldiğinde bir saattir bekliyordum.)\n2. She had been living in Paris before she moved.\n   - (Taşınmadan önce Paris’te yaşıyordu.)\n3. They had been playing football before it started to rain.\n   - (Yağmur başlamadan önce futbol oynuyorlardı.)\n4. We had been studying all night.\n   - (Bütün gece ders çalışıyorduk.)`,
      example: `I had been waiting for an hour when he arrived. (O geldiğinde bir saattir bekliyordum.)\nShe had been living in Paris before she moved. (Taşınmadan önce Paris’te yaşıyordu.)\nThey had been playing football before it started to rain. (Yağmur başlamadan önce futbol oynuyorlardı.)\nWe had been studying all night. (Bütün gece ders çalışıyorduk.)`,
      tip: 'İpucu: Geçmişte uzun süren eylemleri zaman çizelgesiyle anlat. "had been + fiil-ing" ile örnekler kur.'
    },
    {
      title: 'Ettirgen çatı (Causative)',
      summary: `Bir işi başkasına yaptırdığımızı anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- have/get + nesne + fiil 3. hali (V3)\n\n**Sık Yapılan Hatalar:**\n- ~~I have my car wash~~ (yanlış), **I have my car washed** (doğru)\n- ~~She got her hair cutted~~ (yanlış), **She got her hair cut** (doğru)\n\n**Örnekler:**\n1. I had my car washed.\n   - (Arabamı yıkattım.)\n2. She got her hair cut.\n   - (Saçını kestirdi.)\n3. We will have the house painted.\n   - (Evi boyatacağız.)\n4. He had his bike repaired.\n   - (Bisikletini tamir ettirdi.)`,
      example: `I had my car washed. (Arabamı yıkattım.)\nShe got her hair cut. (Saçını kestirdi.)\nWe will have the house painted. (Evi boyatacağız.)\nHe had his bike repaired. (Bisikletini tamir ettirdi.)`,
      tip: 'İpucu: Başkasına yaptırdığın işleri resimlerle veya hikaye ile anlat. "have/get + nesne + V3" yapısını pekiştir.'
    },
  ],
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
  A2: [
      .replace(/Ç/g, 'c')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'u');

  // For now keep accordion structure but show only 1-2 dummy topics per level
  // (content will be filled later by the editor). This prevents large blocks
  // of content showing while we prepare the final material.
  const displayTopics = topicsData[selectedLevel as LevelKey].slice(0, 2);

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
                  {/* İçerikler geçici olarak kaldırıldı - sadece yapı kalsın */}
                  <Box sx={{
                    mb: 1,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(0,184,148,0.05)',
                    border: '1px dashed rgba(0,184,148,0.25)',
                    color: '#00695c',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    Bu konu içerikleri güncelleniyor. Yakında eklenecek.
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
            {displayTopics.length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Bu seviyede aradığınız konu bulunamadı.
              </Typography>
            )}
            {/* Informational note for editors */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'transparent', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Gelecekte konu başlıklarını ve içeriklerini göndereceğim, şu an sadece yapı ve iyileştirmeleri yap.</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TopicsPage;
