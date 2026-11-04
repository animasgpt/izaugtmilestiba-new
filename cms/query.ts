// Shared by the deployment snapshot and browser refresh: published content only.
export const SITE_QUERY = `{
  "settings": coalesce(*[_id == "siteSettings"][0], *[_type == "siteSettings"] | order(_createdAt asc)[0]),
  "pages": *[_type == "page"] | order(_id asc),
  "articles": *[_type == "article"] | order(publishedAt desc){
    _id, _type, title, slug, excerpt, coverImage, category, publishedAt, sourceUrl, sourceLinkLabel
  }
}`;

export const ARTICLE_QUERY = '*[_type == "article" && _id == $id][0]';
