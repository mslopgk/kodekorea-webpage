'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * 상시 구동 계측 위젯 모음.
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

type Sub = (t: number) => void;

const subs = new Set<Sub>();
let raf = 0;
let hidden = false;

function loop(t: number) {
  raf = 0;
  if (!hidden) for (const fn of subs) fn(t);
  if (subs.size) raf = requestAnimationFrame(loop);
}

function subscribe(fn: Sub) {
  subs.add(fn);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    subs.delete(fn);
    if (!subs.size && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
  });
}

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

const ACCENT = '#ff4d17';
const FAINT = 'rgba(255,255,255,0.2)';

/** 시드 고정 의사난수 — 서버·클라이언트 렌더가 갈리지 않는다 */
const noise = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/* ── 신호 파형 ─────────────────────────────────────
   variant로 성격을 바꾼다. 같은 그림이 여러 번 나오면 벽지가 된다. */
export function Wave({
  variant = 'signal',
  height = 34,
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
      const t = time * 0.00105;
      ctx.strokeStyle = accent ? 'rgba(255,77,23,0.85)' : 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const u = x / w;
        let y: number;
        if (variant === 'pulse') {
          // 구형파 + 간헐 스파이크
          const sq = Math.sign(Math.sin(u * 34 + t * 1.6)) * 0.26;
          const sp = Math.max(0, Math.sin(u * 80 - t * 3) ** 16) * 0.5;
          y = h / 2 - (sq + sp) * h * 0.42;
        } else if (variant === 'noise') {
          const n = (noise(Math.floor(u * 90) + Math.floor(t * 5)) - 0.5) * 0.7;
          y = h / 2 - n * h * 0.5;
        } else if (variant === 'sine') {
          y = h / 2 - Math.sin(u * 9 + t) * h * 0.32;
        } else {
          const base = Math.sin(u * 22 + t) * 0.28 + Math.sin(u * 7 - t * 0.6) * 0.16;
          const spike = Math.max(0, Math.sin(u * 60 - t * 2.4) ** 12) * 0.55;
          y = h / 2 - (base + spike) * h * 0.42;
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

/* ── 이퀄라이저 바 ─────────────────────────────── */
export function Bars({ count = 22, height = 30, seed = 1 }: { count?: number; height?: number; seed?: number }) {
  const ref = useCanvas(
    (ctx, w, h, time) => {
      const t = time * 0.0016;
      const gap = 2;
      const bw = Math.max(1.5, (w - gap * (count - 1)) / count);
      for (let i = 0; i < count; i++) {
        const p = 0.28 + 0.72 * Math.abs(Math.sin(t * (0.6 + noise(i + seed) * 1.5) + i * 0.7));
        const bh = h * p;
        ctx.fillStyle = i % 5 === 0 ? 'rgba(255,77,23,0.8)' : 'rgba(255,255,255,0.24)';
        ctx.fillRect(i * (bw + gap), h - bh, bw, bh);
      }
    },
    [count, seed]
  );
  return <canvas className="v2-bars" style={{ height }} ref={ref} aria-hidden="true" />;
}

/* ── 스파크라인 ─── 수치 옆에 붙는 아주 작은 추이선 ── */
export function Spark({ seed = 1, height = 16 }: { seed?: number; height?: number }) {
  const ref = useCanvas(
    (ctx, w, h, time) => {
      const t = time * 0.0009;
      ctx.strokeStyle = 'rgba(255,255,255,0.34)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const n = 26;
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        const v =
          0.5 +
          Math.sin(u * 6 + t + seed) * 0.24 +
          (noise(i + seed * 7) - 0.5) * 0.22;
        const x = u * w;
        const y = h - v * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      // 마지막 점만 액센트 — 지금 값이라는 표시
      const lastV = 0.5 + Math.sin(6 + t + seed) * 0.24 + (noise(n + seed * 7) - 0.5) * 0.22;
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(w - 1, h - lastV * h, 1.7, 0, Math.PI * 2);
      ctx.fill();
    },
    [seed]
  );
  return <canvas className="v2-spark" style={{ height }} ref={ref} aria-hidden="true" />;
}

/* ── 세로 스캔 레일 ─── 섹션 여백에 세우는 얇은 게이지 ── */
export function Rail({ seed = 2 }: { seed?: number }) {
  const ref = useCanvas(
    (ctx, w, h, time) => {
      const t = time * 0.0004;
      ctx.strokeStyle = FAINT;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();
      // 눈금
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      for (let y = 0; y < h; y += 14) {
        ctx.beginPath();
        ctx.moveTo(w / 2 - 2, y);
        ctx.lineTo(w / 2 + 2, y);
        ctx.stroke();
      }
      // 훑고 내려가는 마커
      const p = (t + noise(seed)) % 1;
      const my = p * h;
      const g = ctx.createLinearGradient(0, my - 26, 0, my + 26);
      g.addColorStop(0, 'rgba(255,77,23,0)');
      g.addColorStop(0.5, 'rgba(255,77,23,0.55)');
      g.addColorStop(1, 'rgba(255,77,23,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2, my - 26);
      ctx.lineTo(w / 2, my + 26);
      ctx.stroke();
    },
    [seed]
  );
  return <canvas className="v2-rail2" ref={ref} aria-hidden="true" />;
}

/* ── 흐르는 상태 티커 ─── 얇은 모노 한 줄. 대형 마퀴가 아니다 ── */
export function Ticker({ items, speed = 0.028 }: { items: readonly string[]; speed?: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let x = 0;
    let off: (() => void) | null = null;
    const step = (t: number) => {
      x = (t * speed) % 50;
      el.style.transform = `translate3d(${-x}%, 0, 0)`;
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

/** 깜빡이는 판독값 — 마지막 두 자리만 흔들려서 "살아 있는 계측기"로 읽힌다 */
export function Readout({ label, base, unit = '' }: { label: string; base: number; unit?: string }) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(base);

  useEffect(() => {
    if (reduced) return;
    let last = 0;
    const off = subscribe((t) => {
      if (t - last < 900) return;
      last = t;
      setV(base + Math.round((noise(t) - 0.5) * base * 0.04));
    });
    return off;
  }, [reduced, base]);

  return (
    <span className="v2-readout">
      <em>{label}</em>
      <b suppressHydrationWarning>
        {v.toLocaleString('ko-KR')}
        {unit}
      </b>
    </span>
  );
}

/** 깜빡이는 커서 — CSS 애니메이션이라 모션 축소에서 자동 정지 */
export function Caret() {
  return <span className="v2-caret" aria-hidden="true" />;
}
