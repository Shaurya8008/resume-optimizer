'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CircularProgressProps {
  score: number;
}

export default function CircularProgress({ score }: CircularProgressProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let color = 'text-green-500';
  if (score < 50) color = 'text-red-500';
  else if (score < 75) color = 'text-yellow-500';

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-40 h-40 transform -rotate-90">
        <circle
          className="text-gray-800 stroke-current"
          strokeWidth="10"
          cx="80"
          cy="80"
          r="60"
          fill="transparent"
        ></circle>
        <motion.circle
          className={`${color} stroke-current`}
          strokeWidth="10"
          strokeLinecap="round"
          cx="80"
          cy="80"
          r="60"
          fill="transparent"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeDasharray={circumference}
        ></motion.circle>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{animatedScore}</span>
        <span className="text-sm text-gray-400">Match Score</span>
      </div>
    </div>
  );
}
