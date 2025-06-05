import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { MovieIcon } from "~/components/icons/MovieIcon";
import { ProfileIcon } from "~/components/icons/ProfileIcon";
import { CallIcon } from "~/components/icons/CallIcon";
import { ChatIcon } from "~/components/icons/ChatIcon";

interface NavItem {
  name: string;
  path: string;
  icon: any;
}

export default component$(() => {
  const location = useLocation();
  const currentPath = location.url.pathname;

  const navItems: NavItem[] = [
    { name: 'Chat', path: '/', icon: ChatIcon },
    { name: 'Movies', path: '/movies', icon: MovieIcon },
    { name: 'Call', path: '/call', icon: CallIcon },
    { name: 'Profile', path: '/profile', icon: ProfileIcon },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getButtonClasses = (active: boolean) => {
    const baseClasses = "flex flex-col items-center p-2 transition-all duration-100";
    const activeClasses = "relative after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-fresh-eggplant-600";
    const inactiveClasses = "opacity-70 hover:opacity-100";

    return `${baseClasses} ${active ? activeClasses : inactiveClasses}`;
  };

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="pb-16">
        <Slot />
      </div>

      <div class="fixed right-0 bottom-0 left-0 z-50 border-t-2 border-black bg-white">
        <div class="mx-auto max-w-[500px] bg-white">
          <nav class="flex items-center justify-around p-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                class={getButtonClasses(isActive(item.path))}
              >
                <item.icon class="mb-1 h-6 w-6" />
                <span class="text-xs">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
});
