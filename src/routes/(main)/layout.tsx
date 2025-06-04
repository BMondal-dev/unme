import { $, component$, Slot, useSignal } from "@builder.io/qwik";
import { MovieIcon } from "~/components/icons/MovieIcon";
import { ProfileIcon } from "~/components/icons/ProfileIcon";
import { CallIcon } from "~/components/icons/CallIcon";
import { ChatIcon } from "~/components/icons/ChatIcon";

export default component$(() => {
  const activeTab = useSignal<string>("chat");

  const handleClick = $((tab: string) => {
    activeTab.value = tab;
  });

  const getButtonClasses = (tab: string) => {
    const baseClasses =
      "flex flex-col items-center p-2 transition-all duration-100";
    const activeClasses =
      "relative after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-fresh-eggplant-600";
    const inactiveClasses = "opacity-70 hover:opacity-100";

    return `${baseClasses} ${activeTab.value === tab ? activeClasses : inactiveClasses}`;
  };

  return (
    <div>
      <div>
        <Slot />

        <div class="fixed right-0 bottom-0 left-0 border-2 border-black bg-white">
          <div class="mx-auto max-w-[500px] bg-white">
            <nav class="flex items-center justify-around p-2">
              <button
                onClick$={() => handleClick("chat")}
                class={getButtonClasses("chat")}
              >
                <ChatIcon class="mb-1 h-6 w-6" />
                <span class="text-xs">Chat</span>
              </button>
              <button
                onClick$={() => handleClick("movies")}
                class={getButtonClasses("movies")}
              >
                <MovieIcon class="mb-1 h-6 w-6" />
                <span class="text-xs">Movies</span>
              </button>
              <button
                onClick$={() => handleClick("call")}
                class={getButtonClasses("call")}
              >
                <CallIcon class="mb-1 h-6 w-6" />
                <span class="text-xs">Call</span>
              </button>
              <button
                onClick$={() => handleClick("profile")}
                class={getButtonClasses("profile")}
              >
                <ProfileIcon class="mb-1 h-6 w-6" />
                <span class="text-xs">Profile</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
});
