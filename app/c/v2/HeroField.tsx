'use client';

import { useEffect, useRef } from 'react';
import { useIsNarrow, useReducedMotion } from '@/lib/motion';

/** 8×8 Bayer 행렬 — 오더드 디더링 임계값 */
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

/**
 * 히어로 배경 — 1비트 디더링 필드.
 *
 * B(Sentra) 시안의 시각적 서명을 가져왔다. 다만 1차 평가에서 "배경이 시선을
 * 너무 많이 가져간다"(C에 대한 지적)는 문제를 피하려고, 헤드라인이 놓이는
 * 좌하단은 밀도를 낮춰 텍스트가 항상 이긴다.
 */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  const narrow = useIsNarrow(640);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    // 텍셀 크기 — 모바일에서는 키워 계산량을 줄인다
    const T = narrow ? 6 : 4;
    let raf = 0;
    let ro: ResizeObserver | null = null;

    const render = (time: number) => {
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#f4f4f2';

      const cols = Math.ceil(w / T);
      const rows = Math.ceil(h / T);
      // 링 중심을 우측 중단에 둔다 — 좌하단 카피와 우상단 네비를 둘 다 피한다
      const ox = cols * 0.74;
      const oy = rows * 0.52;
      const R = Math.min(cols, rows) * 0.52;
      const t = time * 0.00016;

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const dx = gx - ox;
          const dy = (gy - oy) * 1.04;
          const d = Math.sqrt(dx * dx + dy * dy);

          // 링 — 가장자리만 밝게
          const ring = Math.exp(-Math.pow((d - R) / (R * 0.16), 2));
          // 완만한 간섭 무늬
          const wave = 0.5 + 0.5 * Math.sin(d * 0.11 - t * 2.2 + Math.atan2(dy, dx) * 2);
          // 좌하단 감쇠 — 헤드라인 가독성 보호
          const fx = gx / cols;
          const fy = gy / rows;
          const guard = 1 - Math.exp(-Math.pow((fx - 0.02) / 0.5, 2) * 0.9) * Math.max(0, fy - 0.42) * 1.9;

          let v = (ring * 0.92 + ring * wave * 0.5) * Math.max(0, guard);
          if (v <= 0.02) continue;
          if (v > 1) v = 1;

          // 1비트화
          const th = (BAYER[gy & 7][gx & 7] + 0.5) / 64;
          if (v > th) ctx.fillRect(gx * T, gy * T, T - 1, T - 1);
        }
      }
    };

    if (reduced) {
      render(0);
      ro = new ResizeObserver(() => render(0));
      ro.observe(cv);
      return () => ro?.disconnect();
    }

    let running = true;
    // 화면에서 벗어나면 루프를 멈춘다 (1차 시안 B의 성능 문제 대응)
    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running && !raf) raf = requestAnimationFrame(loop);
      },
      { threshold: 0 }
    );
    io.observe(cv);

    function loop(time: number) {
      raf = 0;
      render(time);
      if (running) raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    ro = new ResizeObserver(() => render(performance.now()));
    ro.observe(cv);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro?.disconnect();
    };
  }, [reduced, narrow]);

  return <canvas className="v2-hero__dither" ref={ref} aria-hidden="true" />;
}
