import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';
import type { QuizBlock } from '../types/lesson';

interface QuizQuestionProps {
  block: QuizBlock;
  onAnswerSubmitted: (isCorrect: boolean) => void;
  onContinue: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  block,
  onAnswerSubmitted,
  onContinue,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  useEffect(() => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  }, [block.id]);

  // Keyboard shortcut listener: 1-4 for options, Enter for submit/continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) {
        if (e.key === 'Enter') {
          sound.playClick();
          onContinue();
        }
        return;
      }

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= block.options.length) {
        sound.playClick();
        setSelectedOptionId(block.options[num - 1].id);
      } else if (e.key === 'Enter' && selectedOptionId) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOptionId, isSubmitted, block.options, onContinue]);

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    const correct = selectedOptionId === block.correctAnswerId;
    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswerSubmitted(correct);

    if (correct) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
  };

  const handleRetry = () => {
    sound.playClick();
    setIsSubmitted(false);
    setSelectedOptionId(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-between min-h-[460px] select-none">
      <div>
        {/* Concept Check Header & Hint Pill */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#F6EFE4] text-[#5C1F2A] border border-[#5C1F2A]/40">
            Concept Check
          </span>
          {block.hint && (
            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="text-xs font-bold text-[#7A2B37] hover:text-[#2B1B1A] flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>
          )}
        </div>

        {showHint && block.hint && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#FBE3E0]/50 border-2 border-[#E8DCCB]/40 text-xs text-[#2B1B1A]">
            💡 <strong>Aivo's Hint:</strong> {block.hint}
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-xl sm:text-2xl font-black text-[#2B1B1A] mb-6 leading-snug">
          {block.question}
        </h3>

        {/* Interactive 3D Options List */}
        <div className="space-y-3">
          {block.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === block.correctAnswerId;

            let optionStyle =
              'bg-[#F6EFE4] border-b-4 border-[#FFFDF9] hover:bg-[#F1E6D6] hover:border-[#F6EFE4] text-[#2B1B1A] active:translate-y-1 active:border-b-0';

            if (isSelected && !isSubmitted) {
              optionStyle =
                'bg-[#F1E6D6] border-b-4 border-[#5C1F2A] text-[#2B1B1A] shadow-[0_4px_15px_rgba(92,31,42,0.3)] ring-2 ring-[#5C1F2A] translate-y-[-2px]';
            } else if (isSubmitted) {
              if (isCorrectOption) {
                optionStyle =
                  'bg-[#EEF3E3] border-b-4 border-[#8DAA5B] text-[#4F6B2A] shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-2 ring-[#8DAA5B]';
              } else if (isSelected && !isCorrect) {
                optionStyle =
                  'bg-[#FBE3E0] border-b-4 border-[#C2414B] text-[#B0303C] shadow-[0_0_15px_rgba(244,63,94,0.3)] ring-2 ring-[#C2414B]';
              } else {
                optionStyle = 'bg-[#FFFDF9]/50 border-b-4 border-[#E8DCCB] text-[#857670] opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => {
                  if (!isSubmitted) {
                    sound.playClick();
                    setSelectedOptionId(option.id);
                  }
                }}
                disabled={isSubmitted}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all duration-150 ${optionStyle}`}
              >
                {/* Number Key badge */}
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-black shrink-0 border ${
                    isSelected && !isSubmitted
                      ? 'bg-[#5C1F2A] text-[#FFF8EE] border-white'
                      : isSubmitted && isCorrectOption
                      ? 'bg-[#8DAA5B] text-[#2B1B1A] border-white'
                      : isSubmitted && isSelected && !isCorrect
                      ? 'bg-[#C2414B] text-[#2B1B1A] border-white'
                      : 'bg-[#FFFDF9] text-[#857670] border-[#E8DCCB]'
                  }`}
                >
                  {index + 1}
                </span>

                <div className="flex-1">
                  <span className="text-sm sm:text-base font-bold leading-relaxed">
                    {option.text}
                  </span>
                  {isSubmitted && option.explanation && (isSelected || isCorrectOption) && (
                    <p
                      className={`text-xs mt-1.5 font-medium ${
                        isCorrectOption ? 'text-[#4F6B2A]' : 'text-[#B0303C]'
                      }`}
                    >
                      {option.explanation}
                    </p>
                  )}
                </div>

                {/* Status icon if submitted */}
                {isSubmitted && (
                  <div className="shrink-0 pt-0.5">
                    {isCorrectOption ? (
                      <CheckCircle2 className="w-6 h-6 text-[#4F6B2A]" />
                    ) : isSelected && !isCorrect ? (
                      <XCircle className="w-6 h-6 text-[#B0303C]" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Feedback Banner */}
      <div className="mt-8 pt-4 border-t-2 border-[#E8DCCB]">
        {!isSubmitted ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#857670] font-bold hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-[#F6EFE4] rounded border border-[#E8DCCB] text-[#2B1B1A]">1</kbd>–<kbd className="px-1.5 py-0.5 bg-[#F6EFE4] rounded border border-[#E8DCCB] text-[#2B1B1A]">4</kbd> to select, <kbd className="px-1.5 py-0.5 bg-[#F6EFE4] rounded border border-[#E8DCCB] text-[#2B1B1A]">Enter</kbd> to check
            </span>
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className={`ml-auto px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
                selectedOptionId
                  ? 'bg-[#5C1F2A] hover:bg-[#5C1F2A] text-[#FFF8EE] border-b-4 border-[#3D1119] active:translate-y-1 active:border-b-0 shadow-lg shadow-[#5C1F2A]/25'
                  : 'bg-[#F6EFE4] text-[#857670] cursor-not-allowed border-b-4 border-[#E8DCCB]'
              }`}
            >
              <span>Check Answer</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        ) : (
          <div
            className={`p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in ${
              isCorrect
                ? 'bg-[#EEF3E3] border-[#8DAA5B] text-[#4F6B2A] shadow-[0_10px_25px_rgba(16,185,129,0.3)]'
                : 'bg-[#2a1118] border-[#C2414B] text-[#B0303C] shadow-[0_10px_25px_rgba(244,63,94,0.3)]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/60 bg-black/40 p-1 shrink-0 shadow-md flex items-center justify-center">
                <img
                  src="/mascot-penguin-happy.png"
                  alt="Aivo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-black text-base sm:text-lg flex items-center gap-1.5 text-[#2B1B1A]">
                  {isCorrect ? '🎉 Brilliant Work!' : '⚠️ Almost! Learn from this:'}
                </h4>
                <p className="text-xs text-[#2B1B1A] font-medium mt-0.5 max-w-lg">
                  {block.explanation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              {!isCorrect && (
                <button
                  onClick={handleRetry}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-[#F6EFE4] hover:bg-[#5C1F2A] border-b-4 border-[#FFFDF9] text-[#2B1B1A] text-xs font-black uppercase tracking-wider active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>
              )}
              <button
                onClick={() => {
                  sound.playClick();
                  onContinue();
                }}
                className={`flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:translate-y-1 active:border-b-0 ${
                  isCorrect
                    ? 'bg-[#8DAA5B] hover:bg-[#8DAA5B] text-[#2B1B1A] border-b-4 border-[#8DAA5B]'
                    : 'bg-[#5C1F2A] hover:bg-[#5C1F2A] text-[#FFF8EE] border-b-4 border-[#3D1119]'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
