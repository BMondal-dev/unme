import {
  component$,
  useSignal,
  $,
  useVisibleTask$,
  useTask$,
} from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { ChatFooter } from "./ChatFooter";
import type { ChatItem, Message } from "../../types/chat";
import { useWebSocket } from "~/hooks/useWebSocket";
import { auth, db } from "~/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs } from "firebase/firestore";

interface ChatWindowProps {
  chat: ChatItem;
  onClose$: QRL<() => void>;
  class?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

export const ChatWindow = component$<ChatWindowProps>(
  ({ chat, onClose$, class: className = "" }) => {
    const messages = useSignal<Message[]>([]);
    const loadingMessages = useSignal(true);
    const wsStatus = useSignal("disconnected");
    const { connect, send, onMessage, disconnect, isConnected, encryptMessage, decryptMessage } = useWebSocket();
    const wsUrl = import.meta.env.PUBLIC_WS_URL || "wss://api.unme.app/chat/ws";
    
    const currentUser = useSignal<User | null>(null);

    // Set up current user and connect to WebSocket
    useVisibleTask$(async () => {
      if (!auth.currentUser) {
        console.error("No authenticated user");
        return;
      }
      
      // Set current user information
      currentUser.value = {
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName || "You",
        avatar: auth.currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.uid}`,
      };
      
      // Connect to WebSocket server
      await connect(wsUrl);
      wsStatus.value = isConnected.value ? "connected" : "disconnected";
      
      // Set up WebSocket message handler
      onMessage((data) => {
        if (data.type === "newMessage" && data.message) {
          // Create a message object from the received data
          const newMessage: Message = {
            id: data.message.id,
            content: data.message.content,
            timestamp: new Date(data.message.timestamp).toISOString(),
            isRead: false,
            sender: {
              id: data.message.senderId,
              name: chat.name, // Assuming the sender is the chat partner
              avatar: chat.avatar,
            },
          };
          
          // Add to local message state
          messages.value = [...messages.value, newMessage];
        }
      });
      
      // Clean up on component unmount
      return () => {
        disconnect();
      };
    });
    
    // Load chat messages from Firestore
    useVisibleTask$(async () => {
      if (!auth.currentUser) return;
      
      // Generate chat ID consistently (sort user IDs to ensure same ID regardless of sender/receiver)
      const chatId = [auth.currentUser.uid, chat.id].sort().join('_');
      
      try {
        loadingMessages.value = true;
        
        // Set up Firestore query for messages
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        
        // Subscribe to messages updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newMessages: Message[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Decrypt message if it's encrypted
            let messageContent = data.content;
            if (data.isEncrypted) {
              try {
                messageContent = decryptMessage(data.content);
              } catch (error) {
                console.error("Failed to decrypt message:", error);
                messageContent = "[Encrypted message]";
              }
            }
            
            newMessages.push({
              id: doc.id,
              content: messageContent,
              timestamp: data.timestamp?.toDate?.() 
                ? data.timestamp.toDate().toISOString()
                : new Date().toISOString(),
              isRead: data.read || false,
              sender: {
                id: data.senderId,
                name: data.senderId === auth.currentUser?.uid ? "You" : chat.name,
                avatar: data.senderId === auth.currentUser?.uid 
                  ? (auth.currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.uid}`)
                  : chat.avatar,
              },
            });
          });
          
          messages.value = newMessages;
          loadingMessages.value = false;
        });
        
        // Clean up subscription on component unmount
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error loading messages:", error);
        loadingMessages.value = false;
      }
    });

    // Scroll to bottom when messages change
    useTask$(({ track }) => {
      track(messages);
      if (typeof document !== "undefined") {
        const messageList = document.querySelector(".message-list");
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight;
        }
      }
    });

    // Handle sending a new message
    const handleSendMessage = $(async (messageText: string) => {
      if (!messageText.trim() || !auth.currentUser) return;
      
      try {
        // Encrypt the message
        const encryptedContent = encryptMessage(messageText);
        
        // Create chat ID
        const chatId = [auth.currentUser.uid, chat.id].sort().join('_');
        
        // Send via WebSocket for real-time delivery
        const success = send({
          type: "message",
          recipientId: chat.id,
          content: encryptedContent,
          isEncrypted: true,
          chatId
        });
        
        if (!success) {
          console.warn("WebSocket send failed, falling back to direct Firestore save");
          
          // Fallback: Save directly to Firestore if WebSocket fails
          const messagesRef = collection(db, 'chats', chatId, 'messages');
          await addDoc(messagesRef, {
            content: encryptedContent,
            senderId: auth.currentUser.uid,
            timestamp: serverTimestamp(),
            read: false,
            isEncrypted: true
          });
        }
        
        // Optimistically add message to UI
        const newMessage: Message = {
          id: Date.now().toString(),
          content: messageText, // Show decrypted version in UI
          timestamp: new Date().toISOString(),
          isRead: false,
          sender: {
            id: currentUser.value?.id || auth.currentUser.uid,
            name: currentUser.value?.name || "You",
            avatar: currentUser.value?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser.uid}`,
          },
        };
        
        messages.value = [...messages.value, newMessage];
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    return (
      <div class={`flex h-full flex-col overflow-hidden ${className}`}>
        <ChatHeader
          user={chat}
          onBack$={onClose$}
          onCall$={$(() => {})}
          onVideoCall$={$(() => {})}
          onViewProfile$={$(() => {})}
        />
        
        <div class="message-list flex-1 overflow-y-auto p-4">
          {loadingMessages.value ? (
            <div class="flex h-full items-center justify-center">
              <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
          ) : messages.value.length === 0 ? (
            <div class="flex h-full flex-col items-center justify-center text-center text-gray-500">
              <p class="mb-2">No messages yet</p>
              <p class="text-sm">Send a message to start the conversation!</p>
            </div>
          ) : (
            <div class="space-y-4">
              {messages.value.map((message, index) => {
                const prevMessage = index > 0 ? messages.value[index - 1] : null;
                const showAvatar =
                  !prevMessage || prevMessage.sender.id !== message.sender.id;
                const isCurrentUser = message.sender.id === currentUser.value?.id;

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={isCurrentUser}
                    showAvatar={showAvatar}
                    user={{
                      id: message.sender.id,
                      name: message.sender.name,
                      avatar: message.sender.avatar,
                      isOnline: message.sender.id === chat.id ? chat.isOnline : undefined,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <ChatFooter onSendMessage$={handleSendMessage} />
        
        {wsStatus.value !== "connected" && (
          <div class="bg-yellow-100 px-4 py-2 text-xs text-yellow-800">
            {wsStatus.value === "disconnected" 
              ? "Connecting to chat server..." 
              : "Connection issue. Messages will be saved but not delivered instantly."}
          </div>
        )}
      </div>
    );
  }
);
