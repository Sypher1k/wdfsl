import type { ReactNode } from 'react';

export default function PageShell({ label, title, children }: { label: string; title: ReactNode; children: ReactNode }) {
  return <main className="page"><div className="page-hero"><div className="section-label">{label}</div><h1>{title}</h1></div><div className="page-body">{children}</div></main>;
}
