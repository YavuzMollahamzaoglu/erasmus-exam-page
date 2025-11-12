// Central topics index for SEO-friendly topic detail pages
// Keep content concise; full rich content remains on TopicsPage.

export type TopicItem = {
  level: 'A1' | 'A2' | 'B1' | 'B2';
  slug: string;
  title: string;
  excerpt: string;
  content: string; // plain HTML string for now
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const a1: TopicItem[] = [
  {
    level: 'A1',
    slug: 'to-be-fiili-am-is-are',
    title: '"To Be" Fiili (am, is, are)',
    excerpt: 'To be fiili; kimlik, özellik ve konum bildirmek için kullanılan temel fiildir. Am/is/are formlarını ve kısa halleri öğrenin.',
    content: `
      <h2>"To Be" Fiiline Giriş</h2>
      <p>To be fiili Türkçedeki <em>-dır/-dir</em> eklerine denktir. Durum, kimlik ve konum ifade eder.</p>
      <h3>Temel Eşleşmeler</h3>
      <ul>
        <li>I <strong>am</strong></li>
        <li>You/We/They <strong>are</strong></li>
        <li>He/She/It <strong>is</strong></li>
      </ul>
      <h3>Örnekler</h3>
      <ul>
        <li>I am a student.</li>
        <li>She is happy.</li>
        <li>They are at home.</li>
      </ul>
    `,
  },
  {
    level: 'A1',
    slug: 'this-that-these-those',
    title: 'This/That/These/Those (İşaret Zamirleri)',
    excerpt: 'Yakın/uzak ve tekil/çoğul ifadeleri için this/that/these/those kullanımı.',
    content: `
      <p><strong>This</strong> (bu), <strong>that</strong> (şu), <strong>these</strong> (bunlar), <strong>those</strong> (şunlar).</p>
      <ul>
        <li>This is my bag. / These are my books.</li>
        <li>That is your car. / Those are your keys.</li>
      </ul>
    `,
  },
  {
    level: 'A1',
    slug: 'simple-present-giris',
    title: 'Geniş Zaman (Simple Present) — Giriş',
    excerpt: 'Alışkanlıklar, genel doğrular ve rutinler için simple present. He/She/It ile -s takısı.',
    content: `
      <p>Genel durum ve rutinleri anlatır. <em>He/She/It</em> ile fiile <strong>-s</strong> gelir: he works.</p>
      <ul>
        <li>I wake up at 7.</li>
        <li>She <strong>works</strong> in a bank.</li>
      </ul>
    `,
  }
];

export const topicsIndex: TopicItem[] = [
  ...a1,
  // Future: add A2/B1/B2
];

export function findTopicBySlug(slug: string): TopicItem | undefined {
  return topicsIndex.find(t => t.slug === slug);
}
