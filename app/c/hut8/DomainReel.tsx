'use client';

import { company, domains } from '@/content/site';
import { useReducedMotion } from '@/lib/motion';

/** 가나다순 정렬 — 원본(hut8)의 알파벳순 무한 리스트에 대응 */
const SORTED = [...domains].sort((a, b) => a.localeCompare(b, 'ko'));

function Row({ d, i }: { d: string; i: number }) {
  return (
    <div className="h8-dom__row">
      <em>{String(i + 1).padStart(2, '0')}</em>
      <span>{d}</span>
    </div>
  );
}

function Headline() {
  return (
    <>
      <div>
        <h2 className="h8-ko">{company.tagline}</h2>
        <p className="h8-mono">{company.taglineEn}</p>
      </div>
      <div>
        <p className="h8-dom__desc">{company.headlineSub}</p>
      </div>
    </>
  );
}

export default function DomainReel() {
  const reduced = useReducedMotion();

  // 모션 축소: 무한 스크롤 대신 16개 전량을 정적 그리드로 노출한다
  if (reduced) {
    return (
      <div className="h8-shell">
        <div className="h8-dom__over h8-dom__over--static">
          <Headline />
        </div>
        <ul className="h8-dom__grid">
          {SORTED.map((d, i) => (
            <li key={d}>
              <em className="h8-mono">{String(i + 1).padStart(2, '0')}</em>
              {d}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="h8-dom__stage">
      <div className="h8-dom__viewport" aria-hidden="true">
        <div className="h8-dom__reel">
          {SORTED.map((d, i) => (
            <Row key={d} d={d} i={i} />
          ))}
          {SORTED.map((d, i) => (
            <Row key={`${d}-loop`} d={d} i={i} />
          ))}
        </div>
      </div>

      {/* 흐르는 리스트는 장식이므로 보조기기용 정적 목록을 함께 둔다 */}
      <ul className="h8-sr">
        {SORTED.map((d) => (
          <li key={`sr-${d}`}>{d}</li>
        ))}
      </ul>

      <div className="h8-dom__fixed">
        <div className="h8-dom__hair" />
        <div className="h8-dom__over h8-shell">
          <Headline />
        </div>
      </div>
    </div>
  );
}
