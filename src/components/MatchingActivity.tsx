import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';
import type { MatchingBlock } from '../types/lesson';

interface MatchingActivityProps {
  block: MatchingBlock;
  onActivityCompleted: (mistakesCount: number) => void;
  onContinue: () => void;
}

export const MatchingActivity: React.FC<MatchingActivityProps> = ({
  block,
  onActivityCompleted,
  onContinue,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [shuffledRights, setShuffledRights] = useState<{ id: string; right: string }[]>([]);

  useEffect(() => {
    const rights = block.pairs.map((p) => ({ id: p.id, right: p.right }));
    const shuffled = [...rights].sort(() => Math.random() - 0.5);
    setShuffledRights(shuffled);

    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setMistakesCount(0);
    setWrongPair(null);
    setIsCompleted(false);
  }, [block.id]);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        sound.playCorrect();
        const newMatched = [...matchedPairs, selectedLeft];
        setMatchedPairs(newMatched);
        setSelectedLeft(null);
        setSelectedRight(null);

        if (newMatched.length === block.pairs.length) {
          sound.playGemSparkle();
          setIsCompleted(true);
          onActivityCompleted(mistakesCount);
        }
      } else {
        sound.playIncorrect();
        setWrongPair({ left: selectedLeft, right: selectedRight });
        setMistakesCount((prev) => prev + 1);
        const timer = setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setWrongPair(null);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLeft, selectedRight, block.pairs.length, matchedPairs, mistakesCount, onActivityCompleted]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-between min-h-[460px] select-none">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#132344] text-[#1cb0f6] border border-[#1cb0f6]/40">
            Interactive Match
          </span>
          <span className="text-xs text-slate-300 font-mono font-bold">
            {matchedPairs.length} / {block.pairs.length} Matched
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          {block.prompt}
        </h3>
        <p className="text-xs text-slate-300 mb-6 font-medium">
          {block.instruction || 'Select an item on the left, then connect it to its match on the right.'}
        </p>

        {/* Dual columns matching grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Column (Terms) */}
          <div className="space-y-3">
            <span className="text-[11px] font-black text-sky-400 uppercase tracking-wider block">
              Terms
            </span>
            {block.pairs.map((pair) => {
              const isMatched = matchedPairs.includes(pair.id);
              const isSelected = selectedLeft === pair.id;
              const isWrong = wrongPair?.left === pair.id;

              return (
                <button
                  key={pair.id}
                  disabled={isMatched || isCompleted}
                  onClick={() => {
                    sound.playClick();
                    setSelectedLeft(pair.id);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all duration-150 border-b-4 ${
                    isMatched
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 opacity-60 cursor-default'
                      : isWrong
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 animate-shake'
                      : isSelected
                      ? 'bg-[#1b3464] border-[#1cb0f6] text-white ring-2 ring-[#1cb0f6] shadow-lg translate-y-[-2px]'
                      : 'bg-[#132344] border-[#0c182e] text-slate-200 hover:bg-[#182b52] hover:border-[#1cb0f6]/40 active:translate-y-1 active:border-b-0'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{pair.left}</span>
                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column (Matches) */}
          <div className="space-y-3">
            <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider block">
              Definitions
            </span>
            {shuffledRights.map((item) => {
              const isMatched = matchedPairs.includes(item.id);
              const isSelected = selectedRight === item.id;
              const isWrong = wrongPair?.right === item.id;

              return (
                <button
                  key={item.id}
                  disabled={isMatched || isCompleted}
                  onClick={() => {
                    sound.playClick();
                    setSelectedRight(item.id);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-medium transition-all duration-150 border-b-4 ${
                    isMatched
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 opacity-60 cursor-default'
                      : isWrong
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 animate-shake'
                      : isSelected
                      ? 'bg-purple-950 border-purple-400 text-purple-200 ring-2 ring-purple-500/50 shadow-lg translate-y-[-2px]'
                      : 'bg-[#132344] border-[#0c182e] text-slate-200 hover:bg-[#182b52] hover:border-purple-400/40 active:translate-y-1 active:border-b-0'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{item.right}</span>
                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="mt-8 pt-4 border-t-2 border-[#1c325c]">
        {isCompleted ? (
          <div className="p-5 rounded-3xl bg-[#0d2a1f] border-2 border-emerald-500 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/60 bg-slate-900 shrink-0">
                <img src="/mascot-fox-avatar.jpg" alt="Aivo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-base text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Perfect Matching!
                </h4>
                <p className="text-xs text-slate-200 mt-0.5">
                  {block.explanation}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onContinue();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 shrink-0"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>
              {matchedPairs.length === 0
                ? 'Select any item to begin matching'
                : `${block.pairs.length - matchedPairs.length} remaining to match`}
            </span>
            {mistakesCount > 0 && (
              <span className="text-amber-400 font-mono">
                {mistakesCount} {mistakesCount === 1 ? 'mismatch' : 'mismatches'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
