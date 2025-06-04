import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { IconWrapper } from "~/components/ui/IconWrapper";
import { SearchIcon } from "~/components/icons/SearchIcon";

export default component$(() => {
  return (
    <>
      <div class="bg-fresh-eggplant-100 flex items-center justify-between rounded-b-lg border-b-2 border-black p-4">
        <h1 class="text-xl font-bold">Hello, Bijit</h1>
        <IconWrapper class="h-8 w-8">
          <SearchIcon class="h-6 w-6" />
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
