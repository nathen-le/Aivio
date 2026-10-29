import React, { useState } from 'react';
import { CloudOff, Loader2, RefreshCw, Download } from 'lucide-react';
import type { UserProgress } from '../types/lesson';
import { sound } from '../utils/sound';

const shell = 'min-h-screen bg-[#0a1224] flex flex-col items-center justify-center gap-4 px-4 text-center';
const primaryBtn =
  'btn-3d bg-[#1cb0f6] hover:bg-[#38bdf8] border-b-4 border-[#1899d6] text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl px-6 py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';
const secondaryBtn =
  'btn-3d bg-[#0f1d38] hover:bg-[#1b3464] border-2 border-[#1c325c] border-b-4 text-slate-100 font-black text-xs uppercase tracking-wider rounded-2xl px-5 py-3 disabled:opacity-60 disabled:cursor-not-allowed';

export const ProgressLoadingScreen: React.FC = () => (
  <div className={shell} role="status">
    <img src="/mascot-cat-logo.png" alt="" className="w-24 h-24 object-contain animate-float" />
    <p className="text-xs font-black uppercase tracking-wider text-slate-400">Loading your progress…</p>
  </div>
);

export const ProgressErrorScreen: React.FC<{ onRetry: () => void; onSignOut: () => void }> = ({
  onRetry,
  onSignOut,
}) => (
  <div className={shell} role="alert">
    <CloudOff className="w-14 h-14 text-amber-400" />
    <h1 className="text-2xl font-black text-white">We couldn't load your progress</h1>
    <p className="text-sm text-slate-300 font-medium max-w-sm">
      Check your connection and try again. Your saved progress is safe and nothing has been changed.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 mt-2">
      <button
        onClick={() => {
          sound.playClick();
          onRetry();
        }}
        className={primaryBtn}
      >
        <RefreshCw className="w-4 h-4" /> Try again
      </button>
      <button onClick={onSignOut} className={secondaryBtn}>
        Sign out
      </button>
    </div>
  </div>
);

export const LegacyImportPrompt: React.FC<{
  legacy: UserProgress;
  onImport: () => Promise<boolean>;
  onStartFresh: () => Promise<boolean>;
}> = ({ legacy, onImport, onStartFresh }) => {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const run = async (action: () => Promise<boolean>) => {
    setBusy(true);
    setFailed(false);
    const ok = await action();
    // On success the parent swaps this screen out, so only failures need handling.
    if (!ok) {
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <div className={shell}>
      <div
        role="dialog"
        aria-labelledby="import-title"
        className="w-full max-w-md bg-[#0f1d38] border-2 border-[#1c325c] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-3"
      >
        <Download className="w-10 h-10 text-[#1cb0f6]" />
        <h1 id="import-title" className="text-xl sm:text-2xl font-black text-white">
          Progress found on this device
        </h1>
        <p className="text-sm text-slate-300 font-medium">
          This browser has Aivio progress saved from before accounts: {legacy.totalXP} XP,{' '}
          {legacy.completedLessonIds.length} completed lesson
          {legacy.completedLessonIds.length === 1 ? '' : 's'}, {legacy.earnedBadgeIds.length} badge
          {legacy.earnedBadgeIds.length === 1 ? '' : 's'}.
        </p>
        <p className="text-xs text-slate-400 font-medium">
          Import it only if it is yours. A copy stays on this device either way.
        </p>
        {failed && (
          <p role="alert" className="text-xs font-bold text-red-300 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
            That didn't save. Check your connection and try again.
          </p>
        )}
        <div className="flex flex-col gap-3 w-full mt-2">
          <button disabled={busy} onClick={() => run(onImport)} className={primaryBtn}>
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Import into my account
          </button>
          <button disabled={busy} onClick={() => run(onStartFresh)} className={secondaryBtn}>
            Start fresh instead
          </button>
        </div>
      </div>
    </div>
  );
};

export const SaveErrorBanner: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div
    role="status"
    className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] max-w-[calc(100vw-1.5rem)] flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-2xl"
  >
    <CloudOff className="w-4 h-4 shrink-0" />
    <span>Couldn't save your progress. Retrying…</span>
    <button onClick={onRetry} className="underline uppercase tracking-wider shrink-0">
      Retry now
    </button>
  </div>
);
