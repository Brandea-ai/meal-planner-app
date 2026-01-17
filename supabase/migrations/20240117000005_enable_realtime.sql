-- Enable Realtime for user_progress table
-- This allows live sync between devices

-- Add user_progress to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;

-- Add updated_at column if it doesn't exist (for tracking changes)
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
