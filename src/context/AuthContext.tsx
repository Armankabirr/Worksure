import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import useAxiosPublic from "@/hooks/useAxiosPublic";

export type UserRole = "client" | "worker" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  token: string | null;
  bio?: string;
  avatar?: string;
  address?: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  address?: string;
}

interface AuthContextValue {
  authStatus: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string) => Promise<{ error: Error | null }>;
  checkEmailVerified: () => Promise<{ verified: boolean; error: Error | null }>;
  resendVerificationEmail: () => Promise<{ error: Error | null }>;
  updateProfileWithDetails: (data: {
    name: string;
    phone: string;
    nid: string;
    date_of_birth: string;
    profile_picture?: string;
  }) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdateData) => Promise<{ error: Error | null }>;
  changePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  loginOpen: boolean;
  registerOpen: boolean;
  openLogin: () => void;
  openRegister: () => void;
  closeLogin: () => void;
  closeRegister: () => void;
  requireAuth: (action?: () => void, mode?: "login" | "register") => void;
  completeAuthAndResume: () => void;
  requestSignupOtp: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  resendOtp: (email: string) => Promise<{ error: Error | null }>;
  completeSignupProfile: (data: {
    name: string;
    phone: string;
    role: UserRole;
  }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapUser(u: User | null): AuthUser | null {
  if (!u) return null;
  const m = (u.user_metadata ?? {}) as Record<string, unknown>;
  const role = (m.role as UserRole) ?? "user";
  const name = (m.name as string) ?? (u.email ?? "").split("@")[0] ?? "User";
  const phone = (m.phone as string) ?? "";
  return {
    id: u.id,
    name: String(name),
    email: u.email ?? "",
    phone: String(phone),
    role: role === "admin" || role === "worker" ? role : "client",
    token: null,
    bio: m.bio as string | undefined,
    avatar: m.avatar as string | undefined,
    address: m.address as string | undefined,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const axiosPublic = useAxiosPublic();

  const isLoading = authStatus === "loading";
  const isAuthenticated = authStatus === "authenticated";

  const setSession = useCallback((u: User | null) => {
    setUser(mapUser(u));
    setAuthStatus(u ? "authenticated" : "unauthenticated");
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) setSession(data.session?.user ?? null);
      } catch {
        if (mounted) {
          setUser(null);
          setAuthStatus("unauthenticated");
        }
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession]);

  const signup = useCallback(
    async (email: string, password: string): Promise<{ error: Error | null }> => {
      try {
        console.log("📝 Attempting signup for:", email);
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/user/register/step2`,
          },
        });

        if (error) {
          console.error("❌ Signup error:", error);
          return { error: new Error(error.message) };
        }

        console.log("✅ Signup successful, verification email sent");
        return { error: null };
      } catch (e) {
        console.error("❌ Signup exception:", e);
        return {
          error: e instanceof Error ? e : new Error("Signup failed"),
        };
      }
    },
    [],
  );

  const checkEmailVerified = useCallback(async (): Promise<{ verified: boolean; error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        return { verified: false, error: new Error(error.message) };
      }

      const verified = data.user?.email_confirmed_at != null;
      console.log("📧 Email verification status:", verified);
      
      return { verified, error: null };
    } catch (e) {
      console.error("❌ Check verification exception:", e);
      return {
        verified: false,
        error: e instanceof Error ? e : new Error("Failed to check verification"),
      };
    }
  }, []);

  const resendVerificationEmail = useCallback(async (): Promise<{ error: Error | null }> => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user?.email) {
        return { error: new Error("No user session found") };
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: userData.user.email,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      console.log("✅ Verification email resent");
      return { error: null };
    } catch (e) {
      console.error("❌ Resend verification exception:", e);
      return {
        error: e instanceof Error ? e : new Error("Failed to resend verification email"),
      };
    }
  }, []);

  const updateProfileWithDetails = useCallback(
    async (data: {
      name: string;
      phone: string;
      nid: string;
      date_of_birth: string;
      profile_picture?: string;
    }): Promise<{ error: Error | null }> => {
      try {
        const { data: cur } = await supabase.auth.getUser();
        if (!cur.user) {
          return { error: new Error("No user session found") };
        }

        const existing = (cur.user.user_metadata ?? {}) as Record<string, unknown>;
        const next = {
          ...existing,
          name: data.name,
          phone: data.phone,
          nid: data.nid,
          date_of_birth: data.date_of_birth,
          profile_picture: data.profile_picture,
          role: "client", // Default role
        };

        const { error } = await supabase.auth.updateUser({ data: next });
        if (error) return { error: new Error(error.message) };

        // Update local user state
        setUser(mapUser(cur.user));

        console.log("✅ Profile completed successfully");
        return { error: null };
      } catch (e) {
        console.error("❌ Profile update exception:", e);
        return {
          error: e instanceof Error ? e : new Error("Profile update failed"),
        };
      }
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<{ error: Error | null }> => {
      try {
        console.log("🔐 Attempting login for:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          console.error("❌ Login error:", error);
          return { error: new Error(error.message) };
        }

        console.log("✅ Supabase auth successful");
        setUser(mapUser(data.user ?? null));
        
        const response = await axiosPublic.get(`/userRoutes/getUserByEmail/${email.trim()}`);
        console.log("📦 API response:", response.data);
        
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log("💾 User data saved to localStorage");
        }

        return { error: null };
      } catch (e) {
        console.error("❌ Login exception:", e);
        return {
          error: e instanceof Error ? e : new Error("Login failed"),
        };
      }
    },
    [axiosPublic],
  );

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Clear localStorage data
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("loginTimestamp");
      setUser(null);
      setAuthStatus("unauthenticated");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if Supabase fails
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("loginTimestamp");
      setUser(null);
      setAuthStatus("unauthenticated");
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: ProfileUpdateData): Promise<{ error: Error | null }> => {
      try {
        const { data: cur } = await supabase.auth.getUser();
        const existing = (cur.user?.user_metadata ?? {}) as Record<string, unknown>;
        const next = { ...existing, ...updates };
        const { error } = await supabase.auth.updateUser({ data: next });
        if (error) return { error: new Error(error.message) };
        const u = cur.user ?? null;
        setUser(mapUser(u));
        return { error: null };
      } catch (e) {
        return {
          error: e instanceof Error ? e : new Error("Update failed"),
        };
      }
    },
    [],
  );

  const changePassword = useCallback(
    async (newPassword: string): Promise<{ error: Error | null }> => {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return { error: error ? new Error(error.message) : null };
      } catch (e) {
        return {
          error: e instanceof Error ? e : new Error("Password update failed"),
        };
      }
    },
    [],
  );

  const openLogin = useCallback(() => {
    setRegisterOpen(false);
    setLoginOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(true);
  }, []);

  const closeLogin = useCallback(() => setLoginOpen(false), []);
  const closeRegister = useCallback(() => setRegisterOpen(false), []);

  const requireAuth = useCallback(
    (_action?: () => void, mode: "login" | "register" = "login") => {
      if (mode === "register") openRegister();
      else openLogin();
    },
    [openLogin, openRegister],
  );

  const completeAuthAndResume = useCallback(() => {
    setLoginOpen(false);
    setRegisterOpen(false);
  }, []);

  const requestSignupOtp = useCallback(
    async (email: string): Promise<{ error: Error | null }> => {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { shouldCreateUser: true },
        });
        return { error: error ? new Error(error.message) : null };
      } catch (e) {
        return {
          error: e instanceof Error ? e : new Error("Failed to send code"),
        };
      }
    },
    [],
  );

  const verifyOtp = useCallback(
    async (email: string, token: string): Promise<{ error: Error | null }> => {
      try {
        const { error } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: token.trim(),
          type: "email",
        });
        return { error: error ? new Error(error.message) : null };
      } catch (e) {
        return {
          error: e instanceof Error ? e : new Error("Verification failed"),
        };
      }
    },
    [],
  );

  const resendOtp = useCallback(
    async (email: string): Promise<{ error: Error | null }> => {
      try {
        const { error } = await supabase.auth.resend({
          type: "email",
          email: email.trim(),
        });
        return { error: error ? new Error(error.message) : null };
      } catch (e) {
        return {
          error: e instanceof Error ? e : new Error("Failed to resend code"),
        };
      }
    },
    [],
  );

  const completeSignupProfile = useCallback(
    async (data: {
      name: string;
      phone: string;
      role: UserRole;
    }): Promise<{ error: Error | null }> => {
      try {
        const { data: cur } = await supabase.auth.getUser();
        const existing = (cur.user?.user_metadata ?? {}) as Record<string, unknown>;
        const next = { ...existing, name: data.name, phone: data.phone, role: data.role };
        const { error } = await supabase.auth.updateUser({ data: next });
        if (error) return { error: new Error(error.message) };
        const u = cur.user ?? null;
        setUser(mapUser(u));
        return { error: null };
      } catch (e) {
        return {
          error: e instanceof Error ? e : new Error("Profile update failed"),
        };
      }
    },
    [],
  );

  const value: AuthContextValue = {
    authStatus,
    isAuthenticated,
    isLoading,
    user,
    login,
    signup,
    checkEmailVerified,
    resendVerificationEmail,
    updateProfileWithDetails,
    logout,
    updateProfile,
    changePassword,
    loginOpen,
    registerOpen,
    openLogin,
    openRegister,
    closeLogin,
    closeRegister,
    requireAuth,
    completeAuthAndResume,
    requestSignupOtp,
    verifyOtp,
    resendOtp,
    completeSignupProfile,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
