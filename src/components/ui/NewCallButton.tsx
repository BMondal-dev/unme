import { component$, Slot } from "@builder.io/qwik";

import type { QRL } from "@builder.io/qwik";

interface NewCallButtonProps {
  class?: string;
  onClick$?: QRL<() => void>;
  [key: string]: any;
}

export const NewCallButton = component$<NewCallButtonProps>(
  ({ class: className, onClick$, ...props }) => {
    return (
      <button
        onClick$={onClick$}
        class={[
          "group bg-fresh-eggplant-600 relative flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg border-2 border-black px-6 py-3 font-medium text-white transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          className,
        ]}
        {...props}
      >
        <div class="bg-fresh-eggplant-600 group-hover:bg-fresh-eggplant-700 absolute inset-0 rounded-md transition-all duration-200" />
        <div class="relative flex items-center space-x-2">
          <Slot />
        </div>
      </button>
    );
  },
);
