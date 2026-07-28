'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import s from './sentra.module.css';
import { seededArray } from './util';

const CELL = 26;
const DURATION = 1000;
/** .irisSolid의 CSS 안전 페이드가 시작되는 시점 (animation-delay와 맞춘다) */
const SAFETY_START = 900;
const JITTER = seededArray(97, 0x5e17ba);

/** 계단형(사각 픽셀) 원 마스크 경로. 매끈한 원 대신 굵은 픽셀로 들쭉날쭉하게. */
function irisPath(r: number, w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const rows = Math.ceil(r / CELL) + 1;
  let d = '';
  for (let i = -rows; i <= rows; i++) {
    const dy = Math.abs(i * CELL);
    const inner = r * r - dy * dy;
    if (inner <= 0) continue;
    const j = JITTER[((i % 97) + 97) % 97] ?? 0.5;
    const bump = j < 0.26 ? -1 : j > 0.8 ? 1 : 0;
    const half = Math.round(Math.sqrt(inner) / CELL) + bump;
    if (half < 0) continue;
    const y0 = Math.round(cy + i * CELL - CELL / 2);
    const x0 = Math.round(cx - half * CELL - CELL / 2);
    const x1 = Math.round(cx + half * CELL + CELL / 2);
    d += `M${x0} ${y0}H${x1}V${y0 + CELL}H${x0}Z`;
    // 경계 밖으로 떨어져나온 낱개 픽셀 — 디더 마스크 느낌
    if (j > 0.62 && r > CELL * 2) {
      d += `M${x1 + CELL} ${y0}h${CELL}v${CELL}h${-CELL}Z`;
      d += `M${x0 - CELL * 2} ${y0}h${CELL}v${CELL}h${-CELL}Z`;
    }
  }
  return d;
}

/**
 * 픽셀 아이리스 오프닝 — 화면 중앙에서 사각 픽셀 원이 확대되며 히어로를 공개.
 * JS 하이드레이션 전/모션 축소 시에도 반드시 걷히도록 CSS 안전 페이드를 함께 둔다.
 */
export function PixelIris() {
  const reduced = useReducedMotion();
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    // 하이드레이션이 늦어 CSS 안전 페이드가 이미 시작됐다면 아이리스를 건너뛴다.
    // (안 그러면 커버가 걷힌 화면을 SVG 아이리스가 다시 검게 덮어 두 번 깜빡인다)
    if (reduced || performance.now() > SAFETY_START) {
      setGone(true);
      return;
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    setDims({ w, h });

    const rMax = Math.hypot(w, h) / 2 + CELL * 3;
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 5);
      if (pathRef.current) pathRef.current.setAttribute('d', irisPath(rMax * eased, w, h));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setFading(true);
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setGone(true), DURATION + 420);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
    };
  }, [reduced]);

  if (gone) return null;

  // 첫 페인트(SSR 포함) — 순수 CSS로도 반드시 사라지는 블랙 커버
  if (!dims) return <div className={s.irisSolid} aria-hidden />;

  return (
    <svg
      className={s.iris}
      data-fading={fading}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <mask id="sentra-iris-mask" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={dims.w} height={dims.h} fill="#fff" />
          <path ref={pathRef} d="" fill="#000" />
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width={dims.w}
        height={dims.h}
        fill="#050505"
        mask="url(#sentra-iris-mask)"
      />
    </svg>
  );
}
