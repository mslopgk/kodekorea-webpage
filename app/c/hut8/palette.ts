import { hex, type RGB } from './iso';

/**
 * 컨셉 A 팔레트 — 무채색 베이스 + 액센트 1개.
 * 액센트는 라임 대신 코드코리아용 "시그널 블루"(#2D46FF)로 정했다.
 * 밝은 배경에서 5.3:1, 어두운 배경에서는 밝은 변형(#7A8BFF)으로 6.6:1을 확보한다.
 */
export const PAL = {
  ink: '#080808',
  ink2: '#101013',
  paper: '#f4f4f2',
  paper2: '#e9e9e5',
  fg: '#f8f8f8',
  dim: '#a8a8a8',
  inkFg: '#141519',
  accent: '#2d46ff',
  accentLt: '#7a8bff',
} as const;

export const C = {
  accent: hex(PAL.accent) as RGB,
  accentLt: hex(PAL.accentLt) as RGB,
  ground: hex('#dedeD8') as RGB,
  white: hex('#fbfbf9') as RGB,
  grey: hex('#e2e2dd') as RGB,
  greyDeep: hex('#c8c8c1') as RGB,
  slate: hex('#9aa0ae') as RGB,
  ink: hex(PAL.inkFg) as RGB,
} as const;

/** 도트 그리드용 파스텔 램프 — 채도를 낮춰 액센트를 방해하지 않게 */
export const DOTS: RGB[] = [
  hex('#b3b7c6'),
  hex('#c2b8c6'),
  hex('#b5c3ba'),
  hex('#c7c0ad'),
  hex('#aab4c8'),
];
