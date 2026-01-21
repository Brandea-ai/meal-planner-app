# Chat Image Upload Feature - Implementation Report

**Datum:** 2026-01-21
**Feature:** Bild-Upload im Chat
**Status:** SETUP ERFORDERLICH - Bucket muss manuell erstellt werden

---

## 0. WICHTIG: Setup-Anleitung (ZUERST LESEN!)

### Problem
Die SQL-Migration kann den Supabase Storage Bucket **nicht** automatisch erstellen, da Storage-Buckets über einen separaten Service verwaltet werden (nicht direkt über PostgreSQL).

### Lösung: Bucket manuell im Dashboard erstellen

1. **Supabase Dashboard öffnen:**
   - URL: https://supabase.com/dashboard/project/klzfjgineiqjktsywovq/storage/buckets

2. **Neuen Bucket erstellen:**
   - Klick auf **"New Bucket"**
   - Name: `chat-media`
   - **Public bucket: JA (aktivieren!)**
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
   - Klick auf **"Create bucket"**

3. **RLS Policy erstellen:**
   - Im Bucket `chat-media` → **Policies** Tab
   - **"New Policy"** klicken
   - **"For full customization"** wählen
   - Policy Name: `Allow all access`
   - Target roles: `anon`, `authenticated`
   - Policy: `bucket_id = 'chat-media'`
   - Operations: SELECT, INSERT, UPDATE, DELETE (alle!)
   - Speichern

### Alternative: Service Role Key
Falls Sie das API-Setup verwenden möchten:
1. Supabase Dashboard → Settings → API
2. Kopieren Sie den `service_role` Key (der lange JWT, NICHT der anon key)
3. In `.env.local` ersetzen Sie die Zeile `SUPABASE_SERVICE_ROLE_KEY=...`
4. Rufen Sie `POST /api/setup/storage` auf

---

## 1. Was wurde geändert? (Datei für Datei)

### Neue Dateien

| Datei | Beschreibung |
|-------|-------------|
| `supabase/migrations/20240117000009_add_chat_media.sql` | DB-Migration: Fügt `media_url`, `media_type`, `media_width`, `media_height` Spalten zu `chat_messages` hinzu |
| `supabase/migrations/20240117000010_create_chat_media_bucket.sql` | Versuch Bucket via SQL zu erstellen (funktioniert NICHT - siehe Abschnitt 0) |
| `supabase/migrations/20240117000011_fix_storage_policies.sql` | RLS Policies für Storage (werden angewendet wenn Bucket existiert) |
| `src/app/api/setup/storage/route.ts` | API-Endpoint für Bucket-Erstellung (benötigt gültigen service_role key) |
| `src/lib/imageUpload.ts` | Utility-Funktionen für Bildkomprimierung und Upload zu Supabase Storage |
| `src/components/ImageUpload.tsx` | UI-Komponente für Bildauswahl, Vorschau und Upload mit Progress |
| `src/components/ChatImage.tsx` | Komponente für Bildanzeige in Chat-Nachrichten mit Fullscreen-Modus |

### Geänderte Dateien

| Datei | Änderungen |
|-------|------------|
| `src/types/index.ts` | Neue Types: `ChatMediaType`, `ImageUploadProgress`. Erweitert: `ChatMessage` und `NewChatMessage` um Media-Felder |
| `src/hooks/useChat.ts` | Neue Funktionen: `sendImageMessage`, `uploadProgress`. Erweiterte: `sendMessage` (Media-Support), Realtime-Handler (Media-Felder) |
| `src/components/Chat.tsx` | Import der neuen Komponenten, Integration von `ImageUpload` Button, `ChatImage` in Nachrichtenanzeige |

---

## 2. Kompatibilitäts-Check

### Geprüfte Komponenten

| Komponente | Status | Notizen |
|-----------|--------|---------|
| **Chat-Text-Nachrichten** | ✅ Kompatibel | Keine Breaking Changes |
| **Verschlüsselung (AES-256-GCM)** | ✅ Kompatibel | Bildtext wird verschlüsselt, Bild-URLs bleiben öffentlich |
| **Realtime Sync** | ✅ Kompatibel | Media-Felder werden via Realtime synchronisiert |
| **Device Sync (QR-Code)** | ✅ Kompatibel | Bilder werden mit device_id gruppiert |
| **Reply/Edit Funktionen** | ✅ Kompatibel | Edit deaktiviert Image-Upload Button |
| **Feedback-Modus** | ✅ Kompatibel | Unabhängig von Image-Upload |
| **WebRTC Calls** | ✅ Kompatibel | Keine Überschneidung |
| **Auto-Logout** | ✅ Kompatibel | Activity Events weiterhin aktiv |

### Datenbank-Kompatibilität

- **Bestehende Nachrichten:** Unverändert (NULL für media_* Felder)
- **RLS Policies:** Erweitert, nicht ersetzt
- **Realtime:** Automatisch für neue Felder aktiv

---

## 3. Test-Anleitung

### Lokale Tests

```bash
# 1. Build testen
npm run build

# 2. Dev-Server starten
npm run dev

# 3. Im Browser öffnen
# http://localhost:3000
```

### Feature-Tests

1. **Bild hochladen:**
   - Chat öffnen
   - Bild-Button (ImagePlus Icon) klicken
   - Bild aus Galerie wählen
   - Vorschau prüfen
   - Optional: Beschreibung hinzufügen
   - Senden

2. **Bild anzeigen:**
   - Hochgeladenes Bild in Chat sichtbar
   - Auf Bild tippen → Fullscreen öffnet
   - Download-Button funktioniert
   - X schließt Fullscreen

3. **Komprimierung:**
   - Großes Bild (>5MB) hochladen
   - Progress-Bar zeigt Komprimierung
   - Ergebnis ist WebP-Format

4. **Realtime:**
   - Zweites Gerät verbinden (QR-Code)
   - Bild von Gerät 1 senden
   - Auf Gerät 2 erscheint Bild sofort

5. **Edge Cases:**
   - Ungültiges Format (PDF) → Fehlermeldung
   - Während Edit → Upload Button deaktiviert
   - Netzwerk-Fehler → Error wird angezeigt

### Supabase Dashboard Checks

1. **Storage → chat-media Bucket:**
   - Bucket existiert
   - Public access aktiviert
   - Bilder werden nach device_id gruppiert

2. **Database → chat_messages:**
   - `media_url`, `media_type`, `media_width`, `media_height` Spalten vorhanden

---

## 4. Rollback-Plan

### Bei Problemen:

```bash
# 1. Code-Rollback
git checkout HEAD~1

# 2. DB-Migration rückgängig (manuell in Supabase)
ALTER TABLE chat_messages DROP COLUMN IF EXISTS media_url;
ALTER TABLE chat_messages DROP COLUMN IF EXISTS media_type;
ALTER TABLE chat_messages DROP COLUMN IF EXISTS media_width;
ALTER TABLE chat_messages DROP COLUMN IF EXISTS media_height;

# 3. Storage Bucket löschen
# Supabase Dashboard → Storage → chat-media → Delete

# 4. Migration-Dateien löschen
rm supabase/migrations/20240117000009_add_chat_media.sql
rm supabase/migrations/20240117000010_create_chat_media_bucket.sql

# 5. Neu deployen
npm run build
```

### Betroffene Daten bei Rollback:
- Hochgeladene Bilder im Storage werden gelöscht
- Bildnachrichten zeigen "Bild konnte nicht geladen werden"
- Text-Nachrichten bleiben erhalten

---

## 5. Technische Details

### Bildverarbeitung

```
Input → Validierung → Komprimierung → Upload → DB-Eintrag
         ↓              ↓              ↓           ↓
    MIME-Check     Canvas API    Supabase     chat_messages
    Max 5MB        WebP Output   Storage      mit media_*
```

### Komprimierungseinstellungen

| Parameter | Wert |
|-----------|------|
| Max Breite | 1920px |
| Max Höhe | 1920px |
| Qualität | 85% (60% bei Überschreitung) |
| Format | WebP |
| Max Dateigröße | 5MB |

### Storage-Struktur

```
chat-media/
└── {device_id}/
    └── {timestamp}-{random_id}.webp
```

---

## 6. Offene Punkte / Zukünftige Verbesserungen

- [ ] Bild-Vorschau beim Reply
- [ ] Mehrere Bilder gleichzeitig senden
- [ ] Bild-Galerie-Ansicht
- [ ] Bild-Komprimierungsqualität einstellbar
- [ ] GIF-Animation beibehalten (aktuell: erstes Frame)
- [ ] Optionale Ende-zu-Ende-Verschlüsselung für Bilder

---

## 7. Deployment Checklist

- [x] TypeScript kompiliert fehlerfrei
- [x] Build erfolgreich
- [x] Migrations angewendet (DB-Spalten)
- [ ] **Storage Bucket manuell erstellt (siehe Abschnitt 0!)**
- [ ] **RLS Policies im Dashboard konfiguriert**
- [ ] Vercel Deploy (git push)
- [ ] Production-Test

---

## 8. Troubleshooting

### "Storage bucket nicht gefunden" Fehler
→ Der `chat-media` Bucket existiert nicht. Erstellen Sie ihn im Supabase Dashboard (siehe Abschnitt 0).

### "Keine Berechtigung" / "row-level security policy" Fehler
→ RLS Policies sind nicht korrekt konfiguriert. Erstellen Sie eine Policy die allen Zugriff auf `chat-media` erlaubt.

### "Invalid service role key" beim API-Setup
→ Der `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` ist falsch formatiert. Er muss ein JWT sein (beginnt mit `eyJ...`).

### Bilder werden nicht angezeigt (404)
→ Der Bucket ist nicht öffentlich. Im Dashboard: Bucket → Settings → Make public.

---

**Implementiert von:** Claude Code
**Build-Status:** ✅ Erfolgreich
**Setup-Status:** ⚠️ Bucket-Erstellung erforderlich
