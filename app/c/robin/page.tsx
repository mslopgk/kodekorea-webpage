import type { Metadata } from 'next';
import { company, concepts } from '@/content/site';
import Journey from './Journey';

const concept = concepts.find((c) => c.slug === 'robin');

export const metadata: Metadata = {
  title: `${company.nameKo} — ${concept?.titleKo ?? ''} (${concept?.letter ?? ''})`,
  description: concept?.desc,
};

export default function RobinConcept() {
  return <Journey />;
}
