'use client';

import { company, domains } from '@/content/site';
import { Reveal, Scr } from './Scramble';
import s from './sentra.module.css';

export function Domains() {
  return (
    <section id="domains" data-tone="light" className={`${s.section} ${s.light} ${s.domains}`}>
      {/* 무한 마퀴 — 모션 축소 시 정지 */}
      <div className={s.marquee} aria-hidden>
        <div className={s.marqueeTrack}>
          {[0, 1].map((dup) => (
            <div key={dup} className={s.marqueeGroup}>
              {domains.map((d) => (
                <span key={d} className={s.marqueeItem}>
                  <span className={`mono ${s.marqueeSep}`}>+</span>
                  {d}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="shell">
        <div className={s.sectionHead}>
          <span className={`mono ${s.code}`}>
            <Scr text={`D/01—${String(domains.length).padStart(2, '0')}`} />
          </span>
          <span className={`mono ${s.kicker}`}>
            <Scr text={company.taglineEn.toUpperCase()} />
          </span>
        </div>

        <ul className={s.domainGrid}>
          {domains.map((d, i) => (
            <li key={d} className={s.domainCell}>
              <Reveal delay={(i % 4) * 70}>
                <span className={`mono ${s.domainIndex}`}>
                  <Scr text={`D/${String(i + 1).padStart(2, '0')}`} delay={(i % 4) * 70 + 90} />
                </span>
                <span className={`tight-ko ${s.domainName}`}>{d}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
