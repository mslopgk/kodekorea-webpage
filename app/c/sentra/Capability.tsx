'use client';

import { capability, nav } from '@/content/site';
import { Card } from './Card';
import { Dither } from './Dither';
import { Reveal, Scr } from './Scramble';
import s from './sentra.module.css';
import { clauseMix, valueFont } from './util';

export function Capability() {
  const clauses = clauseMix(capability.body);

  return (
    <section id="capability" data-tone="dark" className={`${s.section} ${s.dark} ${s.capability}`}>
      <Dither variant="wave" texel={5} gain={0.2} animate className={s.capTexture} />

      <div className={`shell ${s.capInner}`}>
        <div className={s.sectionHead}>
          <span className={`mono ${s.code}`}>
            <Scr text="O/01—04" />
          </span>
          <span className={`mono ${s.kicker}`}>
            <Scr text={capability.labelEn.toUpperCase()} />
          </span>
        </div>

        <div className={s.capHead}>
          <Reveal className={s.sectionTitleWrap}>
            <h2 className={`tight-ko ${s.sectionTitle}`}>{capability.labelKo}</h2>
          </Reveal>
          <Reveal delay={140} className={s.capBody}>
            <p>
              {clauses.map((c, i) => (
                <span key={i} className={c.strong ? s.txStrong : s.txDim}>
                  {c.text}
                  {i < clauses.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
            <span className={`mono ${s.capNavHint}`} aria-hidden>
              {nav[2].labelEn.toUpperCase()}
            </span>
          </Reveal>
        </div>

        <div className={s.bentoCap}>
          {capability.items.map((item, i) => (
            <Card key={item.title} delay={(i % 2) * 120} className={s.capCard}>
              <span className={`mono ${s.codeChip} ${s.codeChipTight}`}>
                <Scr text={`O/${String(i + 1).padStart(2, '0')}`} delay={220 + i * 60} />
              </span>
              <span className={`${valueFont(item.metric)} ${s.capMetric}`}>
                <Scr text={item.metric} delay={300 + i * 60} />
              </span>
              <h3 className={`tight-ko ${s.capTitle}`}>{item.title}</h3>
              <p className={s.capDetail}>{item.detail}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
