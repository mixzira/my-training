import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "hero-display",
            "display-lg",
            "display-md",
            "lead",
            "lead-airy",
            "tagline",
            "body-strong",
            "body",
            "dense-link",
            "caption",
            "caption-strong",
            "button-large",
            "button-utility",
            "fine-print",
            "micro-legal",
            "nav-link",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
