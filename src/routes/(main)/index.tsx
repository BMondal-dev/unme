import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ChatList } from "~/components/chat/ChatList";
import { SearchIcon } from "~/components/icons/SearchIcon";
import { IconWrapper } from "~/components/ui/IconWrapper";
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
    status: "Hey there! I'm using Unme Chat",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Let's meet tomorrow",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
    status: "Available",
  },
  {
    id: "3",
    name: "Team Group",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Meeting at 3 PM",
    time: "Yesterday",
    unreadCount: 5,
    isOnline: false,
    lastSeen: "Last seen today at 2:30 PM",
  },
  {
    id: "4",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Check out this cool project!",
    time: "2h ago",
    unreadCount: 0,
    isOnline: true,
    status: "Coding something awesome",
  },
  {
    id: "5",
    name: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Let's schedule a call",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
    status: "Available",
  },
];

export default component$(() => {
  return (
    <div class="flex h-full flex-col">
      <div class="fixed top-0 right-0 left-0 z-10 mx-auto w-full max-w-[500px] rounded-b-lg border-2 border-black bg-white p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Chats</h1>
          <IconWrapper class="h-8 w-8">
            <SearchIcon class="h-6 w-6" />
          </IconWrapper>
        </div>
      </div>

      <div class="h-full pt-16">
        <ChatList chats={mockChats} class="h-full" />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Chats | Unme",
  meta: [
    {
      name: "description",
      content: "Connect and chat with your friends and teams on Unme",
    },
    {
      property: "og:title",
      content: "Chats | Unme",
    },
    {
      property: "og:description",
      content: "Connect and chat with your friends and teams on Unme",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
};
