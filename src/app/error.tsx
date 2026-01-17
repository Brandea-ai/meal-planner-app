'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-sm rounded-[20px] bg-[var(--background-secondary)] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--system-red)]/15">
          <AlertTriangle size={32} className="text-[var(--system-red)]" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-[var(--foreground)]">
          Etwas ist schiefgelaufen
        </h2>

        <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
          Die App ist auf einen Fehler gestoßen. Bitte versuche es erneut.
        </p>

        {/* Error details (for debugging) */}
        {error.message && (
          <div className="mt-4 rounded-[10px] bg-[var(--fill-tertiary)] p-3 text-left">
            <p className="text-xs font-mono text-[var(--foreground-tertiary)] break-all">
              {error.message}
            </p>
          </div>
        )}

        <button
          onClick={reset}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--system-blue)] py-3.5 font-semibold text-white transition-none active:opacity-80"
        >
          <RefreshCw size={18} />
          Erneut versuchen
        </button>

        <button
          onClick={() => window.location.reload()}
          className="mt-3 w-full rounded-[12px] bg-[var(--fill-tertiary)] py-3 text-sm font-medium text-[var(--foreground)] transition-none active:opacity-80"
        >
          Seite neu laden
        </button>
      </div>
    </div>
  );
}
