import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// This endpoint creates the chat-media storage bucket
// It requires the SUPABASE_SERVICE_ROLE_KEY to be set properly

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing environment variables' },
      { status: 500 }
    );
  }

  // Validate that service role key looks like a JWT
  if (!serviceRoleKey.startsWith('eyJ')) {
    return NextResponse.json(
      {
        error: 'Invalid service role key format. The key should start with "eyJ..." (JWT format). Get the correct key from Supabase Dashboard > Settings > API > service_role key.',
        hint: 'The current key looks like a webhook secret, not the service_role JWT.'
      },
      { status: 400 }
    );
  }

  // Create admin client with service role key
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

    if (listError) {
      return NextResponse.json(
        { error: `Failed to list buckets: ${listError.message}` },
        { status: 500 }
      );
    }

    const bucketExists = buckets?.some(b => b.id === 'chat-media');

    if (bucketExists) {
      return NextResponse.json({
        success: true,
        message: 'Bucket already exists',
        bucket: 'chat-media'
      });
    }

    // Create the bucket
    const { data, error } = await supabaseAdmin.storage.createBucket('chat-media', {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });

    if (error) {
      return NextResponse.json(
        { error: `Failed to create bucket: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bucket created successfully',
      bucket: data.name,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      { error: 'Missing environment variables' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, anonKey);

  try {
    // Check if bucket exists and is accessible
    const { data, error } = await supabase.storage.getBucket('chat-media');

    if (error) {
      return NextResponse.json({
        exists: false,
        error: error.message,
        hint: 'Bucket does not exist. Call POST /api/setup/storage to create it.',
      });
    }

    return NextResponse.json({
      exists: true,
      bucket: data,
      public: data.public,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
