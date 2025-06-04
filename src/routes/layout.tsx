import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <div class="mx-auto min-h-screen w-full max-w-[500px] border-2 border-black">
        <Slot />
      </div>
    </>
  );
});
