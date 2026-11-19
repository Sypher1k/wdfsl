import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import Arrow from '@/components/Arrow';

export const metadata: Metadata = {
  title: 'Special Project',
  description: 'WDF programmes for young people, children, older people, families and women across its communities.',
};

const youthActivities = [
  'Psychological counselling',
  'Leadership training',
  'Youth health awareness',
  'Responsible internet-use awareness',
  'Drug-prevention programmes',
];

const childrenActivities = [
  'Encouraging regular savings and running children’s societies',
  'Speech competitions, drawing competitions and quizzes',
  'Drug-prevention and awareness programmes',
  'Special events and celebrations with society members',
  'Educational trips for recreation and learning outside the classroom',
  'Libraries at every Janashakthi Bank Society to support reading habits and skills',
];

const gardenActivities = [
  'Compost pits for organic fertilizer',
  'Vegetables',
  'Fruit',
  'Fresh milk',
  'Leafy vegetables and greens',
];

const enterpriseActivities = [
  'Mushroom cultivation',
  'Traditional sweets and confectionery making',
  'Poultry farming',
  'Handicraft production',
  'Pepper, gotukola, betel, passion fruit, butterfly pea and aloe vera cultivation',
];

const drugPreventionResults = [
  ['907', 'families surveyed about household income and expenditure'],
  ['735', 'families introduced to savings methods'],
  ['674', 'families encouraged to start saving'],
  ['37', 'social and festive events held without alcohol'],
  ['490', 'shops made aware of smoking and substance use harms'],
  ['290', 'shops that stopped selling cigarettes after awareness work'],
  ['36', 'media responses about drug-prevention activities'],
  ['260', 'people who stopped or reduced cigarette, alcohol or drug use'],
  ['12', 'schools reached by drug-prevention programmes'],
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
          <p className="large-copy">The Women’s Development Federation focuses on poverty alleviation and women’s empowerment, with social development as another important part of its work.</p>
          <p>Janashakthi Bank Societies are described as the Federation’s economic arm. The Special Projects Division was established to carry out social development work through specialised community activities.</p>
          <p>Its work includes youth and children’s societies, senior citizens’ societies, home gardening, drug prevention, women’s and children’s rights, special-day activities, support services, vocational training, NGO partnerships and the Devi Hela Bojunhala traditional food outlet.</p>
        </div>
      </section>

      <section className="special-stats" aria-label="Society counts reported in the revised translation">
        <div><strong>133</strong><span>Devi Societies</span><small>Across 99 Janashakthi Bank Societies</small></div>
        <div><strong>449</strong><span>Children’s Societies</span><small>Established through Janashakthi Bank Societies</small></div>
        <div><strong>572</strong><span>Senior Citizens’ Societies</span><small>Across the Janashakthi Bank Societies</small></div>
      </section>
      <p className="special-source-note">These society counts are reported in the revised translation; it does not give a reporting date. Confirm current figures with WDF.</p>

      <section className="special-section">
        <div className="section-label">01 / DEVI YOUTH AND CHILDREN</div>
        <div className="special-heading"><h2>Room to learn, lead <em>and grow.</em></h2><p>The Devi Youth Programme engages young women and men aged 18–35. Children’s Societies bring together children aged 6–16 to develop skills, talents, confidence, positive attitudes and leadership.</p></div>
        <div className="special-program-grid">
          <article><span>DEVI YOUTH</span><h3>Build confidence and pathways</h3><p>Progress-review meetings take place every other month with Devi Society Presidents, Secretaries and Organizers. Progress is reviewed, and new activities are introduced and implemented.</p><ul>{youthActivities.map((activity) => <li key={activity}>{activity}</li>)}</ul><p>Members are encouraged to save regularly, start business ventures and access Devi loans. They form small groups and societies, and are guided towards vocational training and opportunities to work alongside WDF.</p></article>
          <article><span>CHILDREN’S SOCIETIES</span><h3>Encourage talent and wellbeing</h3><p>WDF has established 449 societies through Janashakthi Bank Societies. The programme recognises children’s abilities and supports them to face child abuse, exploitation and violence.</p><ul>{childrenActivities.map((activity) => <li key={activity}>{activity}</li>)}</ul><p>The “Happy Calendar” approach encourages children to respond positively when their fathers’ drug use harms the family’s financial wellbeing, and to motivate their fathers to address drug-related problems.</p></article>
        </div>
      </section>

      <section className="special-community-band">
        <div className="section-label light">02 / CONNECTION AND HOUSEHOLD FOOD</div>
        <div className="special-heading"><h2>Recognising older people. <em>Growing at home.</em></h2><p>Special Projects works to reduce social isolation among older people and provide ways for them to connect with others and take part in community activities.</p></div>
        <div className="special-community-grid">
          <article><span>SENIOR CITIZENS’ SOCIETIES</span><h3>Strengthen social connection</h3><p>The revised translation reports 572 societies across the Janashakthi Bank Societies. Their work supports friendship and social connection, and recognises older people’s contributions and experience.</p></article>
          <article><span>SUSTAINABLE HOME GARDENS</span><h3>Support household food</h3><p>Households receive guidance on developing gardens that produce a variety of food for their own consumption. Families are encouraged to use their gardens to support household food needs.</p><div className="special-tags">{gardenActivities.map((activity) => <b key={activity}>{activity}</b>)}</div></article>
        </div>
      </section>

      <section className="special-section special-drugs">
        <div className="section-label">03 / WOMEN AGAINST DRUGS</div>
        <div className="special-heading"><h2>Prevention through <em>community action.</em></h2><p>The overview calls this the “Women Against Drugs” programme; a later heading in the translation calls it “Say No to Drugs.” Community mobilization officers attached to Janashakthi Bank Societies are trained as drug-prevention trainers, then lead village awareness programmes.</p></div>
        <div className="special-results-grid">{drugPreventionResults.map(([count, label]) => <div key={label}><strong>{count}</strong><span>{label}</span></div>)}</div>
        <p className="special-source-note">The revised translation states that non-communicable diseases account for 83% of community deaths and that smoking causes approximately 50–55 deaths per day, or around 20,000 each year. These figures are attributed to the source and have not been independently verified. Programme results are also source-reported; no reporting period is given.</p>
      </section>

      <section className="special-enterprise">
        <div className="special-enterprise-copy"><div className="section-label light">04 / SUPPORT SERVICES AND LIVELIHOODS</div><h2>Skills connected to <em>opportunity.</em></h2><p>Through community mobilization and Women’s Societies, WDF trains and advises women who are not currently engaged in income-generating activities, helping them start small businesses from home. Advisory and counselling programmes also support women in this work.</p></div>
        <div className="special-enterprise-list">{enterpriseActivities.map((activity, i) => <div key={activity}><span>0{i + 1}</span><b>{activity}</b></div>)}</div>
      </section>

      <section className="special-section special-vocational">
        <div className="section-label">05 / VOCATIONAL TRAINING FOR YOUNG PEOPLE</div>
        <div className="special-heading"><h2>Practical skills for <em>future choices.</em></h2><p>Through Devi Youth Societies, WDF guides young women and men towards suitable vocational training to develop practical skills, knowledge and abilities.</p></div>
        <div className="special-vocational-panel"><p>Training can help young people build work-related skills and explore employment or self-employment opportunities. The Federation connects vocational training with savings, entrepreneurship and other youth-development activities to support economic independence and participation in community development.</p><p>WDF also describes opportunities for young people to engage with and work alongside the Federation.</p></div>
      </section>

      <section className="special-section special-rights">
        <div className="section-label">06 / WOMEN’S AND CHILDREN’S RIGHTS</div>
        <div className="special-heading"><h2>Know rights. Build voice. <em>Strengthen protection.</em></h2><p>WDF conducts community awareness programmes to educate women and families about women’s and children’s rights.</p></div>
        <div className="special-rights-grid"><article><span>UNDERSTANDING AND CONFIDENCE</span><p>Social development initiatives encourage women to understand their rights, build confidence and strengthen leadership skills.</p></article><article><span>SAFETY AND PARTICIPATION</span><p>WDF raises awareness about gender-based violence, including technology-facilitated violence, promotes the protection of women and children, and encourages women’s active participation in community activities.</p></article></div>
      </section>

      <section className="special-section special-partnerships">
        <div className="section-label">07 / NGO PARTNERSHIPS AND UNPAID CARE</div>
        <div className="special-heading"><h2>Collective action with <em>partners.</em></h2><p>The Division implements projects with local and international non-governmental organisations.</p></div>
        <div className="special-partnership-grid">
          <article><span>WOMEN’S VOICE AND LEADERSHIP SRI LANKA (NEW APPROACH)</span><h3>Leadership grounded in collective organising</h3><p>Supported by The Asia Foundation, this project trains ten trainers to improve awareness of women’s rights and reach communities; strengthen women’s leadership through community-based women’s collective organising, feminist principles and values-based approaches; and raise awareness of technology-facilitated gender-based violence (TFGBV).</p></article>
          <article><span>WOMEN AND MEDIA COLLECTIVE (WMC)</span><h3>Recognise unpaid care work</h3><p>In collaboration with WMC, WDF conducts awareness sessions and educational programmes to promote recognition of unpaid care work.</p></article>
        </div>
      </section>

      <section className="special-section special-days">
        <div className="section-label">08 / SPECIAL DAYS AND EVENTS</div>
        <div className="special-heading"><h2>Marking days that <em>bring people together.</em></h2><p>Activities and celebrations are organised at Janashakthi Bank Society level throughout the year.</p></div>
        <div className="special-day-grid"><span>International Women’s Day</span><span>Sinhala and Tamil New Year celebrations</span><span>Religious festivals and celebrations</span><span>International Day Against Drug Abuse</span><span>World No Tobacco Day</span></div>
      </section>

      <section className="special-food">
        <div className="special-food-copy"><div className="section-label light">09 / DEVI HELA BOJUNHALA</div><h2>Traditional food. <em>Local opportunity.</em></h2><p>WDF manages and operates the Devi Hela Bojunhala to promote traditional Sri Lankan food and support local food production.</p></div>
        <div className="special-food-detail"><p>The initiative encourages traditional cooking practices and locally grown food while creating income-generating opportunities. It supports women’s participation in food preparation, small-scale food production and entrepreneurship.</p></div>
      </section>

      <section className="special-contact"><div><div className="section-label light">CONNECTED COMMUNITY WORK</div><h2>Explore WDF’s wider <em>development programmes.</em></h2><p>Learn about community groups and services connected with Special Projects.</p></div><div><Link className="text-link" href="/what-we-do/social-mobilisation">Social Mobilisation <Arrow /></Link><Link className="text-link" href="/janashakthi-banks">Janashakthi Banks <Arrow /></Link></div></section>
    </PageShell>
  );
}
