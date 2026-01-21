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
 * Check if browser supports WebP encoding
 */
function supportsWebP(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
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

      // Determine output format - use WebP if supported, otherwise JPEG
      const useWebP = supportsWebP();
      const outputType: ChatMediaType = useWebP ? 'image/webp' : 'image/jpeg';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Fallback to JPEG if blob creation failed
            canvas.toBlob(
              (jpegBlob) => {
                if (!jpegBlob) {
                  reject(new Error('Image compression failed'));
                  return;
                }
                resolve({
                  blob: jpegBlob,
                  width,
                  height,
                  mimeType: 'image/jpeg',
                });
              },
              'image/jpeg',
              QUALITY
            );
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

    // Load image from file - use createObjectURL for better iOS compatibility
    img.src = URL.createObjectURL(file);
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
  const extensionMap: Record<string, string> = {
    'image/webp': 'webp',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
  };
  const extension = extensionMap[compressed.mimeType] || 'jpg';
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
 * Accepts common image types including HEIC/HEIF from iPhone cameras
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',      // iPhone camera format
    'image/heif',      // iPhone camera format
    'image/jpg',       // Alternative JPEG
  ];

  // Also check file extension as fallback (some browsers don't set MIME type correctly)
  const extension = file.name.toLowerCase().split('.').pop();
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'];

  return validTypes.includes(file.type.toLowerCase()) ||
         (extension ? validExtensions.includes(extension) : false);
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
