import Image from 'next/image';

export default function ResponsiveImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 50vw" className={className} />;
}
