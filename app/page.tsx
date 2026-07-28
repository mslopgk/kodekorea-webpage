import Link from 'next/link';
import { company, concepts } from '@/content/site';

export default function ConceptIndex() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-[#f4f4f5]">
      <div className="shell py-s7">
        <header className="mb-s7 max-w-[62ch]">
          <p className="mono mb-s2 text-xs uppercase tracking-[0.18em] text-[#8a8a92]">
            Design Concepts · 2026.07
          </p>
          <h1 className="tight-ko text-[clamp(2.25rem,5vw,4rem)] font-semibold">
            {company.nameKo} 홈페이지 시안
          </h1>
          <p className="mt-s3 text-[15px] leading-relaxed text-[#a9a9b2]">
            같은 콘텐츠를 네 가지 디자인 방향으로 만들었습니다. 문구와 수치는 네 시안이 모두
            공유하므로, 비교되는 것은 디자인과 모션뿐입니다. 하나를 고르면 나머지를 제거해 그대로
            실물 사이트로 이어집니다.
          </p>
        </header>

        <ul className="grid gap-s2 sm:grid-cols-2">
          {concepts.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/c/${c.slug}`}
                className="group flex h-full flex-col justify-between rounded-xl border border-[#26262b] bg-[#111114] p-s4 transition-colors duration-300 hover:border-[#3f3f47] hover:bg-[#15151a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4f4f5]"
              >
                <div>
                  <div className="mb-s3 flex items-baseline gap-3">
                    <span className="mono text-3xl font-bold text-[#5c5c66] transition-colors group-hover:text-[#f4f4f5]">
                      {c.letter}
                    </span>
                    <h2 className="tight-ko text-xl font-semibold">{c.titleKo}</h2>
                    <span className="mono text-[11px] uppercase tracking-[0.14em] text-[#6c6c76]">
                      {c.titleEn}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#a9a9b2]">{c.desc}</p>
                </div>

                <dl className="mono mt-s4 space-y-1 border-t border-[#26262b] pt-s2 text-[11px] text-[#6c6c76]">
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 uppercase tracking-[0.1em]">Ref</dt>
                    <dd>{c.ref}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 uppercase tracking-[0.1em]">Note</dt>
                    <dd className="font-sans text-[12px] tracking-normal">{c.tone}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>

        <footer className="mono mt-s7 border-t border-[#26262b] pt-s3 text-[11px] leading-relaxed text-[#6c6c76]">
          <p>
            콘텐츠 단일 소스 · content/site.ts &nbsp;|&nbsp; 클라이언트 실명은 ANONYMIZE 플래그로
            마스킹 중
          </p>
          <p className="mt-1">
            분석 근거 · docs/references.md &nbsp;|&nbsp; 설계 ·
            docs/superpowers/specs/2026-07-28-kodekorea-homepage-design.md
          </p>
        </footer>
      </div>
    </main>
  );
}
