import React from 'react';
import { ArrowRight, RefreshCw, Layers, Sparkles, Database, Code2, Cpu } from 'lucide-react';

interface VisualDiagramProps {
  type: 'ai-definition' | 'traditional-vs-ml' | 'ml-loop' | 'ai-family-tree' | 'capabilities-matrix' | 'comparison';
}

export const VisualDiagram: React.FC<VisualDiagramProps> = ({ type }) => {
  switch (type) {
    case 'traditional-vs-ml':
      return (
        <div className="my-5 p-5 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] shadow-xl">
          <h4 className="text-xs uppercase font-black tracking-wider text-[#1cb0f6] mb-4 text-center">
            How The Machine Learning Paradigm Inverts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traditional Software */}
            <div className="p-4 rounded-2xl bg-[#132344] border-2 border-[#1c325c] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                  Traditional Programming
                </span>
                <div className="flex flex-col gap-2 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0c162c] border border-[#1f3764]">
                    <Code2 className="w-4 h-4 text-sky-400" />
                    <span>Human Rules (Code)</span>
                  </div>
                  <div className="text-center text-slate-500 font-black">+</div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0c162c] border border-[#1f3764]">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span>Input Data</span>
                  </div>
                  <div className="flex items-center justify-center py-1 text-slate-400">
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/70 border-2 border-emerald-500/50 text-emerald-300 font-black text-center">
                    Answers (Output)
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 italic font-medium">
                Rules must be explicitly predicted and coded by humans.
              </p>
            </div>

            {/* Machine Learning */}
            <div className="p-4 rounded-2xl bg-[#14264c] border-2 border-[#1cb0f6] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-[#1cb0f6] uppercase tracking-wider">
                    Machine Learning
                  </span>
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#1cb0f6] text-slate-950 font-black">
                    INVERTED!
                  </span>
                </div>
                <div className="flex flex-col gap-2 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0c162c] border border-[#1f3764]">
                    <Database className="w-4 h-4 text-[#1cb0f6]" />
                    <span>Training Data (Examples)</span>
                  </div>
                  <div className="text-center text-cyan-400 font-black">+</div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0c162c] border border-[#1f3764]">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Correct Answers (Labels)</span>
                  </div>
                  <div className="flex items-center justify-center py-1 text-[#1cb0f6]">
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#1b3464] border-2 border-[#1cb0f6] text-white font-black text-center shadow-lg shadow-cyan-950/60">
                    Learned Rules (Model)
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-cyan-200 mt-3 italic font-medium">
                Computer analyzes examples to generate its own pattern rules.
              </p>
            </div>
          </div>
        </div>
      );

    case 'ai-family-tree':
      return (
        <div className="my-5 p-5 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] shadow-xl">
          <h4 className="text-xs uppercase font-black tracking-wider text-purple-400 mb-4 text-center">
            The AI Family Tree (Nested Subsets)
          </h4>
          <div className="p-4 sm:p-6 rounded-3xl bg-[#142344] border-2 border-[#1cb0f6]/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#1cb0f6] flex items-center gap-1.5 uppercase">
                <Cpu className="w-4 h-4" /> Artificial Intelligence (Broadest Field)
              </span>
              <span className="text-[10px] text-sky-300 font-bold">Est. 1950s</span>
            </div>

            <div className="p-3 sm:p-5 rounded-2xl bg-[#17254c] border-2 border-purple-500/50 my-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-purple-400 flex items-center gap-1.5 uppercase">
                  <Database className="w-4 h-4" /> Machine Learning (Learning from Data)
                </span>
                <span className="text-[10px] text-purple-300 font-bold">Est. 1980s</span>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[#1b2b57] border-2 border-indigo-400/60 my-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5 uppercase">
                    <Layers className="w-4 h-4" /> Deep Learning (Neural Networks)
                  </span>
                  <span className="text-[10px] text-indigo-300 font-bold">Est. 2010s</span>
                </div>

                <div className="p-3 rounded-lg bg-[#271d47] border-2 border-amber-400 text-center">
                  <span className="text-xs font-black text-amber-300 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> Generative AI & Large Language Models
                  </span>
                  <p className="text-[10px] text-amber-200 mt-1 font-medium">
                    ChatGPT, Claude, Midjourney, Sora (Creating novel content)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'ml-loop':
      return (
        <div className="my-5 p-5 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] shadow-xl">
          <h4 className="text-xs uppercase font-black tracking-wider text-[#1cb0f6] mb-4 text-center flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#1cb0f6] animate-spin" /> The 4-Step Training Loop
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3.5 rounded-2xl bg-[#142344] border-2 border-[#1cb0f6]/40">
              <span className="w-6 h-6 rounded-full bg-[#1cb0f6] text-slate-950 font-black inline-flex items-center justify-center text-xs mb-1.5 shadow">
                1
              </span>
              <h5 className="font-black text-white text-xs">Forward Pass</h5>
              <p className="text-[10px] text-slate-300 mt-1 font-medium">Model generates a prediction guess</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#142344] border-2 border-purple-500/40">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-black inline-flex items-center justify-center text-xs mb-1.5 shadow">
                2
              </span>
              <h5 className="font-black text-white text-xs">Calculate Loss</h5>
              <p className="text-[10px] text-slate-300 mt-1 font-medium">Measure error vs ground truth</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#142344] border-2 border-indigo-500/40">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black inline-flex items-center justify-center text-xs mb-1.5 shadow">
                3
              </span>
              <h5 className="font-black text-white text-xs">Gradient Descent</h5>
              <p className="text-[10px] text-slate-300 mt-1 font-medium">Find direction to reduce error</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#142344] border-2 border-emerald-500/40">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black inline-flex items-center justify-center text-xs mb-1.5 shadow">
                4
              </span>
              <h5 className="font-black text-white text-xs">Update Weights</h5>
              <p className="text-[10px] text-slate-300 mt-1 font-medium">Nudge parameters closer to accuracy</p>
            </div>
          </div>
        </div>
      );

    case 'capabilities-matrix':
    default:
      return (
        <div className="my-5 p-5 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] shadow-xl">
          <h4 className="text-xs uppercase font-black tracking-wider text-[#1cb0f6] mb-3 text-center">
            AI Strengths vs. Human Superpowers
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#142344] border-2 border-[#1cb0f6]/40">
              <h5 className="font-black text-[#1cb0f6] flex items-center gap-1.5 mb-2 uppercase text-[11px]">
                ⚡ What AI Excels At
              </h5>
              <ul className="space-y-1.5 text-[11px] text-slate-300 font-medium">
                <li>• Instant processing across millions of data rows</li>
                <li>• Spotting subtle mathematical patterns</li>
                <li>• Translating between 100+ languages</li>
                <li>• Writing boilerplate code & draft summaries</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-[#142344] border-2 border-purple-500/40">
              <h5 className="font-black text-purple-300 flex items-center gap-1.5 mb-2 uppercase text-[11px]">
                🧠 What Humans Do Best
              </h5>
              <ul className="space-y-1.5 text-[11px] text-slate-300 font-medium">
                <li>• Genuine common sense & physical intuition</li>
                <li>• Empathy, emotional intelligence & ethics</li>
                <li>• Fact verification & real-world judgment</li>
                <li>• Original creative intent & purpose</li>
              </ul>
            </div>
          </div>
        </div>
      );
  }
};
