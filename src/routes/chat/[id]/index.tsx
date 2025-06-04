import { component$, $ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ChatWindow } from "~/components/chat/ChatWindow";
import type { ChatItem } from "~/types/chat";

// This would normally come from an API
const mockChats: Record<string, ChatItem> = {
  "1": {
    id: "1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey, how are you doing?",
    time: "10:30 AM",
    unreadCount: 2,
    isOnline: true,
    status: "Hey there! I'm using Unme Chat",
  },
  "2": {
    id: "2",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Let's meet tomorrow",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
    status: "Available",
  },
  "3": {
    id: "3",
    name: "Team Group",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Meeting at 3 PM",
    time: "Yesterday",
    unreadCount: 5,
    isOnline: false,
    lastSeen: "Last seen today at 2:30 PM",
  },
  "4": {
    id: "4",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Check out this cool project!",
    time: "2h ago",
    unreadCount: 0,
    isOnline: true,
    status: "Coding something awesome",
  },
  "5": {
    id: "5",
    name: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Let's schedule a call",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
    status: "Available",
  },
};

export const useChatData = routeLoader$(async ({ params, redirect }) => {
  const chat = mockChats[params.id];
  if (!chat) {
    throw redirect(302, "/");
  }
  return chat;
});

export default component$(() => {
  const chatData = useChatData();

  const handleClose = $(() => {
    window.history.back();
  });

  return (
    <div class="h-full">
      <ChatWindow chat={chatData.value} onClose$={handleClose} class="h-full" />
    </div>
  );
});
