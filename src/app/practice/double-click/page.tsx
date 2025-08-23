'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Difficulty = 'easy' | 'normal' | 'hard';

const DIFFICULTIES: Record<Difficulty, { label: string; interval: number; size: number }> = {
  easy: { label: 'やさしい', interval: 600, size: 80 },
  normal: { label: 'ふつう', interval: 450, size: 56 },
  hard: { label: 'むずかしい', interval: 300, size: 40 },
};

export default function DoubleClickPractice() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [status, setStatus] = useState<'idle' | 'success' | 'failure'>('idle');
  const [last, setLast] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const firstTimeRef = useRef(0);
  const phaseRef = useRef<'idle' | 'waitingSecond' | 'waitingThird'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!targetRef.current) return;
      if (targetRef.current.contains(e.target as Node)) return;
      if (phaseRef.current !== 'idle') {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStatus('failure');
        setCombo(0);
        phaseRef.current = 'idle';
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const resetAttempt = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    phaseRef.current = 'idle';
    firstTimeRef.current = 0;
  };

  const handleClick = () => {
    const now = performance.now();
    const { interval } = DIFFICULTIES[difficulty];

    if (phaseRef.current === 'idle') {
      firstTimeRef.current = now;
      phaseRef.current = 'waitingSecond';
      timerRef.current = setTimeout(() => {
        setStatus('failure');
        setCombo(0);
        resetAttempt();
      }, interval);
    } else if (phaseRef.current === 'waitingSecond') {
      if (timerRef.current) clearTimeout(timerRef.current);
      const diff = now - firstTimeRef.current;
      if (diff <= interval) {
        setLast(diff);
        setBest((prev) => (prev === null || diff < prev ? diff : prev));
        setStatus('success');
        phaseRef.current = 'waitingThird';
        timerRef.current = setTimeout(() => {
          setCombo((c) => c + 1);
          resetAttempt();
        }, interval);
      } else {
        setStatus('failure');
        setCombo(0);
        resetAttempt();
      }
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setStatus('failure');
      setCombo(0);
      resetAttempt();
    }
  };

  const handleReset = useCallback(() => {
    setStatus('idle');
    setLast(null);
    setBest(null);
    setCombo(0);
    resetAttempt();
  }, []);

  useEffect(() => {
    handleReset();
  }, [difficulty, handleReset]);

  if (isMobile) {
    return <div className="p-10 text-center">PCでお試しください</div>;
  }

  const { size } = DIFFICULTIES[difficulty];
  const baseColor =
    status === 'success' ? 'bg-green-500' : status === 'failure' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className="flex flex-col items-center gap-6 py-10 select-none">
      <h1 className="text-3xl font-bold">ダブルクリック練習</h1>
      <p>ターゲットを素早くダブルクリックして練習しましょう。</p>

      <div className="flex gap-2">
        {(Object.keys(DIFFICULTIES) as Difficulty[]).map((key) => (
          <button
            key={key}
            onClick={() => setDifficulty(key)}
            className={`px-3 py-1 rounded border ${
              difficulty === key ? 'bg-gray-200' : ''
            }`}
          >
            {DIFFICULTIES[key].label}
          </button>
        ))}
      </div>

      <div
        ref={targetRef}
        onClick={handleClick}
        draggable={false}
        className={`${baseColor} rounded-full flex items-center justify-center`}
        style={{ width: size, height: size }}
      ></div>

      <div className="text-center">
        <div>状態: {status === 'success' ? '成功' : status === 'failure' ? '失敗' : '待機中'}</div>
        <div>直近間隔: {last !== null ? `${Math.round(last)}ms` : '--'}</div>
        <div>ベスト間隔: {best !== null ? `${Math.round(best)}ms` : '--'}</div>
        <div>コンボ: {combo}</div>
      </div>

      <button onClick={handleReset} className="px-4 py-2 border rounded">
        リセット
      </button>
    </div>
  );
}

