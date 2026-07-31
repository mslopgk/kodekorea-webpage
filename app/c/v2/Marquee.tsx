'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { useDocProgress } from './parts';

/**
 * 기술 영역 무한 마퀴.
 *
 * 정적인 텍스트 벽이었던 것을 흐르게 만든다. 두 줄이 서로 반대 방향으로
 * 움직여 스크롤 리듬을 만든다. 스크롤하는 동안에는 속도가 붙어서
 * "사용자가 움직이면 사이트도 움직인다"는 반응을 준다.
 *
 * 모션 축소 시에는 흐르지 않고 줄바꿈된 목록으로 남는다.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const reduced = useReducedMotion();
  const rowA = useRef<HTMLDivElement | null>(null);
  const rowB = useRef<HTMLDivElement | null>(null);
  const docP = useDocProgress();
  const boostRef = useRef(0);
  const lastP = useRef(docP);

  useEffect(() => {
    if (reduced) return;
    // 스크롤 변화량을 속도 가산치로 쓴다 (게이트가 아니라 가산치일 뿐)
    boostRef.current = Math.min(1, Math.abs(docP - lastP.current) * 90);
    lastP.current = docP;
  }, [docP, reduced]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let x = 0;
    const step = () => {
      const boost = boostRef.current;
      boostRef.current *= 0.9;
      x += 0.45 + boost * 3.2;
      if (rowA.current) rowA.current.style.transform = `translate3d(${-x % 50}%, 0, 0)`;
      if (rowB.current) rowB.current.style.transform = `translate3d(${(x % 50) - 50}%, 0, 0)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (reduced) {
    return (
      <ul className="v2-domains">
        {items.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    );
  }

  const half = Math.ceil(items.length / 2);
  const top = items.slice(0, half);
  const bottom = items.slice(half);

  return (
    <div className="v2-mq" aria-label={items.join(', ')}>
      <div className="v2-mq__line">
        <div className="v2-mq__track" ref={rowA}>
          {[...top, ...top, ...top, ...top].map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
          ))}
        </div>
      </div>
      <div className="v2-mq__line">
        <div className="v2-mq__track" ref={rowB}>
          {[...bottom, ...bottom, ...bottom, ...bottom].map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 우측 고정 진행 레일 — 현재 어디쯤인지 항상 보인다 */
export function Rail({ sections }: { sections: readonly { href: string; labelEn: string }[] }) {
  const p = useDocProgress();
  return (
    <div className="v2-rail" aria-hidden="true">
      <span className="v2-rail__pct">{String(Math.round(p * 100)).padStart(3, '0')}</span>
      <div className="v2-rail__bar">
        <span style={{ transform: `scaleY(${p})` }} />
      </div>
      <span className="v2-rail__dom">kodekorea.kr</span>
    </div>
  );
}
