export const fontFamilies: Record<string, string> = {
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Cormorant Garamond': "'Cormorant Garamond', Georgia, serif",
  Inter: "'Inter', Arial, sans-serif", Montserrat: "'Montserrat', Arial, sans-serif",
  'Plus Jakarta Sans': "'Plus Jakarta Sans', Arial, sans-serif",
  Lora: "'Lora', Georgia, serif", Lato: "'Lato', Arial, sans-serif",
  'Open Sans': "'Open Sans', Arial, sans-serif", Georgia: 'Georgia, serif', Arial: 'Arial, sans-serif',
  'Source Code Pro': "'Source Code Pro', monospace",
};
export const fontOptions = Object.keys(fontFamilies).map(value => ({ title: value, value }));
export function googleFontsUrl(heading = 'Playfair Display', body = 'Lato'): string | undefined {
  const names = [...new Set([heading, body])].filter(name => Object.prototype.hasOwnProperty.call(fontFamilies, name) && !['Georgia', 'Arial'].includes(name)).sort();
  if (!names.length) return undefined;
  return `https://fonts.googleapis.com/css2?${names.map(name => `family=${encodeURIComponent(name).replace(/%20/g, '+')}:ital,wght@${name === 'Lato' ? '0,400;0,700;1,400;1,700' : '0,400;0,600;0,700;1,400;1,600'}`).join('&')}&display=swap`;
}
export const iconOptions = [
  { title: 'Bez ikonas', value: 'none' }, { title: 'Sirds', value: 'heart' }, { title: 'Zvaigzne', value: 'star' },
  { title: 'Lapiņa', value: 'leaf' }, { title: 'Saule', value: 'sun' }, { title: 'Cilvēki', value: 'users' },
  { title: 'Saruna', value: 'message' }, { title: 'Grāmata', value: 'book' }, { title: 'Atzīme', value: 'check' },
  { title: 'Mirdzums', value: 'sparkles' }, { title: 'Māja', value: 'home' }, { title: 'Vairogs', value: 'shield' },
];
