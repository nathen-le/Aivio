# Aivio — Interactive AI Education for High School (Grades 9–12)

**Aivio** is a modern, gamified artificial intelligence learning platform designed specifically for students in grades 9–12. Aivio features original branding, a custom animated blue cat mascot (**Aivo**), bite-sized lessons, interactive sorting & matching activities, XP milestones, and daily streak tracking.

---

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 + Custom Micro-animations
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **State & Persistence**: Custom `useProgress` hook backed by `localStorage` (no account, backend, or paid API keys required)

---

## 🎨 Visual Identity & Design System

- **Background**: Deep Navy (`#0B0F19`) with dark-surface cards (`#131B2E`)
- **Accents**: Electric Teal (`#06B6D4`), Sky Blue (`#38BDF8`), Royal Purple (`#8B5CF6`), Emerald Green (`#10B981`)
- **Mascot**: **Aivo** — An original floating AI companion with an interactive digital visor that shifts expressions dynamically (celebrating, thinking, encouraging, and sympathizing).
- **Typography**: Outfit (headings) and Plus Jakarta Sans (body).

---

## 📂 Project Architecture

```
src/
├── types/
│   └── lesson.ts                # Strongly typed schema for lessons, blocks, badges, paths
├── data/
│   ├── badges.ts                # 10 unlockable badges with criteria and XP bonuses
│   ├── learningPaths.ts         # 6 comprehensive curriculum paths
│   └── lessons/
│       ├── index.ts             # Central lesson registry and lookup utilities
│       └── unit-1-meet-ai.ts    # Complete content for all 5 Unit 1 lessons
├── hooks/
│   └── useProgress.ts           # Persistent progress, streak logic, level calculation, replay protection
├── components/
│   ├── Mascot.tsx               # Original animated SVG mascot with dynamic moods
│   ├── Navbar.tsx               # Header with live XP, streak, and level pill
│   ├── LessonNode.tsx           # Pressable lesson node with status indicators and tooltips
│   ├── ProgressBar.tsx          # Smooth glowing progress indicator
│   ├── XPDisplay.tsx            # Gamified XP pill
│   ├── BadgeCard.tsx            # Badge showcase card with rarity badges
│   ├── VisualDiagram.tsx        # Conceptual diagrams (Traditional vs ML, AI Family, Training Loop)
│   ├── QuizQuestion.tsx         # Multiple-choice quiz with keyboard shortcuts (1-4, Enter)
│   ├── MatchingActivity.tsx     # Click-to-pair interactive matching exercise
│   ├── SortingActivity.tsx      # Interactive categorization flashcard exercise
│   ├── ContentCard.tsx          # Bite-sized educational card with mascot tip
│   ├── LessonRenderer.tsx       # Step-by-step activity orchestrator with exit confirmation
│   └── CompletionCelebration.tsx# Confetti celebration, XP summary, and badge unlock modal
├── pages/
│   ├── HomePage.tsx             # Compelling landing page with 3 pillars and mini-challenge
│   ├── DashboardPage.tsx        # 6-unit learning roadmap & stepping-stone pathway
│   ├── LessonPage.tsx           # Full-screen focused lesson player
│   └── ProgressPage.tsx         # Comprehensive passport, badge showcase, activity log, reset
├── App.tsx                      # Main application view router
├── main.tsx                     # React root mount
└── index.css                    # Tailwind CSS v4 tokens, animations, and dark theme
```

---

## 📚 Unit 1 Curriculum (AI Fundamentals)

1. **What Is Artificial Intelligence?**
   - Definition of perception, reasoning, and learning.
   - Narrow AI (ANI) vs. Theoretical AGI.
   - Interactive sorting activity: Real Narrow AI vs. Sci-Fi AGI.
2. **AI vs. Traditional Programming**
   - Inversion of the paradigm: `Rules + Data = Answers` vs. `Data + Answers = Rules`.
   - Why handwriting & vision break deterministic IF/ELSE logic.
   - Interactive matching activity: Programming paradigms & use cases.
3. **How Machines Learn**
   - Supervised, Unsupervised, and Reinforcement Learning.
   - The Training Loop: Forward Pass -> Loss Function -> Gradient Descent -> Weight Updates.
   - Interactive classification: Categorizing real-world applications.
4. **Meet the AI Family**
   - Nested hierarchy: AI -> Machine Learning -> Deep Learning -> Generative AI.
   - Discriminative vs. Generative models.
   - Interactive domain matching activity (Computer Vision, NLP, GenAI).
5. **What AI Can and Cannot Do**
   - Superpowers (synthesis, translation, coding acceleration).
   - Real-world limits: AI hallucinations, algorithmic dataset bias, environmental footprint.
   - Interactive sorting: Tasks AI does reliably vs. tasks where AI struggles.

---

## 🎮 Gamification Rules

- **XP System**:
  - Full XP awarded on first completion (60–80 XP per lesson).
  - Review protection: Replaying an already-completed lesson awards only a 10 XP review bonus.
  - Bonus XP awarded for every newly unlocked badge (20–100 XP).
- **Levels**:
  - Level 1: AI Novice (0–99 XP)
  - Level 2: Prompt Explorer (100–249 XP)
  - Level 3: Neural Navigator (250–449 XP)
  - Level 4: Model Apprentice (450–699 XP)
  - Level 5: Algorithm Architect (700–999 XP)
  - Level 6: AI Vanguard (1000+ XP)
- **Daily Streak**:
  - Tracks the user's active days in `localStorage`. Completing a lesson on consecutive calendar days increments the flame streak.
- **Prerequisites**:
  - Lessons unlock sequentially. Lesson 2 is locked until Lesson 1 is completed.

---

## 🛠️ Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://127.0.0.1:5173/` in your browser.

3. Build production bundle & check TypeScript:
   ```bash
   npm run build
   ```
