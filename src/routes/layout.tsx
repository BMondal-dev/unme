import { component$, Slot } from "@builder.io/qwik";
import { NotificationProvider } from "~/components/ui/Notification";

// Main layout component
export default component$(() => {
  return (
    <NotificationProvider>
      <div class="flex min-h-screen flex-col">
        <div class="mx-auto flex w-full max-w-[500px] flex-1 flex-col border-x-2 border-black">
          <Slot />
        </div>
      </div>
    </NotificationProvider>
  );
});
