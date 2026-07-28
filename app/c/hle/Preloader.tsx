'use client';

import { useEffect, useState } from 'react';
import { company, domains } from '@/content/site';
import { useReducedMotion } from '@/lib/motion';
import { useTypewriter } from '@/lib/text';
import Clock from './Clock';

// 레퍼런스 #03은 20초 이상 걸려 이탈을 유발했다 → 스펙상 하드 상한 3초.
// 상한은 프리로더가 완전히 사라지는 시점 기준이므로 슬라이드 아웃 시간까지 합쳐 3초를 넘지 않아야 한다.
// (2400 + 780 = 3180ms 로 상한을 넘고 있었다.)
const OUT_MS = 780;
const HOLD_MS = 2150; // 2150 + 780 = 2930ms < 3000ms

/** 로딩을 콘텐츠로. 마지막 줄(다루는 기술 영역)만 계속 바꿔가며 타이핑한다. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(false);
  const typed = useTypewriter(domains, !reduced && !out, { typeMs: 55, holdMs: 620 });

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    const id = window.setTimeout(() => setOut(true), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [reduced, onDone]);

  useEffect(() => {
    if (!out) return;
    const id = window.setTimeout(onDone, OUT_MS);
    return () => window.clearTimeout(id);
  }, [out, onDone]);

  if (reduced) return null;

  return (
    <div className={out ? 'hle-pre hle-pre--out' : 'hle-pre'} aria-hidden>
      <div className="hle-pre-row">
        <span>
          {company.nameEn} / {company.domain}
        </span>
        <Clock />
      </div>

      <div className="hle-pre-mid">
        <p className="hle-pre-l1">{company.tagline}</p>
        <p className="hle-pre-l2 tight-ko">
          {typed}
          <i className="hle-caret" />
        </p>
      </div>

      <div>
        <div className="hle-pre-bar">
          <i />
        </div>
        <div className="hle-pre-row" style={{ marginTop: 12 }}>
          <span>{company.baseEn}</span>
          <span>{company.taglineEn}</span>
        </div>
      </div>
    </div>
  );
}
