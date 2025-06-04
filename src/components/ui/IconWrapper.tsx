import { component$, Slot } from '@builder.io/qwik';

interface IconWrapperProps {
  class?: string;
  [key: string]: any;
}

export const IconWrapper = component$<IconWrapperProps>(({ class: className, ...props }) => {
  return (
    <div class={['relative group', className]} {...props}>
      <div class="absolute inset-0 bg-fresh-eggplant-400 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200" />
      <div class="relative flex items-center justify-center w-full h-full">
        <Slot />
      </div>
    </div>
  );
});
