import { component$, Slot, useTask$ } from "@builder.io/qwik";
import { NotificationProvider } from "~/components/ui/Notification";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { useAuthState } from "~/hooks/useAuthState";

// Main layout component
export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();
  const { user, isLoading } = useAuthState();

  useTask$(({ track }) => {
    track(() => user.value);
    track(() => isLoading.value);

    if (isLoading.value) {
      return; // Wait for auth state to be determined
    }

    const isAuthRoute = loc.url.pathname.startsWith("/auth");

    if (!user.value && !isAuthRoute) {
      nav("/auth", { replaceState: true });
    } else if (user.value && isAuthRoute) {
      nav("/", { replaceState: true });
    }
  });

  return (
    <NotificationProvider>
      {isLoading.value ? (
        <div class="flex h-screen items-center justify-center">
          <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
        </div>
      ) : (
        <div class="flex min-h-screen flex-col">
          <div class="mx-auto flex w-full max-w-[500px] flex-1 flex-col border-x-2 border-black">
            <Slot />
          </div>
        </div>
      )}
    </NotificationProvider>
  );
});
