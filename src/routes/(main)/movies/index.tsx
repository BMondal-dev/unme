import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { IconWrapper } from "~/components/ui/IconWrapper";
import { MovieIcon } from "~/components/icons/MovieIcon";
import { useNotification } from "~/components/ui/Notification";
import { VideoIcon } from "~/components/icons/VideoIcon";
import { SearchIcon } from "~/components/icons/SearchIcon";
import { NewCallButton } from "~/components/ui/NewCallButton";

type MovieCall = {
  id: string;
  participants: string[];
  startedAt: string;
  duration: string; // in minutes
  videoPath?: string; // Only present if a video was played
};

export default component$(() => {
  const { show } = useNotification();
  const selectedCall = useSignal<MovieCall | null>(null);
  // No recent calls data needed as we're removing that section

  // Formatting functions kept in case they're needed for future features

  const handleStartNewCall = $(() => {
    // In a real app, this would initiate a new WebRTC call
    show("Starting a new watch party...", 'info');
    // In a real app, this would navigate to the call screen
    selectedCall.value = {
      id: 'new-call-' + Date.now(),
      participants: ['You'],
      startedAt: new Date().toISOString(),
      duration: '0',
      videoPath: ''
    };
  });

  const handleJoinCall = $(() => {
    // In a real app, this would open a dialog to enter a call ID or show available calls
    show("Joining call...", 'info');
  });

  return (
    <div class="flex h-full flex-col">
      {/* Header */}
      <div class="sticky top-0 z-10 border-b-2 border-black bg-white p-4">
              <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold">Movies</h1>
                <div class="flex space-x-2">
                  <IconWrapper
                    onClick$={() => show("Searching coming soon!", "info")}
                    class="h-10 w-10 cursor-pointer hover:bg-gray-100"
                  >
                    <SearchIcon class="h-6 w-6" />
                  </IconWrapper>
                </div>
              </div>
            </div>

      {/* Main Content */}
      <div class="flex-1 p-4 sm:p-6">
        <div class="mb-8">
          <h2 class="mb-2 text-2xl font-bold">Watch Parties</h2>
          <p class="mb-6 text-gray-600">Start or join a call to watch videos together</p>
          
          <div class="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-8 text-center">
            <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <MovieIcon class="h-8 w-8 text-gray-500" />
            </div>
            <h2 class="mb-3 text-xl font-semibold">Start a Watch Party</h2>
            <p class="mb-6 max-w-md text-gray-600">
              Watch videos together with friends in real-time with synchronized playback and voice chat.
            </p>
            <div class="flex w-full max-w-xs flex-col space-y-4">
              <NewCallButton onClick$={handleStartNewCall} class="w-full">
                <VideoIcon class="mr-2 h-5 w-5" />
                New Watch Party
              </NewCallButton>
              <button 
                onClick$={handleJoinCall}
                class="w-full rounded-lg border-2 border-black bg-white px-4 py-3 font-medium hover:bg-gray-50"
              >
                Join Existing Call
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Call Modal */}
      {selectedCall.value && (
        <div class="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 sm:items-center">
          <div class="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div class="mb-6 flex items-center justify-between">
              <h3 class="text-xl font-semibold">
                {selectedCall.value.videoPath ? 'Video Call' : 'Voice Call'}
              </h3>
              <button
                onClick$={$(() => { selectedCall.value = null })}
                class="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="mb-6 aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
              <div class="flex h-full items-center justify-center p-4 text-white">
                <div class="text-center">
                  <p class="mb-2 text-lg font-medium">Select a video file to start watching with friends</p>
                  <p class="mb-4 text-sm text-gray-300">WebRTC sync and voice chat will be active</p>
                  <NewCallButton 
                    onClick$={() => show("File picker would open here to select a video", 'info')}
                    class="mx-auto max-w-xs"
                  >
                    <VideoIcon class="mr-2 h-5 w-5" />
                    Select Video
                  </NewCallButton>
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <NewCallButton onClick$={handleStartNewCall}>
                <VideoIcon class="mr-2 h-5 w-5" />
                New Watch Party
              </NewCallButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Movie History | Unme",
  meta: [
    {
      name: "description",
      content: "View your movie watching history on Unme",
    },
  ],
};
