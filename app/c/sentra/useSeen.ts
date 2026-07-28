'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/lib/motion';

/**
 * useInView + 지오메트리 폴백.
 *
 * 이 페이지의 모든 문구는 등장 모션 뒤에 숨어 있다(reveal은 clip-path, Scr은
 * opacity 0). 그 트리거가 IntersectionObserver 하나뿐이면, 콜백이 배달되지
 * 않는 상황에서 화면에 텍스처만 남고 문구가 전부 사라진다.
 * 대표적으로 백그라운드 탭에서 열린 경우(Ctrl+클릭, 세션 복원)와 IO를 쓸 수
 * 없는 환경이 그렇다. Scr의 3초 안전장치는 inView가 true가 된 뒤에야 시작하므로
 * 이 경우를 막지 못한다.
 *
 * 그래서 마운트 후 일정 시간이 지나도 inView가 false면 rect로 직접 판정한다.
 * (레이아웃은 탭이 숨어 있어도 계산되므로 rect는 신뢰할 수 있다)
 * 첫 화면 밖의 요소는 폴백하지 않으므로 스크롤 등장 연출은 그대로 유지된다.
 */
export function useSeen<T extends HTMLElement>(options: IntersectionObserverInit) {
  const { ref, inView } = useInView<T>(options);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (inView || fallback) return;
    const id = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // 첫 화면에 걸쳐 있는데도 아직 트리거되지 않았다면 직접 열어준다
      if (r.bottom > 0 && r.top < window.innerHeight) setFallback(true);
    }, 1200);
    return () => clearTimeout(id);
  }, [inView, fallback, ref]);

  return { ref, seen: inView || fallback };
}
