import type { CSSProperties } from 'react';

/** 클래스 결합 헬퍼 */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * 결정론적 PRNG. 서버 렌더와 클라이언트 렌더가 같은 값을 내야 하므로
 * Math.random 대신 고정 시드를 쓴다 (하이드레이션 불일치 방지).
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 고정 시드 난수 배열 */
export function seededArray(n: number, seed: number): number[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: n }, () => rnd());
}

/** 한글 포함 여부 */
export function hasHangul(text: string): boolean {
  return /[㄰-㆏가-힣]/.test(text);
}

/**
 * 수치·프로젝트명 타이포 선택.
 * 영문·숫자만이면 모노 + 좁은 자간, 한글이 섞이면 산세리프로 되돌린다.
 * (JetBrains Mono에는 한글이 없고, -0.04em 자간은 한글 자소를 붙여버린다)
 */
export function valueFont(text: string): string {
  return hasHangul(text) ? 'tight-ko' : 'mono tight-en';
}

export type Clause = { text: string; strong: boolean };

/**
 * 한 문장 안에서 검정/미드그레이를 섞는 강조 방식(레퍼런스 #02).
 * 문구를 하드코딩하지 않고 절(clause) 위치만으로 강약을 만든다.
 */
export function clauseMix(text: string): Clause[] {
  return text
    .split(/(?<=[,.])\s+/)
    .filter((t) => t.length > 0)
    .map((t, i) => ({ text: t, strong: i % 2 === 0 }));
}

/** 쉼표 뒤에서 줄을 끊되 쉼표는 유지한다 (대형 문장 블록용) */
export function commaLines(text: string): string[] {
  return text
    .split(/(?<=,)\s*/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** transition-delay용 커스텀 프로퍼티 */
export function delayVar(ms: number, extra?: CSSProperties): CSSProperties {
  return { '--d': `${ms}ms`, ...extra } as CSSProperties;
}
