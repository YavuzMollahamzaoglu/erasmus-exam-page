export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

/**
 * Append UTM parameters to a given absolute or relative URL.
 * If url is relative, it will be resolved against current origin at runtime.
 */
export function withUtm(url: string, utm: UtmParams): string {
  try {
    const base = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    const u = new URL(base);
    if (utm.source) u.searchParams.set('utm_source', utm.source);
    if (utm.medium) u.searchParams.set('utm_medium', utm.medium);
    if (utm.campaign) u.searchParams.set('utm_campaign', utm.campaign);
    if (utm.content) u.searchParams.set('utm_content', utm.content);
    if (utm.term) u.searchParams.set('utm_term', utm.term);
    return u.toString();
  } catch {
    return url;
  }
}

export default withUtm;
