import { useMemo, useState } from 'react';

import { authClient } from '../lib/auth';

const localizeAuthError = (message?: string) => {
  const normalized = message?.toLowerCase() ?? '';

  if (normalized.includes('user not found')) {
    return 'Пользователь не найден. Перейдите на вкладку «Регистрация», чтобы создать аккаунт.';
  }

  if (normalized.includes('invalid email or password') || normalized.includes('invalid password')) {
    return 'Неверная электронная почта или пароль.';
  }

  if (normalized.includes('already exists') || normalized.includes('already registered')) {
    return 'Аккаунт с этой электронной почтой уже существует.';
  }

  return message || 'Не удалось выполнить авторизацию.';
};

export const useAuthSession = () => {
  const { data: session, isPending } = authClient.useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthModeState] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuthMode = (mode: 'signIn' | 'signUp') => {
    setAuthModeState(mode);
    setAuthError('');
  };

  const sessionLabel = useMemo(
    () => session?.user?.name || session?.user?.email || 'Игрок',
    [session],
  );

  const submitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      let result: { data?: unknown; error?: { message?: string } | null };

      if (authMode === 'signIn') {
        result = await authClient.signIn.email({
          email,
          password,
          fetchOptions: { credentials: 'include' },
        });
      } else {
        result = await authClient.signUp.email({
          email,
          password,
          name: email.includes('@') ? email.split('@')[0] : email,
          fetchOptions: { credentials: 'include' },
        });
      }

      if (result.error) {
        throw new Error(localizeAuthError(result.error.message));
      }

      if (result.data) {
        await authClient.getSession();
      }

      setAuthOpen(false);
      setEmail('');
      setPassword('');
    } catch (reason) {
      setAuthError(
        reason instanceof Error ? localizeAuthError(reason.message) : 'Не удалось выполнить авторизацию.',
      );
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setAuthError('');
    setLoading(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        throw new Error(error.message ?? 'Не удалось выйти');
      }
      setAuthOpen(false);
    } catch (reason) {
      setAuthError(
        reason instanceof Error ? reason.message : 'Не удалось выйти',
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    sessionPending: isPending,
    authOpen,
    setAuthOpen,
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    setAuthError,
    loading,
    sessionLabel,
    submitAuth,
    signOut,
  };
};
