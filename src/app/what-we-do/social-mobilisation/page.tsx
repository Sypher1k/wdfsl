import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import Arrow from '@/components/Arrow';

export const metadata: Metadata = {
  title: 'Social Mobilisation',
  description: 'How WDF supports community-led social mobilisation through small groups, women’s societies and Janashakthi Bank Societies.',
};

const subsystems = [
  ['Five-member small groups / teams', 'Women from approximately 3–50 families form groups in their local communities. Groups elect a leader and meet weekly.'],
  ['Women’s Societies', 'Each small village has a society. The source reports 1,396 small villages or village clusters; societies meet every two weeks.'],
  ['Janashakthi Bank Societies', 'Societies manage small groups and Women’s Societies within their areas and support members’ economic development.'],
  ['Women’s Development Federation', 'WDF oversees and manages social mobilisation across all 109 Janashakthi Bank Societies.'],
];

const groupActivities = [
  'Hold weekly meetings and maintain records.',
  'Establish a group fund and open an account with the Janashakthi Bank Society.',
  'Purchase shares in the Bank Society and increase monthly savings.',
  'Organise labour-sharing activities among members.',
  'Buy consumer goods collectively, distribute them and share the profits.',
  'Promote self-employment activities.',
  'Obtain loans and monitor the progress of loan-funded activities.',
  'Develop model home gardens.',
  'Carry out other activities based on members’ needs and circumstances.',
];

const societyActivities = [
  'Review small-group progress using progress-review grids.',
  'Discuss members’ loan applications and recommend them to the Janashakthi Bank Society.',
  'Organise talks and discussions with officers from relevant support services.',
  'Develop members’ skills through poetry and singing.',
  'Discuss savings and loans with Bank Society officers.',
  'Review projects carried out by WDF.',
  'Monitor progress of the Divisarana Protection Scheme.',
  'Discuss common village issues and concerns.',
];

const pledgeAreas = [
  'Respect parents, teachers and elders', 'Prevent malnutrition', 'Protect mothers and children',
  'Increase family income', 'Improve literacy', 'Maintain health and sanitation',
  'Develop home gardens', 'Prevent substance abuse', 'Promote harmony in families and small groups',
];

const principles = [
  'Live with the community', 'Learn from the community', 'Plan together with the community', 'Work together with the community',
  'Begin with what people already know', 'Use resources people already have', 'Learn through role models and practical experience',
  'Introduce an ongoing process or method rather than isolated activities', 'Work in an integrated way, not in disconnected areas',
  'Adapt to change rather than follow rigid approaches', 'Encourage self-reliance instead of dependency', 'Strengthen collective action',
];

const learningAreas = [
  { title: 'Knowledge', items: 'Human behaviour; gender and women’s social status; poverty and its causes; social mobilisation principles; adult-learning methods; WDF and Janashakthi Bank Society structures and rules; participatory development; rural finance, marketing, technology and savings practices.' },
  { title: 'Skills', items: 'Analyse social and economic factors; apply adult-learning methods; lead discussions; form and engage groups; conduct effective society meetings; leadership and management.' },
  { title: 'Attitudes', items: 'Compassion and trust in communities; social justice; democratic values; scientific thinking; self-reliance and self-confidence; service; empowerment of people living in poverty; gender equality and women’s social advancement.' },
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
          <p className="large-copy">Social mobilisation helps people recognise and use their potential, have a voice, and take part in decisions that affect their communities.</p>
          <p>The revised translation explains that people are creative by nature, but physical, social, economic and political factors can prevent some groups from using their abilities effectively. This can leave them silent, powerless and outside mainstream development. WDF works to awaken communities, help them use their potential for their own and society’s benefit, and support organisations that can advance these aims.</p>
        </div>
      </section>

      <section className="mobilisation-pillars" aria-label="Four connected community structures">
        {['Five-member small groups / teams', 'Women’s Societies', 'Janashakthi Bank Societies', 'Women’s Development Federation'].map((name, i) => (
          <div key={name}><span>0{i + 1}</span><b>{name}</b></div>
        ))}
      </section>

      <section className="mobilisation-section">
        <div className="section-label">01 / FOUR CONNECTED SUBSYSTEMS</div>
        <div className="mobilisation-heading"><h2>Local groups connected <em>across the Federation.</em></h2><p>WDF comprises four interconnected subsystems. The Five-Member Small Groups and Women’s Societies are the two structures established specifically to support social mobilisation.</p></div>
        <div className="mobilisation-systems">{subsystems.map(([name, description], index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{description}</p></article>)}</div>
        <p className="mobilisation-note">The source describes four social and geographical levels, represented by the four subsystems, each with its own roles and responsibilities. Janashakthi Bank Societies manage small groups and Women’s Societies in their areas alongside their economic-development work.</p>
      </section>

      <section className="mobilisation-section mobilisation-community">
        <div className="section-label light">02 / FROM HOUSEHOLDS TO VILLAGES</div>
        <div className="mobilisation-heading"><h2>Small groups grow <em>shared capability.</em></h2><p>Women from approximately 3–50 families voluntarily form a small group in their local area. Members elect a leader, who receives social mobilisation training from WDF.</p></div>
        <div className="mobilisation-feature-grid">
          <article><span>FIVE-MEMBER SMALL GROUPS / TEAMS</span><h3>Learn and act together</h3><p>Through group activities, members develop knowledge, skills and attitudes. Sharing experiences helps them understand the social and economic factors that influence their lives and behaviour.</p><ul>{groupActivities.map((activity) => <li key={activity}>{activity}</li>)}</ul></article>
          <article><span>WOMEN’S SOCIETIES</span><h3>Coordinate village priorities</h3><p>WDF’s programme operates in 1,396 small villages or village clusters. A small village is the smallest community unit reflecting Sri Lanka’s socio-economic characteristics and a practical setting for community organisations and local solutions. Each village has a Women’s Society. Societies meet every two weeks, elect office-bearers each November and train those elected.</p><ul>{societyActivities.map((activity) => <li key={activity}>{activity}</li>)}</ul><p>Assistant Janashakthi Coordinators guide discussions about small-group progress. Groups under each society are assessed and classified using eight recognised criteria.</p></article>
        </div>
        <p className="mobilisation-note mobilisation-community-note">The source reports 15,346 small groups across 109 Janashakthi Bank Societies. Assistant Janashakthi Coordinators guide and educate these groups; they are young, educated women from local villages with experience in the women’s development programme.</p>
        <div className="mobilisation-pledge"><b>The Janashakthi Pledge</b><div><p>The pledge covers 31 areas of family development. It is recited before small-group and Women’s Society meetings to remind members of these areas and encourage them to apply the principles in daily life.</p><ul>{pledgeAreas.map((area) => <li key={area}>{area}</li>)}</ul></div></div>
      </section>

      <section className="mobilisation-section">
        <div className="section-label">03 / COORDINATION AND SUPPORT</div>
        <div className="mobilisation-heading"><h2>Facilitators keep <em>momentum moving.</em></h2><p>The source identifies Assistant Social Mobilisation Managers as important to programme success. Three facilitator categories work within the Federation’s structure to coordinate mobilisation and link plans with local support.</p></div>
        <div className="mobilisation-metrics">
          <div><strong>1,396</strong><span>Assistant Janashakthi Coordinators</span><small>Small village / women’s society level</small></div>
          <div><strong>171</strong><span>Assistant Social Mobilisation Managers</span><small>Janashakthi Bank Society level</small></div>
          <div><strong>30</strong><span>Zonal Coordinators</span><small>Zones of 3–5 bank societies</small></div>
        </div>
        <p className="mobilisation-note">The source lists 1,396 Assistant Janashakthi Coordinators for small-village / Women’s Society level, 171 Assistant Social Mobilisation Managers for Janashakthi Bank Societies, and 30 Zonal Coordinators for zones comprising three to five bank societies.</p>
        <div className="mobilisation-coordination"><article><span>BANK SOCIETY REVIEW</span><h3>Desathi Janashakthikarana</h3><p>Each Bank Society appoints one to three Assistant Social Mobilisation Managers, depending on the number of societies and small groups under their supervision. The Bank Society pays their monthly allowances. It also appoints an Assistant Janashakthi Coordinator from the relevant small village to monitor mobilisation; 15% of its annual profit is allocated to these coordinator allowances.</p><p>Every two weeks, the society’s chairperson and staff, Assistant Social Mobilisation Managers and Assistant Janashakthi Coordinators review progress using analysis grids and compare it with the society mobilisation plan. WDF guides and encourages the facilitators. Bank Societies are evaluated and classified using eight recognised criteria.</p></article><article><span>DIVISION-WIDE PLANNING</span><h3>Connect plans and services</h3><p>The service area is divided into 30 zones, each with a full-time coordinator. One manager and two assistant managers oversee the Division. Annual plans are prepared at society, bank, zonal and Federation levels; the Division monitors targets, ensures follow-up and coordinates other WDF divisions and support units.</p><p>It links village communities with Projects Division work in nutrition, community development, elder support, Divisarana, children’s societies, drug prevention, environmental conservation and home gardens. It also connects them with government health, agriculture and livestock services, District Project Development Centres and projects under various assistance programmes.</p></article></div>
      </section>

      <section className="mobilisation-section mobilisation-training">
        <div className="section-label">04 / FACILITATOR DEVELOPMENT</div>
        <div className="mobilisation-heading"><h2>Training begins <em>with the community.</em></h2><p>WDF trains facilitators in 12 principles that centre local knowledge, participation and self-reliance.</p></div>
        <div className="mobilisation-principles">{principles.map((principle, i) => <div key={principle}><span>{String(i + 1).padStart(2, '0')}</span>{principle}</div>)}</div>
        <div className="mobilisation-learning">{learningAreas.map((area) => <article key={area.title}><h3>{area.title}</h3><p>{area.items}</p></article>)}</div>
      </section>

      <section className="mobilisation-results">
        <div><div className="section-label light">05 / PROGRESS REVIEW</div><h2>Review progress.<br /><em>Strengthen what needs support.</em></h2><p>WDF says effective mobilisation needs a systematic monitoring process that is regularly reviewed and improved. Monitoring is continuous from small groups to the Federation. It follows annual mobilisation plans and uses indicators, criteria and standards developed through practical experience. Members take part in this review, and WDF’s experience is that challenges can be addressed through open discussion and dialogue.</p><p>To improve performance, WDF prepares targeted plans and assigns experienced Social Mobilisation Managers to support weaker groups and societies through focused programmes called Intensive Social Mobilisation Plans.</p></div>
        <div className="mobilisation-results-grid"><div><strong>18.76%</strong><span>Members in Grade A</span></div><div><strong>30%</strong><span>Groups in Grade A</span></div><div><strong>35.03%</strong><span>Societies in Grade A</span></div><div><strong>87.5%</strong><span>Borrowers in Grade A</span></div><small>Progress figures reported for August 2026 in the supplied translation.</small></div>
      </section>

      <section className="mobilisation-next"><div><div className="section-label">CONNECTED WORK</div><h2>Community institutions support <em>shared progress.</em></h2><p>Explore the Janashakthi Bank Society network and WDF’s wider community programmes.</p></div><div><Link className="text-link" href="/janashakthi-banks">Explore Janashakthi Banks <Arrow /></Link><Link className="text-link" href="/projects">Explore WDF projects <Arrow /></Link></div></section>
    </PageShell>
  );
}
