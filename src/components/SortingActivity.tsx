import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, FolderDown, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';
import type { SortingBlock } from '../types/lesson';

interface SortingActivityProps {
  block: SortingBlock;
  onActivityCompleted: (mistakesCount: number) => void;
  onContinue: () => void;
}

export const SortingActivity: React.FC<SortingActivityProps> = ({
  block,
  onActivityCompleted,
  onContinue,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sortedItems, setSortedItems] = useState<
    Record<string, { id: string; text: string; correct: boolean }[]>
  >({});
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<{
    status: 'correct' | 'wrong';
    message: string;
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    setCurrentIndex(0);
    const initialBuckets: Record<string, { id: string; text: string; correct: boolean }[]> = {};
    block.categories.forEach((cat) => {
      initialBuckets[cat.id] = [];
    });
    setSortedItems(initialBuckets);
    setMistakesCount(0);
    setLastFeedback(null);
    setIsCompleted(false);
  }, [block.id]);

  const currentItem = block.items[currentIndex];

  const handleCategorySelect = (categoryId: string) => {
    if (isCompleted || !currentItem) return;

    const isCorrect = categoryId === currentItem.correctCategoryId;

    if (isCorrect) {
      sound.playCorrect();
      setLastFeedback({
        status: 'correct',
        message: 'Correct categorization!',
      });

      const updatedBuckets = {
        ...sortedItems,
        [categoryId]: [
          ...(sortedItems[categoryId] || []),
          { id: currentItem.id, text: currentItem.text, correct: true },
        ],
      };
      setSortedItems(updatedBuckets);

      if (currentIndex + 1 < block.items.length) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setLastFeedback(null);
        }, 400);
      } else {
        sound.playGemSparkle();
        setIsCompleted(true);
        onActivityCompleted(mistakesCount);
      }
    } else {
      sound.playIncorrect();
      setMistakesCount((prev) => prev + 1);
      const correctCat = block.categories.find((c) => c.id === currentItem.correctCategoryId);
      setLastFeedback({
        status: 'wrong',
        message: `Not quite. This belongs in: ${correctCat?.name}`,
      });
    }
  };

  const handleReset = () => {
    sound.playClick();
    setCurrentIndex(0);
    const initialBuckets: Record<string, { id: string; text: string; correct: boolean }[]> = {};
    block.categories.forEach((cat) => {
      initialBuckets[cat.id] = [];
    });
    setSortedItems(initialBuckets);
    setMistakesCount(0);
    setLastFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-between min-h-[460px] select-none">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#132344] text-[#1cb0f6] border border-[#1cb0f6]/40">
            Categorization Lab
          </span>
          <span className="text-xs text-slate-300 font-mono font-bold">
            {isCompleted ? block.items.length : currentIndex + 1} of {block.items.length} Sorted
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          {block.prompt}
        </h3>
        <p className="text-xs text-slate-300 mb-6 font-medium">
          {block.instruction || 'Assign each item to its correct category.'}
        </p>

        {!isCompleted && currentItem && (
          <div className="mb-6">
            {/* Active Flashcard Card */}
            <div
              className={`p-6 rounded-3xl bg-[#132344] border-2 border-b-[6px] transition-all duration-200 shadow-xl ${
                lastFeedback?.status === 'wrong'
                  ? 'border-rose-500 border-b-rose-700 shadow-rose-950/40 animate-shake'
                  : 'border-[#1cb0f6] border-b-[#1899d6] shadow-[0_10px_25px_rgba(28,176,246,0.25)]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-bold">
                <span className="uppercase tracking-wider text-[#1cb0f6]">
                  Item to Classify
                </span>
                <span className="font-mono">#{currentIndex + 1}</span>
              </div>
              <p className="text-lg sm:text-xl font-black text-white leading-relaxed">
                "{currentItem.text}"
              </p>
              {lastFeedback && (
                <div
                  className={`mt-3 text-xs font-bold flex items-center gap-1.5 ${
                    lastFeedback.status === 'correct' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {lastFeedback.status === 'correct' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : null}
                  {lastFeedback.message}
                </div>
              )}
            </div>

            {/* Target Category Buttons (Chunky 3D Buttons) */}
            <div className="mt-5">
              <span className="text-xs font-black text-sky-400 uppercase tracking-wider block mb-2.5">
                Select Destination Category:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {block.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="p-4 rounded-2xl border-2 border-b-[5px] bg-[#0f1d38] hover:bg-[#16274a] border-[#1c325c] hover:border-[#1cb0f6] text-left transition-all duration-150 active:translate-y-1 active:border-b-0 group shadow-md"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {category.name}
                      </span>
                      <FolderDown className="w-5 h-5 text-slate-400 group-hover:text-[#1cb0f6] transition-colors" />
                    </div>
                    {category.description && (
                      <p className="text-[11px] text-slate-400 font-medium">{category.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categorized Buckets Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {block.categories.map((cat) => {
            const itemsInCat = sortedItems[cat.id] || [];
            return (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-[#0f1d38] border-2 border-[#1c325c] text-xs font-bold"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">{cat.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#132344] text-[#1cb0f6] font-mono text-[10px]">
                    {itemsInCat.length}
                  </span>
                </div>
                {itemsInCat.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic font-normal">No items sorted yet</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {itemsInCat.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded-xl bg-[#142344] text-slate-200 text-[11px] flex items-center justify-between gap-1 border border-[#1f3764]"
                      >
                        <span className="line-clamp-1">{item.text}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
                  <Sparkles className="w-4 h-4 text-amber-400" /> Perfectly Sorted!
                </h4>
                <p className="text-xs text-slate-200 mt-0.5 font-medium">
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
            <span>{block.items.length - currentIndex} remaining to sort</span>
            <button
              onClick={handleReset}
              className="text-sky-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
