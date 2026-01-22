import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

type AnyFn = (...args: any[]) => any;

export function useProtectedAction<T extends AnyFn>(action: T, mode: "login" | "register" = "login") {
  const { isAuthenticated, requireAuth } = useAuth();

  return useCallback(
    (...args: Parameters<T>) => {
      if (isAuthenticated) {
        return action(...args);
      }
      requireAuth(() => action(...args), mode);
      return undefined as ReturnType<T>;
    },
    [action, isAuthenticated, mode, requireAuth],
  );
}

