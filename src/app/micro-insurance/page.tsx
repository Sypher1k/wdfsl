import type { Metadata } from 'next';
import Link from 'next/link';
import ResponsiveImage from '@/components/ResponsiveImage';
import Arrow from '@/components/Arrow';

export const metadata: Metadata = {
  title: 'Micro Insurance',
  description: 'Learn about WDF’s community-based approach to social security and how to enquire about available insurance services.',
};

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
    answer: 'The project materials identify insurance as part of WDF’s work, but do not specify current policy names or terms. Please contact WDF for verified, up-to-date information.',
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

export default function MicroInsurancePage() {
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

      <section className="section micro-introduction">
        <div className="section-label">01 / WHY PROTECTION MATTERS</div>
        <div className="micro-intro-grid">
          <h2>Security that starts with <em>people.</em></h2>
          <div><p className="large-copy">An unexpected event can put pressure on a household’s finances and wellbeing. Accessible protection can help families understand their options and plan for difficult circumstances.</p><p>For economically and socially disadvantaged families, clear information and a trusted point of contact matter. WDF’s community connections can help make it easier to ask questions about available services. This sits alongside a wider development approach that links financial inclusion with participation, dignity and social progress.</p></div>
        </div>
        <div className="protection-ribbon" aria-label="How protection supports families"><span>Prepare for uncertainty</span><i>✳</i><span>Reduce household strain</span><i>✳</i><span>Build resilience together</span></div>
      </section>

      <section className="section micro-policies" id="policies">
        <div className="section-label">02 / OUR INSURANCE POLICIES</div>
        <div className="micro-section-heading"><div><h2>Clear information.<br /><em>Informed choices.</em></h2></div><p>WDF’s source materials identify insurance within its work, but do not provide current policy names or policy terms. We’ll share verified information here as it becomes available.</p></div>
        <article className="policy-placeholder">
          <div className="policy-placeholder-top"><span>POLICY INFORMATION</span><span className="policy-status">DETAILS TO BE CONFIRMED BY WDF</span></div>
          <div className="policy-placeholder-body"><div><div className="policy-mark">WDF</div><h3>Available insurance services</h3><p>Contact WDF or your Janashakthi Bank Society to ask which policies are currently available and to receive their official terms.</p></div><dl><div><dt>Policy name</dt><dd>To be confirmed by WDF</dd></div><div><dt>Who it is for</dt><dd>Ask WDF about current eligibility</dd></div><div><dt>Cover and key benefits</dt><dd>Request the official policy information</dd></div></dl></div>
          <div className="policy-placeholder-footer"><span>Policy availability and terms may change.</span><Link className="text-link" href="/contact">Enquire with WDF <Arrow /></Link></div>
        </article>
        <p className="policy-note">No coverage limits, premiums, eligibility rules or claim procedures are stated here because these details have not been verified in the supplied WDF materials.</p>
      </section>

      <section className="micro-purpose">
        <div className="micro-purpose-image"><ResponsiveImage src="/images/wdf-img-4.jpeg" alt="Janashakthi Bank Society members working together around records" /></div>
        <div className="micro-purpose-copy"><div className="section-label light">03 / SUPPORTING FAMILY RESILIENCE</div><h2>Protection is part of a <em>stronger safety net.</em></h2><p>When families can access understandable information about protection, they can make more informed decisions for their household. Community-based social security is one part of a wider effort to support wellbeing and resilience.</p><ul><li>Greater confidence when considering financial choices</li><li>Information and support during difficult circumstances</li><li>Attention to household wellbeing</li><li>Stronger community connections and social security</li></ul><p className="micro-qualification">The support available depends on the terms of each policy; contact WDF for current details.</p></div>
      </section>

      <section className="section micro-network">
        <div className="section-label">04 / ACCESS THROUGH OUR COMMUNITY NETWORK</div>
        <div className="micro-network-grid"><div><h2>Local relationships.<br /><em>Shared progress.</em></h2><p className="large-copy">WDF works through a network connected to Janashakthi Bank Societies, women’s groups and members.</p></div><div><p>WDF’s organizational materials describe Janashakthi Bank Societies as part of the Federation’s community-based approach. Their wider objectives include introducing social-security mechanisms and mobilizing members for social participation. The Federation’s Insurance and Mobilization Division is also identified in its organizational structure.</p><p>If you would like to know about insurance services, contact WDF or speak with your relevant Janashakthi Bank Society. They can direct you to information about what is currently available. Please request the official policy terms; the details and any next steps depend on the particular service.</p><Link className="text-link" href="/janashakthi-banks">Learn about Janashakthi Banks <Arrow /></Link></div></div>
      </section>

      <section className="section micro-faq">
        <div className="micro-faq-heading"><div className="section-label">05 / FREQUENTLY ASKED QUESTIONS</div><h2>Questions, <em>answered.</em></h2><p>For policy-specific information, WDF is the best place to start.</p></div>
        <div className="micro-faq-list">{faqs.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="micro-contact"><div><div className="section-label light">06 / TALK WITH WDF</div><h2>Find out how you and your family can access protection.</h2><p>Contact the Women’s Development Federation to learn more about its micro insurance services and available policies.</p></div><div className="micro-contact-actions"><Link className="btn light-btn" href="/contact">Contact WDF <Arrow /></Link><span>047-2220499<br />047-2221022<br />hwdf94@yahoo.com</span></div></section>
    </main>
  );
}
