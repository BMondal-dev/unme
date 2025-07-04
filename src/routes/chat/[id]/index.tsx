import { component$, $, useSignal } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ChatWindow } from "~/components/chat/ChatWindow";
import type { ChatItem } from "~/types/chat";
import { auth, db } from "~/firebase";
import { doc, getDoc } from "firebase/firestore";

// Loader to fetch chat data from Firestore
export const useChatData = routeLoader$(async ({ params, redirect }) => {
  const chatId = params.id;
  
  if (!chatId) {
    throw redirect(302, "/");
  }
  
  try {
    // Get user profile from Firestore
    const userRef = doc(db, 'users', chatId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.error(`User ${chatId} not found`);
      throw redirect(302, "/");
    }
    
    const userData = userDoc.data();
    
    // Get chat information if it exists
    const currentUserId = auth.currentUser?.uid;
    const combinedChatId = currentUserId ? [currentUserId, chatId].sort().join('_') : '';
    
    // Try to get the chat document if it exists
    const chatData: any = {};
    if (combinedChatId) {
      const chatRef = doc(db, 'chats', combinedChatId);
      const chatDoc = await getDoc(chatRef);
      
      if (chatDoc.exists()) {
        const chatInfo = chatDoc.data();
        chatData.lastMessage = chatInfo.lastMessage?.content || '';
        chatData.time = chatInfo.updatedAt 
          ? new Date(chatInfo.updatedAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : '';
      }
    }
    
    // Create the chat item object
    const chat: ChatItem = {
      id: chatId,
      name: userData.displayName || userData.name || "User",
      avatar: userData.photoURL || userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatId}`,
      lastMessage: chatData.lastMessage || "No messages yet",
      time: chatData.time || "Now",
      unreadCount: 0, // Would need to calculate this from message data
      isOnline: userData.isOnline || false,
      status: userData.status || "Available",
      lastSeen: userData.lastSeen ? new Date(userData.lastSeen.toDate()).toLocaleString() : undefined
    };
    
    return chat;
  } catch (error) {
    console.error('Error loading chat data:', error);
    throw redirect(302, "/");
  }
});

export default component$(() => {
  const chatData = useChatData();
  const error = useSignal<string | null>(null);

  const handleClose = $(() => {
    window.history.back();
  });

  return (
    <div class="h-full">
      {error.value ? (
        <div class="flex h-full items-center justify-center">
          <div class="rounded-md bg-red-50 p-4 text-red-800">
            <p>Error: {error.value}</p>
            <button 
              onClick$={handleClose}
              class="mt-2 rounded bg-red-100 px-3 py-1 text-red-800 hover:bg-red-200"
            >
              Go back
            </button>
          </div>
        </div>
      ) : (
        <ChatWindow chat={chatData.value} onClose$={handleClose} class="h-full" />
      )}
    </div>
  );
});
