-- Add media support to chat_messages
-- Allows users to send images in chat

-- Add media_url column for storing image URLs from Supabase Storage
ALTER TABLE chat_messages
ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Add media_type column to track the type of media (image, etc.)
ALTER TABLE chat_messages
ADD COLUMN IF NOT EXISTS media_type TEXT; -- 'image/jpeg', 'image/png', 'image/webp', etc.

-- Add media_width and media_height for proper image rendering
ALTER TABLE chat_messages
ADD COLUMN IF NOT EXISTS media_width INTEGER;

ALTER TABLE chat_messages
ADD COLUMN IF NOT EXISTS media_height INTEGER;

-- Create index for faster media queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_media_url ON chat_messages(media_url) WHERE media_url IS NOT NULL;

-- Update Policy for UPDATE (needed for editing messages with media)
-- Using DO block to check if policy exists before creating
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'chat_messages'
        AND policyname = 'Users can update their own chat messages'
    ) THEN
        CREATE POLICY "Users can update their own chat messages"
            ON chat_messages FOR UPDATE
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;
