'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { subscribe } from './ticker';

/**
 * 추상 텍스처 위젯.
 *
 * ⚠️ 여기에는 **데이터를 주장하는 그림을 두지 않는다.** 이전 버전의
 *    스파크라인·이퀄라이저·판독값은 존재하지 않는 추이와 지어낸 수치를 그려
 *    허위였다. 전부 제거했고, 실제 정보가 도는 것은 cycle.tsx가 담당한다.
 *    남은 것은 구분선 대체용 파형과 커서뿐 — 둘 다 데이터를 사칭하지 않는다.
 *
 * 원래 목적 (유지):
 *
 * 스크롤과 무관하게 **스스로 계속 도는** 요소들이다. 사이트의 정체성이
 * "계측기 로그"이므로 살아 있는 판독값이 많을수록 주장과 형태가 맞는다.
 *
 * 노이즈가 되지 않게 지키는 규칙:
 *   · 전부 얇고 작다. 본문 글자 뒤에 깔지 않는다
 *   · 액센트색은 한 위젯에 한 줄만. 나머지는 무채색 저채도
 *   · rAF는 **공유 티커 하나**만 돈다 (위젯마다 루프를 돌리면 메인 스레드가 죽는다)
 *   · 화면에서 벗어난 위젯은 구독을 끊는다
 *   · 탭이 백그라운드면 티커 자체가 멈춘다
 *   · prefers-reduced-motion이면 한 프레임만 그리고 정지
 */

/** 캔버스 위젯 공통 배선 — 가시성 게이트 + DPR + 공유 티커 */
function useCanvas(
  paint: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void,
  deps: unknown[] = []
) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const render = (t: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (!w || !h) return;
      if (cv.width !== Math.round(w * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      paint(ctx, w, h, t);
    };

    if (reduced) {
      render(0);
      const ro = new ResizeObserver(() => render(0));
      ro.observe(cv);
      return () => ro.disconnect();
    }

    let off: (() => void) | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !off) off = subscribe(render);
        else if (!e.isIntersecting && off) {
          off();
          off = null;
        }
      },
      { threshold: 0 }
    );
    io.observe(cv);
    const ro = new ResizeObserver(() => render(performance.now()));
    ro.observe(cv);

    return () => {
      io.disconnect();
      ro.disconnect();
      off?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return ref;
}


/** 시드 고정 의사난수 — 서버·클라이언트 렌더가 갈리지 않는다 */
const noise = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};


/* ── 파형 ── 구분선을 대신하는 추상 텍스처. 어떤 수치도 주장하지 않는다. */
export function Wave({
  variant = 'signal',
  height = 30,
  accent = true,
  className = '',
}: {
  variant?: 'signal' | 'pulse' | 'noise' | 'sine';
  height?: number;
  accent?: boolean;
  className?: string;
}) {
  const ref = useCanvas(
    (ctx, w, h, time) => {
      const t = time * 0.00058;
      ctx.strokeStyle = accent ? 'rgba(255,77,23,0.8)' : 'rgba(255,255,255,0.34)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const u = x / w;
        let y: number;
        if (variant === 'pulse') {
          const sq = Math.sign(Math.sin(u * 34 + t * 1.6)) * 0.24;
          y = h / 2 - sq * h * 0.42;
        } else if (variant === 'noise') {
          const n = (noise(Math.floor(u * 90) + Math.floor(t * 5)) - 0.5) * 0.6;
          y = h / 2 - n * h * 0.5;
        } else if (variant === 'sine') {
          y = h / 2 - Math.sin(u * 9 + t) * h * 0.3;
        } else {
          const base = Math.sin(u * 22 + t) * 0.26 + Math.sin(u * 7 - t * 0.6) * 0.15;
          y = h / 2 - base * h * 0.42;
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    },
    [variant, accent]
  );
  return <canvas className={`v2-wave ${className}`} style={{ height }} ref={ref} aria-hidden="true" />;
}

/* ── 티커 ── 흐르는 것이 실제 기술 영역 목록이므로 내용이 정보다. */
export function Ticker({ items, speed = 0.011 }: { items: readonly string[]; speed?: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let off: (() => void) | null = null;
    const step = (t: number) => {
      el.style.transform = `translate3d(${-((t * speed) % 50)}%, 0, 0)`;
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !off) off = subscribe(step);
        else if (!e.isIntersecting && off) {
          off();
          off = null;
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      off?.();
    };
  }, [reduced, speed]);

  const doubled = [...items, ...items];
  return (
    <div className="v2-tick" aria-hidden="true">
      <div className="v2-tick__track" ref={ref}>
        {doubled.map((s, i) => (
          <span key={`${s}-${i}`}>{s}</span>
        ))}
      </div>
    </div>
  );
}

/** 깜빡이는 커서 — CSS 애니메이션이라 모션 축소에서 자동 정지 */
export function Caret() {
  return <span className="v2-caret" aria-hidden="true" />;
}
