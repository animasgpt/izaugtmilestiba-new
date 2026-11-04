// Next.js App Router integration example. The deployed site remains React/Vite.
// Copy into a Next.js project and adjust the three local import paths.
import type { CSSProperties, ReactNode } from 'react';
import { googleFontsUrl } from '../../cms/design';
import { normalizeSnapshot } from '../../cms/normalize';
import type { SiteSettings } from '../../cms/model';
import { themeVariables } from '../../src/lib/cmsTheme';
import '../../src/cms/cms.css';

export const dynamic = 'force-dynamic';
export default async function RootLayout({ children }: { children: ReactNode }) {
  const projectId = process.env.SANITY_PROJECT_ID || 'sxvw8jh8';
  const dataset = process.env.SANITY_DATASET || 'production';
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) throw new Error('Invalid Sanity configuration');
  const url = new URL(`https://${projectId}.api.sanity.io/v2026-09-10/data/query/${dataset}`);
  url.searchParams.set('query', '*[_id == "siteSettings"][0]');
  url.searchParams.set('perspective', 'published');
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Sanity returned ${response.status}`);
  const { result } = await response.json() as { result: SiteSettings | null };
  const settings = normalizeSnapshot({ settings: result, pages: [] }).settings;
  const variables = themeVariables(settings?.theme);
  const fontUrl = googleFontsUrl(settings?.theme?.headingFont, settings?.theme?.bodyFont);
  return <html lang="lv" style={{ ...variables, '--font-heading': variables['--cms-heading-font'], '--font-body': variables['--cms-body-font'] } as CSSProperties}>
    <head>{fontUrl && <link rel="stylesheet" href={fontUrl} />}</head>
    <body className="cms-site">{children}</body>
  </html>;
}
