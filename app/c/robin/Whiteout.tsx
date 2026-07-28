'use client';

/**
 * 막 전환 화이트아웃 — 스크롤이 이 100vh 구간을 지나는 동안
 * 백색 구가 중앙에서 팽창해 화면을 삼킨 뒤(전반) 다시 수축하며
 * 다음 막 팔레트를 열어준다(후반).
 *
 * 모션 축소 시에는 구가 뜨지 않고, 구간 자체의 배경 그라디언트
 * (from → 백색 → to)가 팔레트 전환을 대신한다.
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import type { Vars } from './parts';

/**
 * 이 구간이 화면을 통과하는 정도(0~1).
 *
 * lib/motion 의 useScrollProgress 를 쓰면 안 된다:
 * 그쪽은 분모가 `요소 높이 - 뷰포트 높이`인데 이 구간은 정확히 100vh 라서
 * 분모가 0 → 항상 0을 돌려준다(= 구가 영영 뜨지 않는다).
 * 그래서 "요소가 화면을 지나가는 구간"을 직접 계산한다.
 *   0   = 구간 상단이 화면 하단에 닿는 순간
 *   0.5 = 구간이 화면을 정확히 채운 순간 (배경 그라디언트의 백색이 화면 중앙)
 *   1   = 구간 하단이 화면 상단을 벗어나는 순간
 */
function useCrossing<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T | null>(null);
  const [cross, setCross] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCross(0);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = vh + rect.height;
      if (span <= 0) return;
      setCross(Math.min(1, Math.max(0, (vh - rect.top) / span)));
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
  }, [enabled]);

  return { ref, cross };
}

export default function Whiteout({
  from,
  to,
  actIndex,
}: {
  from: string;
  to: string;
  /** 이 구간의 중앙이 화면 중앙을 지나는 순간 진입하는 막 번호 */
  actIndex: number;
}) {
  const reduced = useReducedMotion();
  const { ref, cross } = useCrossing<HTMLDivElement>(!reduced);

  /* 구가 사는 구간을 가운데 절반으로 압축한다.
     → cross 0.25~0.75(= 구간이 화면 중앙 밴드를 지나는 동안)에만 팽창·수축하므로
       구간 길이를 늘리지 않고도 전환이 또렷하다. */
  const t = Math.min(1, Math.max(0, (cross - 0.25) / 0.5));
  const bell = 1 - Math.abs(t * 2 - 1); // 0 → 1 → 0
  const scale = Math.min(1.02, bell * 1.55);

  return (
    <div
      ref={ref}
      className="rb-whiteout"
      aria-hidden="true"
      style={{
        background: `linear-gradient(180deg, ${from} 0%, ${from} 30%, #ffffff 50%, ${to} 70%, ${to} 100%)`,
      }}
    >
      {/* 막 번호 전환 지점 — 구간의 정중앙(= 백색 피크)에 두어야
          고정 UI 의 막 라벨이 화면이 하얗게 덮인 순간에 바뀐다.
          구간 전체에 data-act-index 를 달면 구간에 "진입하는" 순간
          (아직 이전 막 팔레트일 때) 라벨이 먼저 바뀌어 버린다. */}
      <i className="rb-whiteout-mark" data-act-index={actIndex} />

      {scale > 0.001 ? (
        <div className="rb-whiteout-fixed">
          <div className="rb-whiteout-orb" style={{ '--s': scale } as Vars} />
        </div>
      ) : null}
    </div>
  );
}
