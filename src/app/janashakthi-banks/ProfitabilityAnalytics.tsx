'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type BranchProfit = {
  name: string;
  monthlyProfit: number | null;
  yearToDateProfit: number | null;
  loans: LoanMetrics;
  savings: SavingsMetrics;
  membership: MembershipMetrics;
};
export type LoanMetrics = {
  outstandingLoanAmount: number | null;
  numberOfBorrowers: number | null;
  monthlyLoanDisbursement: number | null;
  monthlyBorrowerCount: number | null;
  atRiskLoanAmount: number | null;
  parPercentage: number | null;
  totalArrearsLoanAmount: number | null;
  numberOfArrearsBorrowers: number | null;
};
export type SavingsMetrics = {
  totalSavingsAmount: number | null;
  savingsMembers: number | null;
};
export type MembershipMetrics = {
  totalMembers: number | null;
  savingsMembers: number | null;
  activeMembers: number | null;
  aTypeMembers: number | null;
  sharesCompleted: number | null;
  sharesIncomplete: number | null;
  totalGroups: number | null;
  aGroupCount: number | null;
  aPlusGroupCount: number | null;
  activeGroupCount: number | null;
  inactiveGroupCount: number | null;
  totalSocieties: number | null;
  aSocietyCount: number | null;
  bSocietyCount: number | null;
  seniorCitizensSocietyCount: number | null;
  seniorCitizenMemberCount: number | null;
  childrensSocietyCount: number | null;
  childrensSocietyMemberCount: number | null;
  modelHomeGardenCount: number | null;
  homeGardenDemonstrationCount: number | null;
  supportServicesMonthly: number | null;
  specialDayCelebrationsMonthly: number | null;
  creativeProgrammesMonthly: number | null;
  deviSocietyMemberCount: number | null;
  deviSocietyCount: number | null;
};
export type MonthlyReport = {
  branches: BranchProfit[];
  loans: LoanMetrics;
  savings: SavingsMetrics;
  membership: MembershipMetrics;
  reportMonth: string;
  sourceFile: string;
};

const money = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

function status(profit: number | null) {
  if (profit === null) return 'Data unavailable';
  if (profit > 0) return 'Profitable';
  if (profit < 0) return 'Loss-making';
  return 'Break-even';
}

export default function ProfitabilityAnalytics({ reports, summaryOnly = false }: { reports: MonthlyReport[]; summaryOnly?: boolean }) {
  const [chartMode, setChartMode] = useState<'all' | 'top10'>('all');
  const [branchQuery, setBranchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [selectedFile, setSelectedFile] = useState(reports[0]?.sourceFile ?? '');
  const activeReport = reports.find((report) => report.sourceFile === selectedFile) ?? reports[0]!;
  const { branches, reportMonth, sourceFile } = activeReport;

  const monthlyAvailable = useMemo(() => branches.filter((branch) => branch.monthlyProfit !== null), [branches]);
  const summary = useMemo(() => ({
    total: monthlyAvailable.reduce((sum, branch) => sum + branch.monthlyProfit!, 0),
    profitable: monthlyAvailable.filter((branch) => branch.monthlyProfit! > 0).length,
    loss: monthlyAvailable.filter((branch) => branch.monthlyProfit! < 0).length,
  }), [monthlyAvailable]);
  const yearToDateAvailable = useMemo(() => branches.filter((branch) => branch.yearToDateProfit !== null), [branches]);
  const yearToDateSummary = useMemo(() => ({
    total: yearToDateAvailable.reduce((sum, branch) => sum + branch.yearToDateProfit!, 0),
    profitable: yearToDateAvailable.filter((branch) => branch.yearToDateProfit! > 0).length,
    loss: yearToDateAvailable.filter((branch) => branch.yearToDateProfit! < 0).length,
  }), [yearToDateAvailable]);

  const profitBranches = useMemo(() => branches
    .filter((branch) => branch.monthlyProfit !== null && branch.monthlyProfit > 0)
    .sort((a, b) => b.monthlyProfit! - a.monthlyProfit!), [branches]);
  const lossBranches = useMemo(() => branches
    .filter((branch) => branch.monthlyProfit !== null && branch.monthlyProfit < 0)
    .sort((a, b) => a.monthlyProfit! - b.monthlyProfit!), [branches]);
  const shownProfitBranches = chartMode === 'top10' ? profitBranches.slice(0, 10) : profitBranches;
  const shownLossBranches = chartMode === 'top10' ? lossBranches.slice(0, 10) : lossBranches;
  const selectedBranchData = branches.find((branch) => branch.name === selectedBranch);
  const visibleBranches = useMemo(() => branches
    .filter((branch) => branch.name.toLowerCase().includes(branchQuery.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)), [branches, branchQuery]);
  const filteredBranches = useMemo(() => {
    const matching = selectedBranch === 'all' ? branches : branches.filter((branch) => branch.name === selectedBranch);
    return [...matching].sort((a, b) => {
      if (a.yearToDateProfit === null) return b.yearToDateProfit === null ? a.name.localeCompare(b.name) : 1;
      if (b.yearToDateProfit === null) return -1;
      return (a.yearToDateProfit - b.yearToDateProfit) * (sortDirection === 'asc' ? 1 : -1);
    });
  }, [branches, selectedBranch, sortDirection]);
  const yearToDateProfitBranches = filteredBranches
    .filter((branch) => branch.yearToDateProfit !== null && branch.yearToDateProfit > 0)
    .sort((a, b) => (b.yearToDateProfit! - a.yearToDateProfit!) * (sortDirection === 'desc' ? 1 : -1));
  const yearToDateLossBranches = filteredBranches
    .filter((branch) => branch.yearToDateProfit !== null && branch.yearToDateProfit < 0)
    .sort((a, b) => (a.yearToDateProfit! - b.yearToDateProfit!) * (sortDirection === 'desc' ? 1 : -1));
  const yearToDateOtherBranches = filteredBranches.filter((branch) => branch.yearToDateProfit === null || branch.yearToDateProfit === 0);
  const chartScale = Math.max(...monthlyAvailable.map((branch) => Math.abs(branch.monthlyProfit!)), 1);
  const yearToDateChartScale = Math.max(...yearToDateAvailable.map((branch) => Math.abs(branch.yearToDateProfit!)), 1);

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

  const renderChartRows = (shownBranches: BranchProfit[], positive: boolean) => (
    <div className="profit-chart" role="list" aria-label={`${shownBranches.length} ${positive ? 'profitable' : 'loss-making'} branches`}>
      {shownBranches.map((branch) => {
        const profit = branch.monthlyProfit!;
        const width = Math.abs(profit) / chartScale * 49;
        const value = money.format(profit);
        return <div className="profit-chart-row" role="listitem" key={branch.name}>
          <span className="profit-chart-name">{branch.name}</span>
          <div className="profit-chart-track" title={`${branch.name}: ${value}`} aria-label={`${branch.name}: ${value}`}>
            <span className="profit-chart-zero" />
            <span className={`profit-chart-bar ${positive ? 'positive' : 'negative'}`} style={{ width: `${width}%`, left: positive ? '50%' : `calc(50% - ${width}%)` }} />
          </div>
          <span className={`profit-chart-value ${positive ? '' : 'negative-text'}`} title={value}>{value}</span>
        </div>;
      })}
      {shownBranches.length === 0 && <p className="profit-chart-empty">No {positive ? 'profitable' : 'loss-making'} branches for this month.</p>}
    </div>
  );

  const renderYearToDateTable = (title: string, tableBranches: BranchProfit[]) => (
    <section className="profitability-table-column" aria-label={title}>
      <h4>{title} <span>({tableBranches.length})</span></h4>
      <div className="profit-chart" role="list" aria-label={`${tableBranches.length} ${title.toLowerCase()}`}>
        {tableBranches.map((branch) => {
          const profit = branch.yearToDateProfit!;
          const width = Math.abs(profit) / yearToDateChartScale * 49;
          const value = money.format(profit);
          const positive = profit > 0;
          return <div className="profit-chart-row" role="listitem" key={branch.name}>
            <span className="profit-chart-name">{branch.name}</span>
            <div className="profit-chart-track" title={`${branch.name}: ${value}`} aria-label={`${branch.name}: ${value}`}>
              <span className="profit-chart-zero" />
              <span className={`profit-chart-bar ${positive ? 'positive' : 'negative'}`} style={{ width: `${width}%`, left: positive ? '50%' : `calc(50% - ${width}%)` }} />
            </div>
            <span className={`profit-chart-value ${positive ? '' : 'negative-text'}`} title={value}>{value}</span>
          </div>;
        })}
        {tableBranches.length === 0 && <p className="profit-chart-empty">No branches in this group.</p>}
      </div>
    </section>
  );

  return (
    <section className="profitability" aria-labelledby="profitability-title">
      <div className="profitability-heading">
        <div>
          {/* <div className="section-label">BANK PERFORMANCE · {reportMonth}</div> */}
          
          <h2 id="profitability-title">Profitability Analytics</h2>
          <h3>{reportMonth}</h3>
        </div>
        <label className="profit-month-filter">Month
          <select value={sourceFile} onChange={(event) => { setSelectedFile(event.target.value); setSelectedBranch('all'); setBranchQuery(''); setBranchDropdownOpen(false); }} aria-label="Filter profitability by month">
            {reports.map((report) => <option key={report.sourceFile} value={report.sourceFile}>{report.reportMonth}</option>)}
          </select>
        </label>
      </div>
      <h4 className="pt-2">Branch results from the latest available monthly summary.</h4>
      <div className="profitability-summary" aria-label="Monthly profit summary">
        <article className="profitability-card"><span>Total Monthly Profit</span><strong>{money.format(summary.total)}</strong></article>
        <article className="profitability-card"><span>Profitable Branches</span><strong>{money.format(summary.profitable)}</strong></article>
        <article className="profitability-card"><span>Branches Making a Loss</span><strong>{money.format(summary.loss)}</strong></article>
      </div>

      {!summaryOnly && <section className="profitability-panel" aria-labelledby="branch-chart-title">
        <div className="profitability-panel-heading">
          <div><h3 id="branch-chart-title">Profit and loss by bank branch</h3><p>Monthly results · profits and losses ranked by amount</p></div>
          <div className="profit-chart-controls">
            <div className="profitability-toggle" aria-label="Branches shown">
              <button type="button" aria-pressed={chartMode === 'all'} onClick={() => setChartMode('all')}>All branches</button>
              <button type="button" aria-pressed={chartMode === 'top10'} onClick={() => setChartMode('top10')}>Top 10</button>
            </div>
          </div>
        </div>
        <div className="profit-chart-columns">
          <section className="profit-chart-column" aria-labelledby="profit-chart-title">
            <h4 id="profit-chart-title">Profitable branches <span>({profitBranches.length})</span></h4>
            {renderChartRows(shownProfitBranches, true)}
          </section>
          <section className="profit-chart-column" aria-labelledby="loss-chart-title">
            <h4 id="loss-chart-title">Loss-making branches <span>({lossBranches.length})</span></h4>
            {renderChartRows(shownLossBranches, false)}
          </section>
        </div>
      </section>}

      {!summaryOnly && <section className="profitability-table-section" aria-labelledby="branch-table-title">
        <div className="profitability-panel-heading">
          <div><h3 id="branch-table-title">Branch profit table</h3><p>Profit year to date · {filteredBranches.length} bank branches</p></div>
          <div className="loan-branch-filter profit-branch-filter" ref={branchDropdownRef}>
            <span className="loan-filter-label">Branch</span>
            <button className="loan-branch-trigger" type="button" aria-haspopup="listbox" aria-expanded={branchDropdownOpen} aria-label={`Branch filter: ${selectedBranchData ? selectedBranchData.name : 'All Branches'}`} onClick={() => { setBranchDropdownOpen((open) => !open); setBranchQuery(''); }}>
              <span>{selectedBranchData ? selectedBranchData.name : 'All Branches'}</span><span aria-hidden="true">⌄</span>
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
        <h4 className="profitability-summary-title">Year to date summary</h4>
        <div className="profitability-summary" aria-label="Year to date profit summary">
          <article className="profitability-card"><span>Total Profit Year to Date</span><strong>{money.format(yearToDateSummary.total)}</strong></article>
          <article className="profitability-card"><span>Profitable Branches</span><strong>{money.format(yearToDateSummary.profitable)}</strong></article>
          <article className="profitability-card"><span>Branches Making a Loss</span><strong>{money.format(yearToDateSummary.loss)}</strong></article>
        </div>
        <div className="profitability-table-columns">
          {renderYearToDateTable('Branches with profits', yearToDateProfitBranches)}
          {renderYearToDateTable('Branches with losses', yearToDateLossBranches)}
        </div>
        {yearToDateOtherBranches.length > 0 && <section className="profitability-table-other" aria-label="Break-even or unavailable year-to-date results">
          <h4>Break-even or unavailable <span>({yearToDateOtherBranches.length})</span></h4>
          <div className="table-wrap profitability-table-wrap"><table>
            <thead><tr><th scope="col">Branch Name</th><th scope="col">Profit Year to Date</th><th scope="col">Status</th></tr></thead>
            <tbody>{yearToDateOtherBranches.map((branch) => <tr key={branch.name}><td>{branch.name}</td><td>{branch.yearToDateProfit === null ? '—' : money.format(branch.yearToDateProfit)}</td><td><span className={`profit-status ${branch.yearToDateProfit === null ? 'unavailable' : 'break-even'}`}>{status(branch.yearToDateProfit)}</span></td></tr>)}</tbody>
          </table></div>
        </section>}
      </section>}
      <p className="profitability-source">Source: {sourceFile}. {summaryOnly ? '“Monthly Profit” powers the profit summary.' : '“Monthly Profit” powers the monthly summary and chart; “Profit to Date” powers the year-to-date summary and branch table.'} Summary rows are excluded. Figures are shown as recorded; currency is not specified in the source.</p>
    </section>
  );
}
