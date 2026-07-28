'use client';

import { company, domains } from '@/content/site';

/** 기술 영역 16개 — 무한 마퀴 밴드 + 4x4 그리드 */
export default function DomainsSection() {
  return (
    <section className="hle-sec" aria-labelledby="hle-domains-h">
      <div className="hle-col">
        <p className="hle-eyebrow">
          <i className="hle-sq" />
          05 / {company.nameEn}
        </p>
        <h2
          id="hle-domains-h"
          className="hle-h2 mono tight-en"
          style={{ marginTop: 24, textTransform: 'uppercase' }}
        >
          {company.headlineEn}
        </h2>
      </div>

      <div className="hle-marq" aria-hidden>
        <div className="hle-marq-row">
          {[...domains, ...domains].map((d, i) => (
            <span key={`${i}-${d}`}>
              <i className="hle-sq" />
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="hle-wide">
        <ul className="hle-domains">
          {domains.map((d, i) => (
            <li key={d} className="hle-domain">
              <span className="hle-domain-i mono">
                <i />
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="hle-domain-n tight-ko">{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
