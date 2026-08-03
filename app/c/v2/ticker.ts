'use client';

/**
 * 페이지 전체가 공유하는 단일 requestAnimationFrame 루프.
 *
 * 상시 구동 요소가 수십 개라서 위젯마다 루프를 돌리면 메인 스레드가 죽는다.
 * 구독자 집합 하나 + rAF 하나로 묶고, 구독자가 0이면 루프 자체를 멈춘다.
 * 탭이 백그라운드면 프레임을 배달하지 않는다 — 보이지 않는 것을 계산하지 않는다.
 */

type Sub = (t: number) => void;

const subs = new Set<Sub>();
let raf = 0;
let hidden = false;

function loop(t: number) {
  raf = 0;
  if (!hidden) for (const fn of subs) fn(t);
  if (subs.size) raf = requestAnimationFrame(loop);
}

export function subscribe(fn: Sub): () => void {
  subs.add(fn);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    subs.delete(fn);
    if (!subs.size && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
  });
}
