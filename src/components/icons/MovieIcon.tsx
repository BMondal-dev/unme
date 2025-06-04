import { component$ } from "@builder.io/qwik";

interface MovieIconProps {
  class?: string;
  size?: number | string;
  [key: string]: any;
}

export const MovieIcon = component$<MovieIconProps>(
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
        <g clip-path="url(#clip0_4418_9194)">
          <path
            d="M19.0701 19.0697C22.9801 15.1597 22.9801 8.82969 19.0701 4.92969"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4.93006 4.92969C1.02006 8.83969 1.02006 15.1697 4.93006 19.0697"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.69995 21.4102C9.76995 21.7802 10.8799 21.9602 11.9999 21.9602C13.1199 21.9502 14.2299 21.7802 15.2999 21.4102"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.69995 2.59009C9.76995 2.22009 10.8799 2.04004 11.9999 2.04004C13.1199 2.04004 14.2299 2.22009 15.2999 2.59009"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.73999 12.0001V10.3302C8.73999 8.25016 10.21 7.40014 12.01 8.44014L13.46 9.28017L14.91 10.1201C16.71 11.1601 16.71 12.8602 14.91 13.9002L13.46 14.7401L12.01 15.5802C10.21 16.6202 8.73999 15.7701 8.73999 13.6901V12.0001Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_4418_9194">
            <rect width="24" height="24" fill="currentColor" />
          </clipPath>
        </defs>
      </svg>
    );
  },
);
