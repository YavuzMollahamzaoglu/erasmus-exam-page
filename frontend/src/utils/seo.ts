// Lightweight SEO helper — updates document title and key meta/OG tags without external deps
export function setMetaTags(opts: { title?: string; description?: string; keywords?: string; ogImage?: string; canonical?: string }) {
  // Title
  if (opts.title) document.title = opts.title;

  function upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
    const sel = attrName === 'name' ? `meta[name="${attrValue}"]` : `meta[property="${attrValue}"]`;
    let el = document.head.querySelector(sel) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      if (attrName === 'name') el.setAttribute('name', attrValue);
      else el.setAttribute('property', attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content || '');
  }

  // Basic tags
  if (opts.description) upsertMeta('name', 'description', opts.description);
  if (opts.keywords) upsertMeta('name', 'keywords', opts.keywords);

  // Open Graph
  if (opts.title) upsertMeta('property', 'og:title', opts.title);
  if (opts.description) upsertMeta('property', 'og:description', opts.description);

  // Normalize og image to absolute URL if it starts with '/'
  if (opts.ogImage) {
    const og = opts.ogImage.startsWith('/') ? `${window.location.origin}${opts.ogImage}` : opts.ogImage;
    upsertMeta('property', 'og:image', og);
    // also set twitter:image
    upsertMeta('name', 'twitter:image', og);
  }

  // Canonical: prefer explicit value, but if omitted use current origin+pathname
  let canonicalUrl: string;
  if (opts.canonical) {
    canonicalUrl = opts.canonical.startsWith('/') ? `${window.location.origin}${opts.canonical}` : opts.canonical;
  } else {
    canonicalUrl = `${window.location.origin}${window.location.pathname}`;
  }

  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', canonicalUrl);
}

export default setMetaTags;
