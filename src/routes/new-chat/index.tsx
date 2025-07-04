import { component$, $, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { auth, db } from "~/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNotification } from "~/components/ui/Notification";
import type { ChatItem } from "~/types/chat";

export default component$(() => {
  const phoneNumber = useSignal("");
  const isLoading = useSignal(false);
  const searchResults = useSignal<ChatItem[]>([]);
  const error = useSignal<string | null>(null);
  const { show } = useNotification();
  const nav = useNavigate();

  const handleSearch = $(async () => {
    if (!phoneNumber.value || !phoneNumber.value.startsWith('+') || phoneNumber.value.length < 10) {
      error.value = "Please enter a valid phone number starting with '+' (e.g. +916291171004)";
      return;
    }

    if (!auth.currentUser) {
      error.value = "You must be logged in to search for users";
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      searchResults.value = [];
      
      // Use the phone number as is, since it should already include the + prefix
      const formattedPhone = phoneNumber.value;
      
      // Search for users with the provided phone number
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phone', '==', formattedPhone));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        error.value = "No user found with this phone number";
        isLoading.value = false;
        return;
      }
      
      // Process results
      const results: ChatItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        
        // Don't show the current user
        if (userData.uid === auth.currentUser?.uid) return;
        
        results.push({
          id: userData.uid,
          name: userData.name || "User",
          avatar: userData.profileImage || userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.uid}`,
          lastMessage: "No messages yet",
          time: "Now",
          unreadCount: 0,
          isOnline: userData.isOnline || false,
          status: userData.status || "Available",
          phoneNumber: userData.phoneNumber
        });
      });
      
      searchResults.value = results;
      isLoading.value = false;
    } catch (err) {
      console.error("Error searching for user:", err);
      error.value = "Failed to search for user";
      isLoading.value = false;
    }
  });

  const handleStartChat = $(async (userId: string) => {
    if (!auth.currentUser) {
      show("You must be logged in to start a chat", "error");
      return;
    }

    try {
      // Create a chat ID from both user IDs (sorted to ensure consistency)
      const chatId = [auth.currentUser.uid, userId].sort().join('_');
      
      // Check if chat already exists
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (!chatDoc.exists()) {
        // Create a new chat
        await setDoc(chatRef, {
          participants: [auth.currentUser.uid, userId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        show("Chat created successfully", "success");
      }
      
      // Navigate to chat
      nav(`/chat/${userId}`);
    } catch (err) {
      console.error("Error creating chat:", err);
      show("Failed to create chat", "error");
    }
  });

  const handleBack = $(() => {
    nav('/');
  });

  return (
    <div class="flex h-full flex-col">
      <div class="sticky top-0 z-10 border-b-2 border-black bg-white p-4">
        <div class="flex items-center">
          <button 
            onClick$={handleBack}
            class="mr-4 text-gray-500"
          >
            <span class="text-xl">&larr;</span>
          </button>
          <h1 class="text-2xl font-bold">New Chat</h1>
        </div>
      </div>
      
      <div class="p-4">
        <div class="mb-6">
          <label class="block font-medium mb-2">Enter phone number (with country code)</label>
          <div class="flex">
            <input
              type="tel"
              placeholder="+916291171004"
              value={phoneNumber.value}
              onInput$={(e) => (phoneNumber.value = (e.target as HTMLInputElement).value)}
              class="w-full rounded-l-lg border-2 border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
            />
            <button
              onClick$={handleSearch}
              disabled={isLoading.value}
              class="flex items-center justify-center rounded-r-lg bg-fresh-eggplant-600 px-4 py-2 text-white disabled:bg-gray-400"
            >
              {isLoading.value ? 
                <div class="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-white"></div> : 
                "Search"
              }
            </button>
          </div>
          {error.value && (
            <p class="mt-2 text-sm text-red-500">{error.value}</p>
          )}
        </div>
        
        {searchResults.value.length > 0 && (
          <div class="mt-4">
            <h2 class="mb-2 font-medium">Search Results</h2>
            <div class="divide-y divide-gray-200 rounded-lg border border-gray-200">
              {searchResults.value.map((user) => (
                <div key={user.id} class="flex items-center p-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    class="h-12 w-12 rounded-full border-2 border-black"
                    width={48}
                    height={48}
                  />
                  <div class="ml-3 flex-1">
                    <h3 class="font-semibold">{user.name}</h3>
                    <p class="text-sm text-gray-600">{user.phoneNumber}</p>
                  </div>
                  <button
                    onClick$={() => handleStartChat(user.id)}
                    class="rounded-lg bg-fresh-eggplant-600 px-3 py-1 text-sm text-white"
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "New Chat | Unme",
  meta: [
    {
      name: "description",
      content: "Start a new chat on Unme",
    },
  ],
};
