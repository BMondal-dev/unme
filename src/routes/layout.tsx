import { component$, Slot, useVisibleTask$ } from "@builder.io/qwik";
import { NotificationProvider } from "~/components/ui/Notification";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { auth } from "~/firebase";
import type { User } from "firebase/auth";

// Main layout component
export default component$(() => {
  const loc = useLocation();
  const nav = useNavigate();

  useVisibleTask$(() => {
    if (typeof window === "undefined" || !auth) return;
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      const isAuthRoute = loc.url.pathname.startsWith("/auth");
      if (!user && !isAuthRoute) {
        nav("/auth", { replaceState: true });
      } else if (user && isAuthRoute) {
        // Only redirect if profile is complete
        const profileCompleted = await (async () => {
          try {
            const { getDoc, doc } = await import('firebase/firestore');
            const { db } = await import('~/firebase');
            const profileSnap = await getDoc(doc(db, 'users', user.uid));
            return profileSnap.exists() && !!profileSnap.data().username;
          } catch {
            return false;
          }
        })();
        if (profileCompleted) nav("/", { replaceState: true });
      }
    });
    return () => unsubscribe();
  });

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
