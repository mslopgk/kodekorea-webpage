'use client';

/**
 * 컨셉 D 공용 조각 — 인라인 CSS 변수 타입, 글자 단위 리빌,
 * 레트로 3D 압출 타이포, 카운트업 메트릭.
 *
 * 문구는 전부 호출부에서 @/content/site 값을 받아 넘긴다.
 */

import { useCountUp, useInView } from '@/lib/motion';

/** 인라인 CSS 커스텀 프로퍼티용 */
export type Vars = React.CSSProperties & Record<string, string | number>;

/* ── 글자 단위 리빌 (회색 → 밝게, 블러 해제) ─────────────── */
export function CharReveal({
  text,
  delay = 0,
  step = 32,
  className,
}: {
  text: string;
  delay?: number;
  step?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {[...text].map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="rb-char"
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

/* ── 3D 압출 레트로 타이포 ────────────────────────────────
   뒤 레이어: 다중 text-shadow로 압출면
   앞 레이어: 하프톤 도트 + 옐로→레드 그라디언트를 글자에 클립  */
export function RetroType({ children, small }: { children: string; small?: boolean }) {
  return (
    <span className={`rb-retro${small ? ' rb-retro-sm' : ''}`}>
      <span className="rb-retro-back" aria-hidden="true">
        {children}
      </span>
      <span className="rb-retro-front">{children}</span>
    </span>
  );
}

/* ── 메트릭 카운트업 ──────────────────────────────────────
   '13,022' → 13022까지 카운트, '56/56' → 56까지 카운트 후 원문 복원,
   '$39 → $0' 처럼 숫자로 시작하지 않으면 정적 표시. */
function parseLeadingNumber(raw: string): { n: number; tail: string; grouped: boolean } | null {
  const m = /^(\d[\d,]*)/.exec(raw);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ''));
  if (!Number.isFinite(n)) return null;
  return { n, tail: raw.slice(m[1].length), grouped: m[1].includes(',') };
}

export function Metric({ value, unit, label }: { value: string; unit: string; label: string }) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.4 });
  const parsed = parseLeadingNumber(value);
  const live = useCountUp(parsed ? parsed.n : 0, inView, 1500);
  const shown = parsed
    ? `${parsed.grouped ? Math.round(live).toLocaleString('en-US') : String(Math.round(live))}${parsed.tail}`
    : value;

  return (
    <li className="rb-metric" ref={ref}>
      <span className="rb-metric-v">
        {shown}
        {unit ? <i>{unit}</i> : null}
      </span>
      <span className="rb-metric-l">{label}</span>
    </li>
  );
}
