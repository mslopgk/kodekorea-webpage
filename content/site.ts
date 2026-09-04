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
    '창업팀 프로토타입을 빠르게 만들어 드립니다. 공공기관과 대학의 AI 시스템도 설계부터 운영까지 단독으로 수행합니다.',
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
    slug: 'platform',
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
        {
          src: '/work/arise-hero.jpg',
          alt: 'ARISE-AI 거점 사이트 히어로 화면',
          caption: '거점 메인 · 운영 중',
        },
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
    slug: 'education',
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
    slug: 'public',
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
 * 창업팀 프로토타입 개발 — 서비스 포지셔닝.
 *
 * 2026-08-06 대표 지시로 추가했다. 이건 **실적 주장이 아니라 서비스 선언**이다.
 * "무엇을 해왔다"가 아니라 "무엇을 한다"이므로 제3자 증빙이 필요한 항목이 아니고,
 * 그래서 실적 영역(`portfolio`)이 아니라 별도 블록으로 둔다.
 *
 * ⚠️ 다만 `basis`에 들어가는 것은 전부 근거가 있는 사실이다.
 *    "스타트업 N팀 지원" 같은 누적 수치는 근거가 없어 쓰지 않았다.
 *    출처는 docs/portfolio-from-mail.md.
 */
export const prototyping = {
  labelKo: '창업팀 프로토타입 개발',
  labelEn: 'Prototypes for Founders',
  /** 대표가 지정한 문구 */
  taglineKo: '프로토타입 제작 · 스타트업 전문',
  lede:
    '아이디어만 있는 단계에서 투자자와 고객에게 보여줄 수 있는 것을 만듭니다. 기획서가 아니라 실제로 돌아가는 화면과 기능입니다.',
  body:
    '창업팀에 필요한 건 완성품이 아니라 검증입니다. 그래서 처음부터 크게 만들지 않고, 가장 먼저 증명해야 하는 것 하나를 골라 짧게 만들어 붙입니다. 반응을 보고 방향을 틀 수 있게 남겨둡니다.',
  items: [
    {
      title: '웹 · 앱 프로토타입',
      detail: '데모 가능한 화면과 핵심 기능. 스토어 배포까지 필요하면 배포도 맡습니다.',
    },
    {
      title: 'AI 기능 검증',
      detail: 'RAG · 비전 · 에이전트 등 핵심 AI 기능이 실제로 되는지 먼저 확인합니다.',
    },
    {
      title: '하드웨어 · IoT 시제품',
      detail: '센서와 임베디드를 붙인 동작 시제품. 엣지 AI 구성 경험이 있습니다.',
    },
    {
      title: 'IR · 데모용 자료',
      detail: '투자·경진대회 제출에 쓸 시연 영상과 화면을 함께 정리합니다.',
    },
  ],
  /** 근거가 있는 것만 — 여기에 지어낸 수치를 넣지 않는다 */
  basis: [
    {
      metric: '10건+',
      label: '해커톤 · 경진대회 멘토 · 심사',
      source: 'K-디지털 트레이닝 7·8회, AI·SW융합 해커톤 10·11회, 메이커톤·인벤톤 등',
    },
    {
      metric: '28종',
      label: '단기 제출 디자인 시안',
      source: '대학 거점 사이트군 (16종 + 12종)',
    },
    {
      metric: '136부',
      label: '파일럿 테스트 보고서',
      source: '목표 93회 대비 초과 달성, 완료보고 제출',
    },
    {
      metric: '배포',
      label: '앱 스토어 배포 · 유지보수',
      source: 'Google Play 개발자 계정 보유',
    },
  ],
  ctaKo: '프로토타입 상담',
} as const;

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

/**
 * 공공디자인 진단시스템의 실제 과업 범위.
 * 출처: 제안서협상안 (회신본 1-① `공개가능`)
 * 8개 진단영역과 부산 16개 구·군은 계약상 과업 범위이며 공개 가능한 사실이다.
 */
export const diagnosisAreas = [
  '주거',
  '환경',
  '교통',
  '안전',
  '교육',
  '산업일자리',
  '문화여가',
  '보건복지',
] as const;

/** 진단 대상 16개 구·군. 1차년도 시범 대상지는 부산진구. */
export const districts = [
  '중구',
  '서구',
  '동구',
  '영도구',
  '부산진구',
  '동래구',
  '남구',
  '북구',
  '해운대구',
  '사하구',
  '금정구',
  '강서구',
  '연제구',
  '수영구',
  '사상구',
  '기장군',
] as const;
export const pilotDistrict = '부산진구';

/**
 * 대학 AI 거점 사이트군의 실제 구성.
 * 출처: 발주처 확인·회신 메일 (회신본 1-②)
 * 도메인은 공개 운영 중인 것만 노출한다.
 */
export const hubSites = [
  { name: 'ARISE-AI 거점 메인', domain: 'arise-ai.pusan.ac.kr', status: 'live' },
  { name: '장영실 AI융합연구원', domain: '', status: 'wip' },
  { name: 'AX-PBL Teaching Studio', domain: '', status: 'wip' },
  { name: 'AI융합교육원 개편', domain: '', status: 'hold' },
] as const;

/**
 * 직인 검증 교육 실적 6건.
 * 출처: 발주기관 직인 사업실적증명원 (회신본 1-B)
 * 금액은 회신본 권고에 따라 반올림 규모로만 표기한다.
 */
export const verifiedWork = [
  { title: 'AI 캠프', year: '2022', scale: '3,750만 원 규모' },
  { title: '동계방학 직업역량강화 캠프', year: '2023', scale: '3,640만 원 규모' },
  { title: 'LINC 3.0 전공 살려 데이터 사이언스하기', year: '2022–23', scale: '1,960만 원 규모' },
  { title: 'LINC 3.0 AI Art Crash Course', year: '2023', scale: '2,180만 원 규모' },
  { title: '과학영재교육원 SW융합 해커톤', year: '2021', scale: '15개팀 운영' },
  { title: '과학영재교육원 AI 특강', year: '2021', scale: '1,000만 원 규모' },
] as const;

/**
 * 메일 원장에서 확인한 실적.
 *
 * 출처: mail.kodekorea.kr 전 계정 6,305통 헤더 + 결정적 13건 원문.
 *       추출 방법과 근거 등급은 `docs/portfolio-from-mail.md`에 있다.
 *
 * ⚠️ 지키는 규칙 세 가지:
 *   ① **견적은 실적이 아니다.** 여기 있는 것은 계약서·발주서·보증보험·세금계산서·
 *      완료보고 중 하나 이상이 확인된 건만이다. 견적만 오간 건(부산대 AI 거점대학
 *      웹사이트 3,000/1,000만 원안, 헥사휴먼케어 재활 케어센터 등)은 제외했다.
 *   ② **금액은 메일에서 확인된 것만** 쓴다. 확인 안 된 건은 `scale`을 비워 둔다.
 *   ③ 기관명은 전부 `client()`를 통과한다 — 실명 노출 동의를 받은 곳이 아직 없다.
 *
 * `evidence`는 그 줄을 왜 실을 수 있는지다. 근거가 없으면 줄을 만들지 않는다.
 */
export type Evidence = '계약' | '청구' | '수행' | '강의';

export const portfolio = [
  {
    title: 'AI 로보틱스 교육 플랫폼 구축 및 프로그램 개발',
    slug: 'busan-science-robotics',
    detail: {
      lede: '국립 과학관의 로보틱스 교육을 플랫폼과 프로그램 양쪽으로 구축하는 용역입니다. 나라장터를 통해 계약서를 주고받고 계약보증보험까지 발행된 건입니다.',
      scope: [
        '강의계획서·프로그램·교안·활동지 12종 개발',
        '강사용 교육자료 및 강사 교육 과정 제작',
        '시범교육 운영 — 중등 1회, 고등 1회',
        '차시 구성: 110분 4차시 단위, 학교급별 3개 블록',
        '중등은 블록 코딩, 고등은 바이브 코딩으로 분리 설계',
        '적용 주제: 스마트팩토리 · 해양물류',
        '실습 장비: Dobot Magician Lite · DobotLab',
        '다룰 기술: 뎁스 카메라 · 자율주행 · 라이다',
      ],
      docs: [
        '나라장터 계약서 (초안 수신 후 응답계약서 송신)',
        '계약보증보험 증권',
        '수의계약 제한 여부 확인서',
        '인지세 납부',
        '사업자등록증 · 통장사본',
      ],
    },
    org: client('국립부산과학관', '국립 과학관'),
    period: '2026',
    status: 'wip' as const,
    kind: 'platform',
    evidence: '계약' as Evidence,
    note: '나라장터 계약 · 계약보증보험 발행',
    scale: 'Dobot 기반 중등·고등 12개 과정',
  },
  // ⚠️ 공공디자인 진단시스템은 여기 넣지 않는다 — `pillars`의 `public` 축이 같은 사업이고,
  //    거기에 더 자세한 과업 범위가 들어 있다. 둘 다 실으면 표에 같은 건이 두 번 나온다.
  //    메일에서 새로 확인한 사실(2025-12-31 **선금보증보험** 발행 = 선금 수령)은
  //    docs/portfolio-from-mail.md §1에 기록해 두었다.
  {
    title: 'AX-PBL 홈페이지 구축',
    slug: 'pnu-ax-pbl',
    detail: {
      lede: '국립대학교 AX-PBL 조직의 홈페이지를 구축하는 수의계약입니다. 대학 AI 거점 사이트군 4개 중 하나이지만 별건으로 계약했습니다.',
      scope: [
        'AX-PBL 홈페이지 기획·디자인·구축',
        '거점 사이트군의 공통 정보구조·디자인 시스템 적용',
      ],
      docs: [
        '견적서 — 합계 3,139,000원 (부가가치세 포함)',
        '비교견적서 1부',
        '수의계약 체결 제한 여부 확인서 (서명 완료)',
        '청렴계약서(서약서) (서명 완료)',
        '사업자등록증',
      ],
    },
    org: client('부산대학교', '국립대학교'),
    period: '2026-07',
    status: 'wip' as const,
    kind: 'platform',
    evidence: '계약' as Evidence,
    // 거점 사이트군 4개 중 하나이지만 별건 수의계약이라 따로 센다.
    note: '수의계약 · 거점 사이트군 중 1건',
    scale: '3,139,000원',
  },
  {
    title: '학석사연계과정 홈페이지 구축',
    slug: 'pnu-bs-ms',
    detail: {
      lede: '국립대학교 학석사연계과정 홈페이지를 구축하는 수의계약입니다. AX-PBL과 같은 절차로 별건 계약했습니다.',
      scope: [
        '학석사연계과정 홈페이지 기획·디자인·구축',
      ],
      docs: [
        '견적서 — 합계 3,139,000원 (부가가치세 포함)',
        '비교견적서 1부',
        '수의계약 체결 제한 여부 확인서 (서명 완료)',
        '청렴계약서(서약서) (서명 완료)',
        '사업자등록증',
      ],
    },
    org: client('부산대학교', '국립대학교'),
    period: '2026-07',
    status: 'wip' as const,
    kind: 'platform',
    evidence: '계약' as Evidence,
    note: '수의계약 · 비교견적 1부',
    scale: '3,139,000원',
  },
  {
    title: 'SW교육강사양성 프로그램 운영 대행',
    slug: 'dau-sw-instructor',
    detail: {
      lede: '대학 SW혁신센터의 SW교육강사양성 프로그램을 위탁받아 운영을 대행했습니다. 발주서와 과업지시서가 모두 확인되고, 납품 후 검수를 거쳐 대금까지 청구된 건입니다.',
      scope: [
        'SW교육강사양성 프로그램 전체 운영 대행',
        '납품 후 산학협력단 연구비시스템 물품검수 절차 이행',
      ],
      docs: [
        '발주서',
        '과업지시서',
        '거래명세서',
        '전자세금계산서 발행',
      ],
    },
    org: client('동아대학교 산학협력단', '사립대학교 산학협력단'),
    period: '2025',
    status: 'done' as const,
    kind: 'education',
    evidence: '계약' as Evidence,
    note: '발주서 · 과업지시서',
    scale: '',
  },
  {
    title: 'SW 온라인 멘토링 프로그램 운영',
    slug: 'dau-sw-mentoring',
    detail: {
      lede: '대학 산학협력단의 SW 온라인 멘토링 프로그램 운영 용역입니다. 전년도 강사양성 과업에 이어 재발주된 건입니다.',
      scope: [
        '온라인 멘토링 프로그램 운영 대행',
        '멘토 모집·배정 및 수행일지 수집·정리',
        '멘토 수행일지 20건 이상 취합 (AI학과 등 재학생 멘토)',
      ],
      docs: [
        '발주서',
        '멘토 수행일지 제출본',
      ],
    },
    org: client('동아대학교 산학협력단', '사립대학교 산학협력단'),
    period: '2026',
    status: 'wip' as const,
    kind: 'education',
    evidence: '계약' as Evidence,
    note: '발주서',
    scale: '멘토 20명 이상 운영',
  },
  {
    title: '피지컬 AI 시스템 개발 프로젝트 교육',
    slug: 'pknu-physical-ai',
    detail: {
      lede: '국립대학교 SW융합원의 피지컬 AI 시스템 개발 프로젝트 교육 용역입니다. 2개 과정으로 구성되며 계약 서류를 회신하고 계약일자를 협의한 단계입니다.',
      scope: [
        '피지컬 AI 시스템 개발 교육 2개 과정 설계·운영',
        '연계 공모전 참가팀 API 키 발급 및 기술 지원',
        '배포 후 통신 오류 등 실습 트러블슈팅 대응',
      ],
      docs: [
        '최종 견적서',
        '비교 견적서',
        '사업자등록증 · 통장사본',
        '전문가 활용 확인서',
      ],
    },
    org: client('국립부경대학교 SW융합혁신원', '국립대학교 SW융합원'),
    period: '2026-07',
    status: 'wip' as const,
    kind: 'education',
    evidence: '계약' as Evidence,
    note: '계약 서류 회신 · 계약일자 협의',
    scale: '2개 과정',
  },
  {
    title: '클릭온 AI 파일럿 테스트',
    slug: 'clickon-ai-pilot',
    detail: {
      lede: 'AI 교육 프로그램 모음의 출시 전 파일럿 테스트를 수행했습니다. 목표를 초과 달성하고 완료보고서와 산출물을 제출해 종료된 건입니다.',
      scope: [
        '테스트 목표 93회 — 프로그램 31건 × 인원 3명',
        '작성 보고서 136부 (목표 대비 초과 달성, 진행률 100%)',
        '중간보고 64회 69% → 완료보고 100%, 8일간 수행',
        '프로그램별 담당자 배정 및 진행 현황 시트 관리',
        '대상 프로그램 예: 인공지능 그림판, AI 윤리·개인정보, AI 이미지 분류, 생성형 AI 입문, 진로탐험',
        '버그 리포트 작성 및 프로그램 정보 리스트 갱신',
      ],
      docs: [
        '중간보고 · 완료보고 메일',
        '진행 현황 스프레드시트',
        '보고서 136부 (드라이브 제출)',
        '전자세금계산서 발행',
      ],
    },
    org: client('마이스플랜즈', '행사 운영 대행사'),
    period: '2026-05',
    status: 'done' as const,
    kind: 'platform',
    evidence: '수행' as Evidence,
    note: '완료보고 · 산출물 제출',
    scale: '보고서 136부 (목표 93회 초과)',
  },
  {
    title: 'AI퀴즈대회 문항 검수',
    slug: 'ai-quiz-review',
    detail: {
      lede: '전국 규모 AI 퀴즈대회의 문항을 구간별로 나눠 여러 차수에 걸쳐 검수했습니다.',
      scope: [
        '문항 구간별 검수 — 3000–3100, 4100–5151, 7000–8050',
        '2차본 · 3차 · 4차 · 최종까지 반복 검수',
        '검수 결과 회신 6회 (약 5주간)',
      ],
      docs: [
        '차수별 검수 요청본 및 회신',
        '전자세금계산서 발행',
      ],
    },
    org: client('마이스플랜즈', '행사 운영 대행사'),
    period: '2026-05~06',
    status: 'done' as const,
    kind: 'platform',
    evidence: '수행' as Evidence,
    note: '다차 검수 회신 6회',
    scale: '3000–8050번 구간',
  },
  {
    title: '해돋움 중학 연산 앱 개발·유지보수',
    slug: 'haedodum-math-app',
    detail: {
      lede: '교육기관의 중학 연산 학습 앱을 개발해 스토어에 배포하고, 이후 매뉴얼 정비와 유지보수까지 이어서 맡았습니다. 납품 후 손을 떼지 않은 건입니다.',
      scope: [
        '연산 학습 앱 개발 및 Google Play 배포',
        '개발자 계정 운영 및 스토어 정책 대응',
        '교사용 매뉴얼 작성·검토, 배포용 QR 제작',
        '수정 배포 및 유지보수',
      ],
      docs: [
        '앱 배포 견적서',
        'Google Play 배포 (개발자 계정 보유)',
        '매뉴얼 검토 회신',
        '전자세금계산서 발행 · 유지보수 청구',
      ],
    },
    org: client('부산광역시교육연구정보원', '광역시 교육연구정보원'),
    period: '2025–26',
    status: 'live' as const,
    kind: 'platform',
    evidence: '청구' as Evidence,
    note: 'Google Play 배포 · 유지보수 청구',
    scale: '',
  },
  {
    title: '웨어러블 AI 엣지 컴퓨팅 프로젝트',
    slug: 'pnu-wearable-edge-ai',
    detail: {
      lede: '국립대학교 공학교육혁신센터의 웨어러블 AI 엣지 컴퓨팅 프로젝트를 2년 연속 맡았습니다. 단기와 중장기 두 트랙으로 나뉘어 운영됐습니다.',
      scope: [
        '심화 프로젝트 강의 (첫해)',
        '이듬해 단기 · 중장기 2개 트랙으로 확대',
        '강의자료 제작 및 실습 재료 선정·구매 요청',
        '센터 주관 회의 참여 (2차 이상)',
        '연계 메이커톤 강의 및 심사',
      ],
      docs: [
        '강사료 지급 서류 (2개 연도)',
        '납품서',
        '전자세금계산서 발행 (산학협력단)',
      ],
    },
    org: client('부산대학교 공학교육혁신센터', '국립대학교 공학교육혁신센터'),
    period: '2024–25',
    status: 'done' as const,
    kind: 'education',
    evidence: '강의' as Evidence,
    note: '단기·중장기 2개 트랙 연속 수행',
    scale: '',
  },
  {
    title: '창의설계활동 IoT 구현',
    slug: 'ksa-creative-design',
    detail: {
      lede: '영재학교의 창의설계활동 과목에서 IoT 구현을 담당했습니다. 정규 학기와 여름방학 특강을 2년 연속 맡았습니다.',
      scope: [
        '창의설계활동 IoT 구현 수업 설계·운영',
        '여름방학 특별강좌 별도 운영',
        '실습 물품 선정 및 구매 연계',
        '2개 연도 연속 수행',
      ],
      docs: [
        '강사료 지급 서류',
        '납품서',
        '전자세금계산서 발행',
      ],
    },
    org: client('한국과학영재학교', 'KAIST 부설 영재학교'),
    period: '2025–26',
    status: 'wip' as const,
    kind: 'education',
    evidence: '청구' as Evidence,
    note: '정규 학기 + 여름방학 특강 · 2년 연속',
    scale: '',
  },
  {
    title: '생성형 AI 실무 과정 (Gemini · Claude Code)',
    slug: 'bdc-genai',
    detail: {
      lede: '디자인진흥원 재직자를 대상으로 생성형 AI 실무 과정을 설계·운영했습니다. 사전 설문 결과를 받아 과정 내용을 맞춘 건입니다.',
      scope: [
        '사전 설문 설계 → 결과 기반 과정 커스터마이즈',
        '6시간 강의안 개발',
        'Gemini · Antigravity 활용 과정',
        'Claude Code 기반 에이전틱 바이브코딩 과정',
        '후속 신규 교육과정 개설 협의',
        '실습용 API 사용료 견적 및 키 발급 지원',
      ],
      docs: [
        '강사 서류',
        '사업자등록증명원',
        '사전 설문 결과 및 참석자 명단',
        'API 사용료 견적서',
      ],
    },
    org: client('(재)부산디자인진흥원', '광역시 디자인진흥원'),
    period: '2026',
    status: 'wip' as const,
    kind: 'education',
    evidence: '강의' as Evidence,
    note: '사전 설문 기반 과정 설계',
    scale: '6시간 과정',
  },
  {
    title: 'BeAT 교사 연수',
    slug: 'beat-teacher-training',
    detail: {
      lede: '광역시 교육청이 도입한 교육 솔루션의 교사 연수를 솔루션 공급사로부터 위탁받아 수행합니다. 학교 요청에 따라 부정기적으로 투입되는 상시 과업입니다.',
      scope: [
        '교사 대상 솔루션 활용 연수 — 온라인 및 학교 방문 오프라인',
        '학교 요청 기반 부정기 운영 (주 2~3회 수준)',
        '강사 2~3명 편성·관리 및 강사 리스트 제출',
        '교사용·학생용 매뉴얼과 활용 가이드 기반 연수 진행',
      ],
      docs: [
        '연수 자료 및 매뉴얼 수령',
        '강사 리스트 제출',
        '교육청 강사비 기준 적용',
      ],
    },
    org: client('부산광역시교육청', '광역시 교육청'),
    period: '2026',
    status: 'live' as const,
    kind: 'education',
    evidence: '강의' as Evidence,
    note: '솔루션 공급사 위탁 · 주 2~3회',
    scale: '',
  },
  {
    title: '국어 교사 대상 생성형 AI 실무 연수',
    slug: 'gne-korean-genai',
    detail: {
      lede: '도 교육청 연수원의 의뢰로 국어과 교사 대상 생성형 AI 실무 연수를 설계했습니다. 명령어 요령을 가르치는 과정이 아니라, 수업 맥락을 AI에 넘겨 업무를 바꾸는 쪽으로 짰습니다.',
      scope: [
        '총 6시간 과정 — 국어과 4년차 내외 대상',
        '1축: 컨텍스트 엔지니어링 · Skills · MCP로 업무 혁신',
        '2축: 코딩 없이 학생용 수업 도구 직접 제작',
        '실습 도구 선정 및 계정 조달 방안 제시',
        '연수 원고 작성',
      ],
      docs: [
        '연수 계획서',
        '연수 원고',
        '강사 서류',
      ],
    },
    org: client('경상남도교육청 교육연수원', '도 교육청 연수원'),
    period: '2026-08',
    status: 'wip' as const,
    kind: 'education',
    evidence: '강의' as Evidence,
    note: '컨텍스트 엔지니어링 · MCP · 수업도구 제작',
    scale: '6시간 과정',
  },
  {
    title: 'AI 리터러시 교육 (공업고 연계)',
    slug: 'pknu-ai-literacy',
    detail: {
      lede: '국립대학교 SW융합원이 지역 공업고등학교와 연계해 운영하는 AI 리터러시 교육입니다. 커리큘럼 제안부터 현장 운영까지 맡았습니다.',
      scope: [
        '공업고 동아리 대상 AI 리터러시 커리큘럼 제안',
        '연계 고등학교 프로그램 운영',
        '학교별 일정·내용 조정',
      ],
      docs: [
        '커리큘럼 제안서',
        '강사료 지급 서류',
        '전문가 활용 확인서',
      ],
    },
    org: client('국립부경대학교 SW융합혁신원', '국립대학교 SW융합원'),
    period: '2026',
    status: 'done' as const,
    kind: 'education',
    evidence: '강의' as Evidence,
    note: '커리큘럼 제안부터 운영까지',
    scale: '',
  },
  {
    title: '실버 온라인 판매채널 구축·마케팅 실무',
    slug: 'yeil-silver-commerce',
    detail: {
      lede: '직업전문학교의 실버 세대 대상 온라인 판매채널 과정에서 웹·데이터베이스 전 과목을 맡았습니다. 강의만 나간 것이 아니라 지도안과 평가 설계까지 작성했습니다.',
      scope: [
        '담당 과목: 웹화면 구현 · 웹프로그래밍 응용 · 데이터베이스 기초/SQL',
        '강의지도안 및 강의기획서 작성',
        '평가서류 서식 작성 및 평가 3차 운영',
        '실습 과제 설계 — 실버 세대 쇼핑몰 웹페이지, 온라인 퀴즈 페이지, MySQL 쿼리 작성',
        '수강생 과제·시험 제출물 첨삭 (약 3개월)',
      ],
      docs: [
        '강의지도안',
        '강의기획서',
        '평가서류 서식 및 평가자료',
      ],
    },
    org: client('부산예일직업전문학교', '직업전문학교'),
    period: '2025',
    status: 'done' as const,
    kind: 'education',
    evidence: '강의' as Evidence,
    note: '웹화면구현 · 웹프로그래밍 · DB 전 과정',
    scale: '',
  },
  {
    title: '모두의 코딩 · 찾아가는 미래직업 메이커 체험',
    slug: 'bukbu-coding-maker',
    detail: {
      lede: '교육지원청 주관으로 관내 중학교를 순회하며 코딩과 메이커 체험 프로그램을 운영했습니다.',
      scope: [
        '관내 중학교 순회 운영',
        '학교별 신청 현황에 따른 일정 편성',
        '찾아가는 미래직업·메이커 체험 프로그램 진행',
      ],
      docs: [
        '강사 서류 일체',
        '견적서 · 납품서',
        '전자세금계산서 발행',
      ],
    },
    org: client('부산광역시북부교육지원청', '교육지원청'),
    period: '2025',
    status: 'done' as const,
    kind: 'education',
    evidence: '청구' as Evidence,
    note: '관내 중학교 순회 운영',
    scale: '',
  },
] as const;

/** 근거 등급별 표기 */
export const evidenceLabel: Record<Evidence, string> = {
  계약: '계약 확인',
  청구: '세금계산서 발행',
  수행: '완료보고',
  강의: '강사료 지급 확인',
};

/**
 * 세금계산서를 발행한 거래처 수 — 실적 규모를 말할 때 가장 다투기 어려운 숫자다.
 * 출처: 홈택스 발행 알림 20건 (2025-02 ~ 2026-06), `docs/portfolio-from-mail.md` §2
 */
export const billingSummary = {
  count: 20,
  publicCount: 14,
  privateCount: 6,
  from: '2025-02',
  to: '2026-06',
  label: '세금계산서 발행 거래처',
  source: '홈택스 발행 알림',
} as const;

/** 실적 로그 대시보드 문구 */
/**
 * 상태·분류 라벨의 단일 소스.
 *
 * 이전에는 `app/c/v2/posts.ts`에만 있었는데 그 파일은 `'use client'`라서
 * 서버 컴포넌트(프로젝트 상세 페이지)에서 끌어오면 모듈 전체가 클라이언트로 넘어간다.
 * 라벨은 순수 콘텐츠이므로 여기 둔다. posts.ts는 이걸 다시 내보내기만 한다.
 */
export const statusText = {
  live: '운영 중',
  wip: '진행 중',
  done: '완료',
} as const;

export const categoryText = {
  public: '공공 시스템',
  education: 'AI 교육',
  platform: '플랫폼',
} as const;

/** 실적 로그 대시보드 문구 */
export const workLog = {
  labelKo: '진행 상황',
  labelEn: 'Log',
  addKo: '실적 추가',
  closeKo: '닫기',
  detailKo: '상세보기',
  /** 직접 추가한 항목은 이 브라우저에만 있다는 것을 상세에서 분명히 밝힌다 */
  localOnlyKo: '직접 추가한 항목입니다. 이 브라우저에만 저장되며 공유 주소가 없습니다.',
  emptyKo: '이 분류에 등록된 실적이 없습니다.',
  storageNote: '브라우저에 저장됩니다. 실제 운영 시에는 자체 서버로 연결합니다.',
  lockedTip: '대표 실적은 삭제할 수 없습니다',
  cols: { idx: 'IDX', project: '프로젝트', client: '고객', period: '기간', metric: '지표', status: '상태' },
  stats: { total: '등록 실적', live: '운영 중', wip: '진행 중' },
  /** 계약 성립 전이라 실적으로 게재할 수 없는 상태 (회신본 1-② 참고) */
  holdKo: '계약 전',
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

/**
 * 프로토타입 섹션의 내비 항목.
 *
 * `nav` 배열에 끼워 넣지 않는다 — `/c/*`의 옛 시안 페이지들이 `nav[0]`, `nav[3]`처럼
 * **위치 인덱스로** 참조하고 있어서, 앞에 하나 넣으면 그 페이지들의 섹션 라벨이
 * 조용히 한 칸씩 어긋난다. 실물 홈페이지만 이 항목을 nav 앞에 붙여 쓴다.
 */
export const protoNav = { href: '#prototype', labelKo: '프로토타입', labelEn: 'Prototypes' } as const;

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
  /**
   * 사업자등록번호. 2026-08-03 수령, 체크섬 검증 통과.
   * 국내 상업 웹사이트의 법정 표기 의무 항목이다.
   */
  bizNumber: '679-09-00696',
  founded: '2017',
} as const;

/** 사업자정보 표기 라벨 — 법정 표기 항목 */
export const legalLabels = {
  heading: '사업자정보',
  bizName: '상호',
  ceo: '대표자',
  bizNumber: '사업자등록번호',
  address: '주소',
  phone: '전화',
  email: '이메일',
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
