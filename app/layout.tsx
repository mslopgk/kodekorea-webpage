import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '코드코리아 — AI를 만들고, 가르치고, 운영합니다',
  description:
    '제조 현장의 AI 솔루션, 학교와 기업의 AI 교육, 그것을 담는 플랫폼까지. 기획부터 모델 학습, 구현, 서버 운영을 한 팀에서 처리합니다.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
