'use client';

import { capability, company } from '@/content/site';
import { useInView } from '@/lib/motion';

const RAYS = 16;
const CX = 210;
const CY = 210;
const R = 196;
/** useInView의 effect 의존성에 그대로 들어가므로 렌더마다 새 객체를 만들면 안 된다 */
const IO = { threshold: 0.15 };

/**
 * 회사 소개 — 좌: 텍스트 / 우: 화면에 붙어 따라오는 기술 도면.
 * 도면은 중심 십자선에서 시작해 방사형으로 선이 뻗어나가며 그려진다.
 * (레퍼런스 #03 About 페이지의 제너러티브 도면 구조)
 */
export default function IntroSection() {
  const { ref: figRef, inView } = useInView<HTMLElement>(IO);

  return (
    <section className="hle-sec hle-sec--lg" aria-labelledby="hle-intro-h">
      <div className="hle-wide">
        <div className="hle-intro-grid">
          <div>
            <p className="hle-eyebrow">
              <i className="hle-sq" />
              01 / {company.nameEn}
            </p>
            <h2 id="hle-intro-h" className="hle-h2 tight-ko" style={{ marginTop: 24 }}>
              {company.tagline}
            </h2>
            <p className="hle-lead tight-ko" style={{ marginTop: 32, maxWidth: '44ch' }}>
              {company.intro}
            </p>
            <hr className="hle-hair" style={{ marginTop: 44 }} />
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 20,
                justifyContent: 'space-between',
                marginTop: 14,
              }}
            >
              <span className="hle-eyebrow">{company.taglineEn}</span>
              <span className="hle-eyebrow">
                {company.baseEn} / {company.domain}
              </span>
            </div>
          </div>

          <figure className="hle-drawing" ref={figRef} style={{ margin: 0 }}>
            <svg
              viewBox="0 0 420 420"
              className={inView ? 'hle-draw hle-draw--in' : 'hle-draw'}
              aria-hidden
            >
              <rect x="10" y="10" width="400" height="400" pathLength={1} />
              <line x1="10" y1={CY} x2="410" y2={CY} pathLength={1} />
              <line x1={CX} y1="10" x2={CX} y2="410" pathLength={1} />
              <circle cx={CX} cy={CY} r="72" pathLength={1} />
              <circle cx={CX} cy={CY} r="140" className="acc" pathLength={1} />
              {Array.from({ length: RAYS }).map((_, i) => {
                const a = (i / RAYS) * Math.PI * 2 - Math.PI / 2;
                return (
                  <line
                    key={i}
                    className="ray"
                    x1={CX}
                    y1={CY}
                    x2={CX + Math.cos(a) * R}
                    y2={CY + Math.sin(a) * R}
                    pathLength={1}
                    style={{
                      strokeDashoffset: inView ? 0 : 1,
                      transitionDelay: `${420 + i * 78}ms`,
                    }}
                  />
                );
              })}
              <rect x={CX - 3} y={CY - 3} width="6" height="6" className="fill" />
            </svg>
            <figcaption>
              <span>{capability.labelEn}</span>
              <span>
                {String(RAYS).padStart(3, '0')} / {String(RAYS).padStart(3, '0')}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
