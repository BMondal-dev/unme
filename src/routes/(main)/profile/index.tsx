import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { IconWrapper } from "~/components/ui/IconWrapper";
import { QrCodeIcon } from "~/components/icons/QrCodeIcon";
import { SettingsIcon } from "~/components/icons/SettingsIcon";
import { EditIcon } from "~/components/icons/EditIcon";
import { useNotification } from "~/components/ui/Notification";

export default component$(() => {
  const { show } = useNotification();
  const user = {
    name: "John Doe",
    username: "@johndoe",
    bio: "Digital designer & photographer. Love coffee and good vibes. ✨",
    phone: "+1 234 567 890",
    avatar: "https://i.pravatar.cc/150?img=1",
  };

  const stats = [
    { label: "Posts", value: "1,234" },
    { label: "Followers", value: "5.6K" },
    { label: "Following", value: "342" },
  ];

  return (
    <div class="min-h-screen">
      {/* Header */}
      <div class="sticky top-0 z-10 border-b-2 border-black bg-white p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Profile</h1>
          <div class="flex space-x-2">
            <IconWrapper
              onClick$={() => show("QR Code scanner coming soon!", "info")}
              class="h-10 w-10 cursor-pointer hover:bg-gray-100"
            >
              <QrCodeIcon class="h-5 w-5" />
            </IconWrapper>
            <IconWrapper
              onClick$={() => show("Settings coming soon!", "info")}
              class="h-10 w-10 cursor-pointer hover:bg-gray-100"
            >
              <SettingsIcon class="h-5 w-5" />
            </IconWrapper>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div class="p-6">
        <div class="relative mb-6 flex items-end justify-between">
          <div class="flex items-end space-x-4">
            <div class="relative">
              <img
                src={user.avatar}
                alt={user.name}
                width={100}
                height={100}
                class="h-24 w-24 rounded-full border-2 border-black"
              />
              <button class="absolute -right-2 -bottom-2 rounded-full border-2 border-black bg-white p-1">
                <EditIcon class="h-4 w-4" />
              </button>
            </div>
            <div>
              <h2 class="text-2xl font-bold">{user.name}</h2>
              <p class="text-gray-600">{user.username}</p>
            </div>
          </div>
          <button class="bg-fresh-eggplant-600 rounded-lg border-2 border-black px-4 py-2 font-medium text-white">
            Edit Profile
          </button>
        </div>

        <p class="mb-6 text-gray-700">{user.bio}</p>

        {/* Stats */}
        <div class="mb-6 flex justify-between rounded-xl border-2 border-black bg-white p-4">
          {stats.map((stat, index) => (
            <div key={index} class="text-center">
              <div class="text-lg font-bold">{stat.value}</div>
              <div class="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div class="space-y-4">
          <div class="rounded-xl border-2 border-black bg-white p-4">
            <h3 class="mb-2 text-lg font-bold">Contact Information</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="w-24 text-gray-600">Phone:</span>
                <span>{user.phone}</span>
              </div>
              <div class="flex items-center">
                <span class="w-24 text-gray-600">Username:</span>
                <span>{user.username}</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl border-2 border-black bg-white p-4">
            <h3 class="mb-2 text-lg font-bold">Settings</h3>
            <div class="space-y-3">
              <button
                onClick$={() =>
                  show("Notifications feature coming soon!", "info")
                }
                class="flex w-full items-center justify-between rounded-lg border-2 border-black bg-white px-4 py-3 text-left hover:bg-gray-100"
              >
                <span>Notifications</span>
                <span>🔔</span>
              </button>
              <button
                onClick$={() =>
                  show("Privacy & Security settings coming soon!", "info")
                }
                class="flex w-full items-center justify-between rounded-lg border-2 border-black bg-white px-4 py-3 text-left hover:bg-gray-100"
              >
                <span>Privacy & Security</span>
                <span>🔒</span>
              </button>
              <button
                onClick$={() =>
                  show("Data & Storage settings coming soon!", "info")
                }
                class="flex w-full items-center justify-between rounded-lg border-2 border-black bg-white px-4 py-3 text-left hover:bg-gray-100"
              >
                <span>Data & Storage</span>
                <span>💾</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Profile | Unme",
  meta: [
    {
      name: "description",
      content: "View and edit your profile on Unme",
    },
  ],
};
