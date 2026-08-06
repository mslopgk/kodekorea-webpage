'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { projectPath } from '@/content/projects';
import {
  CATEGORY_LABEL,
  STATUS_LABEL,
  type Category,
  type Post,
  type Status,
  usePosts,
} from './posts';
import { workLog } from '@/content/site';
import { LiveClock, Pulse } from './live';

/**
 * 실적 대시보드.
 *
 * 카드 갤러리를 쓰지 않는다 — 1차 평가에서 "프로젝트가 전부 카드 갤러리라
 * 브랜드 개성이 없다"는 지적을 받았다. 대신 **계측기 로그** 형태로 간다:
 * 코드 인덱스 · 상태 LED · 수치가 한 행에 고정폭으로 정렬되는 밀도 높은 표.
 * 회사가 "만들고 운영한다"는 주장과 형태가 일치한다.
 *
 * 게시물은 계속 추가·삭제할 수 있다. 저장은 posts.ts 참고.
 */
export function Dashboard() {
  const { posts, add, remove, ready } = usePosts();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const shown = useMemo(
    () => (filter === 'all' ? posts : posts.filter((p) => p.category === filter)),
    [posts, filter]
  );

  const counts = useMemo(() => {
    const live = posts.filter((p) => p.status === 'live').length;
    const wip = posts.filter((p) => p.status === 'wip').length;
    return { total: posts.length, live, wip };
  }, [posts]);

  return (
    <div className="v2-dash">
      {/* 계기판 헤더 — 항상 살아 있는 값 */}
      <div className="v2-dash__bar">
        <div className="v2-dash__stat">
          <b>{String(counts.total).padStart(2, '0')}</b>
          <span>{workLog.stats.total}</span>
        </div>
        <div className="v2-dash__stat">
          <b>
            {String(counts.live).padStart(2, '0')}
            {!reduced && <Pulse />}
          </b>
          <span>{workLog.stats.live}</span>
        </div>
        <div className="v2-dash__stat">
          <b>{String(counts.wip).padStart(2, '0')}</b>
          <span>{workLog.stats.wip}</span>
        </div>
        <div className="v2-dash__clock">
          <LiveClock />
        </div>
      </div>

      {/* 필터 + 추가 */}
      <div className="v2-dash__tools">
        <div className="v2-chips" role="group" aria-label="분류 필터">
          {(['all', 'public', 'education', 'platform'] as const).map((c) => (
            <button
              key={c}
              type="button"
              className="v2-chip"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c === 'all' ? 'ALL' : CATEGORY_LABEL[c]}
              <span className="v2-chip__n">
                {c === 'all' ? posts.length : posts.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="v2-dash__add" onClick={() => setOpen((v) => !v)}>
          <span aria-hidden="true">{open ? '−' : '+'}</span>
          {open ? workLog.closeKo : workLog.addKo}
        </button>
      </div>

      {open && <PostForm onSubmit={(d) => { add(d); setOpen(false); }} />}

      {/* 로그 표 */}
      <div className="v2-log" role="table" aria-label="실적 목록">
        <div className="v2-log__head" role="row">
          <span role="columnheader">{workLog.cols.idx}</span>
          <span role="columnheader">{workLog.cols.project}</span>
          <span role="columnheader">{workLog.cols.client}</span>
          <span role="columnheader">{workLog.cols.period}</span>
          <span role="columnheader">{workLog.cols.metric}</span>
          <span role="columnheader">{workLog.cols.status}</span>
          <span role="columnheader" aria-label="삭제" />
        </div>

        {shown.map((p, i) => (
          <Row key={p.id} post={p} index={i} onRemove={() => remove(p.id)} />
        ))}

        {ready && shown.length === 0 && (
          <p className="v2-log__empty">{workLog.emptyKo}</p>
        )}
      </div>
    </div>
  );
}

function Row({ post, index, onRemove }: { post: Post; index: number; onRemove: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="v2-log__row" role="row" style={{ ['--i' as string]: index }} data-open={open || undefined}>
      <span className="v2-log__code" role="cell">
        {post.code}
      </span>
      <span className="v2-log__title" role="cell">
        {/*
          씨드 실적은 정적 상세 페이지가 있어 링크로 간다 — 견적서에 붙여 보낼 수 있는
          주소가 생기는 게 이 구조의 이유다. 사용자가 추가한 항목은 localStorage에만
          있어 페이지를 만들 수 없으므로 같은 자리에서 펼친다.
        */}
        {post.slug ? (
          <Link href={projectPath(post.slug)} className="v2-log__link">
            <b>{post.title}</b>
            <span className="v2-log__more" aria-hidden="true">
              {workLog.detailKo}
            </span>
          </Link>
        ) : (
          <button
            type="button"
            className="v2-log__link v2-log__link--btn"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <b>{post.title}</b>
            <span className="v2-log__more" aria-hidden="true">
              {open ? workLog.closeKo : workLog.detailKo}
            </span>
          </button>
        )}
        <em>{post.summary}</em>
        <span className="v2-log__stack">{post.stack.join(' · ')}</span>
      </span>
      <span className="v2-log__client" role="cell">
        {post.client}
      </span>
      <span className="v2-log__period" role="cell">
        {post.period}
      </span>
      <span className="v2-log__metric" role="cell">
        <b>{post.metric}</b>
        <em>{post.metricLabel}</em>
      </span>
      <span className="v2-log__status" role="cell" data-s={post.status}>
        <i aria-hidden="true" />
        {STATUS_LABEL[post.status]}
      </span>
      <span className="v2-log__act" role="cell">
        {post.locked ? (
          <span className="v2-log__lock" title={workLog.lockedTip}>
            ◆
          </span>
        ) : confirming ? (
          <span className="v2-log__confirm">
            <button type="button" onClick={onRemove} className="v2-log__yes">
              {workLog.form.remove}
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              {workLog.form.cancel}
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="v2-log__del"
            onClick={() => setConfirming(true)}
            aria-label={`${post.title} 삭제`}
          >
            ×
          </button>
        )}
      </span>

      {/* 사용자 추가 항목의 인라인 상세 — 입력한 값만 보여준다 */}
      {open && (
        <div className="v2-log__detail" role="cell">
          <dl>
            <div>
              <dt>{workLog.cols.client}</dt>
              <dd>{post.client || '—'}</dd>
            </div>
            <div>
              <dt>{workLog.cols.period}</dt>
              <dd>{post.period || '—'}</dd>
            </div>
            <div>
              <dt>{workLog.cols.metric}</dt>
              <dd>{post.metric ? `${post.metric} · ${post.metricLabel}` : '—'}</dd>
            </div>
          </dl>
          {post.summary && <p>{post.summary}</p>}
          {post.stack.length > 0 && (
            <ul>
              {post.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          <p className="v2-log__detailnote">{workLog.localOnlyKo}</p>
        </div>
      )}
    </div>
  );
}

const EMPTY = {
  title: '',
  client: '',
  category: 'public' as Category,
  status: 'wip' as Status,
  period: '',
  summary: '',
  metric: '',
  metricLabel: '',
  stackRaw: '',
};

function PostForm({ onSubmit }: { onSubmit: (d: Omit<Post, 'id' | 'code'>) => void }) {
  const [f, setF] = useState(EMPTY);
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const valid = f.title.trim().length > 0;

  return (
    <form
      className="v2-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        const { stackRaw, ...rest } = f;
        onSubmit({
          ...rest,
          stack: stackRaw
            .split(/[,·]/)
            .map((s) => s.trim())
            .filter(Boolean),
        });
        setF(EMPTY);
      }}
    >
      <label>
        <span>{workLog.form.title} *</span>
        <input value={f.title} onChange={set('title')} required />
      </label>
      <label>
        <span>{workLog.form.client}</span>
        <input value={f.client} onChange={set('client')} placeholder="" />
      </label>
      <label>
        <span>{workLog.form.category}</span>
        <select value={f.category} onChange={set('category')}>
          {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{workLog.form.status}</span>
        <select value={f.status} onChange={set('status')}>
          {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{workLog.form.period}</span>
        <input value={f.period} onChange={set('period')} placeholder="2026" />
      </label>
      <label className="v2-form__wide">
        <span>{workLog.form.summary}</span>
        <input value={f.summary} onChange={set('summary')} />
      </label>
      <label>
        <span>{workLog.form.metric}</span>
        <input value={f.metric} onChange={set('metric')} placeholder="" />
      </label>
      <label>
        <span>{workLog.form.metricLabel}</span>
        <input value={f.metricLabel} onChange={set('metricLabel')} placeholder="" />
      </label>
      <label className="v2-form__wide">
        <span>{workLog.form.stack}</span>
        <input value={f.stackRaw} onChange={set('stackRaw')} placeholder="YOLO26, OCR, Next.js" />
      </label>
      <div className="v2-form__foot">
        <button type="submit" disabled={!valid}>
          {workLog.form.submit}
        </button>
        <p>{workLog.storageNote}</p>
      </div>
    </form>
  );
}
