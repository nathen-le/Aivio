import React from 'react';

/**
 * Shown when the app cannot start at all — in practice, a missing or invalid
 * Firebase configuration. Without this the page renders blank, because
 * src/lib/firebase.ts throws while the module graph is still loading.
 *
 * The message lists variable NAMES only. Configuration values are never shown.
 */
export const StartupErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen bg-[#0a1224] text-slate-100 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-lg bg-[#0f1d38] border-2 border-[#1c325c] rounded-3xl p-7 shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <img src="/mascot-cat-thinking.png" alt="" className="w-20 h-20 object-contain mb-4" />
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          Aivio can&rsquo;t start
        </h1>
        <p className="text-sm text-slate-300 font-medium mb-5">
          The app is missing its configuration, so it could not connect to its services.
        </p>
      </div>

      <p className="text-xs font-bold text-amber-200 bg-amber-500/10 border border-amber-500/40 rounded-2xl px-4 py-3 mb-5 break-words">
        {message}
      </p>

      <p className="text-[11px] text-slate-500 font-medium text-center">
        If you are a visitor, please try again later. If you own this site, check the
        environment variables for the deployment and redeploy.
      </p>
    </div>
  </div>
);
