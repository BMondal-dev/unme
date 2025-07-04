import { component$ } from "@builder.io/qwik";

interface ProfileIconProps {
  class?: string;
  size?: number | string;
  [key: string]: any;
}

export const ProfileIcon = component$<ProfileIconProps>(
  ({ size = 34, class: className, ...props }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class={className}
        {...props}
      >
        <g clip-path="url(#clip0_3111_32653)">
          <path
            d="M15.68 3.96C16.16 4.67 16.44 5.52 16.44 6.44C16.43 8.84 14.54 10.79 12.16 10.87C12.06 10.86 11.94 10.86 11.83 10.87C9.61999 10.8 7.82999 9.11 7.58999 6.95C7.29999 4.38 9.40999 2 11.99 2"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.98999 14.56C4.56999 16.18 4.56999 18.82 6.98999 20.43C9.73999 22.27 14.25 22.27 17 20.43C19.42 18.81 19.42 16.17 17 14.56C14.27 12.73 9.75999 12.73 6.98999 14.56Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_3111_32653">
            <rect width="24" height="24" fill="currentColor" />
          </clipPath>
        </defs>
      </svg>
    );
  },
);
