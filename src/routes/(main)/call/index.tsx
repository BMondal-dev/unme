import { component$ } from "@builder.io/qwik";
import { useNotification } from "~/components/ui/Notification";
import type { DocumentHead } from "@builder.io/qwik-city";
import { NewCallButton } from "~/components/ui/NewCallButton";
import { PhoneIcon } from "~/components/icons/PhoneIcon";
import { CallListItem } from "~/components/call/CallListItem";
import type { CallLog } from "~/types/call";
import { IconWrapper } from "~/components/ui/IconWrapper";
import { SearchIcon } from "~/components/icons/SearchIcon";

// Mock call logs data
const callLogs: CallLog[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    time: "10:30 AM",
    type: "incoming",
    duration: "2:30",
    isVideo: false,
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    time: "Yesterday",
    type: "outgoing",
    duration: "5:12",
    isVideo: true,
  },
  {
    id: "3",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=4",
    time: "Yesterday",
    type: "missed",
    isVideo: false,
  },
  {
    id: "4",
    name: "Team Standup",
    avatar: "https://i.pravatar.cc/150?img=3",
    time: "6/3/23",
    type: "outgoing",
    duration: "15:45",
    isVideo: true,
  },
  {
    id: "5",
    name: "Sarah Wilson",
    avatar: "https://i.pravatar.cc/150?img=5",
    time: "6/2/23",
    type: "incoming",
    duration: "1:22",
    isVideo: false,
  },
];

export default component$(() => {
  const { show } = useNotification();
  return (
    <div class="flex h-full flex-col">
      <div class="sticky top-0 z-10 border-b-2 border-black bg-white p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Calls</h1>
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

      <div class="h-full">
        {callLogs.map((call) => (
          <CallListItem key={call.id} call={call} />
        ))}
      </div>

      <div class="fixed right-0 bottom-20 left-0 z-10 mx-auto w-full max-w-[500px] px-4">
        <div class="rounded-lg bg-white p-1 shadow-lg">
          <NewCallButton
            onClick$={() => show("New call feature coming soon!", "info")}
          >
            <PhoneIcon class="h-6 w-6" />
            <span>New Call</span>
          </NewCallButton>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Calls | Unme",
  meta: [
    {
      name: "description",
      content: "View your call history and make new calls on Unme",
    },
  ],
};
