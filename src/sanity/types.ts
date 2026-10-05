import type { PortableTextBlock } from '@portabletext/types';

export interface SanitySlug {
  current: string;
}

export interface SanityImage {
  asset?: { _ref?: string; _type?: string } | null;
  alt?: string;
}

export type NewsCategory = 'News' | 'Events' | 'Announcements' | 'Media' | string;

export interface NewsListItem {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt?: string;
  category?: NewsCategory;
  featured?: boolean;
  mainImage?: SanityImage;
}

export interface NewsArticle extends NewsListItem {
  author?: string;
  body?: PortableTextBlock[];
}
