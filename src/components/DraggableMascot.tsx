import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Move, Zap, Lightbulb, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

interface Message {
  id: string;
  sender: 'user' | 'aivo';
  text: string;
  time: string;
}

export const DraggableMascot: React.FC = () => {
  // Draggable position coordinates
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      return {
        x: Math.max(16, window.innerWidth - 130),
        y: Math.max(100, window.innerHeight - 200),
      };
    }
    return { x: 20, y: 100 };
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);

  const containerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'aivo',
      text: "Yo! I'm Aivo, your cool cyber-fox study buddy! 🦊⚡ You can drag me anywhere on your screen. Got a question about AI, neural nets, or today's lessons? Fire away!",
      time: 'Just now',
    },
  ]);

  const quickQuestions = [
    'What is Narrow AI vs AGI?',
    'Why do machines learn instead of using IF rules?',
    'Explain the training loop simply',
    'What is an AI hallucination?',
    'How do I earn the Neural Master badge?',
  ];

  // Auto scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag from handle or avatar, not when interacting with open chat form
    if ((e.target as HTMLElement).closest('.chat-window')) return;

    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setHasMoved(true);

    const newX = Math.min(
      Math.max(10, e.clientX - dragStart.x),
      window.innerWidth - (isOpen ? 360 : 90)
    );
    const newY = Math.min(
      Math.max(10, e.clientY - dragStart.y),
      window.innerHeight - (isOpen ? 480 : 90)
    );

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // If clicked without moving, toggle the chat window
    if (!hasMoved) {
      sound.playClick();
      setIsOpen((prev) => !prev);
    }
  };

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) sound.playClick();
  };

  // High school AI knowledge answers database
  const getAIAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('narrow') || q.includes('agi') || q.includes('general')) {
      return "🦊 Great question! Every AI today (ChatGPT, Face ID, TikTok's algorithm) is NARROW AI—superhuman at one specific dataset, but completely clueless outside it. AGI (Artificial General Intelligence) is a theoretical system with flexible human-like common sense across ALL fields. AGI doesn't exist yet!";
    }
    if (q.includes('if') || q.includes('traditional') || q.includes('programming') || q.includes('rules')) {
      return "🦊 In traditional coding, humans hand-write 'Rules + Data = Answers'. But for messy things like recognizing handwriting or cats, humans can't write millions of IF/ELSE rules! Machine learning INVERTS this: we give it 'Data + Answers = Learned Rules'. The computer finds the patterns!";
    }
    if (q.includes('train') || q.includes('loop') || q.includes('loss') || q.includes('gradient')) {
      return "🦊 The Training Loop has 4 steps: 1) Forward Pass (model guesses), 2) Loss Function (measures how wrong the guess was), 3) Gradient Descent (calculates which way to turn the dials), 4) Update Weights (nudges parameters to be slightly less wrong). Repeat millions of times!";
    }
    if (q.includes('hallucinat') || q.includes('fake') || q.includes('lie') || q.includes('wrong')) {
      return "🦊 An AI Hallucination is when an LLM invents fake facts, quotes, or citations with 100% polite confidence! Remember: models predict likely word sequences; they don't have a verified ground-truth world model. Always double-check citations!";
    }
    if (q.includes('badge') || q.includes('master') || q.includes('xp') || q.includes('streak')) {
      return "🦊 To earn the legendary 'Neural Master' badge (+100 XP), complete all 5 lessons in Unit 1! To keep your streak burning, complete at least one lesson each day. Replaying lessons also awards review bonus XP!";
    }
    if (q.includes('generative') || q.includes('deep learning') || q.includes('family')) {
      return "🦊 Think of Russian nesting dolls: Artificial Intelligence is the whole toy. Inside is Machine Learning (learning from data). Inside that is Deep Learning (multi-layer neural nets). And inside that is Generative AI (transformers that invent new text, code, or images)!";
    }

    return `🦊 Love your curiosity! In AI, remember the golden rule: models are probabilistic pattern detectors trained on giant datasets. Keep working through the Unit 1 lesson path—every concept connects together! What else can I break down for you?`;
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
        {
          id: (Date.now() + 1).toString(),
          sender: 'aivo',
          text: answer,
          time: 'Now',
        },
      ]);
    }, 700);
  };

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
      }}
      className="fixed top-0 left-0 z-50 select-none transition-shadow"
    >
      {/* Closed Draggable Bubble Avatar */}
      {!isOpen && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative group cursor-grab active:cursor-grabbing p-1.5 rounded-full bg-gradient-to-tr from-[#0284c7] via-[#1cb0f6] to-[#38bdf8] shadow-[0_8px_25px_rgba(28,176,246,0.5)] border-2 border-white/60 hover:scale-110 active:scale-95 transition-transform duration-200 ${
            isDragging ? 'scale-105' : 'animate-float'
          }`}
          title="Drag me anywhere! Click to chat with Aivo"
        >
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 rounded-full bg-cyan-400 blur-sm opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none" />

          {/* Fox Avatar Face */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-slate-900 bg-slate-950 relative">
            <img
              src="/mascot-fox-avatar.jpg"
              alt="Aivo the Cyber Fox"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Floating Lightning Badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 shadow-md">
            <Zap className="w-3.5 h-3.5 fill-slate-950 stroke-[2.5]" />
          </div>

          {/* Drag Handle Indicator */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900/90 border border-cyan-400/50 text-[9px] font-black uppercase text-cyan-300 tracking-wider flex items-center gap-0.5 pointer-events-none shadow-sm whitespace-nowrap">
            <Move className="w-2.5 h-2.5" /> Aivo
          </div>
        </div>
      )}

      {/* Expanded Interactive Chat Dialog with Aivo */}
      {isOpen && (
        <div className="chat-window w-[340px] sm:w-[380px] rounded-3xl bg-[#0f1d38] border-2 border-[#1cb0f6] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(28,176,246,0.3)] backdrop-blur-xl flex flex-col overflow-hidden animate-fade-in text-white">
          {/* Header Bar with Drag Handle */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="px-4 py-3 bg-gradient-to-r from-[#0284c7] via-[#1cb0f6] to-[#0284c7] border-b-2 border-[#1899d6] flex items-center justify-between cursor-grab active:cursor-grabbing text-slate-950"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-slate-900 shrink-0 shadow-md">
                <img
                  src="/mascot-fox-avatar.jpg"
                  alt="Aivo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-950 tracking-tight leading-none flex items-center gap-1.5">
                  Aivo Cyber-Fox
                  <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
                </h3>
                <p className="text-[10px] font-bold text-sky-950 uppercase tracking-wider mt-0.5">
                  AI Study Companion • Drag me anywhere
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-slate-950 transition-colors"
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-slate-950 transition-colors"
                title="Minimize Aivo"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-[#132344] border-b border-[#1f3764] flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold text-sky-300 scrollbar-none">
            <span className="shrink-0 text-amber-400 flex items-center gap-0.5 text-[10px] uppercase font-bold">
              <Lightbulb className="w-3 h-3" /> Quick:
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-[#1b315b] hover:bg-[#1cb0f6] hover:text-slate-950 border border-[#2b4b86] hover:border-white transition-all whitespace-nowrap active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="p-4 flex-1 h-[260px] overflow-y-auto space-y-3 text-xs leading-relaxed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'aivo' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-400 shrink-0 bg-slate-900 mt-1">
                    <img
                      src="/mascot-fox-avatar.jpg"
                      alt="Aivo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-[#1cb0f6] text-slate-950 font-semibold rounded-br-none border-b-2 border-[#1899d6]'
                      : 'bg-[#172b50] text-slate-100 rounded-bl-none border border-[#27467c]'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-70 block mt-1 text-right font-mono">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-cyan-300 text-xs italic bg-[#172b50] p-2.5 rounded-2xl w-fit border border-[#27467c]">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Aivo is synthesizing an answer...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0d182e] border-t-2 border-[#1a3059] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Aivo any question about AI..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#142546] border border-[#26447a] text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#1cb0f6] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#1cb0f6] hover:bg-[#25b8fc] disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold transition-all border-b-2 border-[#1899d6] active:border-b-0 active:translate-y-0.5"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
