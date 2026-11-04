import type { CmsLink, CmsPage } from './model';

export function pagePath(page: CmsPage, pages: CmsPage[], seen = new Set<string>()): string | null {
  if (page._id === 'page-home') return '/';
  if (seen.has(page._id)) return null;
  const slug = page.slug?.current?.trim();
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  seen.add(page._id);
  if (!page.parent?._ref) return '/' + slug;
  const parent = pages.find(p => p._id === page.parent?._ref);
  if (!parent) return null;
  const base = pagePath(parent, pages, seen);
  return base === null ? null : (base === '/' ? '' : base) + '/' + slug;
}

export function safeHref(value?: string): string | undefined {
  if (!value || value !== value.trim() || ([...value].some(char => char.charCodeAt(0) <= 32) || value.includes('\\'))) return undefined;
  if (value.startsWith('//')) return undefined;
  if (value.startsWith('/') || value.startsWith('#')) return value;
  return /^(https?:\/\/|mailto:|tel:)/i.test(value) ? value : undefined;
}

export function linkHref(link: CmsLink, pages: CmsPage[]): string | undefined {
  if (link.kind === 'page' || link.page?._ref) {
    const page = pages.find(p => p._id === link.page?._ref);
    const path = page ? pagePath(page, pages) : null;
    return path ? path + (link.anchor ? '#' + encodeURIComponent(link.anchor) : '') : undefined;
  }
  if (link.kind === 'anchor') return link.anchor ? '/#' + encodeURIComponent(link.anchor) : undefined;
  return safeHref(link.href);
}

export function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}
