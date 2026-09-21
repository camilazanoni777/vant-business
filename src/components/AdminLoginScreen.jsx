import { useState } from 'react';

// Atalho de desenvolvimento local. As credenciais vem do ambiente para nao
// ficarem no repositorio; sem elas, o atalho fica desativado e o login sempre
// passa por /api/admin-login. Defina em .env.local:
//   VITE_LOCAL_ADMIN_EMAIL=...
//   VITE_LOCAL_ADMIN_PASSWORD=...
const localAdminEmail = import.meta.env.VITE_LOCAL_ADMIN_EMAIL || '';
const localAdminPassword = import.meta.env.VITE_LOCAL_ADMIN_PASSWORD || '';

function isLocalPreview() {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

function AdminLoginScreen({ onAuthenticated }) {
  const [form, setForm] = useState({ email: localAdminEmail, password: '' });
  const [status, setStatus] = useState('idle');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');

    try {
      if (isLocalPreview() && localAdminEmail && localAdminPassword) {
        const email = form.email.trim().toLowerCase();
        if (email !== localAdminEmail || form.password !== localAdminPassword) {
          throw new Error('invalid-local-credentials');
        }

        window.localStorage.setItem('vant_admin_local_auth', 'true');
      } else {
        const response = await fetch('/api/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error('invalid-remote-credentials');
        }
      }

      const result = await onAuthenticated();
      if (result === false) {
        throw new Error('authentication-failed');
      }
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <section className="news-glow overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-400">Admin VANT</p>
              <h1 className="font-display mt-4 max-w-3xl text-4xl font-extrabold leading-[0.95] text-white sm:text-6xl">
                Acesso
                <span className="block text-cyan-300">administrativo</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Entre para abrir a fila dos agentes, aprovar notícias e acompanhar cliques.
                A tela foi simplificada para evitar travamento e deixar o login previsível.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                Agentes
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                Notícias
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                Cliques
              </span>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-slate-500">
              {isLocalPreview() ? 'Ambiente local com credenciais de teste' : 'Ambiente protegido por autenticação'}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-cyan-950/20 sm:p-6">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-400">Login</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-white">
                Entre com sua conta
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Use o email administrativo para abrir o painel.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="admin@vant.business"
                className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
              />
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Senha"
                className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
              />

              {status === 'error' && (
                <p className="text-xs text-red-300">Email ou senha inválidos.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
              >
                {status === 'loading' ? 'Entrando...' : 'Acessar painel'}
              </button>

              {isLocalPreview() && localAdminEmail && localAdminPassword && (
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Teste local: <span className="text-slate-300">{localAdminEmail}</span> / <span className="text-slate-300">{localAdminPassword}</span>
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminLoginScreen;
