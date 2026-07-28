'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { useScramble } from '@/lib/text';
import s from './sentra.module.css';
import { useSeen } from './useSeen';
import { cx, delayVar, hasHangul } from './util';

/**
 * useInView는 options를 의존성으로 쓴다. 인라인 객체를 넘기면 렌더마다 참조가
 * 바뀌어 IntersectionObserver가 매 렌더 재생성된다(Scr은 스크램블 프레임마다
 * 리렌더된다). 모듈 상수로 고정해 옵저버를 한 번만 만든다.
 */
const IN_VIEW = { threshold: 0.05 } as const;

/** 스태거용 지연. 모션 축소 시 지연 없이 즉시 활성화. */
function useDelayed(active: boolean, ms: number): boolean {
  const reduced = useReducedMotion();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reduced) {
      setOn(true);
      return;
    }
    if (!active) return;
    if (ms <= 0) {
      setOn(true);
      return;
    }
    const id = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(id);
  }, [active, ms, reduced]);

  return on;
}

type ScrProps = {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  block?: boolean;
};

/**
 * 이 컨셉의 기본 등장 모션 — 글자 스크램블 디코드.
 * 실제 텍스트는 항상 DOM에 남겨(스크린리더용) 투명도로만 감추고,
 * 스크램블 중인 문자열은 aria-hidden 오버레이로 겹쳐 그린다.
 * → 레이아웃 점프 없음 + 접근성 유지.
 *
 * 한글이 섞인 문구는 스크램블하지 않는다. useScramble이 미확정 한글을 ''로
 * 비우기 때문에, 한글 문구를 스크램블에 태우면 디코드가 끝날 때까지 화면에
 * 아무것도 남지 않고(실제 텍스트는 opacity 0) 마지막에 툭 나타난다.
 * 대신 실제 텍스트를 그대로 두고 좌→우 마스크 와이프로 공개한다.
 */
export function Scr({ text, delay = 0, speed, className, block }: ScrProps) {
  const wipe = hasHangul(text);
  const { ref, seen } = useSeen<HTMLSpanElement>(IN_VIEW);
  const active = useDelayed(seen, delay);
  const out = useScramble(text, active && !wipe, speed);

  // 안전장치: 활성화 후 디코드가 끝나지 않아도 텍스트는 반드시 드러난다
  const [bail, setBail] = useState(false);
  useEffect(() => {
    if (!active || wipe) return;
    const id = setTimeout(() => setBail(true), 3000);
    return () => clearTimeout(id);
  }, [active, wipe]);

  if (wipe) {
    return (
      <span
        ref={ref}
        className={cx(s.scr, s.scrWipe, block && s.scrBlock, className)}
        data-done={active}
      >
        <span className={s.scrReal}>{text}</span>
      </span>
    );
  }

  const done = out === text || bail;

  return (
    <span ref={ref} className={cx(s.scr, block && s.scrBlock, className)} data-done={done}>
      <span className={s.scrReal}>{text}</span>
      {!done && (
        <span aria-hidden className={s.scrGhost}>
          {out}
        </span>
      )}
    </span>
  );
}

/** 한글 본문용 마스크 와이프. 스크램블은 영문·숫자·라벨에만 쓴다. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, seen } = useSeen<HTMLDivElement>(IN_VIEW);
  return (
    <div
      ref={ref}
      className={cx(s.reveal, className)}
      data-in={seen}
      style={delayVar(delay)}
    >
      {children}
    </div>
  );
}
