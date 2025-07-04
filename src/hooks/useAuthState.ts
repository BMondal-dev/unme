// src/hooks/useAuthState.ts
import { useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { auth } from '~/firebase';
import { User } from 'firebase/auth';

export function useAuthState() {
  const user = useSignal<User | null>(null);
  const authReady = useSignal(false);
  const isLoading = useSignal(true);
  const error = useSignal<Error | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    console.log('Setting up auth state listener');
    
    if (typeof window === 'undefined') {
      console.log('Running on server, auth state not available');
      authReady.value = true;
      isLoading.value = false;
      return;
    }
    
    const unsubscribe = auth.onAuthStateChanged(
      (authUser: User | null) => {
        console.log('Auth state changed:', authUser ? 'User authenticated' : 'No user');
        user.value = authUser;
        authReady.value = true;
        isLoading.value = false;
      },
      (err: Error) => {
        console.error('Auth state error:', err);
        error.value = err;
        authReady.value = true;
        isLoading.value = false;
      }
    );

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  });

  return {
    user,
    authReady,
    isLoading,
    error
  };
}