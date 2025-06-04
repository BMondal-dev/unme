// src/components/chat/ChatListItem.tsx
import { component$ } from "@builder.io/qwik";
import type { ChatItem } from "../../types/chat";

interface ChatListItemProps {
  chat: ChatItem;
}

export const ChatListItem = component$<ChatListItemProps>(({ chat }) => {
  return (
    <div class="hover:bg-fresh-eggplant-50 flex cursor-pointer items-center border-b border-black p-4 transition-colors select-none">
      <div class="relative">
        <img
          src={chat.avatar}
          alt={chat.name}
          width={48} // Matches w-12 (12 * 4px = 48px)
          height={48} // Matches h-12
          class="h-12 w-12 rounded-full border-2 border-black"
        />
        {chat.isOnline && (
          <div class="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
        )}
      </div>
      <div class="ml-4 flex-1">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">{chat.name}</h3>
          <span class="text-xs text-gray-500">{chat.time}</span>
        </div>
        <div class="mt-1 flex items-center justify-between">
          <p class="max-w-[180px] truncate text-sm text-gray-600">
            {chat.lastMessage}
          </p>
          {chat.unreadCount > 0 && (
            <span class="bg-fresh-eggplant-600 flex h-5 w-5 items-center justify-center rounded-full border-1 border-black text-xs font-bold text-white">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
