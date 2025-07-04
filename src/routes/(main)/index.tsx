import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ChatList } from "~/components/chat/ChatList";
import { SearchIcon } from "~/components/icons/SearchIcon";
import { IconWrapper } from "~/components/ui/IconWrapper";
import { useNotification } from "~/components/ui/Notification";
import { NewCallButton } from "~/components/ui/NewCallButton";
import { ChatIcon } from "~/components/icons/ChatIcon";
import { $, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  useNotification();
  const nav = useNavigate();
  const searchQuery = useSignal("");
  const isSearching = useSignal(false);
  
  const handleNewChat = $(() => {
    nav("/new-chat");
  });
  
  const handleSearch = $(() => {
    isSearching.value = !isSearching.value;
    if (!isSearching.value) {
      searchQuery.value = "";
    }
  });

  return (
    <div class="flex h-full flex-col">
      <div class="sticky top-0 z-10 border-b-2 border-black bg-white p-4">
        <div class="flex items-center justify-between">
          {!isSearching.value ? (
            <>
              <h1 class="text-2xl font-bold">Chat</h1>
              <div class="flex space-x-2">
                <IconWrapper
                  onClick$={handleSearch}
                  class="h-10 w-10 cursor-pointer hover:bg-gray-100"
                >
                  <SearchIcon class="h-6 w-6" />
                </IconWrapper>
              </div>
            </>
          ) : (
            <div class="flex w-full items-center gap-2">
              <button 
                onClick$={handleSearch}
                class="text-gray-500"
              >
                <span class="text-xl">&larr;</span>
              </button>
              <input
                type="text"
                placeholder="Search for contacts..."
                value={searchQuery.value}
                onInput$={(e) => (searchQuery.value = (e.target as HTMLInputElement).value)}
                class="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      <div class="h-full">
        <ChatList searchQuery={searchQuery.value} class="h-full" />
      </div>

      <div class="fixed right-0 bottom-20 left-0 z-10 mx-auto w-full max-w-[500px] px-4">
        <div class="rounded-lg bg-white p-1 shadow-lg">
          <NewCallButton
            onClick$={handleNewChat}
          >
            <ChatIcon class="h-6 w-6" />
            <span>New Chat</span>
          </NewCallButton>
        </div>
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