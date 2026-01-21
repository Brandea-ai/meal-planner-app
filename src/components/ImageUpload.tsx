'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Loader2, Send, Camera, Image, FolderOpen } from 'lucide-react';
import { ImageUploadProgress } from '@/types';
import { isValidImageFile } from '@/lib/imageUpload';

interface ImageUploadProps {
  onUpload: (file: File, caption?: string) => Promise<void>;
  uploadProgress: ImageUploadProgress;
  disabled?: boolean;
}

export function ImageUpload({ onUpload, uploadProgress, disabled }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // Separate refs for different input types (iOS compatibility)
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Bitte wähle ein Bild aus');
      return;
    }

    if (!isValidImageFile(file)) {
      alert('Nur Bilder (JPEG, PNG, WebP, GIF) sind erlaubt');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setShowPreview(true);
    setShowActionSheet(false);

    // Reset inputs
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, []);

  const handleSend = async () => {
    if (!selectedFile) return;

    await onUpload(selectedFile, caption.trim() || undefined);

    // Clean up
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    setCaption('');
    setShowPreview(false);
  };

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    setCaption('');
    setShowPreview(false);
  };

  const openGallery = () => {
    galleryInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const isUploading = uploadProgress.status === 'compressing' || uploadProgress.status === 'uploading';

  return (
    <>
      {/* Hidden file inputs - separate for iOS compatibility */}

      {/* Gallery/Photo Library Input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Camera Input - iOS will show camera directly */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload button */}
      <motion.button
        onClick={() => setShowActionSheet(true)}
        disabled={disabled || isUploading}
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full glass-inner text-[var(--foreground-secondary)] disabled:opacity-50"
        aria-label="Bild senden"
        whileTap={{ scale: 0.95 }}
      >
        {isUploading ? (
          <Loader2 size={20} className="animate-spin text-[var(--system-blue)]" />
        ) : (
          <ImagePlus size={20} />
        )}
      </motion.button>

      {/* iOS-style Action Sheet */}
      <AnimatePresence>
        {showActionSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={() => setShowActionSheet(false)}
            />

            {/* Action Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="fixed bottom-0 left-0 right-0 z-[101] p-3 pb-safe"
            >
              {/* Options */}
              <div className="glass-card overflow-hidden mb-2">
                <button
                  onClick={openCamera}
                  className="flex w-full items-center gap-4 p-4 text-left active:bg-[var(--vibrancy-regular)] border-b border-[var(--glass-border)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-blue)]/15">
                    <Camera size={20} className="text-[var(--system-blue)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Foto aufnehmen</p>
                    <p className="text-xs text-[var(--foreground-tertiary)]">Mit der Kamera fotografieren</p>
                  </div>
                </button>

                <button
                  onClick={openGallery}
                  className="flex w-full items-center gap-4 p-4 text-left active:bg-[var(--vibrancy-regular)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-green)]/15">
                    <Image size={20} className="text-[var(--system-green)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Aus Mediathek wählen</p>
                    <p className="text-xs text-[var(--foreground-tertiary)]">Foto aus der Galerie auswählen</p>
                  </div>
                </button>
              </div>

              {/* Cancel Button */}
              <motion.button
                onClick={() => setShowActionSheet(false)}
                className="w-full glass-card p-4 text-center font-semibold text-[var(--system-blue)]"
                whileTap={{ scale: 0.98 }}
              >
                Abbrechen
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 safe-area-top">
              <motion.button
                onClick={handleCancel}
                disabled={isUploading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                <X size={24} />
              </motion.button>
              <h2 className="text-lg font-semibold text-white">Bild senden</h2>
              <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Image Preview */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              <motion.img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            </div>

            {/* Progress Bar */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="px-4 pb-2"
                >
                  <div className="glass-card p-3">
                    <div className="flex items-center gap-3">
                      <Loader2 size={20} className="animate-spin text-[var(--system-blue)]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {uploadProgress.status === 'compressing' ? 'Komprimiere...' : 'Lade hoch...'}
                        </p>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                          <motion.div
                            className="h-full bg-[var(--system-blue)] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-white/70">{uploadProgress.progress}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Caption Input & Send */}
            <div className="p-4 pb-safe">
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Beschreibung hinzufügen..."
                  disabled={isUploading}
                  className="flex-1 glass-card rounded-[20px] px-4 py-3 text-[15px] text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)] disabled:opacity-50"
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && !isUploading && handleSend()}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isUploading}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--system-blue)] text-white disabled:opacity-50"
                  aria-label="Senden"
                  whileTap={{ scale: 0.95 }}
                >
                  {isUploading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
