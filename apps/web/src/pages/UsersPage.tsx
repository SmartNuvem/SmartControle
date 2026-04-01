import { FormEvent, useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { useRealtime } from "../contexts/RealtimeContext";

type UserItem = {
  id: string;
  name: string;
  username: string;
  role: "ADMIN" | "SELLER";
  active: boolean;
};

const initialUser = {
  name: "",
  username: "",
  password: "",
  role: "SELLER" as "ADMIN" | "SELLER",
  active: true,
};

const initialEdit = {
  id: "",
  name: "",
  username: "",
  password: "",
  role: "SELLER" as "ADMIN" | "SELLER",
  active: true,
};

export function UsersPage() {
  const { success, error } = useToast();
  const { version } = useRealtime();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [form, setForm] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(initialEdit);

  async function loadUsers() {
    const response = await api.get("/users");
    setUsers(response.data);
  }

  useEffect(() => {
    loadUsers();
  }, [version]);

  async function submitUser(event: FormEvent) {
    event.preventDefault();
    try {
      await api.post("/users", {
        ...form,
        username: form.username.trim(),
      });
      success("Usuario criado com sucesso.");
      setForm(initialUser);
      await loadUsers();
    } catch {
      error("Falha ao criar Usuario.");
    }
  }

  function openEdit(user: UserItem) {
    setEditForm({
      id: user.id,
      name: user.name,
      username: user.username,
      password: "",
      role: user.role,
      active: user.active,
    });
    setEditing(true);
  }

  async function submitEdit(event: FormEvent) {
    event.preventDefault();

    const payload: Record<string, unknown> = {
      name: editForm.name,
      username: editForm.username.trim(),
      role: editForm.role,
      active: editForm.active,
    };

    if (editForm.password.trim()) {
      payload.password = editForm.password.trim();
    }

    try {
      await api.put(`/users/${editForm.id}`, payload);
      success("Usuario atualizado com sucesso.");
      setEditing(false);
      setEditForm(initialEdit);
      await loadUsers();
    } catch {
      error("nao foi possivel atualizar Usuario.");
    }
  }

  async function toggleActive(user: UserItem) {
    try {
      await api.put(`/users/${user.id}`, { active: !user.active });
      success("Status atualizado.");
      await loadUsers();
    } catch {
      error("nao foi possivel atualizar Usuario.");
    }
  }

  async function remove(user: UserItem) {
    if (!window.confirm(`Excluir ${user.name}?`)) return;
    try {
      await api.delete(`/users/${user.id}`);
      success("Usuario removido.");
      await loadUsers();
    } catch {
      error("nao foi possivel remover Usuario.");
    }
  }

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <h2 className="text-2xl font-bold">Usuarios</h2>

      <form onSubmit={submitUser} className="grid gap-2 rounded-xl border border-slate-200 p-4 md:grid-cols-5">
        <input className="rounded-lg border px-3 py-2" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="rounded-lg border px-3 py-2" placeholder="Usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input className="rounded-lg border px-3 py-2" type="password" placeholder="Senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select className="rounded-lg border px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "ADMIN" | "SELLER" })}>
          <option value="SELLER">Vendedor</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white">Cadastrar</button>
      </form>

      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-slate-600">{user.username}  -  {user.role}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-sky-700 px-3 py-2 text-white" onClick={() => openEdit(user)}>
                Editar
              </button>
              <button className="rounded-lg bg-slate-800 px-3 py-2 text-white" onClick={() => toggleActive(user)}>
                {user.active ? "Desativar" : "Ativar"}
              </button>
              <button className="rounded-lg bg-rose-600 px-3 py-2 text-white" onClick={() => remove(user)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form onSubmit={submitEdit} className="w-full max-w-lg rounded-xl bg-white p-4">
            <h3 className="text-xl font-bold">Editar usuario</h3>

            <div className="mt-3 grid gap-2">
              <input className="rounded-lg border px-3 py-2" placeholder="Nome" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              <input className="rounded-lg border px-3 py-2" placeholder="Usuario" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} required />
              <input className="rounded-lg border px-3 py-2" type="password" placeholder="Nova senha (opcional)" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
              <select className="rounded-lg border px-3 py-2" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as "ADMIN" | "SELLER" })}>
                <option value="SELLER">Vendedor</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editForm.active} onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })} />
                Usuario ativo
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="submit" className="flex-1 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white">
                Salvar
              </button>
              <button type="button" className="flex-1 rounded-lg bg-slate-200 px-4 py-2" onClick={() => setEditing(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
