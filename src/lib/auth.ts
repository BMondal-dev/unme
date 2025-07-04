// src/lib/auth.ts
import { auth } from '~/firebase';

/**
 * Verifies a Firebase ID token and returns the user ID
 * @param token The Firebase ID token to verify
 * @returns A promise that resolves with the user ID
 */
export async function verifyToken(token: string): Promise<string> {
  try {
    // const decodedToken = await auth.verifyIdToken(token);
    // return decodedToken.uid;
    throw new Error('verifyIdToken is not available in this Firebase JS SDK');
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid authentication token');
  }
}

/**
 * Encrypts data using a provided key
 * @param data The data to encrypt
 * @param key The encryption key
 * @returns The encrypted data
 */
export function encryptData(data: string, key: string): string {
  // Implement end-to-end encryption logic here
  // This would typically use a library like CryptoJS
  return data;
}

/**
 * Decrypts data using a provided key
 * @param encryptedData The encrypted data
 * @param key The decryption key
 * @returns The decrypted data
 */
export function decryptData(encryptedData: string, key: string): string {
  // Implement end-to-end decryption logic here
  // This would typically use a library like CryptoJS
  return encryptedData;
}

/**
 * Generates a unique encryption key for a chat
 * @param userId1 First user ID
 * @param userId2 Second user ID
 * @returns A unique encryption key for the chat between these users
 */
export function generateChatKey(userId1: string, userId2: string): string {
  // Generate a deterministic key based on user IDs
  // In a real app, you'd use a more secure approach with key exchange
  const sortedIds = [userId1, userId2].sort().join('_');
  return `chat_key_${sortedIds}`;
}