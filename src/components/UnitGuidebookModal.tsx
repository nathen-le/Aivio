import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, CheckCircle2, AlertTriangle, Layers, Database, Cpu } from 'lucide-react';
import { sound } from '../utils/sound';

interface UnitGuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitGuidebookModal: React.FC<UnitGuidebookModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Portaled to <body> so no transformed/overflow-clipped page ancestor can
  // re-anchor this fixed overlay away from the viewport.
  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guidebook-title"
        className="max-w-2xl w-full bg-[#FFFDF9] border-2 border-[#5C1F2A] rounded-3xl p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(92,31,42,0.3)] max-h-[90vh] max-h-[90dvh] overflow-y-auto overscroll-contain text-[#2B1B1A]"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-[#E8DCCB] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5C1F2A] text-[#FFF8EE] flex items-center justify-center font-black shadow-lg border-b-4 border-[#3D1119]">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#5C1F2A]">
                Unit 1 Reference
              </span>
              <h2 id="guidebook-title" className="text-2xl font-black text-[#2B1B1A] tracking-tight">
                AI Foundations Guidebook
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close guidebook"
            className="p-2 rounded-xl bg-[#F6EFE4] hover:bg-[#5C1F2A] border border-[#E8DCCB] text-[#4D3B38] hover:text-[#2B1B1A] transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Key Concept 1 */}
        <div className="mb-6 p-4 rounded-2xl bg-[#F6EFE4] border-2 border-[#F1E6D6]">
          <h3 className="font-extrabold text-base text-[#7A2B37] flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-[#5C1F2A]" /> 1. The Core Formula
          </h3>
          <p className="text-xs sm:text-sm text-[#2B1B1A] leading-relaxed mb-3">
            Traditional software relies on human programmers hand-writing every rule. Machine learning inverts this entirely:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E8DCCB]">
              <span className="text-[#857670] font-bold block mb-1">Traditional Code:</span>
              <span className="text-[#4F6B2A] font-bold">Rules + Data = Answers</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F6EFE4] border border-[#5C1F2A]/60">
              <span className="text-[#7A2B37] font-bold block mb-1">Machine Learning:</span>
              <span className="text-[#5C1F2A] font-bold">Data + Answers = Learned Rules</span>
            </div>
          </div>
        </div>

        {/* Key Concept 2: The 3 Paradigms */}
        <div className="mb-6 p-4 rounded-2xl bg-[#F6EFE4] border-2 border-[#F1E6D6]">
          <h3 className="font-extrabold text-base text-[#2B1B1A] flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-[#2B1B1A]" /> 2. Three Machine Learning Methods
          </h3>
          <ul className="space-y-2.5 text-xs text-[#2B1B1A]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5C1F2A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2B1B1A]">Supervised Learning:</strong> Learning with labeled flashcards (e.g., photo labeled "cat").
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2B1B1A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2B1B1A]">Unsupervised Learning:</strong> Finding hidden clusters in unlabeled data (e.g., Spotify music taste groups).
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4F6B2A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2B1B1A]">Reinforcement Learning:</strong> Learning by trial, error, and game rewards/penalties (e.g., AlphaGo, self-driving cars).
              </div>
            </li>
          </ul>
        </div>

        {/* Key Concept 3: The Russian Nesting Dolls */}
        <div className="mb-6 p-4 rounded-2xl bg-[#F6EFE4] border-2 border-[#F1E6D6]">
          <h3 className="font-extrabold text-base text-[#4F6B2A] flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-[#4F6B2A]" /> 3. The AI Taxonomy
          </h3>
          <p className="text-xs text-[#4D3B38] leading-relaxed mb-2">
            Always remember the hierarchy from largest to most specific:
          </p>
          <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E8DCCB] text-xs font-mono text-center text-[#7A2B37] font-bold">
            Artificial Intelligence ➔ Machine Learning ➔ Deep Learning ➔ Generative AI
          </div>
        </div>

        {/* Key Concept 4: Hallucinations Warning */}
        <div className="mb-6 p-4 rounded-2xl bg-[#FBE9A6] border-2 border-[#F2B93B]/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#8A5A00] shrink-0 mt-0.5" />
          <div className="text-xs text-[#8A5A00]">
            <strong className="text-[#2B1B1A] block mb-0.5 font-bold">Golden Rule on AI Hallucinations:</strong>
            LLMs do not query a database of verified physical truth; they generate statistically probable word sequences. Never cite an AI claim without independent source verification!
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-[#5C1F2A] hover:bg-[#5C1F2A] text-[#FFF8EE] font-black text-sm uppercase tracking-wider border-b-4 border-[#3D1119] active:translate-y-1 active:border-b-0 transition-all shadow-lg"
        >
          Got It, Back to Lesson Path
        </button>
      </div>
    </div>,
    document.body,
  );
};
