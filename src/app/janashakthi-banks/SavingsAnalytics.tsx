'use client';

import { useEffect, useRef, useState } from 'react';
import type { MonthlyReport } from './ProfitabilityAnalytics';

const number = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

export default function SavingsAnalytics({ reports }: { reports: MonthlyReport[] }) {
  const [selectedFile, setSelectedFile] = useState(reports[0]?.sourceFile ?? '');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [branchQuery, setBranchQuery] = useState('');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const report = reports.find((item) => item.sourceFile === selectedFile) ?? reports[0]!;
  const selectedBranchData = report.branches.find((branch) => branch.name === selectedBranch);
  const metrics = selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.savings : report.savings;
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

  return (
    <section className="savings-analytics" aria-labelledby="savings-analytics-title">
      <div className="savings-heading">
        <div>
          <div className="section-label">MONTHLY SAVINGS · {report.reportMonth}</div>
          <h2 id="savings-analytics-title">Savings</h2>
        </div>
        <div className="loan-filters">
          <label className="profit-month-filter">Month
            <select value={report.sourceFile} onChange={(event) => { setSelectedFile(event.target.value); setSelectedBranch('all'); setBranchQuery(''); setBranchDropdownOpen(false); }} aria-label="Filter savings metrics by month">
              {reports.map((item) => <option key={item.sourceFile} value={item.sourceFile}>{item.reportMonth}</option>)}
            </select>
          </label>
          <div className="loan-branch-filter" ref={branchDropdownRef}>
            <span className="loan-filter-label">Branch</span>
            <button className="loan-branch-trigger" type="button" aria-haspopup="listbox" aria-expanded={branchDropdownOpen} aria-label={`Savings branch filter: ${selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.name : 'All Branches'}`} onClick={() => { setBranchDropdownOpen((open) => !open); setBranchQuery(''); }}>
              <span>{selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.name : 'All Branches'}</span><span aria-hidden="true">⌄</span>
            </button>
            {branchDropdownOpen && <div className="loan-branch-menu">
              <label className="loan-branch-menu-search"><span className="visually-hidden">Search branches</span><input autoFocus type="search" value={branchQuery} onChange={(event) => setBranchQuery(event.target.value)} placeholder="Type to filter branches" onKeyDown={(event) => {
                if (event.key === 'Escape') setBranchDropdownOpen(false);
                if (event.key === 'Enter') {
                  event.preventDefault();
                  selectBranch(branchQuery ? visibleBranches[0]?.name ?? 'all' : 'all');
                }
              }} /></label>
              <div className="loan-branch-options" role="listbox" aria-label="Available branches">
                <button type="button" role="option" aria-selected={selectedBranch === 'all'} className={selectedBranch === 'all' ? 'selected' : ''} onClick={() => selectBranch('all')}>All Branches</button>
                {visibleBranches.map((branch) => <button type="button" role="option" aria-selected={selectedBranch === branch.name} className={selectedBranch === branch.name ? 'selected' : ''} key={branch.name} onClick={() => selectBranch(branch.name)}>{branch.name}</button>)}
                {visibleBranches.length === 0 && <span className="loan-branch-empty">No branches match.</span>}
              </div>
            </div>}
          </div>
        </div>
      </div>
      <p className="loan-selection">Showing savings statistics for <strong>{selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.name : 'All Branches'}</strong>.</p>
      <div className="savings-metrics">
        <article className="savings-metric"><span>Total Savings Amount</span><strong>{metrics.totalSavingsAmount === null ? 'Data unavailable' : number.format(metrics.totalSavingsAmount)}</strong></article>
        <article className="savings-metric"><span>Savings Members</span><strong>{metrics.savingsMembers === null ? 'Data unavailable' : number.format(metrics.savingsMembers)}</strong></article>
      </div>
      <p className="savings-source">Source: {report.sourceFile}. All-branch totals sum reported branch values; blank and dash entries are excluded rather than treated as zero. Currency is not specified in the source.</p>
    </section>
  );
}
