'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, User } from 'lucide-react';
import { CallType } from '@/types';

interface IncomingCallProps {
  callerName: string;
  callType: CallType;
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCall({ callerName, callType, onAccept, onReject }: IncomingCallProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="mx-4 w-full max-w-sm rounded-[24px] bg-[var(--background-secondary)] p-8 text-center relative overflow-hidden"
        >
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute h-32 w-32 rounded-full bg-[var(--system-green)]"
            />
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="absolute h-32 w-32 rounded-full bg-[var(--system-green)]"
            />
          </div>

          {/* Caller Avatar */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--system-green)]/20 z-10"
          >
            <User size={48} className="text-[var(--system-green)]" />
          </motion.div>

          {/* Caller Info */}
          <h2 className="relative mb-2 text-2xl font-bold text-[var(--foreground)] z-10">
            {callerName}
          </h2>
          <p className="relative mb-2 text-[var(--foreground-secondary)] z-10">
            {callType === 'video' ? 'Videoanruf' : 'Sprachanruf'}
          </p>

          {/* Ringing indicator */}
          <motion.p
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative mb-8 text-sm text-[var(--system-green)] font-medium z-10"
          >
            Klingelt...
          </motion.p>

          {/* Call Type Icon */}
          <div className="relative mb-8 flex justify-center z-10">
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              {callType === 'video' ? (
                <Video size={32} className="text-[var(--system-green)]" />
              ) : (
                <Phone size={32} className="text-[var(--system-green)]" />
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="relative flex justify-center gap-8 z-10">
            {/* Reject Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onReject}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--system-red)] text-white shadow-lg"
              aria-label="Ablehnen"
            >
              <PhoneOff size={28} />
            </motion.button>

            {/* Accept Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              onClick={onAccept}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--system-green)] text-white shadow-lg"
              aria-label="Annehmen"
            >
              {callType === 'video' ? <Video size={28} /> : <Phone size={28} />}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
