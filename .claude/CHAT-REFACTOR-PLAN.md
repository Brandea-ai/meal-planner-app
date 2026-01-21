# Chat Refactoring Plan - WhatsApp-Style UI

**Ziel:** Chat.tsx (1024 Zeilen) in modulare, professionelle Komponenten aufteilen

---

## Aktuelle Probleme
- Rating-UI überlappt und sieht unprofessionell aus
- Alles in einer Datei (1024 Zeilen)
- Nicht WhatsApp-ähnlich
- Touch-Interaktionen nicht optimal

---

## Neue Komponenten-Struktur

```
src/components/chat/
├── index.ts                    # Exports
├── Chat.tsx                    # Main Container (vereinfacht)
├── ChatHeader.tsx              # Header mit Titel, Call-Buttons, Settings
├── ChatMessageList.tsx         # Scrollbare Nachrichtenliste
├── ChatMessage.tsx             # Einzelne Nachricht (Bubble)
├── ChatImageMessage.tsx        # Bild-Nachricht mit Rating
├── ChatInputBar.tsx            # Eingabebereich unten
├── ChatActionSheet.tsx         # iOS-Style Action Sheets
├── ChatSettingsMenu.tsx        # Settings Dropdown
├── ChatEmptyState.tsx          # "Keine Nachrichten" Anzeige
└── ChatDateSeparator.tsx       # Datum-Trenner zwischen Nachrichten
```

---

## Phasen

### Phase 1: Basis-Struktur erstellen
- [ ] Ordner `src/components/chat/` erstellen
- [ ] `ChatHeader.tsx` extrahieren
- [ ] `ChatInputBar.tsx` extrahieren
- [ ] `ChatEmptyState.tsx` erstellen

### Phase 2: Nachrichten-Komponenten
- [ ] `ChatMessage.tsx` - Einzelne Nachricht (WhatsApp-Style)
- [ ] `ChatImageMessage.tsx` - Bild mit integriertem Rating
- [ ] `ChatDateSeparator.tsx` - Datum-Trenner
- [ ] `ChatMessageList.tsx` - Container für alle Nachrichten

### Phase 3: Modals & Sheets
- [ ] `ChatActionSheet.tsx` - Wiederverwendbare Action Sheets
- [ ] `ChatSettingsMenu.tsx` - Settings Dropdown

### Phase 4: Integration & Polish
- [ ] Neues `Chat.tsx` als schlanker Container
- [ ] WhatsApp-ähnliches Styling
- [ ] Animationen optimieren
- [ ] `index.ts` für saubere Exports

### Phase 5: Finale Optimierung
- [ ] Mobile Touch-Optimierung
- [ ] Performance-Test
- [ ] Code Review & Cleanup

---

## Design-Referenz: WhatsApp

### Message Bubble Styling
- Eigene Nachrichten: Grün (#DCF8C6) oder Blau, rechts
- Fremde Nachrichten: Weiß, links
- Bubble-Tail (kleiner Pfeil)
- Schatten für Tiefe
- Maximale Breite: 85% des Screens

### Image Message
- Bild direkt im Bubble
- Keine separate Rating-Pill
- Rating-Sterne dezent unter dem Bild im Bubble
- Keine Überlappung

### Input Bar
- Weißer/Glasmorph Hintergrund
- Attachment-Button links
- Mikrofon/Send-Button rechts
- Runde Ecken

---

## Nächster Schritt
Phase 1 starten: Ordner erstellen und erste Komponenten extrahieren
