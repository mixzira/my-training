import { ViewTransition } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-back": "page-enter-back", default: "page-enter" }}
      exit={{ "nav-back": "page-exit-back", default: "page-exit" }}
    >
      {children}
    </ViewTransition>
  );
}
