'use client';

import { useMemo, useState } from 'react';

export type BranchProfit = {
  name: string;
  monthlyProfit: number | null;
  yearToDateProfit: number | null;
  loans: LoanMetrics;
  savings: SavingsMetrics;
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
  aTypeMembers: number | null;
  sharesCompleted: number | null;
  totalGroups: number | null;
  aGroupCount: number | null;
  activeGroupCount: number | null;
  totalSocieties: number | null;
  aSocietyCount: number | null;
  bSocietyCount: number | null;
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

export default function ProfitabilityAnalytics({ reports }: { reports: MonthlyReport[] }) {
  const [chartMode, setChartMode] = useState<'all' | 'top10'>('all');
  const [query, setQuery] = useState('');
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

  const profitBranches = useMemo(() => branches
    .filter((branch) => branch.monthlyProfit !== null && branch.monthlyProfit > 0)
    .sort((a, b) => b.monthlyProfit! - a.monthlyProfit!), [branches]);
  const lossBranches = useMemo(() => branches
    .filter((branch) => branch.monthlyProfit !== null && branch.monthlyProfit < 0)
    .sort((a, b) => a.monthlyProfit! - b.monthlyProfit!), [branches]);
  const shownProfitBranches = chartMode === 'top10' ? profitBranches.slice(0, 10) : profitBranches;
  const shownLossBranches = chartMode === 'top10' ? lossBranches.slice(0, 10) : lossBranches;
  const filteredBranches = useMemo(() => {
    const matching = branches.filter((branch) => branch.name.toLowerCase().includes(query.trim().toLowerCase()));
    return matching.sort((a, b) => {
      if (a.yearToDateProfit === null) return b.yearToDateProfit === null ? a.name.localeCompare(b.name) : 1;
      if (b.yearToDateProfit === null) return -1;
      return (a.yearToDateProfit - b.yearToDateProfit) * (sortDirection === 'asc' ? 1 : -1);
    });
  }, [branches, query, sortDirection]);
  const chartScale = Math.max(...monthlyAvailable.map((branch) => Math.abs(branch.monthlyProfit!)), 1);

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

  return (
    <section className="profitability" aria-labelledby="profitability-title">
      <div className="profitability-heading">
        <div>
          {/* <div className="section-label">BANK PERFORMANCE · {reportMonth}</div> */}
          
          <h2 id="profitability-title">Profitability Analytics</h2>
          <h3>{reportMonth}</h3>
        </div>
        <label className="profit-month-filter">Month
          <select value={sourceFile} onChange={(event) => setSelectedFile(event.target.value)} aria-label="Filter profitability by month">
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

      <section className="profitability-panel" aria-labelledby="branch-chart-title">
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
      </section>

      <section className="profitability-table-section" aria-labelledby="branch-table-title">
        <div className="profitability-panel-heading">
          <div><h3 id="branch-table-title">Branch profit table</h3><p>Profit year to date · {filteredBranches.length} bank branches</p></div>
          <label className="profit-search">Search branches<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Branch name" /></label>
        </div>
        <div className="table-wrap profitability-table-wrap"><table>
          <thead><tr><th scope="col">Branch Name</th><th scope="col"><button className="profit-sort" type="button" onClick={() => setSortDirection((direction) => direction === 'desc' ? 'asc' : 'desc')} aria-label={`Sort by year-to-date profit ${sortDirection === 'desc' ? 'ascending' : 'descending'}`}>Profit Year to Date {sortDirection === 'desc' ? '↓' : '↑'}</button></th><th scope="col">Profit Status</th></tr></thead>
          <tbody>{filteredBranches.map((branch) => <tr key={branch.name}><td>{branch.name}</td><td>{branch.yearToDateProfit === null ? '—' : money.format(branch.yearToDateProfit)}</td><td><span className={`profit-status ${branch.yearToDateProfit === null ? 'unavailable' : branch.yearToDateProfit < 0 ? 'loss' : branch.yearToDateProfit === 0 ? 'break-even' : 'gain'}`}>{status(branch.yearToDateProfit)}</span></td></tr>)}
            {filteredBranches.length === 0 && <tr><td colSpan={3}>No branches match your search.</td></tr>}
          </tbody>
        </table></div>
      </section>
      <p className="profitability-source">Source: {sourceFile}. “Monthly Profit” powers the summary and chart; “Profit to Date” powers the branch table. Summary rows are excluded. Figures are shown as recorded; currency is not specified in the source.</p>
    </section>
  );
}
