import { Loader2, UserRound } from 'lucide-react';

import { Button } from '../ui/button';

type SessionUser = {
  name?: string | null;
  email?: string | null;
};

type AuthPopoverProps = {
  session?: {
    user?: SessionUser | null;
  } | null;
  authMode: 'signIn' | 'signUp';
  email: string;
  password: string;
  authError: string;
  loading: boolean;
  onModeChange: (mode: 'signIn' | 'signUp') => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSignOut: () => void;
};

export const AuthPopover = ({
  session,
  authMode,
  email,
  password,
  authError,
  loading,
  onModeChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSignOut,
}: AuthPopoverProps) => {
  return (
    <div className="fixed right-6 top-20 z-50 w-[min(390px,calc(100vw-3rem))] animate-in rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20 fade-in slide-in-from-top-3 duration-300">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <UserRound size={16} />
        </div>
        <div>
          <strong className="text-base text-slate-950">
            {session ? 'Аккаунт' : authMode === 'signIn' ? 'Вход' : 'Создать аккаунт'}
          </strong>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {session
              ? 'Управляйте аккаунтом магазина ключей'
              : 'Войдите или зарегистрируйтесь для управления аккаунтом'}
          </p>
        </div>
      </div>

      {session ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Выполнен вход</span>
            <strong>{session.user?.name || session.user?.email || 'Игрок'}</strong>
          </div>
          <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={onSignOut} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Выйти'}
          </Button>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Режим авторизации">
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 ${authMode === 'signIn' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              onClick={() => onModeChange('signIn')}
            >
              Войти
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 ${authMode === 'signUp' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              onClick={() => onModeChange('signUp')}
            >
              Регистрация
            </button>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            <span>Электронная почта</span>
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="name@example.com"
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition duration-300 placeholder:text-slate-300 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            <span>Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="••••••••"
              minLength={8}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition duration-300 placeholder:text-slate-300 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              required
            />
          </label>

          {authError && <p className="animate-in rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 fade-in">{authError}</p>}

          <Button type="submit" className="h-11 rounded-xl bg-slate-950 text-white transition duration-300 hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-200" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : authMode === 'signIn' ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>
      )}
    </div>
  );
};
