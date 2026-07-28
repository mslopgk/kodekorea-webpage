'use client';

import { useClock } from './lib';

/** 계기판 디테일 — 실시간 시계 */
export default function Clock({ className }: { className?: string }) {
  const t = useClock();
  return (
    <span className={className ? `hle-clock ${className}` : 'hle-clock'} suppressHydrationWarning>
      {t ?? '-- : -- : --'}
    </span>
  );
}
