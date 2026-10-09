import Link from 'next/link';

export default function Footer() {
  return <footer>
    <div className="footer-main">
      <div><div className="footer-brand">WDF</div><h2>Women.<br/><em>Families.</em><br/>Communities.</h2></div>
      <div className="footer-links">
        <div><b>Explore</b><Link href="/about">About Us</Link><Link href="/what-we-do">What We Do</Link><Link href="/impact">Our Impact</Link><Link href="/projects">Projects</Link><Link href="/gallery">Gallery</Link></div>
        <div><b>Resources</b><Link href="/publications">Publications</Link><Link href="/news-media">News & Media</Link><Link href="/financials">Financials</Link><Link href="/contact">Contact Us</Link></div>
      </div>
    </div>
    <div className="footer-bottom"><span>Women’s Development Federation · Hambantota, Sri Lanka</span><span>047-2220499 · 047-2221022 · hwdf94@yahoo.com</span></div>
  </footer>;
}
