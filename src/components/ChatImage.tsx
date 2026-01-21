'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ZoomIn } from 'lucide-react';

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

  // Calculate aspect ratio for proper sizing
  const aspectRatio = width && height ? width / height : 4 / 3;
  const maxWidth = 240; // Max width in chat bubble
  const calculatedHeight = width && height ? Math.round(maxWidth / aspectRatio) : 180;

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-image-${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl ${
          isOwnMessage ? 'bg-white/20' : 'bg-[var(--fill-secondary)]'
        }`}
        style={{ width: maxWidth, height: calculatedHeight }}
      >
        <p className={`text-xs ${isOwnMessage ? 'text-white/70' : 'text-[var(--foreground-tertiary)]'}`}>
          Bild konnte nicht geladen werden
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail in chat */}
      <motion.div
        className="relative cursor-pointer overflow-hidden rounded-xl"
        style={{ maxWidth }}
        onClick={() => setIsFullscreen(true)}
        whileTap={{ scale: 0.98 }}
      >
        {/* Loading skeleton */}
        {!isLoaded && (
          <div
            className={`absolute inset-0 animate-pulse rounded-xl ${
              isOwnMessage ? 'bg-white/20' : 'bg-[var(--fill-secondary)]'
            }`}
            style={{ height: calculatedHeight }}
          />
        )}

        {/* Image */}
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto rounded-xl transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ maxHeight: 300 }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
        />

        {/* Zoom indicator */}
        {isLoaded && (
          <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <ZoomIn size={14} className="text-white" />
          </div>
        )}
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-xl"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 safe-area-top">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
                whileTap={{ scale: 0.95 }}
              >
                <X size={24} />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} />
              </motion.button>
            </div>

            {/* Full Image */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              <motion.img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Footer spacer for safe area */}
            <div className="pb-safe" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
