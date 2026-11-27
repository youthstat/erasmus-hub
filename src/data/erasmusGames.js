/* =====================================================================================
   ERASMUS+ COMPETENCE GAMES — Complete Data & Guide Handbook
   Derived directly from "Erasmus+ Competence Games — Facilitator Guide"
   ===================================================================================== */

export const ERASMUS_ESSENTIALS = {
  intro:
    'Erasmus+ is the EU programme supporting education, training, youth, and sport across Europe (2021–2027). It is not only for university students — youth exchanges, Youth Participation activities, and youth worker mobility give young people hands-on non-formal learning across borders.',
  keyActions: [
    {
      code: 'KA1',
      name: 'Learning mobility of individuals',
      desc: 'Youth exchanges, volunteering/youth worker projects, student & staff mobility, DiscoverEU, and Youth Participation activities.',
      badge: 'bg-sun text-ink',
    },
    {
      code: 'KA2',
      name: 'Cooperation among organisations & institutions',
      desc: 'Partnerships for cooperation, small-scale partnerships, capacity building in youth, and innovation alliances.',
      badge: 'bg-neon text-ink',
    },
    {
      code: 'KA3',
      name: 'Support to policy development & cooperation',
      desc: 'EU Youth Dialogue, European Youth Together, and policy networks connecting young people directly with decision-makers.',
      badge: 'bg-[#B89CFF] text-ink',
    },
  ],
  priorities: [
    {
      id: 'inclusion',
      title: 'Inclusion & Diversity',
      color: 'bg-[#FFB4A2]',
      short: 'Equal opportunities for young people with fewer opportunities (social, economic, geographical, or disability barriers).',
    },
    {
      id: 'digital',
      title: 'Digital Transformation',
      color: 'bg-[#90DBF4]',
      short: 'Developing digital literacy, online safety, media literacy, and purposeful use of digital tools in youth work.',
    },
    {
      id: 'green',
      title: 'Environment & Climate',
      color: 'bg-neon',
      short: 'Raising environmental awareness, cutting project carbon footprint, and choosing green travel options (train/bus/carpool).',
    },
    {
      id: 'participation',
      title: 'Democratic Participation',
      color: 'bg-sun',
      short: 'Active citizenship, youth voice in local/European decisions, civic engagement, and democratic values.',
    },
  ],
  youthExchangeBasics: [
    { label: 'Age of participants', value: '13–30 years old (no upper age limit for group leaders)' },
    { label: 'Group leaders', value: 'At least 18 years old · 1 leader per national group (2 if needed, especially for minors)' },
    { label: 'Duration', value: '5 to 21 days (excluding travel days)' },
    { label: 'Group size', value: '16 to 60 participants total (excluding group leaders, facilitators & accompanists)' },
    { label: 'Who can apply', value: 'Organisations, NGOs, public bodies, or informal groups of young people (minimum 2 partner countries)' },
    { label: 'Recognition', value: 'Youthpass certificate — official EU recognition of non-formal learning across 8 Key Competences' },
  ],
  grantRules: [
    {
      title: 'Travel support (unit-cost by distance band)',
      text: 'Calculated one-way (origin → venue) using the official European Commission Distance Calculator. Both standard and higher green-travel bands apply per participant.',
    },
    {
      title: 'Several venues rule',
      text: 'If a project moves across multiple venues, calculate each leg separately with the Distance Calculator and add them up (rounded to the band for the sum!).',
    },
    {
      title: 'Green travel bonus',
      text: 'Using low-emissions transport (train, bus, shared car ≥2 passengers, ferry) unlocks higher travel grants plus extra funded travel days if needed.',
    },
    {
      title: 'Individual support',
      text: 'Per-day lump sum covering food & accommodation for every participant and group leader, including activity days plus travel days.',
    },
    {
      title: 'Organisational support',
      text: 'Fixed amount per participant only — group leaders, facilitators, and accompanists are NOT counted in the participant headcount for organisational support.',
    },
    {
      title: 'Inclusion support',
      text: 'Extra budget per participant with fewer opportunities plus reimbursement of real exceptional costs (accessibility, accompanying persons, visa fees).',
    },
  ],
  keyCompetences: [
    { key: 'literacy', title: '1. Literacy', desc: 'Communicating clearly, reading critically, and distinguishing facts from myths.' },
    { key: 'multilingual', title: '2. Multilingual', desc: 'Navigating European languages, translating concepts, and communicating across cultures.' },
    { key: 'math', title: '3. Math, Science & Tech', desc: 'Using analytical reasoning and budgets accurately — including Erasmus+ grants.' },
    { key: 'digital', title: '4. Digital', desc: 'Using digital tools safely, critically evaluating online info, and protecting privacy/consent.' },
    { key: 'personal', title: '5. Personal, Social & Learning to Learn', desc: 'Reflecting on growth, collaborating in diverse teams, and managing group dynamics.' },
    { key: 'citizenship', title: '6. Citizenship', desc: 'Acting responsibly in society and aligning local ideas with European priorities.' },
    { key: 'entrepreneurship', title: '7. Entrepreneurship', desc: 'Turning bright ideas into structured action plans and pitching them persuasively.' },
    { key: 'cultural', title: '8. Cultural Awareness & Expression', desc: 'Seeing beyond visible traditions to values, communication styles, and deeper cultural norms.' },
  ],
};

export const OFFICIAL_LINKS = [
  { label: 'Erasmus+ Programme Guide', desc: 'Official rules, priorities & budget guide', url: 'https://erasmus-plus.ec.europa.eu/erasmus-programme-guide' },
  { label: 'Youth Exchanges Overview', desc: 'Key Action 1 Youth Exchanges guide', url: 'https://erasmus-plus.ec.europa.eu/programme-guide/part-b/key-action-1/youth-exchanges' },
  { label: 'Official Distance Calculator', desc: 'Calculate exact EU travel distance bands', url: 'https://erasmus-plus.ec.europa.eu/resources-and-tools/distance-calculator' },
  { label: 'Erasmus+ Project Results', desc: 'Explore real funded youth projects', url: 'https://erasmus-plus.ec.europa.eu/projects' },
  { label: 'National Agencies Directory', desc: 'Find your country’s Erasmus+ National Agency', url: 'https://erasmus-plus.ec.europa.eu/about-erasmus/contacts/national-agencies' },
  { label: 'European Youth Portal', desc: 'Opportunities & EU youth info', url: 'https://europa.eu/youth/' },
  { label: 'Youthpass Official Portal', desc: 'Create & learn about Youthpass certificates', url: 'https://www.youthpass.eu/en/' },
  { label: '8 Key Competences Guide (PDF)', desc: 'Revised key competences for lifelong learning', url: 'https://www.youthpass.eu/downloads/13-62-420/Leaflet%20-%20revised%20key%20competences.pdf' },
  { label: 'SALTO-YOUTH Hub', desc: 'Training & resource centres for youth work', url: 'https://www.salto-youth.net/' },
  { label: 'European Training Calendar', desc: 'Find international trainings & seminars', url: 'https://www.salto-youth.net/tools/european-training-calendar/' },
  { label: 'Otlas Partner Finding', desc: 'Find partner organisations for exchanges', url: 'https://www.salto-youth.net/tools/otlas-partner-finding/' },
  { label: 'Toolbox for Training', desc: 'Methods & non-formal education games', url: 'https://toolbox.salto-youth.net/' },
  { label: 'SALTO EECA', desc: 'Eastern Europe & Caucasus cooperation info', url: 'https://www.salto-youth.net/rc/eeca/' },
  { label: 'Youth Exchanges: All You Need', desc: 'Beginner-friendly step-by-step summary', url: 'https://youth.europa.eu/go-abroad/school-and-youth-exchanges/erasmus-youth-exchanges-all-you-need-know_en' },
];

export const RATING_LEVELS = [
  { min: 90, title: 'Erasmus+ Ambassador', badge: 'bg-neon text-ink', note: 'You know all rules, traps, and competences inside out — ready to co-design a real Youth Exchange!' },
  { min: 75, title: 'Expert', badge: 'bg-sun text-ink', note: 'Strong grasp of grants, safety, priorities, and Youthpass competences. You are ready to lead a team.' },
  { min: 55, title: 'Practitioner', badge: 'bg-[#B89CFF] text-ink', note: 'Solid foundations! Review a couple of trickier traps (grants or priorities) and you will be unstoppable.' },
  { min: 0, title: 'Beginner', badge: 'bg-paper text-ink', note: 'Great start on your journey! Explore the Essentials handbook and replay stops to boost your competences.' },
];

export const getRatingLevel = (score) => RATING_LEVELS.find((r) => score >= r.min) || RATING_LEVELS[RATING_LEVELS.length - 1];

export const JOURNEY_STOPS = [
  {
    id: 1,
    slug: 'myth-busters',
    title: 'Myth Busters',
    location: 'Mouse Hole',
    competenceKey: 'literacy',
    competenceLabel: '1. Literacy',
    maxPoints: 8,
    barHex: '#FFE200',
    bgKey: 'mouseHole',
    pattyPose: 'pattyReading',
    failPose: 'pattyCry',
    failLine: 'Oh no! Fake news spotted me first!',
    summary: 'Swipe or tap 8 statements about Erasmus+ (20s each) and bust common myths.',
  },
  {
    id: 2,
    slug: 'erasmus-memory',
    title: 'Erasmus Memory',
    location: 'Welcome Café',
    competenceKey: 'multilingual',
    competenceLabel: '2. Multilingual',
    maxPoints: 8,
    barHex: '#90DBF4',
    bgKey: 'cafe',
    pattyPose: 'pattyWave',
    failPose: 'pattyReading',
    failLine: 'Oops! Too much coffee, wrong language card!',
    summary: 'Match all 8 multilingual Erasmus+ terms with their clear definitions within 3 minutes.',
  },
  {
    id: 3,
    slug: 'grant-escape',
    title: 'Grant Escape',
    location: 'Grant Cheese Vault',
    competenceKey: 'math',
    competenceLabel: '3. Math, Science & Tech',
    maxPoints: 14,
    barHex: '#FF9F43',
    bgKey: 'grantOffice',
    pattyPose: 'pattyGlasses',
    failPose: 'pattySoot',
    failLine: 'Boom! The grant vault locked me out — check the numbers!',
    summary: 'Crack 8 grant calculation locks using the training rate sheet, map clues & pocket calculator.',
  },
  {
    id: 4,
    slug: 'hacked-exchange',
    title: 'Vault Code Breaker',
    location: 'Cyber Control Room',
    competenceKey: 'digital',
    competenceLabel: '4. Digital',
    maxPoints: 8,
    barHex: '#B89CFF',
    bgKey: 'computerRoom',
    pattyPose: 'pattyGlasses',
    failPose: 'pattySoot',
    failLine: 'Vault alarm beeped! Double-check sender, consent rules, passphrases & official sources!',
    summary: 'See the locked Vault Safe right away: clear all 4 cyber stations to collect the 4 secret PIN digits and crack the code!',
  },
  {
    id: 5,
    slug: 'exchange-journey',
    title: 'Exchange Journey',
    location: 'Color Adventure Board',
    competenceKey: 'personal',
    competenceLabel: '5. Personal & Social',
    maxPoints: 8,
    barHex: '#FF94B8',
    bgKey: 'journeyMap',
    pattyPose: 'pattySuitcase',
    failPose: 'pattyCry',
    failLine: 'No worries! Keep rolling toward square 60!',
    summary: 'Reach square 60 (8 PTS) · Hit any of the 10 Question tiles for Extra Hub Points (not added to Erasmus+ score) or Yellow Missions (+500 Coins)!',
  },
  {
    id: 6,
    slug: 'priority-tetris',
    title: 'Civic City Builder',
    location: 'Town Square',
    competenceKey: 'citizenship',
    competenceLabel: '6. Citizenship',
    maxPoints: 8,
    barHex: '#6EE7B7',
    bgKey: 'townSquare',
    pattyPose: 'pattyHardhat',
    failPose: 'pattySoot',
    failLine: 'Whoops! Check which EU priority district this civic project builds!',
    summary: 'Build 4 vibrant Erasmus+ priority districts in Town Square by placing 8 youth civic blueprints!',
  },
  {
    id: 7,
    slug: 'pitch-lab',
    title: 'Startup Mouse Launchpad',
    location: 'Pitch Stage',
    competenceKey: 'entrepreneurship',
    competenceLabel: '7. Entrepreneurship',
    maxPoints: 8,
    barHex: '#FFB4A2',
    bgKey: 'pitchStage',
    pattyPose: 'trioCurious',
    failPose: 'pattyCry',
    failLine: 'Stage spotlight flickered! Sharpen the plan, budget coins, or crisis fix!',
    summary: 'Lead Pretty Patty’s Youth Project on stage: define the aim, balance 8 grant coins, handle a crisis & order the launch!',
  },
  {
    id: 8,
    slug: 'culture-iceberg',
    title: 'Culture Quest',
    location: 'Intercultural Horizon',
    competenceKey: 'cultural',
    competenceLabel: '8. Cultural Awareness',
    maxPoints: 8,
    barHex: '#38BDF8',
    bgKey: 'iceberg',
    pattyPose: 'pattyHeart',
    failPose: 'pattyReading',
    failLine: 'Pause and look closer — what cultural value sits underneath this moment?',
    summary: 'Decode 8 real intercultural moments on exchange — turn awkward surprises into mutual respect!',
  },
  {
    id: 9,
    slug: 'final-test',
    title: 'Final Test & Youthpass',
    location: 'Youthpass Ceremony',
    competenceKey: 'all',
    competenceLabel: 'All 8 Competences',
    maxPoints: 30,
    barHex: '#39FF14',
    bgKey: 'youthpass',
    pattyPose: 'pattyCelebrate',
    failPose: 'pattyReading',
    failLine: 'Close! Read the explanation carefully — you have got this!',
    summary: 'Answer 10 timed questions (3 pts each) covering everything to earn your Youthpass!',
  },
];

/* ---------- GAME 1: MYTH BUSTERS (8 cards, 1 pt each = 8 pts) ---------- */
export const MYTH_BUSTERS_CARDS = [
  {
    id: 1,
    statement: 'Erasmus+ is only for university students.',
    answer: 'MYTH',
    explanation: 'Myth! Erasmus+ funds Youth Exchanges (13–30), Youth Participation, volunteering, training for youth workers, schools, vocational education, and sport.',
  },
  {
    id: 2,
    statement: 'An informal group of young people can run a Youth Exchange project without a big NGO.',
    answer: 'FACT',
    explanation: 'Fact! Four or more young people (at least one aged 18+) can apply as an informal group if an organisation is not available.',
  },
  {
    id: 3,
    statement: 'Youth Exchanges can last anywhere from 5 to 21 days (excluding travel days).',
    answer: 'FACT',
    explanation: 'Fact! Programme days run between 5 and 21 days, plus travel days on either side.',
  },
  {
    id: 4,
    statement: 'There is no Youthpass certificate if you only join a short 7-day Youth Exchange.',
    answer: 'MYTH',
    explanation: 'Myth! Every Youth Exchange participant is entitled to a Youthpass certificate documenting their 8 Key Competences.',
  },
  {
    id: 5,
    statement: 'A Youth Exchange must involve between 16 and 60 participants (excluding group leaders and facilitators).',
    answer: 'FACT',
    explanation: 'Fact! Minimum 16 and maximum 60 participants, with at least 4 per country group.',
  },
  {
    id: 6,
    statement: 'Green travel grants only apply when you fly on an eco-certified airline.',
    answer: 'MYTH',
    explanation: 'Myth! Air travel does NOT count as green travel — green travel means train, bus, shared car (2+ passengers), bike, or ferry.',
  },
  {
    id: 7,
    statement: 'You cannot take part in an Erasmus+ Youth Exchange unless you speak fluent English.',
    answer: 'MYTH',
    explanation: 'Myth! No language exam is required; group leaders and peer translation help everyone participate.',
  },
  {
    id: 8,
    statement: 'Group leaders have no maximum age limit as long as they are at least 18 years old.',
    answer: 'FACT',
    explanation: 'Fact! Participants must be 13–30, while group leaders must be 18+ with no upper age cap.',
  },
];

/* ---------- GAME 2: ERASMUS MEMORY (8 pairs = 16 cards, max 8 pts) ---------- */
export const MEMORY_PAIRS = [
  { id: 'ka1', term: 'KA1 · Key Action 1', def: 'Learning mobility of individuals (Youth Exchanges, Youth Participation, youth worker training)', cardBg: 'bg-[#90DBF4]', tagBg: 'bg-cobalt text-white' },
  { id: 'ka2', term: 'KA2 · Key Action 2', def: 'Cooperation among organisations and partnerships for innovation in youth work', cardBg: 'bg-[#FFE200]', tagBg: 'bg-ink text-sun' },
  { id: 'ka3', term: 'KA3 · Key Action 3', def: 'Support to policy development, EU Youth Dialogue & connecting youth with policymakers', cardBg: 'bg-[#B89CFF]', tagBg: 'bg-ink text-[#B89CFF]' },
  { id: 'yp', term: 'Youthpass', def: 'Official European recognition tool & certificate for non-formal learning across 8 competences', cardBg: 'bg-neon', tagBg: 'bg-ink text-neon' },
  { id: 'na', term: 'National Agency', def: 'The national body in each programme country managing Erasmus+ applications & grants', cardBg: 'bg-[#FFB4A2]', tagBg: 'bg-hot text-white' },
  { id: 'salto', term: 'SALTO-YOUTH', def: 'Network of resource centres providing trainings, Otlas partner-finding & toolbox methods', cardBg: 'bg-[#FF94B8]', tagBg: 'bg-ink text-[#FF94B8]' },
  { id: 'otlas', term: 'Otlas', def: 'Partner-finding tool helping youth organisations and informal groups find international partners', cardBg: 'bg-[#FFAE52]', tagBg: 'bg-ink text-[#FFAE52]' },
  { id: 'green', term: 'Green Travel', def: 'Low-emission transport (train, bus, carpool) earning higher travel grants & extra travel days', cardBg: 'bg-[#86EFAC]', tagBg: 'bg-ink text-[#86EFAC]' },
];

/* ---------- GAME 3: GRANT ESCAPE (Training Rates & 8 Locks = 14 pts) ---------- */
export const GRANT_RATES = {
  notice: 'Training rates — simplified example figures for this game, NOT official current Commission unit costs.',
  caseTitle: 'Project: "Cheese Without Borders" · 20 participants + 2 group leaders + 1 facilitator · 8 activity days',
  routeClue: 'Origin: Kyiv → Intermediate workshop: Kraków (~755 km one-way) → Main venue: Berlin (~530 km one-way). Standard travel (car/plane mix) = 1 travel day before & 1 after.',
  rates: [
    { item: 'Standard travel · 100–499 km', rate: '211 EUR' },
    { item: 'Standard travel · 500–1,999 km', rate: '309 EUR' },
    { item: 'Green travel · 500–1,999 km', rate: '417 EUR' },
    { item: 'Individual support (per person/day)', rate: '55 EUR' },
    { item: 'Organisational support (per participant)', rate: '125 EUR' },
    { item: 'Inclusion support (per fewer-opportunities person)', rate: '125 EUR' },
  ],
};

export const GRANT_LOCKS = [
  {
    id: 1,
    points: 1,
    type: 'number',
    unit: 'people',
    tolerance: 0,
    question: 'Lock 1 — Headcount for Organisational Support: 20 participants, 2 group leaders, 1 facilitator join. How many people count for Organisational Support?',
    answer: 20,
    hint: 'Organisational support counts participants ONLY — exclude group leaders and facilitators.',
    explanation: 'Exactly 20! Only participants count toward Organisational Support (leaders & facilitators are excluded).',
  },
  {
    id: 2,
    points: 1,
    type: 'number',
    unit: 'EUR',
    tolerance: 0,
    question: 'Lock 2 — Organisational Support Total: At 125 EUR per counted participant, what is the total Organisational Support grant?',
    answer: 2500,
    hint: 'Multiply 20 participants × 125 EUR.',
    explanation: '20 × 125 EUR = 2,500 EUR.',
  },
  {
    id: 3,
    points: 2,
    type: 'number',
    unit: 'EUR',
    tolerance: 1,
    question: 'Lock 3 — Individual Support for the Team: Individual support covers ALL 20 participants + 2 group leaders (= 22 people, excl. facilitator) for 8 activity days + 2 travel days (10 days total) at 55 EUR/day. Total EUR?',
    answer: 12100,
    hint: '22 funded persons × 10 funded days × 55 EUR/day.',
    explanation: '22 × 10 × 55 = 12,100 EUR.',
  },
  {
    id: 4,
    points: 2,
    type: 'number',
    unit: 'km',
    tolerance: 1,
    question: 'Lock 4 — Several Venues Distance Rule: The group travels Kyiv → Kraków (755 km) → Berlin (530 km). What total one-way distance do you enter for the travel band?',
    answer: 1285,
    hint: 'When a project has several venues, add each one-way leg together: 755 + 530.',
    explanation: '755 km + 530 km = 1,285 km (falls into the 500–1,999 km band!).',
  },
  {
    id: 5,
    points: 2,
    type: 'number',
    unit: 'EUR',
    tolerance: 1,
    question: 'Lock 5 — Standard Travel Grant: Using the 500–1,999 km Standard Travel rate (309 EUR) for 22 travelling people (20 participants + 2 leaders), what is the Standard Travel total?',
    answer: 6798,
    hint: 'Multiply 22 travellers × 309 EUR.',
    explanation: '22 × 309 EUR = 6,798 EUR.',
  },
  {
    id: 6,
    points: 2,
    type: 'number',
    unit: 'EUR',
    tolerance: 1,
    question: 'Lock 6 — Green Travel Switch! Suppose 10 of those 22 people take night trains (Green Travel 500–1,999 km = 417 EUR instead of 309 EUR). How much EXTRA travel budget does the project receive?',
    answer: 1080,
    hint: 'Difference per green traveller is 417 − 309 = 108 EUR. Multiply by 10.',
    explanation: '10 × (417 − 309) = 1,080 EUR extra for going green!',
  },
  {
    id: 7,
    points: 2,
    type: 'number',
    unit: 'EUR',
    tolerance: 1,
    question: 'Lock 7 — Inclusion Support: Out of the 20 participants, 4 face geographical or economic barriers. At 125 EUR each, what is the Inclusion Support grant?',
    answer: 500,
    hint: '4 fewer-opportunities participants × 125 EUR.',
    explanation: '4 × 125 EUR = 500 EUR for Inclusion Support (plus real exceptional costs if documented).',
  },
  {
    id: 8,
    points: 2,
    type: 'number',
    unit: 'EUR',
    tolerance: 1,
    question: 'Lock 8 — Grand Cheese Vault Total! Add Organisational (2,500) + Individual (12,100) + Standard Travel (6,798) + Green Upgrade (1,080) + Inclusion (500). Enter the grand total EUR to unlock the vault!',
    answer: 22978,
    hint: '2,500 + 12,100 + 6,798 + 1,080 + 500 = ?',
    explanation: 'Vault unlocked! 22,978 EUR total project grant calculated accurately!',
  },
];

/* ---------- GAME 4: VAULT CODE BREAKER (Digital · 4 stations × 2 pts = 8 pts + PIN safe) ---------- */
export const HACKED_ROOMS = {
  room1: {
    title: 'Station 1 · Phishing Email Trap',
    instruction: 'Someone sent a fake Erasmus+ grant email to lock Patty’s vault. Click ALL 3 red flags below to earn Safe Digit #1!',
    subject: 'URGENT!! EU ERASMUS+ GRANT SUSPENDED — CLICK NOW!!',
    sender: 'erasmus-support@free-cheesemail.ru',
    segments: [
      { id: 'from', text: 'From: erasmus-support@free-cheesemail.ru', isFlag: true, reason: 'Suspicious non-official domain (not @ec.europa.eu or National Agency).' },
      { id: 'greet', text: 'Dear Applicant,', isFlag: false },
      { id: 'urgency', text: 'Your Youth Exchange grant expires in 15 MINUTES unless you pay a 45 EUR verification fee immediately!', isFlag: true, reason: 'False urgency + asking for a verification payment — Erasmus+ NEVER charges fees to receive a grant.' },
      { id: 'project', text: 'We refer to your approved KA1 Youth Exchange schedule.', isFlag: false },
      { id: 'link', text: 'Send your passport scan & bank PIN here: http://bit.ly/eu-free-cash-login', isFlag: true, reason: 'Shortened third-party phishing URL requesting bank PIN and passport credentials.' },
    ],
  },
  room2: {
    title: 'Station 2 · Photo Consent Wall',
    instruction: 'Sort these 6 photos/posts into the right privacy rule (OK to post · Ask consent first · Never post) to earn Safe Digit #2!',
    items: [
      { id: 'p1', label: 'Wide stage photo of the Youthpass ceremony (participants signed photo release)', correct: 'OK' },
      { id: 'p2', label: 'Close-up crying face of a stressed teammate during reflection', correct: 'NEVER' },
      { id: 'p3', label: 'Fun candid selfie with 2 friends who haven’t seen the picture yet', correct: 'ASK' },
      { id: 'p4', label: 'Clear photo of a participant’s open passport & boarding pass QR code', correct: 'NEVER' },
      { id: 'p5', label: 'Poster artwork made by your team (no private data visible)', correct: 'OK' },
      { id: 'p6', label: 'Video clip of a shy classmate speaking about personal family struggles', correct: 'ASK' },
    ],
  },
  room3: {
    title: 'Station 3 · Password Vault Shield',
    instruction: 'Pick the ONLY safe passphrase & security habit to unlock Safe Digit #3!',
    options: [
      { id: 'a', text: 'erasmus2026 — easy for every country leader to remember', ok: false, feedback: 'Dictionary word + current year is cracked in seconds!' },
      { id: 'b', text: '12345678 — fast to type during energizers', ok: false, feedback: 'One of the top 3 hacked passwords worldwide.' },
      { id: 'c', text: 'Krakow!Train#Cheese94 + 2-Factor Authentication (2FA) turned on', ok: true, feedback: 'Long unique passphrase with symbols + 2FA keeps the team safe!' },
      { id: 'd', text: 'PrettyPatty — stored in a public Google Doc titled PASSWORDS', ok: false, feedback: 'Never keep shared passwords in a public document!' },
    ],
  },
  room4: {
    title: 'Room 4 · Fake Post Inspector',
    instruction: 'Verify this viral post before sharing it in the project Telegram group!',
    postText: '"BREAKING: Starting Monday, the EU cancelled ALL Erasmus+ Youth Exchanges forever because trains are too slow! Share before deleted!!"',
    questions: [
      {
        id: 'source',
        q: 'Which source should you check first?',
        options: [
          { text: 'Official Erasmus+ website (erasmus-plus.ec.europa.eu) & National Agency', ok: true },
          { text: 'Random anonymous TikTok comment with 40 fire emojis', ok: false },
          { text: 'Forward it to 10 friends immediately so they panic too', ok: false },
        ],
      },
      {
        id: 'verdict',
        q: 'Verdict on this post:',
        options: [
          { text: 'FALSE — sensational clickbait without any official Commission or NA source', ok: true },
          { text: 'TRUE — screenshots with ALL CAPS are always reliable', ok: false },
        ],
      },
    ],
  },
};

/* ---------- GAME 5: COLOR ADVENTURE BOARD (60 squares: 10 Question Squares for Extra Hub PTS, Yellow Missions for +500 Outfit Coins, Green +steps, Red -steps) ---------- */
export const BOARD_GREEN_SQUARES = {
  4: { stepDelta: 3, label: 'Green Boost! Sunny teamwork lifts Pretty Patty +3 steps forward to #7!' },
  14: { stepDelta: 2, label: 'Green Boost! Shared snack break jumps Pretty Patty +2 steps to #16!' },
  22: { stepDelta: 3, label: 'Green Boost! Helpful translation boosts Pretty Patty +3 steps to #25!' },
  31: { stepDelta: 2, label: 'Green Boost! Smooth night train speeds Pretty Patty +2 steps to #33!' },
  40: { stepDelta: 2, label: 'Green Boost! Inclusive circle boosts Pretty Patty +2 steps to #42!' },
  49: { stepDelta: 3, label: 'Green Boost! Creative brainstorm jumps Pretty Patty +3 steps to #52!' },
  56: { stepDelta: 3, label: 'Green Boost! Final sprint lifts Pretty Patty +3 steps to #59!' },
};

export const BOARD_RED_SQUARES = {
  9: { stepDelta: -3, label: 'Red Detour! Missed the morning alarm — step back −3 to #6.' },
  15: { stepDelta: -2, label: 'Red Detour! Forgot water bottle at workshop — step back −2 to #13.' },
  26: { stepDelta: -2, label: 'Red Detour! Wrong tram stop — step back −2 to #24.' },
  34: { stepDelta: -2, label: 'Red Detour! Lost name tag at break — step back −2 to #32.' },
  44: { stepDelta: -2, label: 'Red Detour! Rainy shortcut — step back −2 to #42.' },
  51: { stepDelta: -3, label: 'Red Detour! Left notebook in kitchen — step back −3 to #48.' },
  57: { stepDelta: -2, label: 'Red Detour! Slippery steps near finish — step back −2 to #55.' },
};

export const SELF_REFLECTION_PROMPTS = [
  {
    id: 'r1',
    badge: 'Mission · Warm Connection',
    prompt: 'Who on this project would you genuinely love to have a deeper conversation with today?',
    hint: 'Think of them or jot a quick note — then claim +500 Outfit Coins for the Mouse Wardrobe!',
  },
  {
    id: 'r2',
    badge: 'Mission · Gratitude Check',
    prompt: 'Who has supported, encouraged, or made you feel welcomed the most during this exchange?',
    hint: 'Take a warm moment to appreciate them and claim +500 Outfit Coins!',
  },
  {
    id: 'r3',
    badge: 'Mission · Comfort Check-In',
    prompt: 'Do you feel comfortable, safe, and heard right now? What small thing could make today even cozier?',
    hint: 'Honour your own pace and claim +500 Outfit Coins!',
  },
  {
    id: 'r4',
    badge: 'Mission · Best Memory',
    prompt: 'What have you enjoyed the absolute most during this project so far?',
    hint: 'Picture that highlight in your mind and collect +500 Outfit Coins!',
  },
  {
    id: 'r5',
    badge: 'Mission · Bright Laughter',
    prompt: 'What was your funniest or happiest laugh-out-loud moment on this Youth Exchange?',
    hint: 'Smile at the memory and collect +500 Outfit Coins!',
  },
  {
    id: 'r6',
    badge: 'Mission · Kind Gesture',
    prompt: 'Think of someone who seemed a little quiet today — try asking them "How are you doing?" over the next break!',
    hint: 'Small warmth changes someone’s day! Claim +500 Outfit Coins.',
  },
  {
    id: 'r7',
    badge: 'Mission · Invisible Thank-You',
    prompt: 'If you could hand a surprise thank-you card to one teammate right now, who would it be and why?',
    hint: 'Celebrate silent helpers and collect +500 Outfit Coins!',
  },
  {
    id: 'r8',
    badge: 'Mission · Positive Surprise',
    prompt: 'Which teammate surprised you in the nicest way that you did not expect on Day 1?',
    hint: 'Reflect gently and claim +500 Outfit Coins!',
  },
  {
    id: 'r9',
    badge: 'Mission · Culture Spark',
    prompt: 'What new word, song, snack, or tradition from another country warmed your heart the most?',
    hint: 'Hold onto that new memory and collect +500 Outfit Coins!',
  },
  {
    id: 'r10',
    badge: 'Mission · Proud Moment',
    prompt: 'When did you feel quietly proud of yourself here — speaking up, translating, or trying something new?',
    hint: 'Give yourself gentle credit and claim +500 Outfit Coins!',
  },
  {
    id: 'r11',
    badge: 'Mission · Replay One Hour',
    prompt: 'If you could replay one single hour from this exchange again just to enjoy the vibe, which hour would it be?',
    hint: 'Enjoy the memory and collect +500 Outfit Coins!',
  },
  {
    id: 'r12',
    badge: 'Mission · Recharge Routine',
    prompt: 'What helps you recharge best during a busy exchange day — a quiet walk, music, tea, or chatting with friends?',
    hint: 'Protect your energy kindly and collect +500 Outfit Coins!',
  },
  {
    id: 'r13',
    badge: 'Mission · Kind Compliment',
    prompt: 'Pick one genuine, kind compliment you would happily tell someone on your team today!',
    hint: 'Tell them later if you feel like it — and claim +500 Outfit Coins!',
  },
  {
    id: 'r14',
    badge: 'Mission · Unexpected Bridge',
    prompt: 'What shared interest or funny habit connected you with someone from a completely different country?',
    hint: 'Celebrate small bridges and claim +500 Outfit Coins!',
  },
  {
    id: 'r15',
    badge: 'Mission · Home Spark',
    prompt: 'Which workshop topic or game sparked an idea you would love to bring back to your own town?',
    hint: 'Reflect freely and collect +500 Outfit Coins!',
  },
  {
    id: 'r16',
    badge: 'Mission · Time Capsule',
    prompt: 'One year from today, what tiny memory from this group do you know will still make you smile?',
    hint: 'Save that feeling and claim +500 Outfit Coins!',
  },
  {
    id: 'r17',
    badge: 'Mission · Team Vibe',
    prompt: 'What makes our group atmosphere feel respectful, playful, and supportive to you?',
    hint: 'Take a gentle pause and collect +500 Outfit Coins!',
  },
  {
    id: 'r18',
    badge: 'Mission · Warm Wish',
    prompt: 'In one warm wish, what do you hope every participant takes home from this Youth Exchange?',
    hint: 'No pressure — claim +500 Outfit Coins for your Wardrobe!',
  },
];

/* 10 fixed Question Squares placed all around the 60-square circle */
export const STOP5_BOARD_QUESTIONS = {
  5: {
    square: 5,
    extraPts: 5,
    q: 'A teammate arrives late, tired, and quiet because their bus broke down. What builds the best team spirit?',
    options: [
      'Offer them water, catch them up calmly in 2 minutes & welcome them warmly',
      'Tease them loudly in front of the whole circle',
      'Ignore them so they figure everything out alone',
    ],
    correct: 0,
    explain: 'Warm practical support turns travel stress into instant belonging!',
  },
  11: {
    square: 11,
    extraPts: 5,
    q: 'Why does Erasmus+ provide extra Inclusion Support & accessible travel funding?',
    options: [
      'So young people facing economic, geographical, social, or health barriers can join equally',
      'Only to buy extra souvenirs for team leaders',
      'To limit exchanges strictly to capital cities',
    ],
    correct: 0,
    explain: 'Inclusion & Diversity is a core EU priority — removing real barriers opens doors for everyone!',
  },
  17: {
    square: 17,
    extraPts: 5,
    q: 'At Intercultural Night, a friend offers a traditional snack whose smell surprises you. What is the kindest reaction?',
    options: [
      'Say thank you politely, try a small bite if safe with your allergies, or smile and appreciate their pride',
      'Make a loud disgusted face so everyone laughs',
      'Throw it in the bin while they watch',
    ],
    correct: 0,
    explain: 'Curiosity and polite honesty (like mentioning allergies kindly) respect your host’s tradition!',
  },
  23: {
    square: 23,
    extraPts: 5,
    q: 'What is the main purpose of Youthpass after completing an Erasmus+ Youth Exchange?',
    options: [
      'Official EU recognition of your non-formal learning across 8 Key Competences',
      'A boarding pass for free flights next summer',
      'A strict written final school exam',
    ],
    correct: 0,
    explain: 'Youthpass helps you reflect on real skills you practised and showcase them for jobs or studies!',
  },
  29: {
    square: 29,
    extraPts: 5,
    q: 'During small-group work, two friends switch to rapid inside jokes in their native language while two others look lost. Best move?',
    options: [
      'Gently invite a shared language or translate the joke warmly so everyone stays in the loop',
      'Keep whispering in your own language all afternoon',
      'Tell the others they should just guess',
    ],
    correct: 0,
    explain: 'Quick peer translation keeps humour and teamwork open to every nationality!',
  },
  35: {
    square: 35,
    extraPts: 5,
    q: 'Which travel choices qualify as Green Travel in Erasmus+?',
    options: [
      'Train, bus, shared carpool (2+ passengers), bike, or ferry',
      'Any domestic or international commercial flight',
      'Solo sports car with no passengers',
    ],
    correct: 0,
    explain: 'Low-emission ground and ferry travel earns higher Green Travel grants and extra travel days!',
  },
  41: {
    square: 41,
    extraPts: 5,
    q: 'You filmed a funny candid clip of friends dancing at break time. Before posting it online, what should you always do?',
    options: [
      'Ask everyone clearly visible in the clip if they are happy for you to share it',
      'Post immediately with no tags or consent check',
      'Share only if their passport or room key shows in the background',
    ],
    correct: 0,
    explain: 'Respecting consent keeps digital memories fun, safe, and respectful for every participant!',
  },
  47: {
    square: 47,
    extraPts: 5,
    q: 'One quiet teammate has brilliant ideas in their notebook but rarely jumps into fast debates. How can the group help?',
    options: [
      'Try round-robin turns or small-pair sharing first so every voice gets calm space',
      'Speak louder so silent people stay quiet',
      'Vote without reading their notebook ideas',
    ],
    correct: 0,
    explain: 'Structured turns give thoughtful and quieter voices equal room to shine!',
  },
  53: {
    square: 53,
    extraPts: 5,
    q: 'Who can participate in an Erasmus+ Youth Exchange?',
    options: [
      'Participants aged 13–30, plus group leaders aged 18+ (no upper age limit for leaders)',
      'Only 20–24 year old university students',
      'Only teachers and ministry officials',
    ],
    correct: 0,
    explain: 'Youth Exchanges welcome young people aged 13–30 from every background, led by 18+ group leaders!',
  },
  58: {
    square: 58,
    extraPts: 5,
    q: 'What makes a Youth Exchange workshop truly "non-formal learning" rather than a lecture?',
    options: [
      'Learning by doing — games, role-play, teamwork & reflection chosen together by youth',
      'Sitting silently for 6 hours reading textbooks for a grade',
      'Zero interaction between partner countries',
    ],
    correct: 0,
    explain: 'Participatory methods, voluntary engagement, and guided reflection are the heart of non-formal education!',
  },
};

/* ---------- GAME 6: CIVIC CITY BUILDER (8 projects → 4 priority districts = 8 pts) ---------- */
export const CIVIC_CITY_DISTRICTS = [
  {
    id: 'inclusion',
    label: 'Inclusion & Diversity',
    short: 'Inclusion',
    districtName: 'Access Plaza',
    stickerKey: 'portal',
    bg: 'bg-[#FFB4A2]',
    accent: '#F97316',
    motto: 'Open doors for every youth',
  },
  {
    id: 'digital',
    label: 'Digital Transformation',
    short: 'Digital',
    districtName: 'Tech Beacon Hub',
    stickerKey: 'lantern',
    bg: 'bg-[#90DBF4]',
    accent: '#0284C7',
    motto: 'Safe & smart media literacy',
  },
  {
    id: 'green',
    label: 'Environment & Climate',
    short: 'Climate',
    districtName: 'Eco Green Park',
    stickerKey: 'island',
    bg: 'bg-neon',
    accent: '#16A34A',
    motto: 'Green travel & zero waste',
  },
  {
    id: 'participation',
    label: 'Democratic Participation',
    short: 'Democracy',
    districtName: 'Civic Town Hall',
    stickerKey: 'signpost',
    bg: 'bg-sun',
    accent: '#EAB308',
    motto: 'Youth voices shape policy',
  },
];

export const CIVIC_CITY_PROJECTS = [
  { id: 1, title: 'Wheelchair-accessible eco trail & sign-language buddy app', target: 'inclusion', iconKey: 'bridge', reason: 'Removes physical & communication barriers so young people with disabilities can join fully.' },
  { id: 2, title: 'Fact-checking lab fighting deepfakes & online harassment', target: 'digital', iconKey: 'magnifier', reason: 'Builds critical digital literacy, online safety, and media verification skills.' },
  { id: 3, title: 'Zero-waste swap market + train-only travel challenge', target: 'green', iconKey: 'crates', reason: 'Directly lowers carbon footprint and fosters everyday climate action.' },
  { id: 4, title: 'Youth town hall co-designing safe bike lanes with the city council', target: 'participation', iconKey: 'megaphone', reason: 'Connects young citizens directly with local democratic decision-makers.' },
  { id: 5, title: 'Rural teens exchange with travel mentors & translated handbooks', target: 'inclusion', iconKey: 'treasureMap', reason: 'Overcomes geographical and language barriers for fewer-opportunities youth.' },
  { id: 6, title: 'Community repair café turning donated laptops into study stations', target: 'digital', iconKey: 'key', reason: 'Expands practical digital skills and responsible tech access.' },
  { id: 7, title: 'River clean-up brigade tracking microplastics & urban biodiversity', target: 'green', iconKey: 'barrel', reason: 'Protects local ecosystems through hands-on climate action.' },
  { id: 8, title: 'First-time EU voter café & mock Youth Parliament debate', target: 'participation', iconKey: 'flagFinish', reason: 'Strengthens civic dialogue, voting literacy, and active democracy.' },
];

/* ---------- GAME 7: STARTUP MOUSE LAUNCHPAD (Entrepreneurship · Mouse Only · 8 pts) ---------- */
export const STARTUP_CONCEPTS = [
  { id: 'c1', name: 'Midnight Train Swap Market', goal: 'Cut exchange waste & boost local youth climate action' },
  { id: 'c2', name: 'Barrier-Free Audio City Map', goal: 'Help blind, deaf & rural youth explore partner towns safely' },
  { id: 'c3', name: 'Fact-Check Radio Bootcamp', goal: 'Equip high-schoolers to spot scams & co-produce EU podcasts' },
];

export const STARTUP_BUDGET_ITEMS = [
  { id: 'access', label: 'Accessibility & peer translation', hint: 'Inclusion priority', recommendedMin: 2, isTrap: false },
  { id: 'green', label: 'Night trains & reusable kits', hint: 'Green travel + sustainability', recommendedMin: 2, isTrap: false },
  { id: 'tools', label: 'Workshop supplies & street lab', hint: 'Hands-on non-formal learning', recommendedMin: 2, isTrap: false },
  { id: 'followup', label: 'Open toolkit & Youthpass event', hint: 'Lasting local impact', recommendedMin: 1, isTrap: false },
  { id: 'vip', label: 'VIP limo & confetti cannon', hint: 'Trap — zero learning value!', recommendedMin: 0, isTrap: true },
];

export const STARTUP_ROUND_1 = {
  title: 'Mission 1 · Define the Impact Aim',
  prompt: 'Pretty Patty steps onto the Pitch Stage! How should Patty open the Youth Initiative proposal to convince partners?',
  options: [
    { text: 'Pinpoint ONE real youth need locally and show the concrete skills participants gain together.', ok: true, feedback: 'Clear purpose + measurable youth growth is the heart of strong entrepreneurship!' },
    { text: 'Promise a chill beach vacation with zero workshops so everyone signs up fast.', ok: false, feedback: 'An initiative without learning value or clear community need will not fly!' },
    { text: 'Write 12 pages of vague buzzwords without naming who benefits.', ok: false, feedback: 'Always keep your initiative grounded in real youth needs.' },
  ],
};

export const STARTUP_ROUND_3 = {
  title: 'Mission 3 · Live Event Crisis Fix',
  prompt: 'Surprise rain floods the outdoor Youth Fair an hour before doors open, and 2 teens cannot climb the temporary stage steps. What does Patty do?',
  options: [
    { text: 'Move booths into the ground-floor community hall, team up buddies, and run adaptive pop-up stations!', ok: true, feedback: 'Resourceful pivoting + universal accessibility saves the event for everyone!' },
    { text: 'Cancel the showcase completely and go back to sleep.', ok: false, feedback: 'Entrepreneurs adapt calmly under pressure instead of giving up.' },
    { text: 'Leave the indoor stage unreachable and tell affected youth to just watch from afar.', ok: false, feedback: 'Never exclude teammates — always redesign for full access!' },
  ],
};

export const STARTUP_SEQUENCE = [
  { id: 'listen', label: '1. Listen to local youth & spot a real community need', order: 1 },
  { id: 'co_create', label: '2. Co-design inclusive workshops & sustainable budget', order: 2 },
  { id: 'multiply', label: '3. Share open results back home & log Youthpass growth', order: 3 },
];

/* ---------- GAME 8: CULTURE QUEST DECODER (8 intercultural moments × 1 pt = 8 pts) ---------- */
export const CULTURE_QUEST_CARDS = [
  {
    id: 1,
    tag: 'Morning Schedule · Spain & Germany team',
    clue: 'A workshop is set for "10:00". One country team is seated at 09:57 with notebooks ready; another strolls in happily at 10:12 chatting with coffee.',
    question: 'What hidden cultural norm explains this without blaming anyone?',
    options: [
      { text: 'Different unwritten ideas of "on time" (strict clock time vs relationship-first time).', ok: true },
      { text: 'The late group intentionally dislikes Erasmus+.', ok: false },
      { text: 'Neither group cares about friendships.', ok: false },
    ],
    hiddenValue: 'Time & Punctuality Norms',
    explain: 'Attitudes toward time live beneath the cultural surface! Agreeing a clear group charter on Day 1 aligns everyone cheerfully.',
  },
  {
    id: 2,
    tag: 'Feedback Circle · Cross-border prep',
    clue: 'A peer says bluntly: "This poster font is unreadable, redo slide 2." Their teammate feels deeply offended, though no insult was meant.',
    question: 'What is happening below the surface?',
    options: [
      { text: 'Direct vs indirect communication styles — clarity vs saving face politely.', ok: true },
      { text: 'They forgot how to use markers.', ok: false },
      { text: 'Direct feedback is banned in Europe.', ok: false },
    ],
    hiddenValue: 'Direct vs Indirect Feedback',
    explain: 'What feels like helpful honesty in one culture can sound harsh in another — sharing how we give feedback builds trust!',
  },
  {
    id: 3,
    tag: 'Coffee Break · Icebreaker Chat',
    clue: 'During chat, Participant A stands close and taps shoulders warmly; Participant B keeps stepping backward to breathe.',
    question: 'How should Pretty Patty read this situation?',
    options: [
      { text: 'Unspoken personal space & touch boundaries differ across cultures — respect comfort zones!', ok: true },
      { text: 'Participant B refuses to make any friends forever.', ok: false },
      { text: 'Everyone in Europe uses the exact same arm-length rule.', ok: false },
    ],
    hiddenValue: 'Personal Space & Body Language',
    explain: 'Invisible bubbles of personal distance vary widely — noticing body cues and asking before hugs keeps everyone comfortable.',
  },
  {
    id: 4,
    tag: 'Group Planning · Silent Nodding',
    clue: 'You propose a complicated timetable and a teammate smiles and says "Maybe yes, we will see." Later you learn they disagreed.',
    question: 'Why did they not say "No!" right away?',
    options: [
      { text: 'In high-context harmony cultures, saying a flat "no" openly feels impolite — gentle hints signal concern.', ok: true },
      { text: 'They were asleep with their eyes open.', ok: false },
      { text: 'They never understood any words at all.', ok: false },
    ],
    hiddenValue: 'High-Context Harmony',
    explain: 'Soft phrases like "maybe" or silence can mean hesitation! Offering anonymous sticky notes lets everyone share honest ideas safely.',
  },
  {
    id: 5,
    tag: 'Leadership Check-in · Town Walk',
    clue: 'One team asks organizers before changing any game rule; another jumps straight in and invents two extra rounds.',
    question: 'What deep cultural dimension shapes this?',
    options: [
      { text: 'Different expectations about hierarchy vs flat equality with leaders.', ok: true },
      { text: 'One group lost their shoes.', ok: false },
      { text: 'Rules are illegal in Youth Exchanges.', ok: false },
    ],
    hiddenValue: 'Views on Authority & Initiative',
    explain: 'Some backgrounds defer respectfully to leaders; others expect co-ownership immediately. Clarifying roles empowers both!',
  },
  {
    id: 6,
    tag: 'Cultural Night · Traditional Table',
    clue: 'A host team insists you take a third serving of homemade pastry even after you say "Thank you, I am full!" once.',
    question: 'What unspoken message does their insistence carry?',
    options: [
      { text: 'Generous hospitality ritual — refusing once politely is expected before happily accepting or explaining allergies.', ok: true },
      { text: 'They want to spoil your dinner schedule.', ok: false },
      { text: 'Saying "no thank you" is rude everywhere on Earth.', ok: false },
    ],
    hiddenValue: 'Hospitality & Gift Etiquette',
    explain: 'Food sharing carries deep warmth in many cultures — a warm smile and clear explanation (e.g. allergies) honours the host kindly!',
  },
  {
    id: 7,
    tag: 'Quiet Moment · Evening Reflection',
    clue: 'Between two fast sentences, a Nordic participant pauses silently for 4 seconds to think before replying, and others jump in over them.',
    question: 'What helpful intercultural habit fixes this?',
    options: [
      { text: 'Recognise conversational silence as thoughtful respect, not awkward emptiness — give room to finish!', ok: true },
      { text: 'Speak twice as fast so pauses never exist.', ok: false },
      { text: 'Tell them to skip evening reflections.', ok: false },
    ],
    hiddenValue: 'Conversational Pacing & Silence',
    explain: 'Turn-taking speed varies! Allowing a 3-second pause opens the floor for deeper, calmer voices.',
  },
  {
    id: 8,
    tag: 'Beyond Stereotypes · First Impressions',
    clue: 'Someone jokes on Day 1: "All people from Country X are super loud!" A quiet teammate from Country X smiles awkwardly.',
    question: 'What is the smartest Youth Exchange takeaway?',
    options: [
      { text: 'Visible clichés hide real individuals — meet the actual person with curiosity, not national labels.', ok: true },
      { text: 'National stereotypes predict every single person accurately.', ok: false },
      { text: 'Culture means only flags, dances, and souvenirs.', ok: false },
    ],
    hiddenValue: 'Curiosity Over Stereotypes',
    explain: 'Food and folk dances are easy to spot above the surface, but real cultural competence means listening deeply to every unique individual!',
  },
];

/* ---------- GAME 9: FINAL TEST (10 questions × 3 pts = 30 pts) ---------- */
export const FINAL_TEST_QUESTIONS = [
  {
    id: 1,
    q: 'What is the eligible age range for participants in an Erasmus+ Youth Exchange?',
    options: ['13–30 years old', '18–25 university students only', '16–35 years old', '10–21 years old'],
    correct: 0,
    explanation: 'Youth Exchanges welcome young people aged 13–30 (while group leaders must be 18+ with no upper limit).',
  },
  {
    id: 2,
    q: 'How long can Youth Exchange programme activities last (excluding travel days)?',
    options: ['2 to 4 days', '5 to 21 days', '30 to 90 days', 'Exactly 10 days only'],
    correct: 1,
    explanation: 'Youth Exchange programme activities run from 5 to 21 days, excluding travel days.',
  },
  {
    id: 3,
    q: 'Can 4+ young people without an official NGO still apply for a Youth Exchange?',
    options: [
      'No, only registered universities can apply',
      'Yes — as an informal group of young people (with at least one 18+)',
      'Only if they pay a 500 EUR application fee',
      'Only inside a single country',
    ],
    correct: 1,
    explanation: 'Informal groups of at least 4 young people (one aged 18+) can legally apply in Erasmus+!',
  },
  {
    id: 4,
    q: 'When calculating Organisational Support, who is counted in the headcount?',
    options: [
      'Participants + group leaders + facilitators + cooks',
      'Participants ONLY (excluding leaders and facilitators)',
      'Group leaders only',
      'Everyone on the mailing list',
    ],
    correct: 1,
    explanation: 'Organisational support is calculated strictly per participant (excluding group leaders & facilitators).',
  },
  {
    id: 5,
    q: 'Which transport does NOT count as Green Travel in Erasmus+?',
    options: ['Overnight international train', 'Long-distance coach/bus', 'Commercial airplane flight', 'Carpooling (2+ passengers in one car)'],
    correct: 2,
    explanation: 'Flying never counts as green travel! Trains, buses, shared carpooling, bikes, or ferries qualify.',
  },
  {
    id: 6,
    q: 'What should you do when an exchange visits several venues (e.g. City A → City B → City C)?',
    options: [
      'Only measure City A → City B and ignore the rest',
      'Measure each one-way leg with the official Distance Calculator and sum them up',
      'Multiply the distance by 10',
      'Skip travel budgeting completely',
    ],
    correct: 1,
    explanation: 'Sum each leg measured with the EU Distance Calculator to find the right distance band.',
  },
  {
    id: 7,
    q: 'Which statement about Youthpass is TRUE?',
    options: [
      'It is a passport replacing your national ID at airports',
      'It recognises your non-formal learning across 8 Key Competences',
      'Only group leaders can receive it',
      'It costs 30 EUR to download',
    ],
    correct: 1,
    explanation: 'Youthpass is free for all participants and documents growth across the 8 EU Key Competences.',
  },
  {
    id: 8,
    q: 'Which four are the official Erasmus+ Horizontal Priorities?',
    options: [
      'Inclusion & Diversity, Digital Transformation, Environment & Climate, Democratic Participation',
      'Speed, Luxury Hotels, Exams, Competitions',
      'Social Media Fame, Coding Only, Flights, Merchandise',
      'Football, Cooking, Languages, Hiking',
    ],
    correct: 0,
    explanation: 'Inclusion & Diversity, Digital Transformation, Environment & Climate, and Participation in Democratic Life.',
  },
  {
    id: 9,
    q: 'A teammate sends a candid photo of someone crying or an open passport photo. What is the rule?',
    options: [
      'Post it immediately on Instagram Stories',
      'NEVER post sensitive private/ID photos — protect dignity & data',
      'Print it as a meme poster',
      'Share only in a public Telegram channel',
    ],
    correct: 1,
    explanation: 'Passport data and vulnerable private moments must NEVER be posted online; casual photos always need consent.',
  },
  {
    id: 10,
    q: 'What causes most intercultural misunderstandings at a Youth Exchange?',
    options: [
      'Traditional food and folk music on Cultural Night',
      'Unspoken cultural norms (time, directness, personal space) hidden beneath the surface',
      'Only airport security lines',
      'Nowhere — cultural habits are identical everywhere',
    ],
    correct: 1,
    explanation: 'Visible traditions are easy to enjoy; invisible unspoken norms below the surface cause most misunderstandings.',
  },
];
