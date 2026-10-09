import type { ReactNode } from 'react';
import ResponsiveImage from '@/components/ResponsiveImage';

export default function PageShell({ label, title, children, image }: { label: string; title: ReactNode; children: ReactNode; image?: { src: string; alt: string } }) {
  return <main className="page"><div className={`page-hero${image ? ' page-hero-with-image' : ''}`}><div className="page-hero-copy"><div className="section-label">{label}</div><h1>{title}</h1></div>{image && <div className="page-hero-image"><ResponsiveImage src={image.src} alt={image.alt}/></div>}</div><div className="page-body">{children}</div></main>;
}
