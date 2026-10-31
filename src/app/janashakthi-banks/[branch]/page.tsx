import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import ProfitabilityAnalytics from '../ProfitabilityAnalytics';
import LoansAnalytics from '../LoansAnalytics';
import SavingsAnalytics from '../SavingsAnalytics';
import MembershipAnalytics from '../MembershipAnalytics';
import MonthlyCommunityReports from '../MonthlyCommunityReports';
import { branchSlug, readBranchNames, readSummaryReports } from '../reportData';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: Promise<{ branch: string }> }) {
  return params.then(({ branch }) => {
    const name = readBranchNames().find((candidate) => branchSlug(candidate) === branch);
    return { title: name ? `${name} Bank Branch | Janashakthi Banks` : 'Bank Branch | Janashakthi Banks' };
  });
}

export default async function BankBranchPage({ params }: { params: Promise<{ branch: string }> }) {
  const { branch: branchParam } = await params;
  const branchName = readBranchNames().find((candidate) => branchSlug(candidate) === branchParam);
  if (!branchName) notFound();
  const branchContact = {
    phone: '+94 11 234 5678',
    email: `${branchParam}@janashakthibanks.lk`,
    manager: 'Branch Manager (placeholder)',
    address: `${branchName} Janashakthi Bank Society, Sri Lanka (placeholder address)`,
  };

  const reports = readSummaryReports().map((report) => {
    const branch = report.branches.find((item) => item.name.toLowerCase() === branchName.toLowerCase());
    return branch ? { ...report, branches: [branch], loans: branch.loans, savings: branch.savings, membership: branch.membership } : { ...report, branches: [], loans: { ...report.loans, outstandingLoanAmount: null, numberOfBorrowers: null, monthlyLoanDisbursement: null, monthlyBorrowerCount: null, atRiskLoanAmount: null, parPercentage: null, totalArrearsLoanAmount: null, numberOfArrearsBorrowers: null }, savings: { totalSavingsAmount: null, savingsMembers: null }, membership: Object.fromEntries(Object.keys(report.membership).map((key) => [key, null])) as typeof report.membership };
  });

  return <PageShell label="JANASHAKTHI BANKS · BRANCH" image={{ src: '/images/wdf-img-4.jpeg', alt: 'Women gathered around records at a community banking meeting' }} title={<>{branchName}, <em>community finance.</em></>}>
    <p className="branch-back-link"><a href="/janashakthi-banks">← All Janashakthi branches</a></p>
    <section className="branch-contact-layout" aria-label={`${branchName} branch contact details`}>
      <div className="branch-contact-details">
        <div className="section-label">BRANCH CONTACT</div>
        <h2>Visit or get in touch</h2>
        <dl>
          <div><dt>Branch phone</dt><dd><a href={`tel:${branchContact.phone.replaceAll(' ', '')}`}>{branchContact.phone}</a></dd></div>
          <div><dt>Branch email</dt><dd><a href={`mailto:${branchContact.email}`}>{branchContact.email}</a></dd></div>
          <div><dt>Branch manager</dt><dd>{branchContact.manager}</dd></div>
          <div><dt>Branch address</dt><dd>{branchContact.address}</dd></div>
        </dl>
        <p className="branch-placeholder-note">Contact details shown are mock data and will be updated when confirmed information is available.</p>
      </div>
      <div className="branch-map">
        <iframe title={`Map to ${branchName} branch`} src={`https://maps.google.com/maps?q=${encodeURIComponent(`${branchName}, Sri Lanka`)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
    <ProfitabilityAnalytics reports={reports} summaryOnly />
    <LoansAnalytics reports={reports} branchName={branchName} />
    <SavingsAnalytics reports={reports} branchName={branchName} />
    <MonthlyCommunityReports reports={reports} />

  </PageShell>;
}
