'use client';

import { supabase, getDeviceId } from '@/lib/supabase';
import { ChatMediaType } from '@/types';

// Maximum image dimensions for compression
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const QUALITY = 0.85;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface CompressedImage {
  blob: Blob;
  width: number;
  height: number;
  mimeType: ChatMediaType;
}

export interface UploadResult {
  url: string;
  width: number;
  height: number;
  mimeType: ChatMediaType;
}

/**
 * Compress an image file to reduce size while maintaining quality
 */
export async function compressImage(file: File): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image with white background (for transparency)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format (prefer WebP, fallback to JPEG)
      const outputType: ChatMediaType = 'image/webp';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Image compression failed'));
            return;
          }

          // If still too large, reduce quality further
          if (blob.size > MAX_FILE_SIZE) {
            canvas.toBlob(
              (reducedBlob) => {
                if (!reducedBlob) {
                  reject(new Error('Image compression failed'));
                  return;
                }
                resolve({
                  blob: reducedBlob,
                  width,
                  height,
                  mimeType: outputType,
                });
              },
              outputType,
              0.6
            );
          } else {
            resolve({
              blob,
              width,
              height,
              mimeType: outputType,
            });
          }
        },
        outputType,
        QUALITY
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const deviceId = getDeviceId();

  if (!deviceId) {
    throw new Error('Device ID not available');
  }

  // Notify compression start
  onProgress?.(10);

  // Compress the image
  const compressed = await compressImage(file);
  onProgress?.(30);

  // Generate unique filename
  const timestamp = Date.now();
  const randomId = crypto.randomUUID().slice(0, 8);
  const extension = compressed.mimeType === 'image/webp' ? 'webp' : 'jpg';
  const filename = `${deviceId}/${timestamp}-${randomId}.${extension}`;

  onProgress?.(40);

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('chat-media')
    .upload(filename, compressed.blob, {
      contentType: compressed.mimeType,
      cacheControl: '31536000', // 1 year cache
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
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
    width: compressed.width,
    height: compressed.height,
    mimeType: compressed.mimeType,
  };
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(url: string): Promise<void> {
  // Extract path from URL
  const urlObj = new URL(url);
  const pathMatch = urlObj.pathname.match(/\/chat-media\/(.+)$/);

  if (!pathMatch) {
    console.warn('Could not extract path from URL:', url);
    return;
  }

  const path = pathMatch[1];

  const { error } = await supabase.storage
    .from('chat-media')
    .remove([path]);

  if (error) {
    console.warn('Failed to delete image:', error);
  }
}

/**
 * Validate if a file is a valid image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes: ChatMediaType[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type as ChatMediaType);
}

/**
 * Get image dimensions from a file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}
