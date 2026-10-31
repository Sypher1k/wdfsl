import Link from 'next/link';
import { branchSlug, readBranchNames } from './reportData';

export default function BranchDirectory() {
  return <section className="bank-branch-directory" aria-labelledby="bank-branch-directory-title">
    <div className="section-label">JANASHAKTHI NETWORK</div>
    <h2 id="bank-branch-directory-title">Explore bank branches</h2>
    <p>Choose a branch to view its profitability, loans, savings and membership reports.</p>
    <div className="bank-branch-links">{readBranchNames().map((name) => <Link href={`/janashakthi-banks/${branchSlug(name)}`} key={name}>{name}<span aria-hidden="true">↗</span></Link>)}</div>
  </section>;
}
