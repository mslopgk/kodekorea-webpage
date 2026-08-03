'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { subscribe } from './ticker';

/**
 * 의미 있는 상시 모션.
 *
 * 앞선 버전은 가짜 파형·가짜 스파크라인·지어낸 판독값(UPTIME 9982h 등)으로
 * 움직임을 만들었다. 그건 두 가지로 잘못이었다.
 *   ① 장식일 뿐 아무 정보도 전달하지 않는다
 *   ② 존재하지 않는 데이터를 그려 **허위**가 된다
 *      — 콘텐츠에서 걷어낸 근거 없는 수치를 시각화로 되살린 셈이었다
 *
 * 여기 있는 것들은 전부 **실제 목록을 순회**한다. 움직임 자체가 정보다:
 * 8개 진단영역, 부산 16개 구·군, 거점 사이트 4개, 직인 검증 실적 6건.
 * 출처는 content/site.ts의 각 주석에 남아 있다.
 */

/** 일정 간격으로 인덱스를 넘긴다. 모션 축소 시 0에 고정. */
function useStep(length: number, periodMs: number, offset = 0) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced || length < 2) return;
    let last = 0;
    return subscribe((t) => {
      if (t - last < periodMs) return;
      last = t;
      setI((prev) => (prev + 1) % length);
    });
  }, [reduced, length, periodMs]);

  return (i + offset) % Math.max(1, length);
}

/**
 * 실제 목록을 한 줄에서 갈아끼운다.
 * 라벨은 고정, 값만 마스크 와이프로 교체 → 무엇이 바뀌는지 읽힌다.
 */
export function Rotate({
  label,
  items,
  periodMs = 2100,
  suffix,
}: {
  label: string;
  items: readonly string[];
  periodMs?: number;
  suffix?: string;
}) {
  const i = useStep(items.length, periodMs);
  return (
    <span className="v2-rot">
      <em>{label}</em>
      <b key={i} className="v2-rot__v">
        {items[i]}
        {suffix}
      </b>
      <i className="v2-rot__n" aria-hidden="true">
        {String(i + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
      </i>
    </span>
  );
}

/**
 * 실제 목록 전체를 보여주면서 하나씩 순서대로 점등한다.
 * 목록이 정보이고, 점등이 "지금 이걸 진단하고 있다"는 상태 표시가 된다.
 */
export function Sweep({
  items,
  periodMs = 900,
  mark,
}: {
  items: readonly string[];
  periodMs?: number;
  /** 특별히 표시할 항목 (예: 1차년도 시범 대상지) */
  mark?: string;
}) {
  const active = useStep(items.length, periodMs);
  return (
    <ul className="v2-sweep">
      {items.map((s, idx) => (
        <li
          key={s}
          data-on={idx === active || undefined}
          data-mark={s === mark || undefined}
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

/**
 * 거점 사이트 목록 — 상태별로 다르게 읽힌다.
 * 운영 중인 것만 도메인을 노출한다 (승인 전 사이트는 공개 불가).
 */
export function SiteCycle({
  sites,
  labels,
  periodMs = 2600,
}: {
  sites: readonly { name: string; domain: string; status: string }[];
  labels: Record<string, string>;
  periodMs?: number;
}) {
  const i = useStep(sites.length, periodMs);
  const s = sites[i];
  return (
    <div className="v2-sitecyc">
      <ol className="v2-sitecyc__dots" aria-hidden="true">
        {sites.map((x, idx) => (
          <li key={x.name} data-on={idx === i || undefined} data-s={x.status} />
        ))}
      </ol>
      <div className="v2-sitecyc__body" key={i}>
        <b>{s.name}</b>
        <span className="v2-sitecyc__meta">
          <i data-s={s.status}>{labels[s.status]}</i>
          {s.domain ? <code>{s.domain}</code> : null}
        </span>
      </div>
    </div>
  );
}

/**
 * 직인 검증 실적을 한 건씩 넘긴다.
 * 이 회사의 가장 강한 신뢰 근거라서, 정적으로 묻어두지 않고 계속 갈아끼운다.
 */
export function WorkCycle({
  items,
  periodMs = 2800,
}: {
  items: readonly { title: string; year: string; scale: string }[];
  periodMs?: number;
}) {
  const i = useStep(items.length, periodMs);
  const w = items[i];
  return (
    <div className="v2-workcyc" key={i}>
      <span className="v2-workcyc__year">{w.year}</span>
      <b className="v2-workcyc__title">{w.title}</b>
      <span className="v2-workcyc__scale">{w.scale}</span>
    </div>
  );
}
