-- Call signaling table for WebRTC
-- Used to exchange SDP offers/answers and ICE candidates between peers

CREATE TABLE IF NOT EXISTS call_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  target_device_id TEXT NOT NULL,
  caller_name TEXT NOT NULL,
  signal_type TEXT NOT NULL, -- 'offer', 'answer', 'ice-candidate', 'call-request', 'call-accept', 'call-reject', 'call-end'
  call_type TEXT NOT NULL, -- 'video', 'audio'
  signal_data JSONB, -- SDP or ICE candidate data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 minutes') -- Signals expire after 2 minutes
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_call_signals_target ON call_signals(target_device_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_signals_device ON call_signals(device_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE call_signals ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (device_id based filtering happens in app)
CREATE POLICY "Allow all call_signals operations" ON call_signals
  FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for call signals
ALTER PUBLICATION supabase_realtime ADD TABLE call_signals;

-- Auto-cleanup old signals (run periodically via cron or manually)
-- DELETE FROM call_signals WHERE expires_at < NOW();
