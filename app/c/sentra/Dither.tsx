'use client';

import { useEffect, useRef } from 'react';
import { useIsNarrow, useReducedMotion } from '@/lib/motion';
import s from './sentra.module.css';
import { cx } from './util';

/* ── 8×8 Bayer 매트릭스 (오더드 디더링) ─────────────────────── */
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60,
  28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47,
  7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
];

/* ── 절차적 그래픽용 노이즈 ────────────────────────────────── */
function hash2(x: number, y: number): number {
  const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function vnoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number): number {
  return 0.55 * vnoise(x, y) + 0.28 * vnoise(x * 2.1, y * 2.1) + 0.14 * vnoise(x * 4.3, y * 4.3);
}

/** 사각 거리장 (도면 외곽선용) */
function boxSdf(px: number, py: number, hx: number, hy: number): number {
  return Math.max(Math.abs(px) - hx, Math.abs(py) - hy);
}

function line(v: number, width: number): number {
  return Math.exp(-((v / width) ** 2));
}

type Field = (nx: number, ny: number, aspect: number, t: number) => number;

/**
 * 이미지 소스가 없으므로 그래픽 전부를 절차적으로 생성한다.
 * 각 필드는 0~1 밝기를 반환하고, 이후 Bayer 디더링으로 1비트로 떨어진다.
 */
const FIELDS: Record<string, Field> = {
  /** 히어로 — 일식 링 + 스타필드 + 스캔 밴드 */
  eclipse(nx, ny, aspect, t) {
    // 링을 우상단으로 밀어 좌하단 텍스트 영역과 겹치지 않게 한다
    const dx = (nx - 0.63) * aspect;
    const dy = ny - 0.36;
    const r = Math.hypot(dx, dy);
    const ring = 0.3;
    let v = line(r - ring, 0.028) * 1.25;
    v += Math.exp(-(((r - ring) / 0.19) ** 2)) * 0.34;
    if (r < ring - 0.012) v *= 0.06;
    v += (fbm(nx * 7 + t * 0.09, ny * 7 - t * 0.05) - 0.45) * 0.34;
    v += Math.sin(ny * 190 + t * 0.9) * 0.035;
    if (r > ring + 0.04 && hash2(Math.floor(nx * 520), Math.floor(ny * 520)) > 0.9955) v += 0.75;
    // 아래로 갈수록, 왼쪽으로 갈수록 밀도를 낮춘다 (텍스트 가독성)
    v *= 1.06 - ny * 0.72;
    v *= 0.5 + Math.min(1, nx * 1.1) * 0.5;
    return v;
  },

  /** S/01 — 제조 도면: 치수선 + 버블 콜아웃 + 해칭 */
  blueprint(nx, ny, aspect, t) {
    const px = (nx - 0.5) * aspect;
    const py = ny - 0.5;
    let v = 0.04;
    const gx = Math.abs(((nx * aspect * 10) % 1) - 0.5);
    const gy = Math.abs(((ny * 8) % 1) - 0.5);
    if (gx > 0.46 || gy > 0.46) v += 0.3;

    const d = boxSdf(px, py, 0.26, 0.2);
    v += line(d, 0.01) * 1.4;
    v += line(boxSdf(px - 0.06, py + 0.03, 0.1, 0.07), 0.008) * 1.2;
    if (d < -0.015 && Math.abs((((nx * aspect + ny) * 22) % 1) - 0.5) > 0.4) v += 0.34;

    const bubbles = [
      [0.18, 0.2],
      [0.83, 0.3],
      [0.3, 0.86],
      [0.72, 0.78],
    ];
    for (const [bx, by] of bubbles) {
      const rr = Math.hypot((nx - bx) * aspect, ny - by);
      v += line(rr - 0.05, 0.008) * 1.4;
      v += rr < 0.05 ? 0.14 : 0;
    }
    // 치수선
    v += line(py - 0.37, 0.006) * (Math.abs(px) < 0.31 ? 1.1 : 0);
    v += line(px + 0.34, 0.006) * (Math.abs(py) < 0.26 ? 1.1 : 0);
    v += (fbm(nx * 22 + t * 0.04, ny * 22) - 0.5) * 0.08;
    return v;
  },

  /** A/02 — 블록 ↔ 코드: 들여쓰기 블록 바 */
  blocks(nx, ny, aspect, t) {
    const rows = 13;
    const row = Math.floor(ny * rows);
    const depth = [0, 1, 2, 2, 3, 2, 1, 2, 3, 3, 2, 1, 0][row % 13];
    const start = 0.05 + depth * 0.075;
    const len = 0.18 + ((row * 7) % 5) * 0.09;
    let v = 0.04;
    const inRow = Math.abs((((ny * rows) % 1) - 0.5) * 2) < 0.52;
    if (inRow && nx > start && nx < start + len) v += 0.85;
    if (Math.abs(((nx * aspect * 24) % 1) - 0.5) > 0.475) v += 0.11;
    for (let dpt = 1; dpt <= 3; dpt++) {
      v += line(nx - (0.05 + dpt * 0.075) + 0.008, 0.0035) * 0.4;
    }
    v += (fbm(nx * 18, ny * 18 + t * 0.05) - 0.5) * 0.14;
    return v;
  },

  /** W/03 — 아이소메트릭 랙 격자 */
  iso(nx, ny, aspect, t) {
    const u = nx * aspect * 9 + ny * 4.5;
    const w = nx * aspect * 9 - ny * 4.5;
    let v = 0.03;
    if (Math.abs((u % 1) - 0.5) > 0.4) v += 0.55;
    if (Math.abs((w % 1) - 0.5) > 0.4) v += 0.55;
    // 랙에 꽂힌 유닛
    const bx = Math.floor(u);
    const by = Math.floor(w);
    const h = hash2(bx, by + Math.floor(t * 0.2));
    if (h > 0.88) v += 0.55;
    v *= 1.1 - ny * 0.3;
    v += (fbm(nx * 12, ny * 12) - 0.5) * 0.08;
    return v;
  },

  /** 간섭 파형 — 운영 역량 / CTA 배경 */
  wave(nx, ny, aspect, t) {
    const a = Math.sin(nx * aspect * 13 + Math.sin(ny * 8 + t * 0.4) * 2.1 + t * 0.5);
    const b = Math.sin(ny * 10 - t * 0.32 + Math.cos(nx * aspect * 6) * 1.4);
    let v = 0.24 + a * 0.24 + b * 0.2;
    v += (fbm(nx * 10 + t * 0.06, ny * 10) - 0.5) * 0.2;
    v *= 1 - Math.abs(ny - 0.5) * 0.5;
    return v;
  },
};

export type DitherVariant = keyof typeof FIELDS;

type Props = {
  variant: DitherVariant;
  /** 'r,g,b' — 다크 섹션에서는 흰색, 라이트 섹션에서는 검정 */
  color?: string;
  /** 텍셀 하나가 차지하는 CSS 픽셀 수. 클수록 픽셀이 굵어진다. */
  texel?: number;
  /** 도트 밀도 배율 */
  gain?: number;
  animate?: boolean;
  className?: string;
};

/**
 * Canvas 2D로 절차적 그래픽을 그린 뒤 Bayer 오더드 디더링으로 1비트 흑백 변환.
 * 켜진 픽셀만 단색으로 남기고 나머지는 투명 → 섹션 배경 위에 하프톤처럼 얹힌다.
 * 이 텍스처가 컨셉 B의 시각적 서명이다.
 */
export function Dither({
  variant,
  color = '242,242,242',
  texel = 4,
  gain = 1,
  animate = false,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  const narrow = useIsNarrow();

  useEffect(() => {
    const wrap = wrapRef.current;
    const cvs = canvasRef.current;
    if (!wrap || !cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const field = FIELDS[variant] ?? FIELDS.wave;
    const still = reduced || narrow || !animate;
    const px = narrow ? texel + 2 : texel;
    const parts = color.split(',').map((n) => Number(n) || 0);
    const cr = parts[0] ?? 242;
    const cg = parts[1] ?? 242;
    const cb = parts[2] ?? 242;

    let w = 0;
    let h = 0;
    let img: ImageData | null = null;
    let raf = 0;
    let last = -1e9;
    const t0 = performance.now();

    const draw = (now: number, force = false) => {
      if (!img) return;
      // 굵은 픽셀이므로 12fps로도 충분하다 (CPU 절약)
      if (!force && now - last < 82) return;
      last = now;
      const t = still ? 0 : (now - t0) / 1000;
      const aspect = w / h;
      const data = img.data;
      let i = 0;
      for (let y = 0; y < h; y++) {
        const ny = (y + 0.5) / h;
        const brow = (y & 7) * 8;
        for (let x = 0; x < w; x++) {
          const nx = (x + 0.5) / w;
          let v = field(nx, ny, aspect, t) * gain;
          if (v < 0) v = 0;
          else if (v > 1) v = 1;
          const on = v > (BAYER[brow + (x & 7)] + 0.5) / 64;
          data[i] = cr;
          data[i + 1] = cg;
          data[i + 2] = cb;
          data[i + 3] = on ? 255 : 0;
          i += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const nw = Math.max(2, Math.round(rect.width / px));
      const nh = Math.max(2, Math.round(rect.height / px));
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      cvs.width = w;
      cvs.height = h;
      img = ctx.createImageData(w, h);
      draw(performance.now(), true);
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    /**
     * 필드 계산은 텍셀마다 삼각함수를 십여 번 돌린다(히어로 1920폭 기준 프레임당
     * 수백만 회). 화면 밖에 있는 동안 이걸 계속 돌리면 스크롤 내내 메인 스레드를
     * 먹으므로, 뷰포트에 들어와 있을 때만 루프를 돌린다.
     */
    let visible = true;
    const startLoop = () => {
      if (still || raf || !visible) return;
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        if (!e) return;
        visible = e.isIntersecting;
        if (visible) startLoop();
        else stopLoop();
      },
      { rootMargin: '160px 0px' }
    );
    io.observe(wrap);
    startLoop();

    return () => {
      ro.disconnect();
      io.disconnect();
      stopLoop();
    };
  }, [variant, color, texel, gain, animate, reduced, narrow]);

  return (
    <div ref={wrapRef} className={cx(s.ditherWrap, className)} aria-hidden>
      <canvas ref={canvasRef} className={s.ditherCanvas} />
    </div>
  );
}
