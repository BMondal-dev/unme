// src/components/chat/ChatList.tsx
import { component$ } from "@builder.io/qwik";
import type { ChatItem } from "../../types/chat";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
  chats: ChatItem[];
}

export const ChatList = component$<ChatListProps>(({ chats }) => {
  return (
    <div class="divide-y divide-gray-200">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
});