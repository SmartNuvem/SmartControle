import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/", { replace: true });
    } catch {
      error("Falha no login. Verifique Usuario e senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-100 via-slate-100 to-emerald-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card">
        <h1 className="text-3xl font-bold text-brand-700">SmartControle</h1>
        <p className="mt-1 text-sm text-slate-600">Controle simples de produtos, estoque e vendas</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Usuario</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base focus:border-brand-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Senha</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base focus:border-brand-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="w-full rounded-lg bg-brand-600 px-4 py-3 text-base font-bold text-white hover:bg-brand-700 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}



