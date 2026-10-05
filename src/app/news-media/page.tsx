import Link from 'next/link';
import Image from 'next/image';
import PageShell from '@/components/PageShell';
import Arrow from '@/components/Arrow';
import { client } from '@/sanity/lib/client';
import { NEWS_LIST_QUERY } from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';

export const metadata={title:'News & Media'};
export const revalidate=60;

function formatDate(value?:string){return value?new Intl.DateTimeFormat('en-LK',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(value)):''}

export default async function NewsMediaPage(){
 const articles=client?await client.fetch(NEWS_LIST_QUERY):[];
 return <PageShell label="NEWS & MEDIA" title={<>Updates from the <em>Federation.</em></>}>
   <div className="news-intro content-grid"><div><h3>News &amp; events</h3><p>A newsroom for official WDF announcements, programme updates, events, community activities and organizational milestones.</p></div><div><h3>Media resources</h3><p>Articles can include photographs, rich text, event information and official media resources, all managed from Sanity.</p></div></div>
   {articles.length===0 ? <div className="news-empty"><div className="section-label">OFFICIAL UPDATES</div><h3>Newsroom ready for publishing</h3><p>No published WDF articles are currently available in the connected Sanity dataset. Create a News Article in the Studio and it will appear here automatically.</p><Link className="btn light-btn" href="/studio">Open Sanity Studio <Arrow/></Link></div> : <div className="news-articles">{articles.map((article: any)=>{const image=article.mainImage?.asset?urlForImage(article.mainImage)?.width(1000).height(650).fit('crop').url():null; return <article className="news-card" key={article._id}>{image&&<Link href={`/news-media/${article.slug.current}`} className="news-card-image"><Image src={image} alt={article.mainImage?.alt||article.title} fill sizes="(max-width: 900px) 100vw, 33vw"/></Link>}<div className="news-card-body"><div className="news-meta"><span>{article.category||'News'}</span>{article.publishedAt&&<time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>}</div><h2><Link href={`/news-media/${article.slug.current}`}>{article.title}</Link></h2>{article.excerpt&&<p>{article.excerpt}</p>}<Link className="text-link" href={`/news-media/${article.slug.current}`}>Read article <Arrow/></Link></div></article>})}</div>}
 </PageShell>
}
