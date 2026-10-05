'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  ['About Us','/about'], ['What We Do','/what-we-do'], ['Janashakthi Banks','/janashakthi-banks'],
  ['Our Impact','/impact'], ['Projects','/projects'], ['Publications','/publications'], ['News & Media','/news-media'],
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className={`nav ${open ? 'open' : ''}`}>
    <div className="nav-inner">
      <Link className="brand" href="/" onClick={() => setOpen(false)}><span>WDF</span><small>Women’s Development<br/>Federation · Hambantota</small></Link>
      <nav aria-label="Primary navigation">
        {links.map(([label, href]) => <Link key={href} href={href} className={pathname === href || pathname.startsWith(`${href}/`) ? 'active' : ''} onClick={() => setOpen(false)}>{label}</Link>)}
      </nav>
      <div className="nav-right"><Link href="/contact" className="nav-contact">Contact</Link><button className="menu" aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>{open ? '×' : '☰'}</button></div>
    </div>
  </header>;
}
