import type { CmsPage, SiteSettings } from './model';
export function builderUpgrade(doc: CmsPage | SiteSettings): Record<string, unknown> {
  if (doc._type === 'page') return doc.pageBuilder === undefined && doc.sections !== undefined ? { pageBuilder: doc.sections } : {};
  if (doc._type !== 'siteSettings') return {};
  const mapping = { fontHeading: 'headingFont', fontBody: 'bodyFont', primaryColor: 'primary', accentColor: 'accent', backgroundColor: 'background', textColor: 'foreground', buttonStyle: 'buttonStyle' } as const;
  const values: Record<string, unknown> = {};
  for (const [target, source] of Object.entries(mapping)) {
    const value = doc.theme?.[source as keyof NonNullable<SiteSettings['theme']>];
    if (doc[target as keyof SiteSettings] === undefined && value !== undefined) values[target] = value;
  }
  return values;
}
