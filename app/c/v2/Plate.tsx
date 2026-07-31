'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { useSeen } from './parts';

/**
 * 증거 전시 — 카드 갤러리를 대신하는 Work 표현.
 *
 * 그림은 **그 프로젝트가 실제로 하는 일**을 그린다. 장식이 아니다.
 * 자료 회신본 반영으로 사업축이 바뀌었으므로 그림도 함께 교체했다.
 * (이전의 기계 도면은 계약 근거가 없는 제조 AI 영역이라 삭제)
 *
 *   public   → 16개 구·군 진단 격자 + 영역별 판정 핀
 *   education → 발주기관 직인 실적증명원 6종
 *   platform  → 거점 사이트 4개 노드 그래프
 */
type Kind = 'public' | 'education' | 'platform';

const ACCENT = '#ff4d17';

export function Plate({ kind, seed = 7 }: { kind: Kind; seed?: number }) {
  const { ref: wrapRef, seen } = useSeen<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let start: number | null = null;
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

      // 배경 격자
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 34) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      for (let y = 0; y <= h; y += 34) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }
      ctx.stroke();

      if (kind === 'public') drawDistricts(ctx, w, h, progress);
      else if (kind === 'education') drawCerts(ctx, w, h, progress);
      else drawSites(ctx, w, h, progress);
    };

    if (reduced) {
      draw(1);
      ro = new ResizeObserver(() => draw(1));
      ro.observe(cv);
      return () => ro?.disconnect();
    }

    if (!seen) {
      draw(0);
      return;
    }

    // 화면에 들어오면 한 번 재생하고 완성 상태로 남는다.
    // (스크롤에 묶었던 버전은 읽는 동안 미완성으로 남아 되돌렸다)
    const DUR = 2400;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / DUR);
      draw(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    ro = new ResizeObserver(() => draw(1));
    ro.observe(cv);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [kind, seed, seen, reduced]);

  return (
    <div className="v2-plate" ref={wrapRef}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

const mono = (px: number, weight = 500) => `${weight} ${px}px ui-monospace, monospace`;

/* ── public: 16개 구·군 × 8개 진단영역 ─────────────────── */
function drawDistricts(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cols = 4;
  const rows = 4;
  const pad = Math.max(28, w * 0.07);
  const gw = w - pad * 2;
  const gh = h - pad * 2;
  const cw = gw / cols;
  const ch = gh / rows;

  for (let i = 0; i < 16; i++) {
    const seg = 1 / 16;
    const local = Math.min(1, Math.max(0, (p - i * seg * 0.75) / seg));
    if (local <= 0) continue;

    const gx = i % cols;
    const gy = Math.floor(i / cols);
    const x = pad + gx * cw;
    const y = pad + gy * ch;
    const inset = 5;

    ctx.globalAlpha = local;
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + inset, y + inset, cw - inset * 2, ch - inset * 2);

    // 각 구·군마다 8개 진단영역 막대 — 채워지는 정도가 진단 결과
    const barW = (cw - inset * 2 - 16) / 8;
    for (let b = 0; b < 8; b++) {
      const seed = (i * 8 + b) * 2654435761;
      const level = 0.3 + (((seed >>> 8) % 100) / 100) * 0.65;
      const bh = (ch - inset * 2 - 26) * level * local;
      const bx = x + inset + 8 + b * barW;
      const by = y + ch - inset - 12 - bh;
      ctx.fillStyle = b % 3 === 0 ? 'rgba(255,77,23,0.72)' : 'rgba(255,255,255,0.3)';
      ctx.fillRect(bx, by, Math.max(1.5, barW - 2), bh);
    }

    // 구·군 번호
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = mono(9);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(String(i + 1).padStart(2, '0'), x + inset + 6, y + inset + 5);
    ctx.globalAlpha = 1;
  }

  // 진행 중임을 알리는 시범 대상지 표시 (1차년도 부산진구)
  if (p > 0.85) {
    ctx.globalAlpha = (p - 0.85) / 0.15;
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(pad + 5, pad + 5, cw - 10, ch - 10);
    ctx.globalAlpha = 1;
  }
}

/* ── education: 직인 찍힌 실적증명원 6종 ──────────────── */
function drawCerts(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const n = 6;
  const cols = w < 620 ? 2 : 3;
  const rows = Math.ceil(n / cols);
  const pad = Math.max(26, w * 0.06);
  const cw = (w - pad * 2) / cols;
  const ch = (h - pad * 2) / rows;

  for (let i = 0; i < n; i++) {
    const seg = 1 / n;
    const local = Math.min(1, Math.max(0, (p - i * seg * 0.8) / seg));
    if (local <= 0) continue;

    const x = pad + (i % cols) * cw;
    const y = pad + Math.floor(i / cols) * ch;
    const iw = cw - 18;
    const ih = ch - 18;

    ctx.globalAlpha = local;
    // 문서
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x + 9, y + 9, iw, ih);
    ctx.fill();
    ctx.stroke();

    // 본문 줄
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    const lines = Math.max(3, Math.floor(ih / 15) - 3);
    for (let l = 0; l < lines; l++) {
      const ly = y + 30 + l * 13;
      if (ly > y + ih - 22) break;
      const lw = (iw - 34) * (l % 3 === 2 ? 0.55 : 0.86);
      ctx.beginPath();
      ctx.moveTo(x + 21, ly);
      ctx.lineTo(x + 21 + lw, ly);
      ctx.stroke();
    }

    // 직인 — 이 그림의 요점
    if (local > 0.55) {
      const sa = Math.min(1, (local - 0.55) / 0.45);
      const sx = x + 9 + iw - 30;
      const sy = y + 9 + ih - 30;
      ctx.globalAlpha = local * sa;
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(sx, sy, 15 * (0.72 + 0.28 * sa), 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 11 * (0.72 + 0.28 * sa), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.globalAlpha = 1;
  }
}

/* ── platform: 거점 사이트 4개 노드 ───────────────────── */
function drawSites(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const hub = { x: w * 0.5, y: h * 0.5 };
  const n = 4;
  const rad = Math.min(w, h) * 0.3;
  const nodes = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: hub.x + Math.cos(a) * rad * 1.5, y: hub.y + Math.sin(a) * rad, live: i === 0 };
  });

  nodes.forEach((node, i) => {
    const seg = 1 / n;
    const local = Math.min(1, Math.max(0, (p - i * seg * 0.7) / seg));
    if (local <= 0) return;

    ctx.strokeStyle = `rgba(255,255,255,${0.12 + 0.2 * local})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hub.x, hub.y);
    ctx.lineTo(hub.x + (node.x - hub.x) * local, hub.y + (node.y - hub.y) * local);
    ctx.stroke();

    if (local > 0.65) {
      const a = (local - 0.65) / 0.35;
      ctx.globalAlpha = a;
      // 운영 중인 사이트만 채운다
      if (node.live) {
        ctx.fillStyle = 'rgba(255,77,23,0.85)';
        ctx.fillRect(node.x - 22, node.y - 14, 44, 28);
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 1;
        ctx.strokeRect(node.x - 22, node.y - 14, 44, 28);
      }
      ctx.fillStyle = node.live ? '#fff' : 'rgba(255,255,255,0.55)';
      ctx.font = mono(9);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.live ? 'LIVE' : 'WIP', node.x, node.y);
      ctx.globalAlpha = 1;
    }
  });

  // 공통 디자인 시스템 = 허브
  ctx.globalAlpha = Math.min(1, p * 3);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(hub.x - 30, hub.y - 18, 60, 36);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = mono(9);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SYSTEM', hub.x, hub.y);
  ctx.globalAlpha = 1;
}
