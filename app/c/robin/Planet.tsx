'use client';

/**
 * 우주 진입 — 와이어프레임 원근 격자 + 거대한 구체(행성).
 * `domains` 16개를 두 개의 궤도 링에 라벨로 붙인다.
 * CSS 3D transform만 사용(three.js 없음):
 *   .rb-orbit  가 rotateY 로 돌고,
 *   .rb-unrot  가 슬롯의 고정 각도를 되돌리고,
 *   .rb-face   가 역방향으로 같은 속도로 돌아 라벨이 카메라를 향한 채 남는다.
 *
 * 좁은 화면·모션 축소에서는 궤도를 버리고 칩 리스트로 폴백한다.
 */

import { company, domains } from '@/content/site';
import { useIsNarrow, useReducedMotion } from '@/lib/motion';
import type { Vars } from './parts';

const HALF = 8;

export default function Planet() {
  const narrow = useIsNarrow();
  const reduced = useReducedMotion();
  const fallback = narrow || reduced;

  if (fallback) {
    return (
      <div className="rb-wrap">
        <p className="rb-eyebrow">{company.taglineEn}</p>
        <ul className="rb-domain-list">
          {domains.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    );
  }

  const ringA = domains.slice(0, HALF);
  const ringB = domains.slice(HALF);

  return (
    <div className="rb-space">
      <div className="rb-stickybg">
        <div className="rb-space-grid" aria-hidden="true">
          <i />
        </div>

        <div className="rb-planet-scene">
          <div className="rb-planet-stage">
            <span className="rb-planet" aria-hidden="true" />
            <span className="rb-planet-ring" aria-hidden="true" />

            <div className="rb-orbit">
              {ringA.map((d, i) => {
                const a = `${(360 / HALF) * i}deg`;
                return (
                  <div
                    key={d}
                    className="rb-slot"
                    style={{ '--a': a, '--r': 'clamp(190px, 27vw, 380px)', '--y': '-84px' } as Vars}
                  >
                    <div className="rb-unrot" style={{ '--a': a } as Vars}>
                      <span className="rb-face">
                        <b>{d}</b>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rb-orbit" data-dir="rev">
              {ringB.map((d, i) => {
                const a = `${(360 / HALF) * i + 22.5}deg`;
                return (
                  <div
                    key={d}
                    className="rb-slot"
                    style={{ '--a': a, '--r': 'clamp(215px, 31vw, 430px)', '--y': '78px' } as Vars}
                  >
                    <div className="rb-unrot" style={{ '--a': a } as Vars}>
                      <span className="rb-face">
                        <b>{d}</b>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rb-space-cap">
          <b className="rb-num">{domains.length}</b>
          <span>{company.taglineEn}</span>
        </div>
      </div>
    </div>
  );
}
