'use client';

import { nav, pillars } from '@/content/site';
import { useCountUp, useInView } from '@/lib/motion';
import { numericMetric } from './lib';

type Pillar = (typeof pillars)[number];
type MetricItem = Pillar['project']['metrics'][number];

function Metric({ m, active }: { m: MetricItem; active: boolean }) {
  const target = numericMetric(m.value);
  const counted = useCountUp(target ?? 0, active);
  const shown = target === null ? m.value : Math.round(counted).toLocaleString('en-US');

  return (
    <div className="hle-metric">
      <div className="hle-metric-v mono">
        {shown}
        {m.unit ? <em>{m.unit}</em> : null}
      </div>
      <div className="hle-metric-l tight-ko">{m.label}</div>
    </div>
  );
}

/** 사업축 시각화 — 히어로의 서버랙 블레이드와 같은 형태를 아이소메트릭으로 눕힌 것 */
function Blade3d({ p }: { p: Pillar }) {
  return (
    <div className="hle-blade3d" aria-hidden>
      <div className="hle-blade3d-in">
        {p.project.stack.map((s, i) => (
          <div key={s} className="hle-blade3d-row">
            <i className={i === 0 ? 'on' : 'acc'} />
            <i />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PillarBlock({ p }: { p: Pillar }) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <article
      id={p.id}
      className={inView ? 'hle-pillar hle-reveal hle-reveal--in' : 'hle-pillar hle-reveal'}
      ref={ref}
      style={{ scrollMarginTop: 96 }}
    >
      <div className="hle-pillar-head">
        <span className="hle-pillar-code mono">{p.code}</span>
        <h3 className="hle-h3 tight-ko">{p.labelKo}</h3>
        <span className="hle-pillar-en">{p.labelEn}</span>
      </div>

      <p className="hle-lead tight-ko" style={{ marginTop: 22, maxWidth: '34ch' }}>
        {p.summary}
      </p>
      <p className="hle-body tight-ko" style={{ marginTop: 18, maxWidth: '62ch' }}>
        {p.body}
      </p>

      <Blade3d p={p} />

      <div className="hle-card">
        <div className="hle-card-head">
          <div>
            <p className="hle-card-name mono">{p.project.name}</p>
            <p className="hle-card-sub tight-ko">{p.project.subtitle}</p>
          </div>
          <span className="hle-tag">{p.project.client}</span>
        </div>

        <div className="hle-card-body">
          <p className="hle-body tight-ko" style={{ maxWidth: '64ch' }}>
            {p.project.body}
          </p>
        </div>

        <div className="hle-metrics">
          {p.project.metrics.map((m) => (
            <Metric key={m.label} m={m} active={inView} />
          ))}
        </div>

        <div className="hle-stack">
          {p.project.stack.map((s) => (
            <span key={s} className="hle-chip">
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function PillarsSection() {
  return (
    <section className="hle-sec hle-sec--lg" aria-labelledby="hle-pillars-h">
      <div className="hle-col">
        <p className="hle-eyebrow">
          <i className="hle-sq" />
          02 / {nav[0].labelEn}
        </p>
        <h2 id="hle-pillars-h" className="hle-h2 tight-ko" style={{ marginTop: 24 }}>
          {nav[0].labelKo}
        </h2>
        <div style={{ marginTop: 64 }}>
          {pillars.map((p) => (
            <PillarBlock key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
