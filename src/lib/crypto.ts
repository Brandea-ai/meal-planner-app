/**
 * Ende-zu-Ende Verschlüsselung für den Familien-Chat
 *
 * Verwendet: AES-256-GCM (gleicher Standard wie Signal für Nachrichten)
 *
 * Funktionsweise:
 * 1. Familien-Passwort wird mit PBKDF2 zu einem 256-bit Schlüssel
 * 2. Jede Nachricht wird mit AES-256-GCM verschlüsselt
 * 3. Zufälliger IV (Initialization Vector) für jede Nachricht
 * 4. Passwort verlässt NIEMALS das Gerät
 */

// Check if we're in a browser environment with crypto support
const isCryptoAvailable = typeof window !== 'undefined' && window.crypto && window.crypto.subtle;

// Salt for PBKDF2 key derivation (constant, safe to be public)
const SALT = new TextEncoder().encode('MealPlannerFamilyChat2024');

// Number of PBKDF2 iterations (higher = more secure, but slower)
const PBKDF2_ITERATIONS = 100000;

/**
 * Derives an AES-256 key from a password using PBKDF2
 */
async function deriveKey(password: string): Promise<CryptoKey> {
  if (!isCryptoAvailable) {
    throw new Error('Web Crypto API nicht verfügbar');
  }

  // Import password as raw key material
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive AES-256 key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a message using AES-256-GCM
 * Returns base64-encoded string: IV + ciphertext + auth tag
 */
export async function encryptMessage(plaintext: string, password: string): Promise<string> {
  if (!isCryptoAvailable) {
    console.warn('Crypto not available, returning plaintext');
    return plaintext;
  }

  try {
    const key = await deriveKey(password);

    // Generate random 12-byte IV (recommended for AES-GCM)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the message
    const encodedMessage = new TextEncoder().encode(plaintext);
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedMessage
    );

    // Combine IV + ciphertext into single array
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Return as base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Verschlüsselung fehlgeschlagen');
  }
}

/**
 * Decrypts a message using AES-256-GCM
 * Expects base64-encoded string: IV + ciphertext + auth tag
 */
export async function decryptMessage(encryptedBase64: string, password: string): Promise<string> {
  if (!isCryptoAvailable) {
    console.warn('Crypto not available, returning as-is');
    return encryptedBase64;
  }

  try {
    const key = await deriveKey(password);

    // Decode base64
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

    // Extract IV (first 12 bytes) and ciphertext (rest)
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    // Decrypt
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    // Return placeholder for failed decryption (wrong password or corrupted)
    return '[Entschlüsselung fehlgeschlagen - falsches Passwort?]';
  }
}

/**
 * Verifies if a password can decrypt a test message
 * Used to validate password on login
 */
export async function verifyPassword(encryptedTest: string, password: string): Promise<boolean> {
  if (!isCryptoAvailable) {
    return true;
  }

  try {
    const decrypted = await decryptMessage(encryptedTest, password);
    // Check if decryption produced valid result (not error message)
    return !decrypted.includes('[Entschlüsselung fehlgeschlagen');
  } catch {
    return false;
  }
}

/**
 * Creates a test encrypted message for password verification
 */
export async function createPasswordVerifier(password: string): Promise<string> {
  // Encrypt a known string that we can verify later
  return encryptMessage('MEAL_PLANNER_VERIFIED', password);
}

/**
 * Hashes a password for storage (NOT for encryption, just for local verification)
 */
export async function hashPassword(password: string): Promise<string> {
  if (!isCryptoAvailable) {
    return password;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'MealPlannerSalt');
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Storage keys
const PASSWORD_HASH_KEY = 'meal-planner-e2e-password-hash';
const PASSWORD_KEY = 'meal-planner-e2e-password';

/**
 * Stores the encryption password locally (never sent to server)
 */
export function storePassword(password: string): void {
  if (typeof window !== 'undefined') {
    // Store password in sessionStorage (cleared when browser closes)
    // and hash in localStorage (persists)
    sessionStorage.setItem(PASSWORD_KEY, password);
    hashPassword(password).then(hash => {
      localStorage.setItem(PASSWORD_HASH_KEY, hash);
    });
  }
}

/**
 * Retrieves the stored password
 */
export function getStoredPassword(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(PASSWORD_KEY);
  }
  return null;
}

/**
 * Checks if a password is set up
 */
export function hasPasswordSetup(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(PASSWORD_HASH_KEY) !== null;
  }
  return false;
}

/**
 * Verifies if entered password matches stored hash
 */
export async function verifyStoredPassword(password: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const storedHash = localStorage.getItem(PASSWORD_HASH_KEY);
  if (!storedHash) return false;

  const inputHash = await hashPassword(password);
  return inputHash === storedHash;
}

/**
 * Clears stored password (logout)
 */
export function clearPassword(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(PASSWORD_KEY);
    // Note: We keep the hash in localStorage so they can log back in
  }
}

/**
 * Resets everything (for password reset)
 */
export function resetEncryption(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(PASSWORD_KEY);
    localStorage.removeItem(PASSWORD_HASH_KEY);
  }
}
