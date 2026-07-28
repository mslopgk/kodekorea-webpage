'use client';

import s from './sentra.module.css';
import { useSeen } from './useSeen';
import { cx, delayVar } from './util';

/** 렌더마다 새 객체를 넘기면 IntersectionObserver가 매 렌더 재생성된다 */
const IN_VIEW = { threshold: 0.08 } as const;

type Props = {
  children: React.ReactNode;
  /** 컬럼별 스태거 지연(ms) */
  delay?: number;
  className?: string;
  /** 카드 표면 없이 선만 쓰는 변형 */
  plain?: boolean;
};

/**
 * 벤토 카드 — 얇은 세로 선에서 좌우로 펼쳐지며 등장(scaleX 0→1, origin center).
 * 표면(skin)만 스케일해서 내부 텍스트가 찌그러지지 않게 한다.
 */
export function Card({ children, delay = 0, className, plain }: Props) {
  const { ref, seen } = useSeen<HTMLDivElement>(IN_VIEW);
  return (
    <div
      ref={ref}
      className={cx(s.card, plain && s.cardPlain, className)}
      style={delayVar(delay)}
      data-in={seen}
    >
      <span className={s.cardSkin} aria-hidden />
      <span className={s.cardSeam} aria-hidden />
      <span className={s.cardTick} aria-hidden>
        +
      </span>
      <div className={s.cardBody}>{children}</div>
    </div>
  );
}
