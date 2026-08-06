import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { company, statusText } from '@/content/site';
import { projectLabels as L, projectPath, projects, projectBySlug } from '@/content/projects';
import { Rev, Wipe } from '@/app/c/v2/parts';
import { Choreo } from '@/app/c/v2/Choreo';
import '@/app/c/v2/v2.css';
import '@/app/c/v2/ambient.css';
import './project.css';

/**
 * 프로젝트 상세.
 *
 * 정적 export이므로 실적마다 실제 페이지가 하나씩 생긴다 — 견적서에 링크를 붙여
 * 보낼 수 있다는 게 이 구조의 이유다. 대시보드에서 사용자가 직접 추가한 항목은
 * localStorage에만 있어 페이지를 만들 수 없고, 표에서 펼쳐 보는 방식으로 간다.
 *
 * ⚠️ 이 페이지는 `content/projects.ts`에 있는 것만 그린다. 비어 있는 블록은
 *    문구로 메우지 않고 **아예 렌더하지 않는다.** 상세 페이지를 채우려고 없는
 *    사실을 쓰는 것이 이 프로젝트에서 가장 크게 실패한 지점이었다.
 */

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug.get(slug);
  if (!p) return { title: company.nameKo };
  return {
    title: `${p.title} — ${company.nameKo}`,
    description: p.lede ?? p.subtitle,
    // 본문 콘텐츠가 확정될 때까지 사이트 전체가 색인 차단 상태다 (docs/hosting.md)
    robots: { index: false, follow: false },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug.get(slug);
  if (!p) notFound();

  // 같은 분류의 다른 실적을 아래에 붙인다 — 한 건만 보고 나가지 않도록
  const siblings = projects.filter((x) => x.kind === p.kind && x.slug !== p.slug).slice(0, 6);

  return (
    <>
      <Choreo />
      <main className="v2 v2--dark pj">
        <div className="v2-shell">
          <Link href="/#work" className="pj__back">
            <span aria-hidden="true">←</span> {L.back}
          </Link>

          <header className="pj__head">
            <p className="v2-eyebrow">{p.subtitle}</p>
            <h1 className="pj__title">
              <Wipe>{p.title}</Wipe>
            </h1>

            <dl className="pj__facts">
              <Fact label={L.org} value={p.org} />
              <Fact label={L.period} value={p.period} />
              <Fact label={L.status} value={statusText[p.status]} status={p.status} />
              {p.scale && <Fact label={L.scale} value={p.scale} mono />}
              {p.role && <Fact label={L.role} value={p.role} />}
              {p.evidenceText && <Fact label={L.evidence} value={p.evidenceText} accent />}
            </dl>
            <p className="pj__masknote">{L.maskNote}</p>
          </header>

          {p.lede && (
            <Rev as="p" className="pj__lede" delay={60}>
              {p.lede}
            </Rev>
          )}

          {/* 사업축 실적은 실제 캡처를 가지고 있다. 승인 전 프로젝트는 캡처가 없다. */}
          {p.images && p.images.length > 0 && (
            <div className="pj__shots">
              {p.images.map((im, i) => (
                <Rev key={im.src} delay={i * 90}>
                  <figure className="pj__shot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={im.src} alt={im.alt} loading="lazy" />
                    <figcaption>{im.caption}</figcaption>
                  </figure>
                </Rev>
              ))}
            </div>
          )}

          {p.metrics && p.metrics.length > 0 && (
            <Section title={L.metrics}>
              <ul className="pj__metrics">
                {p.metrics.map((m, i) => (
                  <Rev as="li" key={m.label} delay={i * 70}>
                    <b>
                      {m.value}
                      <em>{m.unit}</em>
                    </b>
                    <span>{m.label}</span>
                    {/* 출처 없는 수치는 이 사이트에 두지 않는다 — 그래서 항상 함께 보인다 */}
                    <i>{m.source}</i>
                  </Rev>
                ))}
              </ul>
            </Section>
          )}

          {p.scope && p.scope.length > 0 && (
            <Section title={L.scope}>
              <ul className="pj__list">
                {p.scope.map((s, i) => (
                  <Rev as="li" key={s} delay={Math.min(i * 50, 400)}>
                    {s}
                  </Rev>
                ))}
              </ul>
            </Section>
          )}

          {p.docs && p.docs.length > 0 && (
            <Section title={L.docs} note={L.docsNote}>
              <ul className="pj__docs">
                {p.docs.map((d, i) => (
                  <Rev as="li" key={d} delay={Math.min(i * 50, 400)}>
                    <span aria-hidden="true" className="pj__docmark" />
                    {d}
                  </Rev>
                ))}
              </ul>
            </Section>
          )}

          {p.stack && p.stack.length > 0 && (
            <Section title={L.stack}>
              <ul className="pj__stack">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Section>
          )}

          {siblings.length > 0 && (
            <Section title={L.next}>
              <ul className="pj__siblings">
                {siblings.map((s, i) => (
                  <Rev as="li" key={s.slug} delay={i * 60}>
                    <Link href={projectPath(s.slug)}>
                      <b>{s.title}</b>
                      <span>{s.org}</span>
                      <i>{s.period}</i>
                    </Link>
                  </Rev>
                ))}
              </ul>
            </Section>
          )}

          <div className="pj__foot">
            <Link href="/#work" className="pj__back">
              <span aria-hidden="true">←</span> {L.back}
            </Link>
            <a href={`mailto:${company.email}`} className="pj__mail">
              {company.email}
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

function Fact({
  label,
  value,
  mono,
  accent,
  status,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
  status?: string;
}) {
  return (
    <div className="pj__fact" data-mono={mono || undefined} data-accent={accent || undefined}>
      <dt>{label}</dt>
      <dd data-s={status}>
        {status && <i aria-hidden="true" />}
        {value}
      </dd>
    </div>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pj__sec">
      <h2 className="pj__sectitle">{title}</h2>
      {note && <p className="pj__secnote">{note}</p>}
      {children}
    </section>
  );
}
