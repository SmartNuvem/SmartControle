import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "../contexts/ToastContext";
const initialUser = {
    name: "",
    username: "",
    password: "",
    role: "SELLER",
    active: true,
};
export function UsersPage() {
    const { success, error } = useToast();
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(initialUser);
    async function loadUsers() {
        const response = await api.get("/users");
        setUsers(response.data);
    }
    useEffect(() => {
        loadUsers();
    }, []);
    async function submitUser(event) {
        event.preventDefault();
        try {
            await api.post("/users", form);
            success("Usu�rio criado com sucesso.");
            setForm(initialUser);
            await loadUsers();
        }
        catch {
            error("Falha ao criar usu�rio.");
        }
    }
    async function toggleActive(user) {
        try {
            await api.put(`/users/${user.id}`, { active: !user.active });
            success("Status atualizado.");
            await loadUsers();
        }
        catch {
            error("N�o foi poss�vel atualizar usu�rio.");
        }
    }
    async function remove(user) {
        if (!window.confirm(`Excluir ${user.name}?`))
            return;
        try {
            await api.delete(`/users/${user.id}`);
            success("Usu�rio removido.");
            await loadUsers();
        }
        catch {
            error("N�o foi poss�vel remover usu�rio.");
        }
    }
    return (_jsxs("div", { className: "space-y-4 pb-16 md:pb-0", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Usu\uFFFDrios" }), _jsxs("form", { onSubmit: submitUser, className: "grid gap-2 rounded-xl border border-slate-200 p-4 md:grid-cols-5", children: [_jsx("input", { className: "rounded-lg border px-3 py-2", placeholder: "Nome", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), required: true }), _jsx("input", { className: "rounded-lg border px-3 py-2", placeholder: "Usu\uFFFDrio", value: form.username, onChange: (e) => setForm({ ...form, username: e.target.value }), required: true }), _jsx("input", { className: "rounded-lg border px-3 py-2", type: "password", placeholder: "Senha", value: form.password, onChange: (e) => setForm({ ...form, password: e.target.value }), required: true }), _jsxs("select", { className: "rounded-lg border px-3 py-2", value: form.role, onChange: (e) => setForm({ ...form, role: e.target.value }), children: [_jsx("option", { value: "SELLER", children: "Vendedor" }), _jsx("option", { value: "ADMIN", children: "Administrador" })] }), _jsx("button", { className: "rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white", children: "Cadastrar" })] }), _jsx("div", { className: "space-y-2", children: users.map((user) => (_jsxs("div", { className: "flex flex-col gap-2 rounded-xl border border-slate-200 p-3 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold", children: user.name }), _jsxs("p", { className: "text-sm text-slate-600", children: [user.username, " \uFFFD ", user.role] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "rounded-lg bg-slate-800 px-3 py-2 text-white", onClick: () => toggleActive(user), children: user.active ? "Desativar" : "Ativar" }), _jsx("button", { className: "rounded-lg bg-rose-600 px-3 py-2 text-white", onClick: () => remove(user), children: "Excluir" })] })] }, user.id))) })] }));
}
