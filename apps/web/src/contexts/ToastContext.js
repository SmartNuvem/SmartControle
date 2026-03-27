import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from "react";
const ToastContext = createContext(undefined);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    function add(type, message) {
        const toast = { id: Date.now(), type, message };
        setToasts((prev) => [...prev, toast]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((item) => item.id !== toast.id));
        }, 3000);
    }
    const value = useMemo(() => ({ success: (message) => add("success", message), error: (message) => add("error", message) }), []);
    return (_jsxs(ToastContext.Provider, { value: value, children: [children, _jsx("div", { className: "fixed right-4 top-4 z-50 space-y-2", children: toasts.map((toast) => (_jsx("div", { className: `rounded-lg px-4 py-3 text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`, children: toast.message }, toast.id))) })] }));
}
export function useToast() {
    const context = useContext(ToastContext);
    if (!context)
        throw new Error("useToast deve ser usado dentro de ToastProvider");
    return context;
}
