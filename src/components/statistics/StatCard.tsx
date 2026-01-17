'use client';

import { motion } from 'framer-motion';
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
    <motion.div
      className="glass-card p-4"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex items-start justify-between">
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `color-mix(in srgb, ${iconColor} 15%, transparent)` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </motion.div>
      </div>
      <div className="mt-3">
        <motion.p
          className="text-2xl font-bold text-[var(--foreground)] tabular-nums"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {value}
        </motion.p>
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">{title}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-[var(--foreground-tertiary)]">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
