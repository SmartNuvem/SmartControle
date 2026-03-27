import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("smartcontrole_token"));
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
            }
            catch {
                localStorage.removeItem("smartcontrole_token");
                setToken(null);
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        }
        loadMe();
    }, [token]);
    async function login(username, password) {
        const response = await api.post("/auth/login", { username, password });
        const incomingToken = response.data.token;
        localStorage.setItem("smartcontrole_token", incomingToken);
        setToken(incomingToken);
        setUser(response.data.user);
    }
    function logout() {
        localStorage.removeItem("smartcontrole_token");
        setToken(null);
        setUser(null);
    }
    const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    return context;
}
