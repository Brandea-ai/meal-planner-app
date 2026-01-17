'use client';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="mx-4 w-full max-w-sm rounded-[24px] bg-[var(--background-secondary)] p-8 text-center">
        {/* Caller Avatar */}
        <div className="mx-auto mb-6 flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-[var(--system-green)]/20">
          <User size={48} className="text-[var(--system-green)]" />
        </div>

        {/* Caller Info */}
        <h2 className="mb-2 text-2xl font-bold text-[var(--foreground)]">
          {callerName}
        </h2>
        <p className="mb-8 text-[var(--foreground-secondary)]">
          {callType === 'video' ? 'Videoanruf' : 'Sprachanruf'}
        </p>

        {/* Call Type Icon */}
        <div className="mb-8 flex justify-center">
          {callType === 'video' ? (
            <Video size={32} className="animate-bounce text-[var(--system-green)]" />
          ) : (
            <Phone size={32} className="animate-bounce text-[var(--system-green)]" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8">
          {/* Reject Button */}
          <button
            onClick={onReject}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--system-red)] text-white transition-none active:opacity-80"
            aria-label="Ablehnen"
          >
            <PhoneOff size={28} />
          </button>

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--system-green)] text-white transition-none active:opacity-80"
            aria-label="Annehmen"
          >
            {callType === 'video' ? <Video size={28} /> : <Phone size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
}
