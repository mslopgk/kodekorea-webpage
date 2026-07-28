'use client';

import { company, cta, footer, nav } from '@/content/site';
import { useInView } from '@/lib/motion';
import Clock from './Clock';

/** useInView의 effect 의존성에 그대로 들어가므로 렌더마다 새 객체를 만들면 안 된다 */
const IO = { threshold: 0.25 };

/** CTA + 푸터 — 원과 직선이 SVG stroke draw-on으로 그려지고, 완전 라운드 아웃라인 알약 버튼 */
export default function ContactFooter() {
  const { ref, inView } = useInView<HTMLDivElement>(IO);

  return (
    <footer id="contact" className="hle-footer-wrap" style={{ scrollMarginTop: 96 }}>
      <section className="hle-sec hle-sec--lg hle-cta" ref={ref}>
        <svg
          viewBox="0 0 892 520"
          className={inView ? 'hle-cta-svg hle-draw hle-draw--in' : 'hle-cta-svg hle-draw'}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <circle cx="446" cy="260" r="238" pathLength={1} />
          <circle cx="446" cy="260" r="150" className="acc" pathLength={1} />
          <line x1="0" y1="260" x2="892" y2="260" pathLength={1} />
          <line x1="446" y1="0" x2="446" y2="520" pathLength={1} />
          <line x1="446" y1="260" x2="622" y2="118" className="acc" pathLength={1} />
          <rect x="443" y="257" width="6" height="6" className="fill" />
        </svg>

        <div className="hle-col" style={{ position: 'relative' }}>
          <p className="hle-eyebrow" style={{ justifyContent: 'center' }}>
            <i className="hle-sq hle-sq--on" />
            06 / {nav[3].labelEn}
          </p>

          <h2 className="hle-h2 tight-ko" style={{ marginTop: 28 }}>
            {cta.contactHeadline}
          </h2>

          <p
            className="hle-lead tight-ko"
            style={{ marginTop: 26, maxWidth: '46ch', marginInline: 'auto' }}
          >
            {cta.contactBody}
          </p>

          <div style={{ marginTop: 40 }}>
            <a className="hle-mail" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>

          <div className="hle-onlinelabel">
            <hr className="hle-hair" />
            <span>{cta.primaryEn}</span>
          </div>

          <div className="hle-pills">
            <a className="hle-pill" href={`mailto:${company.email}`}>
              {cta.primaryKo}
              <span aria-hidden>→</span>
            </a>
            <a className="hle-pill hle-pill--ghost" href={`mailto:${company.email}`}>
              {cta.secondaryKo}
              <span aria-hidden>+</span>
            </a>
          </div>
        </div>
      </section>

      <div className="hle-footer">
        <div className="hle-wide">
          <div className="hle-footer-row">
            <span className="hle-footer-c mono">{company.nameEn}</span>
            <ul className="hle-footer-links">
              {footer.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
            <Clock />
          </div>
          <hr className="hle-hair" style={{ marginBlock: 22 }} />
          <div className="hle-footer-row">
            <span className="hle-footer-c">{footer.copyright}</span>
            <span className="hle-footer-c">
              {company.baseEn} / {company.domain}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
