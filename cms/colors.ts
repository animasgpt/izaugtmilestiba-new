import type { SiteSettings } from './model';

// Exact existing website tokens, shared with Studio so an unset field has
// the same meaning in the editor and the public renderer.
export const defaultColors = {
  background: '60 4% 95%', foreground: '24 9% 10%', primary: '37 92% 50%',
  primaryForeground: '47 100% 96%', secondary: '24 5% 44%', secondaryForeground: '60 9% 97%',
  card: '60 9% 97%', accent: '47 100% 96%', border: '23 5% 82%',
} as const;
export function hexToHsl(hex?: string): string | undefined {
  if (!hex || !/^#[\da-f]{6}$/i.test(hex)) return undefined;
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = d === 0 ? 0 : max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return `${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}
function tokenToHex(token: string): string {
  const [h, s, l] = token.split(' ').map((n, i) => parseFloat(n) / (i ? 100 : 1));
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255).toString(16).padStart(2, '0');
  };
  return '#' + channel(0) + channel(8) + channel(4);
}
export function inheritedColor(settings: SiteSettings, path: readonly unknown[]): string | undefined {
  const roots = { primaryColor: 'primary', accentColor: 'accent', backgroundColor: 'background', textColor: 'foreground' } as const;
  let key: keyof typeof defaultColors | undefined;
  if (path.length === 1 && Object.prototype.hasOwnProperty.call(roots, String(path[0]))) key = roots[String(path[0]) as keyof typeof roots];
  else if (path[0] === 'theme' && Object.prototype.hasOwnProperty.call(defaultColors, String(path[1]))) key = path[1] as keyof typeof defaultColors;
  else if (path[0] === 'header') key = path[1] === 'backgroundColor' ? 'background' : path[1] === 'textColor' ? 'foreground' : undefined;
  else if (path[0] === 'footer') key = path[1] === 'backgroundColor' ? 'card' : path[1] === 'textColor' ? 'foreground' : undefined;
  if (!key) return undefined;
  const rootKey = (Object.keys(roots) as (keyof typeof roots)[]).find(name => roots[name] === key);
  const override = rootKey && path[0] !== rootKey ? settings[rootKey] : undefined;
  const legacy = settings.theme?.[key];
  return (hexToHsl(override) ? override : undefined) || (hexToHsl(legacy) ? legacy : undefined) || tokenToHex(defaultColors[key]);
}
