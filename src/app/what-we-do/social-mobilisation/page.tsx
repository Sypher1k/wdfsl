import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import Arrow from '@/components/Arrow';

export const metadata: Metadata = {
  title: 'Social Mobilisation',
  description: 'How WDF connects small groups, women’s societies and Janashakthi Bank Societies to support community-led development.',
};

const levels = [
  ['Women’s Development Federation', 'District level', 'Social Mobilisation Division Manager', 'Weekly and monthly'],
  ['Zone', '3–5 Janashakthi Bank Societies', 'Zonal coordinator', 'Monthly'],
  ['Janashakthi Bank Society', 'Service area of 4–15 small villages', 'Assistant Social Mobilisation Manager', 'Once every two weeks'],
  ['Women’s Society', 'Small-village level', 'Assistant Janashakthi Coordinator', 'Once every two weeks'],
  ['Small Group', 'Household / neighbourhood level', 'Group leader', 'Weekly'],
];

const groupActivities = [
  'Meet weekly, keep records and establish a group fund and bank-society account.',
  'Buy shares in the Janashakthi Bank Society and build monthly savings.',
  'Organise labour exchange and collective purchases of consumer goods.',
  'Strengthen self-employment, access loans and monitor loan-funded activities.',
  'Establish model home gardens and take up other work based on members’ needs.',
];

const societyActivities = [
  'Review small-group progress using progress-review grids.',
  'Discuss and recommend member loan applications to the Janashakthi Bank Society.',
  'Meet support-service officers and discuss savings and loans with bank-society staff.',
  'Review Federation projects and progress of the Divisarana protection scheme.',
  'Build skills through poetry and singing, and discuss shared village matters.',
];

const principles = [
  'Live with the community', 'Learn from the community', 'Plan with the community', 'Work with the community',
  'Start with what people know', 'Build on resources people have', 'Learn through role-modelling and experience',
  'Introduce a process, not an isolated activity', 'Work in an integrated way', 'Accept change and dynamism',
  'Build self-reliance', 'Strengthen collective power',
];

const learningAreas = [
  { title: 'Knowledge', items: 'Human behaviour; gender and women’s social position; poverty and its socio-economic causes; mobilisation principles; adult education; organisational constitutions; participatory development; rural credit, marketing, technology and savings.' },
  { title: 'Skills', items: 'Analyse social and economic forces; use adult-learning methods; facilitate discussion and dialogue; form and engage groups; run society meetings; lead and manage.' },
  { title: 'Attitudes', items: 'Compassion and trust; social justice and democratic values; scientific thinking; self-reliance and self-esteem; service; belief in empowering people; commitment to women’s equality.' },
];

export default function SocialMobilisationPage() {
  return (
    <PageShell
      label="WHAT WE DO / SOCIAL MOBILISATION"
      image={{ src: '/images/wdf-img-18.jpeg', alt: 'Women taking part in a public awareness march' }}
      title={<>Community voice becomes <em>collective action.</em></>}
    >
      <section className="mobilisation-intro">
        <div>
          <div className="section-label">A COMMUNITY-LED APPROACH</div>
          <h2>People shape the <em>development process.</em></h2>
        </div>
        <div>
          <p className="large-copy">WDF’s Social Mobilisation Division works with communities to build awareness, strengthen people’s voice and organise local capacity for development.</p>
          <p>The source translation describes people whose potential is constrained by physical, social, economic and political conditions. Social mobilisation aims to bring people into the development process and build organisations that help them act together.</p>
        </div>
      </section>

      <section className="mobilisation-pillars" aria-label="Four connected community structures">
        {['Small groups of five', 'Women’s societies', 'Janashakthi Bank Societies', 'Women’s Development Federation'].map((name, i) => (
          <div key={name}><span>0{i + 1}</span><b>{name}</b></div>
        ))}
      </section>

      <section className="mobilisation-section">
        <div className="section-label">01 / HOW THE NETWORK WORKS</div>
        <div className="mobilisation-heading"><h2>Local groups connected <em>across levels.</em></h2><p>Small groups and women’s societies are the structures established specifically for social mobilisation. Bank societies coordinate activity in their service areas, while WDF manages the programme across the network.</p></div>
        <div className="mobilisation-table-wrap"><table><thead><tr><th>Organisation</th><th>Area</th><th>Facilitator</th><th>Meeting frequency</th></tr></thead><tbody>{levels.map(([name, area, facilitator, frequency]) => <tr key={name}><th scope="row">{name}</th><td>{area}</td><td>{facilitator}</td><td>{frequency}</td></tr>)}</tbody></table></div>
        <p className="mobilisation-note">The source translation reports 109 Janashakthi Bank Societies and 30 zones. It describes each zone as covering three to five bank societies.</p>
      </section>

      <section className="mobilisation-section mobilisation-community">
        <div className="section-label light">02 / FROM HOUSEHOLDS TO VILLAGES</div>
        <div className="mobilisation-heading"><h2>Small groups grow <em>shared capability.</em></h2><p>Women from approximately 3–50 families voluntarily form a small group in their local area. Members elect a leader, who receives social mobilisation training from WDF.</p></div>
        <div className="mobilisation-feature-grid">
          <article><span>SMALL GROUPS</span><h3>Learn and act together</h3><ul>{groupActivities.map((activity) => <li key={activity}>{activity}</li>)}</ul></article>
          <article><span>WOMEN’S SOCIETIES</span><h3>Coordinate village priorities</h3><p>The translation reports women’s societies in 1,396 small villages or village clusters. Societies meet every two weeks, elect office-bearers each November and provide training for those roles.</p><ul>{societyActivities.map((activity) => <li key={activity}>{activity}</li>)}</ul></article>
        </div>
        <p className="mobilisation-note mobilisation-community-note">The translation reports 15,346 small groups across 109 Janashakthi Bank Societies. Assistant Janashakthi Coordinators support and educate these groups.</p>
        <div className="mobilisation-pledge"><b>The Janashakthi Pledge</b><p>Recited before group and society meetings, the pledge covers 31 matters related to family development, including respect for elders and teachers, nutrition, care for children and mothers, income, literacy, health and sanitation, home gardens, substance-abuse prevention and family harmony.</p></div>
      </section>

      <section className="mobilisation-section">
        <div className="section-label">03 / COORDINATION AND SUPPORT</div>
        <div className="mobilisation-heading"><h2>Facilitators keep <em>momentum moving.</em></h2><p>Janashakthi Bank Societies coordinate and review mobilisation in their service areas. WDF’s Division plans across the network, supports facilitators and connects communities with services and projects.</p></div>
        <div className="mobilisation-metrics">
          <div><strong>1,396</strong><span>Assistant Janashakthi Coordinators</span><small>Small village / women’s society level</small></div>
          <div><strong>171</strong><span>Assistant Social Mobilisation Managers</span><small>Janashakthi Bank Society level</small></div>
          <div><strong>30</strong><span>Zonal Coordinators</span><small>Zones of 3–5 bank societies</small></div>
        </div>
        <p className="mobilisation-note">Facilitator numbers are as stated in the supplied translation. It says coordinators are selected from the small villages concerned and that assistant managers support the programme at bank-society level.</p>
        <div className="mobilisation-coordination"><article><span>BANK SOCIETY REVIEW</span><h3>Desathi Janashakthikarana</h3><p>Every two weeks, society leaders and staff, assistant managers and assistant coordinators review mobilisation status using analysis grids and compare progress with the society plan. The translation says societies are assessed using eight recognised criteria. Each society has one to three assistant managers, depending on its workload, and pays them a monthly allowance. It also says 15% of a society’s annual profit is allocated to assistant coordinator allowances.</p></article><article><span>DIVISION-WIDE PLANNING</span><h3>Connect plans and services</h3><p>Annual plans are prepared at society, bank, zone and Federation levels. A manager and two assistant managers oversee the Division’s work alongside 30 full-time zonal coordinators. The Division monitors targets, arranges follow-up and links communities with WDF projects in areas such as nutrition, elder support, children’s societies, drug prevention, environmental conservation and home gardens, as well as government health, agriculture and livestock services.</p></article></div>
      </section>

      <section className="mobilisation-section mobilisation-training">
        <div className="section-label">04 / FACILITATOR DEVELOPMENT</div>
        <div className="mobilisation-heading"><h2>Training begins <em>with the community.</em></h2><p>WDF trains facilitators in 12 principles that centre local knowledge, participation and self-reliance.</p></div>
        <div className="mobilisation-principles">{principles.map((principle, i) => <div key={principle}><span>{String(i + 1).padStart(2, '0')}</span>{principle}</div>)}</div>
        <div className="mobilisation-learning">{learningAreas.map((area) => <article key={area.title}><h3>{area.title}</h3><p>{area.items}</p></article>)}</div>
      </section>

      <section className="mobilisation-results">
        <div><div className="section-label light">05 / PROGRESS REVIEW</div><h2>Review progress.<br /><em>Strengthen what needs support.</em></h2><p>WDF describes monitoring as an ongoing, participatory process from small-group level to the Federation. Annual plans, indicators and review criteria help identify where follow-up is needed; the source notes that issues can be addressed through dialogue.</p><p>The Division prepares targeted, intensive mobilisation plans and assigns skilled managers to strengthen weaker groups and societies.</p></div>
        <div className="mobilisation-results-grid"><div><strong>18.76%</strong><span>Members in Grade A</span></div><div><strong>30%</strong><span>Groups in Grade A</span></div><div><strong>35.03%</strong><span>Societies in Grade A</span></div><div><strong>87.5%</strong><span>Borrowers in Grade A</span></div><small>Progress figures reported for August 2026 in the supplied translation.</small></div>
      </section>

      <section className="mobilisation-next"><div><div className="section-label">CONNECTED WORK</div><h2>Community institutions support <em>shared progress.</em></h2><p>Explore the Janashakthi Bank Society network and WDF’s wider community programmes.</p></div><div><Link className="text-link" href="/janashakthi-banks">Explore Janashakthi Banks <Arrow /></Link><Link className="text-link" href="/projects">Explore WDF projects <Arrow /></Link></div></section>
    </PageShell>
  );
}
