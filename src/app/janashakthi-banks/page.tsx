import PageShell from '@/components/PageShell';
import ProfitabilityAnalytics from './ProfitabilityAnalytics';
import LoansAnalytics from './LoansAnalytics';
import SavingsAnalytics from './SavingsAnalytics';
import MembershipAnalytics from './MembershipAnalytics';
import { readBranches, readSummaryReports } from './reportData';
import BranchDirectory from './BranchDirectory';

export const metadata = { title: 'Janashakthi Banks' };
export const dynamic = 'force-dynamic';

export default function BankPage() {
  const regions = new Map<string, { district: string; division: string }>(readBranches().map(({ name, district, division }) => [name, { district, division }]));
  const profitabilityReports = readSummaryReports().map((report) => ({
    ...report,
    branches: report.branches.map((branch) => ({ ...branch, ...regions.get(branch.name) })),
  }));
  return <PageShell label="JANASHAKTHI BANKS" image={{ src: '/images/wdf-img-4.jpeg', alt: 'Women gathered around records at a community banking meeting' }} title={<>Community finance, <em>built from within.</em></>}>
    <section className="bank-governance">
      <div className="section-label">01 / GOVERNANCE AND OPERATIONS</div>
      <div className="bank-governance-intro">
        <h2>Local responsibility.<br /><em>Shared purpose.</em></h2>
        <p>The Women’s Development Federation delegates operational authority and responsibility to Janashakthi Bank Societies so its vision, mission and activities can be carried out locally. The societies put WDF’s objectives into practice by empowering families.</p>
      </div>
      <div className="bank-meeting-grid">
        <article><span>01</span><b>Board of Management</b><small>Meets every two weeks</small></article>
        <article><span>02</span><b>Monday meetings</b><small>Weekly staff planning and review</small></article>
        <article><span>03</span><b>Fortnightly meetings</b><small>Regular operational review</small></article>
        <article><span>04</span><b>Women’s Society meetings</b><small>Member and society coordination</small></article>
        <article><span>05</span><b>Zonal and family meetings</b><small>Regional and household connection</small></article>
      </div>
      <div className="bank-governance-detail">
        <article>
          <span>BOARD OF MANAGEMENT</span>
          <p>The Board includes honorary women’s-society chairpersons, bank-society staff and supervisory officers, including the Zonal Audit Secretary and Zonal Coordinator.</p>
          <ul><li>Approve customer enrolment, payments supported by the relevant management papers, and loans.</li><li>Present and review the society’s financial position.</li><li>Supervise staff performance and consider legal action on overdue loans.</li><li>Maintain PAR at 0%, as stated in the source translation.</li></ul>
        </article>
        <article>
          <span>MONDAY STAFF MEETINGS</span>
          <p>All bank-society staff attend with the Zonal Audit Secretary and Zonal Coordinator.</p>
          <ul><li>Set work targets for the coming week.</li><li>Review progress from the previous week.</li><li>Guide actions that support the society’s profitability.</li></ul>
        </article>
      </div>
    </section>
    <div className="content-grid">
      <div><h3>Purpose</h3><p>The Bank Society objectives include increasing family savings, providing loans for income generation, emergencies and housing, introducing social-security mechanisms, mobilizing members for social participation and bringing women together within a strong economic organization.</p></div>
      <div><h3>Membership</h3><p>The supplied Bank Development document describes group-based membership, a minimum LKR 500 share and loan eligibility after one month of membership, subject to the stated conditions.</p></div>
    </div>
    <div className="table-wrap"><table><thead><tr><th>Savings product</th><th>Annual interest</th><th>Accounting</th></tr></thead><tbody>{[['Member Shares', '4%', 'Annual'], ['Member Deposits', '3%', 'Quarterly / semi-annual'], ['Group Deposits', '3%', 'Quarterly / semi-annual'], ['Amma Deposits', '3%', 'Quarterly / semi-annual'], ['Amma Contract Deposit', '4%', 'Quarterly; paid after five years'], ['Senehasa Deposits', '3%', 'Quarterly / semi-annual'], ['Open Deposits', '3%', 'Quarterly / semi-annual']].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    <p className="source-note">Product terms above are taken from the supplied Bank Development translation and should be verified with WDF before being treated as current rates.</p>
    <ProfitabilityAnalytics reports={profitabilityReports} />
    <LoansAnalytics reports={profitabilityReports} />
    <SavingsAnalytics reports={profitabilityReports} />
    <MembershipAnalytics reports={profitabilityReports} />
    <BranchDirectory />
  </PageShell>;
}
