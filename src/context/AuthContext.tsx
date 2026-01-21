import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  updateUserPassword,
  AuthResult,
  ProfileUpdateData,
} from "@/lib/mockAuth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  token: string | null;
  bio?: string;
  avatar?: string;
  address?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "user" | "worker";
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: ProfileUpdateData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  loginOpen: boolean;
  registerOpen: boolean;
  openLogin: () => void;
  openRegister: () => void;
  closeLogin: () => void;
  closeRegister: () => void;
  requireAuth: (action: () => void, mode?: "login" | "register") => void;
  completeAuthAndResume: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  // Load user from localStorage on first mount
  useEffect(() => {
    const existing = getCurrentUser();
    if (existing && existing.token) {
      setUser(existing as AuthUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const result: AuthResult = await loginUser(email, password);
    const authUser: AuthUser = {
      ...result.user,
      token: result.token,
    };
    setUser(authUser);
  };

  const handleRegister: AuthContextValue["register"] = async (data) => {
    const result = await registerUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      password: data.password,
    });

    const authUser: AuthUser = {
      ...result.user,
      token: result.token,
    };
    setUser(authUser);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const handleUpdateProfile = async (updates: ProfileUpdateData) => {
    if (!user) {
      throw new Error("User must be logged in to update profile.");
    }
    const updatedUserData = await updateUserProfile(user.id, updates);
    const updatedUser: AuthUser = {
      ...updatedUserData,
      token: user.token,
    };
    setUser(updatedUser);
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!user) {
      throw new Error("User must be logged in to change password.");
    }
    await updateUserPassword(user.id, currentPassword, newPassword);
  };

  const openLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const closeLogin = () => setLoginOpen(false);
  const closeRegister = () => setRegisterOpen(false);

  const requireAuth: AuthContextValue["requireAuth"] = (action, mode = "login") => {
    pendingActionRef.current = action;
    if (mode === "register") openRegister();
    else openLogin();
  };

  const completeAuthAndResume: AuthContextValue["completeAuthAndResume"] = () => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    setLoginOpen(false);
    setRegisterOpen(false);
    if (action) queueMicrotask(action);
  };

  const value: AuthContextValue = {
    isAuthenticated: !!user,
    user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
    loginOpen,
    registerOpen,
    openLogin,
    openRegister,
    closeLogin,
    closeRegister,
    requireAuth,
    completeAuthAndResume,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};


