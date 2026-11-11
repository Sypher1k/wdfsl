'use client';

import { useMemo, useState } from 'react';
import type { BranchRecord, InsuranceYtdMetric } from '../janashakthi-banks/reportData';

type InsuranceBranch = Pick<BranchRecord, 'name' | 'district' | 'division'> & { metrics: InsuranceYtdMetric[] };

const amountFormat = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 2 });
const quantityFormat = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

export default function InsuranceYtdSummary({ branches }: { branches: InsuranceBranch[] }) {
  const [district, setDistrict] = useState('all');
  const [division, setDivision] = useState('all');
  const [branch, setBranch] = useState('all');

  const districts = useMemo(() => [...new Set(branches.map((item) => item.district).filter(Boolean))].sort(), [branches]);
  const divisions = useMemo(() => [...new Set(branches.filter((item) => district === 'all' || item.district === district).map((item) => item.division).filter(Boolean))].sort(), [branches, district]);
  const filteredBranches = useMemo(() => branches.filter((item) => (district === 'all' || item.district === district) && (division === 'all' || item.division === division)), [branches, district, division]);
  const selectedBranches = branch === 'all' ? filteredBranches : filteredBranches.filter((item) => item.name === branch);
  const metrics = useMemo(() => {
    const template = selectedBranches.find((item) => item.metrics.length > 0)?.metrics ?? [];
    return template.map((metric) => ({
      ...metric,
      value: selectedBranches.reduce((total, item) => total + (item.metrics.find((candidate) => candidate.label === metric.label)?.value ?? 0), 0),
    }));
  }, [selectedBranches]);
  const groups = (['Treasurers Insurance', 'Divisarana Insurance'] as const)
    .map((name) => ({ name, metrics: metrics.filter((metric) => metric.group === name) }))
    .filter((item) => item.metrics.length > 0);
  const otherMetrics = metrics.filter((metric) => metric.group === null);

  return <section className="section insurance-ytd" aria-labelledby="micro-insurance-ytd-title">
    <div className="section-label">YEAR TO DATE</div>
    <div className="micro-section-heading"><div><h2 id="micro-insurance-ytd-title">Insurance Summary</h2></div><div className="insurance-ytd-filters">
      <label className="profit-month-filter">District<select aria-label="Filter insurance by district" value={district} onChange={(event) => { setDistrict(event.target.value); setDivision('all'); setBranch('all'); }}><option value="all">All Districts</option>{districts.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="profit-month-filter">Division<select aria-label="Filter insurance by division" value={division} onChange={(event) => { setDivision(event.target.value); setBranch('all'); }}><option value="all">All Divisions</option>{divisions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="profit-month-filter">Branch<select aria-label="Filter insurance by branch" value={branch} onChange={(event) => setBranch(event.target.value)}><option value="all">All Branches</option>{filteredBranches.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label>
    </div></div>
    {metrics.length ? <>
      <div className="insurance-ytd-groups">{groups.map(({ name, metrics: groupMetrics }) => <article className="insurance-ytd-group-card" key={name}>
        <h3>{name}</h3><div className="insurance-ytd-group-metrics">{groupMetrics.map(({ label, value, kind }) => <div className="insurance-ytd-group-metric" key={label}>
          <span>{label}</span><strong>{kind === 'amount' ? `LKR ${amountFormat.format(value ?? 0)}` : quantityFormat.format(value ?? 0)}</strong>
        </div>)}</div>
      </article>)}</div>
      {otherMetrics.length > 0 && <div className="insurance-ytd-other-grid">{otherMetrics.map(({ label, value, kind }) => <article className="insurance-ytd-card" key={label}>
        <span>{label}</span><strong>{kind === 'amount' ? `LKR ${amountFormat.format(value ?? 0)}` : quantityFormat.format(value ?? 0)}</strong>
      </article>)}</div>}
    </> : <p className="insurance-ytd-empty">No year to date insurance data is available for this selection.</p>}
    <p className="insurance-ytd-source">Source: insurance_report_ytd.csv</p>
  </section>;
}
