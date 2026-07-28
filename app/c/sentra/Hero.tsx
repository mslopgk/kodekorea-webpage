'use client';

import { company, cta, nav } from '@/content/site';
import { Dither } from './Dither';
import { AmbientGlyphs } from './AmbientGlyphs';
import { Reveal, Scr } from './Scramble';
import s from './sentra.module.css';

export function Hero() {
  return (
    <section id="top" data-tone="dark" className={`${s.section} ${s.dark} ${s.hero}`}>
      <Dither variant="eclipse" texel={4} gain={0.72} animate className={s.heroTexture} />
      <span className={s.heroScrim} aria-hidden />
      <AmbientGlyphs />

      <div className={`shell ${s.heroInner}`}>
        <p className={`mono ${s.kicker} ${s.heroKicker}`}>
          <Scr text={company.taglineEn.toUpperCase()} delay={280} />
          <span className={s.kickerDot} aria-hidden>
            /
          </span>
          <Scr text={company.baseEn.toUpperCase()} delay={520} />
        </p>

        <h1 className={s.heroTitle}>
          <span className={`mono tight-en ${s.heroEn}`}>
            <Scr text={company.headlineEn.toUpperCase()} delay={620} block />
          </span>
          <span className={`tight-ko ${s.heroKo}`}>
            <Scr text={company.headline} delay={860} block />
          </span>
          <span className={`tight-ko ${s.heroSub}`}>
            <Scr text={company.headlineSub} delay={1180} block />
          </span>
        </h1>

        <div className={s.heroFoot}>
          <Reveal delay={1500} className={s.heroFootLeft}>
            <p className={`mono ${s.heroMono}`}>{company.tagline}</p>
            <p className={`mono ${s.heroMeta}`}>
              <span>{company.domain}</span>
              <span aria-hidden>·</span>
              <span>{company.email}</span>
            </p>
          </Reveal>

          <Reveal delay={1620} className={s.heroFootRight}>
            <a href={nav[3].href} className={s.ctaCombo}>
              <span className={`${s.iconBox} ${s.iconBoxOrange}`} aria-hidden>
                →
              </span>
              <span className={s.ctaComboText}>
                <span className={s.ctaKo}>{cta.primaryKo}</span>
                <span className={`mono ${s.ctaEn}`}>{cta.primaryEn.toUpperCase()}</span>
              </span>
            </a>
          </Reveal>
        </div>

        <div className={s.heroRule} aria-hidden>
          <span className={`mono ${s.heroRuleCode}`}>S/00</span>
          <span className={s.heroRuleLine} />
          <span className={`mono ${s.heroRuleCode}`}>{nav[0].labelEn.toUpperCase()} ↓</span>
        </div>
      </div>
    </section>
  );
}
