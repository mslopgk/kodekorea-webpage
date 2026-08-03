import type { Metadata } from 'next';
import { V2Page } from './c/v2/V2Page';
import { company } from '@/content/site';

/** 실물 홈페이지. 시안 비교 인덱스는 `/concepts`로 옮겼다. */
export const metadata: Metadata = {
  title: `${company.nameKo} — ${company.headline}`,
  description: company.intro,
};

export default function Home() {
  return <V2Page />;
}
