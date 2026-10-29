import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Sparkles, Zap, Lightbulb, Volume2, VolumeX, MessageCircle, Move } from 'lucide-react';
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

const FAB_SIZE = 62;
const EDGE = 8;
const PANEL_GAP = 12;
const DRAG_THRESHOLD = 6;
const POSITION_KEY = 'aivio_helper_position_v1';

interface Fraction {
  fx: number;
  fy: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

const readViewport = () => ({ w: window.innerWidth, h: window.innerHeight });

// Only a pair of 0..1 numbers is stored: where the button sits inside the
// screen. Nothing about the user. Fractions keep it valid across resizes.
function loadPosition(): Fraction | null {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Fraction>;
    if (
      typeof parsed.fx === 'number' && typeof parsed.fy === 'number' &&
      Number.isFinite(parsed.fx) && Number.isFinite(parsed.fy)
    ) {
      return { fx: clamp(parsed.fx, 0, 1), fy: clamp(parsed.fy, 0, 1) };
    }
  } catch {
    /* storage unavailable or corrupt: fall back to the default spot */
  }
  return null;
}

function savePosition(pos: Fraction) {
  try {
    localStorage.setItem(POSITION_KEY, JSON.stringify(pos));
  } catch {
    /* non-fatal */
  }
}

/** Top-left pixel position of the button for a stored fraction. */
function toPixels(pos: Fraction, vw: number, vh: number) {
  return {
    x: EDGE + pos.fx * Math.max(0, vw - FAB_SIZE - EDGE * 2),
    y: EDGE + pos.fy * Math.max(0, vh - FAB_SIZE - EDGE * 2),
  };
}

function toFraction(x: number, y: number, vw: number, vh: number): Fraction {
  const rangeX = Math.max(1, vw - FAB_SIZE - EDGE * 2);
  const rangeY = Math.max(1, vh - FAB_SIZE - EDGE * 2);
  return { fx: clamp((x - EDGE) / rangeX, 0, 1), fy: clamp((y - EDGE) / rangeY, 0, 1) };
}

/**
 * Default spot: bottom-right. Below the lg breakpoint the Sidebar renders a
 * bottom tab bar, so the default sits above it instead of covering it.
 */
function defaultPixels(vw: number, vh: number) {
  const bottomOffset = vw < 1024 ? 88 : 24;
  return {
    x: clamp(vw - FAB_SIZE - 24, EDGE, vw - FAB_SIZE - EDGE),
    y: clamp(vh - FAB_SIZE - bottomOffset, EDGE, vh - FAB_SIZE - EDGE),
  };
}

const CORNERS: Fraction[] = [
  { fx: 1, fy: 1 },
  { fx: 0, fy: 1 },
  { fx: 0, fy: 0 },
  { fx: 1, fy: 0 },
];

export const DraggableMascot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [viewport, setViewport] = useState(readViewport);
  const [savedPos, setSavedPos] = useState<Fraction | null>(loadPosition);
  const [dragPx, setDragPx] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onResize = () => setViewport(readViewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const basePx = savedPos
    ? toPixels(savedPos, viewport.w, viewport.h)
    : defaultPixels(viewport.w, viewport.h);
  const fab = dragPx ?? basePx;
  const isDragging = dragPx !== null;

  const moveTo = useCallback(
    (x: number, y: number, persist: boolean) => {
      const cx = clamp(x, EDGE, viewport.w - FAB_SIZE - EDGE);
      const cy = clamp(y, EDGE, viewport.h - FAB_SIZE - EDGE);
      if (persist) {
        const next = toFraction(cx, cy, viewport.w, viewport.h);
        setSavedPos(next);
        savePosition(next);
      }
      return { x: cx, y: cy };
    },
    [viewport.w, viewport.h],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: fab.x,
      originY: fab.y,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setDragPx(moveTo(d.originX + dx, d.originY + dy, false));
  };

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (d.moved) {
      // The click the browser fires after a drag must not open/close the chat.
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 0);
      moveTo(
        d.originX + (e.clientX - d.startX),
        d.originY + (e.clientY - d.startY),
        true,
      );
      setDragPx(null);
    }
  };

  const handleFabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 64 : 16;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = delta[e.key];
    if (!move) return;
    e.preventDefault();
    moveTo(fab.x + move[0], fab.y + move[1], true);
  };

  const cycleCorner = () => {
    sound.playClick();
    // Next corner after whichever one is currently nearest.
    const cur = toFraction(fab.x, fab.y, viewport.w, viewport.h);
    let nearest = 0;
    let best = Infinity;
    CORNERS.forEach((c, i) => {
      const dist = Math.hypot(c.fx - cur.fx, c.fy - cur.fy);
      if (dist < best) { best = dist; nearest = i; }
    });
    const next = CORNERS[(nearest + 1) % CORNERS.length];
    setSavedPos(next);
    savePosition(next);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        fabRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Chat panel placement: beside the button, flipped above/below depending on
  // where there is room, and always clamped inside the viewport.
  const panelWidth = Math.min(360, viewport.w - EDGE * 2);
  const panelLeft = clamp(fab.x + FAB_SIZE - panelWidth, EDGE, viewport.w - panelWidth - EDGE);
  const spaceAbove = fab.y - PANEL_GAP - EDGE;
  const spaceBelow = viewport.h - (fab.y + FAB_SIZE) - PANEL_GAP - EDGE;
  const panelAbove = spaceAbove >= spaceBelow;
  const panelStyle: React.CSSProperties = {
    width: panelWidth,
    left: panelLeft,
    maxHeight: Math.max(220, panelAbove ? spaceAbove : spaceBelow),
    ...(panelAbove
      ? { bottom: viewport.h - fab.y + PANEL_GAP }
      : { top: fab.y + FAB_SIZE + PANEL_GAP }),
  };

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
    <div className="select-none">

      {/* ── Chat Panel (slides up when open) ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Aivo study companion chat"
          style={panelStyle}
          className="fixed z-50 flex flex-col rounded-3xl bg-[#0b1628] border border-[#1cb0f6]/50 shadow-[0_24px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(28,176,246,0.18)] overflow-hidden animate-slide-up">

          {/* Header */}
          <div className="shrink-0 px-4 py-3 bg-gradient-to-r from-[#0c1d3e] via-[#11254a] to-[#0c1d3e] border-b border-[#1cb0f6]/25 flex items-center justify-between">
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
                onClick={cycleCorner}
                className="p-2 rounded-xl bg-[#142344]/80 hover:bg-[#1b3464] text-sky-400 border border-[#1f3764]/60 hover:border-[#1cb0f6]/40 transition-all"
                title="Move Aivo to another corner"
                aria-label="Move Aivo to another corner of the screen"
              >
                <Move className="w-3.5 h-3.5" />
              </button>
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
          <div className="shrink-0 px-3 py-2 bg-[#091525] border-b border-[#142348]/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
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
          <div className="p-3.5 flex-[0_1_240px] min-h-[96px] overflow-y-auto space-y-3 text-xs leading-relaxed bg-[#070f1e]/60">
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
            className="shrink-0 p-3 bg-[#05090f] border-t border-[#142348]/80 flex items-center gap-2"
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
      <div
        className="fixed z-50"
        style={{ left: 0, top: 0, transform: `translate3d(${fab.x}px, ${fab.y}px, 0)`, width: FAB_SIZE, height: FAB_SIZE }}
      >
        {/* Pulsing outer ring when closed */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-[#1cb0f6]/20 animate-ping pointer-events-none scale-150" />
        )}

        <button
          ref={fabRef}
          onClick={() => {
            if (suppressClickRef.current) return;
            if (isOpen) handleClose(); else handleOpen();
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={handleFabKeyDown}
          style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
          aria-expanded={isOpen}
          title="Drag to move. Arrow keys also move Aivo."
          className={`relative w-[62px] h-[62px] rounded-full flex items-center justify-center ${isDragging ? '' : 'transition-all duration-200'} ${
            isOpen
              ? 'bg-[#0f1d38] border-2 border-[#1cb0f6]/50 hover:bg-[#162848] active:scale-95 shadow-[0_8px_24px_rgba(0,0,0,0.6)]'
              : `bg-gradient-to-tr from-[#0c7ec7] via-[#1cb0f6] to-[#3dc8ff] border-2 border-white/35 hover:scale-110 active:scale-95 shadow-[0_8px_28px_rgba(28,176,246,0.65)] ${isDragging ? '' : 'animate-float'}`
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
