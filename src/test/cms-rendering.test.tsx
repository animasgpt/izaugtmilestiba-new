import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CmsPage from '../cms/CmsPage';
import { defaultSnapshot } from '../../cms/defaults';
import type { SiteSnapshot, CmsSection } from '../../cms/model';
import { ARTICLE_QUERY, SITE_QUERY } from '../../cms/query';

const api = vi.hoisted(() => ({ fetch: vi.fn(), listeners: [] as (() => void)[] }));
vi.mock('@/lib/sanity', async importOriginal => {
  const original = await importOriginal<typeof import('../lib/sanity')>();
  return { ...original, sanityClient: { fetch: api.fetch, listen: () => ({ subscribe: (observer: { next: () => void }) => {
    api.listeners.push(observer.next); return { unsubscribe: vi.fn() };
  } }) } };
});
function snapshot(): SiteSnapshot {
  const data = structuredClone(defaultSnapshot);
  data.settings.builderVersion = 1;
  return data;
}
function mount(data: SiteSnapshot, path = '/') {
  api.fetch.mockResolvedValue(data);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const result = render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[path]}><CmsPage /></MemoryRouter></QueryClientProvider>);
  return { ...result, client };
}
beforeEach(() => { api.fetch.mockReset(); api.listeners.length = 0; window.scrollTo = vi.fn(); HTMLElement.prototype.scrollIntoView = vi.fn(); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Sanity controls the actual public website', () => {
  it('shows deployed published content immediately while a slow Sanity refresh is pending', async () => {
    const deployed = snapshot();
    deployed.pages[0].sections = [{ _type: 'textSection', _key: 'intro', title: 'Uzreiz redzams saturs' }];
    vi.stubGlobal('__CMS_INITIAL_SNAPSHOT__', deployed);
    let resolveRefresh!: (value: SiteSnapshot) => void;
    api.fetch.mockImplementation(() => new Promise<SiteSnapshot>(resolve => { resolveRefresh = resolve; }));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    render(<QueryClientProvider client={client}><MemoryRouter><CmsPage /></MemoryRouter></QueryClientProvider>);
    expect(screen.getByRole('heading', { name: 'Uzreiz redzams saturs' })).toBeInTheDocument();
    expect(screen.queryByText('Ielādē…')).not.toBeInTheDocument();
    const latest = structuredClone(deployed);
    latest.pages[0].sections![0].title = 'Jaunākās Sanity izmaiņas';
    await act(async () => resolveRefresh(latest));
    expect(await screen.findByRole('heading', { name: 'Jaunākās Sanity izmaiņas' })).toBeInTheDocument();
  });
  it('keeps deployed content visible when the initial Sanity refresh fails', async () => {
    const deployed = snapshot();
    deployed.pages[0].sections = [{ _type: 'textSection', _key: 'intro', title: 'Pieejams arī bez Sanity' }];
    vi.stubGlobal('__CMS_INITIAL_SNAPSHOT__', deployed);
    api.fetch.mockRejectedValue(new Error('Offline'));
    const client = new QueryClient({ defaultOptions: { queries: { gcTime: 0 } } });
    render(<QueryClientProvider client={client}><MemoryRouter><CmsPage /></MemoryRouter></QueryClientProvider>);
    await waitFor(() => expect(client.getQueryState(['cms-site'])?.status).toBe('error'), { timeout: 3000 });
    expect(screen.getByRole('heading', { name: 'Pieejams arī bez Sanity' })).toBeInTheDocument();
    expect(screen.queryByText('Ielādē…')).not.toBeInTheDocument();
  });
  it('renders page text, changed logo, nested navigation, footer and theme from one snapshot', async () => {
    const data = snapshot();
    data.pages[0].sections = [{ _type: 'textSection', _key: 'intro', title: 'Jaunais virsraksts' }];
    data.settings.title = 'Cits zīmols';
    data.settings.logo = { asset: { _ref: 'image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-100x100-png' }, alt: 'Jaunais logo' };
    data.settings.theme = { primary: '#ff0000' };
    data.settings.footer.text = 'Mainīta kājene';
    data.settings.header.navigation = [{ _key: 'pages', label: 'Lapas', children: [{ label: 'Par mani', kind: 'page', page: { _ref: 'page-about' } }] }];
    const { container } = mount(data);
    expect(await screen.findByRole('heading', { name: 'Jaunais virsraksts' })).toBeInTheDocument();
    expect(screen.getByAltText('Jaunais logo')).toHaveAttribute('src', expect.stringContaining('cdn.sanity.io/images'));
    expect(screen.getByText('Mainīta kājene')).toBeInTheDocument();
    expect(container.querySelector('.cms-site')).toHaveStyle({ '--primary': '0.0 100.0% 50.0%' });
    expect(screen.getByRole('link', { name: 'Par mani', hidden: true })).toHaveAttribute('href', '/par-mani');
    expect(api.fetch).toHaveBeenCalledWith(expect.any(String), {}, { perspective: 'published' });
  });
  it('refreshes published changes without rebuilding and honors hidden sections', async () => {
    const data = snapshot();
    data.pages[0].sections = [{ _type: 'textSection', _key: 'a', title: 'Pirms publicēšanas' }, { _type: 'textSection', _key: 'b', title: 'Paslēpts teksts', hidden: true }];
    mount(data);
    expect(await screen.findByRole('heading', { name: 'Pirms publicēšanas' })).toBeInTheDocument();
    expect(screen.queryByText('Paslēpts teksts')).not.toBeInTheDocument();
    const update = structuredClone(data);
    update.pages[0].sections[0].title = 'Pēc publicēšanas';
    api.fetch.mockResolvedValue(update);
    act(() => api.listeners.forEach(next => next()));
    expect(await screen.findByRole('heading', { name: 'Pēc publicēšanas' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Pirms publicēšanas' })).not.toBeInTheDocument();
  });
  it('renders a new nested page, with no code or route entry for it', async () => {
    const data = snapshot();
    data.pages.push({ _id: 'child', _type: 'page', title: 'Apakšlapa', slug: { current: 'pieredze' }, parent: { _ref: 'page-about' },
      sections: [{ _type: 'textSection', _key: 'copy', title: 'Apakšlapas saturs' }], seo: { title: 'Mana SEO cilne' } });
    mount(data, '/par-mani/pieredze');
    expect(await screen.findByRole('heading', { name: 'Apakšlapas saturs' })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('Mana SEO cilne'));
  });
  it('does not resurrect fallback pages after the CMS homepage has been unpublished', async () => {
    const data = snapshot(); data.pages = [];
    mount(data);
    expect(await screen.findByRole('heading', { name: 'Lapa nav atrasta' })).toBeInTheDocument();
  });
  it('loads a full article only when its route is opened', async () => {
    const data = snapshot();
    data.pages.push({ _id: 'page-articles', _type: 'page', title: 'Raksti', slug: { current: 'raksti' }, sections: [{ _key: 'list', _type: 'articleListSection', title: 'Rakstu saraksts' }] });
    data.articles = [{ _id: 'article-one', _type: 'article', title: 'Esošais raksts', slug: { current: 'esosais' }, excerpt: 'Raksta ievads', body: [{ _type: 'block', _key: 'p', children: [{ _type: 'span', _key: 's', text: 'Saglabātais raksta teksts' }] }] }];
    const fullArticle = data.articles[0];
    data.articles = [{ ...fullArticle, body: undefined }];
    api.fetch.mockImplementation((query: string) => Promise.resolve(query === ARTICLE_QUERY ? fullArticle : data));
    const client = new QueryClient({ defaultOptions: { queries: { gcTime: 0 } } });
    render(<QueryClientProvider client={client}><MemoryRouter initialEntries={['/raksti/esosais']}><CmsPage /></MemoryRouter></QueryClientProvider>);
    expect(await screen.findByRole('heading', { name: 'Esošais raksts' })).toBeInTheDocument();
    expect(await screen.findByText('Saglabātais raksta teksts')).toBeInTheDocument();
    expect(api.fetch).toHaveBeenCalledWith(ARTICLE_QUERY, { id: 'article-one' }, { perspective: 'published' });
    const updated = { ...fullArticle, body: [{ _type: 'block', _key: 'p', children: [{ _type: 'span', _key: 's', text: 'Publicētais labojums' }] }] };
    api.fetch.mockImplementation((query: string) => Promise.resolve(query === ARTICLE_QUERY ? updated : data));
    act(() => api.listeners.forEach(next => next()));
    expect(await screen.findByText('Publicētais labojums')).toBeInTheDocument();
  });
  it('does not request article bodies on the homepage', async () => {
    mount(snapshot());
    await waitFor(() => expect(api.fetch).toHaveBeenCalled());
    expect(api.fetch.mock.calls.every(([query]) => query === SITE_QUERY)).toBe(true);
  });
  it('respects removal of optional form choices and the footer title', async () => {
    const data = snapshot();
    data.pages[0].sections = [{ _type: 'contactSection', _key: 'contact', title: 'Forma' }];
    data.settings.contact.services = undefined;
    data.settings.footer.showTitle = false;
    const { container } = mount(data);
    expect(await screen.findByRole('heading', { name: 'Forma' })).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(container.querySelector('.cms-footer-title')).toBeNull();
    expect(screen.getByRole('button', { name: 'Nosūtīt' })).toBeInTheDocument();
  });
  it('supports every available section, including an empty published page', async () => {
    const data = snapshot();
    const types: CmsSection['_type'][] = ['heroSection','textSection','imageTextSection','cardsSection','gallerySection','faqSection','testimonialsSection','ctaSection','contactSection','statsSection','spacerSection'];
    data.pages[0].sections = types.map((type, i) => ({ _type: type, _key: 'section' + i, title: 'Bloks ' + i,
      items: [{ _key: 'item', title: 'Vienums', body: [], author: 'Autore', text: 'Teksts', value: '20' }] }));
    const { client } = mount(data);
    expect(await screen.findByRole('heading', { name: 'Bloks 9' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: /^Bloks/ })).toHaveLength(10);
    const empty = structuredClone(data); empty.pages[0].sections = [];
    api.fetch.mockResolvedValue(empty);
    await act(async () => { await client.invalidateQueries({ queryKey: ['cms-site'] }); });
    await waitFor(() => expect(screen.queryAllByRole('heading', { name: /^Bloks/ })).toHaveLength(0));
    expect(screen.queryByText('Lapa nav atrasta')).not.toBeInTheDocument();
  });
});
