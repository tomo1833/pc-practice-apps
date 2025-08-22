'use client';

import { useEffect, useState } from 'react';

export default function ClickChallenge() {
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [running, setRunning] = useState(false);

  // Load best score from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('click-challenge-best');
    if (stored) {
      setBestScore(Number(stored));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (!running) return;

    if (timeLeft <= 0) {
      setRunning(false);
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('click-challenge-best', String(score));
      }
      return;
    }

    const id = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(id);
  }, [running, timeLeft, score, bestScore]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setRunning(true);
  };

  const handleClick = () => {
    if (running && timeLeft > 0) {
      setScore((s) => s + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="text-6xl font-bold">{timeLeft}s</div>
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

