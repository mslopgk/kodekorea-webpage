/**
 * 컨셉 A — 아이소메트릭 투영 엔진 (Canvas 2D 직접 구현)
 *
 * 외부 3D 라이브러리를 쓰지 않고 정투영(isometric) 좌표 변환과
 * 박스 3면 셰이딩만으로 입체감을 만든다.
 *
 * 월드 좌표계
 *   x → 화면 오른쪽 아래 / y → 화면 왼쪽 아래 / z → 화면 위(높이)
 *   x+y 가 클수록 카메라에 가깝다 (draw order: x+y 오름차순)
 */

export type Cam = {
  /** 카메라가 보고 있는 월드 좌표 */
  cx: number;
  cy: number;
  /** 배율 */
  scale: number;
  /** 화면상 기준점(px) — 카메라 중심이 찍히는 위치 */
  ox: number;
  oy: number;
};

export const TILE_W = 46;
export const TILE_H = 23;
export const Z_UNIT = 27;

export type Pt = { x: number; y: number };

/** 월드 → 화면 */
export function proj(x: number, y: number, z: number, cam: Cam): Pt {
  const s = cam.scale;
  const hx = TILE_W / 2;
  const hy = TILE_H / 2;
  return {
    x: (x - y - (cam.cx - cam.cy)) * hx * s + cam.ox,
    y: (x + y - (cam.cx + cam.cy)) * hy * s - z * Z_UNIT * s + cam.oy,
  };
}

/* ── 색 유틸 ─────────────────────────────────────────────── */

export type RGB = [number, number, number];

export function hex(h: string): RGB {
  const v = h.replace('#', '');
  const n = parseInt(
    v.length === 3
      ? v
          .split('')
          .map((c) => c + c)
          .join('')
      : v,
    16
  );
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function css(c: RGB, alpha = 1): string {
  return alpha >= 1
    ? `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
    : `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${alpha})`;
}

/** k>1 밝게, k<1 어둡게 */
export function tone(c: RGB, k: number): RGB {
  const f = (v: number) => Math.max(0, Math.min(255, k > 1 ? v + (255 - v) * (k - 1) : v * k));
  return [f(c[0]), f(c[1]), f(c[2])];
}

export function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/* ── 기본 형상 ───────────────────────────────────────────── */

function poly(ctx: CanvasRenderingContext2D, pts: Pt[], fill: string, stroke?: string, lw = 1) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

export type BoxOpts = {
  /** 윗면 위에 그릴 추가 연출 */
  onTop?: (ctx: CanvasRenderingContext2D, corners: Pt[]) => void;
  /** 오른쪽(동)면 위에 그릴 추가 연출 */
  onEast?: (ctx: CanvasRenderingContext2D, corners: Pt[]) => void;
  /** 왼쪽(남)면 위에 그릴 추가 연출 */
  onSouth?: (ctx: CanvasRenderingContext2D, corners: Pt[]) => void;
  edge?: string;
};

/**
 * 아이소메트릭 박스. (x,y,z)가 바닥 시작점, (w,d,h)가 크기.
 * 윗면 / 동면 / 남면 3장만 그리면 정투영에서는 완전한 입체로 보인다.
 */
export function box(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  base: RGB,
  opts: BoxOpts = {}
) {
  const top = [
    proj(x, y, z + h, cam),
    proj(x + w, y, z + h, cam),
    proj(x + w, y + d, z + h, cam),
    proj(x, y + d, z + h, cam),
  ];
  const east = [top[1], top[2], proj(x + w, y + d, z, cam), proj(x + w, y, z, cam)];
  const south = [top[3], top[2], proj(x + w, y + d, z, cam), proj(x, y + d, z, cam)];

  poly(ctx, south, css(tone(base, 0.72)), opts.edge, 1);
  poly(ctx, east, css(tone(base, 0.87)), opts.edge, 1);
  poly(ctx, top, css(tone(base, 1.06)), opts.edge, 1);

  if (opts.onSouth) {
    ctx.save();
    poly(ctx, south, 'rgba(0,0,0,0)');
    ctx.clip();
    opts.onSouth(ctx, south);
    ctx.restore();
  }
  if (opts.onEast) {
    ctx.save();
    poly(ctx, east, 'rgba(0,0,0,0)');
    ctx.clip();
    opts.onEast(ctx, east);
    ctx.restore();
  }
  if (opts.onTop) {
    ctx.save();
    poly(ctx, top, 'rgba(0,0,0,0)');
    ctx.clip();
    opts.onTop(ctx, top);
    ctx.restore();
  }
  return { top, east, south };
}

/** 바닥에 깔리는 얇은 판 (도면·플랫폼 등) */
export function slab(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  base: RGB,
  opts: BoxOpts = {}
) {
  return box(ctx, cam, x, y, z, w, d, 0.12, base, opts);
}

/** 접지 그림자 (타원) */
export function shadow(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  x: number,
  y: number,
  w: number,
  d: number,
  alpha = 0.1
) {
  const c = proj(x + w / 2, y + d / 2, 0, cam);
  const rx = ((w + d) / 2) * (TILE_W / 2) * cam.scale * 0.95;
  const ry = ((w + d) / 2) * (TILE_H / 2) * cam.scale * 0.95;
  const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, Math.max(rx, 1));
  g.addColorStop(0, `rgba(24,26,34,${alpha})`);
  g.addColorStop(1, 'rgba(24,26,34,0)');
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.scale(1, ry / Math.max(rx, 1));
  ctx.translate(-c.x, -c.y);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(c.x, c.y, Math.max(rx, 1), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** 월드 좌표 선분 */
export function line3(
  ctx: CanvasRenderingContext2D,
  cam: Cam,
  a: [number, number, number],
  b: [number, number, number],
  color: string,
  lw = 1
) {
  const p = proj(a[0], a[1], a[2], cam);
  const q = proj(b[0], b[1], b[2], cam);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(q.x, q.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
}

/* ── 스플라인 (액센트 흐름선) ──────────────────────────────── */

type W3 = [number, number, number];

/** Catmull-Rom 보간으로 waypoint를 매끄러운 경로로 만든다 */
export function spline(pts: W3[], samplesPerSeg = 14): W3[] {
  if (pts.length < 2) return pts.slice();
  const ext: W3[] = [pts[0], ...pts, pts[pts.length - 1]];
  const out: W3[] = [];
  for (let i = 1; i < ext.length - 2; i++) {
    const p0 = ext[i - 1];
    const p1 = ext[i];
    const p2 = ext[i + 1];
    const p3 = ext[i + 2];
    for (let s = 0; s < samplesPerSeg; s++) {
      const t = s / samplesPerSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), f(p0[2], p1[2], p2[2], p3[2])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** 키프레임 선형 보간 — 스크롤 진행률을 경로 파라미터로 바꿀 때 사용 */
export function keyframe(stops: [number, number][], p: number): number {
  if (p <= stops[0][0]) return stops[0][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [pa, va] = stops[i];
    const [pb, vb] = stops[i + 1];
    if (p <= pb) {
      const t = pb === pa ? 0 : (p - pa) / (pb - pa);
      return va + (vb - va) * t;
    }
  }
  return stops[stops.length - 1][1];
}

export function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** 결정적 의사난수 — 프레임마다 흔들리지 않게 */
export function rand(i: number, j = 0) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
