import React from 'react';
import { ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import { VisualDiagram } from './VisualDiagram';
import { sound } from '../utils/sound';
import type { ContentBlock } from '../types/lesson';

interface ContentCardProps {
  block: ContentBlock;
  onContinue: () => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ block, onContinue }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-between min-h-[460px] select-none">
      <div>
        {/* Highlight Badges / Tags */}
        {block.highlightBadges && block.highlightBadges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {block.highlightBadges.map((badge, idx) => (
              <span
                key={idx}
                className="text-[11px] uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#132344] text-[#1cb0f6] border border-[#1cb0f6]/40"
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* Heading & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          {block.heading}
        </h2>
        {block.subtitle && (
          <p className="text-sm font-bold text-sky-400 mb-5">{block.subtitle}</p>
        )}

        {/* Body Paragraphs */}
        <div className="space-y-3.5 text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
          {block.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Visual Diagram */}
        {block.visualType && <VisualDiagram type={block.visualType} />}

        {/* Bullet Points */}
        {block.bulletPoints && block.bulletPoints.length > 0 && (
          <div className="my-5 p-4 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] space-y-2.5">
            {block.bulletPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#1cb0f6] shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        )}

        {/* Key Takeaway Highlight Box */}
        {block.keyTakeaway && (
          <div className="my-4 p-4 rounded-3xl bg-gradient-to-r from-[#0d2146] via-[#122852] to-[#0d2146] border-2 border-[#1cb0f6]/60 flex items-start gap-3.5 shadow-lg">
            <Lightbulb className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] uppercase font-black tracking-wider text-amber-400 block mb-0.5">
                Key Takeaway
              </span>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                {block.keyTakeaway}
              </p>
            </div>
          </div>
        )}

        {/* Mascot Cat Pro Tip */}
        {block.mascotTip && (
          <div className="my-4 p-4 rounded-3xl bg-[#0f1d38] border-2 border-[#1cb0f6]/40 flex items-center gap-3.5 shadow-md">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#1cb0f6] bg-[#0c1a30] p-1 shrink-0 shadow-md flex items-center justify-center">
              <img src="/mascot-cat-avatar.png" alt="Aivo" className="w-full h-full object-contain" />
            </div>
            <div className="text-xs text-sky-200 leading-relaxed font-medium">
              <span className="font-black text-[#1cb0f6] block mb-0.5 uppercase tracking-wider text-[11px]">
                Aivo's Insight:
              </span>
              {block.mascotTip}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Continue 3D Button */}
      <div className="mt-8 pt-4 border-t-2 border-[#1c325c] flex justify-end">
        <button
          onClick={() => {
            sound.playClick();
            onContinue();
          }}
          className="px-10 py-4 rounded-2xl bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 font-black text-sm uppercase tracking-wider border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all shadow-xl shadow-cyan-500/25 flex items-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
