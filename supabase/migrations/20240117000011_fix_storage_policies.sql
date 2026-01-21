-- Fix Storage Policies for chat-media bucket
-- Allow all operations on chat-media bucket

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read access for chat media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload chat media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete chat media" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Create a single permissive policy for all operations on chat-media
CREATE POLICY "Allow all access to chat-media"
    ON storage.objects
    FOR ALL
    USING (bucket_id = 'chat-media')
    WITH CHECK (bucket_id = 'chat-media');
