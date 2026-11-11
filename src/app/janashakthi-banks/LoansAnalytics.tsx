'use client';

import { useEffect, useRef, useState } from 'react';
import type { LoanMetrics, MonthlyReport } from './ProfitabilityAnalytics';

const number = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });
const percentage = new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function LoanTrendChart({ title, unit, values }: { title: string; unit: 'LKR' | '%'; values: { month: string; value: number | null }[] }) {
  const width = 720;
  const height = 230;
  const left = 64;
  const right = 18;
  const top = 18;
  const bottom = 38;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const plottedValues = values.filter((item): item is { month: string; value: number } => item.value !== null);
  const data = plottedValues.map(({ value }) => value);
  const max = data.length ? Math.max(...data) : 0;
  const min = unit === '%' ? Math.min(0, ...data) : 0;
  const range = max - min || 1;
  const x = (index: number) => left + (plottedValues.length <= 1 ? chartWidth / 2 : index * chartWidth / (plottedValues.length - 1));
  const y = (value: number) => top + (max - value) / range * chartHeight;
  const ticks = [0, 1, 2, 3].map((tick) => max - tick * range / 3);
  const formatTick = (value: number) => unit === '%' ? `${percentage.format(value)}%` : `LKR ${number.format(value)}`;
  return <article className="loan-trend-card">
    <h3>{title}</h3>
    <div className="loan-trend-scroll">
      <svg className="loan-trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title} over the last ${values.length} months`}>
        {ticks.map((tick) => <g key={tick}><line x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} className="loan-trend-grid"/><text x={left - 8} y={y(tick) + 4} textAnchor="end" className="loan-trend-tick">{formatTick(tick)}</text></g>)}
        {plottedValues.map(({ month, value }, index) => <rect key={`${month}-${index}`} x={x(index) - 14} y={Math.min(y(value), y(0))} width="28" height={Math.max(Math.abs(y(value) - y(0)), 1)} className="loan-trend-bar"><title>{`${month}: ${formatTick(value)}`}</title></rect>)}
        {plottedValues.map(({ month }, index) => <text key={month} x={x(index)} y={height - 12} textAnchor="middle" className="loan-trend-month">{month}</text>)}
      </svg>
    </div>
    {!data.length && <p className="loan-trend-empty">No monthly values are available for this period.</p>}
    <p className="visually-hidden">Monthly values: {values.map(({ month, value }) => `${month}: ${value === null ? 'not reported' : formatTick(value)}`).join('; ')}</p>
  </article>;
}

export default function LoansAnalytics({ reports, branchName }: { reports: MonthlyReport[]; branchName?: string }) {
  const [selectedFile, setSelectedFile] = useState(reports[0]?.sourceFile ?? '');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [branchQuery, setBranchQuery] = useState('');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const report = reports.find((item) => item.sourceFile === selectedFile) ?? reports[0]!;
  const trendReports = [...reports].sort((a, b) => a.sourceFile.localeCompare(b.sourceFile)).slice(-12);
  const reportOrdinal = (reportMonth: string) => {
    const [monthName, year] = reportMonth.toLowerCase().split(' ');
    const month = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(monthName ?? '');
    return month >= 0 && year ? Number(year) * 12 + month : -1;
  };
  const latestOrdinal = Math.max(...reports.map((item) => reportOrdinal(item.reportMonth)));
  const trendMonths = Array.from({ length: 12 }, (_, index) => latestOrdinal - 11 + index);
  const branchTrendValues = (metric: keyof LoanMetrics) => trendMonths.map((ordinal) => {
    const item = trendReports.find((candidate) => reportOrdinal(candidate.reportMonth) === ordinal);
    const branch = item && branchName ? item.branches.find((candidate) => candidate.name.toLowerCase() === branchName.toLowerCase()) : null;
    const date = new Date(Math.floor(ordinal / 12), ordinal % 12, 1);
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    return { month: `${month} ${String(date.getFullYear()).slice(-2)}`, value: item ? branchName ? branch?.loans[metric] ?? null : item.loans[metric] : null };
  });
  const districts = [...new Set(report.branches.map((branch) => branch.district).filter((value): value is string => Boolean(value)))].sort();
  const divisions = [...new Set(report.branches.filter((branch) => selectedDistrict === 'all' || branch.district === selectedDistrict).map((branch) => branch.division).filter((value): value is string => Boolean(value)))].sort();
  const filteredBranches = report.branches.filter((branch) => (selectedDistrict === 'all' || branch.district === selectedDistrict) && (selectedDivision === 'all' || branch.division === selectedDivision));
  const selectedBranchData = report.branches.find((branch) => branch.name === selectedBranch);
  const metricsData: LoanMetrics = selectedBranch !== 'all' && selectedBranchData ? selectedBranchData.loans : filteredBranches.reduce((totals, branch) => Object.fromEntries(Object.keys(totals).map((key) => { const values = filteredBranches.map((item) => item.loans[key as keyof LoanMetrics]).filter((value): value is number => value !== null); return [key, key === 'parPercentage' ? (totals.outstandingLoanAmount && totals.atRiskLoanAmount ? totals.atRiskLoanAmount / totals.outstandingLoanAmount * 100 : null) : values.length ? values.reduce((sum, value) => sum + value, 0) : null]; })) as LoanMetrics, { ...report.loans });
  const visibleBranches = filteredBranches
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
  const metrics = [
    ['Outstanding Loan Amount', metricsData.outstandingLoanAmount, 'amount'],
    ['Number of Borrowers', metricsData.numberOfBorrowers, 'count'],
    ['Monthly Loan Disbursement', metricsData.monthlyLoanDisbursement, 'amount'],
    ['Monthly Borrower Count', metricsData.monthlyBorrowerCount, 'count'],
    ['At-Risk Loan Amount', metricsData.atRiskLoanAmount, 'amount'],
    ['PAR Percentage', metricsData.parPercentage, 'percent'],
    ['Total Arrears Loan Amount', metricsData.totalArrearsLoanAmount, 'amount'],
    ['Number of Arrears Borrowers', metricsData.numberOfArrearsBorrowers, 'count'],
  ] as const;

  return (
    <section className="loans-analytics" aria-labelledby="loans-analytics-title">
      <div className="loans-heading">
        <div>
          <div className="section-label">MONTHLY LENDING · {report.reportMonth}</div>
          <h2 id="loans-analytics-title">Loans</h2>
        </div>
        <div className="loan-filters">
          {!branchName && <><label className="profit-month-filter">District<select aria-label="Filter loans by district" value={selectedDistrict} onChange={(event) => { setSelectedDistrict(event.target.value); setSelectedDivision('all'); setSelectedBranch('all'); }}><option value="all">All Districts</option>{districts.map((district) => <option key={district}>{district}</option>)}</select></label><label className="profit-month-filter">Division<select aria-label="Filter loans by division" value={selectedDivision} onChange={(event) => { setSelectedDivision(event.target.value); setSelectedBranch('all'); }}><option value="all">All Divisions</option>{divisions.map((division) => <option key={division}>{division}</option>)}</select></label></>}
          <label className="profit-month-filter">Month
            <select value={report.sourceFile} onChange={(event) => { setSelectedFile(event.target.value); setSelectedBranch('all'); setBranchQuery(''); setBranchDropdownOpen(false); }} aria-label="Filter loan metrics by month">
              {reports.map((item) => <option key={item.sourceFile} value={item.sourceFile}>{item.reportMonth}</option>)}
            </select>
          </label>
          {!branchName && <div className="loan-branch-filter" ref={branchDropdownRef}>
            <span className="loan-filter-label">Branch</span>
            <button className="loan-branch-trigger" type="button" aria-haspopup="listbox" aria-expanded={branchDropdownOpen} aria-label={`Branch filter: ${selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.name : 'All Branches'}`} onClick={() => { setBranchDropdownOpen((open) => !open); setBranchQuery(''); }}>
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
          </div>}
        </div>
      </div>
      <p className="loan-selection">Showing loan statistics for <strong>{branchName ?? (selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.name : 'All Branches')}</strong>.</p>
      <div className="loans-metrics">
        {metrics.map(([label, value, kind]) => <article className="loan-metric" key={label}>
          <span>{label}</span>
          <strong>{kind === 'percent' ? `${percentage.format(value ?? 0)}%` : number.format(value ?? 0)}</strong>
        </article>)}
      </div>
      {branchName && <div className="loan-trends" aria-label="Loan trends for the last 12 months">
        <LoanTrendChart title="Outstanding Loan Amount" unit="LKR" values={branchTrendValues('outstandingLoanAmount')} />
        <LoanTrendChart title="Monthly Loan Disbursement" unit="LKR" values={branchTrendValues('monthlyLoanDisbursement')} />
        <LoanTrendChart title="PAR Percentage" unit="%" values={branchTrendValues('parPercentage')} />
      </div>}
      <p className="loans-source">Source: {report.sourceFile}. All-branch totals sum reported branch values; blank and dash entries are excluded rather than treated as zero. PAR is calculated as reported At-Risk Loan Amount divided by reported Outstanding Loan Amount because the CSV PAR values are rounded.</p>
    </section>
  );
}
