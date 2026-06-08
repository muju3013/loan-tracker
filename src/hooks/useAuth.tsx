import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import type { AuthUser } from "../types/auth";
import {
  firebaseSignIn,
  firebaseSignOut,
  firebaseSignUp,
  firebaseResetPassword,
} from "../utils/firebaseAuth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          id: fbUser.uid,
          email: fbUser.email ?? "",
          name: fbUser.displayName ?? fbUser.email?.split("@")[0] ?? "User",
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await firebaseSignIn(email, password);
    if ("error" in result) return result.error;
    setUser(result.user);
    return null;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await firebaseSignUp(name, email, password);
    if ("error" in result) return result.error;
    setUser(result.user);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return await firebaseResetPassword(email);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
