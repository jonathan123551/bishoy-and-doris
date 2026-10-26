/**
 * Application Variant Resolver
 * ============================
 * Supports two public variants of the wedding invitation:
 * - 'party':  Full master version (Ceremony + Reception + all sections)
 * - 'church': Church-only version (Ceremony + Date + Photos + Invitation, Reception omitted)
 *
 * Detection order:
 * 1. window.__APP_VARIANT__ (set by dedicated HTML entry files)
 * 2. URL search query: ?variant=church or ?v=church
 * 3. URL pathname: /church or /bishoy-doris-church
 * 4. Hostname subdomain: bishoy-doris-church.bishoy-and-doris.pages.dev
 * 5. Environment variable: VITE_APP_VARIANT
 * Default: 'party'
 */

export function getAppVariant() {
  if (typeof window !== 'undefined') {
    if (window.__APP_VARIANT__ === 'church') return 'church';
    if (window.__APP_VARIANT__ === 'party') return 'party';

    try {
      const search = new URLSearchParams(window.location.search);
      const q = search.get('variant') || search.get('v');
      if (q === 'church') return 'church';
      if (q === 'party') return 'party';

      const path = window.location.pathname.toLowerCase();
      if (path.includes('church')) return 'church';
      if (path.includes('party')) return 'party';

      const host = window.location.hostname.toLowerCase();
      if (host.includes('church')) return 'church';
      if (host.includes('party')) return 'party';
    } catch {
      // Fallback
    }
  }

  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_APP_VARIANT === 'church') {
    return 'church';
  }

  return 'party';
}
