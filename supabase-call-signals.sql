-- Tabelle für Anruf-Signale (WebRTC Signaling)
CREATE TABLE IF NOT EXISTS call_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  target_device_id TEXT NOT NULL,
  caller_name TEXT NOT NULL DEFAULT 'Anonym',
  signal_type TEXT NOT NULL CHECK (signal_type IN ('call-request', 'call-accept', 'call-reject', 'call-end', 'offer', 'answer', 'ice-candidate')),
  call_type TEXT NOT NULL CHECK (call_type IN ('audio', 'video')),
  signal_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 minutes')
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_call_signals_target ON call_signals(target_device_id);
CREATE INDEX IF NOT EXISTS idx_call_signals_created ON call_signals(created_at);

-- RLS aktivieren
ALTER TABLE call_signals ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann Signale lesen und schreiben (für Familie)
CREATE POLICY "Allow all for call_signals" ON call_signals
  FOR ALL USING (true) WITH CHECK (true);

-- Realtime aktivieren
ALTER PUBLICATION supabase_realtime ADD TABLE call_signals;

-- Automatisches Löschen alter Signale (nach 5 Minuten)
CREATE OR REPLACE FUNCTION delete_old_call_signals()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM call_signals WHERE created_at < NOW() - INTERVAL '5 minutes';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger der bei jedem Insert alte Signale löscht
DROP TRIGGER IF EXISTS cleanup_old_signals ON call_signals;
CREATE TRIGGER cleanup_old_signals
  AFTER INSERT ON call_signals
  EXECUTE FUNCTION delete_old_call_signals();
