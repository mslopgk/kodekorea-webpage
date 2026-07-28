'use client';

/**
 * 막3 — 하이퍼스페이스.
 * 배경: Canvas 2D 시안·마젠타 광선(sticky) + 하프톤 도트 오버레이.
 * 본문: 운영 역량 헤드라인을 3D 압출 레트로 타이포로,
 *       사업축별 기술 스택을 같은 압출 타이포로 쌓는다.
 *
 * 본문은 일반 흐름이므로 캔버스가 없어도(WebGL 아님, 2D 실패 시에도)
 * 문구는 그대로 읽힌다.
 */

import { capability, nav, pillars } from '@/content/site';
import { useInView, useScrollProgress } from '@/lib/motion';
import Hyperspace from './Hyperspace';
import { RetroType } from './parts';

type Pillar = (typeof pillars)[number];

function StackRow({ pillar }: { pillar: Pillar }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className="rb-stack-row" data-in={inView}>
      <header>
        <span className="rb-stack-code">{pillar.code}</span>
        <span className="rb-stack-name">{pillar.project.name}</span>
      </header>
      <div className="rb-stack-items">
        {pillar.project.stack.map((s, i) => (
          <span key={s} style={{ transitionDelay: `${i * 90}ms` }}>
            <RetroType small>{s}</RetroType>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ActThree() {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const head = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <section ref={ref} className="rb-act" data-palette="3" data-act-index={3} id="capability">
      <div className="rb-stickybg">
        <Hyperspace progress={progress} />
        <div className="rb-halftone" aria-hidden="true" />
      </div>

      <div className="rb-flow">
        <div className="rb-wrap rb-act3-flow">
          <div ref={head.ref} className="rb-rise" data-in={head.inView}>
            <p className="rb-eyebrow">{nav[2].labelEn}</p>
            <div className="rb-retro-stack">
              {capability.labelEn.split(' ').map((word) => (
                <RetroType key={word}>{word}</RetroType>
              ))}
            </div>
            <h2 className="rb-act3-lead">{capability.labelKo}</h2>
            <p className="rb-act3-body rb-body">{capability.body}</p>
          </div>

          <div className="rb-stacks">
            {pillars.map((p) => (
              <StackRow key={p.id} pillar={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
