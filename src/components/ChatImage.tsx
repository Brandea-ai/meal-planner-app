'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Download } from 'lucide-react';

interface ChatImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  isOwnMessage: boolean;
  messageId?: string;
  rating?: number;
  onRate?: (rating: number) => void;
  caption?: string;
}

export function ChatImage({
  src,
  alt = 'Bild',
  width,
  height,
  isOwnMessage,
  rating,
  onRate,
}: ChatImageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  // Calculate aspect ratio for thumbnail
  const aspectRatio = width && height ? width / height : 4 / 3;
  const maxWidth = 240;
  const calculatedHeight = Math.min(280, Math.round(maxWidth / aspectRatio));

  const handleRate = (newRating: number) => {
    if (onRate) {
      onRate(newRating);
    }
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl ${
          isOwnMessage ? 'bg-white/10' : 'bg-[var(--fill-secondary)]'
        }`}
        style={{ width: maxWidth, height: 100 }}
      >
        <p className={`text-xs ${isOwnMessage ? 'text-white/50' : 'text-[var(--foreground-tertiary)]'}`}>
          Bild nicht verfügbar
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Image Container */}
      <div className="space-y-2">
        {/* Thumbnail */}
        <motion.div
          className="relative cursor-pointer overflow-hidden rounded-2xl"
          style={{ maxWidth }}
          onClick={() => setIsFullscreen(true)}
          whileTap={{ scale: 0.98 }}
        >
          {/* Skeleton */}
          {!isLoaded && (
            <div
              className={`animate-pulse rounded-2xl ${
                isOwnMessage ? 'bg-white/15' : 'bg-[var(--fill-secondary)]'
              }`}
              style={{ width: maxWidth, height: calculatedHeight }}
            />
          )}

          {/* Image */}
          <img
            src={src}
            alt={alt}
            className={`w-full h-auto rounded-2xl transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            style={{ maxHeight: 280 }}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        </motion.div>

        {/* Inline Rating - clean and simple */}
        {onRate && (
          <div className={`flex items-center gap-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRate(star);
                }}
                className="p-0.5 touch-manipulation"
                whileTap={{ scale: 1.2 }}
              >
                <Star
                  size={18}
                  className={`transition-colors ${
                    star <= (rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : isOwnMessage
                        ? 'text-white/25'
                        : 'text-gray-300'
                  }`}
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {portalContainer && createPortal(
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex flex-col bg-black"
              style={{ height: '100dvh' }}
              onClick={() => setIsFullscreen(false)}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 pt-safe flex-shrink-0">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(false);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10"
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={22} className="text-white" />
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    const a = document.createElement('a');
                    a.href = src;
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
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-full object-contain"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Rating Section */}
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
                            size={28}
                            className={`transition-colors ${
                              star <= (rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-white/30'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    {rating && rating > 0 && (
                      <p className="text-white/50 text-xs mt-2">
                        {rating === 5 ? '🎉 Fantastisch!' :
                         rating === 4 ? '👍 Sehr gut!' :
                         rating === 3 ? '👌 Okay' :
                         rating === 2 ? '😕 Könnte besser sein' :
                         '😞 Nicht so gut'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        portalContainer
      )}
    </>
  );
}
