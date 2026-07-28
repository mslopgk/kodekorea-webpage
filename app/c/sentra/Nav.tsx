'use client';

import { useEffect, useState } from 'react';
import { company, cta, nav } from '@/content/site';
import s from './sentra.module.css';
import { Scr } from './Scramble';

type Tone = 'dark' | 'light';

/**
 * 섹션 명암 반전에 맞춰 네비/버튼 색을 자동으로 뒤집는다.
 * 네비 라인 높이에 걸쳐 있는 [data-tone] 섹션을 찾아 톤을 결정.
 * 같은 스캔에서 현재 보고 있는 네비 대상 섹션도 함께 판정한다.
 */
function useTone(): { tone: Tone; pct: number; active: string } {
  const [tone, setTone] = useState<Tone>('dark');
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState<string>(nav[0].href);

  useEffect(() => {
    // 네비/진행바/레일 자신도 [data-tone]을 갖고 있으므로 섹션만 골라낸다
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-tone]'));
    const targets: { href: string; el: HTMLElement }[] = [];
    for (const item of nav) {
      const el = document.getElementById(item.href.slice(1));
      if (el) targets.push({ href: item.href, el });
    }
    let raf = 0;

    const update = () => {
      raf = 0;
      const line = 40;
      let next: Tone = 'dark';
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) next = (el.dataset.tone as Tone) ?? 'dark';
      }
      setTone(next);

      // 문서 순서 = 네비 순서이므로, 라인을 지나간 마지막 대상이 현재 섹션
      let nextActive: string = nav[0].href;
      for (const t of targets) {
        if (t.el.getBoundingClientRect().top <= line + 8) nextActive = t.href;
      }
      setActive(nextActive);

      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { tone, pct, active };
}

export function Nav() {
  const { tone, pct, active } = useTone();

  return (
    <>
      <div className={s.progress} data-tone={tone} aria-hidden>
        <span className={s.progressBar} style={{ transform: `scaleX(${pct})` }} />
      </div>

      <header className={s.nav} data-tone={tone}>
        <a href="#top" className={s.brand}>
          <span className={s.brandMark} aria-hidden>
            KK
          </span>
          <span className={s.brandName}>{company.nameKo}</span>
          <span className={`mono ${s.brandEn}`}>{company.nameEn.toUpperCase()}</span>
        </a>

        <nav className={s.pill} aria-label={company.nameEn}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={s.pillItem}
              data-active={active === item.href}
              aria-current={active === item.href ? 'true' : undefined}
            >
              <span className={s.pillKo}>{item.labelKo}</span>
              <span className={`mono ${s.pillEn}`}>{item.labelEn}</span>
            </a>
          ))}
        </nav>

        <a href={nav[3].href} className={s.navCta}>
          <span className={s.iconBox} aria-hidden>
            →
          </span>
          <span className={`mono ${s.navCtaLabel}`}>{cta.primaryEn.toUpperCase()}</span>
        </a>
      </header>

      <div className={s.rail} data-tone={tone} aria-hidden>
        <span className="mono">{String(Math.round(pct * 100)).padStart(3, '0')}</span>
        <span className={s.railLine} />
        <span className="mono">
          <Scr text={company.domain.toUpperCase()} />
        </span>
      </div>
    </>
  );
}
