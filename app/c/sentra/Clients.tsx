'use client';

import { clients, company } from '@/content/site';
import { Reveal, Scr } from './Scramble';
import s from './sentra.module.css';

export function Clients() {
  return (
    <section id="clients" data-tone="light" className={`${s.section} ${s.light}`}>
      <div className="shell">
        <div className={s.sectionHead}>
          <span className={`mono ${s.code}`}>
            <Scr text={`C/01—${String(clients.length).padStart(2, '0')}`} />
          </span>
          <span className={`mono ${s.kicker}`}>
            <Scr text={company.nameEn.toUpperCase()} />
          </span>
        </div>

        <ul className={s.clientList}>
          {clients.map((c, i) => (
            <li key={c.name}>
              <Reveal delay={i * 80}>
                <div className={s.clientRow}>
                  <span className={`mono ${s.clientIndex}`}>
                    <Scr text={`C/${String(i + 1).padStart(2, '0')}`} delay={i * 80 + 120} />
                  </span>
                  <span className={`tight-ko ${s.clientName}`}>{c.name}</span>
                  <span className={s.clientScope}>{c.scope}</span>
                  <span className={`mono ${s.clientArrow}`} aria-hidden>
                    →
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
