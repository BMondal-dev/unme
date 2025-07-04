// src/routes/api/chat/ws.ts
import type { RequestHandler } from '@builder.io/qwik-city';
import WebSocket from 'ws';
import { auth, db } from "~/firebase";
import { collection, addDoc, serverTimestamp, getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

// In-memory store for WebSocket connections
const clients = new Map<string, WebSocket>();

export const onGet: RequestHandler = async ({ request, cacheControl, env, platform }) => {
  cacheControl({
    noCache: true,
    staleWhileRevalidate: 0
  });

  if (request.headers.get('upgrade') !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  const url = new URL(request.url);
  const tokenParam = url.searchParams.get('token');
  
  if (!tokenParam) {
    return new Response('Authentication token required', { status: 401 });
  }

  let userId: string;
  try {
    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(tokenParam);
    userId = decodedToken.uid;
  } catch (error) {
    console.error('Token verification failed:', error);
    return new Response('Invalid authentication token', { status: 401 });
  }

  const { socket, response } = (platform as any).upgradeWebSocket();

  // Attach user ID to the socket for later reference
  (socket as any).userId = userId;
  
  socket.addEventListener('open', () => {
    clients.set(userId, socket as unknown as WebSocket);
    console.log(`User ${userId} connected`);
  });

  socket.addEventListener('message', async (event) => {
    try {
      const data = JSON.parse(event.data as string);
      
      if (data.type === 'message' && data.recipientId && data.content) {
        await handleMessage(userId, data);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.addEventListener('close', () => {
    clients.delete(userId);
    console.log(`User ${userId} disconnected`);
  });

  return response;
};

async function handleMessage(senderId: string, data: any) {
  const messageId = uuidv4();
  const timestamp = serverTimestamp();
  
  // Create a unique chat ID from both user IDs (sorted to ensure consistency)
  const chatId = [senderId, data.recipientId].sort().join('_');
  
  try {
    // Check if chat exists, if not create it
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (!chatDoc.exists()) {
      // Create a new chat
      await updateDoc(chatRef, {
        participants: [senderId, data.recipientId],
        createdAt: timestamp,
        updatedAt: timestamp
      });
    } else {
      // Update the existing chat
      await updateDoc(chatRef, {
        updatedAt: timestamp
      });
    }
    
    // Add the message to Firestore
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      id: messageId,
      content: data.content,  // Already encrypted on client side
      senderId,
      isEncrypted: data.isEncrypted || false,
      timestamp,
      read: false
    });
    
    // Update chat with last message info
    await updateDoc(chatRef, {
      lastMessage: {
        id: messageId,
        content: data.isEncrypted ? "[Encrypted message]" : data.content.substring(0, 50),
        senderId,
        timestamp
      }
    });
    
    // Send to recipient if online
    const recipientWs = clients.get(data.recipientId);
    if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
      recipientWs.send(JSON.stringify({
        type: 'newMessage',
        message: {
          id: messageId,
          chatId,
          content: data.content,
          senderId,
          isEncrypted: data.isEncrypted || false,
          timestamp: Date.now()
        }
      }));
    }
    
    // Send acknowledgment to sender
    const senderWs = clients.get(senderId);
    if (senderWs && senderWs.readyState === WebSocket.OPEN) {
      senderWs.send(JSON.stringify({
        type: 'messageDelivered',
        messageId,
        chatId,
        timestamp: Date.now()
      }));
    }
  } catch (error) {
    console.error('Error storing message:', error);
    throw error;
  }
}