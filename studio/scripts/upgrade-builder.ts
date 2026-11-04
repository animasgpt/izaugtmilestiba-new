import { getCliClient } from 'sanity/cli';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { builderUpgrade } from '../../cms/upgrade';
import type { CmsPage, SiteSettings } from '../../cms/model';

async function main() {
  const client = getCliClient({ apiVersion: '2026-09-10' }).withConfig({ useCdn: false });
  const docs = await client.fetch<((CmsPage | SiteSettings) & { _id: string; _rev: string })[]>('*[_type in ["page", "siteSettings"]]', {}, { perspective: 'raw' });
  const changes = docs.map(doc => ({ doc, fields: builderUpgrade(doc) })).filter(change => Object.keys(change.fields).length);
  if (!changes.length) { console.log('Already upgraded; no documents changed.'); return; }
  const root = fileURLToPath(new URL('../../', import.meta.url));
  await mkdir(path.join(root, 'backups'), { recursive: true });
  const backup = path.join(root, 'backups', `sanity-${client.config().projectId}-before-design-builder-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  await writeFile(backup, JSON.stringify(docs, null, 2), 'utf8');
  console.log('Backup saved:', backup);
  const transaction = client.transaction();
  for (const { doc, fields } of changes) transaction.patch(doc._id, patch => patch.ifRevisionId(doc._rev).setIfMissing(fields));
  await transaction.commit();
  console.log(`Upgraded ${changes.length} documents atomically. Existing content, drafts, articles and legacy fields preserved.`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Builder upgrade failed'); process.exitCode = 1; });
