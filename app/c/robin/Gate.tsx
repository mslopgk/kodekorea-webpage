'use client';

/**
 * 진입 게이트 — 좌하단 초대형 퍼센트 카운터, 상단 진행선 위를 이동하는
 * 비행체, 중앙 아웃라인 버튼(WAIT → START 글자 단위 교체).
 *
 * 원본(robin-thomas.me)과 다르게 한 점:
 *  - 실제 대기는 1.5초 상한. 그 이상 붙잡지 않는다.
 *  - Enter / Space / Escape 로 즉시 진입 가능. 버튼은 마운트 시 포커스.
 *  - 게이트는 클라이언트 마운트 후에만 렌더 → JS 없으면 본문이 그대로 노출된다.
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import type { Vars } from './parts';

const LOAD_CAP_MS = 1500;

/** 게이트 버튼 라벨 — 콘텐츠가 아닌 조작 토큰(대문자 영문 2종) */
const LABEL_WAIT = 'WAIT';
const LABEL_START = 'START';

export default function Gate({
  onEnter,
  title,
  hintPrimary,
  hintSecondary,
}: {
  onEnter: () => void;
  title: string;
  hintPrimary: string;
  hintSecondary: string;
}) {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const doneRef = useRef(false);

  /* 0 → 100%, 최대 1.5초 */
  useEffect(() => {
    if (reduced) {
      setPct(100);
      setReady(true);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / LOAD_CAP_MS);
      setPct(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setReady(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  const leave = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (reduced) {
      onEnter();
      return;
    }
    setLeaving(true);
    window.setTimeout(onEnter, 500);
  };

  /* 키보드로 즉시 진입 (로딩 대기 없이) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'Escape') {
        e.preventDefault();
        leave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const label = ready ? LABEL_START : LABEL_WAIT;

  return (
    <div
      className="rb-gate"
      data-leaving={leaving}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{ '--pct': pct } as Vars}
    >
      <div className="rb-gate-grain" aria-hidden="true" />
      <div className="rb-gate-track" aria-hidden="true" />

      <svg className="rb-gate-craft" viewBox="0 0 54 24" aria-hidden="true">
        <path
          className="rb-gate-craft-beam"
          d="M20 14 L14 24 L40 24 L34 14 Z"
          fill="currentColor"
          opacity="0.22"
        />
        <ellipse cx="27" cy="13" rx="24" ry="4.4" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M14 12 C16 3.5 38 3.5 40 12" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="17" cy="15.4" r="1.1" fill="currentColor" />
        <circle cx="27" cy="16.2" r="1.1" fill="currentColor" />
        <circle cx="37" cy="15.4" r="1.1" fill="currentColor" />
      </svg>

      <button
        ref={btnRef}
        type="button"
        className="rb-gate-btn"
        data-ready={ready}
        onClick={leave}
      >
        <span className="rb-gate-btn-label" key={label}>
          {[...label].map((ch, i) => (
            <i key={`${ch}-${i}`} style={{ animationDelay: `${i * 55}ms` }}>
              {ch}
            </i>
          ))}
        </span>
      </button>

      <p className="rb-gate-pct rb-num" aria-hidden="true">
        {pct}
        <span>%</span>
      </p>

      <p className="rb-gate-hint">
        {hintPrimary}
        <br />
        {hintSecondary}
      </p>
    </div>
  );
}
