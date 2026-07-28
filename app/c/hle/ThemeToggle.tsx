'use client';

export type Mode = 'night' | 'day';

/**
 * Day / Night 토글.
 *
 * 레퍼런스 #03은 이 기능을 3D 오브젝트 표면에만 걸어두어 키보드·스크린리더로 접근이 불가능했고
 * 3D 로드 실패 시 기능 자체가 사라졌다. 여기서는 항상 DOM에 존재하는 role="switch" 버튼으로 만든다.
 *
 * 기호(☀ / ☾)는 aria-hidden으로 감추지 않는다. 감추면 접근 가능한 이름이 빈 문자열이 되어
 * 스크린리더가 "레이블 없는 스위치"로 읽는다(WCAG 4.1.2 위반). 문구를 하드코딩할 수 없으므로
 * 두 기호의 유니코드 이름(sun / crescent moon)을 그대로 이름 계산에 남기고 상태는 aria-checked로 노출한다.
 * content/site.ts에 테마 라벨 문구가 추가되면 aria-label로 교체할 것.
 */
export default function ThemeToggle({
  mode,
  onToggle,
  className,
}: {
  mode: Mode;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={mode === 'night'}
      onClick={onToggle}
      className={className ? `hle-switch ${className}` : 'hle-switch'}
    >
      <span className="hle-glyph hle-glyph--d">☀</span>
      <span aria-hidden className="hle-track">
        <span className="hle-knob" />
      </span>
      <span className="hle-glyph hle-glyph--n">☾</span>
    </button>
  );
}
