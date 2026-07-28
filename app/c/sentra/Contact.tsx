'use client';

import { company, cta, footer, nav } from '@/content/site';
import { Dither } from './Dither';
import { Reveal, Scr } from './Scramble';
import s from './sentra.module.css';
import { clauseMix } from './util';

export function Contact() {
  const clauses = clauseMix(cta.contactBody);

  return (
    <section id="contact" data-tone="dark" className={`${s.section} ${s.dark} ${s.contact}`}>
      <Dither variant="eclipse" texel={5} gain={0.42} className={s.contactTexture} />

      <div className={`shell ${s.contactInner}`}>
        <div className={s.sectionHead}>
          <span className={`mono ${s.code}`}>
            <Scr text="X/01" />
          </span>
          <span className={`mono ${s.kicker}`}>
            <Scr text={nav[3].labelEn.toUpperCase()} />
          </span>
        </div>

        <h2 className={`tight-ko ${s.contactHeadline}`}>
          <Scr text={cta.contactHeadline} block />
          <span className={s.contactMark} aria-hidden>
            ?
          </span>
        </h2>

        <Reveal delay={200} className={s.contactBody}>
          <p>
            {clauses.map((c, i) => (
              <span key={i} className={c.strong ? s.txStrong : s.txDim}>
                {c.text}
                {i < clauses.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={320} className={s.ctaRow}>
          <a href={`mailto:${company.email}`} className={s.ctaCombo}>
            <span className={`${s.iconBox} ${s.iconBoxOrange}`} aria-hidden>
              →
            </span>
            <span className={s.ctaComboText}>
              <span className={s.ctaKo}>{cta.primaryKo}</span>
              <span className={`mono ${s.ctaEn}`}>{cta.primaryEn.toUpperCase()}</span>
            </span>
          </a>
          <a href={`mailto:${company.email}`} className={s.ctaCombo}>
            <span className={`${s.iconBox} ${s.iconBoxGhost}`} aria-hidden>
              →
            </span>
            <span className={s.ctaComboText}>
              <span className={s.ctaKo}>{cta.secondaryKo}</span>
              <span className={`mono ${s.ctaEn}`}>{cta.secondaryEn.toUpperCase()}</span>
            </span>
          </a>
        </Reveal>

        <div className={s.contactMeta}>
          <span className={`mono ${s.metaLabel}`}>
            <Scr text={company.email.toUpperCase()} delay={420} />
          </span>
          <span className={`mono ${s.metaLabel}`}>
            <Scr text={company.baseEn.toUpperCase()} delay={520} />
          </span>
          <span className={`mono ${s.metaLabel}`}>
            <Scr text={company.domain.toUpperCase()} delay={620} />
          </span>
        </div>

        <footer className={s.footer}>
          <div className={s.footerTop}>
            <span className={`tight-ko ${s.footerBrand}`}>{company.nameKo}</span>
            <nav className={s.footerNav} aria-label={nav[0].labelKo}>
              {nav.map((item) => (
                <a key={item.href} href={item.href} className={s.footerLink}>
                  <span>{item.labelKo}</span>
                  <span className={`mono ${s.footerLinkEn}`}>{item.labelEn}</span>
                </a>
              ))}
            </nav>
            <nav className={s.footerNav} aria-label={company.nameKo}>
              {footer.links.map((l) => (
                <a key={l.label} href={l.href} className={s.footerLink}>
                  <span>{l.label}</span>
                </a>
              ))}
            </nav>
          </div>
          <div className={s.footerBottom}>
            <span className={`mono ${s.footerCopy}`}>{footer.copyright}</span>
            <span className={`mono ${s.footerCopy}`}>{company.taglineEn.toUpperCase()}</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
