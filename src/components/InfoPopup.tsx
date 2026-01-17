'use client';

import { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface InfoPopupProps {
  title: string;
  children: React.ReactNode;
  iconSize?: number;
  iconColor?: string;
}

/**
 * InfoPopup - Mobile-first info popup component
 *
 * Mobile: Bottom sheet modal
 * Desktop: Centered modal
 *
 * Apple-like design with smooth animations
 */
export function InfoPopup({
  title,
  children,
  iconSize = 16,
  iconColor = 'var(--system-blue)'
}: InfoPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full p-1 transition-none active:opacity-70"
        aria-label={`Info: ${title}`}
        aria-haspopup="dialog"
      >
        <Info
          size={iconSize}
          className="opacity-60 hover:opacity-100"
          style={{ color: iconColor }}
        />
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-popup-title"
        >
          <div
            ref={modalRef}
            className="w-full max-w-sm animate-slide-up rounded-t-[20px] bg-[var(--background)] p-5 shadow-2xl sm:animate-fade-in sm:rounded-[20px]"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: `color-mix(in srgb, ${iconColor} 15%, transparent)` }}
                >
                  <Info size={16} style={{ color: iconColor }} />
                </div>
                <h2
                  id="info-popup-title"
                  className="text-lg font-semibold text-[var(--foreground)]"
                >
                  {title}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fill-tertiary)] transition-none active:opacity-80"
                aria-label="Schließen"
              >
                <X size={18} className="text-[var(--foreground-secondary)]" />
              </button>
            </div>

            {/* Content */}
            <div className="text-sm leading-relaxed text-[var(--foreground-secondary)]">
              {children}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full rounded-[12px] bg-[var(--fill-tertiary)] py-3 text-sm font-semibold text-[var(--foreground)] transition-none active:opacity-80"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * InfoCard - Inline info card for more prominent information
 */
interface InfoCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'tip' | 'warning';
}

export function InfoCard({ children, variant = 'default' }: InfoCardProps) {
  const colors = {
    default: { bg: 'var(--system-blue)', icon: 'var(--system-blue)' },
    tip: { bg: 'var(--system-green)', icon: 'var(--system-green)' },
    warning: { bg: 'var(--system-orange)', icon: 'var(--system-orange)' },
  };

  const { bg, icon } = colors[variant];

  return (
    <div
      className="flex items-start gap-3 rounded-[12px] p-3"
      style={{ backgroundColor: `color-mix(in srgb, ${bg} 10%, transparent)` }}
    >
      <Info size={18} className="mt-0.5 flex-shrink-0" style={{ color: icon }} />
      <div className="text-sm text-[var(--foreground-secondary)]">
        {children}
      </div>
    </div>
  );
}
