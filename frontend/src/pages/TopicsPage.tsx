import React, { useState, useEffect } from 'react';
import setMetaTags from '../utils/seo';
import { Paper, Tabs, Tab, Box, Typography, TextField, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';


type Topic = { title: string; summary: string; example: string; tip?: string };
type LevelKey = 'A1' | 'A2' | 'B1' | 'B2';
const topicsData: Partial<Record<LevelKey, Topic[]>> = {
  A1: [
    {
      title: 'Simple Present Tense',
      summary: `**Tanım:**\nSimple Present Tense (Geniş Zaman), İngilizcede en temel zamanlardan biridir. Alışkanlıklarımızı, tekrar eden işleri, genel gerçekleri ve hobilerimizi anlatmak için kullanılır.\n\n**Nerede Kullanılır?**\n- Her gün yaptığımız işler: I brush my teeth every morning. (Her sabah dişlerimi fırçalarım.)\n- Genel gerçekler: The sun rises in the east. (Güneş doğudan doğar.)\n- Hobiler ve sevdiklerimiz: We like music. (Müziği severiz.)\n- Programlar ve takvimler: The train leaves at 9. (Tren saat 9'da kalkar.)\n\n**Cümle Kuruluşu:**\n\n1. Olumlu Cümle (Positive Sentence):\n- I/You/We/They + fiil\n- He/She/It + fiil + -s\n\nÖrnekler:\n- I play tennis. (Ben tenis oynarım.)\n- She plays tennis. (O tenis oynar.)\n- They work in a bank. (Onlar bir bankada çalışır.)\n- He reads a book. (O bir kitap okur.)\n\n2. Olumsuz Cümle (Negative Sentence):\n- I/You/We/They + do not (don't) + fiil\n- He/She/It + does not (doesn't) + fiil\n\nÖrnekler:\n- I don't like coffee. (Kahve sevmem.)\n- He doesn't like coffee. (O kahve sevmez.)\n- We don't watch TV. (Biz TV izlemeyiz.)\n\n3. Soru Cümlesi (Question):\n- Do + I/you/we/they + fiil?\n- Does + he/she/it + fiil?\n\nÖrnekler:\n- Do you play football? (Futbol oynar mısın?)\n- Does she play football? (O futbol oynar mı?)\n- Do they live in Ankara? (Onlar Ankara'da mı yaşıyor?)\n\n**-s Takısı Kuralı:**\nHe/she/it özneleriyle fiile -s, -es veya -ies takısı eklenir.\n- play → plays\n- watch → watches\n- study → studies\n\n**Sık Yapılan Hatalar:**\n- He go to school. ❌ (Yanlış)\n- He goes to school. ✔️ (Doğru)\n- She don't like tea. ❌ (Yanlış)\n- She doesn't like tea. ✔️ (Doğru)\n\n**Notlar:**\n- He/she/it ile olumsuz ve soru cümlelerinde fiil yalın kalır, sadece "does/doesn't" kullanılır.\n- "I am/You are/He is" gibi "to be" fiili farklı bir konudur.\n\n**Pratik İpucu:**\nKendi günlük rutininizi İngilizce yazın. Her cümlede özneye göre fiili doğru çekimleyin. Özellikle he/she/it ile -s takısını unutmayın.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI get up at 7 o'clock. (Saat 7'de kalkarım.)\nShe goes to school by bus. (O, okula otobüsle gider.)\nWe play football on Sundays. (Biz pazar günleri futbol oynarız.)\nMy father doesn't drink coffee. (Babam kahve içmez.)\nDo you like pizza? (Pizza sever misin?)\nDoes he watch TV every night? (O, her gece TV izler mi?)\nThe sun rises in the east. (Güneş doğudan doğar.)\nMy mother cooks delicious meals. (Annem lezzetli yemekler yapar.)\nHe studies English every day. (O, her gün İngilizce çalışır.)\nThey don't have a car. (Onların arabası yok.)\n-----------------------------`,
      tip: 'İpucu: Geniş zaman, İngilizce konuşmanın temelidir. Kendi günlük programını İngilizce yaz, he/she/it ile fiile -s eklemeyi ve olumsuz/soru cümlelerinde yardımcı fiil kullanmayı unutma!'
    },
    {
      title: 'Inversion (devrik cümleler)',
      summary: `**Tanım:**\nInversion (devrik cümle), cümlede vurgu yapmak için yardımcı fiilin (do/does/did, have/has/had, will, can, vb.) öznenin önüne gelmesidir. Türkçede "asla, nadiren, ancak o zaman" gibi ifadelerle başlayan cümlelerde devrik yapı kullanılır.\n\n**Kullanım Kuralları:**\n- Olumsuz veya kısıtlayıcı anlam taşıyan kelimelerle (never, rarely, hardly, only then, not only, at no time, under no circumstances, vb.)\n- Yardımcı fiil başa gelir, ardından özne ve ana fiil gelir.\n- Soru cümlesi gibi devrik yapı oluşur, ama anlam olumsuz veya vurguludur.\n\n**Olumlu Cümle:**\n- Never have I seen such a thing. (Böyle bir şey hiç görmedim.)\n- Rarely do we go out. (Nadiren dışarı çıkarız.)\n- Only then did I understand. (Ancak o zaman anladım.)\n\n**Olumsuz Cümle:**\n- At no time did he say sorry. (Hiçbir zaman özür dilemedi.)\n- Under no circumstances should you open the door. (Hiçbir koşulda kapıyı açmamalısın.)\n\n**Soru Cümlesi:**\n- Not only did he win, but he also broke the record. (Sadece kazanmakla kalmadı, rekor da kırdı.)\n\n**Sık Yapılan Hatalar:**\n- Never I have seen such a thing ❌ (Yanlış) → Never have I seen such a thing ✔️ (Doğru)\n- Only then I understood ❌ (Yanlış) → Only then did I understand ✔️ (Doğru)\n\n**Pratik İpucu:**\n"Never, rarely, hardly, only then, not only" gibi kelimelerle cümleye başlarsan, hemen ardından yardımcı fiil getir.\nKendi hayatından örnekler yazarak pratik yap.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nNever have I seen such a thing. (Böyle bir şey hiç görmedim.)\nRarely do we go out. (Nadiren dışarı çıkarız.)\nOnly then did I understand. (Ancak o zaman anladım.)\nNot only did he win, but he also broke the record. (Sadece kazanmakla kalmadı, rekor da kırdı.)\nAt no time did he say sorry. (Hiçbir zaman özür dilemedi.)\nUnder no circumstances should you open the door. (Hiçbir koşulda kapıyı açmamalısın.)\nHardly had I arrived when it started to rain. (Daha yeni gelmiştim ki yağmur başladı.)\nSeldom does she make mistakes. (Nadiren hata yapar.)\n-----------------------------`,
      tip: 'İpucu: "Never, rarely, hardly, only then, not only" gibi kelimelerle cümleye başlarsan, hemen ardından yardımcı fiil getir. Kendi hayatından örnekler yazarak pratik yap.'
    },
    {
      title: 'Relative adverbs (where, when, why)',
      summary: `**Tanım:**\nRelative adverbs (where, when, why), iki cümleyi birleştirerek yer, zaman veya sebep hakkında bilgi verir. Türkçede "-dığı yer", "-dığı zaman", "-dığı sebep" gibi anlamlar katar.\n\n**Kullanım Kuralları:**\n- **where:** Yer bildirir. (The place where...)\n- **when:** Zaman bildirir. (The time/year/day when...)\n- **why:** Sebep bildirir. (The reason why...)\n- Relative adverb'den sonra tam cümle gelir.\n\n**Olumlu Cümle:**\n- This is the place where I was born. (Burası doğduğum yer.)\n- 2000 is the year when I started school. (2000 okula başladığım yıl.)\n- That’s the reason why I left. (İşte bu yüzden ayrıldım.)\n\n**Olumsuz Cümle:**\n- That was the day when I didn’t go to school. (Okula gitmediğim gündü.)\n- This is the reason why I can’t come. (Gelememe sebebim bu.)\n\n**Soru Cümlesi:**\n- Do you remember the time when we met? (Tanıştığımız zamanı hatırlıyor musun?)\n\n**Sık Yapılan Hatalar:**\n- This is the place I was born ❌ (Yanlış) → This is the place where I was born ✔️ (Doğru)\n- That’s the reason I left ❌ (Yanlış) → That’s the reason why I left ✔️ (Doğru)\n\n**Pratik İpucu:**\nKendi hayatından yer, zaman ve sebep içeren cümleler kur. "where, when, why" ile başlayan cümleleri yüksek sesle tekrar et.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nThis is the place where I was born. (Burası doğduğum yer.)\n2000 is the year when I started school. (2000 okula başladığım yıl.)\nThat’s the reason why I left. (İşte bu yüzden ayrıldım.)\nThat was the day when I didn’t go to school. (Okula gitmediğim gündü.)\nThis is the reason why I can’t come. (Gelememe sebebim bu.)\nDo you remember the time when we met? (Tanıştığımız zamanı hatırlıyor musun?)\nThat’s the restaurant where we had dinner. (Akşam yemeği yediğimiz restoran burası.)\n-----------------------------`,
      tip: 'İpucu: Kendi hayatından yer, zaman ve sebep içeren cümleler kur. "where, when, why" ile başlayan cümleleri yüksek sesle tekrar et.'
    },
    {
      title: 'Participle clauses',
      summary: `**Tanım:**\nParticiple clauses, iki cümleyi birleştirip kısaltmak için kullanılır. Türkçede "-ken, -ince, -diğinde, -erek, -miş olan" gibi anlamlar katar.\n\n**Kullanım Kuralları:**\n- **-ing (Present participle):** Aktif anlam verir. (Yapan kişi özneyle aynıdır.)\n- **-ed (Past participle):** Pasif anlam verir. (Yapılan iş özneye uygulanır.)\n- Cümlenin başında veya ortasında kullanılabilir.\n- Zaman uyumuna dikkat et: Participle clause’daki özne ana cümlenin öznesiyle aynı olmalı.\n\n**Olumlu Cümle:**\n- Walking down the street, I saw an old friend. (Caddede yürürken eski bir arkadaşımı gördüm.)\n- Given enough time, you can finish. (Yeterli zaman verilirse bitirebilirsin.)\n- Built in 1920, the house is very old. (1920'de inşa edilen ev çok eski.)\n\n**Olumsuz Cümle:**\n- Not knowing what to do, she asked for help. (Ne yapacağını bilmediği için yardım istedi.)\n- Not invited to the party, he stayed at home. (Partiye davet edilmediği için evde kaldı.)\n\n**Soru Cümlesi:**\n- (Participle clause ile doğrudan soru cümlesi yapılmaz, ancak ana cümle soru olabilir.)\n- Walking down the street, did you see anyone you know? (Caddede yürürken tanıdığın birini gördün mü?)\n\n**Sık Yapılan Hatalar:**\n- When I walked down the street, I saw an old friend ❌ (Uzun) → Walking down the street, I saw an old friend ✔️ (Kısa)\n- Built in 1920, it is very old ❌ (Özne belirsiz) → Built in 1920, the house is very old ✔️ (Özne net)\n\n**Pratik İpucu:**\nUzun cümleleri kısaltmak için -ing veya -ed yapısını kullan. Öznenin aynı olduğundan emin ol. Kendi hayatından örnekler yazarak pratik yap.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nWalking down the street, I saw an old friend. (Caddede yürürken eski bir arkadaşımı gördüm.)\nGiven enough time, you can finish. (Yeterli zaman verilirse bitirebilirsin.)\nBuilt in 1920, the house is very old. (1920'de inşa edilen ev çok eski.)\nNot knowing what to do, she asked for help. (Ne yapacağını bilmediği için yardım istedi.)\nNot invited to the party, he stayed at home. (Partiye davet edilmediği için evde kaldı.)\nHaving finished his homework, he went out. (Ödevini bitirince dışarı çıktı.)\n-----------------------------`,
      tip: 'İpucu: Uzun cümleleri kısaltmak için -ing veya -ed yapısını kullan. Öznenin aynı olduğundan emin ol. Kendi hayatından örnekler yazarak pratik yap.'
    },
    {
      title: 'Cleft sentences (It is/was..., What... is/was...)',
      summary: `**Tanım:**\nCleft sentences, cümlenin bir bölümünü özellikle vurgulamak için kullanılır. Türkçede "asıl ... olan", "... olan şey" gibi anlamlar katar.\n\n**Kullanım Kuralları:**\n- **It is/was + vurgulanan kısım + who/that + ...**\n  - It was John who called. (Arayan John'du.)\n- **What + özne + fiil + is/was + ...**\n  - What I need is a break. (İhtiyacım olan şey bir mola.)\n- Vurgulamak istediğin kısmı cümlenin başına getirirsin.\n\n**Olumlu Cümle:**\n- It was John who called. (Arayan John'du.)\n- What I need is a break. (İhtiyacım olan şey bir mola.)\n- It is the manager who decides. (Karar veren müdürdür.)\n\n**Olumsuz Cümle:**\n- It wasn’t me who broke the vase. (Vazoyu kıran ben değildim.)\n- What I don’t like is waiting. (Hoşlanmadığım şey beklemek.)\n\n**Soru Cümlesi:**\n- Was it you who called? (Arayan sen miydin?)\n- What do you want is a break? (İstediğin şey bir mola mı?)\n\n**Sık Yapılan Hatalar:**\n- John called me ❌ (Sade) → It was John who called me ✔️ (Vurgulu)\n- I need a break ❌ (Sade) → What I need is a break ✔️ (Vurgulu)\n\n**Pratik İpucu:**\nBir cümlede özellikle vurgulamak istediğin kişi, zaman, yer veya nesne varsa cleft sentence kullan. Kendi hayatından örneklerle pratik yap.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nIt was John who called. (Arayan John'du.)\nWhat I need is a break. (İhtiyacım olan şey bir mola.)\nIt is the manager who decides. (Karar veren müdürdür.)\nIt wasn’t me who broke the vase. (Vazoyu kıran ben değildim.)\nWhat I don’t like is waiting. (Hoşlanmadığım şey beklemek.)\nWas it you who called? (Arayan sen miydin?)\nIt was yesterday that I met her. (Onunla tanıştığım gün dündü.)\n-----------------------------`,
      tip: 'İpucu: Bir cümlede özellikle vurgulamak istediğin kişi, zaman, yer veya nesne varsa cleft sentence kullan. Kendi hayatından örneklerle pratik yap.'
    },
    {
      title: 'Ellipsis (cümle kısaltma)',
      summary: `**Tanım:**\nEllipsis, cümlede tekrar eden kelimeleri atarak cümleyi kısaltma yöntemidir. Türkçede de benzer şekilde "ve", "ama" gibi bağlaçlarla tekrar edilen kelimeler atlanır.\n\n**Kullanım Kuralları:**\n- Yardımcı fiil, ana fiil veya özne tekrar ediyorsa atlanabilir.\n- Anlam bozulmaz, cümle daha kısa ve akıcı olur.\n- Genellikle and, but, or gibi bağlaçlardan sonra kullanılır.\n\n**Olumlu Cümle:**\n- She can play the guitar and (she can) sing. (Gitar çalabilir ve şarkı söyleyebilir.)\n- I like apples and (I like) oranges. (Elma ve portakal severim.)\n\n**Olumsuz Cümle:**\n- He doesn’t eat meat but (he) eats fish. (Et yemez ama balık yer.)\n- I can’t swim, but (I can) dive. (Yüzemem ama dalabilirim.)\n\n**Soru Cümlesi:**\n- Do you want tea or (do you want) coffee? (Çay mı yoksa kahve mi istersin?)\n\n**Sık Yapılan Hatalar:**\n- She can play the guitar and she can sing ❌ (Uzun) → She can play the guitar and sing ✔️ (Kısa)\n- I like apples and I like oranges ❌ (Uzun) → I like apples and oranges ✔️ (Kısa)\n\n**Pratik İpucu:**\nCümlede tekrar eden özne, yardımcı fiil veya ana fiili atarak cümlelerini kısalt. Kendi örneklerini yazıp yüksek sesle tekrar et.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nShe can play the guitar and (she can) sing. (Gitar çalabilir ve şarkı söyleyebilir.)\nI like apples and (I like) oranges. (Elma ve portakal severim.)\nHe went to the store but (he) forgot to buy milk. (Markete gitti ama süt almayı unuttu.)\nHe doesn’t eat meat but (he) eats fish. (Et yemez ama balık yer.)\nI can’t swim, but (I can) dive. (Yüzemem ama dalabilirim.)\nDo you want tea or (do you want) coffee? (Çay mı yoksa kahve mi istersin?)\n-----------------------------`,
      tip: 'İpucu: Cümlede tekrar eden özne, yardımcı fiil veya ana fiili atarak cümlelerini kısalt. Kendi örneklerini yazıp yüksek sesle tekrar et.'
    }
  ],
  B1: [
    {
      title: 'Present Perfect Tense',
      summary: `**Tanım:**\nPresent Perfect Tense, geçmişte başlamış ve etkisi/sonucu şu an devam eden olayları anlatır. Türkçede tam karşılığı yoktur, genellikle "-di, -miş, -dım" gibi çevrilir.\n\n**Kullanım Kuralları:**\n- have/has + fiilin üçüncü hali (V3)\n- I/You/We/They → have + V3\n- He/She/It → has + V3\n- Zaman zarfları: just (az önce), already (zaten), yet (henüz), ever (hiç), never (asla/hiç), for (süredir), since (den beri)\n\n**Olumlu Cümle (Positive):**\n- I have finished my homework. (Ödevimi bitirdim.)\n- She has just arrived. (O az önce geldi.)\n- We have lived here for 5 years. (5 yıldır burada yaşıyoruz.)\n\n**Olumsuz Cümle (Negative):**\n- I haven’t seen him. (Onu görmedim.)\n- He hasn’t called yet. (O henüz aramadı.)\n- They haven’t eaten breakfast. (Onlar kahvaltı yapmadı.)\n\n**Soru Cümlesi (Question):**\n- Have you ever been to London? (Hiç Londra’ya gittin mi?)\n- Has she finished her work? (O işini bitirdi mi?)\n- Have they done their homework? (Onlar ödevlerini yaptılar mı?)\n\n**Sık Yapılan Hatalar:**\n- I have saw ❌ (Yanlış) → I have seen ✔️ (Doğru)\n- He have done ❌ (Yanlış) → He has done ✔️ (Doğru)\n- I didn’t have seen ❌ (Yanlış) → I haven’t seen ✔️ (Doğru)\n\n**Not:**\n- Present Perfect ile geçmişteki zamanı (yesterday, last year) kullanma!\n- "For" (süredir) ve "since" (den beri) ile süre belirt.\n\n**Pratik İpucu:**\nKendi hayatından yeni biten veya etkisi süren olayları "have/has + V3" ile anlat. "I have just...", "I have never..." gibi kalıpları pratik et.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI have lost my keys. (Anahtarlarımı kaybettim.)\nShe has already eaten. (O zaten yedi.)\nWe haven’t finished yet. (Henüz bitirmedik.)\nHave you ever seen snow? (Hiç kar gördün mü?)\nHe has lived here for 5 years. (5 yıldır burada yaşıyor.)\nI have just woken up. (Az önce uyandım.)\nThey have never visited Paris. (Onlar hiç Paris’i ziyaret etmedi.)\nHas he called you yet? (O seni aradı mı?)\n-----------------------------`,
      tip: 'İpucu: Present Perfect ile zaman belirtirken for (süredir) ve since (den beri) kullanılır. "I have just...", "I have never..." gibi kalıpları pratik et. Geçmişte zamanı (yesterday, last year) ile kullanma!'
    },
    {
      title: 'Zaman zarfları (Adverbs of frequency)',
      summary: `**Tanım:**\nZaman zarfları (adverbs of frequency), bir eylemin ne sıklıkta yapıldığını belirtir.\n\n**En Sık Kullanılanlar:**\n- always (her zaman)\n- usually (genellikle)\n- often (sık sık)\n- sometimes (bazen)\n- rarely (nadiren)\n- never (asla)\n\n**Kullanım Kuralları:**\n- Zaman zarfı, özne ile fiil arasına gelir: I always get up early.\n- "To be" fiili ile: Zarf, "to be"den sonra gelir: She is always happy.\n\n**Olumlu Cümle:**\n- I usually eat breakfast. (Genellikle kahvaltı yaparım.)\n- She always helps me. (O her zaman bana yardım eder.)\n\n**Olumsuz Cümle:**\n- He never eats meat. (O asla et yemez.)\n- They rarely watch TV. (Onlar nadiren TV izler.)\n\n**Soru Cümlesi:**\n- Do you often play football? (Sık sık futbol oynar mısın?)\n- Is she always happy? (O her zaman mutlu mu?)\n\n**Sık Yapılan Hatalar:**\n- I get up always early ❌ (Yanlış)\n- I always get up early ✔️ (Doğru)\n- She always is happy ❌ (Yanlış)\n- She is always happy ✔️ (Doğru)\n\n**Pratik İpucu:**\n- "Never" ile cümle zaten olumsuz olur, bir daha "not" ekleme.\n- Zaman zarflarını cümlede doğru yere koymak için örnekleri incele.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI always drink tea. (Her zaman çay içerim.)\nHe never eats meat. (O asla et yemez.)\nWe usually go to school by bus. (Genellikle okula otobüsle gideriz.)\nShe is often late. (O sık sık geç kalır.)\nThey sometimes play tennis. (Bazen tenis oynarlar.)\nYou rarely eat chocolate. (Sen nadiren çikolata yersin.)\nDo you often read books? (Sık sık kitap okur musun?)\nIs he always tired? (O her zaman yorgun mu?)\n-----------------------------`,
      tip: 'İpucu: "Never" ile cümle zaten olumsuz olur, bir daha "not" ekleme. Zaman zarflarını cümlede doğru yere koymak için örnekleri incele.'
  },
    {
      title: 'Infinitives',
      summary: `**Tanım:**\nInfinitive, "to" + fiil (yalın hali) şeklinde kullanılır ve Türkçede "-mek/-mak" anlamı verir.\n\n**Nerede Kullanılır?**\n- Bazı fiillerden sonra: want, decide, plan, hope, need, learn, promise\n- Amaç belirtirken\n\n**Kullanım Kuralları:**\n- want/decide/plan/hope/need/learn/promise + to + fiil\n\n**Olumlu Cümle (Positive):**\n- I want to learn English. (İngilizce öğrenmek istiyorum.)\n- She decided to go. (Gitmeye karar verdi.)\n\n**Olumsuz Cümle (Negative):**\n- I don’t want to eat. (Yemek istemiyorum.)\n- He doesn’t plan to travel. (O, seyahat etmeyi planlamıyor.)\n\n**Soru Cümlesi (Question):**\n- Do you want to play? (Oynamak ister misin?)\n- Does she hope to win? (O, kazanmayı umuyor mu?)\n\n**Sık Yapılan Hatalar:**\n- I want learning. ❌ (Yanlış)\n- I want to learn. ✔️ (Doğru)\n- She decided go. ❌ (Yanlış)\n- She decided to go. ✔️ (Doğru)\n\n**Not:**\n- "to" + fiil kullanılır, fiil -ing almaz.\n\n**Pratik İpucu:**\nHedeflerinizi ve yapmak istediklerinizi "to" + fiil ile İngilizce yazın.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI want to learn English. (İngilizce öğrenmek istiyorum.)\nShe decided to go. (Gitmeye karar verdi.)\nWe plan to visit London. (Londra’yı ziyaret etmeyi planlıyoruz.)\nHe promised to help me. (Bana yardım etmeye söz verdi.)\nI don’t want to eat. (Yemek istemiyorum.)\nDo you want to play? (Oynamak ister misin?)\n-----------------------------`,
      tip: 'İpucu: "to" + fiil ile gelecek planlarını, isteklerini ve amaçlarını İngilizce yaz. Her cümlede "to" kullanmayı unutma!'
    },
    {
      title: 'Yön bildiren edatlar (Prepositions of direction)',
      summary: `**Tanım:**\nBir yerin yönünü veya hareketini anlatmak için kullanılır.\n\n**Kullanım:**\n- to: -e, -a doğru (go to school)\n- from: -den, -dan (come from home)\n- into: içine (go into the room)\n- out of: dışına (get out of the car)\n- across: karşıya (walk across the street)\n- through: içinden (go through the tunnel)\n- along: boyunca (walk along the river)\n- around: etrafında (walk around the park)\n- over: üzerinden (jump over the fence)\n- under: altından (go under the bridge)\n- up: yukarı (go up the stairs)\n- down: aşağı (go down the hill)\n\n**Olumlu Cümleler:**\nGo to the park. (Parka git.)\nWalk across the street. (Caddeden karşıya yürü.)\nShe came from school. (O, okuldan geldi.)\nThe cat jumped over the wall. (Kedi duvarın üzerinden atladı.)`,
      example: `// Örnekler\n-----------------------------\nGo to the park. (Parka git.)\nWalk across the street. (Caddeden karşıya yürü.)\nShe came from school. (O, okuldan geldi.)\nThe cat jumped over the wall. (Kedi duvarın üzerinden atladı.)\n-----------------------------`,
      tip: 'İpucu: Yön bildiren edatları gerçek harita veya çizim üzerinde kullanarak pratik yap. Günlük yol tariflerini bu yapılarla anlat.'
    },
    {
      title: "Possessive 's & of",
      summary: `**Tanım:**\nBir şeyin kime veya neye ait olduğunu göstermek için kullanılır.\n\n**Kullanım Kuralları:**\n- 's: İnsanlar ve hayvanlar için kullanılır. (Ali's book = Ali'nin kitabı)\n- of: Nesneler ve uzun isim tamlamalarında kullanılır. (the color of the sky = gökyüzünün rengi)\n\n**Olumlu Cümle (Positive):**\n- This is my friend’s car. (Bu, arkadaşımın arabası.)\n- The color of the sky is blue. (Gökyüzünün rengi mavidir.)\n\n**Olumsuz Cümle (Negative):**\n- This isn’t my sister’s bag. (Bu, kız kardeşimin çantası değil.)\n- The legs of the table aren’t broken. (Masasının ayakları kırık değil.)\n\n**Soru Cümlesi (Question):**\n- Is this your brother’s phone? (Bu, senin erkek kardeşinin telefonu mu?)\n- What is the name of your school? (Okulunun adı ne?)\n\n**Sık Yapılan Hatalar:**\n- The color's sky ❌ (Yanlış)\n- The color of the sky ✔️ (Doğru)\n- The car of my friend ✔️ (Doğru ama günlük konuşmada my friend’s car daha yaygın)\n\n**Not:**\n- İnsanlar ve hayvanlar için genellikle 's, nesneler için of kullanılır.\n\n**Pratik İpucu:**\nAile fotoğrafı veya sınıf eşyaları üzerinde sahiplik cümleleri kurarak pratik yap.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nThis is my friend’s car. (Bu, arkadaşımın arabası.)\nThe color of the sky is blue. (Gökyüzünün rengi mavidir.)\nMy sister’s name is Ayşe. (Kız kardeşimin adı Ayşe.)\nThe legs of the table are broken. (Masasının ayakları kırık.)\nThis isn’t my brother’s book. (Bu, erkek kardeşimin kitabı değil.)\nIs this your teacher’s pen? (Bu, öğretmeninin kalemi mi?)\nWhat is the name of the city? (Şehrin adı ne?)\n-----------------------------`,
      tip: "İpucu: İnsanlar ve hayvanlar için 's, nesneler için of kullan. Sahiplik ilişkilerini aile fotoğrafı veya sınıf eşyaları üzerinde göstererek cümle kur."
    },
    {
      title: 'Type 0 (Zero Conditional)',
      summary: `**Tanım:**\nType 0 (Zero Conditional), genel doğruları, bilimsel gerçekleri ve her zaman doğru olan durumları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- If + present simple, present simple\n- Her iki tarafta da geniş zaman (simple present) kullanılır.\n\n**Olumlu Cümle (Positive):**\n- If you heat water, it boils. (Suyu ısıtırsan kaynar.)\n- If it rains, the grass gets wet. (Yağmur yağarsa çimenler ıslanır.)\n\n**Olumsuz Cümle (Negative):**\n- If you don’t water plants, they die. (Bitkileri sulamazsan ölürler.)\n- If it doesn’t snow, the roads stay clean. (Kar yağmazsa yollar temiz kalır.)\n\n**Soru Cümlesi (Question):**\n- What happens if you mix red and blue? (Kırmızı ve maviyi karıştırırsan ne olur?)\n- If you touch fire, do you get burned? (Ateşe dokunursan yanar mısın?)\n\n**Sık Yapılan Hatalar:**\n- If you will heat water, it boils. ❌ (Yanlış)\n- If you heat water, it boils. ✔️ (Doğru)\n\n**Not:**\n- "If" ile başlayan cümlede WILL kullanılmaz, iki tarafta da geniş zaman kullanılır.\n\n**Pratik İpucu:**\nBilimsel gerçekleri ve genel doğruları "if" ile anlat. Deney yaparak veya günlük hayattan örneklerle pratik yap.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nIf you heat water, it boils. (Suyu ısıtırsan kaynar.)\nIf you touch fire, you get burned. (Ateşe dokunursan yanarsın.)\nIf it rains, the grass gets wet. (Yağmur yağarsa çimenler ıslanır.)\nIf you mix red and blue, you get purple. (Kırmızı ve maviyi karıştırırsan mor olur.)\nIf you don’t water plants, they die. (Bitkileri sulamazsan ölürler.)\nIf you eat too much, you get fat. (Çok yersen şişmanlarsın.)\nWhat happens if you press this button? (Bu düğmeye basarsan ne olur?)\n-----------------------------`,
      tip: 'İpucu: Bilimsel gerçekleri ve genel doğruları "if" ile anlat. Deney yaparak veya günlük hayattan örneklerle pratik yap.'
    },
    {
      title: 'Comparatives',
      summary: `**Tanım:**\nComparatives (karşılaştırma yapıları), iki şeyi karşılaştırmak için kullanılır. Bir şeyin diğerinden daha fazla, daha az veya daha iyi olduğunu belirtir.\n\n**Kullanım Kuralları:**\n- Kısa sıfatlar: sıfat + -er + than (tall → taller than)\n- Uzun sıfatlar: more/less + sıfat + than (more beautiful than)\n- Düzensizler: good → better, bad → worse\n\n**Olumlu Cümle (Positive):**\n- My car is faster than yours. (Benim arabam seninkinden daha hızlı.)\n- This book is more interesting than that one. (Bu kitap onunkinden daha ilginç.)\n\n**Olumsuz Cümle (Negative):**\n- This exam isn’t easier than the last one. (Bu sınav, sonuncusundan daha kolay değil.)\n- He isn’t taller than his brother. (O, kardeşinden daha uzun değil.)\n\n**Soru Cümlesi (Question):**\n- Is your house bigger than mine? (Senin evin benimkinden daha mı büyük?)\n- Are apples cheaper than oranges? (Elmalar portakallardan daha mı ucuz?)\n\n**Sık Yapılan Hatalar:**\n- more faster ❌ (Yanlış)\n- faster ✔️ (Doğru)\n- She is more tall than me ❌ (Yanlış)\n- She is taller than me ✔️ (Doğru)\n\n**Not:**\n- "Than" kelimesiyle karşılaştırma yapılır.\n- Kısa sıfatlarda -er, uzun sıfatlarda more/less kullanılır.\n\n**Pratik İpucu:**\nEşyaları veya insanları yan yana koyup karşılaştırma cümleleri kurarak pratik yap.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nMy car is faster than yours. (Benim arabam seninkinden daha hızlı.)\nThis book is more interesting than that one. (Bu kitap onunkinden daha ilginç.)\nHe is taller than his brother. (O, kardeşinden daha uzun.)\nApples are cheaper than oranges. (Elmalar portakallardan daha ucuz.)\nThis exam isn’t easier than the last one. (Bu sınav, sonuncusundan daha kolay değil.)\nIs your house bigger than mine? (Senin evin benimkinden daha mı büyük?)\nAre apples cheaper than oranges? (Elmalar portakallardan daha mı ucuz?)\nMy bag is heavier than yours. (Benim çantam seninkinden daha ağır.)\n-----------------------------`,
      tip: 'İpucu: Karşılaştırma yaparken "than" kullanılır. Eşyaları veya insanları yan yana koyup karşılaştırma cümleleri kur.'
    },
    {
      title: 'Superlatives',
      summary: `**Tanım:**\nSuperlatives (üstünlük dereceleri), bir grup içinde en üstün, en iyi, en uzun, en pahalı vb. olanı belirtmek için kullanılır.\n\n**Kullanım Kuralları:**\n- Kısa sıfatlar: the + sıfat-est (the tallest)\n- Uzun sıfatlar: the most/the least + sıfat (the most beautiful)\n- Düzensizler: good → the best, bad → the worst\n\n**Olumlu Cümle (Positive):**\n- He is the tallest in the class. (O, sınıftaki en uzun kişidir.)\n- This is the most expensive phone. (Bu, en pahalı telefon.)\n\n**Olumsuz Cümle (Negative):**\n- She isn’t the best student. (O, en iyi öğrenci değil.)\n- Winter isn’t the warmest season. (Kış en sıcak mevsim değildir.)\n\n**Soru Cümlesi (Question):**\n- Who is the oldest in your family? (Ailende en yaşlı kim?)\n- What is the most popular sport in Turkey? (Türkiye’de en popüler spor nedir?)\n\n**Sık Yapılan Hatalar:**\n- the most fastest ❌ (Yanlış)\n- the fastest ✔️ (Doğru)\n- She is tallest ❌ (Yanlış)\n- She is the tallest ✔️ (Doğru)\n\n**Not:**\n- "The" mutlaka kullanılır.\n- Kısa sıfatlarda -est, uzun sıfatlarda most/least kullanılır.\n\n**Pratik İpucu:**\nBir grup içindeki en üstün olanı belirtirken "the" ile başla. Sınıftaki en uzun, en iyi, en hızlı kişiyi bulup cümle kurarak pratik yap.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nHe is the tallest in the class. (O, sınıftaki en uzun kişidir.)\nThis is the most expensive phone. (Bu, en pahalı telefon.)\nShe is the best student. (O, en iyi öğrenci.)\nWinter is the coldest season. (Kış en soğuk mevsimdir.)\nShe isn’t the best student. (O, en iyi öğrenci değil.)\nWho is the oldest in your family? (Ailende en yaşlı kim?)\nWhat is the most popular sport in Turkey? (Türkiye’de en popüler spor nedir?)\nThis is the least interesting book. (Bu, en az ilginç kitap.)\n-----------------------------`,
      tip: 'İpucu: Bir grup içindeki en üstün olanı belirtirken "the" ile başla. Sınıftaki en uzun, en iyi, en hızlı kişiyi bulup cümle kur.'
    },
    {
      title: 'Sayılabilen ve sayılamayan isimler',
      summary: `**Tanım:**\nİsimler ikiye ayrılır: sayılabilen (countable) ve sayılamayan (uncountable).\n\n**Sayılabilenler (Countable):**\n- Elma, kitap, öğrenci gibi tek tek sayılabilen nesneler.\n- "a/an" veya çoğul (-s) alabilir.\n\n**Sayılamayanlar (Uncountable):**\n- Su, süt, para gibi miktarı ölçülen ama tek tek sayılmayanlar.\n- "a/an" veya çoğul (-s) almaz.\n\n**Olumlu Cümle (Positive):**\n- I have three apples. (Üç elmam var.)\n- I need some water. (Biraz suya ihtiyacım var.)\n\n**Olumsuz Cümle (Negative):**\n- She doesn’t eat much bread. (O, çok ekmek yemez.)\n- There isn’t any milk in the glass. (Bardakta hiç süt yok.)\n\n**Soru Cümlesi (Question):**\n- Are there any students in the class? (Sınıfta öğrenci var mı?)\n- Is there any sugar in your tea? (Çayında şeker var mı?)\n\n**Sık Yapılan Hatalar:**\n- an informations ❌ (Yanlış)\n- some information ✔️ (Doğru)\n- many money ❌ (Yanlış)\n- much money ✔️ (Doğru)\n\n**Not:**\n- "Many" sayılabilenlerle, "much" sayılamayanlarla kullanılır.\n- "Some" olumlu, "any" olumsuz ve soru cümlelerinde sıkça kullanılır.\n\n**Pratik İpucu:**\nMutfakta veya sınıfta gerçek nesnelerle sayılabilen ve sayılamayan isimleri ayırt ederek çalış.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI have three apples. (Üç elmam var.)\nI need some water. (Biraz suya ihtiyacım var.)\nThere are many students in the class. (Sınıfta çok öğrenci var.)\nShe doesn’t eat much bread. (O, çok ekmek yemez.)\nAre there any books on the table? (Masada hiç kitap var mı?)\nIs there any milk in the glass? (Bardakta hiç süt var mı?)\nWe don’t have any information. (Hiç bilgimiz yok.)\nHow much money do you have? (Ne kadar paran var?)\n-----------------------------`,
      tip: 'İpucu: Sayılabilen ve sayılamayan nesneleri mutfakta veya sınıfta gerçek nesnelerle ayırt ederek çalış. "Many/much/some/any" farkını örneklerle pekiştir.'
    },
    {
      title: 'Simple past tense',
      summary: `**Tanım:**\nSimple past tense (geçmiş zaman), geçmişte olmuş ve bitmiş olayları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- Olumlu: özne + fiilin 2. hali (V2)\n- Olumsuz: did not (didn’t) + fiil (yalın)\n- Soru: Did + özne + fiil (yalın)\n\n**Düzensiz fiiller:**\n- go → went, eat → ate, see → saw\n\n**Olumlu Cümle (Positive):**\n- She visited Paris last year. (Geçen yıl Paris’i ziyaret etti.)\n- I watched a movie yesterday. (Dün bir film izledim.)\n\n**Olumsuz Cümle (Negative):**\n- He didn’t eat breakfast. (O, kahvaltı yapmadı.)\n- I didn’t see your message. (Mesajını görmedim.)\n\n**Soru Cümlesi (Question):**\n- Did you call me? (Beni aradın mı?)\n- Did they go to school? (Onlar okula gittiler mi?)\n\n**Sık Yapılan Hatalar:**\n- I didn’t went ❌ (Yanlış)\n- I didn’t go ✔️ (Doğru)\n- Did you saw? ❌ (Yanlış)\n- Did you see? ✔️ (Doğru)\n\n**Not:**\n- Olumsuz ve soru cümlelerinde fiil yalın halde kullanılır.\n- Düzensiz fiillerin ikinci halini ezberle.\n\n**Pratik İpucu:**\nGeçmişte yaptıklarını fotoğraf albümüyle veya takvimle anlat. Düzensiz fiiller için renkli kartlar kullanarak pratik yap.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nShe visited Paris last year. (Geçen yıl Paris’i ziyaret etti.)\nI watched a movie yesterday. (Dün bir film izledim.)\nDid you call me? (Beni aradın mı?)\nHe didn’t eat breakfast. (O, kahvaltı yapmadı.)\nI didn’t see your message. (Mesajını görmedim.)\nDid they go to school? (Onlar okula gittiler mi?)\nWe played football last weekend. (Geçen hafta sonu futbol oynadık.)\nShe didn’t like the food. (O, yemeği beğenmedi.)\n-----------------------------`,
      tip: 'İpucu: Geçmişte yaptıklarını fotoğraf albümüyle veya takvimle anlat. Düzensiz fiiller için renkli kartlar kullanarak pratik yap.'
    },
    {
      title: 'Have got – has got',
      summary: `**Tanım:**\n"Have got / has got" yapısı, bir şeye sahip olduğumuzu anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- I/You/We/They have got\n- He/She/It has got\n- Olumsuz: haven’t got / hasn’t got\n- Soru: Have/Has ... got?\n\n**Olumlu Cümle (Positive):**\n- I have got a car. (Bir arabam var.)\n- She has got two sisters. (Onun iki kız kardeşi var.)\n\n**Olumsuz Cümle (Negative):**\n- We haven’t got a dog. (Bizim köpeğimiz yok.)\n- He hasn’t got any money. (Onun hiç parası yok.)\n\n**Soru Cümlesi (Question):**\n- Have you got any money? (Hiç paran var mı?)\n- Has she got a bike? (Onun bisikleti var mı?)\n\n**Sık Yapılan Hatalar:**\n- She have got ❌ (Yanlış)\n- She has got ✔️ (Doğru)\n- I hasn’t got ❌ (Yanlış)\n- I haven’t got ✔️ (Doğru)\n\n**Not:**\n- "Have got" ve "has got" sahiplik anlatır.\n- Olumsuz ve soru cümlelerinde "got" kalır, sadece "have/has" değişir.\n\n**Pratik İpucu:**\nSahip olduğun şeyleri resimlerle göstererek cümle kur. "Have got" ve "has got" farkını tabloyla çalış.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI have got a car. (Bir arabam var.)\nShe has got two sisters. (Onun iki kız kardeşi var.)\nHave you got any money? (Hiç paran var mı?)\nWe haven’t got a dog. (Bizim köpeğimiz yok.)\nHe hasn’t got any money. (Onun hiç parası yok.)\nHas she got a bike? (Onun bisikleti var mı?)\nThey have got a big house. (Onların büyük bir evi var.)\nI haven’t got a computer. (Bir bilgisayarım yok.)\n-----------------------------`,
      tip: 'İpucu: Sahip olduğun şeyleri resimlerle göstererek cümle kur. "Have got" ve "has got" farkını tabloyla çalış.'
    },
    {
      title: 'Past continuous tense',
      summary: `**Tanım:**\nPast continuous tense (geçmişte devam eden zaman), geçmişte belirli bir anda devam eden olayları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- was/were + fiil-ing\n- I/He/She/It was, You/We/They were\n\n**Olumlu Cümle (Positive):**\n- I was reading a book at 8. (Saat 8’de kitap okuyordum.)\n- They were playing football. (Onlar futbol oynuyordu.)\n\n**Olumsuz Cümle (Negative):**\n- She wasn’t sleeping. (O, uyumuyordu.)\n- We weren’t watching TV. (Biz TV izlemiyorduk.)\n\n**Soru Cümlesi (Question):**\n- What were you doing at 9? (Saat 9’da ne yapıyordun?)\n- Was he playing computer games? (O, bilgisayar oyunu oynuyor muydu?)\n\n**Sık Yapılan Hatalar:**\n- I were playing ❌ (Yanlış)\n- I was playing ✔️ (Doğru)\n- They was watching ❌ (Yanlış)\n- They were watching ✔️ (Doğru)\n\n**Not:**\n- "Was" tekil öznelerle, "were" çoğul öznelerle kullanılır.\n\n**Pratik İpucu:**\nGeçmişte bir anda ne yaptığını saat resmiyle veya çizimle anlat. "Was/were" farkını renkli kutularla göstererek pratik yap.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI was reading a book at 8. (Saat 8’de kitap okuyordum.)\nThey were playing football. (Onlar futbol oynuyordu.)\nShe was sleeping when I called. (Ben aradığımda o uyuyordu.)\nWe were watching TV last night. (Dün gece TV izliyorduk.)\nShe wasn’t sleeping. (O, uyumuyordu.)\nWe weren’t watching TV. (Biz TV izlemiyorduk.)\nWhat were you doing at 9? (Saat 9’da ne yapıyordun?)\nWas he playing computer games? (O, bilgisayar oyunu oynuyor muydu?)\n-----------------------------`,
      tip: 'İpucu: Geçmişte bir anda ne yaptığını saat resmiyle veya çizimle anlat. "Was/were" farkını renkli kutularla göstererek pratik yap.'
    },
    {
      title: 'Present perfect tense',
      summary: `**Tanım:**\nPresent perfect tense, geçmişte başlayıp şu ana kadar devam eden veya etkisi süren olayları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- have/has + fiilin 3. hali (V3)\n- I/You/We/They have, He/She/It has\n\n**Olumlu Cümle (Positive):**\n- I have lived here for five years. (Beş yıldır burada yaşıyorum.)\n- She has just finished her homework. (O, ödevini yeni bitirdi.)\n\n**Olumsuz Cümle (Negative):**\n- We haven’t seen that movie. (O filmi görmedik.)\n- He hasn’t called me yet. (O, henüz beni aramadı.)\n\n**Soru Cümlesi (Question):**\n- Have you seen this movie? (Bu filmi gördün mü?)\n- Has she ever been to London? (O, hiç Londra’ya gitti mi?)\n\n**Sık Yapılan Hatalar:**\n- I have went ❌ (Yanlış)\n- I have gone ✔️ (Doğru)\n- She have finished ❌ (Yanlış)\n- She has finished ✔️ (Doğru)\n\n**Not:**\n- "Have/has + V3" yapısı kullanılır.\n- "Ever, never, just, already, yet" gibi kelimelerle sıkça kullanılır.\n\n**Pratik İpucu:**\nGeçmişten bugüne gelen olayları anlatırken zaman çizelgesiyle çalış. "Have/has + V3" yapısını örneklerle pekiştir.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI have lived here for five years. (Beş yıldır burada yaşıyorum.)\nShe has just finished her homework. (O, ödevini yeni bitirdi.)\nWe have never been to Paris. (Hiç Paris’e gitmedik.)\nHave you seen this movie? (Bu filmi gördün mü?)\nWe haven’t seen that movie. (O filmi görmedik.)\nHe hasn’t called me yet. (O, henüz beni aramadı.)\nHas she ever been to London? (O, hiç Londra’ya gitti mi?)\nI have already eaten breakfast. (Kahvaltı yaptım bile.)\n-----------------------------`,
      tip: 'İpucu: "have/has + V3" yapısını zaman çizelgesiyle çalış. Geçmişten bugüne gelen olayları anlatırken örneklerle pekiştir.'
    },
    {
      title: 'Simple future tense',
      summary: `**Tanım:**\nSimple future tense (gelecek zaman), gelecekte olacak olayları anlatmak için kullanılır.\n\n**Kullanım Kuralları:**\n- will + fiil (yalın)\n- Olumsuz: will not (won’t) + fiil\n- Soru: Will + özne + fiil\n\n**Olumlu Cümle (Positive):**\n- I will help you. (Sana yardım edeceğim.)\n- They will come tomorrow. (Onlar yarın gelecek.)\n\n**Olumsuz Cümle (Negative):**\n- She won’t eat meat. (O, et yemeyecek.)\n- I will not forget you. (Seni unutmayacağım.)\n\n**Soru Cümlesi (Question):**\n- Will you call me? (Beni arayacak mısın?)\n- Will it rain tomorrow? (Yarın yağmur yağacak mı?)\n\n**Sık Yapılan Hatalar:**\n- I will to go ❌ (Yanlış)\n- I will go ✔️ (Doğru)\n\n**Not:**\n- "Will" ile fiil her zaman yalın halde kullanılır.\n\n**Pratik İpucu:**\nGelecek planlarını takvim üzerinde işaretle ve "will" ile cümle kurarak pratik yap.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI will help you. (Sana yardım edeceğim.)\nThey will come tomorrow. (Onlar yarın gelecek.)\nWill you call me? (Beni arayacak mısın?)\nShe won’t eat meat. (O, et yemeyecek.)\nI will not forget you. (Seni unutmayacağım.)\nWill it rain tomorrow? (Yarın yağmur yağacak mı?)\nWe will visit our grandparents next week. (Gelecek hafta büyükannemizi ziyaret edeceğiz.)\nHe won’t play football today. (O, bugün futbol oynamayacak.)\n-----------------------------`,
      tip: 'İpucu: Gelecek planlarını takvim üzerinde işaretle ve "will" ile cümle kurarak pratik yap.'
    },
    {
      title: 'Can',
      summary: `**Tanım:**\n"Can" yardımcı fiili, yetenek, izin veya olasılık belirtmek için kullanılır.\n\n**Kullanım Kuralları:**\n- can + fiil (yalın)\n- Olumsuz: cannot (can’t) + fiil\n- Soru: Can + özne + fiil\n\n**Olumlu Cümle (Positive):**\n- I can swim. (Yüzebilirim.)\n- She can play the piano. (O, piyano çalabilir.)\n\n**Olumsuz Cümle (Negative):**\n- She can’t drive. (O, araba süremez.)\n- I cannot eat spicy food. (Acılı yemek yiyemem.)\n\n**Soru Cümlesi (Question):**\n- Can I open the window? (Pencereyi açabilir miyim?)\n- Can you help me? (Bana yardım edebilir misin?)\n\n**Sık Yapılan Hatalar:**\n- He cans swim ❌ (Yanlış)\n- He can swim ✔️ (Doğru)\n\n**Not:**\n- "Can" ile fiil her zaman yalın halde kullanılır.\n- "Can" her özneyle aynıdır, fiil değişmez.\n\n**Pratik İpucu:**\nYeteneklerini ve izinleri resimlerle veya hareketlerle anlat. "Can/can’t" farkını tabloyla göstererek pratik yap.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI can swim. (Yüzebilirim.)\nShe can play the piano. (O, piyano çalabilir.)\nShe can’t drive. (O, araba süremez.)\nI cannot eat spicy food. (Acılı yemek yiyemem.)\nCan I open the window? (Pencereyi açabilir miyim?)\nCan you help me? (Bana yardım edebilir misin?)\nCan your brother play chess? (Kardeşin satranç oynayabilir mi?)\nWe can’t come today. (Bugün gelemeyiz.)\n-----------------------------`,
      tip: 'İpucu: Yeteneklerini ve izinleri resimlerle veya hareketlerle anlat. "Can/can’t" farkını tabloyla göstererek pratik yap.'
    },
    {
      title: 'Should',
      summary: `**Tanım:**\n"Should" yardımcı fiili, tavsiye vermek veya bir şeyin doğru olduğunu söylemek için kullanılır.\n\n**Kullanım Kuralları:**\n- should + fiil (yalın)\n- Olumsuz: should not (shouldn’t) + fiil\n- Soru: Should + özne + fiil\n\n**Olumlu Cümle (Positive):**\n- You should study. (Ders çalışmalısın.)\n- People should eat healthy food. (İnsanlar sağlıklı beslenmeli.)\n\n**Olumsuz Cümle (Negative):**\n- You shouldn’t eat too much sugar. (Çok fazla şeker yememelisin.)\n- He shouldn’t go out late. (O, geç saatte dışarı çıkmamalı.)\n\n**Soru Cümlesi (Question):**\n- Should I call her? (Onu aramalı mıyım?)\n- Should we leave now? (Şimdi çıkmalı mıyız?)\n\n**Sık Yapılan Hatalar:**\n- You should to go ❌ (Yanlış)\n- You should go ✔️ (Doğru)\n\n**Not:**\n- "Should" ile fiil her zaman yalın halde kullanılır.\n\n**Pratik İpucu:**\nTavsiye verirken "should" kullan. Arkadaşına öneri cümleleri yazıp paylaşarak pratik yap.\n`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nYou should study. (Ders çalışmalısın.)\nPeople should eat healthy food. (İnsanlar sağlıklı beslenmeli.)\nYou shouldn’t eat too much sugar. (Çok fazla şeker yememelisin.)\nHe shouldn’t go out late. (O, geç saatte dışarı çıkmamalı.)\nShould I call her? (Onu aramalı mıyım?)\nShould we leave now? (Şimdi çıkmalı mıyız?)\nShould I wear a jacket? (Ceket giymeli miyim?)\nYou shouldn’t watch too much TV. (Çok fazla TV izlememelisin.)\n-----------------------------`,
      tip: 'İpucu: Tavsiye verirken "should" kullan. Arkadaşına öneri cümleleri yazıp paylaşarak pratik yap.'
    },
    {
      title: 'Type 2 (Second Conditional)',
      summary: `Gerçekleşmesi düşük veya hayali olan koşullu cümleler için kullanılır.\n\n**Kullanım Kuralları:**\n- If + past simple, would + fiil\n\n**Sık Yapılan Hatalar:**\n- ~~If I will have money, I would travel~~ (yanlış), **If I had money, I would travel** (doğru)\n\n**Örnekler:**\n1. If I had money, I would travel the world.\n   - (Param olsaydı dünyayı gezerdim.)\n2. If she were here, we would be happy.\n   - (O burada olsaydı mutlu olurduk.)\n3. If it snowed, we would make a snowman.\n   - (Kar yağsaydı kardan adam yapardık.)\n4. If I knew his number, I would call him.\n   - (Numarasını bilseydim onu arardım.)`,
      example: `If I had money, I would travel the world. (Param olsaydı dünyayı gezerdim.)\nIf she were here, we would be happy. (O burada olsaydı mutlu olurduk.)\nIf it snowed, we would make a snowman. (Kar yağsaydı kardan adam yapardık.)\nIf I knew his number, I would call him. (Numarasını bilseydim onu arardım.)`,
      tip: 'İpucu: Hayali durumları "If" ile kur. Hayalindeki şeyleri yazıp cümle oluştur.'
    },
    {
      title: 'Intensifiers (pekiştiriciler)',
      summary: `Sıfatları veya zarfları güçlendirmek için kullanılır.\n\n**Kullanım Kuralları:**\n- very, really, so, too, quite, absolutely, extremely\n\n**Sık Yapılan Hatalar:**\n- ~~I am very much happy~~ (yanlış), **I am very happy** (doğru)\n- ~~She is so much tired~~ (yanlış), **She is so tired** (doğru)\n\n**Örnekler:**\n1. The movie was really interesting.\n   - (Film gerçekten ilginçti.)\n2. I am so tired today.\n   - (Bugün çok yorgunum.)\n3. She is extremely smart.\n   - (O son derece zeki.)\n4. The exam was quite difficult.\n   - (Sınav oldukça zordu.)`,
      example: `The movie was really interesting. (Film gerçekten ilginçti.)\nI am so tired today. (Bugün çok yorgunum.)\nShe is extremely smart. (O son derece zeki.)\nThe exam was quite difficult. (Sınav oldukça zordu.)`,
      tip: 'İpucu: Pekiştirici kelimeleri cümlelerde vurgulayarak kullan. Duygularını ve durumunu anlatırken çeşitlendir.'
    },
    {
      title: 'İhtimal anlatan kelimeler',
      summary: `Bir olayın olma ihtimalini anlatan kelimeler: probably, possibly, perhaps, maybe.\n\n**Kullanım Kuralları:**\n- probably: büyük ihtimalle\n- possibly: muhtemelen\n- perhaps/maybe: belki\n\n**Sık Yapılan Hatalar:**\n- ~~He probably will comes~~ (yanlış), **He will probably come** (doğru)\n\n**Örnekler:**\n1. He will probably come.\n   - (Büyük ihtimalle gelecek.)\n2. Maybe she is at home.\n   - (Belki evdedir.)\n3. Perhaps it will rain.\n   - (Belki yağmur yağacak.)\n4. They will possibly join us.\n   - (Muhtemelen bize katılacaklar.)`,
      example: `He will probably come. (Büyük ihtimalle gelecek.)\nMaybe she is at home. (Belki evdedir.)\nPerhaps it will rain. (Belki yağmur yağacak.)\nThey will possibly join us. (Muhtemelen bize katılacaklar.)`,
      tip: 'İpucu: İhtimal anlatan kelimeleri günlük planlarında kullan. Tahmin cümleleri kur.'
    },
    {
      title: 'Kıyaslama ifadeleri',
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
      title: 'Participles (İngilizcede -ing ve -ed/-en Takılı Fiiller)',
      summary: `**Tanım:**\nParticiples, fiillerin -ing (present participle) veya -ed/-en (past participle) takısı almış halidir. İngilizcede bu yapılar, cümlede genellikle sıfat (özellik belirten) veya zarf (nasıl, ne şekilde) olarak kullanılır.\n\n**Kullanım Kuralları:**\n- Present participle: fiil + -ing (running, smiling, going)\n  - Sıfat olarak: The running water (akan su)\n  - Zarf olarak: She left smiling. (Gülümseyerek ayrıldı.)\n- Past participle: fiil + -ed/-en (bored, broken, eaten)\n  - Sıfat olarak: The broken window (kırık pencere)\n  - Perfect zamanlarda: I have eaten. (Yedim.)\n\n**Olumlu Cümle:**\n- The crying baby needs milk. (Ağlayan bebeğin süte ihtiyacı var.)\n- I am bored at home. (Evde sıkılıyorum.)\n- The stolen car was found. (Çalınan araba bulundu.)\n\n**Olumsuz Cümle:**\n- The not-working machine is useless. (Çalışmayan makine işe yaramaz.)\n- I am not interested in sports. (Sporla ilgilenmiyorum.)\n\n**Soru Cümlesi:**\n- Is the broken chair yours? (Kırık sandalye senin mi?)\n- Are you bored? (Sıkıldın mı?)\n\n**Sık Yapılan Hatalar:**\n- I am boring. ❌ (Yanlış) → I am bored. ✔️ (Doğru)\n- The brokened window ❌ (Yanlış) → The broken window ✔️ (Doğru)\n- She is interesting in music ❌ (Yanlış) → She is interested in music ✔️ (Doğru)\n\n**Not:**\n- "-ing" takısı alan fiil, genellikle aktif (yapan), "-ed/-en" takısı alan ise pasif (yapılan) anlamı verir.\n\n**Pratik İpucu:**\nGünlük hayatta gördüğün nesneleri ve insanları -ing ve -ed/-en takılı sıfatlarla tanımlamaya çalış. Örneğin: smiling girl (gülen kız), closed door (kapalı kapı).`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nThe running boy is my brother. (Koşan çocuk benim kardeşim.)\nI am bored at home. (Evde sıkılıyorum.)\nThe broken window was fixed. (Kırık pencere tamir edildi.)\nShe is interested in music. (O, müzikle ilgileniyor.)\nThe stolen car was found. (Çalınan araba bulundu.)\nThe crying baby needs milk. (Ağlayan bebeğin süte ihtiyacı var.)\nThe not-working machine is useless. (Çalışmayan makine işe yaramaz.)\nAre you bored? (Sıkıldın mı?)\nIs the broken chair yours? (Kırık sandalye senin mi?)\n-----------------------------`,
      tip: 'İpucu: Etrafındaki nesne ve insanları -ing ve -ed/-en takılı sıfatlarla tanımlayarak pratik yap. Kendi cümlelerini yaz ve yüksek sesle tekrar et.'
    },
    {
      title: 'Hobi ve Kendine Zaman Ayırma (Hobbies & Free Time)',
      summary: `**Tanım:**\nHobiler ve kendine zaman ayırmak, hem ruh sağlığı hem de İngilizce pratik için çok önemlidir. İngilizcede hobilerden ve boş zaman aktivitelerinden bahsederken genellikle "like/love/enjoy" + fiil-ing (V-ing) yapısı kullanılır. Ayrıca "spend time" (zaman harcamak) ve "take time for yourself" (kendine vakit ayırmak) gibi ifadeler de çok yaygındır.\n\n**Kullanım Kuralları:**\n- like/love/enjoy + fiil-ing: I like swimming. (Yüzmeyi severim.)\n- spend time + V-ing: I spend time reading. (Okuyarak zaman geçiririm.)\n- take time for yourself: Kendin için zaman ayır.\n\n**Olumlu Cümle:**\n- I enjoy painting in my free time. (Boş zamanımda resim yapmaktan hoşlanırım.)\n- She spends time reading books. (O, kitap okuyarak zaman geçirir.)\n- We love playing chess together. (Birlikte satranç oynamayı severiz.)\n\n**Olumsuz Cümle:**\n- I don’t like watching TV. (Televizyon izlemeyi sevmem.)\n- He doesn’t spend time outdoors. (O, dışarıda vakit geçirmez.)\n\n**Soru Cümlesi:**\n- What do you do in your free time? (Boş zamanında ne yaparsın?)\n- Do you enjoy cooking? (Yemek yapmaktan hoşlanır mısın?)\n\n**Sık Yapılan Hatalar:**\n- I like to swim ❌ (Yanlış) → I like swimming ✔️ (Doğru)\n- I spend time for read ❌ (Yanlış) → I spend time reading ✔️ (Doğru)\n\n**Not:**\n- "like/love/enjoy" fiillerinden sonra gelen fiil daima -ing takısı alır.\n\n**Pratik İpucu:**\nKendi hobilerini ve boş zaman aktivitelerini bir kağıda yaz. Her biriyle ilgili İngilizce cümleler kur ve yüksek sesle tekrar et.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI enjoy painting in my free time. (Boş zamanımda resim yapmaktan hoşlanırım.)\nShe spends time reading books. (O, kitap okuyarak zaman geçirir.)\nWe love playing chess together. (Birlikte satranç oynamayı severiz.)\nYou should take time for yourself. (Kendin için zaman ayırmalısın.)\nI don’t like watching TV. (Televizyon izlemeyi sevmem.)\nHe doesn’t spend time outdoors. (O, dışarıda vakit geçirmez.)\nWhat do you do in your free time? (Boş zamanında ne yaparsın?)\nDo you enjoy cooking? (Yemek yapmaktan hoşlanır mısın?)\n-----------------------------`,
      tip: 'İpucu: Kendi hobilerini ve boş zaman aktivitelerini bir kağıda yaz. Her biriyle ilgili İngilizce cümleler kur ve yüksek sesle tekrar et.'
    },
    {
      title: 'Present Perfect Continuous Tense (have/has been + V-ing)',
      summary: `**Tanım:**\nPresent perfect continuous tense, geçmişte başlayıp hâlâ devam eden veya yeni bitmiş olan eylemleri anlatmak için kullanılır. Türkçede "-dır/-dir" veya "-yor" ile çevrilebilir.\n\n**Kullanım Kuralları:**\n- have/has been + fiil-ing\n- Zaman ifadesiyle (for, since) sık kullanılır.\n- "I/You/We/They" ile "have been", "He/She/It" ile "has been" kullanılır.\n\n**Olumlu Cümle:**\n- I have been learning English for two years. (İki yıldır İngilizce öğreniyorum.)\n- She has been working since morning. (O, sabahtan beri çalışıyor.)\n- We have been waiting for the bus. (Otobüsü bekliyoruz.)\n\n**Olumsuz Cümle:**\n- I haven’t been sleeping well. (Son zamanlarda iyi uyuyamıyorum.)\n- He hasn’t been coming to class. (O, derse gelmiyor.)\n\n**Soru Cümlesi:**\n- How long have you been living here? (Ne zamandır burada yaşıyorsun?)\n- Has she been studying all day? (O, bütün gün ders mi çalışıyor?)\n\n**Sık Yapılan Hatalar:**\n- I have been study ❌ (Yanlış) → I have been studying ✔️ (Doğru)\n- She has been play ❌ (Yanlış) → She has been playing ✔️ (Doğru)\n\n**Not:**\n- "for" (süredir) ve "since" (den beri) ile zaman ifadesi kullanılır.\n\n**Pratik İpucu:**\nKendi hayatından örnekler bul. "I have been ...ing for/since ..." kalıbını kullanarak cümleler kur ve yüksek sesle tekrar et.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI have been learning English for two years. (İki yıldır İngilizce öğreniyorum.)\nShe has been working since morning. (O, sabahtan beri çalışıyor.)\nWe have been waiting for the bus. (Otobüsü bekliyoruz.)\nHe has been playing football all day. (Bütün gün futbol oynuyor.)\nI haven’t been sleeping well. (Son zamanlarda iyi uyuyamıyorum.)\nHe hasn’t been coming to class. (O, derse gelmiyor.)\nHow long have you been living here? (Ne zamandır burada yaşıyorsun?)\nHas she been studying all day? (O, bütün gün ders mi çalışıyor?)\n-----------------------------`,
      tip: 'İpucu: Kendi hayatından örnekler bul. "I have been ...ing for/since ..." kalıbını kullanarak cümleler kur ve yüksek sesle tekrar et.'
    },
    {
      title: 'Must, Might ve Can’t ile Olasılık Anlatma',
      summary: `**Tanım:**\nBir olayın olma ihtimalini, kesinliğini veya imkansızlığını anlatmak için "must", "might" ve "can’t" yardımcı fiilleri kullanılır.\n\n**Kullanım Kuralları:**\n- must: Kesin olasılık, neredeyse emin olduğumuz durumlar\n  - He must be tired. (Kesin yorgundur.)\n- might: Düşük olasılık, emin olmadığımız durumlar\n  - She might come later. (Belki sonra gelir.)\n- can’t: İmkansızlık, kesinlikle olamaz dediğimiz durumlar\n  - They can’t be at school now. (Şu anda okulda olamazlar.)\n- Bu yardımcı fiillerden sonra fiil daima yalın halde (to olmadan) kullanılır.\n\n**Olumlu Cümle:**\n- He must be at home. (Kesin evdedir.)\n- She might be busy. (Belki meşguldür.)\n\n**Olumsuz Cümle:**\n- He can’t be at school. (O, okulda olamaz.)\n- She can’t be serious. (O, ciddi olamaz.)\n\n**Soru Cümlesi:**\n- Can he be the teacher? (O, öğretmen olabilir mi?)\n- Might she come today? (Bugün gelebilir mi?)\n\n**Sık Yapılan Hatalar:**\n- He must to be tired ❌ (Yanlış) → He must be tired ✔️ (Doğru)\n- She can’t to be at home ❌ (Yanlış) → She can’t be at home ✔️ (Doğru)\n\n**Not:**\n- "Must" güçlü bir tahmin, "might" zayıf bir tahmin, "can’t" ise imkansızlık belirtir.\n\n**Pratik İpucu:**\nGünlük hayatta çevrendeki durumlar için tahmin cümleleri kur. Örneğin: "He must be at work now." veya "It might rain today."`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nHe must be tired. (O kesin yorgundur.)\nShe might come later. (O belki sonra gelir.)\nThey can’t be at school now. (Şu anda okulda olamazlar.)\nYou must be hungry. (Kesin açsındır.)\nHe must be at home. (Kesin evdedir.)\nShe might be busy. (Belki meşguldür.)\nHe can’t be at school. (O, okulda olamaz.)\nShe can’t be serious. (O, ciddi olamaz.)\nCan he be the teacher? (O, öğretmen olabilir mi?)\nMight she come today? (Bugün gelebilir mi?)\n-----------------------------`,
      tip: 'İpucu: Günlük hayatta çevrendeki durumlar için tahmin cümleleri kur. "He must be...", "She might...", "They can’t..." gibi kalıpları kullanarak pratik yap.'
    },
  ],
  B2: [
    {
      title: 'Noun Clauses (İsim Cümlecikleri)',
      summary: `**Tanım:**\nNoun clause, bir cümlede isim (özne veya nesne) gibi kullanılan yan cümleciktir. Yani, bir cümle başka bir cümlenin içinde özne veya nesne olarak yer alır.\n\n**Kullanım Kuralları:**\n- that, what, who, whether, if gibi kelimelerle başlar.\n- Cümlede özne veya nesne olabilir.\n- Genellikle "I know that...", "I don’t know if...", "What you said..." gibi kalıplarla kullanılır.\n\n**Olumlu Cümle:**\n- I know that she is coming. (Onun geldiğini biliyorum.)\n- What you said is true. (Söylediğin şey doğru.)\n\n**Olumsuz Cümle:**\n- I don’t know if he will come. (Gelip gelmeyeceğini bilmiyorum.)\n- I don’t remember what he said. (Ne dediğini hatırlamıyorum.)\n\n**Soru Cümlesi:**\n- Do you know who called? (Kim aradı biliyor musun?)\n- Can you tell me what happened? (Bana ne olduğunu söyleyebilir misin?)\n\n**Sık Yapılan Hatalar:**\n- I know that she coming ❌ (Yanlış) → I know that she is coming ✔️ (Doğru)\n- I don’t know if does he come ❌ (Yanlış) → I don’t know if he comes ✔️ (Doğru)\n\n**Not:**\n- Noun clause içinde cümle sırası (özne + fiil) bozulmaz, normal cümle gibi kurulur.\n\n**Pratik İpucu:**\nGünlük hayatta "I know that...", "I don’t know if...", "What you said..." gibi kalıplarla kendi cümlelerini kur ve yüksek sesle tekrar et.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI know that she is coming. (Onun geldiğini biliyorum.)\nWhat you said is true. (Söylediğin şey doğru.)\nI don’t know if he will come. (Gelip gelmeyeceğini bilmiyorum.)\nWho wins the race is important. (Yarışı kimin kazandığı önemli.)\nI don’t remember what he said. (Ne dediğini hatırlamıyorum.)\nDo you know who called? (Kim aradı biliyor musun?)\nCan you tell me what happened? (Bana ne olduğunu söyleyebilir misin?)\n-----------------------------`,
      tip: 'İpucu: "I know that...", "I don’t know if...", "What you said..." gibi kalıplarla kendi cümlelerini kur ve yüksek sesle tekrar et.'
    },
    {
      title: 'Wish Clauses (Keşke Cümleleri)',
      summary: `**Tanım:**\nWish clauses, gerçekleşmemiş dilekleri, pişmanlıkları veya hayalleri anlatmak için kullanılır. Türkçede "keşke" ile başlar.\n\n**Kullanım Kuralları:**\n- wish + past simple: Şu anki durumdan memnun olmadığımızı, keşke farklı olsaydı dediğimizde kullanılır.\n  - I wish I had more time. (Keşke daha fazla zamanım olsaydı.)\n  - She wishes she lived in Paris. (Keşke Paris’te yaşasaydı.)\n- wish + could: Bir şeyi yapabilmeyi dilemek için\n  - I wish I could speak English. (Keşke İngilizce konuşabilseydim.)\n- wish + past perfect: Geçmişte olmuş bir şey için pişmanlık\n  - I wish I hadn’t eaten so much. (Keşke bu kadar çok yemeseydim.)\n\n**Olumlu Cümle:**\n- I wish I had a car. (Keşke bir arabam olsaydı.)\n- She wishes she could travel. (Keşke seyahat edebilse.)\n\n**Olumsuz Cümle:**\n- I wish I didn’t live here. (Keşke burada yaşamasaydım.)\n- He wishes he hadn’t lost his keys. (Keşke anahtarlarını kaybetmeseydi.)\n\n**Soru Cümlesi:**\n- Do you ever wish you could fly? (Hiç uçabilmeyi diledin mi?)\n\n**Sık Yapılan Hatalar:**\n- I wish I have more time ❌ (Yanlış) → I wish I had more time ✔️ (Doğru)\n- I wish I didn’t ate so much ❌ (Yanlış) → I wish I hadn’t eaten so much ✔️ (Doğru)\n\n**Not:**\n- Wish clause’da, gerçek olmayan (hayali) durumlar için bir zaman geriye gidilir.\n\n**Pratik İpucu:**\nKendi hayatından "keşke" ile başlayan dilek ve pişmanlık cümleleri yaz. Yüksek sesle tekrar et ve farklı zamanlarda kullanmayı dene.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nI wish I had more time. (Keşke daha fazla zamanım olsaydı.)\nI wish I could speak English. (Keşke İngilizce konuşabilseydim.)\nI wish I hadn’t eaten so much. (Keşke bu kadar çok yemeseydim.)\nShe wishes she lived in Paris. (Keşke Paris’te yaşasaydı.)\nI wish I had a car. (Keşke bir arabam olsaydı.)\nShe wishes she could travel. (Keşke seyahat edebilse.)\nI wish I didn’t live here. (Keşke burada yaşamasaydım.)\nHe wishes he hadn’t lost his keys. (Keşke anahtarlarını kaybetmeseydi.)\nDo you ever wish you could fly? (Hiç uçabilmeyi diledin mi?)\n-----------------------------`,
      tip: 'İpucu: Kendi hayatından "keşke" ile başlayan dilek ve pişmanlık cümleleri yaz. Yüksek sesle tekrar et ve farklı zamanlarda kullanmayı dene.'
    },
    {
      title: 'Reported Speech (Dolaylı Anlatım)',
      summary: `**Tanım:**\nReported speech, başkasının söylediği bir şeyi dolaylı olarak aktarmak için kullanılır. Türkçede "dedi ki..." veya "söylediğini..." gibi çevrilir.\n\n**Kullanım Kuralları:**\n- Zaman uyumu gerekir: present → past, will → would, can → could, vb.\n- that ile bağlanır (She said that...).\n- Soru cümlelerinde if/whether veya soru kelimesi (what, where, why...) kullanılır.\n\n**Olumlu Cümle:**\n- She said that she was tired. (Yorgun olduğunu söyledi.)\n- He told me that he would come. (Bana geleceğini söyledi.)\n\n**Olumsuz Cümle:**\n- I said that I didn’t know. (Bilmediğimi söyledim.)\n- She said that she couldn’t come. (Gelemediğini söyledi.)\n\n**Soru Cümlesi:**\n- They asked if I was ready. (Hazır olup olmadığımı sordular.)\n- He asked where I lived. (Nerede yaşadığımı sordu.)\n\n**Sık Yapılan Hatalar:**\n- She said she is tired ❌ (Yanlış) → She said (that) she was tired ✔️ (Doğru)\n- He told me he will come ❌ (Yanlış) → He told me he would come ✔️ (Doğru)\n\n**Not:**\n- Zaman uyumuna dikkat! Present → past, will → would, can → could, vb.\n\n**Pratik İpucu:**\nDuyduğun veya okuduğun cümleleri reported speech ile tekrar et. "He said (that)...", "She told me (that)..." gibi kalıpları kullanarak pratik yap.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nShe said that she was tired. (Yorgun olduğunu söyledi.)\nHe told me that he would come. (Bana geleceğini söyledi.)\nThey asked if I was ready. (Hazır olup olmadığımı sordular.)\nI said that I didn’t know. (Bilmediğimi söyledim.)\nShe said that she couldn’t come. (Gelemediğini söyledi.)\nHe asked where I lived. (Nerede yaşadığımı sordu.)\n-----------------------------`,
      tip: 'İpucu: Duyduğun veya okuduğun cümleleri reported speech ile tekrar et. "He said (that)...", "She told me (that)..." gibi kalıpları kullanarak pratik yap.'
    },
    {
      title: 'Tense Uyumları (Zaman Uyumları)',
      summary: `**Tanım:**\nTense uyumu, bir cümlede ana cümle ve yan cümlenin zamanlarının birbiriyle uyumlu olması gerektiğini anlatır. Özellikle reported speech (dolaylı anlatım) ve karmaşık cümlelerde çok önemlidir.\n\n**Kullanım Kuralları:**\n- Eğer ana cümlede geçmiş zaman varsa, yan cümlede de genellikle bir zaman geriye gidilir.\n  - Present → Past\n  - Past → Past Perfect\n  - Will → Would\n- Zaman uyumu, "He said that...", "She told me that..." gibi cümlelerde sıkça görülür.\n\n**Olumlu Cümle:**\n- He said that he was busy. (Meşgul olduğunu söyledi.)\n- She told me that she had finished. (Bana bitirdiğini söyledi.)\n\n**Olumsuz Cümle:**\n- I thought that you wouldn’t come. (Gelmeyeceğini düşündüm.)\n- They said that they hadn’t seen the movie. (Filmi görmediklerini söylediler.)\n\n**Soru Cümlesi:**\n- Did you say that you would help? (Yardım edeceğini mi söyledin?)\n- I asked if she had finished. (Bitirip bitirmediğini sordum.)\n\n**Sık Yapılan Hatalar:**\n- He said that he is busy ❌ (Yanlış) → He said that he was busy ✔️ (Doğru)\n- She told me that she finishes ❌ (Yanlış) → She told me that she had finished ✔️ (Doğru)\n\n**Not:**\n- Zaman uyumu, İngilizcede anlam karışıklığını önler.\n\n**Pratik İpucu:**\nDiyaloglarda ve hikaye yazarken ana ve yan cümlelerin zamanlarını kontrol et. "He said that...", "I thought that..." gibi kalıplarla pratik yap.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nHe said that he was busy. (Meşgul olduğunu söyledi.)\nShe told me that she had finished. (Bana bitirdiğini söyledi.)\nI thought that you would come. (Geleceğini düşündüm.)\nThey said that they had seen the movie. (Filmi gördüklerini söylediler.)\nI thought that you wouldn’t come. (Gelmeyeceğini düşündüm.)\nThey said that they hadn’t seen the movie. (Filmi görmediklerini söylediler.)\nDid you say that you would help? (Yardım edeceğini mi söyledin?)\nI asked if she had finished. (Bitirip bitirmediğini sordum.)\n-----------------------------`,
      tip: 'İpucu: Diyaloglarda ve hikaye yazarken ana ve yan cümlelerin zamanlarını kontrol et. "He said that...", "I thought that..." gibi kalıplarla pratik yap.'
    },
    {
      title: 'Type 3 (Third Conditional)',
      summary: `**Tanım:**\nType 3 (Third Conditional), geçmişte gerçekleşmemiş olaylar ve bunların olası sonuçları için kullanılır. Türkçede "Eğer ... olsaydı, ... olurdu" şeklinde çevrilir.\n\n**Kullanım Kuralları:**\n- If + past perfect (had + V3), would have + fiil 3. hali (V3)\n- Geçmişte olmayan bir durumu ve sonucunu anlatır.\n\n**Olumlu Cümle:**\n- If I had known, I would have helped. (Bilseydim yardım ederdim.)\n- If she had studied, she would have passed. (Çalışsaydı geçerdi.)\n\n**Olumsuz Cümle:**\n- If we hadn’t missed the bus, we would have arrived on time. (Otobüsü kaçırmasaydık zamanında varırdık.)\n- If it hadn’t rained, we would have gone out. (Yağmur yağmasaydı dışarı çıkardık.)\n\n**Soru Cümlesi:**\n- What would you have done if you had won? (Kazansaydın ne yapardın?)\n- Would you have helped if I had asked? (Sorsaydım yardım eder miydin?)\n\n**Sık Yapılan Hatalar:**\n- If I knew, I would have helped ❌ (Yanlış) → If I had known, I would have helped ✔️ (Doğru)\n- If she would have studied, she would have passed ❌ (Yanlış) → If she had studied, she would have passed ✔️ (Doğru)\n\n**Not:**\n- "If"ten sonra asla "would" gelmez.\n\n**Pratik İpucu:**\nGeçmişte yaşadığın olaylar için "If I had ..." ile başlayan hayali cümleler kur. Farklı senaryolar yazıp yüksek sesle tekrar et.`,
      example: `// Detaylı ve Çevirili Örnekler\n-----------------------------\nIf I had known, I would have helped. (Bilseydim yardım ederdim.)\nIf she had studied, she would have passed. (Çalışsaydı geçerdi.)\nIf we had left earlier, we would have caught the bus. (Daha erken çıksaydık otobüsü yakalardık.)\nIf it had rained, the flowers would have grown. (Yağmur yağsaydı çiçekler büyürdü.)\nIf we hadn’t missed the bus, we would have arrived on time. (Otobüsü kaçırmasaydık zamanında varırdık.)\nIf it hadn’t rained, we would have gone out. (Yağmur yağmasaydı dışarı çıkardık.)\nWhat would you have done if you had won? (Kazansaydın ne yapardın?)\nWould you have helped if I had asked? (Sorsaydım yardım eder miydin?)\n-----------------------------`,
      tip: 'İpucu: Geçmişte yaşadığın olaylar için "If I had ..." ile başlayan hayali cümleler kur. Farklı senaryolar yazıp yüksek sesle tekrar et.'
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

  const filteredTopics = (topicsData[selectedLevel as LevelKey] ?? []).filter(
    (topic: Topic) =>
      normalizeTR(topic.title).includes(normalizeTR(search)) ||
      normalizeTR(topic.summary).includes(normalizeTR(search))
  );

  return (
    <Box sx={{ minHeight: '100vh', background: '#b2dfdb', px: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0, pb: { xs: 12, md: 16 }, overflowX: 'hidden' }}>
      <Paper elevation={6} sx={frostedPaper}>
        <Box sx={{ background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', p: { xs: 3, md: 4 }, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)', zIndex: 0 } }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" fontWeight={700} mb={2} sx={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', fontSize: 'clamp(1.3rem, 2vw, 2rem)' }}>Konular</Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)' }}>A1–B2 seviyelerinde özet ve örneklerle İngilizce konuları</Typography>
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
            {filteredTopics.map((topic: Topic, idx: number) => (
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
                  {/* Açıklama paragrafı */}
                  <Box sx={{ mb: 2, fontSize: { xs: 14, md: 15 }, color: '#19376D', lineHeight: 1.7 }}>
                    {topic.summary.split(/\n\n|\n/).map((p, i) => (
                      <Box key={i} component="p" sx={{ mb: 1.2 }}>
                        {p}
                      </Box>
                    ))}
                  </Box>
                  {/* Örnekler kutusu */}
                  {topic.example && (
                    <Box
                      sx={{
                        background: '#f1f8e9',
                        borderLeft: '5px solid #00b894',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        p: 2,
                        mb: 2,
                        fontFamily: 'monospace',
                        fontSize: { xs: 14, md: 15 },
                        color: '#00695c',
                        whiteSpace: 'pre-line',
                        borderRadius: 2,
                      }}
                    >
                    {topic.example}
                  </Box>
                )}
                {/* İpucu kutusu */}
                {topic.tip && (
                  <Box
                    sx={{
                      background: '#e3f2fd',
                      borderLeft: '5px solid #00b894',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                      p: 2,
                      mb: 1,
                      fontFamily: 'monospace',
                      fontSize: { xs: 14, md: 15 },
                      color: '#1565c0',
                      whiteSpace: 'pre-line',
                      borderRadius: 2,
                    }}
                  >
                    {topic.tip}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default TopicsPage;

