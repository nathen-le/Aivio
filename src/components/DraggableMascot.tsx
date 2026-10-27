import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Zap, Lightbulb, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface Message {
  id: string;
  sender: 'user' | 'aivo';
  text: string;
  time: string;
}

const quickQuestions = [
  'Narrow AI vs AGI?',
  'How does ML work?',
  'Explain training loop',
  'AI hallucinations?',
  'How do LLMs work?',
];

const getAIAnswer = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('narrow') || q.includes('agi') || q.includes('general'))
    return "🐱 Every AI today—ChatGPT, Face ID, TikTok's algorithm—is Narrow AI: superhuman at one task but clueless outside it. AGI, a system with flexible human-like reasoning across ALL fields, doesn't exist yet!";
  if (q.includes('if') || q.includes('ml') || q.includes('machine') || q.includes('learn') || q.includes('traditional'))
    return "🐱 Traditional programming: Rules + Data = Answers. ML inverts this: Data + Answers = Learned Rules. Instead of writing millions of IF/ELSE rules for recognizing cats, the model finds its own patterns from millions of examples!";
  if (q.includes('train') || q.includes('loop') || q.includes('loss') || q.includes('gradient'))
    return "🐱 Training loop has 4 steps: 1) Forward Pass (model guesses), 2) Loss Function (how wrong?), 3) Gradient Descent (which way to adjust the dials), 4) Update Weights (nudge parameters). Repeat millions of times until accurate!";
  if (q.includes('hallucinat') || q.includes('fake') || q.includes('lie') || q.includes('wrong'))
    return "🐱 AI Hallucination = when an LLM confidently invents fake facts, quotes, or citations. Models predict likely word sequences—they don't have a verified fact database. Always double-check citations from AI!";
  if (q.includes('predict') || q.includes('word') || q.includes('token') || q.includes('llm'))
    return "🐱 LLMs break text into tokens and predict the most likely next token based on billions of training pages. It's extremely powerful autocomplete—the magic comes from massive scale pattern-matching!";
  if (q.includes('badge') || q.includes('xp') || q.includes('streak'))
    return "🐱 You earn XP and badges by finishing lesson nodes and scoring 100% on challenges! Daily streaks give you bonus multipliers. Check the Leagues tab to compete with your classmates!";
  return "🐱 Great curiosity! In AI, models are probabilistic pattern detectors trained on giant datasets. Every concept in the lesson path connects together. Keep going—you've got this! What else can I break down?";
};

export const DraggableMascot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'aivo',
      text: "Hey! I'm Aivo, your AI study companion 🐱⚡ Ask me anything about neural nets, machine learning, or today's lessons!",
      time: 'Just now',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasNewMessage(false);
    }
  }, [messages, isOpen, isTyping]);

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) sound.playClick();
  };

  const handleOpen = () => {
    sound.playClick();
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleClose = () => {
    sound.playClick();
    setIsOpen(false);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sound.playClick();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: 'Now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      sound.playCorrect();
      setIsTyping(false);
      const answer = getAIAnswer(text);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'aivo', text: answer, time: 'Now' },
      ]);
      if (!isOpen) setHasNewMessage(true);
    }, 750);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">

      {/* ── Chat Panel (slides up when open) ── */}
      {isOpen && (
        <div className="w-[340px] sm:w-[360px] rounded-3xl bg-[#0b1628] border border-[#1cb0f6]/50 shadow-[0_24px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(28,176,246,0.18)] overflow-hidden animate-slide-up">

          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#0c1d3e] via-[#11254a] to-[#0c1d3e] border-b border-[#1cb0f6]/25 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border-2 border-[#1cb0f6]/70 bg-[#091628] flex items-center justify-center p-1 shadow-[0_0_14px_rgba(28,176,246,0.3)]">
                <img src="/mascot-cat-avatar.png" alt="Aivo" className="w-full h-full object-contain" />
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b1628] shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                  Aivo
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#1cb0f6]/15 text-[#1cb0f6] border border-[#1cb0f6]/30">AI</span>
                </h3>
                <p className="text-[10px] text-sky-400/80 font-bold uppercase tracking-wider">Study Companion • Online</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSound}
                className="p-2 rounded-xl bg-[#142344]/80 hover:bg-[#1b3464] text-sky-400 border border-[#1f3764]/60 hover:border-[#1cb0f6]/40 transition-all"
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-[#142344]/80 hover:bg-rose-950/70 text-slate-400 hover:text-rose-400 border border-[#1f3764]/60 hover:border-rose-800/60 transition-all"
                title="Close Aivo"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Quick prompts bar */}
          <div className="px-3 py-2 bg-[#091525] border-b border-[#142348]/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="shrink-0 flex items-center gap-0.5 text-[9px] font-black uppercase text-amber-400/90">
              <Lightbulb className="w-3 h-3" /> Try:
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => { sound.playClick(); handleSendMessage(q); }}
                className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0f1e38] hover:bg-[#1cb0f6] hover:text-slate-950 text-sky-300 border border-[#1f3764]/70 hover:border-transparent transition-all whitespace-nowrap active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages area */}
          <div className="p-3.5 h-[240px] overflow-y-auto space-y-3 text-xs leading-relaxed bg-[#070f1e]/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {msg.sender === 'aivo' && (
                  <div className="w-7 h-7 rounded-full border border-[#1cb0f6]/50 shrink-0 bg-[#0c1a36] mt-0.5 flex items-center justify-center p-0.5">
                    <img src="/mascot-cat-avatar.png" alt="Aivo" className="w-full h-full object-contain" />
                  </div>
                )}
                <div
                  className={`max-w-[83%] px-3 py-2.5 rounded-2xl shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#1cb0f6] text-slate-950 font-semibold rounded-br-md border-b-[3px] border-[#1899d6]'
                      : 'bg-[#0f1e38] text-slate-100 rounded-bl-md border border-[#1c3060]/80'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-50 block mt-1 text-right font-mono">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-cyan-300 text-xs italic bg-[#0f1e38] px-3 py-2.5 rounded-2xl w-fit border border-[#1c3060]/80 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
                <span className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-[#05090f] border-t border-[#142348]/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about AI, neural nets..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0f1d38] border border-[#1f3764]/70 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#1cb0f6]/70 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#1cb0f6] hover:bg-[#2bbef8] disabled:bg-[#111e34] disabled:text-slate-600 text-slate-950 font-bold transition-all border-b-[3px] border-[#1899d6] disabled:border-[#0c1828] active:border-b-0 active:translate-y-0.5"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}

      {/* ── FAB Button ── */}
      <div className="relative">
        {/* Pulsing outer ring when closed */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-[#1cb0f6]/20 animate-ping pointer-events-none scale-150" />
        )}

        <button
          onClick={isOpen ? handleClose : handleOpen}
          className={`relative w-[62px] h-[62px] rounded-full flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? 'bg-[#0f1d38] border-2 border-[#1cb0f6]/50 hover:bg-[#162848] active:scale-95 shadow-[0_8px_24px_rgba(0,0,0,0.6)]'
              : 'bg-gradient-to-tr from-[#0c7ec7] via-[#1cb0f6] to-[#3dc8ff] border-2 border-white/35 hover:scale-110 active:scale-95 shadow-[0_8px_28px_rgba(28,176,246,0.65)] animate-float'
          }`}
          aria-label={isOpen ? 'Close Aivo chat' : 'Open Aivo AI chat'}
        >
          {/* Soft glow behind when open */}
          {isOpen && (
            <div className="absolute inset-0 rounded-full bg-[#1cb0f6] blur-lg opacity-15 pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-sky-300 stroke-[2.5] relative z-10" />
          ) : (
            <>
              {/* Glow aura */}
              <div className="absolute inset-0 rounded-full bg-cyan-300 blur-md opacity-20 pointer-events-none" />
              <img
                src="/mascot-cat-avatar.png"
                alt="Open Aivo AI chat"
                className="w-10 h-10 object-contain relative z-10 drop-shadow-lg"
              />
              {/* New message indicator OR default Zap badge */}
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0a1224] flex items-center justify-center z-10 shadow-md ${hasNewMessage ? 'bg-rose-500 animate-bounce' : 'bg-amber-400'}`}>
                {hasNewMessage
                  ? <MessageCircle className="w-2.5 h-2.5 fill-white stroke-[2]" />
                  : <Zap className="w-2.5 h-2.5 fill-slate-950 stroke-[2]" />
                }
              </div>
            </>
          )}
        </button>

        {/* Tooltip label on closed state (hover) */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 rounded-xl bg-[#0f1d38] border border-[#1cb0f6]/40 text-[10px] font-black text-white whitespace-nowrap shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Ask Aivo AI
          </div>
        )}
      </div>
    </div>
  );
};
