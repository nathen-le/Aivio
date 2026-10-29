import React, { useState } from 'react';
import { ArrowLeft, Loader2, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getAuthErrorMessage } from '../lib/authErrors';
import { sound } from '../utils/sound';

type AuthMode = 'login' | 'signup' | 'reset';

interface AuthPageProps {
  onBack?: () => void;
  /** Which form to show first. Defaults to log in. */
  initialMode?: 'login' | 'signup';
  /** Reports login/signup switches so the caller can keep the URL in sync. */
  onModeChange?: (mode: 'login' | 'signup') => void;
}

const MODE_COPY: Record<AuthMode, { title: string; subtitle: string; cta: string }> = {
  login: {
    title: 'Welcome back!',
    subtitle: 'Log in to pick up your streak where you left off.',
    cta: 'LOG IN',
  },
  signup: {
    title: 'Create your account',
    subtitle: 'Start learning AI with your own saved profile.',
    cta: 'CREATE ACCOUNT',
  },
  reset: {
    title: 'Reset your password',
    subtitle: "Enter your email and we'll send you a reset link.",
    cta: 'SEND RESET LINK',
  },
};

const inputClass =
  'w-full bg-[#0c1a30] border-2 border-[#1f3764] focus:border-[#1cb0f6] rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-white placeholder:text-slate-500 outline-none transition-colors disabled:opacity-60';

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, initialMode = 'login', onModeChange }) => {
  const { register, login, resetPassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const copy = MODE_COPY[mode];

  const switchMode = (next: AuthMode) => {
    sound.playClick();
    setMode(next);
    if (next !== 'reset') onModeChange?.(next);
    setError(null);
    setNotice(null);
    // Never carry a typed password across modes.
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setError(null);
    setNotice(null);

    if (mode === 'signup' && !displayName.trim()) {
      setError('Please enter the name you want on your profile.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signup') {
        await register(email.trim(), password, displayName);
      } else if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await resetPassword(email.trim());
        setNotice(
          'If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.',
        );
      }
      // Clear the password from component state as soon as it is no longer needed.
      setPassword('');
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 animate-fade-in">
      {/* Ambient glow to match the landing hero */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] bg-gradient-to-tr from-[#1cb0f6]/20 via-[#0284c7]/15 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        {onBack && (
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-[#1cb0f6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            Back
          </button>
        )}

        <div className="bg-[#0f1d38] border-2 border-[#1c325c] rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-7">
            <img
              src="/mascot-cat-logo.png"
              alt=""
              className="w-20 h-20 object-contain mb-3 animate-float"
            />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {copy.title}
            </h1>
            <p className="text-sm text-slate-300 font-medium mt-2 max-w-xs">{copy.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display name"
                  autoComplete="name"
                  disabled={busy}
                  className={inputClass}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
                disabled={busy}
                className={inputClass}
              />
            </div>

            {mode !== 'reset' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Password (6+ characters)' : 'Password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  disabled={busy}
                  className={inputClass}
                />
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="text-xs font-bold text-red-300 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2.5"
              >
                {error}
              </p>
            )}

            {notice && (
              <p
                role="status"
                className="text-xs font-bold text-sky-200 bg-[#1cb0f6]/10 border border-[#1cb0f6]/40 rounded-xl px-3 py-2.5"
              >
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn-3d w-full bg-[#1cb0f6] hover:bg-[#38bdf8] border-b-4 border-[#1899d6] text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl py-3.5 mt-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {busy ? 'PLEASE WAIT…' : copy.cta}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1c325c] flex flex-col gap-2.5 text-center">
            {mode === 'login' && (
              <>
                <button
                  onClick={() => switchMode('reset')}
                  className="text-xs font-bold text-slate-400 hover:text-[#1cb0f6] transition-colors"
                >
                  Forgot your password?
                </button>
                <p className="text-xs font-bold text-slate-400">
                  New here?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-[#1cb0f6] hover:underline font-black"
                  >
                    Create an account
                  </button>
                </p>
              </>
            )}

            {mode === 'signup' && (
              <p className="text-xs font-bold text-slate-400">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-[#1cb0f6] hover:underline font-black"
                >
                  Log in
                </button>
              </p>
            )}

            {mode === 'reset' && (
              <button
                onClick={() => switchMode('login')}
                className="text-xs font-bold text-slate-400 hover:text-[#1cb0f6] transition-colors"
              >
                Back to log in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
