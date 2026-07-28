'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { company, nav } from '@/content/site';
import { useIsNarrow, useReducedMotion } from '@/lib/motion';
import CapabilitySection from './CapabilitySection';
import ClientsSection from './ClientsSection';
import Clock from './Clock';
import ContactFooter from './ContactFooter';
import DomainsSection from './DomainsSection';
import EntrySequence from './EntrySequence';
import GridSnake from './GridSnake';
import IntroSection from './IntroSection';
import PillarsSection from './PillarsSection';
import Preloader from './Preloader';
import SignalPanel from './SignalPanel';
import { HLE_CSS } from './styles';
import ThemeToggle, { type Mode } from './ThemeToggle';

export default function HleConcept() {
  const reduced = useReducedMotion();
  const narrow = useIsNarrow();
  const [mode, setMode] = useState<Mode>('night');
  const [entered, setEntered] = useState(false);

  const toggleTheme = useCallback(() => {
    setMode((m) => (m === 'night' ? 'day' : 'night'));
  }, []);
  const finishPreload = useCallback(() => setEntered(true), []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HLE_CSS }} />

      <div className="hle" data-theme={mode}>
        {!entered ? <Preloader onDone={finishPreload} /> : null}

        {/* 사이트 전체에 깔리는 기술 도면 그리드 + 그리드를 따라 이동하는 시안 사각형.
            스크린 안의 방송 화면도 같은 그리드 피치를 쓰기 때문에, 카메라가 스크린을
            뷰포트 크기까지 확대하면 두 그리드가 겹쳐 이음선이 보이지 않는다. */}
        <div className="hle-bg" aria-hidden>
          <div className="hle-gridbg" />
          <GridSnake count={narrow ? 1 : 2} />
          <div className="hle-vign" />
        </div>

        <header className="hle-hdr">
          <nav className="hle-chip" aria-label={company.nameEn}>
            <ul className="hle-nav">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>
                    <i className="hle-navdot" aria-hidden />
                    {n.labelKo}
                    <span className="hle-nav-en">{n.labelEn}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/" className="hle-logo hle-chip">
            <span>{company.nameEn}</span>
          </Link>

          <div className="hle-hdr-right">
            <Clock />
            <ThemeToggle mode={mode} onToggle={toggleTheme} />
          </div>
        </header>

        <main className="hle-main">
          {reduced ? (
            /* 모션 축소: 진입 시퀀스의 최종 상태 — 스크린이 뷰포트를 가득 채운 화면 — 를 바로 보여준다 */
            <div style={{ position: 'relative', width: '100%', height: '100svh' }}>
              <SignalPanel live={false} snake={false} />
            </div>
          ) : (
            <EntrySequence narrow={narrow} onToggleTheme={toggleTheme} />
          )}

          <IntroSection />
          <PillarsSection />
          <CapabilitySection />
          <ClientsSection />
          <DomainsSection />
          <ContactFooter />
        </main>
      </div>
    </>
  );
}
