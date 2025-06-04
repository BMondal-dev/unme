import { component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { ChatItem } from "../../types/chat";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
  chats: ChatItem[];
}

export const ChatList = component$<ChatListProps>(({ chats }) => {
  const nav = useNavigate();

  const handleChatClick = $((chatId: string) => {
    nav(`/chat/${chatId}`);
  });

  return (
    <div class="divide-y divide-gray-200">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick$={() => handleChatClick(chat.id)}
          class="cursor-pointer hover:bg-gray-50"
        >
          <ChatListItem chat={chat} />
        </div>
      ))}
    </div>
  );
});
