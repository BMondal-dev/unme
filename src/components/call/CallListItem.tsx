import { component$ } from "@builder.io/qwik";
import { IconWrapper } from "~/components/ui/IconWrapper";

type CallLog = {
  id: string;
  name: string;
  avatar: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration?: string;
  isVideo: boolean;
};

interface CallListItemProps {
  call: CallLog;
}

export const CallListItem = component$<CallListItemProps>(({ call }) => {
  return (
    <div class="flex cursor-pointer items-center justify-between border-b border-black p-4 transition-colors hover:bg-fresh-eggplant-50">
      <div class="flex items-center space-x-3">
        <div class="relative">
          <img
            src={call.avatar}
            alt={call.name}
            width={48}
            height={48}
            class="h-12 w-12 rounded-full border-2 border-black"
          />
          {call.isVideo && (
            <div class="absolute -bottom-1 -right-1 rounded-full bg-red-500 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-semibold">{call.name}</span>
            {call.type === 'missed' && (
              <span class="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                Missed
              </span>
            )}
          </div>
          <div class="mt-1 flex items-center space-x-2 text-sm text-gray-600">
            {call.type === 'incoming' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 3.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 10.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            )}
            {call.type === 'outgoing' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            )}
            {call.type === 'missed' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            )}
            <span>{call.time}</span>
            {call.duration && <span>• {call.duration}</span>}
          </div>
        </div>
      </div>
      <IconWrapper class="h-8 w-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
        </svg>
      </IconWrapper>
    </div>
  );
});
