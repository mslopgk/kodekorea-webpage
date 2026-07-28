/**
 * 컨셉 A — 아이소메트릭 지형 씬 정의
 *
 * 3개 사업축을 하나의 연속된 지형 위 오브젝트 군집으로 배치하고,
 * 액센트 색 라인이 군집 사이를 흐르며 연결한다.
 *   군집 1 = 도면 / 기계   (AI 솔루션)
 *   군집 2 = 화면 / 블록   (AI 교육)
 *   군집 3 = 서버 / 노드   (플랫폼 구축)
 */

import { C, DOTS, PAL } from './palette';
import {
  box,
  type Cam,
  clamp01,
  css,
  hex,
  line3,
  mix,
  proj,
  rand,
  shadow,
  slab,
  spline,
  TILE_H,
  TILE_W,
  tone,
  type RGB,
} from './iso';

function dotColor(x: number, y: number): RGB {
  return DOTS[Math.floor(rand(x, y) * DOTS.length) % DOTS.length];
}

/**
 * 각 군집의 중심 월드 좌표.
 * 화면 x는 (x-y), 화면 y는 (x+y)에 비례하므로 두 값을 함께 늘려
 * 카메라가 화면 대각선 방향으로 이동하게 배치한다.
 */
export const CLUSTERS: [number, number][] = [
  [2, 2],
  [26, 10],
  [50, 20],
];

/** 카메라가 순서대로 머무는 위치 (군집 사이 이동 지점 포함) */
export const CAM_PATH: [number, number][] = [
  [-11, -5],
  CLUSTERS[0],
  [14, 6],
  CLUSTERS[1],
  [38, 15],
  CLUSTERS[2],
  [63, 25],
];

/** 진행률 → 카메라 경로 파라미터(0..6). 군집마다 머무는 구간을 둔다. */
export const CAM_STOPS: [number, number][] = [
  [0, 0],
  [0.12, 1],
  [0.24, 1],
  [0.34, 2],
  [0.44, 3],
  [0.56, 3],
  [0.66, 4],
  [0.76, 5],
  [0.88, 5],
  [1, 6],
];

/** 진행률 → 활성 사업축 인덱스 */
export function activePillar(p: number): number {
  // 다음 군집을 향해 이동을 시작하는 지점에서 라벨을 넘긴다
  if (p < 0.38) return 0;
  if (p < 0.71) return 1;
  return 2;
}

/**
 * 액센트 흐름선 waypoint.
 * 각 군집의 "앞쪽"(x+y가 큰 쪽)을 지나게 해서 오브젝트에 가리지 않게 하고,
 * (x-y)를 계단식으로 늘려 화면에서 좌우로 흔들리며 내려가게 만든다.
 */
const FLOW: [number, number, number][] = [
  [-12, -4, 0.18],
  [-5, -1, 0.18],
  [4, 5.5, 0.18],
  [10, 7, 0.18],
  [14, 11, 0.18],
  [20, 12, 0.18],
  [24, 13, 0.18],
  [28, 14.5, 0.18],
  [33, 16, 0.18],
  [37, 20, 0.18],
  [42, 21, 0.18],
  [47, 23, 0.18],
  [52, 25, 0.18],
  [57, 27, 0.18],
  [62, 30, 0.18],
];

const FLOW_PTS = spline(FLOW, 16);

/** 지형 높이 — 군집 주변은 평평하게 눌러 오브젝트가 안정적으로 놓이게 한다 */
export function groundZ(x: number, y: number): number {
  let flat = 1;
  for (const [cx, cy] of CLUSTERS) {
    const d = Math.hypot(x - cx, y - cy);
    flat = Math.min(flat, clamp01((d - 6.5) / 7));
  }
  const h = 0.34 * Math.sin(x * 0.21) * Math.cos(y * 0.18) + 0.16 * Math.sin((x + y) * 0.1);
  return h * flat;
}

function nearestCluster(x: number, y: number): number {
  let m = Infinity;
  for (const [cx, cy] of CLUSTERS) m = Math.min(m, Math.hypot(x - cx, y - cy));
  return m;
}

/* ── 지면 ────────────────────────────────────────────────── */

export function drawGround(ctx: CanvasRenderingContext2D, cam: Cam, w: number, h: number, t: number) {
  const sx = TILE_W * cam.scale;
  const sy = TILE_H * cam.scale;
  const cu = cam.cx - cam.cy;
  const cv = cam.cx + cam.cy;

  // 화면 정렬 격자(u = x-y, v = x+y)로 순회해 항상 화면을 덮는다
  const vMin = Math.floor(((-60 - cam.oy) * 2) / sy + cv);
  const vMax = Math.ceil(((h + 60 - cam.oy) * 2) / sy + cv);
  const uMin = Math.floor(((-60 - cam.ox) * 2) / sx + cu);
  const uMax = Math.ceil(((w + 60 - cam.ox) * 2) / sx + cu);

  const buckets: Path2D[] = DOTS.map(() => new Path2D());
  const tinted: { x: number; y: number; r: number; c: RGB }[] = [];
  const cxScreen = w * 0.5;
  const cyScreen = h * 0.55;
  const maxD = Math.hypot(w, h) * 0.62;

  // 배율이 크면 도트 간격을 절반으로 줄여 격자 밀도를 유지한다
  const step = cam.scale > 1.25 ? 1 : 2;
  for (let v = vMin; v <= vMax; v += step) {
    for (let u = uMin; u <= uMax; u += step) {
      const x = (u + v) / 2;
      const y = (v - u) / 2;
      const z = groundZ(x, y);
      const p = proj(x, y, z, cam);
      if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) continue;

      const fall = 1 - clamp01(Math.hypot(p.x - cxScreen, p.y - cyScreen) / maxD);
      const near = nearestCluster(x, y);
      const halo = clamp01(1 - near / 10);
      const wave = 0.5 + 0.5 * Math.sin(x * 0.5 + y * 0.36 + t * 0.7);
      // 화면 가장자리는 반경으로만 줄여 페이드시킨다 (알파 분기 없이 배치 렌더 유지)
      const r =
        (1.35 + z * 1.2 + wave * 0.45 + halo * 0.7) * Math.max(0.8, Math.min(1.7, cam.scale)) * (0.72 + 0.28 * fall);

      if (halo > 0.02) {
        tinted.push({ x: p.x, y: p.y, r, c: mix(dotColor(x, y), C.accent, halo * 0.55) });
      } else {
        const bi = Math.floor(rand(x, y) * DOTS.length) % DOTS.length;
        const path = buckets[bi];
        path.moveTo(p.x + r, p.y);
        path.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
    }
  }

  DOTS.forEach((c, i) => {
    ctx.fillStyle = css(tone(c, 0.98), 0.9);
    ctx.fill(buckets[i]);
  });
  for (const d of tinted) {
    ctx.fillStyle = css(d.c, 0.95);
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 지형 구조를 읽히게 하는 초저채도 헤어라인
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(20,21,25,0.035)';
  const base = Math.round(cam.cx / 12) * 12;
  for (let k = -5; k <= 5; k++) {
    const gx = base + k * 12;
    ctx.beginPath();
    for (let s = -34; s <= 34; s += 2) {
      const gy = cam.cy + s;
      const p = proj(gx, gy, groundZ(gx, gy), cam);
      if (s === -34) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  const baseY = Math.round(cam.cy / 12) * 12;
  for (let k = -5; k <= 5; k++) {
    const gy = baseY + k * 12;
    ctx.beginPath();
    for (let s = -34; s <= 34; s += 2) {
      const gx = cam.cx + s;
      const p = proj(gx, gy, groundZ(gx, gy), cam);
      if (s === -34) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
}

/* ── 액센트 흐름선 ────────────────────────────────────────── */

export function drawFlow(ctx: CanvasRenderingContext2D, cam: Cam, t: number, animate: boolean) {
  const pts = FLOW_PTS.map(([x, y, z]) => proj(x, y, z, cam));

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const trace = () => {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  };

  // 지면에 번지는 광량
  trace();
  ctx.strokeStyle = css(C.accent, 0.1);
  ctx.lineWidth = 16 * cam.scale;
  ctx.stroke();

  trace();
  ctx.strokeStyle = css(C.accent, 0.22);
  ctx.lineWidth = 7 * cam.scale;
  ctx.stroke();

  // 본선
  trace();
  ctx.strokeStyle = css(C.accent, 0.95);
  ctx.lineWidth = 2.4 * cam.scale;
  ctx.stroke();

  // 흐름 방향을 알리는 대시
  ctx.save();
  trace();
  ctx.setLineDash([6 * cam.scale, 16 * cam.scale]);
  ctx.lineDashOffset = animate ? -t * 90 * cam.scale : 0;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5 * cam.scale;
  ctx.stroke();
  ctx.restore();

  // 흐르는 패킷
  const n = 7;
  for (let i = 0; i < n; i++) {
    const f = ((animate ? t * 0.06 : 0.5) + i / n) % 1;
    const idx = Math.min(pts.length - 1, Math.floor(f * (pts.length - 1)));
    const p = pts[idx];
    if (p.x < -40 || p.x > 4000) continue;
    const r = 3.4 * cam.scale;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
    g.addColorStop(0, css(C.accentLt, 0.9));
    g.addColorStop(1, css(C.accent, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ── 군집 1 : 도면 / 기계 (AI 솔루션) ─────────────────────── */

function clusterSolution(ctx: CanvasRenderingContext2D, cam: Cam, t: number) {
  const [cx, cy] = CLUSTERS[0];
  const x = cx - 3.4;
  const y = cy - 1.6;

  shadow(ctx, cam, x - 0.5, y - 0.5, 8, 6.5, 0.13);

  // 도면 판
  slab(ctx, cam, x, y, 0, 6.4, 4.6, C.white, { edge: css(C.greyDeep, 0.9) });
  const zTop = 0.12;
  ctx.lineWidth = 1;
  for (let i = 0.8; i < 6.4; i += 0.8) {
    line3(ctx, cam, [x + i, y + 0.15, zTop], [x + i, y + 4.45, zTop], css(C.greyDeep, 0.55));
  }
  for (let j = 0.8; j < 4.6; j += 0.8) {
    line3(ctx, cam, [x + 0.15, y + j, zTop], [x + 6.25, y + j, zTop], css(C.greyDeep, 0.55));
  }
  // 도면 위 형상 + 치수선
  line3(ctx, cam, [x + 1.2, y + 1.2, zTop], [x + 4.6, y + 1.2, zTop], css(C.ink, 0.75), 2);
  line3(ctx, cam, [x + 4.6, y + 1.2, zTop], [x + 4.6, y + 3.4, zTop], css(C.ink, 0.75), 2);
  line3(ctx, cam, [x + 4.6, y + 3.4, zTop], [x + 1.2, y + 3.4, zTop], css(C.ink, 0.75), 2);
  line3(ctx, cam, [x + 1.2, y + 3.4, zTop], [x + 1.2, y + 1.2, zTop], css(C.ink, 0.75), 2);
  line3(ctx, cam, [x + 0.6, y + 1.2, zTop], [x + 0.6, y + 3.4, zTop], css(C.accent, 0.9), 1.5);
  line3(ctx, cam, [x + 1.2, y + 3.9, zTop], [x + 4.6, y + 3.9, zTop], css(C.accent, 0.9), 1.5);

  // 기계
  box(ctx, cam, x + 6.9, y - 2.6, 0, 2.6, 2.6, 1.4, C.grey, { edge: css(C.greyDeep, 0.8) });
  box(ctx, cam, x + 7.5, y - 2, 1.4, 1.3, 1.3, 1.1, C.slate, { edge: css(C.greyDeep, 0.7) });
  line3(ctx, cam, [x + 7.5, y - 0.7, 2.5], [x + 8.8, y - 0.7, 2.5], css(C.accent, 0.85), 2);
  box(ctx, cam, x + 6.2, y + 0.4, 0, 0.9, 0.9, 2.9, C.greyDeep, { edge: css(C.slate, 0.6) });

  // 버블맵 — 도면 위에 떠 있는 링
  const bubbles: [number, number, number][] = [
    [1.2, 1.2, 2.1],
    [4.6, 1.2, 2.6],
    [4.6, 3.4, 1.8],
    [2.6, 2.3, 3.1],
  ];
  bubbles.forEach((b, i) => {
    const float = Math.sin(t * 1.1 + i * 1.7) * 0.12;
    const az = b[2] + float;
    const a = proj(x + b[0], y + b[1], zTop, cam);
    const p = proj(x + b[0], y + b[1], az, cam);
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = css(C.accent, 0.4);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.restore();

    const r = (7 + i * 1.4) * cam.scale;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(251,251,249,0.92)';
    ctx.fill();
    ctx.strokeStyle = css(C.accent, 0.9);
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = css(C.accent, 0.9);
    ctx.fill();
  });
}

/* ── 군집 2 : 화면 / 블록 (AI 교육) ───────────────────────── */

function clusterEducation(ctx: CanvasRenderingContext2D, cam: Cam, t: number) {
  const [cx, cy] = CLUSTERS[1];
  const x = cx - 3.2;
  const y = cy - 2.4;

  shadow(ctx, cam, x - 0.5, y - 0.5, 8, 7, 0.13);
  slab(ctx, cam, x, y, 0, 6.8, 5.6, C.grey, { edge: css(C.greyDeep, 0.85) });
  for (let i = 0.85; i < 6.8; i += 0.85) {
    line3(ctx, cam, [x + i, y + 0.15, 0.12], [x + i, y + 5.45, 0.12], css(C.greyDeep, 0.45));
  }

  // 블록 (Blockly)
  const blocks: [number, number, number, RGB][] = [
    [0.7, 3.4, 0, hex('#c8cddd')],
    [0.7, 3.4, 0.5, hex('#d5c9dc')],
    [2.4, 3.9, 0, hex('#cbdccd')],
    [2.4, 3.9, 0.5, hex('#dcd6c4')],
  ];
  for (const [bx, by, bz, col] of blocks) {
    box(ctx, cam, x + bx, y + by, 0.12 + bz, 1.5, 1.1, 0.5, col, { edge: css(C.greyDeep, 0.6) });
    line3(
      ctx,
      cam,
      [x + bx + 0.25, y + by + 1.1, 0.12 + bz + 0.25],
      [x + bx + 1.25, y + by + 1.1, 0.12 + bz + 0.25],
      css(C.white, 0.6),
      1
    );
  }

  // 모니터 — 남면이 화면
  const mx = x + 3.5;
  const my = y + 0.6;
  box(ctx, cam, mx + 1.3, my + 0.8, 0.12, 0.7, 0.7, 0.5, C.greyDeep, { edge: css(C.slate, 0.6) });
  box(ctx, cam, mx, my, 0.62, 3.3, 0.45, 2.3, C.grey, {
    edge: css(C.greyDeep, 0.85),
    onSouth: (c, corners) => {
      const g = c.createLinearGradient(corners[0].x, corners[0].y, corners[2].x, corners[2].y);
      g.addColorStop(0, 'rgba(45,70,255,0.16)');
      g.addColorStop(1, 'rgba(45,70,255,0.02)');
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < corners.length; i++) c.lineTo(corners[i].x, corners[i].y);
      c.closePath();
      c.fill();
    },
  });
  // 화면 안 코드 라인 (남면 = y + 0.45 평면)
  const fy = my + 0.45;
  const rows = 7;
  for (let i = 0; i < rows; i++) {
    const z = 0.62 + 2.05 - i * 0.24;
    const w = 0.5 + rand(i, 3) * 2.1;
    const ind = 0.28 + (i % 3) * 0.22;
    const on = i === 2 || i === 5;
    line3(
      ctx,
      cam,
      [mx + ind, fy, z],
      [mx + ind + w, fy, z],
      on ? css(C.accent, 0.9) : css(C.slate, 0.75),
      on ? 2.2 : 1.6
    );
  }
  // 커서
  if (Math.sin(t * 4) > 0) {
    line3(ctx, cam, [mx + 0.5, fy, 0.62 + 0.35], [mx + 0.72, fy, 0.62 + 0.35], css(C.accent, 0.95), 2.4);
  }

  // 블록 → 코드 변환 라인
  const a = proj(x + 3.2, y + 4, 0.7, cam);
  const b = proj(mx + 0.6, fy, 1.3, cam);
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = -t * 26;
  ctx.strokeStyle = css(C.accent, 0.75);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.quadraticCurveTo((a.x + b.x) / 2, Math.min(a.y, b.y) - 40 * cam.scale, b.x, b.y);
  ctx.stroke();
  ctx.restore();
}

/* ── 군집 3 : 서버 / 노드 (플랫폼 구축) ───────────────────── */

function clusterPlatform(ctx: CanvasRenderingContext2D, cam: Cam, t: number) {
  const [cx, cy] = CLUSTERS[2];
  const x = cx - 3.4;
  const y = cy - 2.8;

  shadow(ctx, cam, x - 0.5, y - 0.5, 8.4, 7.4, 0.14);
  slab(ctx, cam, x, y, 0, 7.2, 6.2, C.grey, { edge: css(C.greyDeep, 0.85) });
  for (let j = 0.9; j < 6.2; j += 0.9) {
    line3(ctx, cam, [x + 0.15, y + j, 0.12], [x + 7.05, y + j, 0.12], css(C.greyDeep, 0.45));
  }

  // 서버랙 3기
  for (let r = 0; r < 3; r++) {
    const rx = x + 0.9 + r * 2.1;
    const ry = y + 1.1;
    box(ctx, cam, rx, ry, 0.12, 1.5, 2.4, 2.6 + r * 0.25, C.grey, { edge: css(C.greyDeep, 0.85) });
    const fy = ry + 2.4;
    for (let s = 0; s < 8; s++) {
      const z = 0.32 + s * 0.3;
      if (z > 2.5 + r * 0.25) break;
      line3(ctx, cam, [rx + 0.18, fy, z], [rx + 1.32, fy, z], css(C.greyDeep, 0.8), 1.4);
      const lit = (Math.sin(t * 2.2 + s * 1.3 + r * 2.1) + 1) / 2 > 0.55;
      const p = proj(rx + 1.15, fy, z + 0.08, cam);
      ctx.fillStyle = lit ? css(C.accent, 0.95) : css(C.slate, 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.7 * cam.scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 노드 그래프 (MCP / 에이전트)
  const nodes: [number, number, number][] = [
    [1.4, 0.2, 4.1],
    [3.6, -0.4, 4.7],
    [5.9, 0.4, 4.2],
    [4.7, 1.4, 5.3],
    [2.4, 1.6, 5.1],
  ];
  const pts = nodes.map(([nx, ny, nz], i) =>
    proj(x + nx, y + ny, nz + Math.sin(t * 0.9 + i * 1.4) * 0.14, cam)
  );
  ctx.strokeStyle = css(C.accent, 0.45);
  ctx.lineWidth = 1.2;
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 2],
    [0, 4],
    [4, 3],
  ];
  for (const [i, j] of edges) {
    ctx.beginPath();
    ctx.moveTo(pts[i].x, pts[i].y);
    ctx.lineTo(pts[j].x, pts[j].y);
    ctx.stroke();
  }
  pts.forEach((p, i) => {
    const r = (i === 1 ? 6.5 : 4.6) * cam.scale;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
    g.addColorStop(0, css(C.accent, 0.32));
    g.addColorStop(1, css(C.accent, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbfbf9';
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = css(C.accent, 0.95);
    ctx.lineWidth = 1.8;
    ctx.stroke();
  });
}

/* ── 오케스트레이션 ──────────────────────────────────────── */

const DRAWERS = [clusterSolution, clusterEducation, clusterPlatform];

export function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cam: Cam,
  t: number,
  animate: boolean
) {
  ctx.clearRect(0, 0, w, h);

  // 배경 — 거의 흰 무채색 + 아주 옅은 온기
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#fbfbfa');
  bg.addColorStop(0.55, PAL.paper);
  bg.addColorStop(1, '#e7e7e2');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  drawGround(ctx, cam, w, h, t);
  drawFlow(ctx, cam, t, animate);

  // 카메라에서 먼 군집부터 (월드 거리로 컬링 — 옆 군집이 화면에 삐져나오지 않게)
  const order = [0, 1, 2].sort(
    (a, b) => CLUSTERS[a][0] + CLUSTERS[a][1] - (CLUSTERS[b][0] + CLUSTERS[b][1])
  );
  for (const i of order) {
    const [ccx, ccy] = CLUSTERS[i];
    if (Math.abs(ccx - cam.cx) + Math.abs(ccy - cam.cy) > 30) continue;
    DRAWERS[i](ctx, cam, t);
  }

  // 상·하단 페이드 — 섹션 경계와 부드럽게 이어지게
  const fade = ctx.createLinearGradient(0, 0, 0, h);
  fade.addColorStop(0, 'rgba(251,251,250,1)');
  fade.addColorStop(0.08, 'rgba(251,251,250,0)');
  fade.addColorStop(0.93, 'rgba(231,231,226,0)');
  fade.addColorStop(1, 'rgba(231,231,226,1)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, w, h);
}
