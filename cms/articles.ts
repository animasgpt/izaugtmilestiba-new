import type { CmsArticle, CmsPage, SiteSnapshot } from './model';
const cleanId = (id: string) => id.replace(/^drafts\./, '');
function baseSlug(article: CmsArticle) {
  const slug = article.slug?.current || article.title || 'raksts';
  return slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'raksts';
}
export function withArticlePages(snapshot: SiteSnapshot): SiteSnapshot {
  const articles = (snapshot.articles || []).map(article => ({ ...article, _id: cleanId(article._id) }));
  if (!articles.length || !snapshot.pages.some(page => page._id === 'page-articles')) return snapshot;
  const pages: CmsPage[] = articles.map(article => {
    const base = baseSlug(article);
    const duplicate = articles.filter(item => baseSlug(item) === base).length > 1 || snapshot.pages.some(page => page.parent?._ref === 'page-articles' && page.slug?.current === base);
    const slug = duplicate ? `${base}-${cleanId(article._id).toLowerCase().replace(/[^a-z0-9-]/g, '-')}` : base;
    return { _id: cleanId(article._id), _type: 'page', sourceType: 'article', title: article.title,
      slug: { current: slug }, parent: { _ref: 'page-articles' }, seo: { title: article.title, description: article.excerpt, image: article.coverImage },
      sections: [
        { _type: article.coverImage ? 'heroSection' : 'textSection', _key: 'article-intro', title: article.title, subtitle: article.excerpt, eyebrow: [article.category, article.publishedAt && Number.isFinite(Date.parse(article.publishedAt)) ? new Date(article.publishedAt).toLocaleDateString('lv-LV') : ''].filter(Boolean).join(' · '),
          image: article.coverImage, layout: 'split', style: { padding: 'large', width: 'normal' } },
        { _type: 'textSection', _key: 'article-body', body: article.body, style: { width: 'narrow', padding: 'medium' },
          buttons: article.sourceUrl ? [{ label: article.sourceLinkLabel || 'Lasīt oriģinālo rakstu', kind: 'url', href: article.sourceUrl, newTab: true, variant: 'outline' }] : undefined },
      ] };
  });
  return { ...snapshot, articles, pages: [...snapshot.pages.filter(page => page.sourceType !== 'article'), ...pages] };
}
