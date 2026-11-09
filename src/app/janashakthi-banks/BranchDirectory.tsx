import Link from 'next/link';
import { branchSlug, readBranches } from './reportData';

export default function BranchDirectory() {
  const districts = readBranches().reduce<Map<string, Map<string, { name: string }[]>>>((groups, branch) => {
    const divisions = groups.get(branch.district) ?? new Map<string, { name: string }[]>();
    const branches = divisions.get(branch.division) ?? [];
    branches.push({ name: branch.name });
    divisions.set(branch.division, branches);
    groups.set(branch.district, divisions);
    return groups;
  }, new Map());

  return <section className="bank-branch-directory" aria-labelledby="bank-branch-directory-title">
    <div className="section-label">JANASHAKTHI NETWORK</div>
    <h2 id="bank-branch-directory-title">Explore bank branches</h2>
    <p>Choose a branch to view its profitability, loans, savings and membership reports.</p>
    <div className="bank-branch-districts">{[...districts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([district, divisions]) => <section className="bank-branch-district" key={district} aria-labelledby={`district-${branchSlug(district)}`}>
      <h3 id={`district-${branchSlug(district)}`}>{district} District</h3>
      {[...divisions.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([division, branches]) => <div className="bank-branch-division" key={division}>
        <h4>{division} Division</h4>
        <div className="bank-branch-links">{branches.map(({ name }) => <Link href={`/janashakthi-banks/${branchSlug(name)}`} key={name}>{name}<span aria-hidden="true">↗</span></Link>)}</div>
      </div>)}
    </section>)}</div>
  </section>;
}
