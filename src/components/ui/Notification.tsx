import { component$, createContextId, useContext, useContextProvider, useStore, $, type QRL, Slot } from "@builder.io/qwik";

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

export interface NotificationState {
  notifications: Notification[];
  show: QRL<(message: string, type?: NotificationType, duration?: number) => Promise<string>>;
  remove: QRL<(id: string) => Promise<void>>;
}

// Create a context ID
export const NotificationContext = createContextId<NotificationState>('notification-context');

// Create a provider component
export const NotificationProvider = component$(() => {
  const state = useStore<{ notifications: Notification[] }>({
    notifications: [],
  });

  // Show notification function
  const show = $(async (message: string, type: NotificationType = 'info', duration: number = 3000): Promise<string> => {
    const id = Math.random().toString(36).substring(2, 9);
    const notification: Notification = { id, message, type, duration };
    
    // Add to notifications
    state.notifications = [...state.notifications, notification];
    
    // Auto remove after duration if duration is positive
    if (duration > 0) {
      setTimeout(() => {
        state.notifications = state.notifications.filter(n => n.id !== id);
      }, duration);
    }
    
    return id;
  });

  // Remove notification function
  const remove = $(async (id: string): Promise<void> => {
    state.notifications = state.notifications.filter(n => n.id !== id);
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
      <div class="fixed top-4 right-4 z-50 space-y-2">
        {state.notifications.map((notification) => (
          <div 
            key={notification.id} 
            class={`p-4 rounded-lg shadow-md ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 
              notification.type === 'error' ? 'bg-red-100 text-red-800' :
              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            <div class="flex justify-between items-center">
              <span>{notification.message}</span>
              <button 
                onClick$={() => remove(notification.id)}
                class="ml-4 text-gray-500 hover:text-gray-700"
              >
                ✕
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
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Helper function to show a notification
export const showNotification = (
  message: string,
  type: NotificationType = 'info',
  duration: number = 3000,
): string | undefined => {
  if (typeof window === 'undefined') return;
  
  const id = Math.random().toString(36).substring(2, 9);
  const event = new CustomEvent('show-notification', {
    detail: { id, message, type, duration },
  });
  window.dispatchEvent(event);
  
  return id;
};

// Helper function to remove a notification
export const removeNotification = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent('remove-notification', {
    detail: { id },
  });
  window.dispatchEvent(event);
};
