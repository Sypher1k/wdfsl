import PageShell from '@/components/PageShell';
import ProfitabilityAnalytics from './ProfitabilityAnalytics';
import LoansAnalytics from './LoansAnalytics';
import SavingsAnalytics from './SavingsAnalytics';
import MembershipAnalytics from './MembershipAnalytics';
import { readBranches, readSummaryReports } from './reportData';
import BranchDirectory from './BranchDirectory';

export const metadata = { title: 'Janashakthi Banks' };
export const dynamic = 'force-dynamic';

const societyObjectives = [
  'Increase savings among member families.',
  'Provide loans to develop existing income sources and establish new income-generating activities.',
  'Provide emergency and housing-development loans.',
  'Introduce social-protection schemes.',
  'Promote social mobilisation among members.',
  'Help free members from high-interest rural and urban moneylenders.',
  'Bring women together in a strong economic organisation.',
];

const savingsProducts = [
  ['Member shares', '4%', 'Calculated annually and credited to the account. The source also states that a 25% dividend is payable when profit exceeds LKR 100,000.'],
  ['Member deposits', '3%', 'Calculated quarterly and credited half-yearly.'],
  ['Group deposits', '3%', 'Calculated quarterly and credited half-yearly.'],
  ['Amma deposits (voluntary)', '3%', 'Calculated quarterly and credited half-yearly.'],
  ['Amma committed deposits (investment savings scheme)', '4%', 'Calculated quarterly and paid after five years; a 3% reward on the balance is stated at the end of five years.'],
  ['Senehasa deposits', '3%', 'Calculated quarterly and credited half-yearly.'],
  ['Open deposits', '3%', 'Calculated quarterly and credited half-yearly.'],
] as const;

const loanProducts = [
  ['1', 'Cultivation loan (paddy)', '50,000', '500,000', '6 months', '24%; reducing-balance method', '3% to 1%'],
  ['2', 'Business loan', '50,000', '500,000', '1–5 years', '24%; reducing-balance method', '3% to 1%'],
  ['3', 'Housing loan', '100,000*', '300,000', '3–4 years', '24%; reducing-balance method', '3%'],
  ['4', 'Super loan', '50,000', '100,000', '3 years', '24%; reducing-balance method', '1.5% to 1%'],
  ['5', 'Sanitation loan', '7,500', '25,000', '6 months–2 years', '24%; reducing-balance method', 'Not clearly shown'],
  ['6', 'Savings loan', 'Up to 90% of savings', '—', '1–3 years', 'Reducing-balance method; rate unclear', 'Not clearly shown'],
  ['7', 'Festival loan (staff)', '—', '35,000', '10 months', '6%; reducing-balance method', 'Not clearly shown'],
  ['8', 'Festival loan (member)', '—', '35,000', '10 months', '6%; reducing-balance method', '2%'],
  ['9', 'Motorcycle loan (staff)', '—', '400,000', '5 years', '13%; reducing-balance method', 'Not clearly shown'],
  ['10', 'Motorcycle loan (member)', '—', '400,000', '5 years', '24%; reducing-balance method', 'Not clearly shown'],
  ['11', 'Amma housing loan', '20,000', '300,000', '1–5 years', '24%; reducing-balance method', 'Not clearly shown'],
  ['12', 'Education loan (computer)', '—', '250,000', '5 years', '24%; reducing-balance method', '1%'],
  ['13', 'Education loan (school equipment)', '—', '300,000', '1 year', '24%; reducing-balance method', '1%'],
  ['14', 'Mobile phone loan (staff)', '—', '300,000', '1 year', '24%; reducing-balance method', 'Not clearly shown'],
  ['15', 'Spectacles loan (staff)', '—', '10,000', '10 months', '13%; reducing-balance method', 'Not clearly shown'],
  ['16', 'Bicycle loan (staff)', '—', '500,000', '3 years', '24%; reducing-balance method', 'Not clearly shown'],
] as const;

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
    <div className="bank-source-sections">
      <section className="bank-source-block">
        <div className="section-label">02 / SOCIETY OBJECTIVES</div>
        <h2>Economic strength with <em>social purpose.</em></h2>
        <p>Article 5 of the Janashakthi Bank Society by-laws, under Article 12 of the Women’s Development Federation constitution, sets out these objectives:</p>
        <div className="bank-objective-grid">{societyObjectives.map((objective, index) => <div key={objective}><span>{String(index + 1).padStart(2, '0')}</span><b>{objective}</b></div>)}</div>
      </section>

      <section className="bank-source-block bank-member-capital">
        <div className="section-label">03 / MEMBERSHIP AND CAPITAL</div>
        <div className="bank-source-two-col">
          <article><h2>Becoming a <em>member.</em></h2>
            <ul>
              <li>Women who belong to a rural women’s society may apply as a group. Close blood relatives or close relatives in the same family may not join as one group.</li>
              <li>Each member must purchase at least one LKR 500 share, payable in instalments or as a single payment.</li>
              <li>Application forms are available from the Bank Society or rural women’s society. Each small-group member completes an individual application; the group leader also submits a separate application and the group’s share money through the treasurer.</li>
              <li>The treasurer gives the money to the Bank Society manager. Membership is then recorded in the accounts and records; the application register also serves as the membership register.</li>
              <li>Each female member nominates a successor or beneficiary. A member may apply for a loan one month after joining.</li>
              <li>If a member moves, dies or goes abroad while money is owed, the outstanding amount may be recovered from her account and the balance released. Written authorisation must be obtained first.</li>
              <li>If the Board removes a member or she resigns for a special reason, the Board may decide whether to refund share capital after seeking Head Office guidance. The Board has final authority over membership.</li>
              <li>The Board may pay interest on share capital while the Bank Society is profitable.</li>
            </ul>
          </article>
          <article><h2>Sources of <em>capital.</em></h2>
            <ul><li>Shares contributed by members.</li><li>Savings from members and non-members.</li><li>Local and foreign grants.</li><li>External loan funds.</li></ul>
            <p>Janashakthi Bank Societies cannot borrow directly from external institutions. External loans and grants must be obtained through the Women’s Development Federation and require approval from its Executive Committee.</p>
          </article>
        </div>
      </section>

      <section className="bank-source-block bank-profit-definition">
        <div className="section-label">04 / PROFITS</div>
        <h2>Profit after <em>expenses and audit.</em></h2>
        <p>The translation defines “profits” as the surplus remaining after all expenses have been paid, following a half-yearly or annual audit.</p>
      </section>

      <section className="bank-source-block">
        <div className="section-label">05 / SAVINGS PRODUCTS</div>
        <h2>Saving through the <em>Bank Society.</em></h2>
        <div className="table-wrap bank-source-table"><table><thead><tr><th scope="col">Savings type</th><th scope="col">Annual interest rate</th><th scope="col">Interest calculation / crediting</th></tr></thead><tbody>{savingsProducts.map(([name, rate, terms]) => <tr key={name}><th scope="row">{name}</th><td>{rate}</td><td>{terms}</td></tr>)}</tbody></table></div>
        <p className="source-note">Rates, dividend and payment terms are reproduced from the supplied translation. Confirm current terms with WDF before relying on them as current products or offers.</p>
      </section>

      <section className="bank-source-block">
        <div className="section-label">06 / LOAN PRODUCTS</div>
        <h2>Loan types and <em>translated terms.</em></h2>
        <p>The table below follows the loan types and terms in the source. Dashes and “Not clearly shown” preserve values that were missing or unclear in the original table.</p>
        <div className="table-wrap bank-source-table bank-loan-product-table"><table><thead><tr><th scope="col">No.</th><th scope="col">Loan type</th><th scope="col">Minimum (LKR)</th><th scope="col">Maximum (LKR)</th><th scope="col">Repayment period</th><th scope="col">Interest rate / method</th><th scope="col">Annual loan-insurance contribution</th></tr></thead><tbody>{loanProducts.map(([number, name, minimum, maximum, period, rate, insurance]) => <tr key={number}><td>{number}</td><th scope="row">{name}</th><td>{minimum}</td><td>{maximum}</td><td>{period}</td><td>{rate}</td><td>{insurance}</td></tr>)}</tbody></table></div>
        <p className="source-note">The source’s housing-loan minimum appears to be LKR 100,000, though its printed number formatting is inconsistent. Confirm this figure. The source also states a LKR 500,000 revolving-loan limit; confirm its intended interpretation. Some original table cells were misaligned or incomplete, so unclear values have not been inferred.</p>
      </section>

      <section className="bank-source-block bank-loan-conditions">
        <div className="section-label">07 / MEMBER LOAN CONDITIONS</div>
        <h2>Conditions for <em>member borrowing.</em></h2>
        <p>The source lists the following conditions for issuing loans to members:</p>
        <ul><li>Required share capital, deposits and group funds for the relevant loan amount must be fully in place.</li><li>The relevant business must be operating, and the member must have alternative income sources.</li><li>The applicant must be an A-grade member and an A-grade borrower.</li><li>The member must participate in her women’s society and small group.</li><li>The member’s total revolving loan balance must remain within the LKR 500,000 limit stated in the source.</li></ul>
      </section>
      <p className="bank-source-disclaimer">All savings rates, loan amounts, interest rates, insurance contributions, dividend statements and eligibility terms above are reproduced from the supplied Bank Development translation. Confirm current policies and terms with the Women’s Development Federation before making financial decisions.</p>
    </div>
    <ProfitabilityAnalytics reports={profitabilityReports} />
    <LoansAnalytics reports={profitabilityReports} />
    <SavingsAnalytics reports={profitabilityReports} />
    <MembershipAnalytics reports={profitabilityReports} />
    <BranchDirectory />
  </PageShell>;
}
