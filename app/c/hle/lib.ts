'use client';

import { useEffect, useState, type CSSProperties } from 'react';

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** a~b 구간을 0~1로 정규화 */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smooth = (t: number) => t * t * (3 - 2 * t);

/** CSS 커스텀 프로퍼티를 타입 오류 없이 style 객체에 넣기 위한 헬퍼 */
export const vars = (o: Record<string, string | number>) => o as CSSProperties;

/**
 * 뷰포트 실측. 스크린 면을 뷰포트와 정확히 같은 비율로 만들기 위해 필요하다.
 * 폭은 innerWidth가 아니라 clientWidth를 쓴다 — innerWidth는 세로 스크롤바를 포함하므로
 * 그 값으로 스크린을 만들면 진입 완료 시 화면이 스크롤바 폭의 절반만큼 왼쪽으로 밀린다.
 */
export function useViewport() {
  const [vp, setVp] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const read = () =>
      setVp({
        w: document.documentElement.clientWidth || window.innerWidth,
        h: window.innerHeight,
      });
    read();
    window.addEventListener('resize', read);
    window.addEventListener('orientationchange', read);
    return () => {
      window.removeEventListener('resize', read);
      window.removeEventListener('orientationchange', read);
    };
  }, []);

  return vp;
}

/** 실시간 시계. 서버 렌더 시점에는 자리표시자만 두어 하이드레이션 불일치를 막는다. */
export function useClock() {
  const [t, setT] = useState<string | null>(null);

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const read = () => {
      const d = new Date();
      setT(`${pad(d.getHours())} : ${pad(d.getMinutes())} : ${pad(d.getSeconds())}`);
    };
    read();
    const id = window.setInterval(read, 1000);
    return () => window.clearInterval(id);
  }, []);

  return t;
}

/** '13,022' 처럼 순수 숫자인 지표만 카운트업 대상으로 잡는다. ('56/56', '1:1' 등은 제외) */
export function numericMetric(value: string): number | null {
  return /^\d[\d,]*$/.test(value) ? Number(value.replace(/,/g, '')) : null;
}

/** 그리드 피치 — 배경 그리드와 스네이크 궤적이 같은 격자를 쓰도록 공유한다. */
export const CELL = 48;
