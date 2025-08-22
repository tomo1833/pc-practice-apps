'use client';

import { useEffect, useRef, useState } from 'react';

const DURATION = 10_000; // ms

export default function ClickChallenge() {
  const [timeLeft, setTimeLeft] = useState(DURATION / 1000);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [running, setRunning] = useState(false);

  const startedAt = useRef(0);
  const frameRef = useRef<number>();
  const scoreRef = useRef(0);
  const bestScoreRef = useRef(0);

  // Load best score from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('click-challenge-best');
    if (stored) {
      const val = Number(stored);
      setBestScore(val);
      bestScoreRef.current = val;
    }
  }, []);

  // Timer effect based on time difference
  useEffect(() => {
    if (!running) return;
    startedAt.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const remaining = Math.max(0, DURATION - (now - startedAt.current));
      setTimeLeft(remaining / 1000);

      if (remaining <= 0) {
        setRunning(false);
        const finalScore = scoreRef.current;
        if (finalScore > bestScoreRef.current) {
          bestScoreRef.current = finalScore;
          setBestScore(finalScore);
          localStorage.setItem('click-challenge-best', String(finalScore));
        }
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [running]);

  const startGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(DURATION / 1000);
    setRunning(true);
  };

  const handleClick = () => {
    if (running && timeLeft > 0) {
      setScore((s) => {
        const val = s + 1;
        scoreRef.current = val;
        return val;
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="text-6xl font-bold">{timeLeft.toFixed(1)}s</div>
      <div className="text-4xl">Score: {score}</div>
      <div className="text-2xl">Best: {bestScore}</div>
      {running ? (
        <button
          onClick={handleClick}
          className="w-48 h-48 rounded-full bg-blue-500 text-white text-3xl flex items-center justify-center"
        >
          TAP!
        </button>
      ) : (
        <button
          onClick={startGame}
          className="w-48 h-48 rounded-full bg-green-500 text-white text-3xl flex items-center justify-center"
        >
          START
        </button>
      )}
    </div>
  );
}

