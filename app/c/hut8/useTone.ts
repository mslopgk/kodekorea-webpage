'use client';

import { useEffect, useState } from 'react';

export type Tone = 'dark' | 'light';

/**
 * 섹션 단위 명암 반전에 맞춰 헤더 색을 자동 반전시킨다.
 * data-tone 속성이 붙은 섹션 중 헤더 아래를 지나는 것을 기준으로 삼는다.
 * 동시에 현재 활성 앵커도 계산해 네비 하이라이트에 쓴다.
 */
export function useTone(ids: readonly string[]) {
  const [tone, setTone] = useState<Tone>('dark');
  const [active, setActive] = useState('');

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const probe = 74;
      let next: Tone = 'dark';
      const sections = document.querySelectorAll<HTMLElement>('[data-tone]');
      sections.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          next = el.dataset.tone === 'light' ? 'light' : 'dark';
        }
      });
      setTone(next);

      let cur = '';
      const line = window.innerHeight * 0.42;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setActive(cur);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids]);

  return { tone, active };
}
