import type { SiteSettings } from '../../cms/model';
import { fontFamilies } from '../../cms/design';
import { defaultColors, hexToHsl } from '../../cms/colors';
export { hexToHsl } from '../../cms/colors';
export function themeVariables(theme: SiteSettings['theme']): Record<string, string> {
  const values: Record<string, string> = {};
  const names = { background: 'background', foreground: 'foreground', primary: 'primary', primaryForeground: 'primary-foreground',
    secondary: 'secondary', secondaryForeground: 'secondary-foreground', card: 'card', accent: 'accent', border: 'border' } as const;
  for (const key of Object.keys(names) as (keyof typeof names)[]) {
    values['--' + names[key]] = hexToHsl(theme?.[key]) || defaultColors[key];
  }
  if (theme?.foreground && hexToHsl(theme.foreground)) {
    for (const name of ['muted-foreground', 'card-foreground', 'popover-foreground']) values['--' + name] = hexToHsl(theme.foreground)!;
  }
  if (values['--primary']) values['--ring'] = values['--primary'];
  if (values['--border']) values['--input'] = values['--border'];
  values['--cms-heading-font'] = Object.prototype.hasOwnProperty.call(fontFamilies, theme?.headingFont || '') ? fontFamilies[theme!.headingFont!] : fontFamilies['Playfair Display'];
  values['--cms-body-font'] = Object.prototype.hasOwnProperty.call(fontFamilies, theme?.bodyFont || '') ? fontFamilies[theme!.bodyFont!] : fontFamilies.Lato;
  if (typeof theme?.radius === 'number') values['--radius'] = `${Math.max(0, Math.min(40, theme.radius))}px`;
  values['--cms-width'] = `${Math.max(720, Math.min(1600, theme?.contentWidth || 1280))}px`;
  values['--cms-button-radius'] = ['pill', 'rounded-full'].includes(theme?.buttonStyle || '') ? '999px'
    : ['square', 'rounded-none'].includes(theme?.buttonStyle || '') ? '0px'
    : theme?.buttonStyle === 'rounded-lg' ? '8px' : 'var(--radius)';
  return values;
}
