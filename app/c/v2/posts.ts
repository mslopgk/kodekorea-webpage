'use client';

import { useCallback, useEffect, useState } from 'react';
import { evidenceLabel, pillars, portfolio } from '@/content/site';

/**
 * 포트폴리오 게시물 저장소.
 *
 * ── 지금: 브라우저 localStorage
 * ── 나중: 자체 호스팅 Supabase
 *
 * 아래 `store` 객체 하나만 갈아끼우면 됩니다. UI는 손대지 않아도 됩니다.
 * Supabase 전환 시 필요한 것:
 *   1. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   2. `works` 테이블 (아래 Post 타입과 동일한 컬럼)
 *   3. RLS: select는 anon 허용, insert/delete는 인증된 사용자만
 * 정적 export 상태에서도 클라이언트에서 직접 호출하므로 서버는 필요 없습니다.
 */

export type Category = 'public' | 'education' | 'platform';
export type Status = 'live' | 'wip' | 'done';

export type Post = {
  id: string;
  code: string;
  title: string;
  client: string;
  category: Category;
  status: Status;
  period: string;
  summary: string;
  metric: string;
  metricLabel: string;
  stack: string[];
  /** 씨드 데이터는 지울 수 없게 표시 — 실수로 실적을 날리는 것을 막는다 */
  locked?: boolean;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  public: '공공 시스템',
  education: 'AI 교육',
  platform: '플랫폼',
};

export const STATUS_LABEL: Record<Status, string> = {
  live: '운영 중',
  wip: '진행 중',
  done: '완료',
};

/**
 * 씨드 = 사업축 대표 3건 + 메일 원장에서 확인한 실적 전부.
 *
 * 이전에는 사업축 3개만 씨드였다. 회사 메일 6,305통을 훑어 계약서·발주서·보증보험·
 * 세금계산서·완료보고 중 하나 이상이 확인된 건을 `content/site.ts`의 `portfolio`로
 * 정리했고, 여기서 그대로 읽는다. 근거 등급이 `metricLabel`에 그대로 노출되므로
 * 표를 보는 사람이 "왜 이걸 실적이라 하는지"를 바로 확인할 수 있다.
 *
 * 씨드는 모두 `locked` — 실수로 실적을 지우는 것을 막는다.
 */
/** 분류별 연번을 붙인다 — W/xx, A/xx, S/xx */
const PREFIX: Record<Category, string> = { platform: 'W', education: 'A', public: 'S' };
const counter: Record<Category, number> = { platform: 0, education: 0, public: 0 };
const nextCode = (c: Category) => `${PREFIX[c]}/${String(++counter[c]).padStart(2, '0')}`;

const pillarSeed: Post[] = pillars.map((p, i) => ({
  id: `seed-${p.id}`,
  /**
   * 사업축의 `p.code`(W/01·A/02·S/03)는 **전체 순번**이라 분류별 연번과 겹친다.
   * 표 안에서는 분류별로 다시 번호를 매겨야 W/01,A/01,S/01,W/02… 로 충돌 없이 읽힌다.
   */
  code: nextCode(p.id as Category),
  title: p.project.name,
  client: p.project.client,
  category: p.id as Category,
  status: i === 0 ? 'live' : 'wip',
  period: p.project.period,
  summary: p.project.subtitle,
  metric: p.project.metrics[0].value + p.project.metrics[0].unit,
  metricLabel: p.project.metrics[0].label,
  stack: [...p.project.stack],
  locked: true,
}));

const mailSeed: Post[] = portfolio.map((w, i) => {
  const category = w.kind as Category;
  return {
    id: `mail-${i}`,
    code: nextCode(category),
    title: w.title,
    client: w.org,
    category,
    status: w.status as Status,
    period: w.period,
    summary: w.note,
    // 금액·규모가 확인된 건만 지표를 채운다. 없으면 근거 등급 자체가 지표다.
    metric: w.scale || w.evidence,
    metricLabel: evidenceLabel[w.evidence],
    stack: [],
    locked: true,
  };
});

const seed: Post[] = [...pillarSeed, ...mailSeed];

const KEY = 'kk.works.v1';

const store = {
  read(): Post[] {
    if (typeof window === 'undefined') return seed;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return seed;
      const parsed = JSON.parse(raw) as Post[];
      if (!Array.isArray(parsed)) return seed;
      // 씨드는 항상 살려둔다 — 저장된 목록에 없으면 다시 붙인다
      const extras = parsed.filter((p) => !p.locked);
      return [...seed, ...extras];
    } catch {
      return seed;
    }
  },
  write(posts: Post[]) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(posts.filter((p) => !p.locked)));
    } catch {
      /* 용량 초과 등은 무시 */
    }
  },
};

export function usePosts() {
  // 서버 렌더와 첫 클라이언트 렌더를 일치시킨다 (하이드레이션 불일치 방지)
  const [posts, setPosts] = useState<Post[]>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPosts(store.read());
    setReady(true);
  }, []);

  const add = useCallback((draft: Omit<Post, 'id' | 'code'>) => {
    setPosts((prev) => {
      const n = prev.filter((p) => p.category === draft.category).length + 1;
      const prefix = draft.category === 'public' ? 'S' : draft.category === 'education' ? 'A' : 'W';
      const next: Post[] = [
        ...prev,
        { ...draft, id: `p-${Date.now()}`, code: `${prefix}/${String(n).padStart(2, '0')}` },
      ];
      store.write(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== id || p.locked);
      store.write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setPosts(seed);
    store.write(seed);
  }, []);

  return { posts, add, remove, reset, ready };
}
