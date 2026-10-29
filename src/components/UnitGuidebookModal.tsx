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
        className="max-w-2xl w-full bg-[#0f1d38] border-2 border-[#1cb0f6] rounded-3xl p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(28,176,246,0.3)] max-h-[90vh] max-h-[90dvh] overflow-y-auto overscroll-contain text-white"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-[#1c325c] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1cb0f6] text-slate-950 flex items-center justify-center font-black shadow-lg border-b-4 border-[#1899d6]">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1cb0f6]">
                Unit 1 Reference
              </span>
              <h2 id="guidebook-title" className="text-2xl font-black text-white tracking-tight">
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
            className="p-2 rounded-xl bg-[#16274a] hover:bg-[#203766] border border-[#26447a] text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Key Concept 1 */}
        <div className="mb-6 p-4 rounded-2xl bg-[#142344] border-2 border-[#1f3764]">
          <h3 className="font-extrabold text-base text-cyan-300 flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-[#1cb0f6]" /> 1. The Core Formula
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
            Traditional software relies on human programmers hand-writing every rule. Machine learning inverts this entirely:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
              <span className="text-slate-400 font-bold block mb-1">Traditional Code:</span>
              <span className="text-emerald-400 font-bold">Rules + Data = Answers</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e274b] border border-[#1cb0f6]/60">
              <span className="text-cyan-300 font-bold block mb-1">Machine Learning:</span>
              <span className="text-[#1cb0f6] font-bold">Data + Answers = Learned Rules</span>
            </div>
          </div>
        </div>

        {/* Key Concept 2: The 3 Paradigms */}
        <div className="mb-6 p-4 rounded-2xl bg-[#142344] border-2 border-[#1f3764]">
          <h3 className="font-extrabold text-base text-purple-300 flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-purple-400" /> 2. Three Machine Learning Methods
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-200">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1cb0f6] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Supervised Learning:</strong> Learning with labeled flashcards (e.g., photo labeled "cat").
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Unsupervised Learning:</strong> Finding hidden clusters in unlabeled data (e.g., Spotify music taste groups).
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Reinforcement Learning:</strong> Learning by trial, error, and game rewards/penalties (e.g., AlphaGo, self-driving cars).
              </div>
            </li>
          </ul>
        </div>

        {/* Key Concept 3: The Russian Nesting Dolls */}
        <div className="mb-6 p-4 rounded-2xl bg-[#142344] border-2 border-[#1f3764]">
          <h3 className="font-extrabold text-base text-emerald-300 flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-emerald-400" /> 3. The AI Taxonomy
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-2">
            Always remember the hierarchy from largest to most specific:
          </p>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-center text-cyan-300 font-bold">
            Artificial Intelligence ➔ Machine Learning ➔ Deep Learning ➔ Generative AI
          </div>
        </div>

        {/* Key Concept 4: Hallucinations Warning */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <strong className="text-white block mb-0.5 font-bold">Golden Rule on AI Hallucinations:</strong>
            LLMs do not query a database of verified physical truth; they generate statistically probable word sequences. Never cite an AI claim without independent source verification!
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 font-black text-sm uppercase tracking-wider border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all shadow-lg"
        >
          Got It, Back to Lesson Path
        </button>
      </div>
    </div>,
    document.body,
  );
};
