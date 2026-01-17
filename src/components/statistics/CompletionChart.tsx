'use client';

interface CompletionChartProps {
  weeklyRate: number;
  monthlyRate: number;
  totalRate: number;
}

function ProgressRing({ percentage, label, size = 80 }: { percentage: number; label: string; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
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
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--system-green)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-[var(--foreground)]">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs text-[var(--foreground-tertiary)]">{label}</p>
    </div>
  );
}

export function CompletionChart({ weeklyRate, monthlyRate, totalRate }: CompletionChartProps) {
  return (
    <div className="rounded-[12px] bg-[var(--background-secondary)] p-4">
      <h3 className="text-sm font-semibold text-[var(--foreground)]">Abschlussrate</h3>

      <div className="mt-4 flex justify-around">
        <ProgressRing percentage={weeklyRate} label="Diese Woche" />
        <ProgressRing percentage={monthlyRate} label="Dieser Monat" />
        <ProgressRing percentage={totalRate} label="Gesamt" />
      </div>
    </div>
  );
}
