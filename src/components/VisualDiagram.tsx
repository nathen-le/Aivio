import React from 'react';
import { ArrowRight, RefreshCw, Layers, Sparkles, Database, Code2, Cpu } from 'lucide-react';

interface VisualDiagramProps {
  type: 'ai-definition' | 'traditional-vs-ml' | 'ml-loop' | 'ai-family-tree' | 'capabilities-matrix' | 'comparison';
}

export const VisualDiagram: React.FC<VisualDiagramProps> = ({ type }) => {
  switch (type) {
    case 'traditional-vs-ml':
      return (
        <div className="my-5 p-5 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] shadow-xl">
          <h4 className="text-xs uppercase font-black tracking-wider text-[#5C1F2A] mb-4 text-center">
            How The Machine Learning Paradigm Inverts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traditional Software */}
            <div className="p-4 rounded-2xl bg-[#F6EFE4] border-2 border-[#E8DCCB] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-black text-[#857670] uppercase tracking-wider block mb-2">
                  Traditional Programming
                </span>
                <div className="flex flex-col gap-2 font-mono text-xs text-[#4D3B38]">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFFDF9] border border-[#F1E6D6]">
                    <Code2 className="w-4 h-4 text-[#7A2B37]" />
                    <span>Human Rules (Code)</span>
                  </div>
                  <div className="text-center text-[#857670] font-black">+</div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFFDF9] border border-[#F1E6D6]">
                    <Database className="w-4 h-4 text-[#2B1B1A]" />
                    <span>Input Data</span>
                  </div>
                  <div className="flex items-center justify-center py-1 text-[#857670]">
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#EEF3E3]/70 border-2 border-[#8DAA5B]/50 text-[#4F6B2A] font-black text-center">
                    Answers (Output)
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#857670] mt-3 italic font-medium">
                Rules must be explicitly predicted and coded by humans.
              </p>
            </div>

            {/* Machine Learning */}
            <div className="p-4 rounded-2xl bg-[#F6EFE4] border-2 border-[#5C1F2A] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-[#5C1F2A] uppercase tracking-wider">
                    Machine Learning
                  </span>
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#5C1F2A] text-[#FFF8EE] font-black">
                    INVERTED!
                  </span>
                </div>
                <div className="flex flex-col gap-2 font-mono text-xs text-[#4D3B38]">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFFDF9] border border-[#F1E6D6]">
                    <Database className="w-4 h-4 text-[#5C1F2A]" />
                    <span>Training Data (Examples)</span>
                  </div>
                  <div className="text-center text-[#7A2B37] font-black">+</div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFFDF9] border border-[#F1E6D6]">
                    <Sparkles className="w-4 h-4 text-[#2B1B1A]" />
                    <span>Correct Answers (Labels)</span>
                  </div>
                  <div className="flex items-center justify-center py-1 text-[#5C1F2A]">
                    <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F1E6D6] border-2 border-[#5C1F2A] text-[#2B1B1A] font-black text-center shadow-lg shadow-[#5C1F2A]/60">
                    Learned Rules (Model)
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#7A2B37] mt-3 italic font-medium">
                Computer analyzes examples to generate its own pattern rules.
              </p>
            </div>
          </div>
        </div>
      );

    case 'ai-family-tree':
      return (
        <div className="my-5 p-5 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] shadow-xl">
          <h4 className="text-xs uppercase font-black tracking-wider text-[#2B1B1A] mb-4 text-center">
            The AI Family Tree (Nested Subsets)
          </h4>
          <div className="p-4 sm:p-6 rounded-3xl bg-[#F6EFE4] border-2 border-[#5C1F2A]/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#5C1F2A] flex items-center gap-1.5 uppercase">
                <Cpu className="w-4 h-4" /> Artificial Intelligence (Broadest Field)
              </span>
              <span className="text-[10px] text-[#7A2B37] font-bold">Est. 1950s</span>
            </div>

            <div className="p-3 sm:p-5 rounded-2xl bg-[#F6EFE4] border-2 border-[#E8DCCB]/50 my-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#2B1B1A] flex items-center gap-1.5 uppercase">
                  <Database className="w-4 h-4" /> Machine Learning (Learning from Data)
                </span>
                <span className="text-[10px] text-[#2B1B1A] font-bold">Est. 1980s</span>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[#5C1F2A] border-2 border-[#E8DCCB]/60 my-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#2B1B1A] flex items-center gap-1.5 uppercase">
                    <Layers className="w-4 h-4" /> Deep Learning (Neural Networks)
                  </span>
                  <span className="text-[10px] text-[#2B1B1A] font-bold">Est. 2010s</span>
                </div>

                <div className="p-3 rounded-lg bg-[#F6EFE4] border-2 border-[#F2B93B] text-center">
                  <span className="text-xs font-black text-[#8A5A00] flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#8A5A00] animate-spin" /> Generative AI & Large Language Models
                  </span>
                  <p className="text-[10px] text-[#8A5A00] mt-1 font-medium">
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
        <div className="my-5 p-5 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] shadow-xl">
          <h4 className="text-xs uppercase font-black tracking-wider text-[#5C1F2A] mb-4 text-center flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#5C1F2A] animate-spin" /> The 4-Step Training Loop
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F6EFE4] border-2 border-[#5C1F2A]/40">
              <span className="w-6 h-6 rounded-full bg-[#5C1F2A] text-[#FFF8EE] font-black inline-flex items-center justify-center text-xs mb-1.5 shadow">
                1
              </span>
              <h5 className="font-black text-[#2B1B1A] text-xs">Forward Pass</h5>
              <p className="text-[10px] text-[#4D3B38] mt-1 font-medium">Model generates a prediction guess</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F6EFE4] border-2 border-[#E8DCCB]/40">
              <span className="w-6 h-6 rounded-full bg-[#5C1F2A] text-[#2B1B1A] font-black inline-flex items-center justify-center text-xs mb-1.5 shadow">
                2
              </span>
              <h5 className="font-black text-[#2B1B1A] text-xs">Calculate Loss</h5>
              <p className="text-[10px] text-[#4D3B38] mt-1 font-medium">Measure error vs ground truth</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F6EFE4] border-2 border-[#E8DCCB]/40">
              <span className="w-6 h-6 rounded-full bg-[#5C1F2A] text-[#2B1B1A] font-black inline-flex items-center justify-center text-xs mb-1.5 shadow">
                3
              </span>
              <h5 className="font-black text-[#2B1B1A] text-xs">Gradient Descent</h5>
              <p className="text-[10px] text-[#4D3B38] mt-1 font-medium">Find direction to reduce error</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F6EFE4] border-2 border-[#8DAA5B]/40">
              <span className="w-6 h-6 rounded-full bg-[#8DAA5B] text-[#2B1B1A] font-black inline-flex items-center justify-center text-xs mb-1.5 shadow">
                4
              </span>
              <h5 className="font-black text-[#2B1B1A] text-xs">Update Weights</h5>
              <p className="text-[10px] text-[#4D3B38] mt-1 font-medium">Nudge parameters closer to accuracy</p>
            </div>
          </div>
        </div>
      );

    case 'capabilities-matrix':
    default:
      return (
        <div className="my-5 p-5 rounded-3xl bg-[#FFFDF9] border-2 border-[#E8DCCB] shadow-xl">
          <h4 className="text-xs uppercase font-black tracking-wider text-[#5C1F2A] mb-3 text-center">
            AI Strengths vs. Human Superpowers
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#F6EFE4] border-2 border-[#5C1F2A]/40">
              <h5 className="font-black text-[#5C1F2A] flex items-center gap-1.5 mb-2 uppercase text-[11px]">
                ⚡ What AI Excels At
              </h5>
              <ul className="space-y-1.5 text-[11px] text-[#4D3B38] font-medium">
                <li>• Instant processing across millions of data rows</li>
                <li>• Spotting subtle mathematical patterns</li>
                <li>• Translating between 100+ languages</li>
                <li>• Writing boilerplate code & draft summaries</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-[#F6EFE4] border-2 border-[#E8DCCB]/40">
              <h5 className="font-black text-[#2B1B1A] flex items-center gap-1.5 mb-2 uppercase text-[11px]">
                🧠 What Humans Do Best
              </h5>
              <ul className="space-y-1.5 text-[11px] text-[#4D3B38] font-medium">
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
