'use client';

// ========================================
// Ringtone Generator using Web Audio API
// ========================================

let audioContext: AudioContext | null = null;
let ringtoneInterval: NodeJS.Timeout | null = null;
let isRinging = false;

// Get or create AudioContext
function getAudioContext(): AudioContext {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Play a single ring tone (beep-beep pattern)
function playRingTone(): void {
  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Create oscillator for the ring
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Ring tone frequency (pleasant phone ring)
  oscillator.frequency.setValueAtTime(880, now); // A5 note
  oscillator.type = 'sine';

  // Volume envelope for smooth ring
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
  gainNode.gain.setValueAtTime(0.3, now + 0.15);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.2);

  // Second beep
  gainNode.gain.setValueAtTime(0, now + 0.3);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.35);
  gainNode.gain.setValueAtTime(0.3, now + 0.45);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.5);

  oscillator.start(now);
  oscillator.stop(now + 0.6);
}

// Start continuous ringtone
export function startRingtone(): void {
  if (isRinging) return;

  isRinging = true;

  // Play immediately
  playRingTone();

  // Then repeat every 2 seconds
  ringtoneInterval = setInterval(() => {
    if (isRinging) {
      playRingTone();
    }
  }, 2000);
}

// Stop ringtone
export function stopRingtone(): void {
  isRinging = false;

  if (ringtoneInterval) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
}

// ========================================
// Browser Notifications
// ========================================

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

// Get current notification permission
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

// Show incoming call notification
let activeNotification: Notification | null = null;

export function showIncomingCallNotification(
  callerName: string,
  callType: 'video' | 'audio',
  onAccept?: () => void,
  _onReject?: () => void // Kept for future use
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  // Close any existing notification
  if (activeNotification) {
    activeNotification.close();
  }

  const callTypeText = callType === 'video' ? 'Videoanruf' : 'Sprachanruf';
  const icon = callType === 'video' ? '/icons/video-call.png' : '/icons/phone-call.png';

  const notification = new Notification(`${callTypeText} von ${callerName}`, {
    body: 'Tippe um den Anruf anzunehmen',
    icon: icon,
    tag: 'incoming-call',
    requireInteraction: true, // Keep notification until user interacts
    silent: false, // Allow system sound
  });

  // Handle click on notification
  notification.onclick = () => {
    window.focus();
    notification.close();
    if (onAccept) {
      onAccept();
    }
  };

  // Handle close
  notification.onclose = () => {
    activeNotification = null;
  };

  activeNotification = notification;
  return notification;
}

// Close incoming call notification
export function closeIncomingCallNotification(): void {
  if (activeNotification) {
    activeNotification.close();
    activeNotification = null;
  }
}

// ========================================
// Vibration API (for mobile devices)
// ========================================

export function startVibration(): void {
  if ('vibrate' in navigator) {
    // Vibration pattern: vibrate 200ms, pause 100ms, repeat
    navigator.vibrate([200, 100, 200, 100, 200, 500]);
  }
}

export function stopVibration(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(0); // Stop vibration
  }
}

// ========================================
// Combined incoming call alert
// ========================================

export function startIncomingCallAlert(
  callerName: string,
  callType: 'video' | 'audio',
  onAccept?: () => void,
  onReject?: () => void
): void {
  // Start ringtone
  startRingtone();

  // Show browser notification
  showIncomingCallNotification(callerName, callType, onAccept, onReject);

  // Start vibration pattern (mobile)
  startVibration();
}

export function stopIncomingCallAlert(): void {
  // Stop ringtone
  stopRingtone();

  // Close notification
  closeIncomingCallNotification();

  // Stop vibration
  stopVibration();
}

// ========================================
// Outgoing call sound (dial tone)
// ========================================

let dialToneInterval: NodeJS.Timeout | null = null;
let isDialing = false;

function playDialTone(): void {
  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Dual-tone (similar to phone dial tone)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);

  // US dial back tone frequencies
  osc1.frequency.setValueAtTime(440, now);
  osc2.frequency.setValueAtTime(480, now);
  osc1.type = 'sine';
  osc2.type = 'sine';

  // Lower volume for dial tone
  gainNode.gain.setValueAtTime(0.1, now);
  gainNode.gain.setValueAtTime(0.1, now + 1.9);
  gainNode.gain.linearRampToValueAtTime(0, now + 2);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 2);
  osc2.stop(now + 2);
}

export function startDialTone(): void {
  if (isDialing) return;

  isDialing = true;
  playDialTone();

  // Repeat every 4 seconds (2 seconds on, 2 seconds off)
  dialToneInterval = setInterval(() => {
    if (isDialing) {
      playDialTone();
    }
  }, 4000);
}

export function stopDialTone(): void {
  isDialing = false;

  if (dialToneInterval) {
    clearInterval(dialToneInterval);
    dialToneInterval = null;
  }
}

// ========================================
// Call connected sound
// ========================================

export function playConnectedSound(): void {
  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Pleasant connection sound
  oscillator.frequency.setValueAtTime(523, now); // C5
  oscillator.frequency.setValueAtTime(659, now + 0.1); // E5
  oscillator.frequency.setValueAtTime(784, now + 0.2); // G5
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.4);

  oscillator.start(now);
  oscillator.stop(now + 0.4);
}

// ========================================
// Call ended sound
// ========================================

export function playEndedSound(): void {
  const ctx = getAudioContext();

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Descending tone for call ended
  oscillator.frequency.setValueAtTime(440, now);
  oscillator.frequency.linearRampToValueAtTime(220, now + 0.3);
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

  oscillator.start(now);
  oscillator.stop(now + 0.35);
}
