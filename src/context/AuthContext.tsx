import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  updateUserProfile,
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
  logout: () => void;
  updateProfile: (updates: ProfileUpdateData) => Promise<void>;
  loginOpen: boolean;
  registerOpen: boolean;
  openLogin: () => void;
  openRegister: () => void;
  closeLogin: () => void;
  closeRegister: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

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

  const value: AuthContextValue = {
    isAuthenticated: !!user,
    user,
    login: handleLogin,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    loginOpen,
    registerOpen,
    openLogin: () => {
      setRegisterOpen(false);
      setLoginOpen(true);
    },
    openRegister: () => {
      setLoginOpen(false);
      setRegisterOpen(true);
    },
    closeLogin: () => setLoginOpen(false),
    closeRegister: () => setRegisterOpen(false),
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


