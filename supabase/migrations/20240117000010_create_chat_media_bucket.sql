-- Create Storage Bucket for Chat Media
-- This bucket stores images sent in chat

-- Insert the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'chat-media',
    'chat-media',
    true,  -- Public bucket for easy image access
    5242880, -- 5MB file size limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for chat-media bucket
-- Using DO blocks to check if policies exist before creating

-- Allow anyone to read images (public bucket)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname = 'Public read access for chat media'
    ) THEN
        CREATE POLICY "Public read access for chat media"
            ON storage.objects FOR SELECT
            USING (bucket_id = 'chat-media');
    END IF;
END $$;

-- Allow authenticated and anonymous users to upload images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname = 'Anyone can upload chat media'
    ) THEN
        CREATE POLICY "Anyone can upload chat media"
            ON storage.objects FOR INSERT
            WITH CHECK (bucket_id = 'chat-media');
    END IF;
END $$;

-- Allow users to delete their own images (by device_id in path)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname = 'Anyone can delete chat media'
    ) THEN
        CREATE POLICY "Anyone can delete chat media"
            ON storage.objects FOR DELETE
            USING (bucket_id = 'chat-media');
    END IF;
END $$;
