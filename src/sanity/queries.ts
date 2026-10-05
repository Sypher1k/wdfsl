import { defineQuery } from 'next-sanity';
export const NEWS_LIST_QUERY = defineQuery(`*[_type == "newsArticle" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) { _id, title, slug, excerpt, publishedAt, category, featured, mainImage { asset, alt } }`);
export const FEATURED_NEWS_QUERY = defineQuery(`*[_type == "newsArticle" && featured == true && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc)[0...3] { _id, title, slug, excerpt, publishedAt, category, mainImage { asset, alt } }`);
export const NEWS_ARTICLE_QUERY = defineQuery(`*[_type == "newsArticle" && slug.current == $slug][0] { _id, title, slug, excerpt, publishedAt, category, author, mainImage { asset, alt }, body }`);
