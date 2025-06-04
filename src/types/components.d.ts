import type { JSXChildren } from "@builder.io/qwik";

declare module "@builder.io/qwik" {
  interface ComponentBaseProps {
    class?: string;
    children?: JSXChildren;
  }
}
