import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sanityClient } from '@/lib/sanity';
import { defaultSnapshot } from '../../cms/defaults';
import type { SiteSnapshot } from '../../cms/model';

export const SITE_QUERY = `{
  "settings": coalesce(*[_id == "siteSettings"][0], *[_type == "siteSettings"] | order(_createdAt asc)[0]),
  "pages": *[_type == "page"] | order(_id asc)
}`;
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
    staleTime: 60_000, retry: 1, refetchOnWindowFocus: true,
  });
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const subscription = sanityClient.listen('*[_type in ["page", "siteSettings"] && !(_id in path("drafts.**"))]', {},
      { includeResult: false, visibility: 'query' }).subscribe({
      next: () => { clearTimeout(timer); timer = setTimeout(() => void queryClient.invalidateQueries({ queryKey: ['cms-site'] }), 200); },
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
  const snapshot = previewSnapshot || ((live?.settings?.builderVersion === 1 || live?.pages?.length) ? live : {
    settings: { ...defaultSnapshot.settings, ...live?.settings }, pages: defaultSnapshot.pages,
  });
  return <CmsContext.Provider value={{ snapshot, preview, editing, loading: query.isLoading && !previewSnapshot, error: query.isError }}>
    {preview && <div className="cms-preview-banner">Priekšskatījums · izmaiņas kļūst publiskas pēc “Publish”{!previewSnapshot && ' · Gaida savienojumu ar Sanity…'}</div>}
    {children}
  </CmsContext.Provider>;
}
export const useCms = () => useContext(CmsContext);
