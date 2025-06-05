import {
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useStore,
  $,
  type QRL,
  Slot,
} from "@builder.io/qwik";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

export interface NotificationState {
  notifications: Notification[];
  show: QRL<
    (
      message: string,
      type?: NotificationType,
      duration?: number,
    ) => Promise<string>
  >;
  remove: QRL<(id: string) => Promise<void>>;
}

// Create a context ID
export const NotificationContext = createContextId<NotificationState>(
  "notification-context",
);

// Create a provider component
export const NotificationProvider = component$(() => {
  const state = useStore<{ notifications: Notification[] }>({
    notifications: [],
  });

  // Show notification function
  const show = $(
    async (
      message: string,
      type: NotificationType = "info",
      duration: number = 3000,
    ): Promise<string> => {
      const id = Math.random().toString(36).substring(2, 9);
      const notification: Notification = { id, message, type, duration };

      // Add to notifications
      state.notifications = [...state.notifications, notification];

      // Auto remove after duration if duration is positive
      if (duration > 0) {
        setTimeout(() => {
          state.notifications = state.notifications.filter((n) => n.id !== id);
        }, duration);
      }

      return id;
    },
  );

  // Remove notification function
  const remove = $(async (id: string): Promise<void> => {
    state.notifications = state.notifications.filter((n) => n.id !== id);
  });

  // Create the store object
  const store: NotificationState = {
    get notifications() {
      return state.notifications;
    },
    show,
    remove,
  };

  // Provide the context
  useContextProvider(NotificationContext, store);

  // Return the notifications container and children
  return (
    <>
      <div class="fixed top-4 right-4 z-500 w-80 space-y-3">
        {state.notifications.map((notification) => (
          <div
            key={notification.id}
            class={`border-2 border-black p-4 shadow-[4px_4px_0_0_#000] transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] ${
              notification.type === "success"
                ? "bg-green-300"
                : notification.type === "error"
                  ? "bg-red-300"
                  : notification.type === "warning"
                    ? "bg-yellow-300"
                    : "bg-white"
            }`}
          >
            <div class="flex items-start">
              {/* Icon based on notification type */}
              <div class="mt-0.5 mr-3 flex-shrink-0">
                {notification.type === "success" && (
                  <div class="h-5 w-5 text-black">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="square"
                        stroke-linejoin="miter"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
                {notification.type === "error" && (
                  <div class="h-5 w-5 text-black">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="square"
                        stroke-linejoin="miter"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
                {notification.type === "warning" && (
                  <div class="h-5 w-5 text-black">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="square"
                        stroke-linejoin="miter"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                )}
                {notification.type === "info" && (
                  <div class="h-5 w-5 text-black">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="square"
                        stroke-linejoin="miter"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div class="flex-1">
                <p class="text-sm font-bold">{notification.message}</p>
              </div>

              <button
                onClick$={() => remove(notification.id)}
                class="-mt-1 -mr-1 ml-2 border-2 border-black p-1 transition-colors hover:bg-black hover:text-white"
                aria-label="Dismiss"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="square"
                    stroke-linejoin="miter"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <Slot />
    </>
  );
});

// Create a hook to use the notification context
export const useNotification = (): NotificationState => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

// Helper function to show a notification
export const showNotification = (
  message: string,
  type: NotificationType = "info",
  duration: number = 3000,
): string | undefined => {
  if (typeof window === "undefined") return;

  const id = Math.random().toString(36).substring(2, 9);
  const event = new CustomEvent("show-notification", {
    detail: { id, message, type, duration },
  });
  window.dispatchEvent(event);

  return id;
};

// Helper function to remove a notification
export const removeNotification = (id: string): void => {
  if (typeof window === "undefined") return;

  const event = new CustomEvent("remove-notification", {
    detail: { id },
  });
  window.dispatchEvent(event);
};
