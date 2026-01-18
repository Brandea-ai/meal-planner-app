'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertCircle, ArrowLeft } from 'lucide-react';

interface PasswordSetupProps {
  isNewSetup: boolean; // true = first time setup, false = login
  onPasswordSet: (password: string) => void;
  onError?: (error: string) => void;
  verifyPassword?: (password: string) => Promise<boolean>;
  onBack?: () => void; // Optional back button handler
}

export function PasswordSetup({
  isNewSetup,
  onPasswordSet,
  onError,
  verifyPassword,
  onBack,
}: PasswordSetupProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (isNewSetup) {
      // New setup - validate passwords match
      if (password.length < 6) {
        setError('Passwort muss mindestens 6 Zeichen haben');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwörter stimmen nicht überein');
        return;
      }
      onPasswordSet(password);
    } else {
      // Login - verify password
      if (!password) {
        setError('Bitte Passwort eingeben');
        return;
      }

      setIsLoading(true);
      try {
        if (verifyPassword) {
          const isValid = await verifyPassword(password);
          if (!isValid) {
            setError('Falsches Passwort');
            onError?.('Falsches Passwort');
            setIsLoading(false);
            return;
          }
        }
        onPasswordSet(password);
      } catch {
        setError('Fehler bei der Überprüfung');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6">
      {/* Back Button */}
      {onBack && (
        <div className="fixed top-0 left-0 right-0 z-10 flex items-center p-4 pt-[calc(1rem+env(safe-area-inset-top))]">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fill-tertiary)] text-[var(--foreground)] transition-none active:opacity-80"
            aria-label="Zurück"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      )}

      <div className="w-full max-w-sm rounded-[20px] bg-[var(--background-secondary)] p-6 shadow-lg">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--system-green)]/15">
          <Shield size={40} className="text-[var(--system-green)]" />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-xl font-bold text-[var(--foreground)]">
          {isNewSetup ? 'Chat verschlüsseln' : 'Chat entsperren'}
        </h2>

        {/* Description */}
        <p className="mb-6 text-center text-sm text-[var(--foreground-secondary)]">
          {isNewSetup
            ? 'Wähle ein Familien-Passwort. Alle Nachrichten werden damit Ende-zu-Ende verschlüsselt.'
            : 'Gib dein Familien-Passwort ein, um den Chat zu lesen.'}
        </p>

        {/* Security Badge */}
        <div className="mb-6 flex items-center justify-center gap-2 rounded-[10px] bg-[var(--system-green)]/10 p-3">
          <Lock size={16} className="text-[var(--system-green)]" />
          <span className="text-xs font-medium text-[var(--system-green)]">
            AES-256-GCM Verschlüsselung
          </span>
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isNewSetup ? 'Neues Passwort' : 'Passwort eingeben'}
            className="w-full rounded-[12px] bg-[var(--fill-tertiary)] px-4 py-3.5 pr-12 text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-green)]"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && !isNewSetup && handleSubmit()}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--foreground-tertiary)]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password (only for new setup) */}
        {isNewSetup && (
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Passwort bestätigen"
              className="w-full rounded-[12px] bg-[var(--fill-tertiary)] px-4 py-3.5 text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-green)]"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-[10px] bg-[var(--system-red)]/10 p-3">
            <AlertCircle size={16} className="flex-shrink-0 text-[var(--system-red)]" />
            <span className="text-sm text-[var(--system-red)]">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !password || (isNewSetup && !confirmPassword)}
          className="w-full rounded-[12px] bg-[var(--system-green)] py-3.5 font-semibold text-white transition-none active:opacity-80 disabled:opacity-50"
        >
          {isLoading ? 'Überprüfe...' : isNewSetup ? 'Chat verschlüsseln' : 'Entsperren'}
        </button>

        {/* Info Text */}
        <p className="mt-4 text-center text-xs text-[var(--foreground-tertiary)]">
          {isNewSetup
            ? 'Dieses Passwort müssen alle Familienmitglieder kennen, um den Chat zu lesen.'
            : 'Das Passwort verlässt niemals dein Gerät.'}
        </p>
      </div>
    </div>
  );
}
