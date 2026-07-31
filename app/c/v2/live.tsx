'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';

/**
 * 스스로 계속 도는 요소들.
 *
 * 앞선 시도는 모션을 스크롤에 묶었고, 그게 실패했다 — 읽는 동안 그림이
 * 미완성으로 남았기 때문이다. 여기서는 반대로 간다: 스크롤과 무관하게
 * 항상 도는 값만 쓰고, 그 값이 **실제로 의미 있는 것**(현재 시각, 가동 상태)일
 * 때만 움직인다. 계기판이라는 맥락이 움직임을 정당화한다.
 */

/** 실시간 시계 — 서버·클라이언트 불일치를 피해 마운트 후에만 렌더 */
export function LiveClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('ko-KR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="v2-clock" suppressHydrationWarning>
      <i aria-hidden="true" />
      {now ?? '--:--:--'}
      <em>KST</em>
    </span>
  );
}

/** 운영 중 표시용 맥박 — CSS 애니메이션이므로 모션 축소에서 자동 정지 */
export function Pulse() {
  return <span className="v2-pulse" aria-hidden="true" />;
}

/**
 * 얇은 신호 파형. 대시보드 상단에서 계속 흐른다.
 * Canvas 2D · 화면에서 벗어나면 루프를 멈춘다.
 */
export function Signal() {
  const reduced = useReducedMotion();
  const [el, setEl] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = !reduced;
    let t = 0;

    const render = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (el.width !== Math.round(w * dpr)) {
        el.width = Math.round(w * dpr);
        el.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255,77,23,0.85)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const u = x / w;
        // 두 개의 사인파 + 간헐적 스파이크 — 데이터가 흐르는 느낌
        const base = Math.sin(u * 22 + t) * 0.28 + Math.sin(u * 7 - t * 0.6) * 0.16;
        const spike = Math.max(0, Math.sin(u * 60 - t * 2.4) ** 12) * 0.55;
        const y = h / 2 - (base + spike) * h * 0.42;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const loop = () => {
      raf = 0;
      t += 0.045;
      render();
      if (running) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting && !reduced;
        if (running && !raf) raf = requestAnimationFrame(loop);
      },
      { threshold: 0 }
    );
    io.observe(el);

    if (reduced) render();
    else raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(render);
    ro.observe(el);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [el, reduced]);

  return <canvas className="v2-signal" ref={setEl} aria-hidden="true" />;
}
