import { describe, expect, it } from 'vitest';
import { defaultColors, inheritedColor, hexToHsl } from '../../cms/colors';
import { themeVariables } from '../lib/cmsTheme';
describe('editor colors match the public website', () => {
  it('shows existing non-white defaults for unset global fields', () => {
    const primary = inheritedColor({}, ['primaryColor']);
    const background = inheritedColor({}, ['backgroundColor']);
    expect(primary).toMatch(/^#[a-f0-9]{6}$/);
    expect(primary).not.toBe('#ffffff');
    expect(background).not.toBe('#ffffff');
    expect(themeVariables(undefined)['--primary']).toBe(defaultColors.primary);
    expect(themeVariables(undefined)['--background']).toBe(defaultColors.background);
    expect(hexToHsl(primary)).toMatch(/^37\./);
  });
  it('inherits saved theme values and draft global overrides for header/footer', () => {
    const settings = { primaryColor: '#123456', backgroundColor: '#abcdef', textColor: '#112233', theme: { primary: '#ff0000', card: '#eeeeee' } };
    expect(inheritedColor(settings, ['primaryColor'])).toBe('#ff0000');
    expect(inheritedColor(settings, ['header', 'backgroundColor'])).toBe('#abcdef');
    expect(inheritedColor(settings, ['footer', 'textColor'])).toBe('#112233');
    expect(inheritedColor(settings, ['footer', 'backgroundColor'])).toBe('#eeeeee');
    expect(inheritedColor(settings, ['pageBuilder', { _key: 'hero' }, 'style', 'backgroundColor'])).toBeUndefined();
    expect(inheritedColor({}, ['constructor'])).toBeUndefined();
  });
});
