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
  AuthResult,
} from "@/lib/mockAuth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  token: string | null;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginOpen: boolean;
  registerOpen: boolean;
  openLogin: () => void;
  openRegister: () => void;
  closeLogin: () => void;
  closeRegister: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Load user from localStorage on first mount
  useEffect(() => {
    const existing = getCurrentUser();
    if (existing && existing.token) {
      setUser(existing as AuthUser);
    }
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

  const value: AuthContextValue = {
    isAuthenticated: !!user,
    user,
    login: handleLogin,
    logout: handleLogout,
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


