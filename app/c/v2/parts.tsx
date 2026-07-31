'use client';

import { useEffect, useRef, useState } from 'react';
import { useCountUp, useReducedMotion } from '@/lib/motion';

/** 옵션 객체를 모듈 상수로 고정 — 렌더마다 옵저버가 재생성되는 것을 막는다 */
const IO_OPTS: IntersectionObserverInit = { threshold: 0.15, rootMargin: '0px 0px -8% 0px' };

/**
 * 등장 트리거.
 *
 * 1차 시안에서 발견된 문제를 두 가지 방식으로 막는다.
 * · 모션 축소 시 즉시 공개
 * · IntersectionObserver 콜백이 배달되지 않는 경우(백그라운드 탭, 스크롤 점프,
 *   앵커 이동)를 대비해 지오메트리 기반 폴백을 둔다. 1차 시안 B에서 스크롤을
 *   점프했을 때 텍스트 63개가 opacity 0으로 남던 버그가 이 때문이었다.
 */
export function useSeen<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setSeen(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setSeen(true);
    };

    // 이미 화면에 걸쳐 있으면 즉시 공개 (스크롤 점프·앵커 이동 대응)
    const checkGeometry = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) reveal();
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((entries) => {
            for (const e of entries) if (e.isIntersecting) reveal();
          }, IO_OPTS)
        : null;
    io?.observe(el);

    checkGeometry();
    window.addEventListener('scroll', checkGeometry, { passive: true });
    window.addEventListener('resize', checkGeometry);
    // 옵저버가 끝내 발화하지 않는 환경을 위한 최종 안전장치
    const bail = setTimeout(reveal, 2500);

    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', checkGeometry);
      window.removeEventListener('resize', checkGeometry);
      clearTimeout(bail);
    };
  }, [reduced]);

  return { ref, seen };
}

/**
 * 요소가 뷰포트를 통과하는 동안의 0→1 진행률.
 * 스크롤 "양"만 쓰고 속도에는 의존하지 않는다.
 */
export function useViewProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [p, setP] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setP(1);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 요소 상단이 화면 하단에 닿을 때 0, 요소 하단이 화면 상단 60%에 닿을 때 1
      const span = r.height + vh * 0.6;
      const travelled = vh - r.top;
      setP(Math.min(1, Math.max(0, travelled / span)));
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
  }, [reduced]);

  return { ref, p };
}

/** 전체 문서 스크롤 진행률 — 우측 레일 표시용 */
export function useDocProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max)));
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
  }, []);
  return p;
}

/** 위로 올라오며 페이드 */
export function Rev({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'p' | 'h2' | 'h3' | 'li' | 'span' | 'article';
  className?: string;
}) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={`v2-rev ${className}`}
      data-in={seen}
      style={{ ['--d' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/**
 * 좌→우 마스크 와이프.
 * 한글은 랜덤 문자 스크램블을 쓰지 않는다 — 1차 시안 B에서 한글 헤드라인이
 * 디코드 구간 내내 빈 화면으로 남는 문제가 있었다.
 */
export function Wipe({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, seen } = useSeen<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={`v2-wipe ${className}`}
      data-in={seen}
      style={{ ['--d' as string]: `${delay}ms`, display: 'inline-block' }}
    >
      {children}
    </span>
  );
}

/** 숫자만 카운트업 — `13,022` 같은 서식을 보존한다 */
export function BigNumber({ value, unit, caption }: { value: string; unit: string; caption: string }) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  const numeric = Number(value.replace(/[^0-9.]/g, ''));
  const countable = Number.isFinite(numeric) && numeric > 0 && /^[\d,]+$/.test(value);
  const n = useCountUp(countable ? numeric : 0, seen);
  const shown = countable ? Math.round(n).toLocaleString('ko-KR') : value;

  return (
    <div className="v2-bignum" ref={ref} data-in={seen}>
      <span className="v2-bignum__v">{shown}</span>
      {unit ? <span className="v2-bignum__u">{unit}</span> : null}
      <span className="v2-bignum__cap">{caption}</span>
    </div>
  );
}
