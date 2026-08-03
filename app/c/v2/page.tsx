import type { Metadata } from 'next';
import { V2Page } from './V2Page';
import { company } from '@/content/site';

/**
 * 검토용 경로. 실물 홈페이지는 루트(`/`)이고 같은 컴포넌트를 렌더한다.
 * 시안 비교 링크를 이미 공유했으므로 이 경로도 살려둔다.
 */
export const metadata: Metadata = {
  title: `${company.nameKo} — ${company.headline}`,
  description: company.intro,
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2Page />;
}
