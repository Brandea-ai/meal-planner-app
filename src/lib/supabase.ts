import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Trim to remove any trailing newlines from env vars (fixes WebSocket connection issues)
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Create supabase client with error handling
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock client that won't crash but logs warnings
  console.warn('Supabase environment variables not configured. Using offline mode.');
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export { supabase };

// Generate or retrieve device ID for anonymous sync
export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem('meal-planner-device-id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('meal-planner-device-id', deviceId);
  }
  return deviceId;
}

// Set device ID (used for QR code sync)
export function setDeviceId(deviceId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('meal-planner-device-id', deviceId);
}

// Reset device ID (generates a new one for fresh sync)
export function resetDeviceId(): string {
  if (typeof window === 'undefined') return '';
  const newDeviceId = crypto.randomUUID();
  localStorage.setItem('meal-planner-device-id', newDeviceId);
  return newDeviceId;
}
