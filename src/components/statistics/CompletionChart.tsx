'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CompletionChartProps {
  weeklyRate: number;
  monthlyRate: number;
  totalRate: number;
}

function ProgressRing({
  percentage,
  label,
  size = 80,
  delay = 0,
}: {
  percentage: number;
  label: string;
  size?: number;
  delay?: number;
}) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--fill-secondary)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut', delay }}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--system-green)" />
              <stop offset="100%" stopColor="var(--system-blue)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-lg font-bold text-[var(--foreground)] tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
      </div>
      <p className="mt-2 text-xs text-[var(--foreground-tertiary)]">{label}</p>
    </motion.div>
  );
}

export function CompletionChart({ weeklyRate, monthlyRate, totalRate }: CompletionChartProps) {
  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
    >
      <h3 className="text-sm font-semibold text-[var(--foreground)]">Abschlussrate</h3>

      <div className="mt-4 flex justify-around">
        <ProgressRing percentage={weeklyRate} label="Diese Woche" delay={0.2} />
        <ProgressRing percentage={monthlyRate} label="Dieser Monat" delay={0.3} />
        <ProgressRing percentage={totalRate} label="Gesamt" delay={0.4} />
      </div>
    </motion.div>
  );
}
