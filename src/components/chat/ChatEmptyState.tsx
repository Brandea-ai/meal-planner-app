'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function ChatEmptyState() {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center text-center px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full glass-inner">
        <MessageCircle size={40} className="text-[var(--foreground-tertiary)]" />
      </div>
      <p className="text-[var(--foreground-secondary)] font-medium">Noch keine Nachrichten</p>
      <p className="mt-1 text-sm text-[var(--foreground-tertiary)]">
        Starte eine Unterhaltung über eure Mahlzeiten!
      </p>
    </motion.div>
  );
}
