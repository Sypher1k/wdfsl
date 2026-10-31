'use client';

import { useEffect, useRef, useState } from 'react';
import type { MonthlyReport } from './ProfitabilityAnalytics';

const count = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

export default function MembershipAnalytics({ reports, branchName }: { reports: MonthlyReport[]; branchName?: string }) {
  const [selectedFile, setSelectedFile] = useState(reports[0]?.sourceFile ?? '');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [branchQuery, setBranchQuery] = useState('');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const report = reports.find((item) => item.sourceFile === selectedFile) ?? reports[0]!;
  const selectedBranchData = report.branches.find((branch) => branch.name === selectedBranch);
  const membership = selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.membership : report.membership;
  const visibleBranches = report.branches
    .filter((branch) => branch.name.toLowerCase().includes(branchQuery.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
  useEffect(() => {
    const closeIfOutside = (event: MouseEvent) => {
      if (event.target instanceof Node && !branchDropdownRef.current?.contains(event.target)) setBranchDropdownOpen(false);
    };
    document.addEventListener('mousedown', closeIfOutside);
    return () => document.removeEventListener('mousedown', closeIfOutside);
  }, []);
  const selectBranch = (branchName: string) => {
    setSelectedBranch(branchName);
    setBranchQuery('');
    setBranchDropdownOpen(false);
  };
  const stats = [
    ['Total Members', membership.totalMembers],
    ['Savings Members', membership.savingsMembers],
    ['A-Type Members', membership.aTypeMembers],
    ['500 Shares Completed', membership.sharesCompleted],
    ['Total Number of Groups', membership.totalGroups],
    ['A Group Count', membership.aGroupCount],
    ['Active Group Count', membership.activeGroupCount],
    ["Total Women's Societies", membership.totalSocieties],
    ['A Society Count', membership.aSocietyCount],
    ['B Society Count', membership.bSocietyCount],
  ] as const;

  return (
    <section className="membership-analytics" aria-labelledby="membership-analytics-title">
      <div className="membership-heading">
        <div>
          <div className="section-label">MEMBERSHIP & SOCIETIES · {report.reportMonth}</div>
          <h2 id="membership-analytics-title">Membership &amp; Society Overview</h2>
        </div>
        <div className="loan-filters membership-filters">
        <label className="profit-month-filter">Month
          <select value={report.sourceFile} onChange={(event) => { setSelectedFile(event.target.value); setSelectedBranch('all'); setBranchQuery(''); setBranchDropdownOpen(false); }} aria-label="Filter membership statistics by month">
            {reports.map((item) => <option key={item.sourceFile} value={item.sourceFile}>{item.reportMonth}</option>)}
          </select>
        </label>
        {!branchName && <div className="loan-branch-filter" ref={branchDropdownRef}>
          <span className="loan-filter-label">Branch</span>
          <button className="loan-branch-trigger" type="button" aria-haspopup="listbox" aria-expanded={branchDropdownOpen} aria-label={`Membership branch filter: ${selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.name : 'All Branches'}`} onClick={() => { setBranchDropdownOpen((open) => !open); setBranchQuery(''); }}>
            <span>{selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.name : 'All Branches'}</span><span aria-hidden="true">⌄</span>
          </button>
          {branchDropdownOpen && <div className="loan-branch-menu">
            <label className="loan-branch-menu-search"><span className="visually-hidden">Search branches</span><input autoFocus type="search" value={branchQuery} onChange={(event) => setBranchQuery(event.target.value)} placeholder="Type to filter branches" onKeyDown={(event) => {
              if (event.key === 'Escape') setBranchDropdownOpen(false);
              if (event.key === 'Enter') { event.preventDefault(); selectBranch(branchQuery ? visibleBranches[0]?.name ?? 'all' : 'all'); }
            }} /></label>
            <div className="loan-branch-options" role="listbox" aria-label="Available branches">
              <button type="button" role="option" aria-selected={selectedBranch === 'all'} className={selectedBranch === 'all' ? 'selected' : ''} onClick={() => selectBranch('all')}>All Branches</button>
              {visibleBranches.map((branch) => <button type="button" role="option" aria-selected={selectedBranch === branch.name} className={selectedBranch === branch.name ? 'selected' : ''} key={branch.name} onClick={() => selectBranch(branch.name)}>{branch.name}</button>)}
              {visibleBranches.length === 0 && <span className="loan-branch-empty">No branches match.</span>}
            </div>
          </div>}
        </div>}
        </div>
      </div>
      <div className="membership-metrics">
        {stats.map(([label, value]) => <article className="membership-metric" key={label}>
          <span>{label}</span>
          <strong>{value === null ? 'Data unavailable' : count.format(value)}</strong>
        </article>)}
      </div>
      <p className="membership-source">Source: {report.sourceFile}. Counts sum the numbered branch rows; blank and dash entries are excluded rather than treated as zero. The CSV repeats the “A Group Count” header; the first occurrence is used.</p>
    </section>
  );
}
