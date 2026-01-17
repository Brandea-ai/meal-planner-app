'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'var(--system-blue)',
}: StatCardProps) {
  return (
    <div className="rounded-[12px] bg-[var(--background-secondary)] p-4">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fill-secondary)]">
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">{title}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-[var(--foreground-tertiary)]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
