import { component$, useSignal, $, type QRL } from "@builder.io/qwik";
import { SendIcon } from "../icons/SendIcon";
import { IconWrapper } from "../ui/IconWrapper";

interface ChatFooterPropsInternal {
  onSendMessage$: QRL<(message: string) => void>;
  className?: string;
}

export const ChatFooter = component$<ChatFooterPropsInternal>(
  ({ onSendMessage$, className = "" }) => {
    const messageInput = useSignal("");

    const handleSubmit = $(() => {
      const message = messageInput.value.trim();
      if (message) {
        onSendMessage$(message);
        messageInput.value = "";
      }
    });

    const handleKeyDown = $((e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    });

    return (
      <div class={`border-t-2 border-black bg-white p-4 ${className}`}>
        <div class="flex items-center space-x-2">
          <button
            class="hover:bg-fresh-eggplant-50 rounded-lg border-2 border-black p-2 transition-colors active:translate-y-0.5"
            aria-label="Add attachment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 17a1 1 0 01-1-1v-5h2v4h14V6H4v4H2V4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2v-3H0v3a4 4 0 004 4h12a4 4 0 004-4V4a4 4 0 00-4-4H4a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4v-3h-2v3a2 2 0 01-2 2H4a2 2 0 01-2-2z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <div class="relative flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              class="focus:ring-fresh-eggplant-500 w-full rounded-xl border-2 border-black p-3 pr-12 focus:border-transparent focus:ring-2 focus:outline-none"
              bind:value={messageInput}
              onKeyDown$={handleKeyDown}
            />
            <button
              class="hover:text-fresh-eggplant-600 absolute top-1/2 right-2 -translate-y-1/2 transform p-1 text-gray-500"
              onClick$={() => (messageInput.value += "😊")}
              type="button"
              aria-label="Add emoji"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>

          <button
            onClick$={handleSubmit}
            class="ml-2"
            aria-label="Send message"
          >
            <IconWrapper class="h-10 w-10">
              <SendIcon class="h-7 w-7" />
            </IconWrapper>
          </button>
        </div>
      </div>
    );
  },
);
