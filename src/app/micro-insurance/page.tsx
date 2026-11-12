import type { Metadata } from 'next';
import Link from 'next/link';
import ResponsiveImage from '@/components/ResponsiveImage';
import Arrow from '@/components/Arrow';
import { readBranches, readInsuranceYtdReports } from '../janashakthi-banks/reportData';
import InsuranceYtdSummary from './InsuranceYtdSummary';

export const metadata: Metadata = {
  title: 'Micro Insurance',
  description: 'Learn about WDF’s community-based approach to social security and how to enquire about available insurance services.',
};

export const dynamic = 'force-dynamic';

const faqs = [
  {
    question: 'What is micro insurance?',
    answer: 'Micro insurance refers to protection services designed with the needs of people on lower incomes in mind. The exact cover and terms depend on each policy. WDF can share current policy information when you enquire.',
  },
  {
    question: 'Who can enquire about WDF’s insurance services?',
    answer: 'Anyone interested in learning about available services can contact WDF or speak with their relevant Janashakthi Bank Society. Eligibility, if applicable, is determined by the terms of each policy.',
  },
  {
    question: 'What insurance policies are available?',
    answer: 'The supplied Social Protection Division translation names Loan Insurance, Housing Loan Insurance, Divisarana Social Protection, Savings Relief Protection, Treasurer’s Insurance, Bank Insurance, Building Insurance and Health Insurance. Contact WDF to confirm current availability and terms.',
  },
  {
    question: 'How can I obtain policy information?',
    answer: 'Contact WDF directly or ask your relevant Janashakthi Bank Society to help you find information about currently available services. Ask for the policy terms before making a decision.',
  },
  {
    question: 'Where can I get assistance?',
    answer: 'Call WDF on 047-2220499 or 047-2221022, email hwdf94@yahoo.com, or use the Contact Us page to find the Federation’s address and enquiry details.',
  },
];

const schemes = [
  { name: 'Loan Insurance', audience: 'Janashakthi Bank Society members with self-employment, cultivation, housing, fishing, chena cultivation or consumer loans.', summary: 'The source describes protection against specified events that can affect a borrower or a loan-funded project.', details: 'The translation lists death or permanent disability of the member or business operator, droughts and floods, robbery or theft of project assets, and project destruction by fire. For self-employment, cultivation and housing loans, it gives contribution rates of 3% up to LKR 49,999, 2% from LKR 50,000 to LKR 99,999, and 1% above LKR 100,000. It separately lists 2% for fishing and chena cultivation loans and 1.5% for consumer loans. It notes that fishing-trip losses are not compensated and that chena losses from lack of rain or roaming animals are excluded. The Bank Society is described as contributing 1% of the loan amount to WDF’s insurance fund, and compensation on a member’s behalf is paid to the Bank Society. The source also describes a 10% reward for a member after five consecutive loan cycles without compensation, and a possible 10% member-welfare allocation to a society that receives no compensation during the relevant year, subject to its board’s agreement. Confirm conditions and current rates with WDF.' },
  { name: 'Housing Loan Insurance', audience: 'Housing loan borrowers.', summary: 'Listed as one of the eight schemes in the source translation.', details: 'The supplied translation does not give a separate description of this scheme. Contact WDF for its current coverage, contributions and eligibility.' },
  { name: 'Divisarana Social Protection', audience: 'The source describes a member’s family as the mother, father and unmarried children.', summary: 'A community scheme described as collecting small member contributions, with support from village assistant coordinators.', details: 'The translation states a LKR 100 membership fee and contributions of LKR 50 monthly, LKR 275 for six months or LKR 550 yearly. It says cover starts six months after the completed application and payment are submitted to the Bank Society. Hospitalisation support is listed as LKR 200 per day after more than five days, for up to 10 days, with a LKR 3,000 maximum; the source says this benefit is payable once per year. It also lists LKR 5,000 for a family death, and surgery benefits of LKR 25,000 for heart, brain and kidney surgeries; LKR 10,000 for cancer-related surgery and hysterectomy; and LKR 5,000 for kidney-stone removal and related kidney-cleaning procedures. A further heart-related surgery is unclear in the source, which lists LKR 10,000 at a government hospital and LKR 25,000 at a private hospital. Only one listed surgery benefit is payable in a year. A 10% no-claim reward after five years is also described. The stated hospital amounts do not align mathematically, and one surgery name is unclear. Confirm all details with WDF.' },
  { name: 'Savings Relief Protection', audience: 'Members who maintain savings with a Janashakthi Bank Society.', summary: 'The source describes this scheme as automatically available to qualifying savers, with no member contribution.', details: 'The translation states a minimum LKR 5,000 savings balance held for at least 90 days. It describes support in connection with the death of a member or specified relatives, and educational assistance for a child passing the Grade 5 Scholarship Examination or qualifying for university or a college of education. It says benefits increase with savings. Current eligibility and benefit amounts should be confirmed with WDF.' },
  { name: 'Treasurer’s Insurance', audience: 'Treasurers of women’s societies who collect and hold member funds before handover.', summary: 'The source describes protection against financial loss while collected money is held or transported.', details: 'Listed circumstances include theft from a residence, robbery while transporting funds, loss or damage from sudden fire, flooding or similar natural disasters, and loss caused by a terrorist act. The translation states a Bank Society contribution of LKR 5 per month for each active treasurer and a maximum insurance amount of LKR 25,000. Verify current amounts and conditions with WDF.' },
  { name: 'Bank Insurance', audience: 'Janashakthi Bank Societies.', summary: 'The source describes cover for society money kept in safes and money transported to and from government banks.', details: 'The translation says the premium depends on the amount of money held by Bank Society staff and that annual payment is due to WDF before 31 January. It does not specify a rate. Contact WDF for current terms.' },
  { name: 'Building Insurance', audience: 'Janashakthi Bank Societies with completed buildings and equipment.', summary: 'The source describes protection for Bank Society buildings and equipment.', details: 'Listed circumstances include fire, hostile acts, riots, civil commotion, malicious acts, cyclones, floods, electrical faults, vehicle impact and explosions. The translation states a one-year premium of LKR 0.40 against value, but does not specify the calculation unit. Confirm the amount and current terms with WDF.' },
  { name: 'Health Insurance', audience: 'The source describes permanent female staff of Janashakthi Bank Societies, the Viharamaha Devi Human Resources Centre and WDF.', summary: 'A staff health scheme described as paying medical examination costs.', details: 'The translation says the scheme is funded by contributions equal to 1% of annual profits from profitable Bank Societies and the named institutions, and states a maximum of LKR 100,000 per employee. Confirm current eligibility and limits with WDF.' },
];

export default function MicroInsurancePage() {
  const insuranceReports = readInsuranceYtdReports();
  const insuranceByBranch = new Map(insuranceReports.map((report) => [report.branchName.toLowerCase(), report.metrics]));
  const insuranceBranches = readBranches().map((branch) => ({
    name: branch.name,
    district: branch.district,
    division: branch.division,
    metrics: insuranceByBranch.get(branch.name.toLowerCase()) ?? [],
  }));

  return (
    <main className="page micro-insurance">
      <section className="micro-hero">
        <div className="micro-hero-copy">
          <div className="eyebrow">WOMEN’S DEVELOPMENT FEDERATION · HAMBANTOTA</div>
          <h1>Micro<br /><em>Insurance</em></h1>
          <p className="hero-lead">Protecting families. Strengthening communities. Building financial security.</p>
          <p>At the Women’s Development Federation, we believe that families should have access to support and protection when unexpected challenges arise. Through our community-based development network, we work to strengthen social security and improve the financial resilience of women and their families.</p>
          <div className="actions"><Link className="btn dark" href="/contact">Contact WDF <Arrow /></Link><a className="btn ghost" href="#policies">Explore insurance services</a></div>
          <div className="micro-hero-note"><span>COMMUNITY-LED</span><span>ROOTED IN SOCIAL DEVELOPMENT</span></div>
        </div>
        <div className="micro-hero-image"><ResponsiveImage src="/images/wdf-img-21.jpeg" alt="Women members meeting and sharing together in their community" /></div>
      </section>

      <InsuranceYtdSummary branches={insuranceBranches} />

      <section className="section micro-introduction">
        <div className="section-label">01 / WHY PROTECTION MATTERS</div>
        <div className="micro-intro-grid">
          <h2>Security that starts with <em>people.</em></h2>
          <div><p className="large-copy">An unexpected event can put pressure on a household’s finances and wellbeing. Accessible protection can help families understand their options and plan for difficult circumstances.</p><p>The source document explains that poverty can keep low-income families from accessing conventional insurance, even when illness, accidents, death or natural disasters threaten their livelihoods and savings. It describes WDF’s Social Protection Division as developing schemes for people on lower incomes, with Janashakthi Bank Societies helping connect members with community-based support.</p><p>These aims connect financial inclusion with family stability: reducing sudden financial strain, helping protect savings and living standards, and supporting people who have limited access to conventional financial services.</p></div>
        </div>
        <div className="protection-ribbon" aria-label="How protection supports families"><span>Prepare for uncertainty</span><i>✳</i><span>Reduce household strain</span><i>✳</i><span>Build resilience together</span></div>
      </section>

      <section className="section micro-policies" id="policies">
        <div className="section-label">02 / OUR INSURANCE POLICIES</div>
        <div className="micro-section-heading"><div><h2>Eight schemes.<br /><em>Community protection.</em></h2></div><p>The supplied translation describes the schemes below and includes historical contribution rates, benefits and eligibility. Open a scheme for the source outline. Confirm current availability and full policy terms with WDF before relying on any figures.</p></div>
        <div className="micro-schemes">{schemes.map((scheme, index) => <details className="micro-scheme" key={scheme.name}><summary><span className="micro-scheme-number">0{index + 1}</span><span className="micro-scheme-title"><b>{scheme.name}</b><small>{scheme.summary}</small></span><span className="micro-scheme-toggle" aria-hidden="true">+</span></summary><div className="micro-scheme-content"><p><b>Described for</b>{scheme.audience}</p><p><b>Source document details</b>{scheme.details}</p><Link className="text-link" href="/contact">Ask WDF about current terms <Arrow /></Link></div></details>)}</div>
        <p className="policy-note">These are historical statements from the supplied English translation. They are shown as source information, not a confirmation of current policy terms.</p>
      </section>

      <section className="micro-purpose">
        <div className="micro-purpose-image"><ResponsiveImage src="/images/wdf-img-4.jpeg" alt="Janashakthi Bank Society members working together around records" /></div>
        <div className="micro-purpose-copy"><div className="section-label light">03 / SUPPORTING FAMILY RESILIENCE</div><h2>Protection is part of a <em>stronger safety net.</em></h2><p>The source document frames microinsurance as affordable protection against unexpected risks, helping low-income households manage illness, accidents, death and natural disasters.</p><ul><li>Reduce the financial burden of sudden events</li><li>Help protect family income and savings</li><li>Support financial risk management</li><li>Connect underserved households with financial services</li></ul><p className="micro-qualification">These are the objectives described in the source document. Scheme benefits and eligibility depend on current official terms from WDF.</p></div>
      </section>

      <section className="section micro-network">
        <div className="section-label">04 / ACCESS THROUGH OUR COMMUNITY NETWORK</div>
        <div className="micro-network-grid"><div><h2>Local relationships.<br /><em>Shared progress.</em></h2><p className="large-copy">WDF works through a network connected to Janashakthi Bank Societies, women’s groups and members.</p></div><div><p>The source document describes village assistant coordinators supporting Divisarana contributions and identifies Janashakthi Bank Societies as the place where applications and payments may be submitted for that scheme. WDF’s wider organizational materials describe these societies as part of its community-based approach.</p><p>For current information, contact WDF or your relevant Janashakthi Bank Society. Ask which schemes are currently offered and request the official policy terms, including eligibility, contributions, benefits, exclusions and any application steps.</p><Link className="text-link" href="/janashakthi-banks">Learn about Janashakthi Banks <Arrow /></Link></div></div>
      </section>

      <section className="section micro-document-notes">
        <div className="section-label">05 / MORE FROM THE SOURCE DOCUMENT</div>
        <div className="micro-section-heading"><div><h2>Why the schemes <em>began.</em></h2></div><p>The translation places WDF’s social protection work in the context of community finance and the risks faced by members.</p></div>
        <div className="micro-document-grid"><article><span>ORIGINS</span><h3>A response to real risks</h3><p>The document says WDF was established in 1989. It describes early Janashakthi Bank Societies and women’s societies in Hambantota and Sooriyawewa, and the challenges of protecting savings and recovering loans in remote communities with limited resources.</p></article><article><span>OVERALL OBJECTIVE</span><h3>Affordable protection</h3><p>The stated overall objective is to provide low-income people with financial protection against unexpected risks at an affordable cost. Other listed aims include reducing sudden losses, helping protect family economic stability and living standards, and widening access to insurance and the financial system.</p></article></div>
        <p className="micro-qualification">The translation notes that Housing Loan Insurance is named but not separately described. It also flags an inconsistency in the Divisarana hospitalisation figures, an unclear surgery name and an unspecified calculation unit for the Building Insurance premium. WDF should confirm all historical details before they are presented as current terms.</p>
      </section>

      <section className="section micro-faq">
        <div className="micro-faq-heading"><div className="section-label">06 / FREQUENTLY ASKED QUESTIONS</div><h2>Questions, <em>answered.</em></h2><p>For policy-specific information, WDF is the best place to start.</p></div>
        <div className="micro-faq-list">{faqs.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="micro-contact"><div><div className="section-label light">07 / TALK WITH WDF</div><h2>Find out how you and your family can access protection.</h2><p>Contact the Women’s Development Federation to learn more about its micro insurance services and available policies.</p></div><div className="micro-contact-actions"><Link className="btn light-btn" href="/contact">Contact WDF <Arrow /></Link><span>047-2220499<br />047-2221022<br />hwdf94@yahoo.com</span></div></section>
    </main>
  );
}
