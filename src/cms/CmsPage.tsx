import { useEffect, type CSSProperties, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CmsProvider, useCms } from './CmsProvider';
import { CmsHeader, CmsFooter } from './CmsChrome';
import { CmsSections } from './CmsSections';
import { imageUrl } from './content';
import { pagePath, normalizePath } from '../../cms/routing';
import { themeVariables } from '@/lib/cmsTheme';
import type { CmsPage as Page, SiteSettings } from '../../cms/model';
import './cms.css';
import { googleFontsUrl } from '../../cms/design';

function useMetadata(page: Page | undefined, settings: SiteSettings | null, path: string, preview: boolean) {
  useEffect(() => {
    const title = page?.seo?.title || (page ? `${page.title} | ${settings?.title || ''}` : 'Lapa nav atrasta');
    document.title = title;
    const setMeta = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.appendChild(element); }
      element.content = content;
    };
    const description = page?.seo?.description ?? settings?.seo?.description ?? '';
    const image = imageUrl(page?.seo?.image || settings?.seo?.image);
    setMeta('description', description); setMeta('og:title', title, true); setMeta('og:description', description, true);
    setMeta('twitter:title', title); setMeta('twitter:description', description);
    setMeta('og:image', image || '', true); setMeta('twitter:image', image || '');
    setMeta('robots', preview || !page || page.seo?.noIndex ? 'noindex,nofollow' : 'index,follow');
    const icon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (icon) { icon.href = imageUrl(settings?.favicon, 128) || '/favicon.png'; icon.removeAttribute('type'); }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    try {
      const base = new URL(settings?.siteUrl || location.origin);
      canonical.href = new URL(path, base.origin).href;
      setMeta('og:url', canonical.href, true);
    } catch { canonical.remove(); }
  }, [page, settings, path, preview]);
}
function RenderPage() {
  const { snapshot, preview, editing, loading } = useCms();
  const location = useLocation();
  const path = normalizePath(location.pathname);
  const page = snapshot.pages.find(p => pagePath(p, snapshot.pages) === path);
  const headingFont = snapshot.settings?.theme?.headingFont;
  const bodyFont = snapshot.settings?.theme?.bodyFont;
  useEffect(() => {
    const href = googleFontsUrl(headingFont, bodyFont);
    if (!href) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = href; link.dataset.cmsFonts = 'true';
    document.head.appendChild(link);
    return () => link.remove();
  }, [headingFont, bodyFont]);
  useMetadata(page, snapshot.settings, path, preview);
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      if (location.hash) { try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' }); } catch { /* Ignore a malformed hash. */ } }
      else window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash, loading]);
  const inspect = (event: MouseEvent) => {
    if (!preview || !editing || !(event.target instanceof HTMLElement)) return;
    const target = event.target;
    const field = target.closest<HTMLElement>('[data-cms-path]')?.dataset.cmsPath;
    const section = target.closest<HTMLElement>('[data-cms-section]')?.dataset.cmsSection;
    const item = target.closest<HTMLElement>('[data-cms-item]')?.dataset.cmsItem;
    const documentId = target.closest<HTMLElement>('[data-cms-document]')?.dataset.cmsDocument;
    if (!documentId) return;
    event.preventDefault(); event.stopPropagation();
    const sourceType = target.closest<HTMLElement>('[data-cms-source-type]')?.dataset.cmsSourceType;
    const sectionField = page?.pageBuilder !== undefined ? 'pageBuilder' : 'sections';
    const sourcePath = sourceType === 'article' ? (field === 'image' ? 'coverImage' : field === 'subtitle' ? 'excerpt' : field === 'eyebrow' ? 'category' : field || '') : section ? `${sectionField}[_key=="${section}"]${item ? `.items[_key=="${item}"]` : ''}${field ? '.' + field : ''}` : field || '';
    const origin = new URL(import.meta.env.VITE_SANITY_STUDIO_URL || snapshot.settings?.studioUrl || 'http://localhost:3333').origin;
    window.parent.postMessage({ type: 'cms:edit', id: documentId, schemaType: sourceType === 'article' ? 'article' : documentId === 'siteSettings' ? 'siteSettings' : 'page', path: sourcePath }, origin);
  };
  const vars = { ...themeVariables(snapshot.settings?.theme), '--cms-logo-width': `${Math.max(24, Math.min(260, snapshot.settings?.logoWidth || 48))}px` } as CSSProperties;
  useEffect(() => {
    const root = document.documentElement;
    const values = themeVariables({ headingFont, bodyFont });
    const previous = [root.style.getPropertyValue('--font-heading'), root.style.getPropertyValue('--font-body')];
    root.style.setProperty('--font-heading', values['--cms-heading-font']);
    root.style.setProperty('--font-body', values['--cms-body-font']);
    return () => { ['--font-heading', '--font-body'].forEach((name, i) => previous[i] ? root.style.setProperty(name, previous[i]) : root.style.removeProperty(name)); };
  }, [headingFont, bodyFont]);
  return <div className={'cms-site' + (editing && preview ? ' cms-inspecting' : '')} style={vars} onClickCapture={inspect}>
    {(!page || !page.hideHeader) && <CmsHeader />}
    {loading ? <main className="cms-status" aria-live="polite">Ielādē…</main> : page ? <CmsSections page={page} /> :
      <main className="cms-status"><h1>Lapa nav atrasta</h1><p>Šī lapa nav publicēta vai tās adrese ir mainīta.</p><Link to="/">Uz sākumlapu</Link></main>}
    {(!page || !page.hideFooter) && <CmsFooter />}
  </div>;
}
export default function CmsPage() { return <CmsProvider><RenderPage /></CmsProvider>; }
