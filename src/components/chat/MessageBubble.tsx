import { component$ } from "@builder.io/qwik";
import type { MessageBubbleProps } from "../../types/chat";

export const MessageBubble = component$<MessageBubbleProps>(
  ({ message, isCurrentUser, showAvatar, user }) => {
    const bubbleClasses = [
      "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
      "border-2 border-black",
      "relative",
      isCurrentUser ? "bg-fresh-eggplant-100 ml-auto" : "bg-white mr-auto",
      {
        "rounded-br-none": isCurrentUser,
        "rounded-bl-none": !isCurrentUser,
      },
    ];

    return (
      <div
        class={`mb-4 flex items-end ${isCurrentUser ? "justify-end" : "justify-start"}`}
      >
        {!isCurrentUser && showAvatar && (
          <div class="mr-2 flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              class="h-8 w-8 rounded-full border-2 border-black"
              width={32}
              height={32}
            />
          </div>
        )}

        <div class={bubbleClasses.join(" ")}>
          <p class="text-sm">{message.content}</p>
          <div
            class={`mt-1 flex items-center justify-end space-x-1 text-xs ${isCurrentUser ? "text-fresh-eggplant-800" : "text-gray-500"}`}
          >
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isCurrentUser && (
              <span>
                {message.isRead ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.2 2.8a1 1 0 0 1 1.4 0l5.5 5.5a1 1 0 0 1 0 1.4l-6.6 6.6a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 0 1 1.4-1.4l2.8 2.8 5.9-5.9a1 1 0 0 1 1.4 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.2 2.8a1 1 0 0 1 1.4 0l5.5 5.5a1 1 0 0 1 0 1.4l-6.6 6.6a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 0 1 1.4-1.4l2.8 2.8 5.9-5.9a1 1 0 0 1 1.4 0z" />
                  </svg>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);
