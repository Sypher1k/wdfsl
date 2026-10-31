import PageShell from '@/components/PageShell';
import ProfitabilityAnalytics from './ProfitabilityAnalytics';
import LoansAnalytics from './LoansAnalytics';
import SavingsAnalytics from './SavingsAnalytics';
import MembershipAnalytics from './MembershipAnalytics';
import { readSummaryReports } from './reportData';
import BranchDirectory from './BranchDirectory';

export const metadata = { title: 'Janashakthi Banks' };
export const dynamic = 'force-dynamic';

export default function BankPage() {
  const profitabilityReports = readSummaryReports();
  return <PageShell label="JANASHAKTHI BANKS" image={{ src: '/images/wdf-img-4.jpeg', alt: 'Women gathered around records at a community banking meeting' }} title={<>Community finance, <em>built from within.</em></>}>
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
