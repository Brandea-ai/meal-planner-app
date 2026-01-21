'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Loader2, Send } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      alert('Nur Bilder (JPEG, PNG, WebP, GIF) sind erlaubt');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setShowPreview(true);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const isUploading = uploadProgress.status === 'compressing' || uploadProgress.status === 'uploading';

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload button */}
      <motion.button
        onClick={() => fileInputRef.current?.click()}
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
