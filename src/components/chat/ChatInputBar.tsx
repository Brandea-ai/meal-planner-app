'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { Send, Star, Check } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageUploadProgress } from '@/types';

interface ChatInputBarProps {
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  feedbackMode: boolean;
  onToggleFeedbackMode: () => void;
  editingMessage: { id: string } | null;
  uploadProgress: ImageUploadProgress;
  onImageUpload: (file: File, caption?: string) => Promise<void>;
}

export interface ChatInputBarRef {
  focus: () => void;
}

export const ChatInputBar = forwardRef<ChatInputBarRef, ChatInputBarProps>(
  function ChatInputBar(
    {
      inputMessage,
      onInputChange,
      onSend,
      feedbackMode,
      onToggleFeedbackMode,
      editingMessage,
      uploadProgress,
      onImageUpload,
    },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    };

    return (
      <div className="flex-shrink-0 border-t border-[var(--glass-border)] glass-header p-3 pb-safe">
        <div className="flex items-end gap-2">
          {/* Feedback Mode Toggle */}
          <motion.button
            onClick={onToggleFeedbackMode}
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
              feedbackMode
                ? 'bg-[var(--system-orange)] text-white'
                : 'glass-inner text-[var(--foreground-secondary)]'
            }`}
            aria-label="Feedback-Modus"
            whileTap={{ scale: 0.95 }}
          >
            <Star size={20} />
          </motion.button>

          {/* Image Upload */}
          <ImageUpload
            onUpload={onImageUpload}
            uploadProgress={uploadProgress}
            disabled={!!editingMessage}
          />

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={
                editingMessage
                  ? 'Nachricht bearbeiten...'
                  : feedbackMode
                    ? 'Feedback schreiben...'
                    : 'Nachricht schreiben...'
              }
              className="w-full glass-inner rounded-[20px] px-4 py-3 text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Send Button */}
          <motion.button
            onClick={onSend}
            disabled={!inputMessage.trim()}
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full disabled:opacity-50 ${
              editingMessage
                ? 'bg-[var(--system-green)] text-white'
                : 'bg-[var(--system-blue)] text-white'
            }`}
            aria-label={editingMessage ? 'Speichern' : 'Nachricht senden'}
            whileTap={{ scale: 0.95 }}
          >
            {editingMessage ? <Check size={20} /> : <Send size={20} />}
          </motion.button>
        </div>
      </div>
    );
  }
);
