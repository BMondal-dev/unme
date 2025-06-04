import {
  component$,
  type QRL,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { ChatItem } from "../../types/chat";

// Marquee text component for the status/last seen text
const MarqueeText = component$<{ text: string; isOnline: boolean }>(
  ({ text, isOnline }) => {
    const containerRef = useSignal<HTMLDivElement>();
    const textRef = useSignal<HTMLDivElement>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      track(() => text);

      const container = containerRef.value;
      const textEl = textRef.value;
      if (!container || !textEl) return;

      const containerWidth = container.offsetWidth;
      const textWidth = textEl.scrollWidth;

      if (textWidth > containerWidth) {
        textEl.style.animation = `marquee ${Math.max(3, text.length / 10)}s linear infinite`;
      } else {
        textEl.style.animation = "none";
      }
    });

    return (
      <div class="relative w-full overflow-hidden">
        <div ref={containerRef} class="relative w-full overflow-hidden">
          <div
            ref={textRef}
            class="inline-block px-1 text-xs whitespace-nowrap text-gray-600"
            style={{ animationPlayState: "running" }}
          >
            {isOnline ? "Online" : text || "Offline"}
          </div>
        </div>
      </div>
    );
  },
);

interface ChatHeaderPropsInternal {
  user: ChatItem;
  onBack$: QRL<() => void>;
  onCall$: QRL<() => void>;
  onVideoCall$: QRL<() => void>;
  onViewProfile$: QRL<() => void>;
}

export const ChatHeader = component$<ChatHeaderPropsInternal>(
  ({ user, onBack$, onCall$, onVideoCall$, onViewProfile$ }) => {
    return (
      <div class="flex items-center justify-between border-b-2 border-black bg-white p-2 sm:p-3">
        {/* Left side - Back button and user info */}
        <div class="flex min-w-0 flex-1 items-center">
          <button
            onClick$={onBack$}
            class="hover:bg-fresh-eggplant-50 mr-2 flex-shrink-0 rounded-lg border-2 border-black p-2 transition-colors active:translate-y-0.5 sm:mr-3"
            aria-label="Back to chat list"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <div
            class="flex min-w-0 cursor-pointer items-center"
            onClick$={onViewProfile$}
          >
            <div class="relative mr-2 flex-shrink-0 sm:mr-3">
              <img
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                class="h-9 w-9 rounded-full border-2 border-black sm:h-10 sm:w-10"
              />
              {user.isOnline && (
                <div class="absolute right-[-2px] bottom-[-2px] h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
              )}
            </div>
            <div class="min-w-0">
              <h2
                class="max-w-[120px] truncate text-sm font-bold sm:max-w-[180px] sm:text-base"
                title={user.name}
              >
                {user.name}
              </h2>
              <MarqueeText
                text={user.lastSeen || user.status || "Offline"}
                isOnline={user.isOnline}
              />
            </div>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div class="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick$={onVideoCall$}
            class="hover:bg-fresh-eggplant-50 rounded-lg border-2 border-black p-1.5 transition-colors active:translate-y-0.5 sm:p-2"
            aria-label="Video call"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              <path d="M14 6v8a4 4 0 004 4h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a4 4 0 00-4 4z" />
            </svg>
          </button>

          <button
            onClick$={onCall$}
            class="hover:bg-fresh-eggplant-50 rounded-lg border-2 border-black p-1.5 transition-colors active:translate-y-0.5 sm:p-2"
            aria-label="Voice call"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>

          <div class="relative">
            <button
              class="hover:bg-fresh-eggplant-50 rounded-lg border-2 border-black p-1.5 transition-colors active:translate-y-0.5 sm:p-2"
              aria-label="More options"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
        <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      </div>
    );
  },
);
