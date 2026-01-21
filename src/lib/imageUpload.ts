'use client';

import { ChatMediaType } from '@/types';

// Maximum image dimensions for compression - smaller for DB storage
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 0.75;
const MAX_BASE64_SIZE = 500 * 1024; // 500KB max for DB storage

export interface CompressedImage {
  dataUrl: string;  // Base64 data URL
  width: number;
  height: number;
  mimeType: ChatMediaType;
}

export interface UploadResult {
  url: string;  // Base64 data URL (stored directly in DB)
  width: number;
  height: number;
  mimeType: ChatMediaType;
}

/**
 * Check if browser supports WebP encoding
 */
function supportsWebP(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

/**
 * Convert blob to base64 data URL
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert to base64'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Compress an image file and return as base64 data URL
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

    img.onload = async () => {
      // Revoke object URL after loading
      URL.revokeObjectURL(img.src);

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

      // Use JPEG for better compression (base64 size matters)
      const outputType: ChatMediaType = 'image/jpeg';
      let quality = QUALITY;

      // Try to compress to target size
      let dataUrl = canvas.toDataURL(outputType, quality);

      // Reduce quality until under max size
      while (dataUrl.length > MAX_BASE64_SIZE && quality > 0.3) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL(outputType, quality);
      }

      // If still too large, reduce dimensions
      if (dataUrl.length > MAX_BASE64_SIZE) {
        const scale = Math.sqrt(MAX_BASE64_SIZE / dataUrl.length);
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL(outputType, 0.7);
        width = canvas.width;
        height = canvas.height;
      }

      resolve({
        dataUrl,
        width,
        height,
        mimeType: outputType,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Bild konnte nicht geladen werden'));
    };

    // Load image from file
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Process image and return base64 data URL for direct DB storage
 * No Supabase Storage needed!
 */
export async function uploadImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  onProgress?.(10);

  // Compress the image
  const compressed = await compressImage(file);

  onProgress?.(80);

  // No actual upload needed - return base64 directly
  onProgress?.(100);

  return {
    url: compressed.dataUrl,  // Base64 data URL stored in DB
    width: compressed.width,
    height: compressed.height,
    mimeType: compressed.mimeType,
  };
}

/**
 * Delete an image - no-op for base64 storage (deleted with message)
 */
export async function deleteImage(_url: string): Promise<void> {
  // No-op for base64 storage - image is deleted with the message
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
    'image/heic',
    'image/heif',
    'image/jpg',
  ];

  // Also check file extension as fallback
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
