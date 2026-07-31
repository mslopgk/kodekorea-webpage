/**
 * 코드코리아 홈페이지 — 단일 콘텐츠 소스
 *
 * 모든 컨셉(/c/*)은 이 파일에서만 문구를 읽는다.
 * 컨셉 컴포넌트에 문구를 하드코딩하지 않는다.
 *
 * ────────────────────────────────────────────────────────────
 * 출처: docs/client-materials-01.md (대표 조성호 회신, 2026-07-31)
 *
 * ⚠️ 이 파일에 들어갈 수 있는 것은 **회신본에서 `공개가능`으로 확인된 사실**뿐이다.
 *    · 계약 근거 없는 프로젝트는 실적으로 쓰지 않는다
 *    · 계약 요구 성능기준을 달성 실적으로 쓰지 않는다
 *    · 근거 없는 누적 수치를 쓰지 않는다
 *    새 수치를 추가할 때는 반드시 `source` 필드에 근거를 남긴다.
 * ────────────────────────────────────────────────────────────
 */

/**
 * 클라이언트 실명 노출 여부.
 *
 * 2026-07-31 기준 **서면 동의를 받아둔 클라이언트가 한 곳도 없다.**
 * 계약서에 비밀유지 조항이 있는 건도 있으므로 1차 오픈은 반드시 true로 간다.
 * 동의를 받은 기관만 개별적으로 전환한다.
 */
export const ANONYMIZE = true;

const client = (real: string, masked: string) => (ANONYMIZE ? masked : real);

export const company = {
  nameKo: '코드코리아',
  nameEn: 'KODE KOREA',
  domain: 'kodekorea.kr',
  email: 'seongho.cho@kodekorea.kr',
  base: '부산',
  baseEn: 'Busan, Korea',
  tagline: 'AI를 만들고, 가르치고, 운영합니다',
  taglineEn: 'We build, teach, and operate AI',
  headline: '만들고, 가르치고, 운영합니다',
  headlineSub: '연구실 밖에서 돌아가는 AI',
  headlineEn: 'AI that ships',
  intro:
    '공공기관과 대학의 AI 시스템을 설계부터 운영까지 단독으로 수행합니다. 발주기관 직인으로 검증된 실적만 싣습니다.',
} as const;

/** 히어로 3동사 ↔ 사업축 매핑 */
export const heroVerbs = [
  { verb: '만들고', pillar: 'platform', en: 'Build' },
  { verb: '가르치고', pillar: 'education', en: 'Teach' },
  { verb: '운영합니다', pillar: 'public', en: 'Operate' },
] as const;

/**
 * 3개 사업축.
 *
 * ⚠️ 이전 버전에 있던 BubbleMap(제조 도면 AI)·두봇/BlockPy·TeamHub는 전부 제거했다.
 *    회신본 1-D 확인 결과 제조·산업 AI 영역에 **계약 근거가 있는 수행 실적이 없고**,
 *    나머지는 사내 도구이거나 수주 실적이 아니다. 해당 영역은 `solutions`(제안 가능
 *    역량)로 분리해 "실적"이 아니라 "역량"으로 표기한다.
 */
export const pillars = [
  {
    id: 'platform',
    index: '01',
    code: 'W/01',
    labelKo: '웹 · 플랫폼 구축',
    labelEn: 'Platform',
    summary: '기관 사이트를 하나의 시스템으로 묶습니다',
    body:
      '조직마다 흩어진 사이트를 하나의 정보구조와 디자인 시스템으로 통합합니다. 기획부터 구축, 운영과 유지보수까지 단독으로 수행합니다.',
    project: {
      name: '대학 AI 거점 사이트군',
      subtitle: 'AI 교육·연구 조직 4개 사이트 통합 구축',
      client: client('부산대학교', '국립대학교 AI 교육·연구 조직'),
      period: '2026.06 ~ 진행 중',
      role: '전체 수행 (기획·디자인·구축·운영)',
      body:
        '대학의 AI 교육·연구 조직 4개 사이트를 하나의 정보구조로 통합 구축하고 있습니다. 거점 메인은 개발을 마치고 운영 중이며 관리자 통계 기능까지 추가 납품했습니다. 나머지는 시안 확정 단계로, 조직별 특성을 살리되 거점 전체가 한 브랜드로 읽히도록 설계했습니다.',
      /**
       * 실제 캡처. `arise-ai.pusan.ac.kr`은 공개 운영 중이라 직접 촬영했다.
       * hero는 사이트 자체의 히어로 영상 프레임, layout은 페이지 화면.
       * 나머지 3개 사이트는 시안 단계라 발주처 승인 전 공개 불가.
       */
      images: [
        { src: '/work/arise-hero.jpg', alt: 'ARISE-AI 거점 사이트 히어로 영상 장면', caption: '거점 메인 · 운영 중' },
        { src: '/work/arise-layout.jpg', alt: 'ARISE-AI 거점 사이트 게이트웨이 화면', caption: '게이트웨이 구조' },
      ],
      metrics: [
        { value: '4', unit: '개', label: '통합 구축 사이트', source: '발주처 확인 메일' },
        { value: '1', unit: '개', label: '개발 완료 · 운영 중', source: '2026-07-08 추가 납품' },
        { value: '28', unit: '종', label: '제출 시안 (16종 + 12종)', source: '발주처 회신 메일' },
        { value: '단독', unit: '', label: '컨소시엄 없이 전체 수행', source: '계약' },
      ],
      stack: ['Next.js', '디자인 시스템', '관리자 통계', '운영·유지보수'],
    },
  },
  {
    id: 'education',
    index: '02',
    code: 'A/02',
    labelKo: 'AI 교육',
    labelEn: 'AI Education',
    summary: '발주기관이 직인으로 검증한 교육 실적',
    body:
      '대학과 특성화고, 영재교육원의 AI 교육을 설계하고 직접 운영합니다. 강의만 나가는 것이 아니라 커리큘럼과 실습 환경, 대회 운영까지 맡습니다.',
    project: {
      name: '검증된 교육 수행 실적',
      subtitle: '발주기관 직인 사업실적증명원 보유 6건',
      client: client(
        '부산대학교 · 부산소프트웨어마이스터고',
        '국립대학교 · 소프트웨어 마이스터고'
      ),
      period: '2021 ~ 2023',
      role: '전체 수행 (수행비율 100%)',
      body:
        'LINC 3.0 데이터사이언스·AI Art 과정, AI 캠프와 직업역량강화 캠프, 과학영재교육원 창의디자인캠프를 단독으로 위탁 운영했습니다. 6건 모두 발주기관 직인이 찍힌 사업실적증명원이 있어 기간과 규모가 검증 가능합니다.',
      metrics: [
        { value: '6', unit: '건', label: '직인 검증 수행 실적', source: '사업실적증명원 원본' },
        { value: '15', unit: '팀', label: 'SW융합 해커톤 선발·운영', source: '사업실적증명원' },
        { value: '100', unit: '%', label: 'LINC 3.0 과정 수행비율', source: '사업실적증명원' },
        { value: '3,750', unit: '만 원 규모', label: '최대 단일 위탁 운영', source: '사업실적증명원' },
      ],
      stack: ['커리큘럼 설계', '실습 환경 구축', '대회 운영', '기술 멘토링'],
    },
  },
  {
    id: 'public',
    index: '03',
    code: 'S/03',
    labelKo: '공공 데이터 시스템',
    labelEn: 'Public Systems',
    summary: '공공기관 보안 요건 안에서 AI를 돌립니다',
    body:
      '망 분리와 개인정보 마스킹을 전제로 설계합니다. 정성 데이터는 RAG로, 정량 지표는 집계로 다루고 결과를 지도·대시보드로 묶습니다.',
    project: {
      name: '공공디자인 진단시스템',
      subtitle: '지능형 기술기반 시민참여 공공디자인 진단시스템',
      client: client(
        '부산인터넷방송국 · 부산디자인진흥원',
        '부산 지역 공공디자인 진흥 공공기관'
      ),
      period: '2025.11 ~ 2026.12 (2차년도 진행 중)',
      role: '전체 수행 (단독 수행사)',
      body:
        '부산 16개 구·군의 공공디자인 현황을 8개 영역으로 진단하는 웹 시스템을 설계·구축하고 있습니다. 시민 제보와 AI 인터뷰로 모은 정성 데이터를 RAG로 분석해 정량 지표와 결합하고, 지역별 결과를 지도와 대시보드로 시각화합니다. 개인정보 자동 마스킹과 망 분리를 전제로 설계해 공공기관 보안 요건을 충족합니다.',
      metrics: [
        { value: '16', unit: '개 구·군', label: '진단 대상 범위', source: '제안서협상안 과업목표' },
        { value: '8', unit: '개', label: '진단 영역', source: '제안서협상안 p.4' },
        { value: '160', unit: '개', label: 'AI 가상시민 (16구군 × 10유형)', source: '제안서협상안 마-3' },
        { value: '단독', unit: '', label: '하도급 없이 전체 수행', source: '계약' },
      ],
      stack: ['LangChain', 'BGE-M3', 'Weaviate · Qdrant', '하이브리드 검색', 'Mapbox'],
    },
  },
] as const;

/**
 * 제안 가능 역량 — 실적이 아니다.
 *
 * 회신본 1-D 권고에 따라 분리했다. 제조·산업 AI 영역은 설계·제안 문서만 있고
 * 계약 근거가 없으므로 "수행 실적"으로 표기하면 허위가 된다.
 * 대신 "다룰 수 있는 영역"으로 정직하게 표기한다.
 */
export const solutions = {
  labelKo: '제안 가능 영역',
  labelEn: 'What We Can Build',
  note: '아래는 수행 실적이 아니라 설계·제안이 가능한 영역입니다.',
  items: [
    { title: '제조 공정 에너지·ESG 플랫폼', detail: '조선·해양기자재 공정 데이터 수집과 지표화 설계안 보유' },
    { title: '기업 내부용 프라이빗 AI 어시스턴트', detail: '사내 문서 기반 RAG, 온프레미스·망분리 구성' },
    { title: '엔지니어링 도면 멀티모달 검색', detail: '도면 이미지와 텍스트를 함께 검색하는 구조 검토안' },
    { title: 'AI 콘텐츠 자동 생성 파이프라인', detail: '강의 자료·영상 제작 자동화 경험 기반' },
  ],
} as const;

/** 운영 역량 — B2B 신뢰 근거 */
export const capability = {
  labelKo: '검증된 것만 싣습니다',
  labelEn: 'Verified only',
  body:
    '발주기관 직인이 찍힌 실적증명원과 공공입찰 등급확인서를 보유하고 있습니다. 근거를 댈 수 없는 수치는 이 사이트에 쓰지 않습니다.',
  items: [
    {
      title: '사업실적증명원 6종',
      detail: '발주기관 직인 원본 보유. 기간과 계약 규모가 전부 검증 가능합니다.',
      metric: '직인 검증',
    },
    {
      title: '공공입찰용 등급확인서',
      detail: '2024년 7월 발급본 보유. 공공 발주 참여 자격을 확인할 수 있습니다.',
      metric: '2024 발급',
    },
    {
      title: '단독 수행 구조',
      detail: '진행 중인 공공·대학 프로젝트 모두 컨소시엄이나 하도급 없이 단독 수행합니다.',
      metric: '하도급 0',
    },
    {
      title: '구축 후 운영까지',
      detail: '납품 후 손을 떼지 않고 운영과 유지보수, 추가 기능 납품을 이어서 맡습니다.',
      metric: '운영 포함',
    },
  ],
} as const;

/**
 * 협업 이력.
 * ⚠️ 로고 사용 허락을 받은 기관이 한 곳도 없다 (회신본 5-3).
 *    로고 월(logo wall)은 만들지 않고 텍스트로만 표기한다.
 */
export const clients = [
  { name: client('부산대학교', '국립대학교'), scope: 'AI 거점 사이트군 · LINC 3.0 · 과학영재교육원' },
  { name: client('부산인터넷방송국 · 부산디자인진흥원', '공공디자인 진흥 공공기관'), scope: '공공디자인 진단시스템' },
  { name: client('국립부경대학교', '국립대학교 산학협력단'), scope: '피지컬 AI 시스템 개발 교육' },
  { name: client('부산소프트웨어마이스터고', '소프트웨어 마이스터고'), scope: 'AI 캠프 · 직업역량강화 캠프' },
  { name: client('부산광역시교육청', '광역시 교육청'), scope: '디지털교과서 프론트엔드 개발' },
] as const;

/** 다루는 기술 영역 */
export const domains = [
  '검색 증강 생성 (RAG)',
  '하이브리드 검색',
  '임베딩 · 벡터DB',
  '근거 인용 생성',
  '컴퓨터 비전',
  '객체 탐지',
  '이미지 세그멘테이션',
  '멀티모달 모델',
  'TinyML · Edge AI',
  '온프레미스 LLM 구성',
  '망 분리 · 개인정보 마스킹',
  '데이터 시각화 · 지도',
  '교육용 IDE 설계',
  'AI 커리큘럼 설계',
  '프롬프트 · 컨텍스트 엔지니어링',
  '에이전트 오케스트레이션',
] as const;

/** 실적 로그 대시보드 문구 */
export const workLog = {
  labelKo: '진행 상황',
  labelEn: 'Log',
  addKo: '실적 추가',
  closeKo: '닫기',
  emptyKo: '이 분류에 등록된 실적이 없습니다.',
  storageNote: '브라우저에 저장됩니다. 실제 운영 시에는 자체 서버로 연결합니다.',
  lockedTip: '대표 실적은 삭제할 수 없습니다',
  cols: { idx: 'IDX', project: '프로젝트', client: '고객', period: '기간', metric: '지표', status: '상태' },
  stats: { total: '등록 실적', live: '운영 중', wip: '진행 중' },
  form: {
    title: '프로젝트명',
    client: '고객',
    category: '분류',
    status: '상태',
    period: '기간',
    summary: '한 줄 설명',
    metric: '대표 지표',
    metricLabel: '지표 설명',
    stack: '기술 스택 (쉼표로 구분)',
    submit: '등록',
    remove: '삭제',
    cancel: '취소',
  },
} as const;

export const nav = [
  { href: '#platform', labelKo: '사업 영역', labelEn: 'What We Do' },
  { href: '#work', labelKo: '실적', labelEn: 'Work' },
  { href: '#capability', labelKo: '검증', labelEn: 'Verified' },
  { href: '#contact', labelKo: '문의', labelEn: 'Contact' },
] as const;

export const cta = {
  primaryKo: '프로젝트 문의',
  primaryEn: 'Start a Project',
  /** ⚠️ 최신 회사소개서가 없다. 제작 완료까지 이 버튼은 노출하지 않는다 (회신본 6). */
  showDeck: false,
  secondaryKo: '회사 소개서 받기',
  secondaryEn: 'Get Deck',
  contactHeadline: '해결할 문제가 있으신가요',
  contactBody: '데이터는 있는데 어디서 시작할지 모르겠다면, 그 상태로 주셔도 됩니다.',
} as const;

/**
 * 대표 약력.
 * ⚠️ 공개 범위는 회신본 4-2에 명시된 것까지만. "박사수료"를 "박사"로 줄이지 않는다.
 */
export const founder = {
  nameKo: '조성호',
  nameEn: 'Cho Seongho',
  title: 'KODE KOREA 대표',
  titleEn: 'CEO',
  concurrent: '부산대학교 AI융합교육원 강사 · 동의대학교 산업체 멘토',
  education: [
    '부산대학교 전기공학과 학사',
    '부산대학교 대학원 컴퓨터공학과 석사',
    '부산대학교 대학원 컴퓨터공학과 박사수료',
  ],
  cert: 'TensorFlow Developer Certificate (Google)',
  tagline: '생성형 AI 시대의 교육과 개발을 잇는 사람',
  fields: [
    '생성형 AI 교육',
    'AI 에이전트 · LLM 활용 개발',
    'RAG · 멀티모달 시스템',
    '컴퓨터 비전',
    'AI 커리큘럼 설계',
  ],
} as const;

/**
 * 사업자 정보 — 법정 표기 의무.
 * `확인 필요` 항목은 공개 배포 전까지 대표가 채운다 (회신본 부록 A-4).
 */
export const legal = {
  bizNameKo: '코드코리아',
  bizNameEn: 'KODE KOREA',
  /** ⚠️ 개인사업자다. "(주)" 표기 금지. */
  bizType: '개인사업자',
  ceo: '조성호',
  address: '부산광역시 금정구 중앙대로1793번길 38, 204호',
  phone: '010-2751-7966',
  fax: '050-4288-7966',
  email: 'seongho.cho@kodekorea.kr',
  github: 'https://github.com/shain1912',
  /** 배포 전 필수. 값이 비어 있으면 푸터에 표기하지 않는다. */
  bizNumber: '',
  founded: '2017',
} as const;

export const footer = {
  copyright: `© ${new Date().getFullYear()} KODE KOREA. All rights reserved.`,
  links: [
    /** 개인정보처리방침은 문의 폼 가동 전까지 준비 중 (회신본 7). */
    { label: '개인정보처리방침', href: '#' },
  ],
} as const;

/** 시안 인덱스에서 사용 */
export const concepts = [
  {
    slug: 'v2',
    letter: 'V2',
    titleKo: 'B 베이스 + A 구조',
    titleEn: 'Merged',
    desc: '1차 평가 반영. 히어로를 3동사로 압축해 첫 화면이 곧 정보 구조가 되게 하고, Work를 카드 갤러리에서 증거 전시로 바꿨습니다. 콘텐츠는 검증된 실적으로 전면 교체.',
    ref: '디자이너 1차 평가 + 자료 회신본',
    tone: '현재 유력안',
  },
  {
    slug: 'hut8',
    letter: 'A',
    titleKo: '기업 신뢰형',
    titleEn: 'Infrastructure',
    desc: '무채색 + 액센트 1개. 섹션 단위 명암 대반전. 아이소메트릭 3D 지형을 카메라가 이동하며 3개 사업축을 통과합니다.',
    ref: 'hut8.com',
    tone: '정보 전달 완성도가 가장 높은 방향',
  },
  {
    slug: 'sentra',
    letter: 'B',
    titleKo: '엔지니어링형',
    titleEn: 'Engineering',
    desc: '흑백 + 오렌지 1개. 글자 스크램블 디코드, 1비트 디더링 이미지, 코드형 인덱스 라벨.',
    ref: 'Sentra 목업',
    tone: '첫인상이 가장 좋았던 방향',
  },
  {
    slug: 'hle',
    letter: 'C',
    titleKo: '서사형',
    titleEn: 'Narrative',
    desc: '서버랙 안으로 카메라가 진입하고, 그 화면이 사이트 본문이 됩니다.',
    ref: 'hle.io',
    tone: '정보 전달력이 가장 낮다고 평가됨',
  },
  {
    slug: 'robin',
    letter: 'D',
    titleKo: '실험형',
    titleEn: 'Journey',
    desc: '진입 게이트 + 막마다 팔레트를 갈아엎는 스크롤 여정.',
    ref: 'robin-thomas.me',
    tone: '인터랙션이 콘텐츠를 방해한다고 평가됨',
  },
] as const;
