import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { IconWrapper } from "~/components/ui/IconWrapper";
import { SearchIcon } from "~/components/icons/SearchIcon";

export default component$(() => {
  return (
    <>
      <div class="flex items-center justify-between p-4 bg-fresh-eggplant-100 rounded-b-lg border-b-2 border-black">
        <h1 class="text-xl font-bold">Hello, Bijit</h1>
        <IconWrapper class="w-8 h-8">
          <SearchIcon class="w-5 h-5 text-black" />
        </IconWrapper>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
