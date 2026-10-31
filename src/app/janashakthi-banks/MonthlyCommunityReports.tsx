'use client';

import { useState } from 'react';
import type { MembershipMetrics, MonthlyReport } from './ProfitabilityAnalytics';

const count = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });
type Metric = readonly [string, number | null];

function MetricCards({ metrics }: { metrics: Metric[] }) {
  return <div className="community-report-metrics">{metrics.map(([label, value]) => <article className="community-report-metric" key={label}>
    <span>{label}</span><strong>{value === null ? 'Data unavailable' : count.format(value)}</strong>
  </article>)}</div>;
}

function BarChart({ title, items }: { title: string; items: Metric[] }) {
  const available = items.filter((item): item is [string, number] => item[1] !== null);
  const max = Math.max(...available.map(([, value]) => value), 1);
  return <div className="community-report-chart" aria-label={title}>
    <h4>{title}</h4>
    {items.map(([label, value]) => <div className="community-report-bar-row" key={label}>
      <span>{label}</span><div className="community-report-track" aria-hidden="true"><i style={{ width: value === null ? '0%' : `${Math.max(value / max * 100, value > 0 ? 1 : 0)}%` }} /></div>
      <b>{value === null ? 'Unavailable' : count.format(value)}</b>
    </div>)}
  </div>;
}

function reportGroups(m: MembershipMetrics) {
  return [
    { id: 'membership', title: 'Bank Membership & Share Capital Status', metrics: [
      ['Total Members', m.totalMembers], ['Savings Members', m.savingsMembers], ['Active Members', m.activeMembers],
      ['A-Type Members', m.aTypeMembers], ['500 Shares Completed', m.sharesCompleted], ['500 Shares Incomplete', m.sharesIncomplete],
    ] as Metric[], charts: [
      { title: 'Member profile', items: [['Total Members', m.totalMembers], ['Savings Members', m.savingsMembers], ['Active Members', m.activeMembers], ['A-Type Members', m.aTypeMembers]] as Metric[] },
      { title: 'Share completion', items: [['Completed', m.sharesCompleted], ['Incomplete', m.sharesIncomplete]] as Metric[] },
    ] },
    { id: 'groups', title: 'Community Group Network & Operational Status', metrics: [
      ['Total Number of Groups', m.totalGroups], ['A Group Count', m.aGroupCount], ['A+ Group Count', m.aPlusGroupCount],
      ['Active Group Count', m.activeGroupCount], ['Inactive Group Count', m.inactiveGroupCount],
    ] as Metric[], charts: [
      { title: 'Group classifications', items: [['A Groups', m.aGroupCount], ['A+ Groups', m.aPlusGroupCount]] as Metric[] },
      { title: 'Operational status', items: [['Active Groups', m.activeGroupCount], ['Inactive Groups', m.inactiveGroupCount]] as Metric[] },
    ] },
    { id: 'societies', title: "Women's Society Network & Classification", metrics: [
      ["Total Women's Societies", m.totalSocieties], ['A Society Count', m.aSocietyCount], ['B Society Count', m.bSocietyCount],
    ] as Metric[], charts: [{ title: 'Society classification', items: [['A Societies', m.aSocietyCount], ['B Societies', m.bSocietyCount]] as Metric[] }] },
  ];
}

const welfareGroups: { title: string; metrics: (m: MembershipMetrics) => Metric[] }[] = [
  { title: "Senior Citizens' Welfare", metrics: (m) => [["Senior Citizens' Society Count", m.seniorCitizensSocietyCount], ['Senior Citizen Member Count', m.seniorCitizenMemberCount]] },
  { title: "Children's Development", metrics: (m) => [["Children's Society Count", m.childrensSocietyCount], ["Children's Society Member Count", m.childrensSocietyMemberCount]] },
  { title: 'Home Gardening Initiatives', metrics: (m) => [['Model Home Garden Count', m.modelHomeGardenCount], ['Home Garden Demonstration Count', m.homeGardenDemonstrationCount]] },
  { title: 'Community Support & Social Engagement', metrics: (m) => [['Support Services Provided (Monthly)', m.supportServicesMonthly], ['Special Day Celebrations (Monthly)', m.specialDayCelebrationsMonthly], ['Creative Programmes (Monthly)', m.creativeProgrammesMonthly]] },
  { title: 'Devi Society Network', metrics: (m) => [['Devi Society Member Count', m.deviSocietyMemberCount], ['Devi Society Count', m.deviSocietyCount]] },
];

export default function MonthlyCommunityReports({ reports }: { reports: MonthlyReport[] }) {
  const [selectedFile, setSelectedFile] = useState(reports[0]?.sourceFile ?? '');
  const report = reports.find((item) => item.sourceFile === selectedFile) ?? reports[0];
  if (!report) return null;
  const groups = reportGroups(report.membership);
  return <section className="community-reports" aria-labelledby="community-reports-title">
    <div className="community-reports-heading">
      <div><div className="section-label">BRANCH PERFORMANCE · {report.reportMonth}</div><h2 id="community-reports-title">Monthly Bank &amp; Community Performance Reports</h2></div>
      <label className="profit-month-filter">Reporting month
        <select value={report.sourceFile} onChange={(event) => setSelectedFile(event.target.value)} aria-label="Select reporting month">
          {reports.map((item) => <option key={item.sourceFile} value={item.sourceFile}>{item.reportMonth}</option>)}
        </select>
      </label>
    </div>
    <p className="community-report-period">Showing {report.reportMonth} performance for this branch.</p>
    {groups.map((group, index) => <section className="community-report-group" key={group.id} aria-labelledby={`community-report-${group.id}`}>
      <div className="community-report-group-heading"><span>0{index + 1}</span><h3 id={`community-report-${group.id}`}>{group.title}</h3></div>
      <MetricCards metrics={group.metrics} />
      <div className="community-report-charts">{group.charts.map((chart) => <BarChart key={chart.title} {...chart} />)}</div>
    </section>)}
    <section className="community-report-group" aria-labelledby="community-report-welfare">
      <div className="community-report-group-heading"><span>04</span><h3 id="community-report-welfare">Community Development &amp; Social Welfare Programmes</h3></div>
      <div className="community-welfare-grid">{welfareGroups.map((group) => <article className="community-welfare-card" key={group.title}>
        <h4>{group.title}</h4><MetricCards metrics={group.metrics(report.membership)} />
      </article>)}</div>
    </section>
    <p className="community-report-source">Source: <span>{report.sourceFile}</span>. Blank and dash entries are shown as unavailable; reported zeroes remain zero.</p>
  </section>;
}
