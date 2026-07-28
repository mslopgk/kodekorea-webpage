'use client';

import { company, pillars } from '@/content/site';
import { useScrollProgress } from '@/lib/motion';
import { lerp, range, smooth, useViewport, vars } from './lib';
import SignalPanel from './SignalPanel';

type Geo = ReturnType<typeof geometry>;

/**
 * 스크린 면을 뷰포트와 정확히 같은 비율(K배)로 만든다.
 * 그래야 dolly scale이 1/K가 되는 순간 스크린 = 뷰포트가 되고,
 * 스크린 안에서 scale(K)로 축소 렌더 중이던 본문이 정확히 100%로 복원된다.
 */
function geometry(w: number, h: number, narrow: boolean) {
  const K = narrow ? 0.5 : 0.34;
  // 반올림하지 않는다. SW를 정수로 맞추면 스크린 면(SW)과 그 안에서 scale(K)로 축소된
  // 본문(w*K)이 최대 1px 어긋나고, 진입 완료 시 그 오차가 1/K배로 확대돼 스크린 테두리에
  // --screen-off 색 실선이 남는다.
  const SW = w * K;
  const SH = h * K;
  const u = SW / 100;
  const bezel = Math.max(5, Math.round(u * 2));
  const pad = Math.max(9, Math.round(u * 3.6));
  let above = Math.max(narrow ? 40 : 90, Math.round(SH * (narrow ? 0.17 : 0.42)));
  let below = Math.max(narrow ? 34 : 78, Math.round(SH * (narrow ? 0.15 : 0.38)));
  const base = SH + bezel * 2 + pad * 2;
  const maxRH = h * 0.84;
  if (base + above + below > maxRH) {
    const room = Math.max(0, maxRH - base);
    const t = room / (above + below);
    above = Math.round(above * t);
    below = Math.round(below * t);
  }
  const RW = SW + bezel * 2 + pad * 2;
  const RH = base + above + below;
  const shift = RH / 2 - (pad + above + bezel + SH / 2);
  const depth = Math.round(RW * 0.2);
  return { K, SW, SH, u, bezel, pad, above, below, RW, RH, shift, depth };
}

function Blades({ g, opacity }: { g: Geo; opacity: number }) {
  return (
    <div className="hle-blades" style={{ height: g.above, opacity }} aria-hidden>
      {pillars.map((p, i) => (
        <div key={p.id} className="hle-blade">
          <span className="hle-blade-code">{p.code}</span>
          <span className="hle-blade-label">{p.labelEn}</span>
          <span className="hle-leds">
            {Array.from({ length: 6 }).map((_, k) => (
              <i
                key={k}
                className={k === 0 ? 'hle-led hle-led--on' : 'hle-led'}
                style={{ animationDelay: `${(i * 6 + k) * 0.17}s` }}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function EntrySequence({
  narrow,
  onToggleTheme,
}: {
  narrow: boolean;
  onToggleTheme: () => void;
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const vp = useViewport();
  const w = vp.w || 1440;
  const h = vp.h || 900;
  const g = geometry(w, h, narrow);

  const p = progress;
  const P1 = narrow ? 0.42 : 0.46; // 돌리 인 + 정면 정렬 완료
  const P2 = 0.84; // 스크린 = 뷰포트 도달. 이후 1까지는 체류 구간.

  const e1 = smooth(range(p, 0, P1));
  const tz = lerp(narrow ? -820 : -1480, 0, e1);
  const ry = narrow ? 0 : lerp(-19, 0, e1);
  const rx = narrow ? 0 : lerp(7.5, 0, e1);

  /**
   * 원본은 scale이 p=1에서야 1/K에 도달했다. p=1은 sticky 스테이지가 풀리는 지점과 정확히
   * 같으므로, "화면이 뷰포트가 된" 완성 프레임이 스크롤 거리 0으로 존재했다가 즉시 위로
   * 밀려나갔다 — 컨셉의 결말이 눈에 남지 않는다.
   * 여기서는 P2에서 확대를 끝내고 남은 구간(≈16%)을 정지 화면 체류로 쓴다.
   */
  const e2 = smooth(range(p, P1, P2));
  const scale = Math.pow(1 / g.K, e2);

  const plateO = 1 - range(p, 0.02, 0.22);
  const studioO = 1 - range(p, P1, 0.74);
  // 랙 프레임·베젤·스캔라인은 P2보다 먼저 사라져야 체류 구간에 이음선이 남지 않는다.
  const frameO = 1 - range(p, 0.6, 0.8);
  const scanO = 0.5 * (1 - range(p, 0.52, 0.78));
  const cueO = 1 - range(p, 0.62, 0.78);

  return (
    <div className="hle-seq" ref={ref} style={{ height: narrow ? '220vh' : '340vh' }}>
      <div className="hle-stage">
        <div className="hle-studio" style={{ opacity: studioO }} aria-hidden>
          <div className="hle-floor" />
          <div className="hle-horizon" />
          <div className="hle-spot" />
        </div>

        <div className="hle-dolly" style={{ transform: `scale(${scale.toFixed(4)})` }}>
          <div
            className="hle-rack"
            style={{
              ...vars({ '--u': `${g.u}px` }),
              width: g.RW,
              height: g.RH,
              transform: `translateY(${g.shift.toFixed(1)}px) translateZ(${tz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`,
            }}
          >
            {!narrow ? (
              <>
                <div
                  className="hle-rack-side"
                  style={{ width: g.depth, opacity: frameO * 0.9 }}
                  aria-hidden
                />
                <div
                  className="hle-rack-top"
                  style={{ height: g.depth, opacity: frameO * 0.9 }}
                  aria-hidden
                />
              </>
            ) : null}

            <div className="hle-rack-face" style={{ padding: g.pad }}>
              <div className="hle-rack-skin" style={{ opacity: frameO }} aria-hidden />

              <Blades g={g} opacity={frameO} />

              <div
                className="hle-screenframe"
                style={{ padding: g.bezel, width: g.SW + g.bezel * 2, height: g.SH + g.bezel * 2 }}
              >
                <div className="hle-bez" style={{ opacity: frameO }} aria-hidden />
                <div className="hle-screen" style={{ width: g.SW, height: g.SH }}>
                  <div
                    className="hle-feed-inner"
                    style={{ width: w, height: h, transform: `scale(${g.K})` }}
                  >
                    {/* 진입 전부터 스크린에는 사이트 내부가 실제로 렌더되고 있다 */}
                    <SignalPanel live snake={!narrow} />
                  </div>
                  <div className="hle-scan" style={{ opacity: scanO }} aria-hidden />
                  <div className="hle-screen-glow" style={{ opacity: scanO * 1.4 }} aria-hidden />
                </div>
              </div>

              <div className="hle-vents" style={{ height: g.below, opacity: frameO }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="hle-vent" />
                ))}
                {/* 원본은 이 물리 버튼에만 테마 전환을 걸어 접근성을 잃었다.
                    여기서는 헤더의 role="switch" 버튼이 정본이고 이쪽은 보조 컨트롤이다. */}
                <button
                  type="button"
                  className="hle-rack-btn"
                  onClick={onToggleTheme}
                  tabIndex={-1}
                  aria-hidden
                />
              </div>
            </div>

            <div className="hle-rack-foot" style={{ opacity: frameO }} aria-hidden>
              <i />
              <i />
            </div>
          </div>
        </div>

        <div className="hle-plate" style={{ opacity: plateO, transform: `translateY(${(-18 * (1 - plateO)).toFixed(1)}px)` }}>
          <p className="hle-plate-name mono">{company.nameEn}</p>
          <p className="hle-plate-tag tight-ko">
            <i className="hle-sq" />
            {company.tagline}
          </p>
        </div>

        <div className="hle-cue" style={{ opacity: cueO }} aria-hidden>
          <span>{company.baseEn}</span>
          <span className="hle-cue-arrow">
            <i />
            <span>↓</span>
          </span>
          <span>{String(Math.round(p * 100)).padStart(3, '0')} / 100</span>
        </div>
      </div>
    </div>
  );
}
