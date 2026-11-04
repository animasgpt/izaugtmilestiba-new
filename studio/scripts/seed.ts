import { getCliClient } from 'sanity/cli';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defaultSnapshot } from '../../cms/defaults';
import type { SiteSettings, CmsPage } from '../../cms/model';
import { builderUpgrade } from '../../cms/upgrade';

async function main() {
  const client = getCliClient({ apiVersion: '2026-09-10' }).withConfig({ useCdn: false });
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const docs = await client.fetch<Record<string, unknown>[]>('*[_type in ["page", "siteSettings"]]', {}, { perspective: 'raw' });
  await mkdir(path.join(root, 'backups'), { recursive: true });
  const backup = path.join(root, 'backups', `sanity-${client.config().projectId}-before-builder-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  await writeFile(backup, JSON.stringify(docs, null, 2), 'utf8');
  console.log('Existing page/settings documents backed up locally.');
  const legacy = (docs.find(doc => doc._id === 'siteSettings') || docs.find(doc => doc._type === 'siteSettings' && !String(doc._id).startsWith('drafts.'))) as SiteSettings | undefined;
  const seed = structuredClone(defaultSnapshot);
  const articleCount = await client.fetch<number>('count(*[_type == "article"])');
  if (articleCount > 0) seed.pages.push({ _id: 'page-articles', _type: 'page', title: 'Raksti', slug: { current: 'raksti' }, sections: [{ _key: 'articles', _type: 'articleListSection', title: 'Raksti', columns: 3 }] });
  const home = seed.pages.find(page => page._id === 'page-home')!;
  const hero = home.sections!.find(section => section._key === 'hero')!;
  if (legacy?.heroTitle) hero.title = legacy.heroTitle;
  if (legacy?.intro) hero.subtitle = legacy.intro;
  const cards = home.sections!.find(section => section._key === 'services')!.items!;
  for (const [index, name] of ['inPersonPrice', 'onlinePrice', 'journalPrice'].entries()) {
    const value = legacy?.[name as keyof SiteSettings];
    if (typeof value === 'string' && value) cards[index].price = value;
  }
  const sources = { logo: 'logo.png', hero: 'hero-madara.jpg', onsite: 'consultation-onsite.jpg', online: 'consultation-online.jpg', book: 'book-cover.jpg' };
  const assets = new Map<string, string>();
  for (const [key, filename] of Object.entries(sources)) {
    const asset = await client.assets.upload('image', createReadStream(path.join(root, 'src/assets', filename)), { filename });
    assets.set(key, asset._id);
  }
  function convert(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(convert);
    if (!value || typeof value !== 'object') return value;
    const object = value as Record<string, unknown>;
    if (typeof object.fallback === 'string' && assets.has(object.fallback)) {
      const { fallback, ...image } = object;
      return { ...image, _type: 'siteImage', asset: { _type: 'reference', _ref: assets.get(String(fallback)) } };
    }
    return Object.fromEntries(Object.entries(object).map(([key, item]) => [key, convert(item)]));
  }
  const content = convert(seed) as typeof seed;
  const { _id, _type, ...defaults } = content.settings!;
  const cleanLegacy = Object.fromEntries(Object.entries(legacy || {}).filter(([key]) => !key.startsWith('_')));
  const studioUrl = `https://${process.env.SANITY_STUDIO_HOST || 'izaugtmilestiba-sxvw8jh8'}.sanity.studio`;
  const initialSettings = { ...defaults, ...cleanLegacy, builderVersion: 1, studioUrl };
  Object.assign(initialSettings, builderUpgrade({ ...initialSettings, _type: 'siteSettings' }));
  const transaction = client.transaction();
  transaction.createIfNotExists({ _id: 'siteSettings', _type: 'siteSettings', ...initialSettings });
  transaction.patch('siteSettings', patch => patch.setIfMissing({ ...defaults, builderVersion: 1, studioUrl }).set({ studioUrl }));
  if (docs.some(doc => doc._id === 'drafts.siteSettings')) {
    transaction.patch('drafts.siteSettings', patch => patch.setIfMissing({ ...defaults, builderVersion: 1, studioUrl }).set({ studioUrl }));
  }
  for (const page of content.pages) {
    if (docs.some(doc => doc._id === 'drafts.' + page._id)) {
      console.log('Preserved existing draft:', page._id);
      continue;
    }
    transaction.createIfNotExists({ ...page, ...builderUpgrade(page) } as CmsPage & { _id: string; _type: string });
  }
  // Normalize array metadata without changing editorial values. Older website
  // data used cmsLink objects for navigation and untyped form-service objects.
  for (const doc of docs) {
    if (doc._type !== 'siteSettings') continue;
    const header = doc.header as { navigation?: { _key: string; _type?: string }[] } | undefined;
    const contact = doc.contact as { services?: { _key: string; _type?: string }[] } | undefined;
    const patches: Record<string, string> = {};
    for (const item of header?.navigation || []) {
      if (item._key && (!item._type || item._type === 'cmsLink')) patches[`header.navigation[_key==${JSON.stringify(item._key)}]._type`] = 'navigationLink';
    }
    for (const item of contact?.services || []) {
      if (item._key && !item._type) patches[`contact.services[_key==${JSON.stringify(item._key)}]._type`] = 'formService';
    }
    if (Object.keys(patches).length) transaction.patch(String(doc._id), patch => patch.set(patches));
  }
  await transaction.commit();
  console.log('Builder initialized. Existing documents were not overwritten or deleted.');
  console.log('Verify pages and settings in Studio before switching the public site.');
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Sanity initialization failed'); process.exitCode = 1; });
