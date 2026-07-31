import type { Metadata } from 'next';
import {
  capability,
  clients,
  company,
  cta,
  domains,
  footer,
  heroVerbs,
  nav,
  pillars,
  workLog,
} from '@/content/site';
import { HeroField } from './HeroField';
import { Plate } from './Plate';
import { Choreo } from './Choreo';
import { Dashboard } from './Dashboard';
import { Bars, Caret, Rail, Readout, Spark, Ticker, Wave } from './ambient';
import { Signal } from './live';
import { BigNumber, Rev, Wipe } from './parts';
import './v2.css';
import './dash.css';
import './ambient.css';

export const metadata: Metadata = {
  title: `${company.nameKo} — ${company.headline}`,
  description: company.intro,
};

/** 명암 반전은 딱 두 번. 각 반전에 이유가 있다. */
export default function V2() {
  return (
    <div className="v2">
      <Choreo />
      <header className="v2-top">
        <a className="v2-mark" href="#top">
          {company.nameKo}
          <span>{company.baseEn}</span>
        </a>
        <nav className="v2-topnav" aria-label={nav[0].labelKo}>
          {nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.labelEn}
            </a>
          ))}
        </nav>
      </header>

      <main id="top">
        {/* ── 히어로 · 3동사가 곧 정보 구조 ───────────────── */}
        <section className="v2-hero">
          <HeroField />
          <div className="v2-shell v2-hero__inner">
            <p className="v2-eyebrow">{company.taglineEn}</p>
            <h1 className="v2-verbs">
              {heroVerbs.map((v, i) => (
                <a
                  key={v.pillar}
                  className="v2-verb"
                  data-i={i}
                  href={`#${v.pillar}`}
                  aria-label={`${v.verb} — ${pillars[i].labelKo}`}
                >
                  <span className="v2-verb__no">{pillars[i].index}</span>
                  <Wipe delay={i * 130}>{v.verb}</Wipe>
                </a>
              ))}
            </h1>
            <Rev as="p" className="v2-hero__sub" delay={520}>
              {company.headlineSub}
            </Rev>
          </div>
          <div className="v2-shell v2-hero__foot">
            <p className="v2-code">{company.domain}</p>
            <div className="v2-strip">
              <Ticker items={domains} />
              <Wave variant="signal" height={26} />
            </div>
            <a className="v2-cta" href="#contact">
              <span className="v2-cta__box" aria-hidden="true">
                →
              </span>
              <span className="v2-cta__label">
                <b>{cta.primaryKo}</b>
                <span>{cta.primaryEn}</span>
              </span>
            </a>
          </div>
        </section>

        {/* ── 반전 ① 다크 → 라이트 : 읽는 구간으로 넘어간다 ── */}
        <section className="v2-sec" data-tone="light" id="platform">
          <div className="v2-shell">
            <div className="v2-intro__grid">
              <p className="v2-eyebrow">{nav[0].labelEn}</p>
              <div>
                <Rev as="p" className="v2-intro__lede">
                  {company.intro}
                </Rev>
              </div>
            </div>

            <div style={{ marginTop: 'clamp(48px, 8vh, 104px)' }}>
              {pillars.map((p, i) => (
                <article className="v2-pillar" key={p.id} id={p.id}>
                  <div>
                    <p className="v2-code">{p.code}</p>
                    <h2 className="v2-pillar__title">
                      <Wipe>{p.labelKo}</Wipe>
                    </h2>
                  </div>
                  <div>
                    <Rev as="p" className="v2-pillar__sum" delay={60}>
                      {p.summary}
                    </Rev>
                  </div>
                  <div>
                    <Rev as="p" className="v2-pillar__body" delay={120}>
                      {p.body}
                    </Rev>
                    <Rev delay={180}>
                      <ul className="v2-stack">
                        {p.project.stack.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </Rev>
                    <div className="v2-pillar__meter">
                      <Bars count={18} height={26} seed={i + 1} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── 반전 ② 라이트 → 다크 : 증거를 보여주는 구간 ──── */}
        <section id="work">
          {pillars.map((p, i) => (
            <div className="v2-shell v2-evidence" key={p.id}>
              <div className="v2-evi__head">
                <div>
                  <p className="v2-code">{p.code}</p>
                  <h2 className="v2-evi__name">
                    <Wipe>{p.project.name}</Wipe>
                  </h2>
                  <Rev as="p" className="v2-pillar__body" delay={80}>
                    {p.project.subtitle}
                  </Rev>
                </div>
                <p className="v2-evi__client">{p.project.client}</p>
              </div>
              <Wave
                variant={i === 0 ? 'sine' : i === 1 ? 'pulse' : 'noise'}
                height={30}
                accent={i === 0}
              />
              <div className="v2-railslot">
                <Rail seed={i + 3} />
              </div>

              <div style={{ position: 'relative' }}>
                {/* 실제 캡처가 있으면 캡처를, 없으면 절차적 도면을 쓴다.
                    승인 전인 프로젝트는 이미지를 넣을 수 없으므로 이 분기가 필요하다. */}
                {'images' in p.project && p.project.images.length > 0 ? (
                  <div className="v2-shots">
                    {p.project.images.map((im) => (
                      <figure className="v2-shot v2-shot--motion" key={im.src}>
                        {/* 정지 이미지 + 스크롤 켄번즈. 영상 태그는 쓰지 않는다 —
                            검증 환경에서 디코드가 렌더러를 얼려 확인이 불가능했고,
                            확인하지 못한 것은 싣지 않는다. 켄번즈만으로도 살아 있게 읽힌다. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={im.src} alt={im.alt} loading="lazy" />
                        <figcaption>{im.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <Plate kind={p.id as 'public' | 'education' | 'platform'} seed={7 + i * 13} />
                )}
                {/* 대표 수치를 도면 위에 크게 겹친다 — 카드 안에 갇히지 않게 */}
                <BigNumber
                  value={p.project.metrics[0].value}
                  unit={p.project.metrics[0].unit}
                  caption={p.project.metrics[0].label}
                />
              </div>

              <ul className="v2-metrics">
                {p.project.metrics.slice(1).map((m, mi) => (
                  <Rev as="li" key={m.label} delay={mi * 90}>
                    <b>
                      {m.value}
                      {m.unit}
                    </b>
                    <span>{m.label}</span>
                    <div className="v2-metric__spark">
                      <Spark seed={mi + i * 5 + 1} />
                    </div>
                  </Rev>
                ))}
              </ul>
            </div>
          ))}

          {/* 대표 실적 아래에 계속 쌓이는 실적 로그 */}
          <div className="v2-shell" style={{ paddingBottom: 'clamp(56px, 9vh, 120px)' }}>
            <div className="v2-evi__head">
              <div>
                <p className="v2-code">{workLog.labelEn.toUpperCase()}</p>
                <h2 className="v2-evi__name">
                  <Wipe>{workLog.labelKo}</Wipe>
                </h2>
              </div>
            </div>
            <Signal />
            <Dashboard />
          </div>
        </section>

        {/* ── 운영 역량 · 데이터 테이블 ─────────────────────── */}
        <section className="v2-sec" id="capability">
          <div className="v2-shell">
            <p className="v2-eyebrow">{capability.labelEn}</p>
            <Rev as="h2" className="v2-intro__lede" delay={60}>
              {capability.labelKo}
            </Rev>
            <Rev as="p" className="v2-pillar__body" delay={120}>
              {capability.body}
            </Rev>

            <div className="v2-cap">
              {capability.items.map((it, i) => (
                <Rev key={it.title} className="v2-cap__row" delay={i * 70}>
                  <span className="v2-cap__metric">{it.metric}</span>
                  <span className="v2-cap__title">{it.title}</span>
                  <div>
                    <p className="v2-cap__detail">{it.detail}</p>
                    <div className="v2-cap__live">
                      <Spark seed={i * 3 + 2} height={14} />
                      <Readout label="LOAD" base={40 + i * 17} unit="%" />
                    </div>
                  </div>
                </Rev>
              ))}
            </div>

            <div style={{ marginTop: 'clamp(56px, 9vh, 120px)' }}>
              <p className="v2-eyebrow">Clients</p>
              <Wave variant="noise" height={24} accent={false} />
              <ul className="v2-clients">
                {clients.map((c, i) => (
                  <Rev as="li" key={c.name + c.scope} delay={i * 60}>
                    <b>{c.name}</b>
                    <span>{c.scope}</span>
                  </Rev>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 'clamp(56px, 9vh, 120px)' }}>
              <p className="v2-eyebrow">Domains</p>
              <Ticker items={domains} speed={0.02} />
              <ul className="v2-domains">
                {domains.map((d, i) => (
                  <Rev as="li" key={d} delay={Math.min(i * 26, 420)}>
                    {d}
                  </Rev>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 문의 ─────────────────────────────────────────── */}
        <section className="v2-sec v2-contact" id="contact">
          <div className="v2-shell">
            <p className="v2-eyebrow">{nav[3].labelEn}</p>
            <h2>
              <Wipe>{cta.contactHeadline}</Wipe>
              <Caret />
            </h2>
            <Wave variant="pulse" height={28} />
            <Rev as="p" className="v2-contact__body" delay={100}>
              {cta.contactBody}
            </Rev>
            <a className="v2-contact__mail" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
        </section>
      </main>

      <footer className="v2-shell v2-foot">
        <div className="v2-foot__live">
          <p>{footer.copyright}</p>
          <Readout label="UPTIME" base={9982} unit="h" />
          <Readout label="NODES" base={12} />
          <Readout label="RTT" base={38} unit="ms" />
        </div>
        <div className="v2-foot__links">
          {footer.links.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
