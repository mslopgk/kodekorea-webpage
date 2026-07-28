'use client';

/**
 * 막4 — 도착지. 밝은 파스텔(민트 → 라벤더).
 * 여정의 끝에서 처음으로 밝아지고, 가장 읽기 쉬운 조판으로
 * 운영 역량 4항목 · 협업 이력 · 문의 · 푸터를 전달한다.
 */

import { capability, clients, company, cta, footer, nav } from '@/content/site';
import { useInView } from '@/lib/motion';

export default function ActFour() {
  const head = useInView<HTMLDivElement>({ threshold: 0.25 });
  const list = useInView<HTMLUListElement>({ threshold: 0.12 });
  const contact = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="rb-act rb-act4" data-palette="4" data-act-index={4}>
      <div className="rb-wrap">
        <div ref={head.ref} className="rb-sect-head rb-rise" data-in={head.inView}>
          <h2 className="rb-sect-h">
            <span>{nav[2].labelEn}</span>
            {capability.labelKo}
          </h2>
          <p className="rb-body">{capability.body}</p>
        </div>

        <ul className="rb-cap-items">
          {capability.items.map((item, i) => (
            <CapItem key={item.title} index={i} {...item} />
          ))}
        </ul>

        <ul ref={list.ref} className="rb-clients rb-rise" data-in={list.inView}>
          {clients.map((c, i) => (
            <li key={c.name} className="rb-client">
              <span className="rb-client-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="rb-client-name">{c.name}</span>
              <span className="rb-client-scope">{c.scope}</span>
            </li>
          ))}
        </ul>

        <div ref={contact.ref} className="rb-cta rb-rise" data-in={contact.inView} id="contact">
          <p className="rb-eyebrow">{nav[3].labelEn}</p>
          <h2 className="rb-cta-h">
            {cta.contactHeadline}
            <i>?</i>
          </h2>
          <p className="rb-cta-body rb-body">{cta.contactBody}</p>

          <div className="rb-cta-row">
            <a className="rb-btn rb-btn-primary" href={`mailto:${company.email}`}>
              <span>{cta.primaryKo}</span>
              <i>{cta.primaryEn}</i>
            </a>
            <a className="rb-btn" href={`mailto:${company.email}`}>
              <span>{cta.secondaryKo}</span>
              <i>{cta.secondaryEn}</i>
            </a>
          </div>
        </div>

        <footer className="rb-footer">
          <p>{footer.copyright}</p>
          <ul>
            {footer.links.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <p>
            {company.base} · {company.baseEn} · <a href={`mailto:${company.email}`}>{company.email}</a> ·{' '}
            {company.domain}
          </p>
        </footer>
      </div>
    </section>
  );
}

function CapItem({
  index,
  title,
  detail,
  metric,
}: {
  index: number;
  title: string;
  detail: string;
  metric: string;
}) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.3 });
  return (
    <li
      ref={ref}
      className="rb-cap-item rb-rise"
      data-in={inView}
      style={{ transitionDelay: `${index * 110}ms` }}
    >
      <span className="rb-cap-metric">{metric}</span>
      <h3 className="rb-cap-title">{title}</h3>
      <p className="rb-cap-detail">{detail}</p>
    </li>
  );
}
