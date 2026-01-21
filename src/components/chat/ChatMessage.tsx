'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Reply, Pencil, Trash2, X, Utensils, Download, ZoomIn } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
  replyMessage?: ChatMessageType | null;
  getMealTitle: (day: number, type: string) => string;
  formatTime: (date: string) => string;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRate?: (rating: number) => void;
}

const messageVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

export function ChatMessageBubble({
  message,
  isOwnMessage,
  replyMessage,
  getMealTitle,
  formatTime,
  onReply,
  onEdit,
  onDelete,
  onRate,
}: ChatMessageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [imageFullscreen, setImageFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  const handleTouchStart = () => {
    if (isOwnMessage) {
      const timer = setTimeout(() => setIsMenuOpen(true), 500);
      setLongPressTimer(timer);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleRate = (rating: number) => {
    onRate?.(rating);
  };

  const hasImage = !!message.mediaUrl;
  const hasText = !!message.message && message.message.trim().length > 0;
  const hasRating = !!message.rating && message.rating > 0;

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} px-2`}
    >
      <div
        className="relative max-w-[80%] sm:max-w-[70%]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onContextMenu={(e) => {
          if (isOwnMessage) {
            e.preventDefault();
            setIsMenuOpen(true);
          }
        }}
      >
        {/* Action Menu */}
        <AnimatePresence>
          {isMenuOpen && isOwnMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute -top-12 right-0 z-50 flex gap-1 glass-card p-1 rounded-2xl shadow-lg"
            >
              <ActionButton icon={<Reply size={16} />} onClick={() => { setIsMenuOpen(false); onReply(); }} label="Antworten" />
              <ActionButton icon={<Pencil size={16} />} onClick={() => { setIsMenuOpen(false); onEdit(); }} label="Bearbeiten" />
              <ActionButton icon={<Trash2 size={16} />} onClick={() => { setIsMenuOpen(false); onDelete(); }} label="Löschen" danger />
              <ActionButton icon={<X size={16} />} onClick={() => setIsMenuOpen(false)} label="Schließen" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Bubble */}
        <div
          className={`relative overflow-hidden ${
            isOwnMessage
              ? 'bg-[var(--system-blue)] text-white rounded-[20px] rounded-br-[6px]'
              : 'bg-white dark:bg-[#1f1f1f] text-[var(--foreground)] rounded-[20px] rounded-bl-[6px] shadow-sm'
          }`}
        >
          {/* Sender name (for others) */}
          {!isOwnMessage && (
            <p className="px-3.5 pt-2.5 pb-0 text-xs font-semibold text-[var(--system-blue)]">
              {message.senderName}
            </p>
          )}

          {/* Reply preview */}
          {replyMessage && (
            <div className={`mx-3 mt-2.5 rounded-xl border-l-3 p-2.5 ${
              isOwnMessage
                ? 'border-l-white/50 bg-white/15'
                : 'border-l-[var(--system-blue)] bg-[var(--fill-secondary)]'
            }`}>
              <p className={`text-xs font-semibold ${isOwnMessage ? 'text-white/90' : 'text-[var(--system-blue)]'}`}>
                {replyMessage.senderName}
              </p>
              <p className={`line-clamp-1 text-xs ${isOwnMessage ? 'text-white/70' : 'text-[var(--foreground-secondary)]'}`}>
                {replyMessage.message || '📷 Bild'}
              </p>
            </div>
          )}

          {/* Meal reference badge */}
          {message.mealReference && message.mealType && (
            <div className="px-3.5 pt-2.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                isOwnMessage
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--system-orange)]/10 text-[var(--system-orange)]'
              }`}>
                <Utensils size={10} />
                Tag {message.mealReference}: {getMealTitle(message.mealReference, message.mealType)}
              </span>
            </div>
          )}

          {/* Image */}
          {hasImage && (
            <div
              className={`${hasText || replyMessage || (message.mealReference && message.mealType) ? 'px-1.5 pt-2' : 'p-1.5'} cursor-pointer`}
              onClick={() => setImageFullscreen(true)}
            >
              <div className="relative overflow-hidden rounded-2xl">
                {!imageLoaded && (
                  <div className={`w-full aspect-[4/3] animate-pulse ${
                    isOwnMessage ? 'bg-white/20' : 'bg-[var(--fill-secondary)]'
                  }`} />
                )}
                <img
                  src={message.mediaUrl}
                  alt="Bild"
                  className={`w-full h-auto max-h-[300px] object-cover rounded-2xl transition-opacity ${
                    imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                {/* Zoom hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors rounded-2xl">
                  <div className="opacity-0 hover:opacity-100 transition-opacity">
                    <ZoomIn size={32} className="text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>

              {/* Rating stars for image - integrated, not separate */}
              {onRate && (
                <div className={`flex items-center gap-1 mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRate(star);
                      }}
                      className="p-1 touch-manipulation"
                      whileTap={{ scale: 1.2 }}
                    >
                      <Star
                        size={20}
                        className={`transition-colors ${
                          star <= (message.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : isOwnMessage
                              ? 'text-white/30'
                              : 'text-gray-300'
                        }`}
                      />
                    </motion.button>
                  ))}
                  {hasRating && (
                    <span className={`text-sm ml-1 ${isOwnMessage ? 'text-white/60' : 'text-[var(--foreground-tertiary)]'}`}>
                      {message.rating === 5 ? '🎉' : message.rating === 4 ? '👍' : message.rating === 3 ? '👌' : message.rating === 2 ? '😕' : '😞'}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Text */}
          {hasText && (
            <p className={`px-3.5 ${hasImage ? 'pt-2' : 'pt-2.5'} text-[15px] leading-relaxed`}>
              {message.message}
            </p>
          )}

          {/* Rating stars for text-only feedback messages */}
          {!hasImage && hasRating && (
            <div className={`px-3.5 pt-1.5 flex gap-0.5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= message.rating!
                      ? isOwnMessage
                        ? 'fill-white text-white'
                        : 'fill-yellow-400 text-yellow-400'
                      : isOwnMessage
                        ? 'text-white/30'
                        : 'text-gray-300'
                  }
                />
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className="px-3.5 pb-2 pt-1 flex items-center gap-2">
            <span className={`text-[10px] ${isOwnMessage ? 'text-white/60' : 'text-[var(--foreground-tertiary)]'}`}>
              {formatTime(message.createdAt)}
            </span>
            {message.isEdited && (
              <span className={`text-[10px] ${isOwnMessage ? 'text-white/40' : 'text-[var(--foreground-tertiary)]'}`}>
                Bearbeitet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {portalContainer && hasImage && createPortal(
        <AnimatePresence>
          {imageFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col"
              style={{ height: '100dvh' }}
              onClick={() => setImageFullscreen(false)}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 pt-safe flex-shrink-0">
                <motion.button
                  onClick={(e) => { e.stopPropagation(); setImageFullscreen(false); }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10"
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={22} className="text-white" />
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download logic
                    const a = document.createElement('a');
                    a.href = message.mediaUrl!;
                    a.download = `bild-${Date.now()}.jpg`;
                    a.click();
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10"
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={20} className="text-white" />
                </motion.button>
              </div>

              {/* Image */}
              <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <motion.img
                  src={message.mediaUrl}
                  alt="Vollbild"
                  className="max-w-full max-h-full object-contain"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Rating in fullscreen */}
              {onRate && (
                <div className="flex-shrink-0 px-6 py-4 pb-safe" onClick={(e) => e.stopPropagation()}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <p className="text-white/70 text-sm mb-3">Wie war das Essen?</p>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          onClick={() => handleRate(star)}
                          className="p-2"
                          whileTap={{ scale: 1.2 }}
                        >
                          <Star
                            size={32}
                            className={`transition-colors ${
                              star <= (message.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-white/30'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        portalContainer
      )}

      {/* Click overlay to close menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
      )}
    </motion.div>
  );
}

// Action Button Component
function ActionButton({
  icon,
  onClick,
  label,
  danger
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-[var(--vibrancy-regular)]"
      whileTap={{ scale: 0.9 }}
      aria-label={label}
    >
      <span className={danger ? 'text-[var(--system-red)]' : 'text-[var(--foreground-secondary)]'}>
        {icon}
      </span>
    </motion.button>
  );
}
