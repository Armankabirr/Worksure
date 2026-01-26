import { type ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";

type SessionState = "checking" | "active" | "missing";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: UserRole;
}

const loadingEl = (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { authStatus } = useAuth();
  const location = useLocation();
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const [user, setLocalUser] = useState<{ role: UserRole } | null>(null);

  useEffect(() => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setLocalUser(JSON.parse(storedUser));
        } else {
          setLocalUser(null);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setLocalUser(null);
      }
    }, []);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSessionState(data.session ? "active" : "missing");
      } catch {
        if (isMounted) setSessionState("missing");
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (authStatus === "authenticated") setSessionState("active");
    if (authStatus === "unauthenticated") setSessionState("missing");
  }, [authStatus]);

  const isChecking = authStatus === "loading" || sessionState === "checking";
  const noSession = authStatus === "unauthenticated" || sessionState === "missing";
  const roleMismatch = role && user?.role !== role;

  if (isChecking) {
    return loadingEl;
  }

  if (noSession) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (roleMismatch) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
