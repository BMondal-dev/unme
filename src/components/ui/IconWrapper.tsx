import { component$, Slot } from "@builder.io/qwik";

interface IconWrapperProps {
  class?: string;
  [key: string]: any;
}

export const IconWrapper = component$<IconWrapperProps>(
  ({ class: className, ...props }) => {
    return (
      <div class={["group relative cursor-pointer", className]} {...props}>
        <div class="bg-fresh-eggplant-400 absolute inset-0 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]" />
        <div class="relative flex h-full w-full items-center justify-center">
          <Slot />
        </div>
      </div>
    );
  },
);
