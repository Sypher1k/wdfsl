'use client';

import { useEffect, useRef, useState } from 'react';
import type { MonthlyReport } from './ProfitabilityAnalytics';

const number = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

function SavingsTrend({ values }: { values: { month: string; value: number | null }[] }) {
  const width = 780;
  const height = 260;
  const left = 92;
  const right = 24;
  const top = 22;
  const bottom = 54;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const plottedValues = values.filter((item): item is { month: string; value: number } => item.value !== null);
  const available = plottedValues.map(({ value }) => value);
  const max = Math.max(0, ...available);
  const range = max || 1;
  const x = (index: number) => left + (plottedValues.length <= 1 ? chartWidth / 2 : index * chartWidth / (plottedValues.length - 1));
  const y = (value: number) => top + (max - value) / range * chartHeight;
  const format = (value: number) => number.format(value);
  const ticks = [0, 1, 2, 3, 4].map((step) => max - step * range / 4);
  return <section className="monthly-profit-trend savings-trend" aria-labelledby="savings-trend-title">
    <div className="profitability-panel-heading"><div><h3 id="savings-trend-title">Monthly savings · last 12 months</h3><p>Total savings amount over time</p></div></div>
    {available.length ? <div className="monthly-profit-chart-wrap"><svg className="monthly-profit-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Bar graph of savings amount by month for the last 12 months">
      {ticks.map((tick, step) => { const tickY = top + step * chartHeight / 4; return <g key={step}><line x1={left} x2={width - right} y1={tickY} y2={tickY} className="monthly-profit-gridline"/><text x={left - 8} y={tickY + 4} textAnchor="end" className="monthly-profit-tick">{format(tick)}</text></g>; })}
      {plottedValues.map(({ month, value }, index) => <g key={`${month}-${index}`}><rect x={x(index) - 14} y={y(value)} width="28" height={Math.max(chartHeight - (y(value) - top), 1)} className="monthly-profit-bar"><title>{`${month}: ${format(value)}`}</title></rect><text x={x(index)} y={height - 28} textAnchor="middle" className="monthly-profit-month">{month}</text></g>)}
      <text x={width / 2} y={height - 3} textAnchor="middle" className="monthly-profit-axis-title">Month</text>
      <text transform={`translate(18 ${height / 2}) rotate(-90)`} textAnchor="middle" className="monthly-profit-axis-title">Savings amount</text>
    </svg></div> : <p className="profit-chart-empty">Monthly savings data is unavailable for this period.</p>}
  </section>;
}

export default function SavingsAnalytics({ reports, branchName }: { reports: MonthlyReport[]; branchName?: string }) {
  const [selectedFile, setSelectedFile] = useState(reports[0]?.sourceFile ?? '');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [branchQuery, setBranchQuery] = useState('');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const report = reports.find((item) => item.sourceFile === selectedFile) ?? reports[0]!;
  const trendReports = [...reports].sort((a, b) => a.sourceFile.localeCompare(b.sourceFile)).slice(-12);
  const trendValues = trendReports.map((item) => {
    const branch = branchName ? item.branches.find((candidate) => candidate.name.toLowerCase() === branchName.toLowerCase()) : item.branches.find((candidate) => candidate.name === selectedBranch);
    const scoped = item.branches.filter((candidate) => (selectedDistrict === 'all' || candidate.district === selectedDistrict) && (selectedDivision === 'all' || candidate.division === selectedDivision));
    const value = branchName || selectedBranch !== 'all' ? branch?.savings.totalSavingsAmount ?? null : selectedDistrict === 'all' && selectedDivision === 'all' ? item.savings.totalSavingsAmount : scoped.reduce<number | null>((sum, candidate) => candidate.savings.totalSavingsAmount === null ? sum : (sum ?? 0) + candidate.savings.totalSavingsAmount, null);
    return { month: item.reportMonth, value };
  });
  const districts = [...new Set(report.branches.map((branch) => branch.district).filter((value): value is string => Boolean(value)))].sort();
  const divisions = [...new Set(report.branches.filter((branch) => selectedDistrict === 'all' || branch.district === selectedDistrict).map((branch) => branch.division).filter((value): value is string => Boolean(value)))].sort();
  const filteredBranches = report.branches.filter((branch) => (selectedDistrict === 'all' || branch.district === selectedDistrict) && (selectedDivision === 'all' || branch.division === selectedDivision));
  const selectedBranchData = report.branches.find((branch) => branch.name === selectedBranch);
  const metrics = selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.savings : selectedDistrict === 'all' && selectedDivision === 'all' ? report.savings : { totalSavingsAmount: filteredBranches.reduce<number | null>((sum, b) => b.savings.totalSavingsAmount === null ? sum : (sum ?? 0) + b.savings.totalSavingsAmount, null), savingsMembers: filteredBranches.reduce<number | null>((sum, b) => b.savings.savingsMembers === null ? sum : (sum ?? 0) + b.savings.savingsMembers, null) };
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

  return (
    <section className="savings-analytics" aria-labelledby="savings-analytics-title">
      <div className="savings-heading">
        <div>
          <div className="section-label">MONTHLY SAVINGS · {report.reportMonth}</div>
          <h2 id="savings-analytics-title">Savings</h2>
        </div>
        <div className="loan-filters">
          {!branchName && <><label className="profit-month-filter">District<select aria-label="Filter savings by district" value={selectedDistrict} onChange={(event) => { setSelectedDistrict(event.target.value); setSelectedDivision('all'); setSelectedBranch('all'); }}><option value="all">All Districts</option>{districts.map((district) => <option key={district}>{district}</option>)}</select></label><label className="profit-month-filter">Division<select aria-label="Filter savings by division" value={selectedDivision} onChange={(event) => { setSelectedDivision(event.target.value); setSelectedBranch('all'); }}><option value="all">All Divisions</option>{divisions.map((division) => <option key={division}>{division}</option>)}</select></label></>}
          <label className="profit-month-filter">Month
            <select value={report.sourceFile} onChange={(event) => { setSelectedFile(event.target.value); setSelectedBranch('all'); setBranchQuery(''); setBranchDropdownOpen(false); }} aria-label="Filter savings metrics by month">
              {reports.map((item) => <option key={item.sourceFile} value={item.sourceFile}>{item.reportMonth}</option>)}
            </select>
          </label>
          {!branchName && <div className="loan-branch-filter" ref={branchDropdownRef}>
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
          </div>}
        </div>
      </div>
      <p className="loan-selection">Showing savings statistics for <strong>{branchName ?? (selectedBranchData && selectedBranch !== 'all' ? selectedBranchData.name : 'All Branches')}</strong>.</p>
      <div className="savings-metrics">
        <article className="savings-metric"><span>Total Savings Amount</span><strong>{metrics.totalSavingsAmount === null ? 'Data unavailable' : number.format(metrics.totalSavingsAmount)}</strong></article>
        <article className="savings-metric"><span>Savings Members</span><strong>{metrics.savingsMembers === null ? 'Data unavailable' : number.format(metrics.savingsMembers)}</strong></article>
      </div>
      <SavingsTrend values={trendValues} />
      <p className="savings-source">Source: {report.sourceFile}. All-branch totals sum reported branch values; blank and dash entries are excluded rather than treated as zero. Currency is not specified in the source.</p>
    </section>
  );
}
