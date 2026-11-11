import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import ProfitabilityAnalytics from '../ProfitabilityAnalytics';
import LoansAnalytics from '../LoansAnalytics';
import SavingsAnalytics from '../SavingsAnalytics';
import MembershipAnalytics from '../MembershipAnalytics';
import MonthlyCommunityReports from '../MonthlyCommunityReports';
import { branchSlug, readBranches, readBranchNames, readInsuranceYtd, readSummaryReports } from '../reportData';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: Promise<{ branch: string }> }) {
  return params.then(({ branch }) => {
    const name = readBranchNames().find((candidate) => branchSlug(candidate) === branch);
    return { title: name ? `${name} Bank Branch | Janashakthi Banks` : 'Bank Branch | Janashakthi Banks' };
  });
}

export default async function BankBranchPage({ params }: { params: Promise<{ branch: string }> }) {
  const { branch: branchParam } = await params;
  const branchContact = readBranches().find((candidate) => branchSlug(candidate.name) === branchParam);
  if (!branchContact) notFound();
  const branchName = branchContact.name;
  const insuranceSummary = readInsuranceYtd(branchName);
  const insuranceGroups = (['Treasurers Insurance', 'Divisarana Insurance'] as const)
    .map((group) => ({ group, metrics: insuranceSummary.filter((metric) => metric.group === group) }))
    .filter(({ metrics }) => metrics.length > 0);
  const otherInsuranceMetrics = insuranceSummary.filter((metric) => metric.group === null);
  const amountFormat = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 2 });
  const quantityFormat = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });

  const reports = readSummaryReports().map((report) => {
    const branch = report.branches.find((item) => item.name.toLowerCase() === branchName.toLowerCase());
    return branch ? { ...report, branches: [branch], loans: branch.loans, savings: branch.savings, membership: branch.membership } : { ...report, branches: [], loans: { ...report.loans, outstandingLoanAmount: null, numberOfBorrowers: null, monthlyLoanDisbursement: null, monthlyBorrowerCount: null, atRiskLoanAmount: null, parPercentage: null, totalArrearsLoanAmount: null, numberOfArrearsBorrowers: null }, savings: { totalSavingsAmount: null, savingsMembers: null }, membership: Object.fromEntries(Object.keys(report.membership).map((key) => [key, null])) as typeof report.membership };
  });

  return <PageShell label="JANASHAKTHI BANKS · BRANCH" image={{ src: '/images/wdf-img-4.jpeg', alt: 'Women gathered around records at a community banking meeting' }} title={<>Janashakthi Bank, <em>{branchName}</em></>}>
    <p className="branch-back-link"><a href="/janashakthi-banks">← All Janashakthi branches</a></p>
    <section className="branch-contact-layout" aria-label={`${branchName} branch contact details`}>
      <div className="branch-contact-details">
        <div className="section-label">BRANCH CONTACT</div>
        <h2>Visit or get in touch</h2>
        <dl>
          <div><dt>Branch phone</dt><dd><a href={`tel:+94${branchContact.phone.replace(/^0/, '')}`}>+94 {branchContact.phone.replace(/^0/, '')}</a></dd></div>
          <div><dt>Branch email</dt><dd><a href={`mailto:${branchContact.email}`}>{branchContact.email}</a></dd></div>
          <div><dt>Branch manager</dt><dd>{branchContact.manager}</dd></div>
          <div><dt>Branch address</dt><dd>{branchContact.address}</dd></div>
        </dl>
      </div>
      <div className="branch-map">
        <iframe title={`Map to ${branchName} branch`} src={`https://maps.google.com/maps?q=${encodeURIComponent(`${branchName}, Sri Lanka`)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
    <section className="insurance-ytd" aria-labelledby="insurance-ytd-title">
      <div className="section-label">YEAR TO DATE</div>
      <h2 id="insurance-ytd-title">Insurance Summary</h2>
      {insuranceSummary.length ? <>
        <div className="insurance-ytd-groups">{insuranceGroups.map(({ group, metrics }) => <article className="insurance-ytd-group-card" key={group}>
          <h3>{group}</h3>
          <div className="insurance-ytd-group-metrics">{metrics.map(({ label, value, kind }) => <div className="insurance-ytd-group-metric" key={label}>
            <span>{label}</span>
            <strong>{value === null ? (kind === 'amount' ? 'LKR 0' : '0') : kind === 'amount' ? `LKR ${amountFormat.format(value)}` : quantityFormat.format(value)}</strong>
          </div>)}</div>
        </article>)}</div>
        {otherInsuranceMetrics.length > 0 && <div className="insurance-ytd-other-grid">{otherInsuranceMetrics.map(({ label, value, kind }) => <article className="insurance-ytd-card" key={label}>
          <span>{label}</span>
          <strong>{value === null ? (kind === 'amount' ? 'LKR 0' : '0') : kind === 'amount' ? `LKR ${amountFormat.format(value)}` : quantityFormat.format(value)}</strong>
        </article>)}</div>}
      </> : <p className="insurance-ytd-empty">No year to date insurance data is available for this branch.</p>}
      <p className="insurance-ytd-source">Source: insurance_report_ytd.csv</p>
    </section>
    <ProfitabilityAnalytics reports={reports} summaryOnly />
    <LoansAnalytics reports={reports} branchName={branchName} />
    <SavingsAnalytics reports={reports} branchName={branchName} />
    <MonthlyCommunityReports reports={reports} />

  </PageShell>;
}
