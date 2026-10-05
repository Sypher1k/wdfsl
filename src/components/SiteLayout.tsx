import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <><Navbar /><div>{children}</div><Footer /></>;
}
