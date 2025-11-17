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
  // A1 topics intentionally removed per request; keep array empty to avoid broken references
];

export const topicsIndex: TopicItem[] = [
  ...a1,
  // Future: add A2/B1/B2
];

export function findTopicBySlug(slug: string): TopicItem | undefined {
  return topicsIndex.find(t => t.slug === slug);
}
