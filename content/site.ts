/**
 * 코드코리아 홈페이지 — 단일 콘텐츠 소스
 *
 * 모든 컨셉(/c/*)은 이 파일에서만 문구를 읽는다.
 * 컨셉 컴포넌트에 문구를 하드코딩하지 않는다.
 */

/** 클라이언트 실명·민감 정보 노출 여부. 공개 배포 시 동의 확보 전까지 true 유지. */
export const ANONYMIZE = true;

const client = (real: string, masked: string) => (ANONYMIZE ? masked : real);

export const company = {
  nameKo: '코드코리아',
  nameEn: 'Code Korea',
  domain: 'kodekorea.kr',
  email: 'contact@kodekorea.kr',
  base: '부산',
  baseEn: 'Busan, Korea',
  /** 한 줄 정의 — 히어로 하단 보조 카피로 사용 */
  tagline: 'AI를 만들고, 가르치고, 운영합니다',
  taglineEn: 'We build, teach, and operate AI',
  /** 히어로 헤드라인. 컨셉별로 줄바꿈 위치만 다르게 처리할 수 있다. */
  headline: '연구로 끝나지 않는 AI',
  headlineSub: '현장에서 돌아가는 것까지가 우리 일입니다',
  headlineEn: 'AI that ships',
  /** 회사 소개 본문 */
  intro:
    '코드코리아는 제조 현장의 AI 솔루션, 학교와 기업의 AI 교육, 그리고 그것을 담는 플랫폼을 직접 만듭니다. 기획부터 모델 학습, 웹·앱 구현, 서버 운영까지 한 팀에서 처리합니다.',
} as const;

/** 3개 사업축 */
export const pillars = [
  {
    id: 'solution',
    index: '01',
    code: 'S/01',
    labelKo: 'AI 솔루션',
    labelEn: 'AI Solutions',
    summary: '현장 데이터를 읽는 비전 AI를 만듭니다',
    body:
      '제조 도면, 설비 영상, 검사 이미지처럼 정형화되지 않은 현장 데이터를 다룹니다. 탐지 모델과 OCR, 비전 언어 모델을 교차 검증하는 파이프라인으로 사람이 읽던 값을 자동으로 뽑아냅니다.',
    project: {
      name: 'BubbleMap',
      subtitle: '제조 도면 AI 버블맵',
      client: client('태웅', '국내 대형 제조사'),
      body:
        '도면을 올리면 치수와 주석을 자동으로 추출해 검수 가능한 형태로 정리합니다. YOLO 계열 타일 추론 탐지기와 OCR을 결합하고, 비전 언어 모델로 교차 분류해 오탐을 걸러냅니다.',
      metrics: [
        { value: '13,022', unit: '건', label: '치수·주석 자동 추출' },
        { value: '36', unit: '개', label: '도면 전량 분석 (67페이지)' },
        { value: '0', unit: '건', label: 'OCR 처리 실패' },
        { value: '56/56', unit: '', label: '파이프라인 테스트 통과' },
      ],
      stack: ['YOLO26', 'OCR', 'VLM 교차검증', 'pypdfium2'],
    },
  },
  {
    id: 'education',
    index: '02',
    code: 'A/02',
    labelKo: 'AI 교육',
    labelEn: 'AI Education',
    summary: '가르칠 도구까지 직접 만듭니다',
    body:
      '커리큘럼과 교재만 쓰지 않습니다. 학생이 실제로 손을 대는 개발 환경을 직접 만들어 함께 제공합니다. 블록 코딩에서 파이썬으로 넘어가는 구간의 단절을 도구로 해결했습니다.',
    project: {
      name: '두봇 · BlockPy',
      subtitle: '블록 ↔ 파이썬 무손실 양방향 IDE',
      client: client('교육 현장', '교육 현장'),
      body:
        '블록으로 짠 코드를 파이썬으로, 파이썬을 다시 블록으로 손실 없이 되돌립니다. CPython의 구문 트리를 단일 중간 표현으로 써서 양방향 변환의 정합성을 보장합니다. 오프라인 데스크톱으로도 배포됩니다.',
      metrics: [
        { value: '1:1', unit: '', label: '무손실 양방향 변환' },
        { value: '16', unit: '화', label: '컴퓨터 비전 강의 시즌1' },
        { value: '3', unit: '단계', label: '중등·고등·혼합 커리큘럼' },
        { value: '오프라인', unit: '', label: '데스크톱 배포 지원' },
      ],
      stack: ['CPython ast', 'Blockly', 'React', 'Electron'],
    },
  },
  {
    id: 'platform',
    index: '03',
    code: 'W/03',
    labelKo: '플랫폼 구축',
    labelEn: 'Platform',
    summary: '만든 다음 운영까지 책임집니다',
    body:
      '협업 도구, 학습 관리 시스템, 기관 웹사이트를 만들고 우리 인프라에서 직접 운영합니다. 납품 후 손 떼는 방식이 아니라, 서버와 도메인과 메일까지 이어서 관리합니다.',
    project: {
      name: 'TeamHub',
      subtitle: '팀 협업 플랫폼 + MCP 서버',
      client: client('사내 및 외부 도입', '사내 및 외부 도입'),
      body:
        '채널·티켓·스프린트·간트·체크리스트를 한곳에서 다룹니다. AI 에이전트가 직접 조작할 수 있는 MCP 서버를 함께 제공해, 자연어로 티켓을 만들고 일정을 등록할 수 있습니다.',
      metrics: [
        { value: '5', unit: '개', label: '자체 운영 서비스' },
        { value: '78', unit: '계정', label: '메일 인프라 자체 호스팅' },
        { value: 'MCP', unit: '', label: 'AI 에이전트 연동 지원' },
        { value: '무중단', unit: '', label: '인프라 이전 완료' },
      ],
      stack: ['Next.js', 'Supabase', 'Docker', 'Cloudflare'],
    },
  },
] as const;

/** 운영 역량 — B2B 신뢰 근거 */
export const capability = {
  labelKo: '만드는 데서 끝내지 않습니다',
  labelEn: 'Build, then run it',
  body:
    '외부 클라우드에 의존하지 않고 자체 서버에서 서비스를 운영합니다. 인프라를 직접 다루기 때문에 비용과 성능을 우리가 통제하고, 그 결과를 고객 프로젝트에도 그대로 적용합니다.',
  items: [
    {
      title: '호스팅 비용 구조 개선',
      detail: '외부 호스팅 의존을 정리하고 자체 서버로 이전. 월 고정 비용을 $39에서 $0으로 낮췄습니다.',
      metric: '$39 → $0',
    },
    {
      title: '자체 호스팅 데이터베이스',
      detail: '인증·데이터베이스 스택을 직접 구성해 운영합니다. 서비스별로 인증 네임스페이스를 분리했습니다.',
      metric: 'self-host',
    },
    {
      title: '메일 인프라 이관',
      detail: '외부 메일 호스팅에서 자체 메일 서버로 78개 계정과 데이터를 무중단 이관했습니다.',
      metric: '78 계정',
    },
    {
      title: '네트워크 최적화',
      detail: 'CDN을 앞단에 두어 패킷 손실과 접속 지연을 해소했습니다.',
      metric: 'Cloudflare',
    },
  ],
} as const;

/** 기관·기업 협업 이력 */
export const clients = [
  { name: client('부산대학교', '국립대학교'), scope: 'AI대학 · 연구원 웹사이트, 교재' },
  { name: client('부산시', '광역자치단체'), scope: '공공디자인 웹앱 개발' },
  { name: client('태웅', '대형 제조사'), scope: '제조 도면 AI 검수 시스템' },
  { name: '교육 기관 다수', scope: 'AI 커리큘럼 · 플랫폼 공급' },
] as const;

/** 다루는 기술 영역 — 오브젝트 궤도 라벨이나 무한 리스트로 사용 */
export const domains = [
  '컴퓨터 비전',
  '문서 이해 (OCR)',
  '비전 언어 모델',
  '객체 탐지',
  '이미지 세그멘테이션',
  '제조 도면 해석',
  '교육용 IDE 설계',
  '코드 변환기 · AST',
  '학습 관리 시스템',
  '협업 플랫폼',
  'MCP 서버',
  '에이전트 오케스트레이션',
  '자체 호스팅 인프라',
  '컨테이너 배포',
  '메일 서버 운영',
  '영상 자동 생성 파이프라인',
] as const;

export const nav = [
  { href: '#solution', labelKo: '사업 영역', labelEn: 'What We Do' },
  { href: '#work', labelKo: '실적', labelEn: 'Work' },
  { href: '#capability', labelKo: '운영 역량', labelEn: 'Capability' },
  { href: '#contact', labelKo: '문의', labelEn: 'Contact' },
] as const;

export const cta = {
  primaryKo: '프로젝트 문의',
  primaryEn: 'Start a Project',
  secondaryKo: '회사 소개서 받기',
  secondaryEn: 'Get Deck',
  contactHeadline: '해결할 문제가 있으신가요',
  contactBody:
    '데이터는 있는데 어디서 시작해야 할지 모르겠다면, 그 상태로 문의해 주셔도 됩니다. 무엇이 가능한지부터 함께 정리합니다.',
} as const;

export const footer = {
  copyright: `© ${new Date().getFullYear()} 코드코리아. All rights reserved.`,
  links: [
    { label: '이용약관', href: '#' },
    { label: '개인정보처리방침', href: '#' },
    { label: '채용', href: '#' },
  ],
} as const;

/** 시안 인덱스에서 사용 */
export const concepts = [
  {
    slug: 'hut8',
    letter: 'A',
    titleKo: '기업 신뢰형',
    titleEn: 'Infrastructure',
    desc: '무채색 + 액센트 1개. 섹션 단위 명암 대반전. 아이소메트릭 3D 지형을 카메라가 이동하며 3개 사업축을 통과합니다.',
    ref: 'hut8.com',
    tone: '가장 안전하고 기업 신뢰가 높은 방향',
  },
  {
    slug: 'sentra',
    letter: 'B',
    titleKo: '엔지니어링형',
    titleEn: 'Engineering',
    desc: '흑백 + 오렌지 1개. 글자 스크램블 디코드, 1비트 디더링 이미지, 코드형 인덱스 라벨.',
    ref: 'Sentra 목업',
    tone: '기술 회사 임팩트가 가장 강한 방향',
  },
  {
    slug: 'hle',
    letter: 'C',
    titleKo: '서사형',
    titleEn: 'Narrative',
    desc: '서버랙 안으로 카메라가 진입하고, 그 화면이 사이트 본문이 됩니다. 진입 전부터 화면에 내부 콘텐츠가 재생됩니다.',
    ref: 'hle.io',
    tone: '기억에 가장 오래 남는 방향',
  },
  {
    slug: 'robin',
    letter: 'D',
    titleKo: '실험형',
    titleEn: 'Journey',
    desc: '진입 게이트 + 막마다 팔레트를 갈아엎는 스크롤 여정. 속도 게이트 없이 일반 스크롤로 진행합니다.',
    ref: 'robin-thomas.me',
    tone: '가장 실험적인 방향',
  },
] as const;
