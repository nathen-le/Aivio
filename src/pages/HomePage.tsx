import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  Zap,
  Flame,
  Check,
  Lock,
} from 'lucide-react';
import { LEARNING_PATHS } from '../data/learningPaths';
import { sound } from '../utils/sound';

interface HomePageProps {
  onStartLearning: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartLearning,
}) => {
  const [miniAnswer, setMiniAnswer] = useState<string | null>(null);
  const [miniSubmitted, setMiniSubmitted] = useState<boolean>(false);

  const handleMiniSubmit = (option: string) => {
    setMiniAnswer(option);
    setMiniSubmitted(true);
    if (option === 'B') {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none pb-24 lg:pb-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pt-8 sm:pb-20 flex flex-col items-center text-center">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#1cb0f6]/20 via-[#0284c7]/15 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Hero Grid with Big Cool Blue Mascot Artwork */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left my-4 w-full max-w-6xl">
          {/* Left Column: Headline and Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
              Understand AI.{' '}
              <span className="bg-gradient-to-r from-[#1cb0f6] via-[#38bdf8] to-cyan-300 bg-clip-text text-transparent">
                Master the Future.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-xl mb-8">
              Interactive, gamified AI education crafted specifically for high schoolers. Master machine learning intuition, test real concepts, and think critically—all at your own pace.
            </p>

            {/* Chunky 3D CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8">
              <button
                onClick={() => {
                  sound.playClick();
                  onStartLearning();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 font-black text-base uppercase tracking-wider border-b-[5px] border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all duration-150 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>

              <a
                href="#learning-paths"
                onClick={() => sound.playClick()}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#142344] hover:bg-[#1a2e58] border-b-[5px] border-[#0c182e] text-[#1cb0f6] font-black text-base uppercase tracking-wider active:translate-y-1 active:border-b-0 transition-all duration-150 flex items-center justify-center"
              >
                VIEW CURRICULUM
              </a>
            </div>

            {/* Quick Proof Points */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-black text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#132344] border border-[#1f3764]">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span>Daily Streaks</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#132344] border border-[#1f3764]">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Earn XP & Badges</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#132344] border border-[#1f3764]">
                <span>💎</span>
                <span>Data Crystals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cool Blue Mascot Character Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm rounded-3xl p-5 bg-[#0f1d38] border-2 border-[#1cb0f6] shadow-[0_15px_40px_rgba(28,176,246,0.35)] flex flex-col items-center text-center">
              {/* Cat Mascot Artwork */}
              <div className="w-64 h-64 rounded-2xl overflow-hidden mb-4 shadow-xl border-2 border-white/20 bg-white relative group flex items-center justify-center p-2">
                <img
                  src="/mascot-cat-celebrate.png"
                  alt="Aivo the Cool Blue Cyber Cat"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-400 text-[10px] font-black uppercase text-cyan-300 shadow-md">
                  MEET AIVO 🐱
                </div>
              </div>

              {/* Speech bubble */}
              <div className="p-3.5 rounded-2xl bg-[#142344] border border-[#1f3764] text-xs font-bold text-slate-200 mb-3 text-left w-full shadow-md">
                <span className="text-[#1cb0f6] font-black block mb-0.5">
                  Aivo says:
                </span>
                "Drag me anywhere on your screen! Ask me questions, test concepts, and level up together!"
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onStartLearning();
                }}
                className="w-full py-2.5 rounded-xl bg-[#1cb0f6] hover:bg-[#25b8fc] text-slate-950 font-black text-xs uppercase tracking-wider border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all"
              >
                PLAY LESSON 1 NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Main Goals Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t-2 border-[#1c325c]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#132344] text-[#1cb0f6] border border-[#1f3764]">
            Why High Schoolers Love Aivio
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-2">
            The Three Pillars of AI Mastery
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Learn with bite-sized cards, interactive sorting, and immediate feedback instead of passive video lectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] hover:border-[#1cb0f6] transition-all duration-200 flex flex-col justify-between group shadow-lg">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#142344] border-2 border-[#1cb0f6]/50 text-[#1cb0f6] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md">
                <BrainCircuit className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-black text-[#1cb0f6] uppercase tracking-wider block mb-1">
                Pillar 1
              </span>
              <h3 className="text-xl font-black text-white mb-2">Understand AI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Demystify algorithms, neural network layers, and training data loops. See why machine learning is pattern discovery rather than hand-coded rules.
              </p>
            </div>
            <ul className="mt-6 pt-5 border-t border-[#1c325c] space-y-2 text-xs font-bold text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1cb0f6] stroke-[3]" /> Supervised & reinforcement learning
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1cb0f6] stroke-[3]" /> How neural networks adjust weights
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] hover:border-purple-400 transition-all duration-200 flex flex-col justify-between group shadow-lg">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#142344] border-2 border-purple-400/50 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md">
                <Wrench className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider block mb-1">
                Pillar 2
              </span>
              <h3 className="text-xl font-black text-white mb-2">Use AI Tools</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Learn modern prompt engineering frameworks, code explanation workflows, and how to treat generative AI as an intellectual thought partner.
              </p>
            </div>
            <ul className="mt-6 pt-5 border-t border-[#1c325c] space-y-2 text-xs font-bold text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-400 stroke-[3]" /> Role, Task, Context prompt engineering
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-400 stroke-[3]" /> Study decks & research synthesis
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-[#0f1d38] border-2 border-[#1c325c] hover:border-emerald-400 transition-all duration-200 flex flex-col justify-between group shadow-lg">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#142344] border-2 border-emerald-400/50 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md">
                <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block mb-1">
                Pillar 3
              </span>
              <h3 className="text-xl font-black text-white mb-2">Think Critically</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Spot hallucinations, investigate historic dataset bias, analyze copyright and deepfakes, and understand environmental and societal impacts.
              </p>
            </div>
            <ul className="mt-6 pt-5 border-t border-[#1c325c] space-y-2 text-xs font-bold text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> Fact verification & hallucination checks
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> Algorithmic bias and fairness in data
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mini Interactive Preview Challenge with Audio */}
      <section className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1d38] border-2 border-[#1cb0f6] shadow-2xl">
          <div className="flex items-center gap-2 text-xs uppercase font-black tracking-wider text-[#1cb0f6] mb-2">
            <Sparkles className="w-4 h-4" /> Try a 10-Second Concept Check
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
            Can you spot the machine learning difference?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mb-5 font-medium">
            In traditional programming, humans write <strong>Rules + Data = Answers</strong>. What does Machine Learning do?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => handleMiniSubmit('A')}
              className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all border-b-4 ${
                miniSubmitted && miniAnswer === 'A'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                  : 'bg-[#142344] border-[#1f3764] hover:border-slate-500 text-slate-200'
              }`}
            >
              A) Magic + Electricity = Thinking Robot
            </button>
            <button
              onClick={() => handleMiniSubmit('B')}
              className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all border-b-4 ${
                miniSubmitted && miniAnswer === 'B'
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-[#142344] border-[#1f3764] hover:border-[#1cb0f6] text-slate-200'
              }`}
            >
              B) Data + Answers = Learned Rules
            </button>
          </div>

          {miniSubmitted && (
            <div
              className={`p-4 rounded-2xl border-2 text-xs sm:text-sm leading-relaxed animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-4 ${
                miniAnswer === 'B'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-500 text-rose-200'
              }`}
            >
              <span>
                {miniAnswer === 'B'
                  ? '🎉 Ding! Spot on! In Machine Learning, the system discovers rules automatically from examples.'
                  : '⚠️ Not quite! B is correct: Machine Learning inverts the pipeline so algorithms learn rules from data.'}
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  onStartLearning();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#1cb0f6] text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 hover:bg-[#25b8fc] border-b-2 border-[#1899d6]"
              >
                Go to Lesson 1
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Six Learning Paths Section */}
      <section
        id="learning-paths"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t-2 border-[#1c325c] scroll-mt-20"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-black tracking-wider text-[#1cb0f6] block mb-1">
              Curriculum Roadmap
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Six Comprehensive Learning Paths
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onStartLearning();
            }}
            className="flex items-center gap-1.5 text-xs uppercase font-black text-[#1cb0f6] hover:underline"
          >
            <span>Open Learning Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARNING_PATHS.map((path) => {
            const isAvailable = path.status === 'available';

            return (
              <div
                key={path.id}
                onClick={() => {
                  if (isAvailable) {
                    sound.playClick();
                    onStartLearning();
                  }
                }}
                className={`p-6 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between ${
                  isAvailable
                    ? 'bg-[#0f1d38] border-[#1cb0f6] shadow-[0_10px_25px_rgba(28,176,246,0.25)] hover:-translate-y-1 cursor-pointer'
                    : 'bg-[#0f1d38]/50 border-[#1c325c] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border ${path.colorTheme.badge}`}
                    >
                      {path.difficulty} • {path.gradeLevel}
                    </span>
                    {isAvailable ? (
                      <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> COMING SOON
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-white mb-2">{path.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {path.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-[#1c325c] flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">{path.totalLessons} Lessons</span>
                  {isAvailable ? (
                    <span className="text-[#1cb0f6] font-black flex items-center gap-1">
                      START PATH <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">In Development</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
