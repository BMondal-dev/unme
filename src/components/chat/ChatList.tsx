import { component$, $, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { ChatItem } from "../../types/chat";
import { ChatListItem } from "./ChatListItem";
import { auth, db } from "~/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, doc, getDoc } from "firebase/firestore";

interface ChatListProps {
  chats?: ChatItem[];
  searchQuery?: string;
  class?: string;
}

export const ChatList = component$<ChatListProps>(({ chats: initialChats, searchQuery = "", class: className = "" }) => {
  const nav = useNavigate();
  const chats = useSignal<ChatItem[]>(initialChats || []);
  const filteredChats = useSignal<ChatItem[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);

  const handleChatClick = $((chatId: string) => {
    nav(`/chat/${chatId}`);
  });

  // Apply search filter to chats
  useTask$(({ track }) => {
    const query = track(() => searchQuery);
    
    if (!query) {
      filteredChats.value = chats.value;
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    filteredChats.value = chats.value.filter(chat => 
      chat.name.toLowerCase().includes(lowerQuery) || 
      chat.lastMessage.toLowerCase().includes(lowerQuery)
    );
  });

  // Load chats from Firestore
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    if (!auth.currentUser) {
      error.value = "User not authenticated";
      isLoading.value = false;
      return;
    }

    try {
      isLoading.value = true;
      const currentUserId = auth.currentUser.uid;
      
      // Get all chats where the current user is a participant
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', currentUserId),
        orderBy('updatedAt', 'desc'),
        limit(20)
      );
      
      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const chatsList: ChatItem[] = [];
        
        // Process each chat document
        for (const chatDoc of snapshot.docs) {
          const chatData = chatDoc.data();
          const participants = chatData.participants || [];
          // Find the other participant (for 1:1 chats)
          const otherUserId = participants.find((id: string) => id !== currentUserId);
          if (!otherUserId) continue;
          
          // Get the user info for the other participant
          const userDocRef = doc(db, 'users', otherUserId);
          const userDoc = await getDoc(userDocRef);

          let userData = {
            displayName: "User",
            photoURL: null,
            isOnline: false,
            status: "Available",
            phoneNumber: null
          };
          if (userDoc.exists()) {
            const raw = userDoc.data();
            userData = {
              displayName: raw.name || "User",
              photoURL: raw.profileImage || null,
              isOnline: false,
              status: "Available",
              phoneNumber: raw.phone || null
            };
          }
          
          // Format the chat item
          const lastMessageTime = chatData.updatedAt?.toDate() || new Date();
          const timeFormatted = formatChatTime(lastMessageTime);
          
          chatsList.push({
            id: otherUserId,
            name: userData.displayName || "User",
            avatar: userData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`,
            lastMessage: chatData.lastMessage?.content || "No messages yet",
            time: timeFormatted,
            unreadCount: 0, // Would need to calculate this
            isOnline: userData.isOnline ?? false,
            status: userData.status ?? "Available",
            phoneNumber: userData.phoneNumber ?? null
          });
        }
        
        chats.value = chatsList;
        filteredChats.value = chatsList;
        isLoading.value = false;
      }, (err) => {
        console.error("Error loading chats:", err);
        error.value = "Failed to load chats";
        isLoading.value = false;
      });
      
      // Clean up subscription on component unmount
      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error("Error setting up chat listener:", err);
      error.value = "Failed to load chats";
      isLoading.value = false;
    }
  });

  return (
    <div class={`divide-y divide-gray-200 ${className}`}>
      {isLoading.value ? (
        <div class="flex h-40 items-center justify-center">
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
        </div>
      ) : error.value ? (
        <div class="p-4 text-center text-red-500">{error.value}</div>
      ) : filteredChats.value.length === 0 ? (
        <div class="p-4 text-center text-gray-500">
          {searchQuery ? "No chats match your search" : "No conversations yet"}
        </div>
      ) : (
        filteredChats.value.map((chat) => (
          <div
            key={chat.id}
            onClick$={() => handleChatClick(chat.id)}
            class="cursor-pointer hover:bg-gray-50"
          >
            <ChatListItem chat={chat} />
          </div>
        ))
      )}
    </div>
  );
});

// Helper function to format time for chat list
function formatChatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today, show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffDays < 7) {
    // Within a week, show day name
    return date.toLocaleDateString([], { weekday: 'long' });
  } else {
    // More than a week, show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}
