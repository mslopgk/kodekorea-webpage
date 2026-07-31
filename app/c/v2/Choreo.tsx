'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * 스크롤 안무.
 *
 * 지난 시도가 실패한 이유를 피해서 설계했다.
 * · 실패했던 것: 도면 그림을 스크롤에 묶어 "읽는 동안 미완성"으로 남겼다
 * · 이번 것: **영상 프레임만** 스크롤에 물린다. 콘텐츠는 늘 완성 상태로 읽히고,
 *   움직이는 것은 영상의 화각뿐이다.
 *
 * 무브는 셋으로 제한했다 (레시피북 기준):
 *   ① 2트랙 디커플드 켄번즈 — 프레임과 영상이 다른 속도로 스케일 → 프레임 안에서 숨쉼
 *   ② 카운터 드리프트 — 영상이 커질 때 제목은 반대로 살짝 밀려 깊이감
 *   ③ Lenis 스무스 스크롤 — 전체 체감을 올리는 가장 값싼 수단
 *
 */
export function Choreo() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 모션 축소: 스크럽을 아예 걸지 않는다. 콘텐츠는 그대로 다 보인다.
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    // ── Lenis : 있으면 쓰고, 없으면 네이티브 스크롤로 조용히 넘어간다 ──
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let tickerFn: ((t: number) => void) | null = null;

    const ctx = gsap.context(() => {
      // ① 2트랙 디커플드 켄번즈 — 프레임과 영상이 서로 다른 속도
      document.querySelectorAll<HTMLElement>('.v2-shot--motion').forEach((frame) => {
        const media = frame.querySelector<HTMLElement>('video, img');
        if (!media) return;

        gsap.fromTo(
          frame,
          { scale: 1 },
          {
            scale: 1.06,
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
        // 안쪽은 더 천천히 + 살짝 아래로 → 프레임 안에서 시차가 생긴다
        gsap.fromTo(
          media,
          { scale: 1.14, yPercent: -4 },
          {
            scale: 1.02,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });

      // ② 카운터 드리프트 — 영상이 커질 때 제목은 반대로
      document.querySelectorAll<HTMLElement>('.v2-evidence').forEach((sec) => {
        const head = sec.querySelector<HTMLElement>('.v2-evi__head');
        if (!head) return;
        gsap.to(head, {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    });

    (async () => {
      try {
        const mod = await import('lenis');
        const Lenis = mod.default;
        const inst = new Lenis({ lerp: 0.11, smoothWheel: true });
        inst.on('scroll', ScrollTrigger.update);
        tickerFn = (t: number) => inst.raf(t * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
        lenis = inst;
      } catch {
        /* 네이티브 스크롤로 진행 — ScrollTrigger는 그대로 동작한다 */
      }
    })();

    return () => {
      ctx.revert();
      if (tickerFn) gsap.ticker.remove(tickerFn);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
