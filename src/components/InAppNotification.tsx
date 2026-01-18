'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Video, X } from 'lucide-react';

export type NotificationType = 'message' | 'call-audio' | 'call-video';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
}

interface InAppNotificationProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
  onTap?: (notification: AppNotification) => void;
}

export function InAppNotification({ notifications, onDismiss, onTap }: InAppNotificationProps) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageCircle size={20} className="text-[var(--system-blue)]" />;
      case 'call-audio':
        return <Phone size={20} className="text-[var(--system-green)]" />;
      case 'call-video':
        return <Video size={20} className="text-[var(--system-green)]" />;
    }
  };

  const getBackgroundColor = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return 'bg-[var(--system-blue)]/10';
      case 'call-audio':
      case 'call-video':
        return 'bg-[var(--system-green)]/10';
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="pointer-events-auto"
          >
            <div
              className="glass-card p-3 shadow-xl cursor-pointer"
              onClick={() => onTap?.(notification)}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getBackgroundColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--foreground)] text-sm truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-[var(--foreground-secondary)] line-clamp-2">
                    {notification.message}
                  </p>
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(notification.id);
                  }}
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full hover:bg-[var(--fill-tertiary)]"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={14} className="text-[var(--foreground-tertiary)]" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
