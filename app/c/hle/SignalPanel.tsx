'use client';

import { capability, company, domains, pillars } from '@/content/site';
import { useTypewriter } from '@/lib/text';
import Clock from './Clock';
import GridSnake from './GridSnake';
import { vars } from './lib';

/**
 * 그리드 위 흩뿌려진 코드형 프로세스 라벨 좌표 (레퍼런스 #03 본문 진입 화면).
 * ≤1180px에서는 이 좌표를 쓰지 않고 좌측 하단 스택으로 전환된다(styles.ts).
 * --x: 82% + nowrap 라벨은 좁은 폭에서 오른쪽으로 잘려나가기 때문이다.
 */
const MARKS = [
  { code: pillars[0].code, label: pillars[0].labelEn, x: 63, y: 20 },
  { code: pillars[1].code, label: pillars[1].labelEn, x: 79, y: 40 },
  { code: pillars[2].code, label: pillars[2].labelEn, x: 68, y: 60 },
  { code: '04', label: capability.labelEn, x: 82, y: 78 },
];

/** 좁은 폭 스택의 좌측 여백 */
const STACK_LEFT = '6%';

/**
 * 사이트 내부 화면 = "지금 방송 중인 화면".
 *
 * 이 컴포넌트가 진입 시퀀스의 스크린 면 안에 100vw x 100vh 크기로 렌더된 뒤
 * scale(K)로 축소된다. 카메라가 스크린을 뷰포트 크기까지 확대하면 scale이 정확히 1로 돌아오므로
 * 진입 전에 보이던 축소 화면과 진입 후의 본문이 같은 픽셀이 된다.
 */
export default function SignalPanel({ live, snake }: { live: boolean; snake: boolean }) {
  const typed = useTypewriter(domains, live, { typeMs: 62, holdMs: 900 });

  return (
    <div className="hle-feed">
      <div className="hle-gridbg" />
      {snake ? <GridSnake count={1} step={340} trailLength={11} /> : null}

      <div className="hle-feed-marks" style={vars({ '--xm': STACK_LEFT })} aria-hidden>
        {MARKS.map((m) => (
          <span
            key={m.code}
            className="hle-mark"
            style={vars({ '--x': `${m.x}%`, '--y': `${m.y}%` })}
          >
            <i className="hle-sq" />
            <b>[{m.code}]</b>
            {m.label}
          </span>
        ))}
      </div>

      <div className="hle-feed-pad">
        <div className="hle-feed-top">
          <span className="hle-eyebrow">
            <i className="hle-sq hle-sq--on" />
            {company.nameEn}
          </span>
          <span className="hle-eyebrow">{company.baseEn}</span>
        </div>

        <div className="hle-feed-mid">
          <div className="hle-feed-copy">
            <p className="hle-eyebrow" style={{ marginBottom: '1.1em' }}>
              <i className="hle-sq" />
              {company.taglineEn}
            </p>
            <h1 className="hle-feed-h tight-ko">{company.headline}</h1>
            <p className="hle-feed-sub tight-ko">{company.headlineSub}</p>
          </div>
        </div>

        <div className="hle-feed-bot">
          <span className="hle-eyebrow" aria-hidden>
            <i className="hle-sq" />
            <span style={{ letterSpacing: '-0.01em', textTransform: 'none', fontSize: '1.15em' }}>
              {typed}
              <i className="hle-caret" />
            </span>
          </span>
          <Clock />
        </div>
      </div>
    </div>
  );
}
