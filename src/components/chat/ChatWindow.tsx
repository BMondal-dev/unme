import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { ChatFooter } from "./ChatFooter";
import type { ChatItem, Message } from "../../types/chat";

interface ChatWindowProps {
  chat: ChatItem;
  onClose$: QRL<() => void>;
  class?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

export const ChatWindow = component$<ChatWindowProps>(
  ({ chat, onClose$, class: className = "" }) => {
    const messages = useSignal<Message[]>([]);
    const currentUser: User = {
      id: "current-user",
      name: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    };

    // Mock messages for demonstration
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      messages.value = [
        {
          id: "1",
          content: "Hey there! 👋",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          isRead: true,
          sender: {
            id: chat.id,
            name: chat.name,
            avatar: chat.avatar,
          },
        },
        {
          id: "2",
          content: "Hi! How are you doing?",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true,
          sender: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
          },
        },
        {
          id: "3",
          content:
            "I'm doing great! Just finished that project we were working on.",
          timestamp: new Date().toISOString(),
          isRead: true,
          sender: {
            id: chat.id,
            name: chat.name,
            avatar: chat.avatar,
          },
        },
      ];
    });

    const handleSendMessage = $((message: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        timestamp: new Date().toISOString(),
        isRead: false,
        sender: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
      };
      messages.value = [...messages.value, newMessage];
    });

    const handleCall = $(() => {
      console.log("Voice call requested");
      // Implement call functionality
    });

    const handleVideoCall = $(() => {
      console.log("Video call requested");
      // Implement video call functionality
    });

    const handleViewProfile = $(() => {
      console.log("View profile", chat.id);
      // Implement view profile functionality
    });

    return (
      <div class={`flex h-screen flex-col ${className}`}>
        <div class="border-b-2 border-black bg-white">
          <ChatHeader
            user={chat}
            onBack$={onClose$}
            onCall$={handleCall}
            onVideoCall$={handleVideoCall}
            onViewProfile$={handleViewProfile}
          />
        </div>

        <div class="bg-opacity-30 flex-1 space-y-2 overflow-y-auto bg-[#e5ddd5] p-4">
          {messages.value.map((message, index) => {
            const isCurrentUser = message.sender.id === currentUser.id;
            const showAvatar =
              index === 0 ||
              messages.value[index - 1]?.sender.id !== message.sender.id;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser}
                showAvatar={showAvatar}
                user={message.sender}
              />
            );
          })}
        </div>

        <ChatFooter onSendMessage$={handleSendMessage} />
      </div>
    );
  },
);
