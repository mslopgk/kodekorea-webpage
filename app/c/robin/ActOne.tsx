'use client';

/**
 * 막1 — 거의 무채색 초저조도.
 * 배경: CSS 3D 원근으로 세운 바이닐 홈(동심원 링) + 스크롤에 따라
 *       중심의 검은 구멍으로 굴러가는 유리 구슬.
 * 본문: 히어로 헤드라인(글자 단위 회색→밝게) → 회사 소개.
 *
 * 본문은 전부 일반 흐름에 있고 배경만 sticky다.
 * → 모션이 죽어도 문구는 항상 화면에 있다.
 */

import { company } from '@/content/site';
import { useInView, useIsNarrow, useReducedMotion, useScrollProgress } from '@/lib/motion';
import { CharReveal, type Vars } from './parts';

const RINGS = 17;

export default function ActOne() {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const reduced = useReducedMotion();
  const narrow = useIsNarrow();
  const intro = useInView<HTMLDivElement>({ threshold: 0.35 });
  const p = reduced ? 0.12 : progress;

  const words = company.headline.split(' ');
  let cursor = 0;

  return (
    <section ref={ref} className="rb-act rb-act1" data-palette="1" data-act-index={1} id="top">
      <div className="rb-stickybg" aria-hidden="true">
        <div className="rb-groove" style={{ '--p': p } as Vars}>
          <div className="rb-groove-plane">
            {Array.from({ length: RINGS }, (_, i) => (
              <span key={i} className="rb-ring" style={{ '--i': RINGS - i } as Vars} />
            ))}
            <span className="rb-groove-hole" />
            {narrow ? null : <span className="rb-marble" />}
          </div>
        </div>
        {reduced ? null : <div className="rb-spec" />}
        <div className="rb-vignette" />
      </div>

      <div className="rb-flow">
        <div className="rb-wrap rb-hero">
          <p className="rb-eyebrow">{company.baseEn}</p>
          <h1 className="rb-hero-h rb-armed">
            <span className="rb-condensed">
              {words.map((w) => {
                const delay = 240 + cursor * 34;
                cursor += w.length;
                return (
                  <em key={w}>
                    <CharReveal text={w} delay={delay} />
                  </em>
                );
              })}
            </span>
          </h1>
          <p className="rb-hero-sub">{company.headlineSub}</p>

          <div className="rb-hero-meta">
            <p>{company.tagline}</p>
            <span>{company.taglineEn}</span>
          </div>
        </div>

        <div className="rb-wrap rb-intro" ref={intro.ref}>
          <div className="rb-intro-grid rb-rise" data-in={intro.inView}>
            <p className="rb-intro-lead">
              {company.nameKo}
              <b> / {company.nameEn}</b>
            </p>
            <p className="rb-body">{company.intro}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
