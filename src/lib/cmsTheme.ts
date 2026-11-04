import type { SiteSettings } from '../../cms/model';
import { fontFamilies } from '../../cms/design';

export function hexToHsl(hex?: string): string | undefined {
  if (!hex || !/^#[\da-f]{6}$/i.test(hex)) return undefined;
  const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = rgb;
  const max = Math.max(...rgb), min = Math.min(...rgb), d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = d === 0 ? 0 : max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return `${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}
export function themeVariables(theme: SiteSettings['theme']): Record<string, string> {
  const values: Record<string, string> = {};
  const names = { background: 'background', foreground: 'foreground', primary: 'primary', primaryForeground: 'primary-foreground',
    secondary: 'secondary', secondaryForeground: 'secondary-foreground', card: 'card', accent: 'accent', border: 'border' } as const;
  for (const key of Object.keys(names) as (keyof typeof names)[]) {
    const hsl = hexToHsl(theme?.[key]);
    if (hsl) values['--' + names[key]] = hsl;
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
