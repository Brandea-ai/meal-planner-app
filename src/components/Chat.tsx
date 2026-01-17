'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
    // Encryption
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when replying or editing
  useEffect(() => {
    if (replyingTo || editingMessage) {
      inputRef.current?.focus();
    }
  }, [replyingTo, editingMessage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // If editing, update the message
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

  // Long press handling for message actions
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

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);

  // Show password setup/login screen
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
        <div className="w-full max-w-sm rounded-[16px] bg-[var(--background-secondary)] p-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--system-blue)]/15">
            <User size={32} className="text-[var(--system-blue)]" />
          </div>
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
            className="mb-4 w-full rounded-[10px] bg-[var(--fill-tertiary)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
          />
          <button
            onClick={handleSaveName}
            disabled={!tempName.trim()}
            className="w-full rounded-[12px] bg-[var(--system-blue)] py-3.5 font-semibold text-white transition-none active:opacity-80 disabled:opacity-50"
          >
            Weiter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--separator)] bg-[var(--background)]/80 backdrop-blur-xl safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-none active:opacity-80"
            aria-label="Zurück"
          >
            <ArrowLeft size={24} className="text-[var(--system-blue)]" />
          </button>
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--system-green)]">
              <MessageCircle size={16} className="text-white" />
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
            {/* Audio Call Button */}
            <button
              onClick={() => startCall('audio')}
              disabled={callState !== 'idle'}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-green)]/15 text-[var(--system-green)] transition-none active:opacity-80 disabled:opacity-50"
              aria-label="Sprachanruf"
            >
              <Phone size={18} />
            </button>
            {/* Video Call Button */}
            <button
              onClick={() => startCall('video')}
              disabled={callState !== 'idle'}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-blue)]/15 text-[var(--system-blue)] transition-none active:opacity-80 disabled:opacity-50"
              aria-label="Videoanruf"
            >
              <Video size={18} />
            </button>
            {/* User Button */}
            <button
              onClick={() => setShowNameInput(true)}
              className="flex h-10 items-center gap-1.5 rounded-full bg-[var(--fill-tertiary)] px-3 text-sm text-[var(--foreground-secondary)] transition-none active:opacity-80"
            >
              <User size={14} />
              {senderName}
            </button>
            {/* Reset/Logout Button - always visible */}
            <button
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-red)]/15 text-[var(--system-red)] transition-none active:opacity-80"
              aria-label="Zurücksetzen"
              title="Verschlüsselung zurücksetzen"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--fill-secondary)] border-t-[var(--system-blue)]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--fill-tertiary)]">
              <MessageCircle size={32} className="text-[var(--foreground-tertiary)]" />
            </div>
            <p className="text-[var(--foreground-secondary)]">Noch keine Nachrichten</p>
            <p className="mt-1 text-sm text-[var(--foreground-tertiary)]">
              Starte eine Unterhaltung über eure Mahlzeiten!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="mb-3 flex items-center justify-center">
                  <span className="rounded-full bg-[var(--fill-tertiary)] px-3 py-1 text-xs text-[var(--foreground-tertiary)]">
                    {date}
                  </span>
                </div>

                {/* Messages for this date */}
                <div className="space-y-2">
                  {dateMessages.map((message) => {
                    const isOwnMessage = message.senderName === senderName;
                    const replyMessage = message.replyTo ? getMessageById(message.replyTo) : null;
                    const isMenuOpen = activeMessageMenu === message.id;

                    return (
                      <div
                        key={message.id}
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
                          {/* Message Actions Menu (WhatsApp style) */}
                          {isMenuOpen && isOwnMessage && (
                            <div className="absolute -top-12 right-0 z-50 flex gap-1 rounded-[12px] bg-[var(--background-secondary)] p-1 shadow-lg">
                              <button
                                onClick={() => handleReply(message)}
                                className="flex h-9 w-9 items-center justify-center rounded-[8px] transition-none active:bg-[var(--fill-tertiary)]"
                                aria-label="Antworten"
                              >
                                <Reply size={18} className="text-[var(--foreground-secondary)]" />
                              </button>
                              <button
                                onClick={() => handleEdit(message)}
                                className="flex h-9 w-9 items-center justify-center rounded-[8px] transition-none active:bg-[var(--fill-tertiary)]"
                                aria-label="Bearbeiten"
                              >
                                <Pencil size={18} className="text-[var(--foreground-secondary)]" />
                              </button>
                              <button
                                onClick={() => handleDelete(message.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-[8px] transition-none active:bg-[var(--fill-tertiary)]"
                                aria-label="Löschen"
                              >
                                <Trash2 size={18} className="text-[var(--system-red)]" />
                              </button>
                              <button
                                onClick={() => setActiveMessageMenu(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-[8px] transition-none active:bg-[var(--fill-tertiary)]"
                                aria-label="Schließen"
                              >
                                <X size={18} className="text-[var(--foreground-tertiary)]" />
                              </button>
                            </div>
                          )}

                          {/* Reply button for others' messages */}
                          {!isOwnMessage && (
                            <button
                              onClick={() => handleReply(message)}
                              className="absolute -right-8 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--fill-tertiary)] opacity-0 transition-opacity group-hover:opacity-100"
                              aria-label="Antworten"
                            >
                              <Reply size={12} className="text-[var(--foreground-secondary)]" />
                            </button>
                          )}

                          <div
                            className={`rounded-[16px] p-3 ${
                              isOwnMessage
                                ? 'bg-[var(--system-blue)] text-white'
                                : 'bg-[var(--background-secondary)] text-[var(--foreground)]'
                            }`}
                          >
                            {/* Sender name (only for others) */}
                            {!isOwnMessage && (
                              <p className="mb-1 text-xs font-semibold text-[var(--system-blue)]">
                                {message.senderName}
                              </p>
                            )}

                            {/* Reply preview */}
                            {replyMessage && (
                              <div
                                className={`mb-2 rounded-[8px] border-l-2 p-2 ${
                                  isOwnMessage
                                    ? 'border-white/50 bg-white/10'
                                    : 'border-[var(--system-blue)] bg-[var(--fill-tertiary)]'
                                }`}
                              >
                                <p
                                  className={`text-xs font-medium ${
                                    isOwnMessage ? 'text-white/80' : 'text-[var(--system-blue)]'
                                  }`}
                                >
                                  {replyMessage.senderName}
                                </p>
                                <p
                                  className={`line-clamp-2 text-xs ${
                                    isOwnMessage ? 'text-white/60' : 'text-[var(--foreground-secondary)]'
                                  }`}
                                >
                                  {replyMessage.message}
                                </p>
                              </div>
                            )}

                            {/* Meal reference badge */}
                            {message.mealReference && message.mealType && (
                              <div
                                className={`mb-2 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${
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
                            <div className="mt-1 flex items-center gap-2">
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
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-[10px] bg-[var(--system-red)]/15 p-3 text-center text-sm text-[var(--system-red)]">
            {error}
          </div>
        )}
      </div>

      {/* Reply/Edit Preview Bar */}
      {(replyingTo || editingMessage) && (
        <div className="border-t border-[var(--separator)] bg-[var(--background-secondary)] px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--system-blue)]/15">
              {editingMessage ? (
                <Pencil size={14} className="text-[var(--system-blue)]" />
              ) : (
                <Reply size={14} className="text-[var(--system-blue)]" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-[var(--system-blue)]">
                {editingMessage ? 'Bearbeiten' : `Antworten auf ${replyingTo?.senderName}`}
              </p>
              <p className="line-clamp-1 text-xs text-[var(--foreground-secondary)]">
                {editingMessage?.message || replyingTo?.message}
              </p>
            </div>
            <button
              onClick={cancelReplyOrEdit}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-none active:opacity-80"
            >
              <X size={18} className="text-[var(--foreground-tertiary)]" />
            </button>
          </div>
        </div>
      )}

      {/* Feedback Mode Bar */}
      {feedbackMode && (
        <div className="border-t border-[var(--separator)] bg-[var(--system-orange)]/10 p-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[...breakfastMeals, ...dinnerMeals].slice(0, 7).map((meal) => (
                <button
                  key={`${meal.day}-${meal.type}`}
                  onClick={() => setSelectedMeal({ day: meal.day, type: meal.type as MealType })}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-none active:opacity-80 ${
                    selectedMeal?.day === meal.day && selectedMeal?.type === meal.type
                      ? 'bg-[var(--system-orange)] text-white'
                      : 'bg-[var(--fill-tertiary)] text-[var(--foreground-secondary)]'
                  }`}
                >
                  Tag {meal.day}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setFeedbackMode(false);
                setSelectedMeal(null);
                setSelectedRating(0);
              }}
              className="text-xs text-[var(--system-orange)]"
            >
              Abbrechen
            </button>
          </div>

          {selectedMeal && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-[var(--foreground-secondary)]">Bewertung:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    className="transition-none active:scale-110"
                  >
                    <Star
                      size={20}
                      className={
                        star <= selectedRating
                          ? 'fill-[var(--system-yellow)] text-[var(--system-yellow)]'
                          : 'text-[var(--foreground-tertiary)]'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-[var(--separator)] bg-[var(--background)] p-3 pb-safe">
        <div className="flex items-end gap-2">
          <button
            onClick={() => setFeedbackMode(!feedbackMode)}
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-none active:opacity-80 ${
              feedbackMode
                ? 'bg-[var(--system-orange)] text-white'
                : 'bg-[var(--fill-tertiary)] text-[var(--foreground-secondary)]'
            }`}
            aria-label="Feedback-Modus"
          >
            <Star size={18} />
          </button>
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
              className="w-full rounded-[20px] bg-[var(--fill-tertiary)] px-4 py-2.5 pr-12 text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-none active:opacity-80 disabled:opacity-50 ${
              editingMessage
                ? 'bg-[var(--system-green)] text-white'
                : 'bg-[var(--system-blue)] text-white'
            }`}
            aria-label={editingMessage ? 'Speichern' : 'Nachricht senden'}
          >
            {editingMessage ? <Check size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>

      {/* Overlay to close menu when tapping outside */}
      {activeMessageMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveMessageMenu(null)}
        />
      )}

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

      {/* Calling State (before session is established) */}
      {callState === 'calling' && !callSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="mx-4 w-full max-w-sm rounded-[24px] bg-[var(--background-secondary)] p-8 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--system-green)]/20">
              <Phone size={48} className="animate-pulse text-[var(--system-green)]" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
              Anrufen...
            </h2>
            <p className="mb-8 text-[var(--foreground-secondary)]">
              Warte auf Antwort
            </p>
            <button
              onClick={endCall}
              className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[var(--system-red)] text-white transition-none active:opacity-80"
              aria-label="Auflegen"
            >
              <Phone size={28} className="rotate-[135deg]" />
            </button>
          </div>
        </div>
      )}

      {/* Call Error */}
      {callError && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] rounded-[12px] bg-[var(--system-red)] p-4 text-center text-white shadow-lg">
          {callError}
        </div>
      )}
    </div>
  );
}
