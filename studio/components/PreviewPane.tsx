import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';
import { withArticlePages } from '../../cms/articles';
import { pagePath } from '../../cms/routing';
import type { CmsArticle, CmsPage, SiteSettings, SiteSnapshot } from '../../cms/model';

const controlStyle = { padding: '7px 12px', border: '1px solid #b7c0ba', borderRadius: 6, background: '#f8faf8', color: '#17271d', cursor: 'pointer' };
interface Props { document?: { displayed?: Record<string, unknown> | null } }
const query = `{"settings": coalesce(*[_id == "siteSettings"][0], *[_type == "siteSettings"] | order(_createdAt asc)[0]), "pages": *[_type == "page"], "articles": *[_type == "article"] | order(publishedAt desc)}`;
export function PreviewPane({ document }: Props) {
  const baseClient = useClient({ apiVersion: '2026-09-10' });
  const client = useMemo(() => baseClient.withConfig({ useCdn: false, perspective: 'drafts' }), [baseClient]);
  const router = useRouter();
  const iframe = useRef<HTMLIFrameElement>(null);
  const [data, setData] = useState<SiteSnapshot>({ settings: null, pages: [] });
  const [error, setError] = useState('');
  const [mobile, setMobile] = useState(false);
  const [editing, setEditing] = useState(false);
  const [revision, setRevision] = useState(0);
  const displayed = document?.displayed;
  const snapshot = useMemo(() => {
    const settings = { ...data.settings };
    let pages = data.pages.map(page => ({ ...page, _id: page._id.replace(/^drafts\./, '') }));
    if (displayed?._type === 'page') {
      const page = { ...displayed, _id: String(displayed._id).replace(/^drafts\./, '') } as unknown as CmsPage;
      pages = [...pages.filter(item => item._id !== page._id), page];
    }
    let articles = data.articles || [];
    if (displayed?._type === 'article') {
      const article = { ...displayed, _id: String(displayed._id).replace(/^drafts\./, '') } as unknown as CmsArticle;
      articles = [...articles.filter(item => item._id.replace(/^drafts\./, '') !== article._id), article];
    }
    return withArticlePages({ settings: displayed?._type === 'siteSettings' ? displayed as SiteSettings : settings, pages, articles });
  }, [data, displayed]);
  const url = useMemo(() => {
    let base = snapshot.settings?.siteUrl || process.env.SANITY_STUDIO_PREVIEW_URL || 'http://127.0.0.1:8080';
    try { if (!/^https?:$/.test(new URL(base).protocol)) base = 'http://127.0.0.1:8080'; } catch { base = 'http://127.0.0.1:8080'; }
    const page = (displayed?._type === 'page' || displayed?._type === 'article') ? snapshot.pages.find(p => p._id === String(displayed._id).replace(/^drafts\./, '')) : undefined;
    const path = page ? pagePath(page, snapshot.pages) : '/';
    const result = new URL(path || '/', base);
    result.searchParams.set('cms-preview', '1');
    return result;
  }, [snapshot.pages, snapshot.settings?.siteUrl, displayed]);
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const fetch = () => void client.fetch<SiteSnapshot>(query).then(result => { if (active) { setData(result); setError(''); } })
      .catch(() => { if (active) setError('Nepieciešama piekļuve Sanity projektam. Pārbaudiet pieslēgšanos un CORS.'); });
    fetch();
    const sub = client.listen('*[_type in ["page", "siteSettings", "article"]]', {}, { includeResult: false }).subscribe({
      next: () => { clearTimeout(timer); timer = setTimeout(fetch, 300); }, error: () => setError('Reāllaika savienojums pārtrūka. Atveriet priekšskatījumu vēlreiz.'),
    });
    return () => { active = false; clearTimeout(timer); sub.unsubscribe(); };
  }, [client]);
  const send = useCallback(() => {
    iframe.current?.contentWindow?.postMessage({ type: 'cms:snapshot', snapshot }, url.origin);
    iframe.current?.contentWindow?.postMessage({ type: 'cms:preview-mode', editing }, url.origin);
  }, [snapshot, editing, url.origin]);
  useEffect(() => { send(); }, [send]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== url.origin || event.source !== iframe.current?.contentWindow) return;
      if (event.data?.type === 'cms:ready') send();
      if (event.data?.type === 'cms:edit' && typeof event.data.id === 'string' && typeof event.data.path === 'string') {
        router.navigateIntent('edit', { id: event.data.id, type: event.data.schemaType, path: event.data.path });
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [send, url.origin, router]);
  return <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#eef0ed' }}>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: 12, background: '#fff', color: '#222', borderBottom: '1px solid #ccc' }}>
      <button style={controlStyle} onClick={() => setMobile(false)} aria-pressed={!mobile}>🖥 Dators</button>
      <button style={controlStyle} onClick={() => setMobile(true)} aria-pressed={mobile}>📱 Telefons</button>
      <button style={controlStyle} onClick={() => setEditing(!editing)} aria-pressed={editing}>{editing ? '✓ Klikšķināt, lai rediģētu' : 'Klikšķināt, lai rediģētu'}</button>
      <button style={controlStyle} onClick={() => setRevision(v => v + 1)}>↻ Pārlādēt</button>
      <a href={url.origin + url.pathname} target="_blank" rel="noreferrer">Atvērt publisko lapu ↗</a>
      <span style={{ fontSize: 12, flexBasis: '100%' }}>Šeit redzat arī nepublicētus labojumus. Publiski tie parādīsies pēc Publish. Rediģēšanu un priekšskatījumu var atvērt blakus ar Sanity “Split pane”.</span>
    </div>
    {error && <p role="alert" style={{ color: '#a01717', padding: 12 }}>{error}</p>}
    <iframe key={revision} ref={iframe} src={url.href} title="Lapas priekšskatījums" onLoad={send}
      style={{ width: mobile ? '390px' : '100%', maxWidth: '100%', margin: '0 auto', flex: 1, border: 0, background: 'white', minHeight: 500 }} />
  </div>;
}
