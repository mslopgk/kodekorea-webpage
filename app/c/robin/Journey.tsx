'use client';

/**
 * 컨셉 D 오케스트레이터.
 *
 * - 진입 게이트(수동 START) → 본문. 게이트는 마운트 후에만 렌더한다.
 * - 4개의 막 + 3회의 화이트아웃 전환. 막마다 팔레트를 완전히 갈아엎는다.
 * - 진행은 오직 스크롤 "양"으로만. 속도 게이트는 없다(원본의 접근성 문제).
 * - 좌하단 안내 라벨이 현재 막에 맞춰 바뀌고, 마지막 막에서는
 *   다음 행동(문의)으로 라벨이 교체된다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { company, cta, nav } from '@/content/site';
import ActFour from './ActFour';
import ActOne from './ActOne';
import ActThree from './ActThree';
import ActTwo from './ActTwo';
import Gate from './Gate';
import Whiteout from './Whiteout';
import type { Vars } from './parts';
import './robin.css';

const ACT_COUNT = 4;

/** 막별 배경색 — 화이트아웃 구간 그라디언트의 양끝 */
const PALETTE = ['#08090b', '#100c0c', '#0a0418', '#d3f2e6'] as const;

/**
 * 막 번호(1~4) → 내비 항목 인덱스.
 * 막1은 히어로·회사 소개라 대응하는 내비 항목이 없다(null).
 * 막2 = 사업 영역(+실적), 막3 = 운영 역량, 막4 = 문의.
 * 단순히 `act - 1` 로 매기면 히어로에서 '사업 영역'이 현재 항목으로 켜져 버린다.
 */
const ACT_NAV = [null, null, 0, 2, 3] as const;

export default function Journey() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [gate, setGate] = useState<'idle' | 'open' | 'done'>('idle');
  const [act, setAct] = useState(1);
  const [scrolled, setScrolled] = useState(0);

  /* 마운트 후 게이트 결정. 이미 스크롤된 상태로 들어왔으면 게이트를 띄우지 않는다. */
  useEffect(() => {
    setGate(window.scrollY > 120 ? 'done' : 'open');
  }, []);

  /* 게이트가 떠 있는 동안만 배경 스크롤을 잠근다(모달 패턴). 진입 후 즉시 해제. */
  useEffect(() => {
    if (gate !== 'open') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [gate]);

  /* 현재 막 추적 — 화면 중앙선을 이미 지난 마커 중 마지막 것이 현재 막.
     마커는 문서 순서대로 [막1, 전환1중앙(2), 막2, 전환2중앙(3), 막3, 전환3중앙(4), 막4]
     이므로 화이트아웃의 백색 피크에서 정확히 막 번호가 넘어간다.

     IntersectionObserver + `rootMargin: -50% 0 -49.9% 0` 같은 0.1vh 밴드는
     서브픽셀 계산에 기대는 방식이라 뷰포트 높이에 따라 통째로 죽을 수 있다.
     스크롤 위치를 직접 읽는 편이 결정적이고 검증 가능하다. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const marks = Array.from(root.querySelectorAll<HTMLElement>('[data-act-index]'));
    if (!marks.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const center = window.innerHeight / 2;
      let current = 1;
      for (const el of marks) {
        // 문서 순서 = rect.top 오름차순. 중앙선 아래를 만나면 더 볼 필요가 없다.
        if (el.getBoundingClientRect().top > center) break;
        const i = Number(el.dataset.actIndex);
        if (Number.isFinite(i)) current = i;
      }
      setAct(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* 전역 스크롤 진행률 (하단 진행 바) */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const enter = useCallback(() => setGate('done'), []);
  const atEnd = act === ACT_COUNT;
  /** 현재 막에 해당하는 내비 항목 (막1은 없음) */
  const currentNavIdx = ACT_NAV[act] ?? null;
  /** 좌하단 라벨: 현재 막 이름 / 다음 막 이름 */
  const currentLabel = currentNavIdx === null ? company.nameEn : nav[currentNavIdx].labelEn;
  const nextNavIdx = ACT_NAV[act + 1] ?? null;
  const nextLabel = nextNavIdx === null ? company.nameEn : nav[nextNavIdx].labelEn;

  return (
    <div className="rb-root" ref={rootRef}>
      {/* ── 고정 UI: difference 블렌드로 4개 팔레트 전부에서 읽힌다 ── */}
      <div className="rb-topbar rb-invert">
        <p className="rb-brand">
          {company.nameKo}
          <small>{company.nameEn}</small>
        </p>
        <nav className="rb-topnav" aria-label={company.nameKo}>
          {nav.map((item, i) => (
            <a key={item.href} href={item.href} data-current={currentNavIdx === i}>
              {item.labelKo}
            </a>
          ))}
        </nav>
      </div>

      <div className="rb-rail rb-invert">
        <p className="rb-rail-act">
          <b className="rb-num">{String(act).padStart(2, '0')}</b>
          <i className="rb-num">/ {String(ACT_COUNT).padStart(2, '0')}</i>
          <span>{currentLabel}</span>
        </p>
        <p className="rb-rail-hint">
          {atEnd ? (
            <>
              <span aria-hidden="true">→</span>
              <u>{cta.primaryEn}</u>
            </>
          ) : (
            <>
              <span className="rb-chev" aria-hidden="true">
                <s>↓</s>
                <s>↓</s>
                <s>↓</s>
              </span>
              <u>{nextLabel}</u>
            </>
          )}
        </p>
      </div>

      <div className="rb-util rb-invert">
        <a href={`mailto:${company.email}`}>{company.email}</a>
        <span className="rb-bars" aria-hidden="true">
          <b />
          <b />
          <b />
          <b />
        </span>
      </div>

      <div className="rb-progress" aria-hidden="true" style={{ '--sp': scrolled } as Vars}>
        <i />
      </div>

      {/* ── 여정 ──
          게이트가 떠 있는 동안 본문을 inert 로 둔다. 그러지 않으면
          aria-modal="true" 인데도 스크린리더·Tab 이 게이트 뒤 본문에 닿는다.
          게이트 렌더 조건과 같은 조건이므로 게이트가 사라지면 반드시 함께 풀린다. */}
      <main inert={gate === 'open'}>
        <ActOne />
        <Whiteout from={PALETTE[0]} to={PALETTE[1]} actIndex={2} />
        <ActTwo />
        <Whiteout from={PALETTE[1]} to={PALETTE[2]} actIndex={3} />
        <ActThree />
        <Whiteout from={PALETTE[2]} to={PALETTE[3]} actIndex={4} />
        <ActFour />
      </main>

      {gate === 'open' ? (
        <Gate
          onEnter={enter}
          title={company.nameKo}
          hintPrimary={company.taglineEn}
          hintSecondary={company.domain}
        />
      ) : null}
    </div>
  );
}
