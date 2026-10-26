import React, { useState } from 'react';
import { Gift, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface MilestoneChestProps {
  isUnlocked: boolean;
  isClaimed: boolean;
  gemReward: number;
  xpReward: number;
  onClaim: () => void;
}

export const MilestoneChest: React.FC<MilestoneChestProps> = ({
  isUnlocked,
  isClaimed,
  gemReward,
  xpReward,
  onClaim,
}) => {
  const [showClaimModal, setShowClaimModal] = useState(false);

  const handleClick = () => {
    if (!isUnlocked) {
      sound.playIncorrect();
      return;
    }
    if (isClaimed) return;

    sound.playGemSparkle();
    setShowClaimModal(true);
    onClaim();
  };

  return (
    <div className="relative flex flex-col items-center select-none my-2">
      <button
        onClick={handleClick}
        disabled={isClaimed}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-150 border-b-[5px] ${
          isClaimed
            ? 'bg-[#142344] border-[#0e1830] text-slate-500 opacity-60 cursor-default'
            : isUnlocked
            ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-700 text-slate-950 shadow-[0_8px_20px_rgba(245,158,11,0.5)] hover:scale-105 active:translate-y-1 active:border-b-0 animate-bounce-subtle'
            : 'bg-[#1c2c4c] border-[#121c32] text-slate-500 cursor-not-allowed'
        }`}
        title={
          isClaimed
            ? 'Chest already claimed'
            : isUnlocked
            ? 'Click to open bonus chest!'
            : 'Complete previous lessons to unlock'
        }
      >
        {isClaimed ? (
          <Check className="w-8 h-8 stroke-[3] text-emerald-400" />
        ) : (
          <Gift className={`w-8 h-8 stroke-[2.5] ${isUnlocked ? 'animate-pulse' : ''}`} />
        )}
      </button>

      <span className="text-[10px] font-black uppercase text-amber-300 mt-1 tracking-wider">
        {isClaimed ? 'Claimed' : `Bonus +${gemReward} 💎`}
      </span>

      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="max-w-sm w-full bg-[#0f1d38] border-2 border-amber-400 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Sparkles className="w-9 h-9 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black text-white mb-1">CHEST UNLOCKED!</h3>
            <p className="text-xs text-slate-300 mb-4">
              Awesome job progressing through the curriculum! You found a secret AI treasure cache.
            </p>
            <div className="flex items-center justify-center gap-4 p-3 rounded-2xl bg-[#142344] border border-[#1f3764] mb-5 font-mono text-base font-black">
              <span className="text-cyan-300">+{gemReward} 💎</span>
              <span className="text-amber-300">+{xpReward} XP</span>
            </div>
            <button
              onClick={() => setShowClaimModal(false)}
              className="w-full py-3 rounded-2xl bg-[#1cb0f6] text-slate-950 font-black text-xs uppercase tracking-wider border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0"
            >
              Collect Rewards
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
