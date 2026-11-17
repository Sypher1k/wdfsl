import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import Arrow from '@/components/Arrow';

export const metadata: Metadata = {
  title: 'Special Project',
  description: 'WDF community programmes for young people, children, older people, families and women.',
};

const youthActivities = [
  'Counselling and leadership development',
  'Health, internet-use and drug-prevention awareness',
  'Savings, Deavi loans and support to start businesses',
  'Links to vocational training and opportunities with WDF',
];

const childrenActivities = [
  'Savings and children’s society activities',
  'Public-speaking, art and quiz competitions',
  'Drug-prevention activities and special-day events',
  'Educational trips, excursions and bank-society libraries',
];

const gardenActivities = ['Composting', 'Vegetables and leafy greens', 'Fruit', 'Cow’s milk'];

const enterpriseActivities = [
  'Mushroom cultivation',
  'Traditional sweets and confectionery',
  'Poultry farming and handicrafts',
  'Pepper, gotukola, betel, passion fruit, butterfly pea and aloe vera cultivation',
];

const drugPreventionResults = [
  ['907', 'families surveyed on income and expenditure'],
  ['735', 'families shown ways to save'],
  ['674', 'families encouraged to begin saving'],
  ['490', 'shops reached with awareness'],
  ['290', 'shops stopped selling cigarettes after awareness work'],
  ['36', 'media responses or communications about prevention'],
  ['260', 'people supported to stop or reduce substance use'],
  ['12', 'schools reached through prevention programmes'],
  ['37', 'events where organisers took steps not to serve alcohol'],
];

export default function SpecialProjectPage() {
  return (
    <PageShell
      label="WHAT WE DO / SPECIAL PROJECTS"
      image={{ src: '/images/wdf-img-2.jpeg', alt: 'Children gathered at a community activity' }}
      title={<>Practical support for <em>stronger communities.</em></>}
    >
      <section className="special-intro">
        <div>
          <div className="section-label">A SOCIAL DEVELOPMENT DIVISION</div>
          <h2>Responding to needs across <em>every generation.</em></h2>
        </div>
        <div>
          <p className="large-copy">WDF’s Special Projects Division carries out focused social development work alongside the Federation’s economic programmes.</p>
          <p>Its work includes youth and children’s societies, support for older people, home gardens, drug prevention, rights awareness, livelihood training, special-day activities and partnerships with non-governmental organisations.</p>
          <p>The Division also operates Deavi Hela Bojunhala. “Deavi” and “Deavi Hela Bojunhala” are retained as transliterated names in the supplied translation.</p>
        </div>
      </section>

      <section className="special-stats" aria-label="Programme reach reported in the source translation">
        <div><strong>133</strong><span>Deavi youth societies</span><small>Across 99 Janashakthi Bank Societies</small></div>
        <div><strong>449</strong><span>Children’s societies</span><small>Established through bank societies</small></div>
        <div><strong>572</strong><span>Older people’s societies</span><small>Across the Janashakthi network</small></div>
      </section>
      <p className="special-source-note">These programme counts are reported in the supplied translation. The document does not date them; confirm current figures with WDF.</p>

      <section className="special-section">
        <div className="section-label">01 / YOUNG PEOPLE AND CHILDREN</div>
        <div className="special-heading"><h2>Room to learn, lead <em>and grow.</em></h2><p>Deavi programmes engage young people aged 18–35. Children’s societies bring together children aged 6–16 to develop their abilities, leadership and attitudes, and to help them respond to abuse, exploitation and violence.</p></div>
        <div className="special-program-grid">
          <article><span>DEAVI YOUTH</span><h3>Build confidence and pathways</h3><p>Every other month, Deavi society chairpersons, secretaries and organisers take part in progress reviews. The Division also introduces new programmes and links young people with vocational training.</p><ul>{youthActivities.map((activity) => <li key={activity}>{activity}</li>)}</ul></article>
          <article><span>CHILDREN’S SOCIETIES</span><h3>Encourage talent and wellbeing</h3><p>The programme recognises children’s talents and encourages positive change. The source also describes a “happiness calendar” approach to help children respond positively when a father’s substance use affects family finances.</p><ul>{childrenActivities.map((activity) => <li key={activity}>{activity}</li>)}</ul></article>
        </div>
      </section>

      <section className="special-community-band">
        <div className="section-label light">02 / CONNECTION AND BELONGING</div>
        <div className="special-heading"><h2>Recognising older people. <em>Growing at home.</em></h2><p>Older people’s societies offer a way to reach people who may be isolated, strengthen friendship and companionship, and recognise their contributions.</p></div>
        <div className="special-community-grid">
          <article><span>OLDER PEOPLE</span><h3>Strengthen social connection</h3><p>The translation reports 572 societies for older people across the Janashakthi Bank Society network.</p></article>
          <article><span>HOME GARDENS</span><h3>Support household food</h3><p>Families receive guidance to organise gardens that can supply a range of food for their own use.</p><div className="special-tags">{gardenActivities.map((activity) => <b key={activity}>{activity}</b>)}</div></article>
        </div>
      </section>

      <section className="special-section special-drugs">
        <div className="section-label">03 / “SAY NO TO DRUGS”</div>
        <div className="special-heading"><h2>Prevention through <em>community action.</em></h2><p>Social mobilisation managers in Janashakthi Bank Societies are trained as drug-prevention trainers, then raise awareness in their villages. The source reports the following programme results:</p></div>
        <div className="special-results-grid">{drugPreventionResults.map(([count, label]) => <div key={label}><strong>{count}</strong><span>{label}</span></div>)}</div>
        <p className="special-source-note">These are figures reported in the supplied translation; no reporting period is provided. The source also states that non-communicable diseases account for 83% of community deaths and that smoking causes approximately 50–55 deaths per day, or around 20,000 per year. Those public-health claims are reproduced from the source and have not been independently verified.</p>
      </section>

      <section className="special-enterprise">
        <div className="special-enterprise-copy"><div className="section-label light">04 / LIVELIHOODS AND SUPPORT SERVICES</div><h2>Skills connected to <em>opportunity.</em></h2><p>Through women’s societies, WDF offers training and advice to women who are not currently in business, helping them explore small enterprises they can start from home.</p></div>
        <div className="special-enterprise-list">{enterpriseActivities.map((activity, i) => <div key={activity}><span>0{i + 1}</span><b>{activity}</b></div>)}</div>
      </section>

      <section className="special-section special-partnerships">
        <div className="section-label">05 / RIGHTS AND PARTNERSHIPS</div>
        <div className="special-heading"><h2>Women’s voices in <em>public life.</em></h2><p>The Division takes action on women’s and children’s rights, marks special days and connects communities with support services.</p></div>
        <div className="special-partnership-grid">
          <article><span>WOMEN’S VOICE AND LEADERSHIP SRI LANKA (NEW FACE)</span><h3>Leadership grounded in collective organising</h3><p>Supported by The Asia Foundation, the project trains ten trainers. Its work includes raising awareness of women’s rights, strengthening women’s leadership through community-based organising and feminist principles, and addressing technology-facilitated violence.</p></article>
          <article><span>WOMEN AND MEDIA COLLECTIVE</span><h3>Recognise unpaid care work</h3><p>WDF has partnered with WMC Women and Media Collective on awareness and lecture programmes to build understanding of unpaid care work.</p></article>
        </div>
        <div className="special-days"><b>Community activities also mark</b><span>International Women’s Day</span><span>Sinhala and Tamil New Year</span><span>Religious festivals</span><span>Drug-prevention awareness days</span><span>Tobacco-prevention day</span></div>
      </section>

      <section className="special-contact"><div><div className="section-label light">CONNECTED COMMUNITY WORK</div><h2>Explore WDF’s wider <em>development programmes.</em></h2><p>Learn about the community groups and services that connect with this work.</p></div><div><Link className="text-link" href="/what-we-do/social-mobilisation">Social Mobilisation <Arrow /></Link><Link className="text-link" href="/janashakthi-banks">Janashakthi Banks <Arrow /></Link></div></section>
    </PageShell>
  );
}
