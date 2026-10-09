'use client';

import { useMemo, useState } from 'react';
import branchData from './profitability-data.json';

type Branch = { name: string; profit: number | null };
const branches = branchData as Branch[];
const money = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

function status(profit: number | null) {
  if (profit === null) return 'Data unavailable';
  if (profit > 0) return 'Profitable';
  if (profit < 0) return 'Loss-making';
  return 'Break-even';
}

export default function ProfitabilityAnalytics() {
  const [chartMode, setChartMode] = useState<'all' | 'top10'>('all');
  const [query, setQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  const available = useMemo(() => branches.filter((branch) => branch.profit !== null), []);
  const summary = useMemo(() => ({
    total: available.reduce((sum, branch) => sum + branch.profit!, 0),
    profitable: available.filter((branch) => branch.profit! > 0).length,
    loss: available.filter((branch) => branch.profit! < 0).length,
  }), [available]);

  const sortedBranches = useMemo(
    () => [...branches].sort((a, b) => (b.profit ?? Number.NEGATIVE_INFINITY) - (a.profit ?? Number.NEGATIVE_INFINITY)),
    [],
  );
  const chartBranches = chartMode === 'top10' ? sortedBranches.filter((branch) => branch.profit !== null).slice(0, 10) : sortedBranches;
  const filteredBranches = useMemo(() => {
    const matching = branches.filter((branch) => branch.name.toLowerCase().includes(query.trim().toLowerCase()));
    return matching.sort((a, b) => {
      if (a.profit === null) return b.profit === null ? a.name.localeCompare(b.name) : 1;
      if (b.profit === null) return -1;
      return (a.profit - b.profit) * (sortDirection === 'asc' ? 1 : -1);
    });
  }, [query, sortDirection]);
  const scale = Math.max(...chartBranches.map((branch) => Math.abs(branch.profit ?? 0)), 1);

  return (
    <section className="profitability" aria-labelledby="profitability-title">
      <div className="profitability-heading">
        <div>
          <div className="section-label">BANK PERFORMANCE · AUGUST 2026</div>
          <h2 id="profitability-title">Profitability Analytics</h2>
        </div>
        <p>Monthly branch profit from the report dated 31 August 2026.</p>
      </div>

      <div className="profitability-summary" aria-label="Profit summary">
        <article className="profitability-card"><span>Total Profit</span><strong>{money.format(summary.total)}</strong></article>
        <article className="profitability-card"><span>Profitable Branches</span><strong>{money.format(summary.profitable)}</strong></article>
        <article className="profitability-card"><span>Branches Making a Loss</span><strong>{money.format(summary.loss)}</strong></article>
      </div>

      <section className="profitability-panel" aria-labelledby="branch-chart-title">
        <div className="profitability-panel-heading">
          <div><h3 id="branch-chart-title">Profit by bank branch</h3><p>Monthly profit · sorted highest to lowest</p></div>
          <div className="profitability-toggle" aria-label="Branches shown">
            <button type="button" aria-pressed={chartMode === 'all'} onClick={() => setChartMode('all')}>All branches</button>
            <button type="button" aria-pressed={chartMode === 'top10'} onClick={() => setChartMode('top10')}>Top 10</button>
          </div>
        </div>
        <div className="profit-chart" role="list" aria-label={`${chartBranches.length} branches by monthly profit`}>
          {chartBranches.map((branch) => {
            const positive = branch.profit !== null && branch.profit >= 0;
            const width = branch.profit === null ? 0 : Math.abs(branch.profit) / scale * 49;
            const value = branch.profit === null ? 'Data unavailable' : money.format(branch.profit);
            return <div className="profit-chart-row" role="listitem" key={branch.name}>
              <span className="profit-chart-name">{branch.name}</span>
              <div className="profit-chart-track" title={`${branch.name}: ${value}`} aria-label={`${branch.name}: ${value}`}>
                <span className="profit-chart-zero" />
                {branch.profit !== null && <span className={`profit-chart-bar ${positive ? 'positive' : 'negative'}`} style={{ width: `${width}%`, left: positive ? '50%' : `calc(50% - ${width}%)` }} />}
              </div>
              <span className={`profit-chart-value ${branch.profit !== null && branch.profit < 0 ? 'negative-text' : ''}`} title={value}>{value}</span>
            </div>;
          })}
        </div>
      </section>

      <section className="profitability-table-section" aria-labelledby="branch-table-title">
        <div className="profitability-panel-heading">
          <div><h3 id="branch-table-title">Branch profit table</h3><p>{filteredBranches.length} bank branches</p></div>
          <label className="profit-search">Search branches<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Branch name" /></label>
        </div>
        <div className="table-wrap profitability-table-wrap"><table>
          <thead><tr><th scope="col">Branch Name</th><th scope="col"><button className="profit-sort" type="button" onClick={() => setSortDirection((direction) => direction === 'desc' ? 'asc' : 'desc')} aria-label={`Sort by profit ${sortDirection === 'desc' ? 'ascending' : 'descending'}`}>Profit {sortDirection === 'desc' ? '↓' : '↑'}</button></th><th scope="col">Profit Status</th></tr></thead>
          <tbody>{filteredBranches.map((branch) => <tr key={branch.name}><td>{branch.name}</td><td>{branch.profit === null ? '—' : money.format(branch.profit)}</td><td><span className={`profit-status ${branch.profit === null ? 'unavailable' : branch.profit < 0 ? 'loss' : branch.profit === 0 ? 'break-even' : 'gain'}`}>{status(branch.profit)}</span></td></tr>)}
            {filteredBranches.length === 0 && <tr><td colSpan={3}>No branches match your search.</td></tr>}
          </tbody>
        </table></div>
      </section>
      <p className="profitability-source">Source: English Summary worksheet, “Monthly Profit” column. Summary row excluded. Figures are shown as recorded; currency is not specified in the workbook.</p>
    </section>
  );
}
