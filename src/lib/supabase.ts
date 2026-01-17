import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client with fallback for missing env vars
function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured');
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('Failed to create Supabase client:', e);
    return null;
  }
}

export const supabase = createSupabaseClient();

// Fallback UUID generator for browsers without crypto.randomUUID
function generateUUID(): string {
  // Use crypto.randomUUID if available
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: generate UUID v4 manually
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Safe localStorage access
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('localStorage access failed:', e);
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn('localStorage write failed:', e);
    return false;
  }
}

// Generate or retrieve device ID for anonymous sync
export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';

  let deviceId = safeGetItem('meal-planner-device-id');
  if (!deviceId) {
    deviceId = generateUUID();
    safeSetItem('meal-planner-device-id', deviceId);
  }
  return deviceId;
}

// Set device ID (used for QR code sync)
export function setDeviceId(deviceId: string): void {
  if (typeof window === 'undefined') return;
  safeSetItem('meal-planner-device-id', deviceId);
}

// Check if Supabase is available
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}
