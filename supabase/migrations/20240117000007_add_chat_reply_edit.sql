-- Add reply_to and is_edited columns to chat_messages
-- This allows WhatsApp-like reply and edit functionality

-- Add reply_to column (references another message)
ALTER TABLE chat_messages
ADD COLUMN IF NOT EXISTS reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL;

-- Add is_edited column to track edited messages
ALTER TABLE chat_messages
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false;

-- Create index for faster reply lookups
CREATE INDEX IF NOT EXISTS idx_chat_messages_reply_to ON chat_messages(reply_to);
