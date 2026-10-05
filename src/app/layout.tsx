import type { Metadata } from 'next';
import SiteLayout from '@/components/SiteLayout';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://wdfsl.org'),
  title: { default: "Women's Development Federation | Hambantota", template: "%s | Women's Development Federation" },
  description: "Women's Development Federation, Hambantota — women, families and communities through economic and social development.",
  keywords: ['Women’s Development Federation', 'WDF Hambantota', 'Sri Lanka', 'Janashakthi Banks', 'women empowerment'],
  openGraph: { title: "Women's Development Federation | Hambantota", description: 'Women. Families. Communities.', type: 'website', locale: 'en_LK' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteLayout>{children}</SiteLayout></body></html>;
}
