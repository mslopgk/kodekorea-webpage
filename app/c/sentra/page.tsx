import type { Metadata } from 'next';
import { company, concepts } from '@/content/site';
import Sentra from './Sentra';

const concept = concepts.find((c) => c.slug === 'sentra') ?? concepts[1];

export const metadata: Metadata = {
  title: `${company.nameKo} — ${concept.letter}. ${concept.titleKo}`,
  description: concept.desc,
};

export default function SentraPage() {
  return <Sentra />;
}
