'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ChatImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  isOwnMessage: boolean;
}

export function ChatImage({ src, alt = 'Bild', width, height, isOwnMessage }: ChatImageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Calculate aspect ratio
  const aspectRatio = width && height ? width / height : 4 / 3;
  const maxWidth = 220;
  const calculatedHeight = Math.min(280, Math.round(maxWidth / aspectRatio));

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl ${
          isOwnMessage ? 'bg-white/20' : 'bg-[var(--fill-secondary)]'
        }`}
        style={{ width: maxWidth, height: 120 }}
      >
        <p className={`text-xs ${isOwnMessage ? 'text-white/60' : 'text-[var(--foreground-tertiary)]'}`}>
          Bild nicht verfügbar
        </p>
      </div>
    );
  }

  return (
    <>
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
              isOwnMessage ? 'bg-white/20' : 'bg-[var(--fill-secondary)]'
            }`}
            style={{ width: maxWidth, height: calculatedHeight }}
          />
        )}

        {/* Image */}
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto rounded-2xl ${isLoaded ? 'block' : 'hidden'}`}
          style={{ maxHeight: 280 }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </motion.div>

      {/* Fullscreen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-black"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="flex justify-between p-4 pt-safe">
              <motion.button
                onClick={() => setIsFullscreen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"
                whileTap={{ scale: 0.95 }}
              >
                <X size={24} className="text-white" />
              </motion.button>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              <motion.img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="pb-safe" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
