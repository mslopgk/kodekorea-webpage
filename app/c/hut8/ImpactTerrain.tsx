'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { capability, pillars } from '@/content/site';
import { useCountUp, useInView, useIsNarrow, useReducedMotion } from '@/lib/motion';
import { clamp01, css, hex, mix } from './iso';
import { C } from './palette';

const TAU = Math.PI * 2;
const ROWS = 30;
const STALK = 58;

/** 지형 위 핀 — capability 4개 + 사업축 대표 수치 3개 */
const PINS = [
  { nx: 0.08, ny: 0.46, value: capability.items[0].metric, label: capability.items[0].title },
  {
    nx: 0.22,
    ny: 0.68,
    value: `${pillars[0].project.metrics[1].value}${pillars[0].project.metrics[1].unit}`,
    label: pillars[0].project.metrics[1].label,
  },
  { nx: 0.35, ny: 0.38, value: capability.items[1].metric, label: capability.items[1].title },
  {
    nx: 0.48,
    ny: 0.6,
    value: `${pillars[1].project.metrics[1].value}${pillars[1].project.metrics[1].unit}`,
    label: pillars[1].project.metrics[1].label,
  },
  { nx: 0.61, ny: 0.34, value: capability.items[2].metric, label: capability.items[2].title },
  {
    nx: 0.74,
    ny: 0.55,
    value: `${pillars[2].project.metrics[0].value}${pillars[2].project.metrics[0].unit}`,
    label: pillars[2].project.metrics[0].label,
  },
  { nx: 0.88, ny: 0.42, value: capability.items[3].metric, label: capability.items[3].title },
] as const;

const IO_OPTS: IntersectionObserverInit = { threshold: 0.4 };

const FAR = hex('#c8cbd6');
const NEAR = hex('#a3abc2');

function phaseAt(x: number, i: number, t: number) {
  return Math.sin(x * 0.0055 + i * 0.42 + t * 0.55) + 0.55 * Math.sin(x * 0.0125 - i * 0.3 + t * 0.85);
}

function drawWave(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, pins: boolean) {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < ROWS; i++) {
    const d = i / (ROWS - 1);
    const yb = h * (0.14 + 0.86 * Math.pow(d, 1.4));
    const sp = 12 + 24 * d;
    const amp = 5 + 20 * d;
    const r = (0.8 + 2 * d) * 1;
    ctx.fillStyle = css(mix(FAR, NEAR, d), 0.3 + 0.55 * d);
    const path = new Path2D();
    for (let x = -sp; x <= w + sp; x += sp) {
      const y = yb + phaseAt(x, i, t) * amp;
      path.moveTo(x + r, y);
      path.arc(x, y, r, 0, TAU);
    }
    ctx.fill(path);
  }

  if (!pins) return;

  for (const p of PINS) {
    const d = Math.pow(clamp01((p.ny - 0.14) / 0.86), 1 / 1.4);
    const i = d * (ROWS - 1);
    const amp = 5 + 20 * d;
    const x = p.nx * w;
    const yTop = p.ny * h - STALK;
    const yBase = p.ny * h + phaseAt(x, i, t) * amp;

    // 접지 광량
    const g = ctx.createRadialGradient(x, yBase, 0, x, yBase, 34);
    g.addColorStop(0, css(C.accent, 0.2));
    g.addColorStop(1, css(C.accent, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, yBase, 34, 11, 0, 0, TAU);
    ctx.fill();

    // 수직 핀
    const lg = ctx.createLinearGradient(x, yBase, x, yTop);
    lg.addColorStop(0, css(C.accent, 0.15));
    lg.addColorStop(1, css(C.accent, 1));
    ctx.strokeStyle = lg;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x, yBase);
    ctx.lineTo(x, yTop);
    ctx.stroke();

    ctx.fillStyle = css(C.accent, 1);
    ctx.beginPath();
    ctx.arc(x, yTop, 3.4, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = 'rgba(233,233,229,0.95)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, yTop, 6.4, 0, TAU);
    ctx.stroke();
  }
}

export default function ImpactTerrain() {
  const reduced = useReducedMotion();
  const narrow = useIsNarrow();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const { ref: numRef, inView } = useInView<HTMLDivElement>(IO_OPTS);
  const lead = pillars[0].project.metrics[0];
  const target = Number(String(lead.value).replace(/[^\d.]/g, '')) || 0;
  const counted = useCountUp(target, inView, 1600);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const ctx = cv.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx || !size.w || !size.h) return;
    const showPins = !narrow;

    if (reduced) {
      drawWave(ctx, size.w, size.h, 0, showPins);
      return;
    }

    let raf = 0;
    let visible = true;
    let t0 = 0;
    const frame = (ts: number) => {
      raf = 0;
      if (!t0) t0 = ts;
      drawWave(ctx, size.w, size.h, (ts - t0) / 1000, showPins);
      if (visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      },
      { rootMargin: '10% 0px' }
    );
    io.observe(cv);
    raf = requestAnimationFrame(frame);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [size, reduced, narrow]);

  return (
    <>
      <canvas ref={canvasRef} className="h8-impact__canvas" aria-hidden="true" />

      {PINS.map((p, i) => (
        <div
          key={p.label}
          className="h8-pin"
          style={
            {
              left: `${p.nx * 100}%`,
              top: `calc(${p.ny * 100}% - ${STALK + 16}px)`,
              '--d': `${180 + i * 90}ms`,
            } as CSSProperties
          }
        >
          <b>{p.value}</b>
          <span>{p.label}</span>
        </div>
      ))}

      <div className="h8-impact__big" ref={numRef}>
        <b className="h8-mono">
          {Math.round(counted).toLocaleString('en-US')}
          <sup>{lead.unit}</sup>
        </b>
        <span>{lead.label}</span>
      </div>
    </>
  );
}
