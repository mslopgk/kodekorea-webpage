'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useIsNarrow, useReducedMotion } from '@/lib/motion';
import s from './sentra.module.css';
import { mulberry32 } from './util';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/#$%&*+=<>';

/**
 * 앰비언트 문자 명멸 — 히어로 배경에 희미한 랜덤 영숫자가 계속 나타나고 사라진다.
 * 위치·타이밍은 고정 시드 PRNG로 만들어 SSR 하이드레이션 불일치를 피한다.
 * 모션 축소 시 문자 교체를 멈추고 정적 상태로 고정한다.
 */
export function AmbientGlyphs() {
  const reduced = useReducedMotion();
  const narrow = useIsNarrow();
  const count = narrow ? 16 : 46;
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  const cells = useMemo(() => {
    const rnd = mulberry32(0xa1b2c3);
    return Array.from({ length: 46 }, () => ({
      left: rnd() * 96 + 2,
      top: rnd() * 88 + 4,
      char: CHARS[Math.floor(rnd() * CHARS.length)] ?? 'X',
      dur: 2.6 + rnd() * 4.4,
      delay: rnd() * 5,
      dim: 0.05 + rnd() * 0.13,
      big: rnd() > 0.86,
    })).slice(0, count);
  }, [count]);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      // refs.current는 count가 줄어도 길이가 유지되므로(뒤쪽은 null) count로 뽑는다
      const n = count;
      if (!n) return;
      for (let k = 0; k < 3; k++) {
        const el = refs.current[Math.floor(Math.random() * n)];
        if (el) el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)] ?? 'X';
      }
    }, 130);
    return () => clearInterval(id);
  }, [reduced, count]);

  return (
    <div className={s.glyphField} aria-hidden>
      {cells.map((c, i) => (
        <span
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`mono ${s.glyph}`}
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
            opacity: c.dim,
            fontSize: c.big ? '18px' : '11px',
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  );
}
