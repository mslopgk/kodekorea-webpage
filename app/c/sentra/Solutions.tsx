'use client';

import { nav, pillars } from '@/content/site';
import { Card } from './Card';
import { Dither, type DitherVariant } from './Dither';
import { Reveal, Scr } from './Scramble';
import s from './sentra.module.css';

/** 사업축별 절차적 도면 텍스처 — 내용과 연결된 그래픽을 직접 생성한다 */
const GRAPHIC: Record<string, DitherVariant> = {
  solution: 'blueprint',
  education: 'blocks',
  platform: 'iso',
};

export function Solutions() {
  return (
    <section id="solution" data-tone="dark" className={`${s.section} ${s.dark}`}>
      <div className="shell">
        <div className={s.sectionHead}>
          <span className={`mono ${s.code}`}>
            <Scr text="S/01—03" />
          </span>
          <span className={`mono ${s.kicker}`}>
            <Scr text={nav[0].labelEn.toUpperCase()} />
          </span>
        </div>

        <Reveal className={s.sectionTitleWrap}>
          <h2 className={`tight-ko ${s.sectionTitle}`}>{nav[0].labelKo}</h2>
        </Reveal>

        <div className={s.bento3}>
          {pillars.map((p, i) => (
            <Card key={p.id} delay={i * 110} className={s.pillarCard}>
              <div className={s.pillarGraphic} data-h={i}>
                <Dither
                  variant={GRAPHIC[p.id] ?? 'wave'}
                  texel={i === 1 ? 5 : 4}
                  gain={0.9}
                  className={s.pillarGraphicLayer}
                />
              </div>

              <div className={s.pillarHead}>
                <span className={`mono ${s.codeChip}`}>
                  <Scr text={p.code} delay={i * 110 + 320} />
                </span>
                <span className={`mono ${s.pillarEn}`}>
                  <Scr text={p.labelEn.toUpperCase()} delay={i * 110 + 420} />
                </span>
              </div>

              <h3 className={`tight-ko ${s.pillarKo}`}>{p.labelKo}</h3>
              <p className={s.pillarSummary}>{p.summary}</p>
              <p className={s.pillarBody}>{p.body}</p>

              <a href="#work" className={s.squareArrow} aria-label={p.labelKo}>
                <span aria-hidden>→</span>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
