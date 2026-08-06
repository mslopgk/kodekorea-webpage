/**
 * 프로젝트 상세 인덱스.
 *
 * 실적은 두 곳에 나뉘어 있다:
 *   · `pillars` — 사업축 대표 3건. 캡처·수치·출처·기술스택까지 있는 두꺼운 항목
 *   · `portfolio` — 메일 원장에서 확인한 17건. 근거 등급·과업 범위·확인 문서 중심
 *
 * 상세 페이지는 둘 다 렌더해야 하므로 여기서 하나의 모양으로 합친다.
 * **여기서 새 사실을 만들지 않는다** — 두 소스에 있는 것만 옮겨 담는다.
 * 없는 항목은 `undefined`로 두고, 화면에서 그 블록을 아예 그리지 않는다.
 */
import {
  type Evidence,
  evidenceLabel,
  pillars,
  portfolio,
} from './site';

export type ProjectKind = 'platform' | 'education' | 'public';

export type ProjectMetric = {
  value: string;
  unit: string;
  label: string;
  /** 이 수치를 어디서 가져왔는지. 없으면 화면에 쓰지 않는다. */
  source: string;
};

export type ProjectImage = { src: string; alt: string; caption: string };

export type Project = {
  slug: string;
  title: string;
  /** 한 줄 부제 — 목록과 페이지 헤더에서 함께 쓴다 */
  subtitle?: string;
  org: string;
  period: string;
  kind: ProjectKind;
  status: 'live' | 'wip' | 'done';
  /** 근거 등급 — 메일 원장에서 온 항목만 갖는다 */
  evidence?: Evidence;
  evidenceText?: string;
  /** 규모·금액. 확인된 것만 */
  scale?: string;
  /** 한 문단 설명 */
  lede?: string;
  /** 과업 범위 */
  scope?: readonly string[];
  /** 확인된 근거 문서 */
  docs?: readonly string[];
  /** 수치 (사업축만 보유) */
  metrics?: readonly ProjectMetric[];
  /** 실제 캡처 (승인된 것만) */
  images?: readonly ProjectImage[];
  stack?: readonly string[];
  role?: string;
  /** 사업축에서 온 항목인지 — 페이지에서 본문 섹션 구성이 달라진다 */
  isPillar: boolean;
};

const fromPillars: Project[] = pillars.map((p) => ({
  slug: p.slug,
  title: p.project.name,
  subtitle: p.project.subtitle,
  org: p.project.client,
  period: p.project.period,
  kind: p.id as ProjectKind,
  // 거점 메인이 운영 중인 platform만 live, 나머지는 진행 중이다 (Dashboard 씨드와 동일 기준)
  status: p.id === 'platform' ? 'live' : 'wip',
  lede: p.project.body,
  metrics: p.project.metrics,
  images: 'images' in p.project ? p.project.images : undefined,
  stack: p.project.stack,
  role: p.project.role,
  isPillar: true,
}));

const fromMail: Project[] = portfolio.map((w) => ({
  slug: w.slug,
  title: w.title,
  subtitle: w.note,
  org: w.org,
  period: w.period,
  kind: w.kind as ProjectKind,
  status: w.status,
  evidence: w.evidence,
  evidenceText: evidenceLabel[w.evidence],
  scale: w.scale || undefined,
  lede: w.detail.lede,
  scope: w.detail.scope,
  docs: w.detail.docs,
  isPillar: false,
}));

export const projects: Project[] = [...fromPillars, ...fromMail];

/** 빌드 시 slug 충돌을 잡는다 — 충돌하면 한 페이지가 조용히 덮인다. */
const seen = new Set<string>();
for (const p of projects) {
  if (seen.has(p.slug)) {
    throw new Error(`프로젝트 slug 중복: ${p.slug}`);
  }
  seen.add(p.slug);
}

export const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

export const projectPath = (slug: string) => `/project/${slug}/`;

/** 상세 페이지 문구 */
export const projectLabels = {
  back: '실적 목록으로',
  org: '발주처',
  period: '기간',
  status: '상태',
  scale: '규모',
  role: '수행 범위',
  evidence: '근거',
  scope: '과업 범위',
  docs: '확인된 근거 문서',
  metrics: '수치',
  stack: '기술 · 방법',
  /** 마스킹 안내 — 상세 페이지에서 기관명이 뭉개져 보이는 이유를 밝힌다 */
  maskNote:
    '발주처는 실명 노출 동의를 받기 전이라 기관 유형으로만 표기합니다. 확인이 필요하시면 문의해 주십시오.',
  docsNote: '아래 문서는 실물을 보유하고 있으며 요청 시 제시할 수 있습니다.',
  next: '다른 실적',
} as const;
