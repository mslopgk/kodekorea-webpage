'use client';

import './hut8.css';

import { capability, clients, company, cta, footer, nav, pillars } from '@/content/site';
import DomainReel from './DomainReel';
import ImpactTerrain from './ImpactTerrain';
import IsoJourney from './IsoJourney';
import NavOverlay from './NavOverlay';
import Reveal from './Reveal';
import { useTone } from './useTone';

const NAV_IDS = nav.map((n) => n.href.slice(1));

export default function Hut8Concept() {
  const { tone, active } = useTone(NAV_IDS);

  return (
    <main className="h8">
      <NavOverlay tone={tone} active={active} />

      {/* ── 히어로 (다크) ─────────────────────────────────── */}
      <section className="h8-hero h8-dark" id="top" data-tone="dark">
        <div className="h8-hero__rays" aria-hidden="true" />
        <div className="h8-hero__grain" aria-hidden="true" />

        <div className="h8-shell h8-hero__body">
          <div className="h8-hero__lead">
            <p className="h8-hero__kicker h8-mono">
              <i aria-hidden="true" />
              {company.taglineEn}
            </p>
            <h1>
              <span className="h8-line">
                <span>{company.headline}</span>
              </span>
              <span className="h8-line">
                <span>
                  <em>{company.headlineSub}</em>
                </span>
              </span>
            </h1>
            <p className="h8-hero__sub">{company.tagline}</p>
            <div className="h8-hero__cta">
              <a className="h8-btn" href={`mailto:${company.email}`}>
                {cta.primaryKo}
                <span className="h8-btn__arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a className="h8-btn h8-btn--ghost" href={nav[0].href}>
                {nav[0].labelKo}
              </a>
            </div>
          </div>

          <div className="h8-hero__side">
            <div className="h8-hero__meta">
              {pillars.map((p) => (
                <span key={p.id}>
                  {p.index} · {p.labelEn}
                </span>
              ))}
              <span>{company.baseEn}</span>
            </div>
          </div>
        </div>

        <span className="h8-hero__scroll" aria-hidden="true" />
      </section>

      {/* ── 회사 소개 (다크) ──────────────────────────────── */}
      <section className="h8-sec h8-dark" data-tone="dark">
        <div className="h8-shell h8-grid">
          <Reveal className="h8-intro__lead">
            <p className="h8-eyebrow">
              01 <b>{company.nameEn}</b>
            </p>
            <p
              className="h8-mono"
              style={{ marginTop: 18, fontSize: 'var(--t-sm)', letterSpacing: '0.14em', opacity: 0.5 }}
            >
              {company.domain}
            </p>
          </Reveal>

          <Reveal className="h8-intro__body" delay={120}>
            <p className="h8-ko">{company.intro}</p>
            <ul className="h8-intro__tags">
              {pillars.map((p) => (
                <li key={p.id}>
                  <b className="h8-mono">{p.code}</b>
                  {p.labelKo}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 다크 → 라이트 대반전 */}
      <div className="h8-flip" aria-hidden="true" />

      {/* ── 아이소메트릭 여정 (라이트) ────────────────────── */}
      <section className="h8-journey" id={NAV_IDS[0]} data-tone="light">
        <IsoJourney />
      </section>

      {/* ── 실적: 사업축 상세 + 협업 이력 (라이트) ────────── */}
      <section className="h8-sec h8-light" id={NAV_IDS[1]} data-tone="light">
        <div className="h8-shell">
          <Reveal>
            <p className="h8-eyebrow">
              03 <b>{nav[1].labelEn}</b>
            </p>
          </Reveal>

          {pillars.map((p, i) => (
            <Reveal as="article" key={p.id} id={`work-${p.id}`} className="h8-pillar h8-grid" delay={i * 60}>
              <div className="h8-pillar__side">
                <span className="h8-pillar__num h8-mono">{p.index}</span>
                <small>{p.labelEn}</small>
              </div>

              <div className="h8-pillar__main">
                <h3 className="h8-ko">{p.labelKo}</h3>
                <p className="h8-pillar__sum h8-ko">{p.summary}</p>
                <p className="h8-pillar__body">{p.body}</p>
              </div>

              <div className="h8-pillar__proj">
                <h4>{p.project.name}</h4>
                <p className="h8-mono">
                  {p.project.subtitle} / {p.project.client}
                </p>
                <p className="h8-pillar__pbody">{p.project.body}</p>
                <ul className="h8-metrics">
                  {p.project.metrics.map((m) => (
                    <li key={m.label}>
                      <strong>
                        {m.value}
                        {m.unit ? <sup>{m.unit}</sup> : null}
                      </strong>
                      <span>{m.label}</span>
                    </li>
                  ))}
                </ul>
                <ul className="h8-stack">
                  {p.project.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          <Reveal className="h8-grid" style={{ marginTop: 'var(--spacing-s7, 96px)' }}>
            <ul className="h8-clients">
              {clients.map((c, i) => (
                <li key={c.name}>
                  <em>{String(i + 1).padStart(2, '0')}</em>
                  <b className="h8-ko">{c.name}</b>
                  <span>{c.scope}</span>
                  <i aria-hidden="true">→</i>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── 실적 지형 + 운영 역량 (라이트 딥) ─────────────── */}
      <section className="h8-impact" id={NAV_IDS[2]} data-tone="light">
        <div className="h8-shell">
          <Reveal>
            <p className="h8-eyebrow">
              04 <b>{nav[2].labelEn}</b>
            </p>
            <h2 className="h8-impact__title h8-mono">{capability.labelEn}</h2>
          </Reveal>

          <Reveal className="h8-impact__intro" delay={100}>
            <div>
              <p className="h8-impact__ko h8-ko">{capability.labelKo}</p>
            </div>
            <div>
              <p className="h8-impact__body">{capability.body}</p>
            </div>
          </Reveal>

          <Reveal className="h8-impact__terrain" delay={60}>
            <ImpactTerrain />
          </Reveal>

          <Reveal className="h8-grid">
            <ul className="h8-cap">
              {capability.items.map((it) => (
                <li key={it.title}>
                  <em>{it.metric}</em>
                  <h4 className="h8-ko">{it.title}</h4>
                  <p>{it.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 라이트 → 다크 대반전 */}
      <div className="h8-flip h8-flip--up" aria-hidden="true" />

      {/* ── 기술 영역 무한 리스트 (다크) ──────────────────── */}
      <section className="h8-dom" data-tone="dark">
        <div className="h8-shell">
          <p className="h8-eyebrow">
            05 <b>{company.nameEn}</b>
          </p>
        </div>
        <DomainReel />
      </section>

      {/* ── CTA (다크) ────────────────────────────────────── */}
      <section className="h8-cta" id={NAV_IDS[3]} data-tone="dark">
        <div className="h8-shell h8-grid">
          <Reveal className="h8-cta__main">
            <p className="h8-eyebrow">
              06 <b>{nav[3].labelEn}</b>
            </p>
            <h2 className="h8-ko">{cta.contactHeadline}</h2>
            <p className="h8-cta__body">{cta.contactBody}</p>
            <div className="h8-hero__cta">
              <a className="h8-btn" href={`mailto:${company.email}`}>
                {cta.primaryKo}
                <span className="h8-btn__arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a className="h8-btn h8-btn--ghost" href={`mailto:${company.email}?subject=${cta.secondaryKo}`}>
                {cta.secondaryKo}
              </a>
            </div>
          </Reveal>

          <Reveal className="h8-cta__side" delay={140}>
            <a className="h8-cta__contact" href={`mailto:${company.email}`}>
              {company.email}
            </a>
            <a className="h8-cta__contact" href={`https://${company.domain}`}>
              {company.domain}
            </a>
            <span className="h8-cta__contact" style={{ borderBottom: 0 }}>
              {company.base} · {company.baseEn}
            </span>
          </Reveal>
        </div>
      </section>

      {/* ── 푸터: 액센트 초대형 워드마크 ──────────────────── */}
      <footer className="h8-foot" data-tone="dark">
        <div className="h8-shell">
          <div className="h8-foot__top">
            <span>{footer.copyright}</span>
            <span>
              {company.nameKo} · {company.base}
            </span>
            <ul>
              {footer.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h8-foot__mark">
          <svg viewBox="0 0 1000 132" role="img" aria-label={company.nameEn}>
            <text x="0" y="118" fontSize="164" textLength="1000" lengthAdjust="spacingAndGlyphs">
              {company.nameEn.toUpperCase()}
            </text>
          </svg>
        </div>
      </footer>
    </main>
  );
}
