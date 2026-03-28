import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("smartcontrole_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMe() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch {
        localStorage.removeItem("smartcontrole_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadMe();
  }, [token]);

  async function login(username: string, password: string) {
    const response = await api.post("/auth/login", { username, password });
    const incomingToken = response.data.token as string;
    localStorage.setItem("smartcontrole_token", incomingToken);
    setToken(incomingToken);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem("smartcontrole_token");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}



