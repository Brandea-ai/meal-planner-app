'use client';

import { useState, useEffect, useRef } from 'react';
import { StickyNote, Check, X } from 'lucide-react';

interface MealNoteEditorProps {
  mealId: number;
  mealType: 'breakfast' | 'dinner';
  initialNote?: string;
  onSave: (note: string) => void;
}

export function MealNoteEditor({ initialNote = '', onSave }: MealNoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(initialNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      textareaRef.current.setSelectionRange(note.length, note.length);
    }
  }, [isEditing, note.length]);

  const handleSave = () => {
    onSave(note.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNote(initialNote);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex w-full items-center gap-2 text-left transition-none active:opacity-80"
      >
        <StickyNote size={14} className="flex-shrink-0 text-[var(--foreground-tertiary)]" />
        {note ? (
          <span className="flex-1 text-sm text-[var(--foreground-secondary)]">{note}</span>
        ) : (
          <span className="flex-1 text-sm text-[var(--foreground-tertiary)]">Notiz hinzufügen...</span>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <StickyNote size={14} className="flex-shrink-0 text-[var(--system-blue)]" />
        <span className="text-sm font-medium text-[var(--foreground)]">Notiz</span>
      </div>
      <textarea
        ref={textareaRef}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Deine Notiz..."
        rows={3}
        className="w-full resize-none rounded-[10px] border-0 bg-[var(--fill-tertiary)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
      />
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          className="flex flex-1 items-center justify-center gap-1 rounded-[8px] bg-[var(--fill-tertiary)] py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-none active:opacity-80"
        >
          <X size={14} />
          Abbrechen
        </button>
        <button
          onClick={handleSave}
          className="flex flex-1 items-center justify-center gap-1 rounded-[8px] bg-[var(--system-blue)] py-2 text-sm font-medium text-white transition-none active:opacity-80"
        >
          <Check size={14} />
          Speichern
        </button>
      </div>
    </div>
  );
}
