"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type NavHistory = {
  getPreviousPath: () => string | null;
};

const NavHistoryContext = createContext<NavHistory | null>(null);

export function NavHistoryProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const stackRef = useRef<string[]>([]);

  useEffect(() => {
    const stack = stackRef.current;
    if (stack[stack.length - 1] === pathname) return;

    if (stack.length >= 2 && stack[stack.length - 2] === pathname) {
      stack.pop();
    } else {
      stack.push(pathname);
    }
  }, [pathname]);

  const getPreviousPath = useCallback(() => {
    const stack = stackRef.current;
    return stack.length >= 2 ? stack[stack.length - 2] : null;
  }, []);

  const value = useMemo(() => ({ getPreviousPath }), [getPreviousPath]);

  return (
    <NavHistoryContext.Provider value={value}>
      {children}
    </NavHistoryContext.Provider>
  );
}

export function useNavHistory() {
  const ctx = useContext(NavHistoryContext);
  if (!ctx) {
    throw new Error("useNavHistory precisa de NavHistoryProvider.");
  }
  return ctx;
}
