import type { SiteSnapshot } from './model';
export function normalizeSnapshot(snapshot: SiteSnapshot): SiteSnapshot {
  const settings = snapshot.settings;
  return {
    ...snapshot,
    settings: settings ? { ...settings, theme: {
      ...settings.theme,
      headingFont: settings.fontHeading ?? settings.theme?.headingFont,
      bodyFont: settings.fontBody ?? settings.theme?.bodyFont,
      primary: settings.primaryColor ?? settings.theme?.primary,
      accent: settings.accentColor ?? settings.theme?.accent,
      background: settings.backgroundColor ?? settings.theme?.background,
      foreground: settings.textColor ?? settings.theme?.foreground,
      buttonStyle: settings.buttonStyle ?? settings.theme?.buttonStyle,
    } } : null,
    pages: snapshot.pages.map(page => ({ ...page, sections: page.pageBuilder ?? page.sections })),
  };
}
