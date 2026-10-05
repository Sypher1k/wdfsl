import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText } from 'next-sanity';
import PageShell from '@/components/PageShell';
import Arrow from '@/components/Arrow';
import { client } from '@/sanity/lib/client';
import { NEWS_ARTICLE_QUERY, NEWS_LIST_QUERY } from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';

export const revalidate=60;

type Props={params:Promise<{slug:string}>};

export async function generateStaticParams(){
 if(!client) return [];
 const posts=await client.fetch(NEWS_LIST_QUERY);
 return posts.map(post=>({slug:post.slug.current}));
}

export async function generateMetadata({params}:Props):Promise<Metadata>{
 if(!client) return {title:'News & Media'};
 const {slug}=await params; const article=await client.fetch(NEWS_ARTICLE_QUERY,{slug});
 if(!article) return {title:'News & Media'};
 return {title:article.title,description:article.excerpt||undefined,openGraph:{title:article.title,description:article.excerpt||undefined,type:'article'}};
}

function formatDate(value?:string){return value?new Intl.DateTimeFormat('en-LK',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(value)):''}

export default async function NewsArticlePage({params}:Props){
 if(!client) notFound();
 const {slug}=await params; const article=await client.fetch(NEWS_ARTICLE_QUERY,{slug}); if(!article) notFound();
 const image=article.mainImage?.asset?urlForImage(article.mainImage)?.width(1800).height(1100).fit('crop').url():null;
 return <PageShell label={`${article.category||'NEWS'}${article.publishedAt?` · ${formatDate(article.publishedAt)}`:''}`} title={<>{article.title}</>}>
   <article className="article-page">
     {image&&<div className="article-hero-image"><Image src={image} alt={article.mainImage?.alt||article.title} fill priority sizes="(max-width: 900px) 100vw, 1100px"/></div>}
     <div className="article-layout"><aside><Link className="text-link" href="/news-media"><Arrow/> Back to News &amp; Media</Link>{article.author&&<p><strong>By</strong><br/>{article.author}</p>}</aside><div className="article-content">{article.excerpt&&<p className="article-lead">{article.excerpt}</p>}{article.body&&<PortableText value={article.body}/>}</div></div>
   </article>
 </PageShell>
}
