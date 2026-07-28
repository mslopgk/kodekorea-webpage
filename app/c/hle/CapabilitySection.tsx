'use client';

import { useId, useState } from 'react';
import { capability, nav } from '@/content/site';
import Clock from './Clock';

/** 운영 역량 — 892px 폭 아코디언(+/− 토글, 1px 하드라인) + 우상단 실시간 시계 */
export default function CapabilitySection() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="capability" className="hle-sec hle-sec--lg" style={{ scrollMarginTop: 96 }}>
      <div className="hle-col">
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <p className="hle-eyebrow">
            <i className="hle-sq hle-sq--on" />
            03 / {nav[2].labelEn}
          </p>
          <Clock />
        </div>

        <h2 className="hle-h2 tight-ko" style={{ marginTop: 24 }}>
          {capability.labelKo}
        </h2>
        <p className="hle-lead tight-ko" style={{ marginTop: 28, maxWidth: '52ch' }}>
          {capability.body}
        </p>

        <div className="hle-acc">
          {capability.items.map((item, i) => {
            const expanded = open === i;
            const panelId = `${base}-p${i}`;
            const btnId = `${base}-b${i}`;
            return (
              <div key={item.title} className="hle-acc-item">
                <button
                  type="button"
                  id={btnId}
                  className="hle-acc-btn"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : i)}
                >
                  <span className="hle-acc-idx">{String(i + 1).padStart(2, '0')}</span>
                  <span className="tight-ko">{item.title}</span>
                  <span className="hle-acc-metric mono">{item.metric}</span>
                  <span className="hle-acc-pm" aria-hidden />
                </button>
                {/* 접힌 패널은 grid-template-rows: 0fr 로 시각적으로만 잘려 있어서
                    aria-expanded=false 인데도 본문이 접근성 트리·찾기 기능에 그대로 남는다.
                    inert + aria-hidden으로 닫힌 동안 실제로 비활성화한다. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  aria-hidden={!expanded}
                  inert={!expanded}
                  className={expanded ? 'hle-acc-panel hle-acc-panel--open' : 'hle-acc-panel'}
                >
                  <div>
                    <p className="tight-ko">{item.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
