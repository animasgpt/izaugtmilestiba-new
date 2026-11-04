import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { sanityClient } from '@/lib/sanity';
import { withArticlePages } from '../../cms/articles';
import { defaultSnapshot } from '../../cms/defaults';
import type { CmsArticle, SiteSnapshot } from '../../cms/model';
import { SITE_QUERY, ARTICLE_QUERY } from '../../cms/query';
import { normalizePath, pagePath } from '../../cms/routing';

const CmsContext = createContext<{ snapshot: SiteSnapshot; preview: boolean; editing: boolean; loading: boolean; error: boolean }>({
  snapshot: defaultSnapshot, preview: false, editing: false, loading: true, error: false,
});
export function CmsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [previewSnapshot, setPreviewSnapshot] = useState<SiteSnapshot | null>(null);
  const [preview] = useState(() => new URLSearchParams(window.location.search).has('cms-preview') && window.parent !== window);
  const query = useQuery({
    queryKey: ['cms-site'],
    queryFn: () => sanityClient.fetch<SiteSnapshot>(SITE_QUERY, {}, { perspective: 'published' }),
    initialData: typeof __CMS_INITIAL_SNAPSHOT__ === 'undefined' ? undefined : __CMS_INITIAL_SNAPSHOT__ ?? undefined,
    // The embedded copy is immediately visible, but never delays a live refresh.
    initialDataUpdatedAt: 0,
    staleTime: 60_000, retry: 1, refetchOnWindowFocus: true,
  });
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const subscription = sanityClient.listen('*[_type in ["page", "siteSettings", "article"] && !(_id in path("drafts.**"))]', {},
      { includeResult: false, visibility: 'query' }).subscribe({
      next: () => { clearTimeout(timer); timer = setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: ['cms-site'] });
        void queryClient.invalidateQueries({ queryKey: ['cms-article'] });
      }, 200); },
      error: () => { /* Focus refetch remains available if realtime is interrupted. */ },
    });
    return () => { clearTimeout(timer); subscription.unsubscribe(); };
  }, [queryClient]);
  useEffect(() => {
    if (!preview) return;
    const studioUrl = import.meta.env.VITE_SANITY_STUDIO_URL || query.data?.settings?.studioUrl || (import.meta.env.DEV ? 'http://localhost:3333' : '');
    let origin: string;
    try { origin = new URL(studioUrl).origin; } catch { return; }
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || event.origin !== origin) return;
      if (event.data?.type === 'cms:preview-mode') { setEditing(!!event.data.editing); return; }
      if (event.data?.type !== 'cms:snapshot' || !Array.isArray(event.data.snapshot?.pages)) return;
      setPreviewSnapshot(event.data.snapshot as SiteSnapshot);
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'cms:ready' }, origin);
    return () => window.removeEventListener('message', onMessage);
  }, [preview, query.data?.settings?.studioUrl]);
  const live = query.data;
  // Keep the existing public site available until the additive CMS seed is installed.
  // Once any CMS pages exist, missing/deleted pages must stay missing (404).
  const baseSnapshot = previewSnapshot || ((live?.settings?.builderVersion === 1 || live?.pages?.length) ? live : {
    settings: { ...defaultSnapshot.settings, ...live?.settings }, pages: defaultSnapshot.pages,
  });
  const location = useLocation();
  const path = normalizePath(location.pathname);
  const routedSnapshot = withArticlePages(baseSnapshot);
  const activeArticle = routedSnapshot.pages.find(page => page.sourceType === 'article' && pagePath(page, routedSnapshot.pages) === path);
  const articleQuery = useQuery({
    queryKey: ['cms-article', activeArticle?._id],
    queryFn: () => sanityClient.fetch<CmsArticle | null>(ARTICLE_QUERY, { id: activeArticle!._id }, { perspective: 'published' }),
    enabled: !!activeArticle && !previewSnapshot,
    staleTime: 60_000, retry: 1,
  });
  const snapshot = articleQuery.data && activeArticle && !previewSnapshot ? withArticlePages({
    ...baseSnapshot,
    articles: baseSnapshot.articles?.map(article => article._id === articleQuery.data!._id ? articleQuery.data! : article),
  }) : routedSnapshot;
  return <CmsContext.Provider value={{ snapshot, preview, editing, loading: query.isLoading && !previewSnapshot, error: query.isError }}>
    {preview && <div className="cms-preview-banner">Priekšskatījums · izmaiņas kļūst publiskas pēc “Publish”{!previewSnapshot && ' · Gaida savienojumu ar Sanity…'}</div>}
    {children}
  </CmsContext.Provider>;
}
export const useCms = () => useContext(CmsContext);
