'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { branchSlug } from './branchSlug';

export type BranchProfit = {
  name: string;
  district?: string;
  division?: string;
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
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const [chartDistrict, setChartDistrict] = useState('all');
  const [chartDivision, setChartDivision] = useState('all');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [selectedFile, setSelectedFile] = useState(reports[0]?.sourceFile ?? '');
  const activeReport = reports.find((report) => report.sourceFile === selectedFile) ?? reports[0]!;
  const { branches, reportMonth, sourceFile } = activeReport;

  const districts = useMemo(() => [...new Set(branches.map((branch) => branch.district).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b)), [branches]);
  const divisions = useMemo(() => [...new Set(branches.filter((branch) => selectedDistrict === 'all' || branch.district === selectedDistrict).map((branch) => branch.division).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b)), [branches, selectedDistrict]);
  const regionBranches = useMemo(() => branches.filter((branch) => (selectedDistrict === 'all' || branch.district === selectedDistrict) && (selectedDivision === 'all' || branch.division === selectedDivision)), [branches, selectedDistrict, selectedDivision]);
  const branchOptions = useMemo(() => regionBranches.filter((branch) => branch.name.toLowerCase().includes(branchQuery.trim().toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)), [regionBranches, branchQuery]);
  const chartDivisions = useMemo(() => [...new Set(branches.filter((branch) => chartDistrict === 'all' || branch.district === chartDistrict).map((branch) => branch.division).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b)), [branches, chartDistrict]);
  const chartRegionBranches = useMemo(() => branches.filter((branch) => (chartDistrict === 'all' || branch.district === chartDistrict) && (chartDivision === 'all' || branch.division === chartDivision)), [branches, chartDistrict, chartDivision]);

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
  const monthlyTotalLabel = `Total Monthly ${summary.total < 0 ? 'Loss' : 'Profit'}`;
  const yearToDateTotalLabel = `YTD ${yearToDateSummary.total < 0 ? 'Loss' : 'Profit'}`;

  const chartBranches = chartRegionBranches;
  const profitBranches = useMemo(() => chartBranches
    .filter((branch) => branch.monthlyProfit !== null && branch.monthlyProfit > 0)
    .sort((a, b) => b.monthlyProfit! - a.monthlyProfit!), [chartBranches]);
  const lossBranches = useMemo(() => chartBranches
    .filter((branch) => branch.monthlyProfit !== null && branch.monthlyProfit < 0)
    .sort((a, b) => a.monthlyProfit! - b.monthlyProfit!), [chartBranches]);
  const shownProfitBranches = chartMode === 'top10' ? profitBranches.slice(0, 10) : profitBranches;
  const shownLossBranches = chartMode === 'top10' ? lossBranches.slice(0, 10) : lossBranches;
  const selectedBranchData = branches.find((branch) => branch.name === selectedBranch);
  const filteredBranches = useMemo(() => {
    const matching = regionBranches.filter((branch) => selectedBranch === 'all' || branch.name === selectedBranch);
    return [...matching].sort((a, b) => {
      if (a.yearToDateProfit === null) return b.yearToDateProfit === null ? a.name.localeCompare(b.name) : 1;
      if (b.yearToDateProfit === null) return -1;
      return (a.yearToDateProfit - b.yearToDateProfit) * (sortDirection === 'asc' ? 1 : -1);
    });
  }, [regionBranches, selectedBranch, sortDirection]);
  const tableYearToDateAvailable = filteredBranches.filter((branch) => branch.yearToDateProfit !== null);
  const tableYearToDateSummary = {
    total: tableYearToDateAvailable.reduce((sum, branch) => sum + branch.yearToDateProfit!, 0),
    profitable: tableYearToDateAvailable.filter((branch) => branch.yearToDateProfit! > 0).length,
    loss: tableYearToDateAvailable.filter((branch) => branch.yearToDateProfit! < 0).length,
  };
  const tableYearToDateTotalLabel = `YTD ${tableYearToDateSummary.total < 0 ? 'Loss' : 'Profit'}`;
  const yearToDateProfitBranches = filteredBranches
    .filter((branch) => branch.yearToDateProfit !== null && branch.yearToDateProfit > 0)
    .sort((a, b) => (b.yearToDateProfit! - a.yearToDateProfit!) * (sortDirection === 'desc' ? 1 : -1));
  const yearToDateLossBranches = filteredBranches
    .filter((branch) => branch.yearToDateProfit !== null && branch.yearToDateProfit < 0)
    .sort((a, b) => (a.yearToDateProfit! - b.yearToDateProfit!) * (sortDirection === 'desc' ? 1 : -1));
  const yearToDateOtherBranches = filteredBranches.filter((branch) => branch.yearToDateProfit === null || branch.yearToDateProfit === 0);
  const chartScale = Math.max(...monthlyAvailable.map((branch) => Math.abs(branch.monthlyProfit!)), 1);
  const yearToDateChartScale = Math.max(...yearToDateAvailable.map((branch) => Math.abs(branch.yearToDateProfit!)), 1);
  const monthlyTrend = useMemo(() => [...reports].slice(0, 12).reverse().map((report) => {
    const monthProfit = report.branches.reduce<number | null>((total, branch) => {
      if (branch.monthlyProfit === null) return total;
      return (total ?? 0) + branch.monthlyProfit;
    }, null);
    return { month: report.reportMonth, profit: monthProfit };
  }), [reports]);
  const trendValues = monthlyTrend.map((item) => item.profit).filter((value): value is number => value !== null);
  const trendMin = Math.min(0, ...trendValues);
  const trendMax = Math.max(0, ...trendValues);
  const trendRange = trendMax - trendMin || 1;
  const trendY = (value: number) => 20 + (trendMax - value) / trendRange * 190;
  const trendPoints = monthlyTrend.map((item, index) => ({
    ...item,
    x: monthlyTrend.length === 1 ? 50 : 50 + index * (700 / (monthlyTrend.length - 1)),
    y: item.profit === null ? null : trendY(item.profit),
  }));

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
          <Link className="profit-chart-name" href={`/janashakthi-banks/${branchSlug(branch.name)}`}>{branch.name}</Link>
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
            <Link className="profit-chart-name" href={`/janashakthi-banks/${branchSlug(branch.name)}`}>{branch.name}</Link>
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
        <article className="profitability-card"><span>{monthlyTotalLabel}</span><strong>{money.format(summary.total)}</strong></article>
        {summaryOnly && <article className="profitability-card"><span>{yearToDateTotalLabel}</span><strong>{money.format(yearToDateSummary.total)}</strong></article>}
        {!summaryOnly && <article className="profitability-card"><span>Profitable Branches</span><strong>{money.format(summary.profitable)}</strong></article>}
        {!summaryOnly && <article className="profitability-card"><span>Branches Making a Loss</span><strong>{money.format(summary.loss)}</strong></article>}
      </div>

      {summaryOnly && <section className="monthly-profit-trend" aria-labelledby="monthly-profit-trend-title">
        <div className="profitability-panel-heading">
          <div><h3 id="monthly-profit-trend-title">Monthly profit · last 12 months</h3><p>Branch monthly profit over time</p></div>
        </div>
        {trendValues.length > 0 ? <div className="monthly-profit-chart-wrap">
          <svg className="monthly-profit-chart" viewBox="0 0 780 260" role="img" aria-label="Line graph of monthly profit for the last 12 months">
            {[0, 1, 2, 3, 4].map((step) => {
              const y = 20 + step * 47.5;
              const value = trendMax - step * trendRange / 4;
              return <g key={step}>
                <line x1="50" x2="750" y1={y} y2={y} className="monthly-profit-gridline" />
                <text x="42" y={y + 4} textAnchor="end" className="monthly-profit-tick">{money.format(value)}</text>
              </g>;
            })}
            {trendPoints.map((point, index) => index > 0 && point.y !== null && trendPoints[index - 1].y !== null ? <line key={`line-${index}`} x1={trendPoints[index - 1].x} y1={trendPoints[index - 1].y!} x2={point.x} y2={point.y} className="monthly-profit-line" /> : null)}
            {trendPoints.map((point, index) => <g key={`${point.month}-${index}`}>
              {point.y !== null && <circle cx={point.x} cy={point.y} r="4" className="monthly-profit-point"><title>{point.month.replace('\n', ' ')}: {money.format(point.profit!)}</title></circle>}
              <text x={point.x} y="232" textAnchor="middle" className="monthly-profit-month">{point.month.split(/\s+/).map((part, partIndex) => <tspan key={part} x={point.x} dy={partIndex === 0 ? 0 : 12}>{part}</tspan>)}</text>
            </g>)}
            <text x="400" y="258" textAnchor="middle" className="monthly-profit-axis-title">Month</text>
            <text transform="translate(12 125) rotate(-90)" textAnchor="middle" className="monthly-profit-axis-title">Monthly profit (LKR)</text>
          </svg>
        </div> : <p className="profit-chart-empty">Monthly profit data is unavailable for this branch.</p>}
      </section>}

      {!summaryOnly && <section className="profitability-panel" aria-labelledby="branch-chart-title">
        <div className="profitability-panel-heading">
          <div><h3 id="branch-chart-title">Profit and loss by bank branch</h3><p>Monthly results · profits and losses ranked by amount</p></div>
          <div className="profit-chart-controls">
            <div className="profit-table-filters">
              <label className="profit-table-filter">District
                <select value={chartDistrict} onChange={(event) => { setChartDistrict(event.target.value); setChartDivision('all'); }} aria-label="Filter profit and loss chart by district">
                  <option value="all">All Districts</option>
                  {districts.map((district) => <option value={district} key={district}>{district}</option>)}
                </select>
              </label>
              <label className="profit-table-filter">Division
                <select value={chartDivision} onChange={(event) => setChartDivision(event.target.value)} aria-label="Filter profit and loss chart by division">
                  <option value="all">All Divisions</option>
                  {chartDivisions.map((division) => <option value={division} key={division}>{division}</option>)}
                </select>
              </label>
            </div>
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
          <div className="profit-table-filters">
          <label className="profit-table-filter">District
            <select value={selectedDistrict} onChange={(event) => { setSelectedDistrict(event.target.value); setSelectedDivision('all'); setSelectedBranch('all'); setBranchQuery(''); setBranchDropdownOpen(false); }} aria-label="Filter branches by district">
              <option value="all">All Districts</option>
              {districts.map((district) => <option value={district} key={district}>{district}</option>)}
            </select>
          </label>
          <label className="profit-table-filter">Division
            <select value={selectedDivision} onChange={(event) => { setSelectedDivision(event.target.value); setSelectedBranch('all'); setBranchQuery(''); setBranchDropdownOpen(false); }} aria-label="Filter branches by division">
              <option value="all">All Divisions</option>
              {divisions.map((division) => <option value={division} key={division}>{division}</option>)}
            </select>
          </label>
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
                  selectBranch(branchQuery ? branchOptions[0]?.name ?? 'all' : 'all');
                }
              }} /></label>
              <div className="loan-branch-options" role="listbox" aria-label="Available branches">
                <button type="button" role="option" aria-selected={selectedBranch === 'all'} className={selectedBranch === 'all' ? 'selected' : ''} onClick={() => selectBranch('all')}>All Branches</button>
                {branchOptions.map((branch) => <button type="button" role="option" aria-selected={selectedBranch === branch.name} className={selectedBranch === branch.name ? 'selected' : ''} key={branch.name} onClick={() => selectBranch(branch.name)}>{branch.name}</button>)}
                {branchOptions.length === 0 && <span className="loan-branch-empty">No branches match.</span>}
              </div>
            </div>}
          </div>
          </div>
        </div>
        <h4 className="profitability-summary-title">Year to date summary</h4>
        <div className="profitability-summary" aria-label="Year to date profit summary">
          <article className="profitability-card"><span>{tableYearToDateTotalLabel}</span><strong>{money.format(tableYearToDateSummary.total)}</strong></article>
          <article className="profitability-card"><span>Profitable Branches</span><strong>{money.format(tableYearToDateSummary.profitable)}</strong></article>
          <article className="profitability-card"><span>Branches Making a Loss</span><strong>{money.format(tableYearToDateSummary.loss)}</strong></article>
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
