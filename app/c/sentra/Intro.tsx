'use client';

import { company } from '@/content/site';
import { Reveal, Scr } from './Scramble';
import s from './sentra.module.css';
import { clauseMix, commaLines } from './util';

export function Intro() {
  const lines = commaLines(company.tagline);
  const clauses = clauseMix(company.intro);

  return (
    <section data-tone="light" className={`${s.section} ${s.light} ${s.intro}`}>
      <div className="shell">
        <div className={s.sectionHead}>
          <span className={`mono ${s.code}`}>
            <Scr text="I/01" />
          </span>
          <span className={`mono ${s.kicker}`}>
            <Scr text={company.taglineEn.toUpperCase()} />
          </span>
        </div>

        {/* 대형 문장 블록 — 좌/우 정렬 교차 + 검정·미드그레이 혼용 */}
        <div className={s.statement}>
          {lines.map((line, i) => (
            <Reveal key={i} delay={i * 130} className={s.statementRow} >
              <span
                className={`tight-ko ${s.statementLine}`}
                data-align={i % 3 === 2 ? 'end' : i % 3 === 1 ? 'mid' : 'start'}
                data-dim={i % 2 === 1}
              >
                {line}
              </span>
            </Reveal>
          ))}
        </div>

        <div className={s.introGrid}>
          <div className={s.introMeta}>
            <span className={`mono ${s.metaLabel}`}>
              <Scr text={company.nameEn.toUpperCase()} />
            </span>
            <span className={`mono ${s.metaLabel}`}>
              <Scr text={company.baseEn.toUpperCase()} delay={90} />
            </span>
            <span className={`mono ${s.metaLabel}`}>
              <Scr text={company.domain.toUpperCase()} delay={180} />
            </span>
          </div>

          <Reveal delay={120} className={s.introBody}>
            <p>
              {clauses.map((c, i) => (
                <span key={i} className={c.strong ? s.txStrong : s.txDim}>
                  {c.text}
                  {i < clauses.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
