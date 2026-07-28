'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from './motion';

const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#$%&*+=<>';

/** 한글 음절 여부. 한글은 랜덤 치환이 시각적으로 너무 시끄러워 스크램블 대상에서 제외한다. */
function isHangul(ch: string) {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0xac00 && c <= 0xd7a3) || (c >= 0x1100 && c <= 0x11ff) || (c >= 0x3130 && c <= 0x318f);
}

/**
 * 글자 단위 스크램블 디코드 (레퍼런스 #02 Sentra의 핵심 모션).
 *
 * 한글은 치환하지 않고 뒤에서부터 서서히 공개(마스크 와이프)하고,
 * 영문·숫자만 랜덤 문자를 거쳐 정답으로 수렴시킨다.
 */
export function useScramble(text: string, active: boolean, speedMs = 28) {
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(() => (reduced ? text : ''));

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return;
    }
    if (!active) {
      setOutput('');
      return;
    }

    const chars = [...text];
    let frame = 0;
    let raf = 0;
    let last = 0;
    // 각 글자가 확정되는 프레임
    const settleAt = chars.map((_, i) => Math.floor(i * 1.6) + 4);
    const total = Math.max(...settleAt, 1) + 6;

    const tick = (t: number) => {
      if (t - last >= speedMs) {
        last = t;
        frame += 1;
        setOutput(
          chars
            .map((ch, i) => {
              if (ch === ' ' || ch === '\n') return ch;
              if (frame >= settleAt[i]) return ch;
              // 아직 확정 전
              if (isHangul(ch)) return ''; // 한글은 비워두고 순차 공개
              return LATIN[Math.floor(Math.random() * LATIN.length)];
            })
            .join('')
        );
      }
      if (frame < total) raf = requestAnimationFrame(tick);
      else setOutput(text);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, active, speedMs, reduced]);

  return output;
}

/** 타이프라이터. 마지막 단어만 바꿔가며 반복할 때 사용 (레퍼런스 #03 HLE 프리로더). */
export function useTypewriter(words: readonly string[], active = true, opts?: { typeMs?: number; holdMs?: number }) {
  const reduced = useReducedMotion();
  const typeMs = opts?.typeMs ?? 70;
  const holdMs = opts?.holdMs ?? 1100;
  const [text, setText] = useState(() => (reduced ? (words[0] ?? '') : ''));

  useEffect(() => {
    if (reduced || !active || words.length === 0) {
      setText(words[0] ?? '');
      return;
    }

    let cancelled = false;
    let wordIndex = 0;

    const sleep = (ms: number) =>
      new Promise<void>((res) => {
        const id = setTimeout(res, ms);
        timers.push(id);
      });
    const timers: ReturnType<typeof setTimeout>[] = [];

    (async () => {
      while (!cancelled) {
        const word = words[wordIndex % words.length];
        for (let i = 1; i <= word.length && !cancelled; i++) {
          setText(word.slice(0, i));
          await sleep(typeMs);
        }
        if (cancelled) return;
        await sleep(holdMs);
        for (let i = word.length; i >= 0 && !cancelled; i--) {
          setText(word.slice(0, i));
          await sleep(typeMs / 2.2);
        }
        wordIndex += 1;
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [words, active, typeMs, holdMs, reduced]);

  return text;
}
