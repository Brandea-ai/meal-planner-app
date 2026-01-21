'use client';

import { supabase, getDeviceId } from '@/lib/supabase';
import { ChatMediaType } from '@/types';

// Maximum image dimensions for compression
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const QUALITY = 0.82;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export interface UploadResult {
  url: string;
  width: number;
  height: number;
  mimeType: ChatMediaType;
}

/**
 * Compress an image and return as Blob
 */
async function compressImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      let { width, height } = img;

      // Scale down if needed
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }

          // If too large, reduce quality
          if (blob.size > MAX_FILE_SIZE) {
            canvas.toBlob(
              (smallerBlob) => {
                if (!smallerBlob) {
                  reject(new Error('Compression failed'));
                  return;
                }
                resolve({ blob: smallerBlob, width, height });
              },
              'image/jpeg',
              0.6
            );
          } else {
            resolve({ blob, width, height });
          }
        },
        'image/jpeg',
        QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Could not load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const deviceId = getDeviceId();
  if (!deviceId) {
    throw new Error('Device ID not available');
  }

  onProgress?.(5);

  // Compress
  const { blob, width, height } = await compressImage(file);
  onProgress?.(40);

  // Generate filename
  const timestamp = Date.now();
  const randomId = crypto.randomUUID().slice(0, 8);
  const filename = `${deviceId}/${timestamp}-${randomId}.jpg`;

  onProgress?.(60);

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('chat-media')
    .upload(filename, blob, {
      contentType: 'image/jpeg',
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);

    // Provide more specific error messages
    if (error.message.includes('Bucket not found')) {
      throw new Error(
        'Storage bucket nicht gefunden. Bitte erstellen Sie den Bucket "chat-media" im Supabase Dashboard.'
      );
    }
    if (error.message.includes('row-level security') || error.message.includes('policy')) {
      throw new Error(
        'Keine Berechtigung zum Hochladen. Bitte überprüfen Sie die Storage-Richtlinien im Supabase Dashboard.'
      );
    }

    throw new Error(`Upload fehlgeschlagen: ${error.message}`);
  }

  onProgress?.(90);

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('chat-media')
    .getPublicUrl(data.path);

  onProgress?.(100);

  return {
    url: urlData.publicUrl,
    width,
    height,
    mimeType: 'image/jpeg',
  };
}

/**
 * Validate image file
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
  ];

  const ext = file.name.toLowerCase().split('.').pop();
  const validExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'];

  return validTypes.includes(file.type.toLowerCase()) ||
         (ext ? validExts.includes(ext) : false);
}

/**
 * Delete image from storage
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/chat-media\/(.+)$/);
    if (match) {
      await supabase.storage.from('chat-media').remove([match[1]]);
    }
  } catch (e) {
    console.warn('Failed to delete image:', e);
  }
}
