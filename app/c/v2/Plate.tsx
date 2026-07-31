'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { useViewProgress } from './parts';

/**
 * 증거 전시 — 카드 갤러리를 대신하는 Work 표현.
 *
 * 1차 평가에서 "프로젝트가 전부 카드 갤러리라 브랜드 개성이 없다"는 지적을 받았다.
 * 그래서 결과를 요약한 카드가 아니라 **제품이 실제로 하는 일을 화면에 그린다**:
 * 절차적으로 생성한 기계 도면 위에, 파이프라인이 검출한 치수 콜아웃이 하나씩 찍힌다.
 *
 * 회사가 세 개의 서로 다른 일을 하므로 축마다 다른 그림을 그린다.
 *   solution  → 기계 도면 + 치수 검출
 *   education → 블록 ↔ 파이썬 대응
 *   platform  → 서비스 노드 그래프
 */
type Kind = 'solution' | 'education' | 'platform';

// 결정적 난수 — 서버·클라이언트 렌더가 갈리지 않게 시드를 고정한다
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const ACCENT = '#ff4d17';

export function Plate({ kind, seed = 7 }: { kind: Kind; seed?: number }) {
  /**
   * 스크롤 진행률로 그림을 구동한다.
   * 1차 V2에서는 화면에 들어올 때 한 번 재생하고 멈춰서 "본문이 심심하다"는
   * 지적을 받았다. 이제 스크롤하는 동안 도면이 계속 반응한다 —
   * 사용자의 스크롤이 곧 "파이프라인이 도면을 읽는 진행률"이 된다.
   */
  const { ref: wrapRef, p } = useViewProgress<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();
  /** 마우스 위치에 따른 미세 기울기 — 도면이 판처럼 느껴지게 */
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let ro: ResizeObserver | null = null;

    const draw = (progress: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // 도면 격자
      ctx.strokeStyle = 'rgba(255,255,255,0.055)';
      ctx.lineWidth = 1;
      const cell = 34;
      ctx.beginPath();
      for (let x = 0; x <= w; x += cell) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (let y = 0; y <= h; y += cell) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }
      ctx.stroke();

      if (kind === 'solution') drawDrawing(ctx, w, h, progress, seed);
      else if (kind === 'education') drawBlocks(ctx, w, h, progress, seed);
      else drawNodes(ctx, w, h, progress, seed);
    };

    if (reduced) {
      draw(1);
      ro = new ResizeObserver(() => draw(1));
      ro.observe(cv);
      return () => ro?.disconnect();
    }

    // 진행률이 바뀔 때마다 다시 그린다 (rAF 1프레임으로 합침)
    raf = requestAnimationFrame(() => draw(p));
    ro = new ResizeObserver(() => draw(p));
    ro.observe(cv);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [kind, seed, p, reduced]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };

  return (
    <div
      className="v2-plate"
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: reduced
          ? undefined
          : `perspective(1400px) rotateY(${tilt.x * 1.6}deg) rotateX(${-tilt.y * 1.1}deg)`,
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      {/* 읽는 중임을 보여주는 진행 게이지 */}
      <div className="v2-plate__gauge" aria-hidden="true">
        <span style={{ transform: `scaleX(${p})` }} />
      </div>
    </div>
  );
}

/* ── solution: 기계 도면 + 치수 검출 콜아웃 ─────────────── */
function drawDrawing(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, seed: number) {
  const r = rng(seed);
  const cx = w * 0.42;
  const cy = h * 0.52;
  const R = Math.min(w, h) * 0.3;

  // 본체 — 플랜지 단면
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.moveTo(cx + R * 0.58, cy);
  ctx.arc(cx, cy, R * 0.58, 0, Math.PI * 2);
  ctx.stroke();

  // 볼트 홀 8개
  ctx.strokeStyle = 'rgba(255,255,255,0.34)';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.19;
    const bx = cx + Math.cos(a) * R * 0.79;
    const by = cy + Math.sin(a) * R * 0.79;
    ctx.beginPath();
    ctx.arc(bx, by, R * 0.075, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 중심선
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.setLineDash([9, 5, 2, 5]);
  ctx.beginPath();
  ctx.moveTo(cx - R * 1.32, cy);
  ctx.lineTo(cx + R * 1.32, cy);
  ctx.moveTo(cx, cy - R * 1.32);
  ctx.lineTo(cx, cy + R * 1.32);
  ctx.stroke();
  ctx.setLineDash([]);

  // 검출된 치수 콜아웃 — 순차 등장이 이 그림의 요점
  const calls = [
    { a: -0.5, t: '⌀ 4320 ± 2' },
    { a: 0.62, t: 'R 128' },
    { a: 1.85, t: '8× ⌀ 24' },
    { a: 2.66, t: '12.5 H7' },
    { a: 3.72, t: '⌀ 2506' },
    { a: 4.9, t: '2.4 ▽▽' },
  ];
  calls.forEach((c, i) => {
    const seg = 1 / calls.length;
    const local = Math.min(1, Math.max(0, (p - i * seg * 0.85) / seg));
    if (local <= 0) return;

    const ax = cx + Math.cos(c.a) * R * (0.9 + r() * 0.12);
    const ay = cy + Math.sin(c.a) * R * (0.9 + r() * 0.12);
    const lead = R * 0.62 * local;
    const dir = Math.cos(c.a) >= 0 ? 1 : -1;
    const ex = ax + dir * lead;
    const ey = ay + Math.sin(c.a) * lead * 0.42;

    ctx.strokeStyle = `rgba(255,77,23,${0.55 + 0.45 * local})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ex, ey);
    ctx.lineTo(ex + dir * 26 * local, ey);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ax, ay, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = ACCENT;
    ctx.fill();

    if (local > 0.55) {
      ctx.globalAlpha = Math.min(1, (local - 0.55) / 0.45);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '500 11px ui-monospace, monospace';
      ctx.textAlign = dir > 0 ? 'left' : 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(c.t, ex + dir * (30 * local), ey - 4);
      ctx.globalAlpha = 1;
    }
  });

  // 스캔 라인 — 아직 읽고 있음을 표시
  if (p < 1) {
    const sy = h * p;
    const g = ctx.createLinearGradient(0, sy - 22, 0, sy + 22);
    g.addColorStop(0, 'rgba(255,77,23,0)');
    g.addColorStop(0.5, 'rgba(255,77,23,0.38)');
    g.addColorStop(1, 'rgba(255,77,23,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, sy - 22, w, 44);
  }
}

/* ── education: 블록 ↔ 파이썬 무손실 대응 ───────────────── */
function drawBlocks(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, seed: number) {
  const rows = [
    { block: 'repeat  10', code: 'for i in range(10):' },
    { block: '  move  50', code: '    move(50)' },
    { block: '  turn  90', code: '    turn(90)' },
    { block: 'if  touching', code: 'if touching():' },
    { block: '  say  "hi"', code: '    say("hi")' },
  ];
  const padX = Math.max(18, w * 0.045);
  const colW = Math.min(w * 0.36, 320);
  const rightX = w - padX - colW;
  const top = h * 0.2;
  const rowH = Math.min(46, (h * 0.58) / rows.length);

  rows.forEach((row, i) => {
    const seg = 1 / rows.length;
    const local = Math.min(1, Math.max(0, (p - i * seg * 0.8) / seg));
    if (local <= 0) return;
    const y = top + i * rowH;
    const indent = row.block.startsWith('  ') ? 16 : 0;

    // 블록
    ctx.globalAlpha = local;
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 1;
    const bx = padX + indent;
    const bw = colW - indent;
    ctx.beginPath();
    ctx.roundRect(bx, y, bw, rowH - 10, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.font = '500 11px ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(row.block.trim(), bx + 12, y + (rowH - 10) / 2);

    // 대응선 — 무손실을 시각적으로 주장하는 부분
    const lx1 = padX + colW + 8;
    const lx2 = rightX - 8;
    const my = y + (rowH - 10) / 2;
    ctx.strokeStyle = `rgba(255,77,23,${0.3 + 0.5 * local})`;
    ctx.beginPath();
    ctx.moveTo(lx1, my);
    ctx.bezierCurveTo(lx1 + (lx2 - lx1) * 0.5, my, lx1 + (lx2 - lx1) * 0.5, my, lx2, my);
    ctx.stroke();

    // 코드
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '400 11px ui-monospace, monospace';
    ctx.fillText(row.code, rightX + 4, my);
    ctx.globalAlpha = 1;
  });

  // 컬럼 라벨
  ctx.globalAlpha = Math.min(1, p * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.32)';
  ctx.font = '500 10px ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('BLOCK', padX, top - 14);
  ctx.fillText('PYTHON', rightX + 4, top - 14);
  ctx.textAlign = 'center';
  ctx.fillStyle = ACCENT;
  ctx.fillText('1 : 1', padX + colW + (rightX - padX - colW) / 2 + 4, top - 14);
  ctx.globalAlpha = 1;
}

/* ── platform: 서비스 노드 그래프 ────────────────────────── */
function drawNodes(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, seed: number) {
  const r = rng(seed);
  const hub = { x: w * 0.5, y: h * 0.5 };
  const N = 7;
  const nodes = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    const rad = Math.min(w, h) * (0.3 + r() * 0.08);
    return { x: hub.x + Math.cos(a) * rad * 1.35, y: hub.y + Math.sin(a) * rad };
  });

  // 연결선
  nodes.forEach((n, i) => {
    const seg = 1 / N;
    const local = Math.min(1, Math.max(0, (p - i * seg * 0.7) / seg));
    if (local <= 0) return;
    ctx.strokeStyle = `rgba(255,255,255,${0.1 + 0.16 * local})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hub.x, hub.y);
    ctx.lineTo(hub.x + (n.x - hub.x) * local, hub.y + (n.y - hub.y) * local);
    ctx.stroke();

    if (local > 0.7) {
      ctx.globalAlpha = (local - 0.7) / 0.3;
      ctx.strokeStyle = 'rgba(255,255,255,0.42)';
      ctx.beginPath();
      ctx.rect(n.x - 13, n.y - 9, 26, 18);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });

  // 허브
  ctx.globalAlpha = Math.min(1, p * 3);
  ctx.fillStyle = ACCENT;
  ctx.beginPath();
  ctx.rect(hub.x - 19, hub.y - 13, 38, 26);
  ctx.fill();
  ctx.globalAlpha = 1;

  // 데이터 패킷 — 살아 있음을 보여준다
  if (p >= 0.98) {
    const t = (Date.now() % 2400) / 2400;
    nodes.forEach((n, i) => {
      const ph = (t + i / N) % 1;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.arc(hub.x + (n.x - hub.x) * ph, hub.y + (n.y - hub.y) * ph, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
