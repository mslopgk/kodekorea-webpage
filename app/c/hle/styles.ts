/**
 * 컨셉 C — 서사형 (레퍼런스 #03 hle.io)
 *
 * 공용 globals.css를 수정할 수 없으므로 이 컨셉의 스타일은 문자열로 갖고 있다가
 * page.tsx에서 <style>로 한 번만 주입한다. 모든 선택자는 .hle 스코프 안에 둔다.
 */
export const HLE_CSS = `
/* ── 팔레트 토큰 (Night 기본 / Day 오버라이드) ───────────────── */
.hle {
  --bg:    #101011;
  --bg2:   #16161a;
  --panel: #1a1a1f;
  --fg:    #ffffff;
  --grey:  #cbcbcb;
  --muted: #8c8c93;
  --line:  #2c2c31;
  --hair:  #3a3a40;
  --acc:   #32a4c3;
  --acc-t: #74cbe0;
  --on:    #46ba67;
  --grid:  rgba(255,255,255,.045);
  --grid2: rgba(255,255,255,.085);
  --spot:  rgba(220,240,248,.11);
  --floor1: #1b1c1f;
  --floor2: #0b0b0c;
  --screen-off: #07090b;
  --ez: cubic-bezier(.2,0,.8,1);
  --eq: cubic-bezier(.22,1,.36,1);
  color-scheme: dark;
  background: var(--bg);
  color: var(--fg);
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  overflow-x: clip;
  transition: background-color 1100ms var(--ez), color 1100ms var(--ez);
}
.hle[data-theme='day'] {
  --bg:    #e3e4e6;
  --bg2:   #eeeef0;
  --panel: #f7f7f8;
  --fg:    #101011;
  --grey:  #3a3a40;
  --muted: #6b6b74;
  --line:  #c5c6c9;
  --hair:  #adaeb2;
  --acc:   #157c99;
  --acc-t: #0f6379;
  --on:    #2c8c48;
  --grid:  rgba(16,16,17,.055);
  --grid2: rgba(16,16,17,.105);
  --spot:  rgba(255,255,255,.9);
  --floor1: #dcddde;
  --floor2: #b9babd;
  --screen-off: #cfd1d3;
  color-scheme: light;
}

/* ── 기술 도면풍 그리드 ───────────────────────────────────── */
.hle-gridbg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid) 1px, transparent 1px),
    linear-gradient(to right, var(--grid2) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid2) 1px, transparent 1px);
  background-size: 48px 48px, 48px 48px, 288px 288px, 288px 288px;
  background-position: 0 0, 0 0, 0 0, 0 0;
  transition: background-image 1100ms var(--ez);
}
.hle-vign {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 90% at 50% 0%, transparent 40%, var(--bg) 100%);
  opacity: .8;
}
.hle-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.hle-snake { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.hle-main { position: relative; z-index: 1; }

/* ── 타이포 ─────────────────────────────────────────────── */
.hle-col   { width: 100%; max-width: 892px;  margin-inline: auto; padding-inline: 24px; }
.hle-wide  { width: 100%; max-width: 1180px; margin-inline: auto; padding-inline: 24px; }
.hle-sec   { padding-block: 96px; position: relative; }
.hle-sec--lg { padding-block: 144px; }

.hle-h1 { font-size: clamp(40px, 6.4vw, 118px); line-height: 1; letter-spacing: -.02em; font-weight: 600; margin: 0; }
.hle-h2 { font-size: clamp(30px, 4.2vw, 68px);  line-height: 1.02; letter-spacing: -.02em; font-weight: 600; margin: 0; }
.hle-h3 { font-size: clamp(21px, 2.1vw, 34px);  line-height: 1.14; letter-spacing: -.02em; font-weight: 600; margin: 0; }
.hle-lead { font-size: clamp(16px, 1.35vw, 21px); line-height: 1.62; color: var(--grey); margin: 0; }
.hle-body { font-size: 15px; line-height: 1.78; color: var(--muted); margin: 0; }
.hle-en   { letter-spacing: -.04em; }

.hle-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}
.hle-sq { width: 6px; height: 6px; background: var(--acc); flex: none; display: inline-block; }
.hle-sq--on { background: var(--on); }
.hle-hair { height: 1px; background: var(--hair); width: 100%; border: 0; margin: 0; }
.hle-vert {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .24em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}
.hle-clock { font-family: var(--font-mono); font-size: 11px; letter-spacing: .1em; color: var(--muted); font-variant-numeric: tabular-nums; }

/* ── 헤더 ───────────────────────────────────────────────── */
.hle-hdr {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 60;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  pointer-events: none;
}
.hle-hdr > * { pointer-events: auto; }
.hle-chip {
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  backdrop-filter: blur(9px);
  border: 1px solid var(--line);
  border-radius: 2px;
  transition: background-color 1100ms var(--ez), border-color 1100ms var(--ez);
}
.hle-nav { list-style: none; margin: 0; padding: 8px 12px; display: flex; flex-direction: column; gap: 7px; }
.hle-nav a {
  display: flex; align-items: center; gap: 9px;
  font-family: var(--font-mono); font-size: 12px; letter-spacing: -.01em;
  color: var(--grey); text-decoration: none;
  transition: color 220ms var(--ez);
}
.hle-nav a:hover, .hle-nav a:focus-visible { color: var(--fg); }
.hle-nav a:hover .hle-navdot { background: var(--acc); border-color: var(--acc); }
.hle-navdot { width: 6px; height: 6px; border-radius: 50%; border: 1px solid var(--hair); flex: none; transition: background-color 220ms, border-color 220ms; }
.hle-nav .hle-nav-en { color: var(--muted); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; }

.hle-logo {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: .06em;
  padding: 9px 13px;
  color: var(--fg);
  position: relative;
  text-transform: uppercase;
}
.hle-logo span { position: relative; display: inline-block; animation: hle-glitch 7s steps(1, end) infinite; }
@keyframes hle-glitch {
  0%, 92%, 100% { transform: none; clip-path: none; opacity: 1; }
  93% { transform: translate(1.5px, -1px); }
  94% { transform: translate(-2px, 1px); clip-path: inset(30% 0 20% 0); }
  95% { transform: translate(1px, 1px); }
  96% { transform: translate(-1px, 0); clip-path: inset(0 0 55% 0); }
  97% { transform: none; }
}
.hle-hdr-right { display: flex; align-items: center; gap: 10px; }

/* ── Day/Night 스위치 ───────────────────────────────────── */
.hle-switch {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 8px 11px;
  font-family: var(--font-mono); font-size: 12px;
  color: var(--grey); cursor: pointer;
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  border: 1px solid var(--line); border-radius: 2px;
  transition: color 220ms, border-color 220ms;
}
.hle-switch:hover { color: var(--fg); border-color: var(--hair); }
.hle-switch:focus-visible { outline: 2px solid var(--acc); outline-offset: 2px; }
.hle-track { width: 30px; height: 15px; border-radius: 999px; border: 1px solid var(--hair); position: relative; flex: none; }
.hle-knob {
  position: absolute; top: 1px; left: 1px; width: 11px; height: 11px; border-radius: 50%;
  background: var(--muted);
  transition: transform 420ms var(--eq), background-color 420ms var(--ez), box-shadow 420ms;
}
.hle-switch[aria-checked='true'] .hle-knob { transform: translateX(15px); background: var(--on); box-shadow: 0 0 8px color-mix(in srgb, var(--on) 70%, transparent); }
.hle-glyph { width: 14px; text-align: center; opacity: .55; transition: opacity 300ms; }
.hle-switch[aria-checked='false'] .hle-glyph--d,
.hle-switch[aria-checked='true'] .hle-glyph--n { opacity: 1; color: var(--fg); }

/* ── 프리로더 ───────────────────────────────────────────── */
.hle-pre {
  position: fixed; inset: 0; z-index: 100;
  background: #101011; color: #fff;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 24px;
  transform: translateY(0);
  transition: transform 780ms var(--eq);
}
.hle-pre--out { transform: translateY(-101%); }
.hle-pre-mid { display: flex; flex-direction: column; gap: 14px; }
.hle-pre-l1 { font-size: clamp(26px, 4.6vw, 74px); line-height: 1.04; letter-spacing: -.02em; font-weight: 600; color: #fff; margin: 0; }
.hle-pre-l2 { font-size: clamp(26px, 4.6vw, 74px); line-height: 1.04; letter-spacing: -.02em; font-weight: 600; color: #32a4c3; margin: 0; min-height: 1.04em; }
.hle-caret { display: inline-block; width: .06em; min-width: 3px; height: .84em; background: currentColor; vertical-align: -.06em; margin-left: .1em; animation: hle-blink 1s steps(1,end) infinite; }
@keyframes hle-blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
.hle-pre-bar { height: 1px; background: #2c2c31; position: relative; overflow: hidden; }
.hle-pre-bar i { position: absolute; inset: 0 auto 0 0; background: #32a4c3; animation: hle-load 2150ms var(--ez) forwards; }
@keyframes hle-load { from { width: 4% } to { width: 100% } }
.hle-pre-row { display: flex; justify-content: space-between; gap: 16px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: #8c8c93; }

/* ── 진입 시퀀스 ─────────────────────────────────────────── */
.hle-seq { position: relative; }
.hle-stage { position: sticky; top: 0; height: 100svh; overflow: hidden; }
.hle-studio { position: absolute; inset: 0; overflow: hidden; }
.hle-floor {
  position: absolute; left: -55%; right: -55%; top: 62%; height: 95%;
  transform-origin: 50% 0%;
  transform: perspective(760px) rotateX(71deg);
  background-image:
    repeating-linear-gradient(to right, var(--grid2) 0 1px, transparent 1px 96px),
    repeating-linear-gradient(to bottom, var(--grid2) 0 1px, transparent 1px 96px),
    linear-gradient(to bottom, var(--floor1), var(--floor2));
  mask-image: linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%);
}
.hle-horizon {
  position: absolute; left: 0; right: 0; top: 62%; height: 1px;
  background: linear-gradient(to right, transparent, var(--hair) 22%, var(--hair) 78%, transparent);
}
.hle-spot {
  position: absolute; inset: 0;
  background:
    radial-gradient(44% 52% at 50% -6%, var(--spot), transparent 74%),
    radial-gradient(34% 16% at 50% 66%, color-mix(in srgb, var(--spot) 70%, transparent), transparent 76%);
}
.hle-dolly {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  perspective: 1700px;
  perspective-origin: 50% 50%;
  will-change: transform;
}

/* 랙 3D */
.hle-rack {
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
}
.hle-rack-face {
  position: relative;
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
}
.hle-rack-skin {
  position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(160deg, var(--panel), var(--bg2) 70%);
  border: 1px solid var(--line);
  box-shadow: 0 40px 90px -30px rgba(0,0,0,.6);
  transition: background 1100ms var(--ez), border-color 1100ms var(--ez);
}
.hle-rack-side, .hle-rack-top {
  position: absolute;
  background: linear-gradient(to right, var(--bg2), var(--floor2));
  border: 1px solid var(--line);
}
/* rotateY(-19deg)에서는 오른쪽 측면이 보이는 면이다 */
.hle-rack-side { top: 0; height: 100%; left: 100%; transform-origin: left center; transform: rotateY(90deg); }
.hle-rack-top  { left: 0; width: 100%; top: 0; transform-origin: center top; transform: rotateX(-90deg); }

.hle-blades { position: relative; z-index: 1; display: flex; flex-direction: column; gap: calc(var(--u) * .5); }
.hle-blade {
  flex: 1;
  display: flex; align-items: center; gap: calc(var(--u) * 1.2);
  padding-inline: calc(var(--u) * 1.4);
  border: 1px solid var(--line);
  background: linear-gradient(to bottom, color-mix(in srgb, var(--fg) 5%, transparent), transparent);
  font-family: var(--font-mono);
  font-size: max(7px, calc(var(--u) * 1.85));
  letter-spacing: .04em;
  color: var(--grey);
  overflow: hidden;
  white-space: nowrap;
}
.hle-blade-code { color: var(--acc-t); }
.hle-blade-label { color: var(--muted); text-transform: uppercase; letter-spacing: .12em; overflow: hidden; text-overflow: ellipsis; }
.hle-leds { margin-left: auto; display: flex; gap: calc(var(--u) * .45); flex: none; }
.hle-led {
  width: max(2px, calc(var(--u) * .8)); height: max(2px, calc(var(--u) * .8));
  background: var(--hair);
  animation: hle-led 2.2s steps(1,end) infinite;
}
.hle-led--on { background: var(--on); animation: none; box-shadow: 0 0 calc(var(--u)*1.2) color-mix(in srgb, var(--on) 60%, transparent); }
@keyframes hle-led { 0%,40% { background: var(--acc) } 41%,100% { background: var(--hair) } }
.hle-vents { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: center; gap: calc(var(--u) * .55); padding-inline: calc(var(--u) * 1.4); }
.hle-vent { height: 1px; background: var(--line); }

/* 스크린 */
.hle-screenframe { position: relative; z-index: 1; flex: none; }
.hle-bez {
  position: absolute; inset: 0;
  background: linear-gradient(165deg, #131417, #07080a);
  border: 1px solid var(--hair);
}
.hle[data-theme='day'] .hle-bez { background: linear-gradient(165deg, #d5d6d8, #a9aaad); }
.hle-screen {
  position: relative; z-index: 1;
  overflow: hidden;
  background: var(--screen-off);
}
.hle-feed-inner {
  position: absolute; top: 0; left: 0;
  transform-origin: 0 0;
}
.hle-scan {
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(to bottom, rgba(0,0,0,.22) 0 1px, transparent 1px 3px);
  mix-blend-mode: multiply;
}
.hle[data-theme='day'] .hle-scan {
  background: repeating-linear-gradient(to bottom, rgba(16,16,17,.07) 0 1px, transparent 1px 4px);
}
.hle-screen-glow {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(120% 100% at 50% 0%, color-mix(in srgb, var(--acc) 12%, transparent), transparent 62%);
}
.hle-rack-btn {
  position: absolute;
  right: calc(var(--u) * 2);
  bottom: calc(var(--u) * .8);
  width: calc(var(--u) * 3.2); height: calc(var(--u) * 3.2);
  border-radius: 50%;
  border: 1px solid var(--hair);
  background: radial-gradient(circle at 34% 30%, color-mix(in srgb, var(--fg) 22%, transparent), #0c0c0d 70%);
  cursor: pointer;
}
.hle-rack-foot { position: absolute; left: 0; right: 0; bottom: calc(var(--u) * -1.1); height: calc(var(--u) * 1.1); display: flex; justify-content: space-between; }
.hle-rack-foot i { width: calc(var(--u) * 5); background: var(--floor2); border: 1px solid var(--line); border-top: 0; }

/* 브랜드 플레이트 (진입 전) */
.hle-plate {
  position: absolute; inset: auto 0 auto 0; top: 12vh;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  text-align: center; padding-inline: 24px;
  will-change: opacity, transform;
}
.hle-plate-name {
  font-family: var(--font-mono);
  font-size: clamp(34px, 8vw, 132px);
  line-height: .92;
  letter-spacing: -.05em;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1px var(--fg);
  margin: 0;
}
.hle-plate-tag {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-mono);
  font-size: clamp(12px, 1.05vw, 16px);
  letter-spacing: 0;
  color: var(--grey);
  margin: 0;
}
.hle-cue {
  position: absolute; left: 24px; right: 24px; bottom: 20px;
  display: flex; align-items: flex-end; justify-content: space-between; gap: 16px;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: .16em; color: var(--muted);
}
.hle-cue-arrow { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.hle-cue-arrow i { width: 1px; height: 34px; background: linear-gradient(to bottom, transparent, var(--acc)); }
.hle-cue-arrow span { color: var(--acc); animation: hle-bob 1.8s var(--ez) infinite; }
@keyframes hle-bob { 0%,100% { transform: translateY(0); opacity: .6 } 50% { transform: translateY(4px); opacity: 1 } }

/* ── 피드(=사이트 내부 축소 방송) ────────────────────────── */
.hle-feed { position: relative; width: 100%; height: 100%; overflow: hidden; background: var(--bg); }
/* 상단 패딩은 고정 헤더 높이를 비켜야 한다. 진입이 끝나면 이 화면이 뷰포트를 그대로 채우므로,
   3.4vh만 두면 상단 행(회사명 / 거점)이 헤더 칩 뒤로 완전히 가려진다.
   (실측 1920~2133폭: 헤더 0~161px vs 상단 행 y 31~48 — 좌우 모두 칩 아래에 깔렸다) */
.hle-feed-pad { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 3.4vh 3vw; padding-top: max(3.4vh, 178px); }
.hle-feed-top, .hle-feed-bot { display: flex; align-items: center; justify-content: space-between; gap: 2vw; }
.hle-feed-mid { display: flex; align-items: flex-end; gap: 3vw; }
.hle-feed-copy { max-width: 58%; }
.hle-feed-h { font-size: clamp(30px, 5.4vw, 104px); line-height: 1; letter-spacing: -.02em; font-weight: 600; margin: 0; }
.hle-feed-sub { font-size: clamp(13px, 1.45vw, 24px); line-height: 1.4; color: var(--grey); margin-top: .5em; }
.hle-feed-marks { position: absolute; inset: 0; pointer-events: none; }
/* top에 하한을 두지 않으면 세로가 짧은 뷰포트에서 첫 라벨(--y: 20%)이 고정 헤더 뒤로 들어간다 */
.hle-mark { position: absolute; left: var(--x); top: max(var(--y), 178px); display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: clamp(9px, .78vw, 13px); letter-spacing: .14em; text-transform: uppercase; color: var(--grey); white-space: nowrap; }
.hle-mark::before { content: ''; position: absolute; left: 3px; top: 50%; width: 46px; height: 1px; background: var(--acc); opacity: .35; transform: translateX(-46px); }
.hle-mark b { color: var(--acc-t); font-weight: 400; }
/* 좌측 스택으로 내리는 기준을 900px에서 1180px로 올린다.
   --x: 82% + nowrap 라벨(≈168px)은 실측 893px 폭에서 오른쪽으로 8px 넘쳐 잘렸다.
   (.hle-feed의 overflow:hidden이 가로 스크롤은 막지만 문구가 잘린다) */
@media (max-width: 1180px) {
  .hle-feed-copy { max-width: 100%; }
  .hle-feed-mid { flex-direction: column; align-items: flex-start; }
  /* 좌측 스택은 --ym 퍼센트로 두면 뷰포트 높이에 따라 서브 헤드라인·하단 행과 겹친다.
     하단에서 역으로 쌓아 두 행 사이에 항상 들어가게 한다. */
  .hle-feed-marks {
    inset: auto auto 13vh var(--xm);
    display: flex; flex-direction: column; align-items: flex-start; gap: 4.2vh;
  }
  .hle-mark { position: relative; left: auto; top: auto; }
  .hle-mark::before { display: none; }
}

/* ── 회사 소개 ──────────────────────────────────────────── */
.hle-intro-grid { display: grid; gap: 48px; grid-template-columns: 1fr; align-items: start; }
@media (min-width: 1024px) {
  .hle-intro-grid { grid-template-columns: minmax(0,1fr) 420px; gap: 72px; }
  .hle-drawing { position: sticky; top: 96px; }
}
.hle-drawing { border: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 60%, transparent); padding: 16px; max-width: 420px; }
.hle-drawing svg { width: 100%; height: auto; display: block; }
.hle-draw path, .hle-draw circle, .hle-draw line, .hle-draw rect {
  fill: none; stroke: var(--hair); stroke-width: 1; vector-effect: non-scaling-stroke;
  stroke-dasharray: 1; stroke-dashoffset: 1;
}
.hle-draw .ray { stroke: var(--line); transition: stroke-dashoffset 1200ms var(--eq); }
.hle-draw .acc { stroke: var(--acc); }
.hle-draw .fill { fill: var(--acc); stroke: none; stroke-dasharray: none; stroke-dashoffset: 0; }
.hle-draw--in path, .hle-draw--in circle, .hle-draw--in line, .hle-draw--in rect { stroke-dashoffset: 0; transition: stroke-dashoffset 1500ms var(--eq); }
.hle-draw--in *:nth-child(2) { transition-delay: 120ms }
.hle-draw--in *:nth-child(3) { transition-delay: 240ms }
.hle-draw--in *:nth-child(4) { transition-delay: 360ms }
.hle-draw--in *:nth-child(5) { transition-delay: 480ms }
.hle-draw--in *:nth-child(6) { transition-delay: 600ms }
.hle-draw--in *:nth-child(7) { transition-delay: 720ms }
.hle-draw--in *:nth-child(8) { transition-delay: 840ms }
.hle-drawing figcaption { font-family: var(--font-mono); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); margin-top: 12px; display: flex; justify-content: space-between; gap: 10px; }

/* ── 사업축 ─────────────────────────────────────────────── */
.hle-pillar { border-top: 1px solid var(--hair); padding-top: 28px; margin-top: 96px; }
.hle-pillar:first-child { margin-top: 0; }
.hle-pillar-head { display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; }
.hle-pillar-code { font-family: var(--font-mono); font-size: 12px; letter-spacing: .16em; color: var(--acc-t); }
.hle-pillar-en { font-family: var(--font-mono); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); }
.hle-reveal { opacity: 0; transform: translateY(18px); transition: opacity 800ms var(--eq), transform 800ms var(--eq); }
.hle-reveal--in { opacity: 1; transform: none; }

.hle-card { border: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 68%, transparent); margin-top: 32px; }
.hle-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 20px 22px; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
.hle-card-name { font-family: var(--font-mono); font-size: 17px; letter-spacing: -.02em; color: var(--fg); margin: 0; }
.hle-card-sub { font-size: 13px; color: var(--muted); margin-top: 5px; }
.hle-tag { font-family: var(--font-mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--grey); border: 1px solid var(--hair); padding: 5px 9px; white-space: nowrap; }
.hle-card-body { padding: 20px 22px; }
.hle-metrics { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); border-top: 1px solid var(--line); }
@media (min-width: 720px) { .hle-metrics { grid-template-columns: repeat(4, minmax(0,1fr)); } }
.hle-metric { padding: 18px 22px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.hle-metric:last-child { border-right: 0; }
@media (max-width: 719px) { .hle-metric:nth-child(2n) { border-right: 0; } }
.hle-metric-v { font-family: var(--font-mono); font-size: clamp(22px, 2.4vw, 34px); line-height: 1; letter-spacing: -.04em; color: var(--fg); font-variant-numeric: tabular-nums; }
.hle-metric-v em { font-style: normal; font-size: .48em; color: var(--acc-t); margin-left: .22em; letter-spacing: 0; }
.hle-metric-l { font-size: 12px; line-height: 1.5; color: var(--muted); margin-top: 9px; }
.hle-stack { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 22px; }
.hle-chip { font-family: var(--font-mono); font-size: 10px; letter-spacing: .1em; color: var(--grey); border: 1px solid var(--line); padding: 5px 9px; }

/* 사업축 블레이드 미니 시각화 */
.hle-blade3d {
  perspective: 820px;
  height: 180px;
  overflow: hidden;
  display: flex; align-items: center; justify-content: flex-end;
  margin-top: 24px;
}
.hle-blade3d-in {
  width: 240px;
  transform: rotateX(54deg) rotateZ(-20deg);
  transform-style: preserve-3d;
  display: flex; flex-direction: column; gap: 9px;
  transition: transform 900ms var(--eq);
}
.hle-pillar:hover .hle-blade3d-in { transform: rotateX(48deg) rotateZ(-14deg); }
.hle-blade3d-row { height: 28px; border: 1px solid var(--line); display: flex; align-items: center; gap: 9px; padding-inline: 11px; background: color-mix(in srgb, var(--panel) 78%, transparent); font-family: var(--font-mono); font-size: 9px; letter-spacing: .14em; color: var(--muted); white-space: nowrap; overflow: hidden; }
.hle-blade3d-row i { width: 5px; height: 5px; background: var(--hair); }
.hle-blade3d-row i.on { background: var(--on); }
.hle-blade3d-row i.acc { background: var(--acc); }

/* ── 아코디언 ───────────────────────────────────────────── */
.hle-acc { border-top: 1px solid var(--hair); margin-top: 40px; }
.hle-acc-item { border-bottom: 1px solid var(--hair); }
.hle-acc-btn {
  width: 100%; background: none; border: 0; cursor: pointer;
  display: flex; align-items: center; gap: 18px;
  padding: 22px 0; text-align: left; color: var(--fg);
  font-family: var(--font-sans); font-size: clamp(16px, 1.6vw, 22px); letter-spacing: -.02em;
  transition: color 220ms;
}
.hle-acc-btn:hover { color: var(--acc-t); }
.hle-acc-btn:focus-visible { outline: 2px solid var(--acc); outline-offset: 3px; }
.hle-acc-idx { font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em; color: var(--muted); flex: none; }
.hle-acc-metric { margin-left: auto; font-family: var(--font-mono); font-size: 12px; letter-spacing: -.02em; color: var(--acc-t); flex: none; }
.hle-acc-pm { flex: none; width: 15px; height: 15px; position: relative; }
.hle-acc-pm::before, .hle-acc-pm::after { content: ''; position: absolute; background: currentColor; }
.hle-acc-pm::before { left: 0; right: 0; top: 7px; height: 1px; }
.hle-acc-pm::after  { top: 0; bottom: 0; left: 7px; width: 1px; transition: transform 380ms var(--eq); }
.hle-acc-btn[aria-expanded='true'] .hle-acc-pm::after { transform: scaleY(0); }
.hle-acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 460ms var(--eq); }
.hle-acc-panel--open { grid-template-rows: 1fr; }
.hle-acc-panel > div { overflow: hidden; }
.hle-acc-panel p { margin: 0 0 24px; padding-left: 33px; max-width: 62ch; font-size: 14px; line-height: 1.75; color: var(--muted); }
@media (max-width: 640px) {
  .hle-acc-metric { display: none; }
  .hle-acc-panel p { padding-left: 0; }
}

/* ── 협업 이력 ──────────────────────────────────────────── */
.hle-clients { list-style: none; margin: 40px 0 0; padding: 0; border-top: 1px solid var(--hair); }
.hle-client { border-bottom: 1px solid var(--hair); display: flex; align-items: baseline; gap: 18px; padding: 20px 0; flex-wrap: wrap; transition: padding-left 420ms var(--eq); }
.hle-client:hover { padding-left: 10px; }
.hle-client-i { font-family: var(--font-mono); font-size: 11px; color: var(--muted); flex: none; letter-spacing: .14em; }
.hle-client-n { font-size: clamp(18px, 2vw, 28px); letter-spacing: -.02em; font-weight: 500; }
.hle-client-s { margin-left: auto; font-size: 13px; color: var(--muted); }

/* ── 기술 영역 ──────────────────────────────────────────── */
.hle-marq { position: relative; overflow: hidden; border-block: 1px solid var(--hair); margin-block: 56px; }
.hle-marq-row { display: flex; width: max-content; animation: hle-marq 46s linear infinite; }
.hle-marq-row > span { display: flex; align-items: center; gap: 18px; padding: 15px 18px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; color: var(--muted); white-space: nowrap; }
@keyframes hle-marq { from { transform: translateX(0) } to { transform: translateX(-50%) } }
.hle-marq:hover .hle-marq-row { animation-play-state: paused; }
.hle-domains { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); }
@media (min-width: 900px) { .hle-domains { grid-template-columns: repeat(4, minmax(0,1fr)); } }
.hle-domain { border-top: 1px solid var(--line); border-right: 1px solid var(--line); padding: 16px 14px 20px; display: flex; flex-direction: column; gap: 10px; min-height: 92px; }
.hle-domain:nth-child(2n) { border-right: 0; }
@media (min-width: 900px) { .hle-domain:nth-child(2n) { border-right: 1px solid var(--line); } .hle-domain:nth-child(4n) { border-right: 0; } }
.hle-domain-i { font-family: var(--font-mono); font-size: 10px; letter-spacing: .16em; color: var(--muted); display: flex; align-items: center; gap: 7px; }
.hle-domain-i i { width: 5px; height: 5px; background: var(--hair); transition: background-color 260ms; }
.hle-domain:hover .hle-domain-i i { background: var(--acc); }
.hle-domain-n { font-size: 14px; line-height: 1.4; letter-spacing: -.01em; color: var(--grey); }
.hle-domain:hover .hle-domain-n { color: var(--fg); }

/* ── CTA / 푸터 ─────────────────────────────────────────── */
.hle-cta { position: relative; text-align: center; }
.hle-cta-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.hle-onlinelabel { position: relative; display: flex; justify-content: center; margin-top: 56px; }
.hle-onlinelabel .hle-hair { position: absolute; top: 50%; }
.hle-onlinelabel span { position: relative; background: var(--bg); padding-inline: 14px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); transition: background-color 1100ms var(--ez); }
.hle-pills { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-top: 34px; }
.hle-pill {
  display: inline-flex; align-items: center; gap: 10px;
  border-radius: 999px; border: 1px solid var(--fg);
  padding: 17px 30px;
  font-size: 14px; letter-spacing: -.01em; color: var(--fg);
  text-decoration: none; background: none; cursor: pointer;
  transition: background-color 380ms var(--ez), color 380ms var(--ez), border-color 380ms var(--ez);
}
.hle-pill:hover { background: var(--fg); color: var(--bg); }
.hle-pill:focus-visible { outline: 2px solid var(--acc); outline-offset: 3px; }
.hle-pill--ghost { border-color: var(--hair); color: var(--grey); }
.hle-pill--ghost:hover { background: none; border-color: var(--fg); color: var(--fg); }
.hle-mail { font-family: var(--font-mono); font-size: clamp(15px, 2vw, 26px); letter-spacing: -.03em; color: var(--acc-t); text-decoration: none; border-bottom: 1px solid color-mix(in srgb, var(--acc) 45%, transparent); }
.hle-mail:hover { color: var(--fg); border-color: var(--fg); }

.hle-footer { border-top: 1px solid var(--hair); margin-top: 120px; padding-block: 32px 40px; }
.hle-footer-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px; }
.hle-footer-links { display: flex; flex-wrap: wrap; gap: 18px; list-style: none; margin: 0; padding: 0; }
.hle-footer a { font-family: var(--font-mono); font-size: 11px; letter-spacing: .1em; color: var(--muted); text-decoration: none; }
.hle-footer a:hover { color: var(--fg); }
.hle-footer-c { font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; color: var(--muted); }

/* ── 모션 축소: 반복 애니메이션은 전부 최종 상태로 고정 ───────── */
@media (prefers-reduced-motion: reduce) {
  .hle-marq-row { animation: none; transform: none; }
  .hle-led { animation: none; }
  .hle-logo span { animation: none; }
  .hle-caret { animation: none; opacity: 1; }
  .hle-cue-arrow span { animation: none; }
  .hle-pre-bar i { animation: none; width: 100%; }
  .hle-blade3d-in, .hle-client, .hle-pill { transition: none; }
}

/* ── 반응형 ─────────────────────────────────────────────── */
@media (max-width: 1023px) {
  .hle-sec { padding-block: 72px; }
  .hle-sec--lg { padding-block: 96px; }
  .hle-pillar { margin-top: 64px; }
}
@media (max-width: 767px) {
  /* 좁은 폭에서는 헤더가 94px 높이(내비 2행)로 줄어든다 */
  .hle-feed-pad { padding-top: max(3.4vh, 110px); }
  .hle-col, .hle-wide { padding-inline: 16px; }
  .hle-hdr { padding: 14px 16px; align-items: center; }
  .hle-nav { flex-direction: row; flex-wrap: wrap; gap: 4px 12px; padding: 7px 10px; }
  .hle-nav .hle-nav-en { display: none; }
  .hle-hdr .hle-clock { display: none; }
  .hle-logo { display: none; }
  .hle-plate { top: 4vh; gap: 8px; }
  .hle-client-s { margin-left: 0; flex-basis: 100%; }
  .hle-vert { display: none; }
  .hle-blade3d { justify-content: center; height: 150px; }
  .hle-blade3d-in { width: 200px; }
  .hle-cue { font-size: 10px; }
  .hle-footer { margin-top: 80px; }
}
`;
