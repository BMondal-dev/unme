// src/routes/index.tsx
import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { IconWrapper } from "~/components/ui/IconWrapper";
import { SearchIcon } from "~/components/icons/SearchIcon";
import { ChatList } from "~/components/chat/ChatList";
import type { ChatItem } from "~/types/chat";

// Mock data - in a real app, this would come from an API or store
const mockChats: ChatItem[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey, how are you doing?",
    time: "10:30 AM",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Let's meet tomorrow",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Team Group",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Meeting at 3 PM",
    time: "Yesterday",
    unreadCount: 5,
    isOnline: false,
  },
  {
    id: "4",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey, how are you doing?",
    time: "10:30 AM",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "5",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Let's meet tomorrow",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "4",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey, how are you doing?",
    time: "10:30 AM",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "6",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Let's meet tomorrow",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "7",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey, how are you doing?",
    time: "10:30 AM",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "5",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Let's meet tomorrow",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "6",
    name: "Team Group",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Meeting at 3 PM",
    time: "Yesterday",
    unreadCount: 5,
    isOnline: false,
  },
];

export default component$(() => {
  return (
    <div class="flex h-full flex-col">
      {/* Fixed Header */}
      <div class="fixed top-0 left-0 right-0 z-10 bg-fresh-eggplant-100 border-2 border-black p-4 mx-auto max-w-[500px] w-full rounded-b-lg">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Chats</h1>
          <IconWrapper class="h-8 w-8">
            <SearchIcon class="h-6 w-6" />
          </IconWrapper>
        </div>
      </div>

      {/* Chat List with padding for fixed header */}
      <div class="flex-1 overflow-y-auto pt-16">
        <ChatList chats={mockChats} />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Chats - Unme",
  meta: [
    {
      name: "description",
      content: "Your chat conversations",
    },
  ],
};