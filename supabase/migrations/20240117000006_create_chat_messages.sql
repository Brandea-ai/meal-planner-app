-- Chat Messages Table for Family Communication
-- Allows family members to discuss meals, what was good/bad, etc.

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text', -- 'text', 'feedback', 'suggestion'
    meal_reference INTEGER, -- Optional: reference to meal day (1-7)
    meal_type TEXT, -- Optional: 'breakfast' or 'dinner'
    rating INTEGER, -- Optional: 1-5 stars for meal feedback
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries by device_id
CREATE INDEX IF NOT EXISTS idx_chat_messages_device_id ON chat_messages(device_id);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read messages for their device_id
CREATE POLICY "Users can read their own chat messages"
    ON chat_messages FOR SELECT
    USING (true);

-- Policy: Anyone can insert messages
CREATE POLICY "Users can insert chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can delete their own messages
CREATE POLICY "Users can delete their own chat messages"
    ON chat_messages FOR DELETE
    USING (true);

-- Enable Realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Trigger for updated_at
CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
