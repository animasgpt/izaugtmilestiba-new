import { withArticlePages } from '../../cms/articles';
import { describe, expect, it } from 'vitest';
import { pagePath, linkHref, safeHref } from '../../cms/routing';
import { hexToHsl, themeVariables } from '../lib/cmsTheme';
import type { CmsPage } from '../../cms/model';
const page = (id: string, slug: string, parent?: string): CmsPage => ({ _id: id, _type: 'page', title: id, slug: { current: slug }, parent: parent ? { _ref: parent } : undefined });
describe('CMS page addresses and links', () => {
  it('supports arbitrary nested pages and updates reference links when a parent is renamed', () => {
    const pages = [page('services', 'pakalpojumi'), page('child', 'konsultacijas', 'services'), page('detail', 'attalinati', 'child')];
    expect(pagePath(pages[2], pages)).toBe('/pakalpojumi/konsultacijas/attalinati');
    pages[0].slug.current = 'atbalsts';
    expect(linkHref({ kind: 'page', page: { _ref: 'detail' }, anchor: 'contact' }, pages)).toBe('/atbalsts/konsultacijas/attalinati#contact');
  });
  it('does not route orphaned, invalid, or cyclic pages', () => {
    const pages = [page('a', 'a', 'b'), page('b', 'b', 'a'), page('orphan', 'x', 'missing'), page('bad', '../admin')];
    for (const item of pages) expect(pagePath(item, pages)).toBeNull();
  });
  it('allows home as a parent and keeps the home address fixed', () => {
    const pages = [page('page-home', 'ignored'), page('child', 'kontakti', 'page-home')];
    expect(pagePath(pages[0], pages)).toBe('/');
    expect(pagePath(pages[1], pages)).toBe('/kontakti');
  });
  it.each(['javascript:alert(1)', 'data:text/html,test', '//evil.test', '/\\evil.test', ' https://example.test', 'java\nscript:alert(1)', 'https://good.test\u0000'])('rejects unsafe link %s', href => {
    expect(safeHref(href)).toBeUndefined();
  });
  it.each(['/par-mani', '/#contact', 'https://example.test/path', 'mailto:a@example.test', 'tel:+37112345678'])('allows editorial link %s', href => {
    expect(safeHref(href)).toBe(href);
  });
});
describe('editable website theme', () => {
  it('converts editor-selected HEX colors and rejects arbitrary CSS', () => {
    expect(hexToHsl('#ffffff')).toBe('0.0 0.0% 100.0%');
    expect(hexToHsl('#ff0000')).toBe('0.0 100.0% 50.0%');
    expect(hexToHsl('red;background:url(x)')).toBeUndefined();
    const vars = themeVariables({ primary: '#ff0000', headingFont: 'Georgia', radius: 200, contentWidth: 3000, buttonStyle: 'pill' });
    expect(vars['--primary']).toBe('0.0 100.0% 50.0%');
    expect(vars['--cms-heading-font']).toBe('Georgia, serif');
    expect(vars['--radius']).toBe('40px');
    expect(vars['--cms-width']).toBe('1600px');
    expect(vars['--cms-button-radius']).toBe('999px');
  });
});

describe('existing Sanity article compatibility', () => {
  it('gives duplicate legacy slugs unique routes and follows the collection address', () => {
    const source = { settings: null, pages: [page('page-articles', 'padomi')], articles: [
      { _id: 'first', _type: 'article' as const, title: 'Pirmais', slug: { current: 'viens' } },
      { _id: 'second', _type: 'article' as const, title: 'Otrais', slug: { current: 'viens' } },
    ] };
    const result = withArticlePages(source);
    expect(pagePath(result.pages[1], result.pages)).toBe('/padomi/viens-first');
    expect(pagePath(result.pages[2], result.pages)).toBe('/padomi/viens-second');
    expect(source.pages).toHaveLength(1);
    expect(withArticlePages(result).pages).toHaveLength(3);
  });
  it('normalizes a draft article id for preview links without exposing a draft through public fetching', () => {
    const result = withArticlePages({ settings: null, pages: [page('page-articles', 'raksti')], articles: [
      { _id: 'drafts.example', _type: 'article', title: 'Mīlestībā', slug: { current: 'mīlestībā' } },
    ] });
    expect(result.articles[0]._id).toBe('example');
    expect(pagePath(result.pages[1], result.pages)).toBe('/raksti/milestiba');
  });
});
