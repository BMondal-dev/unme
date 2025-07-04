// src/hooks/useWebSocket.ts
import { useVisibleTask$, $ } from '@builder.io/qwik';
import { useSignal } from '@builder.io/qwik';
import { auth } from '~/firebase';
import * as CryptoJS from 'crypto-js';

export function useWebSocket() {
  const ws = useSignal<WebSocket | null>(null);
  const isConnected = useSignal(false);
  const messageHandlers = useSignal<((data: any) => void)[]>([]);
  const reconnectAttempts = useSignal(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = 3000;
  const clientEncryptionKey = useSignal<string>('');

  // Initialize client encryption key
  useVisibleTask$(({ track }) => {
    track(() => auth.currentUser);
    if (auth.currentUser) {
      // Generate or retrieve a unique key for this user
      // In a real app, you might want to store this securely or derive it from user credentials
      const userId = auth.currentUser.uid;
      let storedKey = localStorage.getItem(`encryption_key_${userId}`);
      
      if (!storedKey) {
        // Generate a new key if none exists
        storedKey = CryptoJS.lib.WordArray.random(32).toString();
        localStorage.setItem(`encryption_key_${userId}`, storedKey);
      }
      
      clientEncryptionKey.value = storedKey;
    }
  });

  const connect = $(async (url: string) => {
    if (ws.value?.readyState === WebSocket.OPEN) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No authenticated user');
        return;
      }

      const token = await user.getIdToken();
      const socket = new WebSocket(`${url}?token=${token}`);

      socket.onopen = () => {
        console.log('WebSocket connected');
        isConnected.value = true;
        reconnectAttempts.value = 0;
        
        // After connection, authenticate with the server
        socket.send(JSON.stringify({
          type: 'authenticate',
          token: token
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // If it's a new message and it's encrypted, decrypt it
          if (data.type === 'newMessage' && data.message && data.message.isEncrypted) {
            try {
              const decryptedContent = decryptMessage(data.message.content);
              data.message.content = decryptedContent;
              data.message.isDecrypted = true;
            } catch (decryptError) {
              console.error('Failed to decrypt message:', decryptError);
              // Keep the encrypted content, mark as not decrypted
              data.message.isDecrypted = false;
            }
          }
          
          messageHandlers.value.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        isConnected.value = false;
        
        if (reconnectAttempts.value < maxReconnectAttempts) {
          reconnectAttempts.value++;
          console.log(`Reconnecting attempt ${reconnectAttempts.value}...`);
          setTimeout(() => connect(url), reconnectTimeout);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.value = socket;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  });

  const send = $((data: any) => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      // If it's a message, encrypt the content client-side before sending
      if (data.type === 'message' && data.content) {
        // Encrypt the message content
        const encryptedContent = encryptMessage(data.content);
        data.content = encryptedContent;
        data.isEncrypted = true;
      }
      
      ws.value.send(JSON.stringify(data));
      return true;
    }
    console.warn('WebSocket is not connected');
    return false;
  });

  const encryptMessage = $((content: string): string => {
    if (!clientEncryptionKey.value) {
      throw new Error('Encryption key not available');
    }
    
    // Generate a random IV for each message
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Encrypt the content
    const encrypted = CryptoJS.AES.encrypt(content, clientEncryptionKey.value, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    
    // Return IV + encrypted content as a string
    return iv.toString() + ':' + encrypted.toString();
  });

  const decryptMessage = $((encryptedContent: string): string => {
    if (!clientEncryptionKey.value) {
      throw new Error('Encryption key not available');
    }
    
    // Split the IV and content
    const parts = encryptedContent.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted format');
    }
    
    const iv = parts[0];
    const encrypted = parts[1];
    
    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(encrypted, clientEncryptionKey.value, {
      iv: CryptoJS.enc.Hex.parse(iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  });

  const onMessage = $((handler: (data: any) => void) => {
    messageHandlers.value = [...messageHandlers.value, handler];
    return () => {
      messageHandlers.value = messageHandlers.value.filter(h => h !== handler);
    };
  });

  const disconnect = $(() => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
      isConnected.value = false;
      console.log('WebSocket disconnected by user');
    }
  });

  return {
    connect,
    send,
    onMessage,
    disconnect,
    isConnected,
    encryptMessage,
    decryptMessage
  };
}