'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Star, Trash2, MessageCircle, Utensils } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { breakfastMeals, dinnerMeals } from '@/data/meals';
import { MealType } from '@/types';

export function Chat() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    deleteMessage,
    senderName,
    setSenderName,
  } = useChat();

  const [inputMessage, setInputMessage] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [tempName, setTempName] = useState('');
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{ day: number; type: MealType } | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show name input if no name is set
  useEffect(() => {
    if (!senderName && !showNameInput) {
      setShowNameInput(true);
    }
  }, [senderName, showNameInput]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    await sendMessage({
      senderName: senderName || 'Anonym',
      message: inputMessage.trim(),
      messageType: feedbackMode ? 'feedback' : 'text',
      mealReference: selectedMeal?.day,
      mealType: selectedMeal?.type,
      rating: feedbackMode ? selectedRating : undefined,
    });

    setInputMessage('');
    setFeedbackMode(false);
    setSelectedMeal(null);
    setSelectedRating(0);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setSenderName(tempName.trim());
      setShowNameInput(false);
      setTempName('');
    }
  };

  const getMealTitle = (day: number, type: MealType) => {
    const meals = type === 'breakfast' ? breakfastMeals : dinnerMeals;
    const meal = meals.find((m) => m.day === day);
    return meal?.title || `Tag ${day}`;
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

  if (showNameInput && !senderName) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-6">
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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-[var(--separator)] bg-[var(--background-secondary)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-blue)]/15">
              <MessageCircle size={20} className="text-[var(--system-blue)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--foreground)]">Familien-Chat</h2>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                {messages.length} Nachrichten
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNameInput(true)}
            className="flex items-center gap-2 rounded-full bg-[var(--fill-tertiary)] px-3 py-1.5 text-sm text-[var(--foreground-secondary)] transition-none active:opacity-80"
          >
            <User size={14} />
            {senderName}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
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
                <div className="space-y-3">
                  {dateMessages.map((message) => {
                    const isOwnMessage = message.senderName === senderName;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`group max-w-[85%] rounded-[16px] p-3 ${
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

                          {/* Time and delete */}
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <span
                              className={`text-[10px] ${
                                isOwnMessage ? 'text-white/70' : 'text-[var(--foreground-tertiary)]'
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </span>
                            {isOwnMessage && (
                              <button
                                onClick={() => deleteMessage(message.id)}
                                className="opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label="Nachricht löschen"
                              >
                                <Trash2 size={12} className="text-white/70" />
                              </button>
                            )}
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
      <div className="border-t border-[var(--separator)] bg-[var(--background-secondary)] p-3">
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
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={feedbackMode ? 'Feedback schreiben...' : 'Nachricht schreiben...'}
              className="w-full rounded-[20px] bg-[var(--fill-tertiary)] px-4 py-2.5 pr-12 text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--system-blue)] text-white transition-none active:opacity-80 disabled:opacity-50"
            aria-label="Nachricht senden"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
