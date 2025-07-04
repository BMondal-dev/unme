// src/types/chat.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  phoneNumber?: string | null;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  sender: Pick<User, "id" | "name" | "avatar">;
}

export interface ChatItem extends User {
  id: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  status?: string;
  lastSeen?: string;
  messages?: Message[];
  phoneNumber?: string | null;
}

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  user: User;
}
