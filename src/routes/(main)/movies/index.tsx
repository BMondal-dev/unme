import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { IconWrapper } from "~/components/ui/IconWrapper";
import { QrCodeIcon } from "~/components/icons/QrCodeIcon";
import { SettingsIcon } from "~/components/icons/SettingsIcon";
import { MovieIcon } from "~/components/icons/MovieIcon";
import { useNotification } from "~/components/ui/Notification";
import { VideoIcon } from "~/components/icons/VideoIcon";
import { ShareIcon } from "~/components/icons/ShareIcon";

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

  const handleEndCall = $(() => {
    show("Ending the watch party...", 'info');
    selectedCall.value = null;
  });

  const handleJoinCall = $(() => {
    // In a real app, this would join an existing call
    show("Joining call...", 'info');
  });

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <div class="sticky top-0 z-10 border-b-2 border-black bg-white p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold sm:text-2xl">Movie History</h1>
          <div class="flex space-x-1 sm:space-x-2">
            <IconWrapper
              onClick$={() => show("Search coming soon!", "info")}
              class="h-9 w-9 cursor-pointer hover:bg-gray-100 sm:h-10 sm:w-10"
            >
              <QrCodeIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            </IconWrapper>
            <IconWrapper
              onClick$={() => show("Settings coming soon!", "info")}
              class="h-9 w-9 cursor-pointer hover:bg-gray-100 sm:h-10 sm:w-10"
            >
              <SettingsIcon class="h-4 w-4 sm:h-5 sm:w-5" />
            </IconWrapper>
          </div>
        </div>
      </div>

      {/* Movie Calls */}
      <div class="p-3 sm:p-4 md:p-6">
        <div class="mb-6">
          <div class="mb-4">
            <h2 class="text-lg font-bold sm:text-xl">Movie Watch Parties</h2>
            <p class="text-sm text-gray-600">Start or join a call to watch videos together</p>
          </div>
          <div class="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-3">
            <button
              onClick$={handleJoinCall}
              class="flex items-center justify-center rounded-lg border-2 border-black bg-white px-3 py-2 text-sm font-medium hover:bg-gray-100 sm:px-4 sm:py-2 sm:text-base"
            >
              <span class="truncate">Join Call</span>
            </button>
            <button
              onClick$={handleStartNewCall}
              class="flex items-center justify-center rounded-lg bg-fresh-eggplant-600 px-3 py-2 text-sm font-medium text-white hover:bg-fresh-eggplant-700 sm:px-4 sm:py-2 sm:text-base"
            >
              <VideoIcon class="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              <span class="truncate">New Party</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center py-12 text-center">
          <div class="mb-4 rounded-full bg-gray-200 p-4">
            <MovieIcon class="h-8 w-8 text-gray-500" />
          </div>
          <h2 class="mb-2 text-xl font-bold">Start a Watch Party</h2>
          <p class="mb-6 max-w-md text-gray-600">
            Watch videos together with friends in real-time with synchronized playback and voice chat.
          </p>
          <button 
            onClick$={handleStartNewCall}
            class="flex items-center rounded-lg bg-fresh-eggplant-600 px-6 py-2 font-medium text-white hover:bg-fresh-eggplant-700"
          >
            <VideoIcon class="mr-2 h-4 w-4" />
            Start a Watch Party
          </button>
        </div>
      </div>

      {/* Active Call Modal */}
      {selectedCall.value && (
        <div class="fixed inset-0 z-50 bg-black/80 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div class="w-full max-w-4xl rounded-xl bg-white p-4 sm:p-6 my-4 sm:my-8">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-xl font-bold">
                {selectedCall.value.videoPath ? 'Video Call' : 'Voice Call'}
              </h3>
              <button
                onClick$={$(() => { selectedCall.value = null })}
                class="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div class="aspect-video w-full bg-black rounded-lg overflow-hidden">
              {/* Video player would go here */}
              <div class="flex h-full items-center justify-center text-white p-4">
                <div class="text-center">
                  <p class="text-sm sm:text-base">Select a video file to start watching with friends</p>
                  <p class="mt-1 text-xs text-gray-400 sm:text-sm">WebRTC sync and voice chat will be active</p>
                  <button 
                    onClick$={() => show("File picker would open here to select a video", 'info')}
                    class="mt-3 sm:mt-4 inline-flex items-center rounded-lg bg-fresh-eggplant-600 px-3 py-1.5 text-sm text-white hover:bg-fresh-eggplant-700 sm:px-4 sm:py-2 sm:text-base"
                  >
                    <VideoIcon class="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                    Select Video
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <button
                onClick$={handleEndCall}
                class="rounded-lg border-2 border-red-500 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 sm:px-4 sm:py-2 sm:text-base"
              >
                End Call
              </button>
              <div class="flex justify-end space-x-2">
                <button
                  onClick$={() => show("Copy invite link to clipboard", 'info')}
                  class="flex items-center rounded-lg border-2 border-black bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-100 sm:px-4 sm:py-2 sm:text-base"
                >
                  <ShareIcon class="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                  <span class="hidden sm:inline">Invite Friends</span>
                  <span class="sm:hidden">Invite</span>
                </button>
              </div>
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
