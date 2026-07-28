'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { CELL } from './lib';

const ACCENT = '50, 164, 195'; // #32A4C3 — 두 테마 모두에서 대비가 확보되는 유일 액센트

type Runner = {
  cx: number;
  cy: number;
  px: number;
  py: number;
  dx: number;
  dy: number;
  t: number;
  trail: Array<{ x: number; y: number }>;
};

/**
 * 기술 도면 그리드의 선을 따라 이동하는 시안색 사각형 (레퍼런스 #03의 스네이크 궤적).
 * Canvas 2D. 격자 피치는 CSS 배경 그리드와 동일한 CELL을 쓴다.
 */
export default function GridSnake({
  count = 2,
  step = 300,
  trailLength = 13,
  className,
}: {
  count?: number;
  step?: number;
  trailLength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let runners: Runner[] = [];
    let raf = 0;
    let last = 0;

    const mkRunner = (): Runner => {
      const cx = 1 + Math.floor(Math.random() * Math.max(1, cols - 2));
      const cy = 1 + Math.floor(Math.random() * Math.max(1, rows - 2));
      const horizontal = Math.random() < 0.5;
      return {
        cx,
        cy,
        px: cx,
        py: cy,
        dx: horizontal ? (Math.random() < 0.5 ? 1 : -1) : 0,
        dy: horizontal ? 0 : Math.random() < 0.5 ? 1 : -1,
        t: 0,
        trail: [{ x: cx, y: cy }],
      };
    };

    const advance = (r: Runner) => {
      r.px = r.cx;
      r.py = r.cy;
      let dx = r.dx;
      let dy = r.dy;
      // 70% 직진, 30% 90도 회전
      if (Math.random() < 0.3) {
        const turn = Math.random() < 0.5 ? 1 : -1;
        [dx, dy] = [-dy * turn, dx * turn];
      }
      let nx = r.cx + dx;
      let ny = r.cy + dy;
      if (nx < 0 || nx > cols || ny < 0 || ny > rows) {
        // 경계에 닿으면 강제 회전
        [dx, dy] = [-dy, dx];
        nx = r.cx + dx;
        ny = r.cy + dy;
        if (nx < 0 || nx > cols || ny < 0 || ny > rows) {
          dx = -dx;
          dy = -dy;
          nx = r.cx + dx;
          ny = r.cy + dy;
        }
      }
      r.dx = dx;
      r.dy = dy;
      r.cx = nx;
      r.cy = ny;
      r.trail.push({ x: nx, y: ny });
      if (r.trail.length > trailLength) r.trail.shift();
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      // 부모가 scale로 축소돼 있을 수 있으므로 getBoundingClientRect(변형 후 크기)가 아니라
      // 레이아웃 크기를 써야 백킹 스토어 해상도가 어긋나지 않는다.
      w = Math.max(1, cv.clientWidth);
      h = Math.max(1, cv.clientHeight);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(2, Math.floor(w / CELL));
      rows = Math.max(2, Math.floor(h / CELL));
      runners = Array.from({ length: count }, mkRunner);
      if (reduced) {
        // 모션 축소: 궤적을 몇 칸 미리 만들어 최종 상태로 한 번만 그린다
        for (const r of runners) for (let i = 0; i < trailLength; i++) advance(r);
        draw();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const r of runners) {
        const n = r.trail.length;
        for (let i = 1; i < n; i++) {
          const a = r.trail[i - 1];
          const b = r.trail[i];
          const alpha = (i / n) * 0.4;
          ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x * CELL + 0.5, a.y * CELL + 0.5);
          ctx.lineTo(b.x * CELL + 0.5, b.y * CELL + 0.5);
          ctx.stroke();
        }
        // 현재 구간(보간 중)
        const e = r.t * r.t * (3 - 2 * r.t);
        const hx = (r.py === r.cy ? r.px + (r.cx - r.px) * e : r.cx) * CELL;
        const hy = (r.px === r.cx ? r.py + (r.cy - r.py) * e : r.cy) * CELL;
        const tail = r.trail[n - 2];
        if (tail) {
          ctx.strokeStyle = `rgba(${ACCENT}, .5)`;
          ctx.beginPath();
          ctx.moveTo(tail.x * CELL + 0.5, tail.y * CELL + 0.5);
          ctx.lineTo(hx + 0.5, hy + 0.5);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${ACCENT}, .9)`;
        ctx.fillRect(hx - 3, hy - 3, 6, 6);
        ctx.fillStyle = `rgba(${ACCENT}, .16)`;
        ctx.fillRect(hx - 8, hy - 8, 16, 16);
      }
    };

    const tick = (now: number) => {
      if (!last) last = now;
      const dt = now - last;
      last = now;
      for (const r of runners) {
        r.t += dt / step;
        while (r.t >= 1) {
          r.t -= 1;
          advance(r);
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, count, step, trailLength]);

  return <canvas ref={ref} className={className ?? 'hle-snake'} aria-hidden />;
}
