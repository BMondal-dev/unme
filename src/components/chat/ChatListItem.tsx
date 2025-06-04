// src/components/chat/ChatListItem.tsx
import { component$ } from "@builder.io/qwik";
import type { ChatItem } from "../../types/chat";

interface ChatListItemProps {
  chat: ChatItem;
}

export const ChatListItem = component$<ChatListItemProps>(({ chat }) => {
  return (
    <div class="flex items-center p-4 hover:bg-fresh-eggplant-50 transition-colors cursor-pointer border-b border-black select-none">
      <div class="relative">
      <img
        src={chat.avatar}
        alt={chat.name}
        width={48}  // Matches w-12 (12 * 4px = 48px)
        height={48} // Matches h-12
        class="w-12 h-12 rounded-full border-2 border-black"
      />
        {chat.isOnline && (
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div class="ml-4 flex-1">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold">{chat.name}</h3>
          <span class="text-xs text-gray-500">{chat.time}</span>
        </div>
        <div class="flex justify-between items-center mt-1">
          <p class="text-sm text-gray-600 truncate max-w-[180px]">
            {chat.lastMessage}
          </p>
          {chat.unreadCount > 0 && (
            <span class="bg-fresh-eggplant-600 text-white text-xs font-bold w-5 h-5 border-1 border-black rounded-full flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});