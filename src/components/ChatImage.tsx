'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ZoomIn, Download } from 'lucide-react';

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
  timestamp?: string;
}

export function ChatImage({
  src,
  alt = 'Bild',
  width,
  height,
  isOwnMessage,
  messageId,
  rating,
  onRate,
  caption,
  timestamp
}: ChatImageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  // Calculate aspect ratio for thumbnail
  const aspectRatio = width && height ? width / height : 4 / 3;
  const maxWidth = 260;
  const calculatedHeight = Math.min(320, Math.round(maxWidth / aspectRatio));

  const handleRate = (newRating: number) => {
    if (onRate) {
      onRate(newRating);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bild-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl ${
          isOwnMessage ? 'bg-white/10' : 'bg-[var(--fill-secondary)]'
        }`}
        style={{ width: maxWidth, height: 120 }}
      >
        <div className="text-center">
          <div className={`text-2xl mb-1 ${isOwnMessage ? 'opacity-40' : 'opacity-30'}`}>🖼️</div>
          <p className={`text-xs ${isOwnMessage ? 'text-white/50' : 'text-[var(--foreground-tertiary)]'}`}>
            Bild nicht verfügbar
          </p>
        </div>
      </div>
    );
  }

  const renderStars = (interactive: boolean = false, size: number = 16) => {
    const currentRating = interactive && hoverRating > 0 ? hoverRating : (rating || 0);

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (interactive) handleRate(star);
            }}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} touch-manipulation`}
            whileTap={interactive ? { scale: 1.2 } : undefined}
            disabled={!interactive}
          >
            <Star
              size={size}
              className={`transition-colors ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : interactive
                    ? 'text-white/30 hover:text-yellow-400/50'
                    : isOwnMessage
                      ? 'text-white/20'
                      : 'text-[var(--foreground-tertiary)]/30'
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Thumbnail with premium styling */}
      <motion.div
        className="relative cursor-pointer group"
        style={{ maxWidth }}
        onClick={() => setIsFullscreen(true)}
        whileTap={{ scale: 0.98 }}
      >
        {/* Container with shadow and border */}
        <div className={`relative overflow-hidden rounded-2xl ${
          isOwnMessage
            ? 'shadow-lg shadow-black/20'
            : 'shadow-md shadow-black/10'
        }`}>
          {/* Skeleton loader */}
          {!isLoaded && (
            <div
              className={`absolute inset-0 animate-pulse ${
                isOwnMessage ? 'bg-white/10' : 'bg-[var(--fill-secondary)]'
              }`}
              style={{ width: maxWidth, height: calculatedHeight }}
            />
          )}

          {/* Image */}
          <img
            src={src}
            alt={alt}
            className={`w-full h-auto block transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ maxHeight: 320 }}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />

          {/* Gradient overlay for zoom hint */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

          {/* Zoom icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
              <ZoomIn size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Rating display (if rated) */}
        {rating && rating > 0 && (
          <div className={`mt-2 flex items-center gap-1.5 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {renderStars(false, 14)}
            <span className={`text-xs font-medium ${
              isOwnMessage ? 'text-white/60' : 'text-[var(--foreground-tertiary)]'
            }`}>
              {rating}/5
            </span>
          </div>
        )}

        {/* "Tap to rate" hint if not rated */}
        {!rating && onRate && (
          <div className={`mt-1.5 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
            <span className={`text-[11px] ${
              isOwnMessage ? 'text-white/40' : 'text-[var(--foreground-tertiary)]/60'
            }`}>
              Tippen zum Bewerten
            </span>
          </div>
        )}
      </motion.div>

      {/* Fullscreen Modal - rendered via Portal */}
      {portalContainer && createPortal(
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-xl"
              style={{ height: '100dvh' }}
              onClick={() => setIsFullscreen(false)}
            >
              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-4 pt-safe flex-shrink-0"
              >
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(false);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={22} className="text-white" />
                </motion.button>

                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={20} className="text-white" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Image */}
              <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <motion.img
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.1}
                />
              </div>

              {/* Rating Section */}
              {onRate && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex-shrink-0 px-6 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="glass-card p-5 rounded-2xl">
                    <p className="text-center text-white/70 text-sm mb-3 font-medium">
                      Wie hat dir das Essen geschmeckt?
                    </p>
                    <div className="flex justify-center">
                      {renderStars(true, 32)}
                    </div>
                    {rating && rating > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-white/50 text-xs mt-3"
                      >
                        {rating === 5 ? '🎉 Fantastisch!' :
                         rating === 4 ? '👍 Sehr gut!' :
                         rating === 3 ? '😊 Okay' :
                         rating === 2 ? '😕 Könnte besser sein' :
                         '😞 Nicht so gut'}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Caption if present */}
              {caption && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-shrink-0 px-6 pb-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-white/80 text-center text-sm">{caption}</p>
                </motion.div>
              )}

              <div className="pb-safe flex-shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>,
        portalContainer
      )}
    </>
  );
}
