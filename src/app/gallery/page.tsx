import Image from 'next/image'; import PageShell from '@/components/PageShell'; import {galleryImages} from '@/lib/site';
export const metadata={title:'Gallery'};
export default function GalleryPage(){return <PageShell label="GALLERY" title={<>People, place and <em>purpose.</em></>}><div className="gallery">{galleryImages.map(([src,alt],i)=><div key={src} className={`gallery-item g${i+1}`}><Image src={src} alt={alt} fill sizes="(max-width: 600px) 50vw, 60vw"/></div>)}</div></PageShell>}
