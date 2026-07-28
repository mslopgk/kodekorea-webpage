'use client';

/**
 * 하이퍼스페이스 — Canvas 2D. 중심에서 시안·마젠타 광선이 방사된다.
 * 가산 합성(lighter) + 잔상(반투명 배경 덮기)으로 워프감을 만든다.
 *
 * 모션 축소 / 좁은 화면에서는 rAF 루프를 돌리지 않고 한 프레임만 그린다.
 */

import { useEffect, useRef } from 'react';
import { useIsNarrow, useReducedMotion } from '@/lib/motion';

const BG = '10, 4, 24';
const CYAN = '#2ff0ff';
const MAGENTA = '#ff35c8';
const VIOLET = '#9b6bff';

type Ray = { a: number; s: number; o: number; c: string };

export default function Hyperspace({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pRef = useRef(progress);
  const reduced = useReducedMotion();
  const narrow = useIsNarrow();
  pRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const still = reduced || narrow;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 1;
    let h = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const count = narrow ? 70 : 170;
    const rays: Ray[] = Array.from({ length: count }, (_, i) => ({
      a: (i / count) * Math.PI * 2 + Math.random() * 0.4,
      s: 0.16 + Math.random() * 0.46,
      o: Math.random(),
      c: i % 5 === 0 ? VIOLET : i % 2 === 0 ? CYAN : MAGENTA,
    }));

    const draw = (time: number) => {
      const t = still ? 0.42 : time / 1000;
      const p = Math.min(1, Math.max(0, pRef.current));
      const boost = 0.3 + 0.95 * Math.sin(Math.PI * p);

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = still ? `rgba(${BG}, 1)` : `rgba(${BG}, 0.28)`;
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5 + (p - 0.5) * w * 0.11;
      const cy = h * 0.5 - (p - 0.5) * h * 0.08;
      const maxR = Math.hypot(w, h) * 0.6;

      // 중심 코어 글로우
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.42);
      glow.addColorStop(0, `rgba(255, 255, 255, ${0.1 + 0.2 * boost})`);
      glow.addColorStop(0.28, `rgba(155, 107, 255, ${0.06 + 0.12 * boost})`);
      glow.addColorStop(1, 'rgba(10, 4, 24, 0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.lineCap = 'round';
      for (const r of rays) {
        const tt = (t * r.s + r.o) % 1;
        const e = tt * tt;
        const r0 = e * maxR;
        const len = (24 + 560 * e) * (0.45 + boost * 0.75);
        const ca = Math.cos(r.a);
        const sa = Math.sin(r.a);
        ctx.beginPath();
        ctx.moveTo(cx + ca * r0, cy + sa * r0);
        ctx.lineTo(cx + ca * (r0 + len), cy + sa * (r0 + len));
        ctx.strokeStyle = r.c;
        const fade = tt < 0.12 ? tt / 0.12 : Math.min(1, (1 - tt) * 2.1);
        ctx.globalAlpha = Math.max(0, fade) * (0.16 + 0.5 * boost);
        ctx.lineWidth = 0.6 + 2.9 * e;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    let raf = 0;
    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (still) draw(0);
    else raf = requestAnimationFrame(loop);

    const onResize = () => {
      resize();
      if (still) draw(0);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, narrow]);

  return <canvas ref={canvasRef} className="rb-hyper-canvas" aria-hidden="true" />;
}
