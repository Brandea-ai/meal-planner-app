'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Loader2, Send, Camera, Image as ImageIcon } from 'lucide-react';
import { ImageUploadProgress } from '@/types';

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
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const captionInputRef = useRef<HTMLInputElement>(null);

  // Setup portal container on mount
  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic image check
    const isImage = file.type.startsWith('image/') ||
                    /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(file.name);

    if (!isImage) {
      alert('Bitte wähle ein Bild aus');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setShowPreview(true);
    setShowActionSheet(false);

    // Reset inputs
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';

    // Focus caption input after short delay
    setTimeout(() => captionInputRef.current?.focus(), 300);
  }, []);

  const handleSend = async () => {
    if (!selectedFile) return;

    try {
      await onUpload(selectedFile, caption.trim() || undefined);

      // Clean up on success
      cleanup();
    } catch (error) {
      console.error('Upload failed:', error);
      // Don't cleanup on error - let user retry
    }
  };

  const cleanup = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    setCaption('');
    setShowPreview(false);
  };

  const handleCancel = () => {
    cleanup();
  };

  const isUploading = uploadProgress.status === 'compressing' || uploadProgress.status === 'uploading';
  const hasError = uploadProgress.status === 'error';

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
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

      {/* Action Sheet - rendered in portal to escape CSS transform containment */}
      {portalContainer && createPortal(
        <AnimatePresence>
          {showActionSheet && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/50"
                onClick={() => setShowActionSheet(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                className="fixed bottom-0 left-0 right-0 z-[101] px-3 pb-safe"
              >
                <div className="glass-card overflow-hidden rounded-2xl mb-2">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex w-full items-center gap-4 p-4 active:bg-[var(--vibrancy-regular)] border-b border-[var(--glass-border)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--system-blue)]">
                      <Camera size={22} className="text-white" />
                    </div>
                    <span className="text-[17px] font-medium text-[var(--foreground)]">Foto aufnehmen</span>
                  </button>
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex w-full items-center gap-4 p-4 active:bg-[var(--vibrancy-regular)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--system-green)]">
                      <ImageIcon size={22} className="text-white" />
                    </div>
                    <span className="text-[17px] font-medium text-[var(--foreground)]">Aus Fotos wählen</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowActionSheet(false)}
                  className="w-full glass-card rounded-2xl p-4 text-center text-[17px] font-semibold text-[var(--system-blue)]"
                >
                  Abbrechen
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        portalContainer
      )}

      {/* Preview Modal - rendered in portal to escape CSS transform containment */}
      {portalContainer && createPortal(
        <AnimatePresence>
          {showPreview && preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col bg-black"
              style={{ height: '100dvh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 pt-safe flex-shrink-0">
                <motion.button
                  onClick={handleCancel}
                  disabled={isUploading}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white disabled:opacity-50"
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={24} />
                </motion.button>
                <span className="text-[17px] font-semibold text-white">Bild senden</span>
                <div className="w-10" />
              </div>

              {/* Image */}
              <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                <motion.img
                  src={preview}
                  alt="Vorschau"
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                />
              </div>

              {/* Progress */}
              {isUploading && (
                <div className="px-4 py-3 flex-shrink-0">
                  <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4">
                    <Loader2 size={24} className="animate-spin text-white" />
                    <div className="flex-1">
                      <p className="text-[15px] font-medium text-white">
                        {uploadProgress.status === 'compressing' ? 'Wird komprimiert...' : 'Wird gesendet...'}
                      </p>
                      <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[var(--system-blue)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {hasError && (
                <div className="px-4 py-3 flex-shrink-0">
                  <div className="bg-[var(--system-red)]/20 rounded-2xl p-4 text-center">
                    <p className="text-[15px] text-[var(--system-red)]">
                      {uploadProgress.error || 'Fehler beim Senden'}
                    </p>
                  </div>
                </div>
              )}

              {/* Input & Send */}
              <div className="p-4 pb-safe flex-shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    ref={captionInputRef}
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Nachricht hinzufügen..."
                    disabled={isUploading}
                    className="flex-1 bg-white/10 rounded-full px-5 py-3.5 text-[17px] text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                    onKeyDown={(e) => e.key === 'Enter' && !isUploading && handleSend()}
                  />
                  <motion.button
                    onClick={handleSend}
                    disabled={isUploading}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--system-blue)] text-white disabled:opacity-50"
                    whileTap={{ scale: 0.95 }}
                  >
                    {isUploading ? (
                      <Loader2 size={22} className="animate-spin" />
                    ) : (
                      <Send size={22} />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        portalContainer
      )}
    </>
  );
}
