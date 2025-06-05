import { component$, Slot } from "@builder.io/qwik";

import type { QRL } from '@builder.io/qwik';

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
          "group relative flex w-full items-center cursor-pointer justify-center space-x-2 rounded-lg border-2 border-black bg-fresh-eggplant-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          className,
        ]}
        {...props}
      >
        <div class="absolute inset-0 rounded-md bg-fresh-eggplant-600 transition-all duration-200 group-hover:bg-fresh-eggplant-700" />
        <div class="relative flex items-center space-x-2">
          <Slot />
        </div>
      </button>
    );
  },
);
