'use client';

import { nav, pillars } from '@/content/site';
import { Card } from './Card';
import { Reveal, Scr } from './Scramble';
import s from './sentra.module.css';
import { hasHangul, valueFont } from './util';

export function Work() {
  return (
    <section id="work" data-tone="light" className={`${s.section} ${s.light}`}>
      <div className="shell">
        <div className={s.sectionHead}>
          <span className={`mono ${s.code}`}>
            <Scr text="W/01—03" />
          </span>
          <span className={`mono ${s.kicker}`}>
            <Scr text={nav[1].labelEn.toUpperCase()} />
          </span>
        </div>

        <Reveal className={s.sectionTitleWrap}>
          <h2 className={`tight-ko ${s.sectionTitle}`}>{nav[1].labelKo}</h2>
        </Reveal>

        <div className={s.workList}>
          {pillars.map((p, i) => (
            <div key={p.id} className={s.workRow} data-mirror={i % 2 === 1}>
              <Card delay={0} className={s.workMain}>
                <div className={s.pillarHead}>
                  <span className={`mono ${s.codeChip}`}>
                    <Scr text={p.code} delay={280} />
                  </span>
                  <span className={`mono ${s.pillarEn}`}>
                    <Scr text={p.labelEn.toUpperCase()} delay={360} />
                  </span>
                </div>

                <h3 className={`${valueFont(p.project.name)} ${s.projectName}`}>
                  <Scr
                    text={hasHangul(p.project.name) ? p.project.name : p.project.name.toUpperCase()}
                    delay={420}
                    block
                  />
                </h3>
                <p className={`tight-ko ${s.projectSubtitle}`}>{p.project.subtitle}</p>
                <p className={s.projectBody}>{p.project.body}</p>

                <div className={s.projectFoot}>
                  <span className={s.clientChip}>
                    <span aria-hidden className={s.clientSlash}>
                      /
                    </span>
                    {p.project.client}
                  </span>
                  <ul className={s.stackList}>
                    {p.project.stack.map((tech, k) => (
                      <li key={tech} className={`mono ${s.stackChip}`}>
                        <Scr text={tech} delay={520 + k * 70} />
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              <div className={s.workMetrics}>
                {p.project.metrics.map((m, k) => (
                  <Card key={m.label} delay={140 + k * 90} className={s.metricCard}>
                    <span className={`mono ${s.metricIndex}`} aria-hidden>
                      {p.code.charAt(0)}/{String(k + 1).padStart(2, '0')}
                    </span>
                    <span className={`${valueFont(m.value)} ${s.metricValue}`}>
                      <Scr text={m.value} delay={200 + k * 90} />
                      {m.unit && <span className={s.metricUnit}>{m.unit}</span>}
                    </span>
                    <span className={s.metricLabel}>{m.label}</span>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
