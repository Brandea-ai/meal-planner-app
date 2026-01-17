'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  User,
  Star,
  Trash2,
  MessageCircle,
  Utensils,
  ArrowLeft,
  Reply,
  Pencil,
  X,
  Check,
  Phone,
  Video,
  Shield,
  LogOut,
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useCall } from '@/hooks/useCall';
import { breakfastMeals, dinnerMeals } from '@/data/meals';
import { MealType, ChatMessage } from '@/types';
import { IncomingCall } from './IncomingCall';
import { ActiveCall } from './ActiveCall';
import { PasswordSetup } from './PasswordSetup';

interface ChatProps {
  onBack: () => void;
}

const messageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export function Chat({ onBack }: ChatProps) {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    updateMessage,
    deleteMessage,
    senderName,
    setSenderName,
    isEncrypted,
    needsPassword,
    isPasswordSetup,
    setPassword,
    verifyPassword,
    logout,
  } = useChat();

  const {
    callState,
    callSession,
    localStream,
    remoteStream,
    error: callError,
    isMuted,
    isVideoOff,
    incomingCall,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useCall(senderName);

  const [inputMessage, setInputMessage] = useState('');
  const [showNameInput, setShowNameInput] = useState(!senderName);
  const [tempName, setTempName] = useState('');
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{ day: number; type: MealType } | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (replyingTo || editingMessage) {
      inputRef.current?.focus();
    }
  }, [replyingTo, editingMessage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (editingMessage) {
      await updateMessage(editingMessage.id, inputMessage.trim());
      setEditingMessage(null);
      setInputMessage('');
      return;
    }

    await sendMessage({
      senderName: senderName || 'Anonym',
      message: inputMessage.trim(),
      messageType: feedbackMode ? 'feedback' : 'text',
      mealReference: selectedMeal?.day,
      mealType: selectedMeal?.type,
      rating: feedbackMode ? selectedRating : undefined,
      replyTo: replyingTo?.id,
    });

    setInputMessage('');
    setFeedbackMode(false);
    setSelectedMeal(null);
    setSelectedRating(0);
    setReplyingTo(null);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setSenderName(tempName.trim());
      setShowNameInput(false);
      setTempName('');
    }
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
    setEditingMessage(null);
    setActiveMessageMenu(null);
  };

  const handleEdit = (message: ChatMessage) => {
    setEditingMessage(message);
    setInputMessage(message.message);
    setReplyingTo(null);
    setActiveMessageMenu(null);
  };

  const handleDelete = async (messageId: string) => {
    await deleteMessage(messageId);
    setActiveMessageMenu(null);
  };

  const cancelReplyOrEdit = () => {
    setReplyingTo(null);
    setEditingMessage(null);
    setInputMessage('');
  };

  const handleTouchStart = useCallback((messageId: string) => {
    longPressTimer.current = setTimeout(() => {
      setActiveMessageMenu(messageId);
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const getMealTitle = (day: number, type: MealType) => {
    const meals = type === 'breakfast' ? breakfastMeals : dinnerMeals;
    const meal = meals.find((m) => m.day === day);
    return meal?.title || `Tag ${day}`;
  };

  const getMessageById = (id: string) => {
    return messages.find((m) => m.id === id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Heute';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Gestern';
    }
    return date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);

  if (needsPassword || (!isPasswordSetup && !isEncrypted)) {
    return (
      <PasswordSetup
        isNewSetup={!isPasswordSetup}
        onPasswordSet={setPassword}
        verifyPassword={verifyPassword}
      />
    );
  }

  if (showNameInput && !senderName) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6">
        <motion.div
          className="glass-card w-full max-w-sm p-6"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <motion.div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--system-blue)]/15"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
          >
            <User size={32} className="text-[var(--system-blue)]" />
          </motion.div>
          <h2 className="mb-2 text-center text-xl font-bold text-[var(--foreground)]">
            Wie heißt du?
          </h2>
          <p className="mb-6 text-center text-sm text-[var(--foreground-secondary)]">
            Dein Name wird bei deinen Nachrichten angezeigt
          </p>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Dein Name..."
            className="mb-4 w-full glass-inner rounded-[14px] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
          />
          <motion.button
            onClick={handleSaveName}
            disabled={!tempName.trim()}
            className="w-full rounded-[14px] bg-[var(--system-blue)] py-3.5 font-semibold text-white disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
          >
            Weiter
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-header safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full glass-inner"
            aria-label="Zurück"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={24} className="text-[var(--system-blue)]" />
          </motion.button>
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--system-green)]">
              <MessageCircle size={18} className="text-white" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <h1 className="font-semibold text-[var(--foreground)]">Familien-Chat</h1>
                {isEncrypted && (
                  <Shield size={14} className="text-[var(--system-green)]" />
                )}
              </div>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                {isEncrypted ? 'Verschlüsselt' : ''} {messages.length} Nachrichten
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => startCall('audio')}
              disabled={callState !== 'idle'}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-green)]/15 text-[var(--system-green)] disabled:opacity-50"
              aria-label="Sprachanruf"
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={18} />
            </motion.button>
            <motion.button
              onClick={() => startCall('video')}
              disabled={callState !== 'idle'}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-blue)]/15 text-[var(--system-blue)] disabled:opacity-50"
              aria-label="Videoanruf"
              whileTap={{ scale: 0.95 }}
            >
              <Video size={18} />
            </motion.button>
            <motion.button
              onClick={() => setShowNameInput(true)}
              className="flex h-10 items-center gap-1.5 rounded-full glass-inner px-3 text-sm text-[var(--foreground-secondary)]"
              whileTap={{ scale: 0.95 }}
            >
              <User size={14} />
              {senderName}
            </motion.button>
            <motion.button
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-red)]/15 text-[var(--system-red)]"
              aria-label="Zurücksetzen"
              title="Verschlüsselung zurücksetzen"
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <motion.div
              className="h-10 w-10 rounded-full border-4 border-[var(--fill-secondary)] border-t-[var(--system-blue)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            className="flex h-full flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full glass-inner">
              <MessageCircle size={40} className="text-[var(--foreground-tertiary)]" />
            </div>
            <p className="text-[var(--foreground-secondary)]">Noch keine Nachrichten</p>
            <p className="mt-1 text-sm text-[var(--foreground-tertiary)]">
              Starte eine Unterhaltung über eure Mahlzeiten!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="mb-3 flex items-center justify-center">
                  <span className="glass-inner px-4 py-1.5 text-xs font-medium text-[var(--foreground-tertiary)]">
                    {date}
                  </span>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {dateMessages.map((message) => {
                      const isOwnMessage = message.senderName === senderName;
                      const replyMessage = message.replyTo ? getMessageById(message.replyTo) : null;
                      const isMenuOpen = activeMessageMenu === message.id;

                      return (
                        <motion.div
                          key={message.id}
                          variants={messageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          layout
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className="relative max-w-[85%]"
                            onTouchStart={() => isOwnMessage && handleTouchStart(message.id)}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchEnd}
                            onContextMenu={(e) => {
                              if (isOwnMessage) {
                                e.preventDefault();
                                setActiveMessageMenu(message.id);
                              }
                            }}
                          >
                            {/* Message Actions Menu */}
                            <AnimatePresence>
                              {isMenuOpen && isOwnMessage && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                  className="absolute -top-14 right-0 z-50 flex gap-1 glass-card p-1.5"
                                >
                                  <motion.button
                                    onClick={() => handleReply(message)}
                                    className="flex h-9 w-9 items-center justify-center rounded-[10px] hover:bg-[var(--vibrancy-regular)]"
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Antworten"
                                  >
                                    <Reply size={18} className="text-[var(--foreground-secondary)]" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleEdit(message)}
                                    className="flex h-9 w-9 items-center justify-center rounded-[10px] hover:bg-[var(--vibrancy-regular)]"
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Bearbeiten"
                                  >
                                    <Pencil size={18} className="text-[var(--foreground-secondary)]" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleDelete(message.id)}
                                    className="flex h-9 w-9 items-center justify-center rounded-[10px] hover:bg-[var(--vibrancy-regular)]"
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Löschen"
                                  >
                                    <Trash2 size={18} className="text-[var(--system-red)]" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => setActiveMessageMenu(null)}
                                    className="flex h-9 w-9 items-center justify-center rounded-[10px] hover:bg-[var(--vibrancy-regular)]"
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Schließen"
                                  >
                                    <X size={18} className="text-[var(--foreground-tertiary)]" />
                                  </motion.button>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Message Bubble */}
                            <motion.div
                              className={`rounded-[20px] p-3.5 ${
                                isOwnMessage
                                  ? 'bg-[var(--system-blue)] text-white'
                                  : 'glass-card text-[var(--foreground)]'
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Sender name */}
                              {!isOwnMessage && (
                                <p className="mb-1.5 text-xs font-semibold text-[var(--system-blue)]">
                                  {message.senderName}
                                </p>
                              )}

                              {/* Reply preview */}
                              {replyMessage && (
                                <div
                                  className={`mb-2.5 rounded-[12px] border-l-2 p-2.5 ${
                                    isOwnMessage
                                      ? 'border-white/50 bg-white/15'
                                      : 'border-[var(--system-blue)] bg-[var(--vibrancy-thin)]'
                                  }`}
                                >
                                  <p
                                    className={`text-xs font-semibold ${
                                      isOwnMessage ? 'text-white/90' : 'text-[var(--system-blue)]'
                                    }`}
                                  >
                                    {replyMessage.senderName}
                                  </p>
                                  <p
                                    className={`line-clamp-2 text-xs ${
                                      isOwnMessage ? 'text-white/70' : 'text-[var(--foreground-secondary)]'
                                    }`}
                                  >
                                    {replyMessage.message}
                                  </p>
                                </div>
                              )}

                              {/* Meal reference badge */}
                              {message.mealReference && message.mealType && (
                                <div
                                  className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                    isOwnMessage
                                      ? 'bg-white/20 text-white'
                                      : 'bg-[var(--system-orange)]/15 text-[var(--system-orange)]'
                                  }`}
                                >
                                  <Utensils size={10} />
                                  Tag {message.mealReference}: {getMealTitle(message.mealReference, message.mealType)}
                                </div>
                              )}

                              {/* Message text */}
                              <p className="text-[15px] leading-relaxed">{message.message}</p>

                              {/* Rating stars */}
                              {message.rating && (
                                <div className="mt-2 flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={14}
                                      className={
                                        star <= message.rating!
                                          ? isOwnMessage
                                            ? 'fill-white text-white'
                                            : 'fill-[var(--system-yellow)] text-[var(--system-yellow)]'
                                          : isOwnMessage
                                            ? 'text-white/30'
                                            : 'text-[var(--foreground-tertiary)]'
                                      }
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Time and edited indicator */}
                              <div className="mt-1.5 flex items-center gap-2">
                                <span
                                  className={`text-[10px] ${
                                    isOwnMessage ? 'text-white/70' : 'text-[var(--foreground-tertiary)]'
                                  }`}
                                >
                                  {formatTime(message.createdAt)}
                                </span>
                                {message.isEdited && (
                                  <span
                                    className={`text-[10px] ${
                                      isOwnMessage ? 'text-white/50' : 'text-[var(--foreground-tertiary)]'
                                    }`}
                                  >
                                    Bearbeitet
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 glass-card p-3 text-center text-sm text-[var(--system-red)] ring-1 ring-[var(--system-red)]/20"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Reply/Edit Preview Bar */}
      <AnimatePresence>
        {(replyingTo || editingMessage) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[var(--glass-border)] glass-header px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--system-blue)]/15">
                {editingMessage ? (
                  <Pencil size={16} className="text-[var(--system-blue)]" />
                ) : (
                  <Reply size={16} className="text-[var(--system-blue)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--system-blue)]">
                  {editingMessage ? 'Bearbeiten' : `Antworten auf ${replyingTo?.senderName}`}
                </p>
                <p className="line-clamp-1 text-xs text-[var(--foreground-secondary)]">
                  {editingMessage?.message || replyingTo?.message}
                </p>
              </div>
              <motion.button
                onClick={cancelReplyOrEdit}
                className="flex h-8 w-8 items-center justify-center rounded-full glass-inner"
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} className="text-[var(--foreground-tertiary)]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Mode Bar */}
      <AnimatePresence>
        {feedbackMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[var(--glass-border)] bg-[var(--system-orange)]/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {[...breakfastMeals, ...dinnerMeals].slice(0, 7).map((meal) => (
                  <motion.button
                    key={`${meal.day}-${meal.type}`}
                    onClick={() => setSelectedMeal({ day: meal.day, type: meal.type as MealType })}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      selectedMeal?.day === meal.day && selectedMeal?.type === meal.type
                        ? 'bg-[var(--system-orange)] text-white'
                        : 'glass-inner text-[var(--foreground-secondary)]'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    Tag {meal.day}
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => {
                  setFeedbackMode(false);
                  setSelectedMeal(null);
                  setSelectedRating(0);
                }}
                className="text-xs font-semibold text-[var(--system-orange)]"
              >
                Abbrechen
              </button>
            </div>

            {selectedMeal && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-3"
              >
                <span className="text-xs text-[var(--foreground-secondary)]">Bewertung:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      onClick={() => setSelectedRating(star)}
                      whileTap={{ scale: 1.2 }}
                    >
                      <Star
                        size={22}
                        className={
                          star <= selectedRating
                            ? 'fill-[var(--system-yellow)] text-[var(--system-yellow)]'
                            : 'text-[var(--foreground-tertiary)]'
                        }
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="border-t border-[var(--glass-border)] glass-header p-3 pb-safe">
        <div className="flex items-end gap-2">
          <motion.button
            onClick={() => setFeedbackMode(!feedbackMode)}
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
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                editingMessage
                  ? 'Nachricht bearbeiten...'
                  : feedbackMode
                    ? 'Feedback schreiben...'
                    : 'Nachricht schreiben...'
              }
              className="w-full glass-inner rounded-[20px] px-4 py-3 text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            />
          </div>
          <motion.button
            onClick={handleSendMessage}
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

      {/* Overlay to close menu */}
      <AnimatePresence>
        {activeMessageMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setActiveMessageMenu(null)}
          />
        )}
      </AnimatePresence>

      {/* Incoming Call Modal */}
      {incomingCall && callState === 'incoming' && (
        <IncomingCall
          callerName={incomingCall.callerName}
          callType={incomingCall.callType}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Active Call UI */}
      {(callState === 'calling' || callState === 'connecting' || callState === 'connected') && callSession && (
        <ActiveCall
          remoteName={callSession.remoteName}
          callType={callSession.callType}
          callState={callState}
          localStream={localStream}
          remoteStream={remoteStream}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onEndCall={endCall}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
        />
      )}

      {/* Calling State */}
      {callState === 'calling' && !callSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <motion.div
            className="glass-card mx-4 w-full max-w-sm p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--system-green)]/20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Phone size={48} className="text-[var(--system-green)]" />
            </motion.div>
            <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
              Anrufen...
            </h2>
            <p className="mb-8 text-[var(--foreground-secondary)]">
              Warte auf Antwort
            </p>
            <motion.button
              onClick={endCall}
              className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[var(--system-red)] text-white"
              aria-label="Auflegen"
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={28} className="rotate-[135deg]" />
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Call Error */}
      <AnimatePresence>
        {callError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-4 right-4 z-[100] glass-card p-4 text-center text-[var(--system-red)] ring-1 ring-[var(--system-red)]/30"
          >
            {callError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
