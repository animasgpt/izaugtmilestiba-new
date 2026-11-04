import { describe, expect, it } from 'vitest';
import { builderUpgrade } from '../../cms/upgrade';
import { normalizeSnapshot } from '../../cms/normalize';
import { googleFontsUrl } from '../../cms/design';
import { themeVariables } from '../lib/cmsTheme';
import { defaultSnapshot } from '../../cms/defaults';

describe('compatible design builder upgrade', () => {
  it('copies sections and theme without changing legacy values and can be repeated safely', () => {
    const original = structuredClone(defaultSnapshot);
    const before = JSON.stringify(original);
    const page = original.pages[0];
    const pagePatch = builderUpgrade(page);
    expect(pagePatch.pageBuilder).toEqual(page.sections);
    expect(builderUpgrade({ ...page, ...pagePatch })).toEqual({});
    const settingsPatch = builderUpgrade({ ...original.settings!, _type: 'siteSettings' });
    expect(settingsPatch.fontHeading).toBe(original.settings!.theme!.headingFont);
    expect(builderUpgrade({ ...original.settings!, ...settingsPatch, _type: 'siteSettings' })).toEqual({});
    expect(JSON.stringify(original)).toBe(before);
  });
  it('preserves edited new values and an intentionally empty builder', () => {
    const snapshot = structuredClone(defaultSnapshot);
    snapshot.pages[0].pageBuilder = [];
    snapshot.settings = { ...snapshot.settings!, _type: 'siteSettings', fontHeading: 'Lora', primaryColor: '#123456', buttonStyle: 'rounded-full' };
    expect(builderUpgrade(snapshot.pages[0])).toEqual({});
    const settingsPatch = builderUpgrade(snapshot.settings);
    expect(settingsPatch).not.toHaveProperty('fontHeading');
    expect(settingsPatch).not.toHaveProperty('primaryColor');
    const normalized = normalizeSnapshot(snapshot);
    expect(normalized.pages[0].sections).toEqual([]);
    expect(normalized.settings!.theme!.headingFont).toBe('Lora');
    expect(normalized.settings!.theme!.primary).toBe('#123456');
    expect(themeVariables(normalized.settings!.theme)['--cms-button-radius']).toBe('999px');
  });
  it('loads only approved Google fonts and rejects arbitrary CSS / inherited object keys', () => {
    const url = googleFontsUrl('Cormorant Garamond', 'Plus Jakarta Sans');
    expect(url).toContain('Cormorant+Garamond');
    expect(url).toContain('Plus+Jakarta+Sans');
    expect(googleFontsUrl('Georgia', 'Lato')).not.toContain('600');
    expect(googleFontsUrl('Georgia', 'Arial')).toBeUndefined();
    expect(googleFontsUrl('constructor', 'invalid;font')).toBeUndefined();
    expect(themeVariables({ headingFont: 'constructor' })['--cms-heading-font']).toContain('Playfair Display');
  });
});
