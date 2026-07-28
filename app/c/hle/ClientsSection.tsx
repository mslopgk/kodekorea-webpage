'use client';

import { clients, nav } from '@/content/site';
import { useInView } from '@/lib/motion';

/** 협업 이력 — 1px 하드라인 리스트 */
export default function ClientsSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="work" className="hle-sec" style={{ scrollMarginTop: 96 }}>
      <div className="hle-col">
        <p className="hle-eyebrow">
          <i className="hle-sq" />
          04 / {nav[1].labelEn}
        </p>
        <h2 className="hle-h2 tight-ko" style={{ marginTop: 24 }}>
          {nav[1].labelKo}
        </h2>

        <div ref={ref}>
          <ul className="hle-clients">
            {clients.map((c, i) => (
              <li
                key={c.name + c.scope}
                className={inView ? 'hle-client hle-reveal hle-reveal--in' : 'hle-client hle-reveal'}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="hle-client-i mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="hle-client-n tight-ko">{c.name}</span>
                <span className="hle-client-s tight-ko">{c.scope}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
