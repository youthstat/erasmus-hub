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
    title: 'Hacked Exchange',
    location: 'Computer Room',
    competenceKey: 'digital',
    competenceLabel: '4. Digital',
    maxPoints: 8,
    barHex: '#B89CFF',
    bgKey: 'computerRoom',
    pattyPose: 'pattyGlasses',
    failPose: 'catSmirk',
    failLine: 'Hacker Cat giggles! Check sender, links, consent & sources!',
    summary: 'Defeat Hacker Cat across 4 security rooms: phishing email, photo consent wall, password vault & fake news.',
  },
  {
    id: 5,
    slug: 'exchange-journey',
    title: 'Exchange Journey',
    location: 'City Streets',
    competenceKey: 'personal',
    competenceLabel: '5. Personal & Social',
    maxPoints: 8,
    barHex: '#FF94B8',
    bgKey: 'journeyMap',
    pattyPose: 'pattySuitcase',
    failPose: 'pattyCry',
    failLine: 'Oof! Slipped down a snake — teamwork will get us back up!',
    summary: 'Roll the dice across 60 squares, climb ladders, dodge snakes & solve 8 real exchange dilemmas.',
  },
  {
    id: 6,
    slug: 'priority-tetris',
    title: 'Priority Tetris',
    location: 'Town Square',
    competenceKey: 'citizenship',
    competenceLabel: '6. Citizenship',
    maxPoints: 8,
    barHex: '#6EE7B7',
    bgKey: 'townSquare',
    pattyPose: 'pattyHardhat',
    failPose: 'pattySoot',
    failLine: 'Whoops! Wrong priority lane — look at the core goal of this idea!',
    summary: 'Steer 8 falling project ideas into the matching Erasmus+ horizontal priority building!',
  },
  {
    id: 7,
    slug: 'pitch-lab',
    title: 'Pitch Lab',
    location: 'Pitch Stage',
    competenceKey: 'entrepreneurship',
    competenceLabel: '7. Entrepreneurship',
    maxPoints: 8,
    barHex: '#FFB4A2',
    bgKey: 'pitchStage',
    pattyPose: 'pattyPassport',
    failPose: 'mentorFoxSerious',
    failLine: 'Fox frowns — that pitch needs sharper structure and impact!',
    summary: 'Spin the 3-reel topic slot machine and build a winning 4-step pitch for Owl, Turtle & Fox.',
  },
  {
    id: 8,
    slug: 'culture-iceberg',
    title: 'Culture Iceberg',
    location: 'The Sea',
    competenceKey: 'cultural',
    competenceLabel: '8. Cultural Awareness',
    maxPoints: 8,
    barHex: '#38BDF8',
    bgKey: 'iceberg',
    pattyPose: 'pattyHeart',
    failPose: 'pattyCry',
    failLine: 'Splash! Is that visible on the surface, or hidden below the waterline?',
    summary: 'Sort 8 cultural clues above vs below the waterline and uncover where misunderstandings happen.',
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

/* ---------- GAME 4: HACKED EXCHANGE (4 rooms × 2 pts = 8 pts) ---------- */
export const HACKED_ROOMS = {
  room1: {
    title: 'Room 1 · Phishing Email Trap',
    instruction: 'Hacker Cat disguised a fake Erasmus+ grant email. Click ALL 3 red flags hidden in the message below to expose the scam!',
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
    title: 'Room 2 · Photo Consent Wall',
    instruction: 'Sort these 6 photos/posts from the Youth Exchange into the right privacy rule: OK to post · Ask consent first · Never post.',
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
    title: 'Room 3 · Password Vault',
    instruction: 'Pick the ONLY safe password & security habit to lock Hacker Cat out of your team drive!',
    options: [
      { id: 'a', text: 'erasmus2026 — easy for every country leader to remember', ok: false, feedback: 'Dictionary word + current year is cracked in seconds!' },
      { id: 'b', text: '12345678 — fast to type during energizers', ok: false, feedback: 'One of the top 3 hacked passwords worldwide.' },
      { id: 'c', text: 'Krakow!Train#Cheese94 + 2-Factor Authentication (2FA) turned on', ok: true, feedback: 'Long passphrase with symbols + 2FA stops Hacker Cat cold!' },
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

/* ---------- GAME 5: EXCHANGE JOURNEY (60 squares, Snakes & Ladders + 8 Dilemmas = 8 pts) ---------- */
export const BOARD_LADDERS = { 4: 14, 15: 25, 29: 39, 44: 53 };
export const BOARD_SNAKES = { 17: 7, 32: 21, 46: 35, 57: 49 };
export const SITUATION_SQUARES = [6, 12, 19, 27, 34, 41, 48, 55];

export const EXCHANGE_DILEMMAS = [
  {
    id: 1,
    square: 6,
    title: 'Lost at the Border Station',
    text: 'Two teammates missed the connecting bus and do not speak the local language. What do you do?',
    choices: [
      { label: 'Share live location, calm them down & translate options with the group leader', ok: true, feedback: 'Calm communication and peer solidarity keep everyone safe!' },
      { label: 'Leave them behind so you get the best bunk beds first', ok: false, feedback: 'Leaving teammates behind breaks group trust.' },
      { label: 'Switch off your phone until morning', ok: false, feedback: 'Avoidance turns a small delay into a crisis.' },
    ],
  },
  {
    id: 2,
    square: 12,
    title: 'Quiet Voice in Reflection',
    text: 'One participant stays silent in every evening reflection while two confident speakers dominate.',
    choices: [
      { label: 'Talk over everyone else to fill the awkward pause', ok: false, feedback: 'Loud interruptions push quiet members further out.' },
      { label: 'Suggest a small-pair check-in or talking stick so everyone has equal space', ok: true, feedback: 'Great facilitation! Inclusive methods help quieter voices shine.' },
      { label: 'Tell them loudly that they are boring the circle', ok: false, feedback: 'Shaming destroys psychological safety.' },
    ],
  },
  {
    id: 3,
    square: 19,
    title: 'Homesick Teammate',
    text: 'On Day 3, a younger participant feels overwhelmed by constant noise and misses home.',
    choices: [
      { label: 'Offer a quiet tea walk, listen without judging, and let the facilitator know', ok: true, feedback: 'Empathy + alerting support staff creates real emotional safety.' },
      { label: 'Laugh and tell them to tough it out', ok: false, feedback: 'Dismissing feelings worsens stress and isolation.' },
      { label: 'Post a joke about it on the Gossip Board', ok: false, feedback: 'Never turn private stress into public gossip.' },
    ],
  },
  {
    id: 4,
    square: 27,
    title: 'Food & Allergy Mix-Up',
    text: 'Dinner arrives without a labelled vegetarian option for two teammates.',
    choices: [
      { label: 'Eat quietly and tell them to skip dinner', ok: false, feedback: 'Basic care & inclusion mean making sure everyone eats safely.' },
      { label: 'Politely alert the kitchen/organizers immediately and wait together until solved', ok: true, feedback: 'Proactive, respectful problem-solving guarantees inclusion!' },
      { label: 'Shout at the kitchen staff in front of everyone', ok: false, feedback: 'Aggression never solves logistics smoothly.' },
    ],
  },
  {
    id: 5,
    square: 34,
    title: 'Disagreement During Workshop Prep',
    text: 'Your international team disagrees completely on how to present tomorrow’s cultural night.',
    choices: [
      { label: 'Hold a 5-minute brainstorm combining one element from each person’s idea', ok: true, feedback: 'Co-creation blends strengths instead of splitting the team!' },
      { label: 'Secretly delete their slides at midnight', ok: false, feedback: 'Sabotage destroys collaboration.' },
      { label: 'Refuse to participate unless your country goes first', ok: false, feedback: 'Rigidity stalls the whole group.' },
    ],
  },
  {
    id: 6,
    square: 41,
    title: 'Energy Crash After Lunch',
    text: 'Half the room looks sleepy before the afternoon citizenship debate.',
    choices: [
      { label: 'Lead a 3-minute inclusive energizer where nobody is singled out', ok: true, feedback: 'Playful movement wakes up focus and group energy!' },
      { label: 'Read 14 pages of EU regulation aloud monotonically', ok: false, feedback: 'That guarantees nap time!' },
      { label: 'Cancel the workshop and scroll reels separately', ok: false, feedback: 'You miss the heart of the exchange.' },
    ],
  },
  {
    id: 7,
    square: 48,
    title: 'Language Barrier in Mixed Groups',
    text: 'Two participants feel nervous because their English is basic.',
    choices: [
      { label: 'Slow down, avoid slang, use visuals & invite peers to translate key words', ok: true, feedback: 'Multilingual care and clear speech make exchanges accessible to all!' },
      { label: 'Switch exclusively to your fast native slang with friends', ok: false, feedback: 'Exclusive cliques leave partners isolated.' },
      { label: 'Give them zero tasks in the presentation', ok: false, feedback: 'Excluding them removes their learning opportunity.' },
    ],
  },
  {
    id: 8,
    square: 55,
    title: 'Youthpass Reflection Check',
    text: 'It is the final evening! How do you turn this exchange into real personal growth?',
    choices: [
      { label: 'Note concrete examples of challenges you overcame for your Youthpass & daily life', ok: true, feedback: 'Connecting experience to Youthpass cements lifelong learning!' },
      { label: 'Throw away your notes and forget everyone’s names', ok: false, feedback: 'You lose half the long-term impact!' },
      { label: 'Copy someone else’s reflection paragraph word for word', ok: false, feedback: 'Your learning story is uniquely yours.' },
    ],
  },
];

/* ---------- GAME 6: PRIORITY TETRIS (8 blocks → 4 priorities = 8 pts) ---------- */
export const TETRIS_PRIORITIES = [
  { id: 'inclusion', label: 'Inclusion & Diversity', short: 'Inclusion', color: '#F97316', bg: 'bg-[#FFB4A2]' },
  { id: 'digital', label: 'Digital Transformation', short: 'Digital', color: '#0284C7', bg: 'bg-[#90DBF4]' },
  { id: 'green', label: 'Environment & Climate', short: 'Climate', color: '#16A34A', bg: 'bg-neon' },
  { id: 'participation', label: 'Democratic Participation', short: 'Democracy', color: '#EAB308', bg: 'bg-sun' },
];

export const TETRIS_BLOCKS = [
  { id: 1, title: 'Wheelchair-accessible eco trail & sign-language buddy app', target: 'inclusion', reason: 'Focuses on disability access and equal participation for young people with fewer opportunities.' },
  { id: 2, title: 'Fact-checking bootcamp against deepfakes & cyberbullying', target: 'digital', reason: 'Builds critical digital media literacy and online safety.' },
  { id: 3, title: 'Zero-waste swap market + train-only travel challenge', target: 'green', reason: 'Directly cuts carbon emissions and tackles climate habits.' },
  { id: 4, title: 'Youth town hall debating local council bike lanes with mayor', target: 'participation', reason: 'Connects young citizens directly with democratic decision-makers.' },
  { id: 5, title: 'Rural teens exchange: free travel mentors & translated toolkit', target: 'inclusion', reason: 'Breaks geographical and language barriers for rural youth.' },
  { id: 6, title: 'Open-source coding club turning old laptops into study hubs', target: 'digital', reason: 'Boosts practical digital skills and technology access.' },
  { id: 7, title: 'River clean-up lab measuring microplastics & local biodiversity', target: 'green', reason: 'Hands-on environmental protection and climate action.' },
  { id: 8, title: 'Mock European Parliament & first-time voter café', target: 'participation', reason: 'Encourages active civic engagement and democratic participation.' },
];

/* ---------- GAME 7: PITCH LAB (Slot Machine + 4-Step Builder = 8 pts) ---------- */
export const PITCH_REELS = {
  topics: ['Urban Rooftop Gardens', 'AI Fact-Checking Squad', 'Plastic-Free Campus Festival', 'Cross-Border Indie Radio'],
  targets: ['Rural teens (14–18) with fewer opportunities', 'Deaf & hearing youth buddies', 'First-time EU voters & high schoolers', 'Young climate volunteers across 4 countries'],
  twists: ['All travel by night train + digital Youthpass diaries', 'Zero-budget swap market + local mayor Q&A', 'Sign-language & 4-language live podcast', 'Solar-powered pop-up stage in a small town'],
};

export const PITCH_STEPS = [
  {
    step: 1,
    mentor: 'Owl',
    mentorSprite: 'mentorOwl',
    title: 'Step 1 · Clear Problem & Aim',
    prompt: 'How do you open your 60-second pitch to convince the Youth Agency jury?',
    options: [
      { text: 'Define ONE concrete youth challenge locally, plus the measurable change your exchange creates.', ok: true, feedback: 'Owl nods wisely: crystal-clear problem + objective is a grant winner!' },
      { text: 'Say "We just want a free holiday in Spain with random parties."', ok: false, feedback: 'Owl shakes head: non-formal learning needs clear educational aims!' },
      { text: 'Read a 9-page philosophical essay with zero mention of young people.', ok: false, feedback: 'Owl blinks: keep it focused and youth-centred!' },
    ],
  },
  {
    step: 2,
    mentor: 'Turtle',
    mentorSprite: 'mentorTurtle',
    title: 'Step 2 · Inclusion & Group Balance',
    prompt: 'Turtle checks your group plan: how do you ensure Inclusion & Diversity?',
    options: [
      { text: 'Reserve seats for fewer-opportunities peers, provide peer translation, and keep venues accessible.', ok: true, feedback: 'Turtle smiles slowly: thoughtful access makes every step steady and fair!' },
      { text: 'Only accept influencers who already speak C2 English and pay extra deposits.', ok: false, feedback: 'Turtle pulls into shell: charging entry barriers breaks Erasmus+ inclusion!' },
      { text: 'Skip accessibility checks to save planning time.', ok: false, feedback: 'Turtle frowns: inclusion cannot be an afterthought.' },
    ],
  },
  {
    step: 3,
    mentor: 'Fox',
    mentorSprite: 'mentorFox',
    title: 'Step 3 · Non-Formal Methods & Budget',
    prompt: 'Fox leans in: how will you run the 7 days and manage unit-cost grants?',
    options: [
      { text: 'Mix simulations, street interviews & evening Youthpass reflections — funded via green travel + per-day unit costs.', ok: true, feedback: 'Fox grins: practical non-formal methods + smart green budgeting!' },
      { text: 'Sit in a dark hall listening to 8 hours of lectures daily.', ok: false, feedback: 'Fox sighs: Youth Exchanges are active non-formal learning, not lectures!' },
      { text: 'Guess random ticket prices without checking the Distance Calculator.', ok: false, feedback: 'Fox points at the calculator: grants strictly follow distance bands!' },
    ],
  },
  {
    step: 4,
    mentor: 'Owl, Turtle & Fox',
    mentorSprite: 'pattyCelebrate',
    title: 'Step 4 · Real Impact & Follow-Up',
    prompt: 'What happens AFTER participants return home?',
    options: [
      { text: 'Share an open toolkit online, host a local follow-up event, and award Youthpass certificates.', ok: true, feedback: 'Standing ovation from Owl, Turtle & Fox — project approved!' },
      { text: 'Delete the WhatsApp group on the flight home and tell nobody.', ok: false, feedback: 'All three mentors gasp: Erasmus+ multiplies impact back home!' },
      { text: 'Wait 10 years before writing down what anyone learned.', ok: false, feedback: 'Reflect right away while memories are fresh!' },
    ],
  },
];

/* ---------- GAME 8: CULTURE ICEBERG (8 items, 1 pt each = 8 pts) ---------- */
export const ICEBERG_PIECES = [
  { id: 'food', label: 'Traditional dishes & street food', zone: 'ABOVE', explain: 'Visible surface! Easy to taste and spot right away on Day 1.' },
  { id: 'music', label: 'Folk dances & pop music', zone: 'ABOVE', explain: 'Above the water — immediately seen and heard at Cultural Night.' },
  { id: 'clothes', label: 'Festive costumes & everyday dress', zone: 'ABOVE', explain: 'Above the water — visible outward clothing styles.' },
  { id: 'festivals', label: 'National holidays & celebrations', zone: 'ABOVE', explain: 'Above the water — public events and traditions anyone can observe.' },
  { id: 'time', label: 'Attitude to punctuality & schedules', zone: 'BELOW', explain: 'Below the water! What counts as "on time" vs "10 minutes late" is an unspoken cultural norm.' },
  { id: 'comm', label: 'Direct vs indirect feedback style', zone: 'BELOW', explain: 'Below the water! Blunt honesty vs polite hints often causes accidental friction.' },
  { id: 'space', label: 'Personal space & eye contact norms', zone: 'BELOW', explain: 'Below the water! Invisible comfort rules around touch, distance, and gaze.' },
  { id: 'hier', label: 'Views on authority & group leadership', zone: 'BELOW', explain: 'Below the water! Expectations around challenging leaders or speaking up.' },
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
    q: 'Where do most intercultural misunderstandings happen on the Culture Iceberg?',
    options: [
      'Above the water (food & music)',
      'Below the water (time, directness, space, unspoken norms)',
      'Only in airport security lines',
      'Nowhere — culture is identical everywhere',
    ],
    correct: 1,
    explanation: 'Visible traditions are easy to enjoy; invisible unspoken norms below the water cause most misunderstandings.',
  },
];
