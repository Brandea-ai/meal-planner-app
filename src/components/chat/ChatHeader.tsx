'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Video,
  Settings,
  Shield,
  Smartphone,
  Lock,
  LogOut,
  User,
  Trash2,
} from 'lucide-react';

interface ChatHeaderProps {
  messageCount: number;
  isEncrypted: boolean;
  senderName: string;
  callState: string;
  showSettings: boolean;
  onBack: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onToggleSettings: () => void;
  onShowDeviceSync: () => void;
  onShowEncryptionSetup: () => void;
  onShowNameInput: () => void;
  onLogout: () => void;
  onResetData: () => void;
}

export function ChatHeader({
  messageCount,
  isEncrypted,
  senderName,
  callState,
  showSettings,
  onBack,
  onStartCall,
  onToggleSettings,
  onShowDeviceSync,
  onShowEncryptionSetup,
  onShowNameInput,
  onLogout,
  onResetData,
}: ChatHeaderProps) {
  return (
    <>
      <header className="flex-shrink-0 z-40 glass-header safe-area-top">
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          {/* Back button */}
          <motion.button
            onClick={onBack}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full glass-inner"
            aria-label="Zurück"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-[var(--system-blue)]" />
          </motion.button>

          {/* Title */}
          <div className="flex flex-1 items-center justify-center min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--system-green)]">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h1 className="font-semibold text-[var(--foreground)] text-sm truncate">Chat</h1>
                  {isEncrypted && (
                    <Shield size={12} className="text-[var(--system-green)] flex-shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-[var(--foreground-tertiary)] truncate">
                  {messageCount} Nachrichten
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.button
              onClick={() => onStartCall('audio')}
              disabled={callState !== 'idle'}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--system-green)]/15 text-[var(--system-green)] disabled:opacity-50"
              aria-label="Anrufen"
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={16} />
            </motion.button>
            <motion.button
              onClick={() => onStartCall('video')}
              disabled={callState !== 'idle'}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--system-blue)]/15 text-[var(--system-blue)] disabled:opacity-50"
              aria-label="Video"
              whileTap={{ scale: 0.95 }}
            >
              <Video size={16} />
            </motion.button>
            <div className="relative">
              <motion.button
                onClick={onToggleSettings}
                className="flex h-9 w-9 items-center justify-center rounded-full glass-inner"
                aria-label="Einstellungen"
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={16} className="text-[var(--foreground-secondary)]" />
              </motion.button>

              {/* Settings Dropdown */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-11 z-50 w-56 glass-card p-2 shadow-xl"
                  >
                    <SettingsMenuItem
                      icon={<Smartphone size={18} className="text-[var(--system-blue)]" />}
                      title="Geräte verbinden"
                      subtitle="Mit QR-Code synchronisieren"
                      onClick={onShowDeviceSync}
                    />

                    {!isEncrypted && (
                      <SettingsMenuItem
                        icon={<Lock size={18} className="text-[var(--system-green)]" />}
                        title="Verschlüsselung aktivieren"
                        subtitle="Chat mit Passwort schützen"
                        onClick={onShowEncryptionSetup}
                      />
                    )}

                    {isEncrypted && (
                      <SettingsMenuItem
                        icon={<LogOut size={18} className="text-[var(--system-red)]" />}
                        title="Abmelden"
                        subtitle="Verschlüsselung zurücksetzen"
                        onClick={onLogout}
                      />
                    )}

                    <SettingsMenuItem
                      icon={<User size={18} className="text-[var(--foreground-secondary)]" />}
                      title="Name ändern"
                      subtitle={senderName || 'Nicht gesetzt'}
                      onClick={onShowNameInput}
                    />

                    <div className="my-2 border-t border-[var(--glass-border)]" />

                    <SettingsMenuItem
                      icon={<Trash2 size={18} className="text-[var(--system-red)]" />}
                      title="Alle Daten löschen"
                      subtitle="Zurücksetzen & neu verbinden"
                      onClick={onResetData}
                      danger
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay to close settings */}
      {showSettings && (
        <div
          className="fixed inset-0 z-40"
          onClick={onToggleSettings}
        />
      )}
    </>
  );
}

interface SettingsMenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  danger?: boolean;
}

function SettingsMenuItem({ icon, title, subtitle, onClick, danger }: SettingsMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[10px] p-3 text-left transition-none active:bg-[var(--vibrancy-regular)]"
    >
      {icon}
      <div>
        <p className={`text-sm font-medium ${danger ? 'text-[var(--system-red)]' : 'text-[var(--foreground)]'}`}>
          {title}
        </p>
        <p className="text-xs text-[var(--foreground-tertiary)]">{subtitle}</p>
      </div>
    </button>
  );
}
