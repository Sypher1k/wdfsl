'use client';

import { useState } from 'react';
import type { MonthlyReport } from './ProfitabilityAnalytics';

const count = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

export default function MembershipAnalytics({ reports }: { reports: MonthlyReport[] }) {
  const [selectedFile, setSelectedFile] = useState(reports[0]?.sourceFile ?? '');
  const report = reports.find((item) => item.sourceFile === selectedFile) ?? reports[0]!;
  const stats = [
    ['Total Members', report.membership.totalMembers],
    ['Savings Members', report.membership.savingsMembers],
    ['A-Type Members', report.membership.aTypeMembers],
    ['500 Shares Completed', report.membership.sharesCompleted],
    ['Total Number of Groups', report.membership.totalGroups],
    ['A Group Count', report.membership.aGroupCount],
    ['Active Group Count', report.membership.activeGroupCount],
    ["Total Women's Societies", report.membership.totalSocieties],
    ['A Society Count', report.membership.aSocietyCount],
    ['B Society Count', report.membership.bSocietyCount],
  ] as const;

  return (
    <section className="membership-analytics" aria-labelledby="membership-analytics-title">
      <div className="membership-heading">
        <div>
          <div className="section-label">MEMBERSHIP & SOCIETIES · {report.reportMonth}</div>
          <h2 id="membership-analytics-title">Membership &amp; Society Overview</h2>
        </div>
        <label className="profit-month-filter">Month
          <select value={report.sourceFile} onChange={(event) => setSelectedFile(event.target.value)} aria-label="Filter membership statistics by month">
            {reports.map((item) => <option key={item.sourceFile} value={item.sourceFile}>{item.reportMonth}</option>)}
          </select>
        </label>
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
