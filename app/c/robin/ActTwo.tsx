'use client';

/**
 * 막2 — 다크 + 액센트 1개(버밀리언).
 * 사업축 3개를 각각 헤드 + 프로젝트 카드(CSS 3D 틸트 → 정면)로 펼치고,
 * 마지막에 "우주 진입" 구간(행성 궤도 = 기술 영역 16)으로 이어진다.
 */

import { pillars } from '@/content/site';
import { useInView } from '@/lib/motion';
import { Metric } from './parts';
import Planet from './Planet';

type Pillar = (typeof pillars)[number];

function PillarBlock({ pillar, first }: { pillar: Pillar; first: boolean }) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.12 });

  return (
    <article ref={ref} className="rb-pillar" data-in={inView} id={pillar.id}>
      <div className="rb-pillar-head">
        <p className="rb-pillar-index rb-num">
          {pillar.index}
          <span className="rb-pillar-code">{pillar.code}</span>
        </p>

        <div>
          <h2 className="rb-pillar-title">
            <span>{pillar.labelEn}</span>
            {pillar.labelKo}
          </h2>
          <p className="rb-pillar-summary">{pillar.summary}</p>
          <p className="rb-pillar-body rb-body">{pillar.body}</p>
        </div>
      </div>

      <div className="rb-proj" id={first ? 'work' : undefined}>
        <div className="rb-proj-card">
          <div className="rb-proj-head">
            <h3 className="rb-proj-name">{pillar.project.name}</h3>
            <p className="rb-proj-sub">{pillar.project.subtitle}</p>
            <p className="rb-proj-client">{pillar.project.client}</p>
          </div>
          <p className="rb-proj-body rb-body">{pillar.project.body}</p>

          <ul className="rb-metrics">
            {pillar.project.metrics.map((m) => (
              <Metric key={m.label} value={m.value} unit={m.unit} label={m.label} />
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function ActTwo() {
  return (
    <section className="rb-act" data-palette="2" data-act-index={2}>
      <div className="rb-wrap rb-pillars">
        {pillars.map((p, i) => (
          <PillarBlock key={p.id} pillar={p} first={i === 0} />
        ))}
      </div>

      <Planet />
    </section>
  );
}
