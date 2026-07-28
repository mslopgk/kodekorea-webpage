'use client';

import {
  createElement,
  useEffect,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { useInView } from '@/lib/motion';

type Props = {
  as?: ElementType;
  className?: string;
  /** 스태거용 지연(ms) */
  delay?: number;
  style?: CSSProperties;
  id?: string;
  children: ReactNode;
};

/**
 * 뷰포트 진입 시 .is-in 을 붙인다.
 * - 모션 축소 시 useInView가 즉시 true를 준다.
 * - 마운트 시점에 이미 화면 위쪽을 지난 요소는 바로 최종 상태로 고정한다.
 *   (페이지 중간에서 새로고침·앵커 진입했을 때 위쪽 콘텐츠가 투명하게 남는 것을 막는다)
 */
export default function Reveal({ as = 'div', className = '', delay = 0, style, id, children }: Props) {
  const { ref, inView } = useInView<HTMLElement>();
  const [already, setAlready] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) setAlready(true);
  }, [ref]);

  const on = inView || already;

  return createElement(
    as,
    {
      ref,
      id,
      className: `h8-rev${on ? ' is-in' : ''}${className ? ' ' + className : ''}`,
      style: { ...(style ?? {}), '--d': `${delay}ms` } as CSSProperties,
    },
    children
  );
}
