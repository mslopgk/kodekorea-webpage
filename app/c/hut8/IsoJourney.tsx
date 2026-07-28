'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { nav, pillars } from '@/content/site';
import { useIsNarrow, useReducedMotion, useScrollProgress } from '@/lib/motion';
import { type Cam, clamp01, keyframe } from './iso';
import { activePillar, CAM_PATH, CAM_STOPS, CLUSTERS, drawScene } from './scene';

type Pillar = (typeof pillars)[number];

/** 진행률 → 카메라. 군집 구간에서는 머물고, 사이 구간에서 부드럽게 이동한다. */
function camAt(p: number, w: number, h: number, t: number): Cam {
  const u = keyframe(CAM_STOPS, clamp01(p));
  const i = Math.min(CAM_PATH.length - 2, Math.floor(u));
  const f = u - i;
  const e = f * f * (3 - 2 * f);
  const a = CAM_PATH[i];
  const b = CAM_PATH[i + 1];
  const scale = Math.max(1, Math.min(2.2, h / 430)) * (w < 900 ? 0.7 : 1);
  return {
    cx: a[0] + (b[0] - a[0]) * e,
    cy: a[1] + (b[1] - a[1]) * e + Math.sin(t * 0.28) * 0.22,
    scale,
    ox: w * (w < 1100 ? 0.5 : 0.62),
    oy: h * 0.55,
  };
}

/** 특정 군집을 화면 중앙에 두는 정적 카메라 (모바일·모션 축소 폴백용) */
function camStatic(index: number, w: number, h: number): Cam {
  const [cx, cy] = CLUSTERS[index];
  const scale = Math.max(0.7, Math.min(1.15, w / 420));
  return { cx: cx + 1.6, cy: cy + 1.6, scale, ox: w * 0.5, oy: h * 0.6 };
}

/** 캔버스를 CSS 크기 × DPR로 맞춘다 */
function useCanvasSize(ref: RefObject<HTMLCanvasElement | null>) {
  const sizeRef = useRef({ w: 0, h: 0 });
  const [, bump] = useState(0);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      if (w === sizeRef.current.w && h === sizeRef.current.h) return;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const ctx = cv.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
      bump((v) => v + 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    return () => ro.disconnect();
  }, [ref]);

  return sizeRef;
}

/** 좌측 고정 레이어 라벨 — Layer 1.0 / 2.0 / 3.0 */
function LayerLabel({ p, on }: { p: Pillar; on: boolean }) {
  return (
    <div className="h8-layer" data-on={on ? 'true' : 'false'}>
      <span className="h8-layer__no">
        LAYER {Number(p.index)}.0 <s>/ {p.code}</s>
      </span>
      <h3 className="h8-ko">{p.labelKo}</h3>
      <p className="h8-layer__en">{p.labelEn}</p>
      <p className="h8-layer__sum">{p.summary}</p>
    </div>
  );
}

/* ── 정적 셀 (모바일 / 모션 축소) ──────────────────────────── */

function StaticCell({ index }: { index: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const size = useCanvasSize(ref);
  const { w, h } = size.current;

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx || !w || !h) return;
    drawScene(ctx, w, h, camStatic(index, w, h), 0, false);
  }, [index, w, h]);

  return <canvas ref={ref} className="h8-jstack__canvas" aria-hidden="true" />;
}

/* ── 본체 ─────────────────────────────────────────────────── */

export default function IsoJourney() {
  const reduced = useReducedMotion();
  const narrow = useIsNarrow();
  const staticMode = reduced || narrow;

  const { ref: trackRef, progress } = useScrollProgress<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = useCanvasSize(canvasRef);
  const pRef = useRef(0);
  const [act, setAct] = useState(0);

  useEffect(() => {
    pRef.current = progress;
    setAct(activePillar(progress));
  }, [progress]);

  useEffect(() => {
    if (staticMode) return;
    const cv = canvasRef.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;

    let raf = 0;
    let visible = true;
    let t0 = 0;

    const frame = (ts: number) => {
      raf = 0;
      if (!t0) t0 = ts;
      const t = (ts - t0) / 1000;
      const { w, h } = size.current;
      if (w && h) drawScene(ctx, w, h, camAt(pRef.current, w, h, t), t, true);
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
  }, [staticMode, size]);

  if (staticMode) {
    return (
      <div className="h8-shell h8-jstack">
        {pillars.map((p, i) => (
          <div className="h8-jstack__item" key={p.id}>
            <StaticCell index={i} />
            <LayerLabel p={p} on />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h8-journey__track" ref={trackRef} style={{ height: '360svh' }}>
      <div className="h8-journey__stage">
        <canvas ref={canvasRef} className="h8-journey__canvas" aria-hidden="true" />
        <div className="h8-journey__ui">
          <div className="h8-journey__head">
            <p className="h8-eyebrow">
              02 <b>{nav[0].labelEn}</b>
            </p>
            <p className="h8-mono" style={{ fontSize: 'var(--t-xs)', letterSpacing: '0.14em' }}>
              {String(act + 1).padStart(2, '0')} / {String(pillars.length).padStart(2, '0')}
            </p>
          </div>

          <div className="h8-journey__panel">
            {pillars.map((p, i) => (
              <LayerLabel key={p.id} p={p} on={act === i} />
            ))}
          </div>

          <div className="h8-journey__rail">
            <span>{pillars[act].code}</span>
            <span className="h8-journey__bar">
              <i style={{ transform: `scaleX(${progress})` }} />
              {[0.18, 0.5, 0.82].map((s, i) => (
                <b key={s} style={{ left: `${s * 100}%` }} data-on={act >= i ? 'true' : 'false'} />
              ))}
            </span>
            <span>{String(Math.round(progress * 100)).padStart(3, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
