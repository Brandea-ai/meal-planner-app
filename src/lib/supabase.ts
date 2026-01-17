import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
