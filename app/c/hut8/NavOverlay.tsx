'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { company, footer, nav, pillars } from '@/content/site';
import type { Tone } from './useTone';

/** 사업축 아이콘 — 군집 오브젝트(도면 / 화면 / 서버)와 같은 은유를 쓴다 */
const ICONS: Record<string, ReactNode> = {
  solution: (
    <>
      <rect x="3.5" y="4.5" width="15" height="13" rx="1" />
      <path d="M3.5 8.5h15M7.5 8.5v9" />
      <circle cx="13.5" cy="12.5" r="2.2" />
    </>
  ),
  education: (
    <>
      <rect x="2.5" y="4.5" width="17" height="11" rx="1" />
      <path d="M8 18.5h6M11 15.5v3M6 8h4M6 11h7" />
    </>
  ),
  platform: (
    <>
      <rect x="3.5" y="3.5" width="15" height="5" rx="1" />
      <rect x="3.5" y="10" width="15" height="5" rx="1" />
      <path d="M6 6h1M6 12.5h1M11 18.5h0.01" />
      <path d="M11 15v3.5" />
    </>
  ),
};

export default function NavOverlay({ tone, active }: { tone: Tone; active: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className={`h8-top ${tone === 'light' && !open ? 'h8-top--onLight' : 'h8-top--onDark'}`}>
        <a className="h8-top__mark" href="#top">
          <span>{company.nameEn}</span>
          <span>{company.baseEn}</span>
        </a>

        <nav className="h8-top__nav" aria-label={company.nameKo}>
          {nav.map((n) => (
            <a
              key={n.href}
              className="h8-top__link"
              href={n.href}
              aria-current={active === n.href.slice(1) ? 'true' : undefined}
            >
              {n.labelKo}
            </a>
          ))}
        </nav>

        <button
          className="h8-pill"
          type="button"
          aria-expanded={open}
          aria-controls="h8-nav-overlay"
          onClick={() => setOpen((v) => !v)}
        >
          {company.nameKo}
          <span className="h8-pill__bars" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <div className="h8-ov" id="h8-nav-overlay" data-open={open} aria-hidden={!open}>
        <div className="h8-ov__cols">
          <div className="h8-ov__col--a">
            <p className="h8-eyebrow">
              01 <b>{company.nameEn}</b>
            </p>
            <ul className="h8-ov__list">
              {nav.map((n, i) => (
                <li
                  key={n.href}
                  className="h8-ov__item"
                  style={{ '--d': `${120 + i * 70}ms` } as CSSProperties}
                >
                  <a
                    className="h8-ov__main"
                    href={n.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === n.href.slice(1) ? 'true' : undefined}
                    tabIndex={open ? 0 : -1}
                  >
                    {n.labelKo}
                    <em>{n.labelEn}</em>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="h8-ov__col--b">
            <p className="h8-eyebrow">
              02 <b>{nav[0].labelEn}</b>
            </p>
            <ul className="h8-ov__list">
              {pillars.map((p, i) => (
                <li
                  key={p.id}
                  className="h8-ov__item"
                  style={{ '--d': `${200 + i * 70}ms` } as CSSProperties}
                >
                  <a
                    className="h8-ov__biz"
                    href={`#work-${p.id}`}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                  >
                    <span className="h8-ov__ico" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#fff" strokeWidth="1.2">
                        {ICONS[p.id]}
                      </svg>
                    </span>
                    <span>
                      <b>{p.labelKo}</b>
                      <small>
                        {p.code} · {p.labelEn}
                      </small>
                    </span>
                    <span className="h8-ov__arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h8-ov__foot">
          <span>{company.tagline}</span>
          <ul>
            {footer.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} tabIndex={open ? 0 : -1}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${company.email}`} tabIndex={open ? 0 : -1}>
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
