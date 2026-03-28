import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "../services/api";

type RealtimeContextValue = {
  version: number;
};

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!token) return;

    const streamUrl = `${API_URL}/events/stream?token=${encodeURIComponent(token)}`;
    const events = new EventSource(streamUrl);

    events.onmessage = () => {
      setVersion((current) => current + 1);
    };

    events.onerror = () => {
      // Browser gerencia reconexao automaticamente no EventSource.
    };

    return () => {
      events.close();
    };
  }, [token]);

  const value = useMemo(() => ({ version }), [version]);
  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) throw new Error("useRealtime deve ser usado dentro de RealtimeProvider");
  return context;
}


