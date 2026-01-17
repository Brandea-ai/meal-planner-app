import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
