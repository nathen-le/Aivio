import { useState, useEffect } from 'react';
import { useProgress } from './hooks/useProgress';
import { Sidebar } from './components/Sidebar';
import { DraggableMascot } from './components/DraggableMascot';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { LessonPage } from './pages/LessonPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { FriendsPage } from './pages/FriendsPage';
import { AuthPage } from './pages/AuthPage';
import { useAuth } from './hooks/useAuth';
import { getLessonById } from './data/lessons';

export type AppView = 'home' | 'dashboard' | 'progress' | 'profile' | 'friends' | 'lesson';

export function App() {
  const { user, loading } = useAuth();
  const {
    progress,
    levelInfo,
    getLessonStatus,
    completeLesson,
    resetProgress,
    updateUserName,
    getPathCompletionPercent,
    getNextAvailableLesson,
  } = useProgress();

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeTab, setActiveTab] = useState<string>('learn');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [publicView, setPublicView] = useState<'home' | 'auth'>('home');

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, activeLessonId]);

  // Restoring the session: hold the shell until Firebase reports auth state,
  // otherwise the login screen flashes for already-signed-in users.
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1224] flex flex-col items-center justify-center gap-4">
        <img
          src="/mascot-cat-logo.png"
          alt=""
          className="w-24 h-24 object-contain animate-float"
        />
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
          Loading your profile…
        </p>
      </div>
    );
  }

  // Signed out: only the public landing page and the auth screen are reachable.
  // Dashboard, progress, profile, friends and lessons stay mounted-out entirely.
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a1224] text-slate-100 selection:bg-[#1cb0f6] selection:text-slate-950">
        {publicView === 'home' ? (
          <>
            <div className="w-full flex justify-end px-4 sm:px-6 lg:px-8 pt-4">
              <button
                onClick={() => setPublicView('auth')}
                className="btn-3d bg-[#0f1d38] hover:bg-[#1b3464] border-2 border-[#1c325c] hover:border-[#1cb0f6]/60 border-b-4 text-slate-100 font-black text-xs uppercase tracking-wider rounded-2xl px-5 py-2.5"
              >
                Log in
              </button>
            </div>
            <HomePage onStartLearning={() => setPublicView('auth')} />
          </>
        ) : (
          <AuthPage onBack={() => setPublicView('home')} />
        )}
        <DraggableMascot />
      </div>
    );
  }

  const handleNavigate = (view: AppView) => {
    setActiveLessonId(null);
    setCurrentView(view);
  };

  const handleStartLesson = (lessonId: string) => {
    const status = getLessonStatus(lessonId);
    if (status === 'locked') return;

    setActiveLessonId(lessonId);
    setCurrentView('lesson');
  };

  const handleResumeNextLesson = () => {
    const nextId = getNextAvailableLesson();
    handleStartLesson(nextId);
  };

  const handleExitLesson = () => {
    setActiveLessonId(null);
    setCurrentView('dashboard');
  };

  const activeLesson = activeLessonId ? getLessonById(activeLessonId) : null;

  return (
    <div className="min-h-screen bg-[#0a1224] text-slate-100 flex flex-col lg:flex-row selection:bg-[#1cb0f6] selection:text-slate-950">
      {/* Left Persistent Navigation Sidebar */}
      {currentView !== 'lesson' && (
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          totalXP={progress.totalXP}
        />
      )}

      {/* Main Content Pane */}
      <main className="flex-1 w-full min-w-0">
        {currentView === 'home' && (
          <HomePage
            onStartLearning={() => {
              setCurrentView('dashboard');
              setActiveTab('learn');
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage
            totalXP={progress.totalXP}
            streakDays={progress.currentStreak}
            completedLessonIds={progress.completedLessonIds}
            getLessonStatus={getLessonStatus}
            onSelectLesson={handleStartLesson}
            onNavigateProgress={() => setCurrentView('progress')}
            onNavigateFriends={() => {
              setCurrentView('friends');
              setActiveTab('friends');
            }}
            activeTab={activeTab}
          />
        )}

        {currentView === 'progress' && (
          <ProgressPage
            progress={progress}
            levelInfo={levelInfo}
            onResumeNextLesson={handleResumeNextLesson}
            onResetProgress={resetProgress}
            getPathCompletionPercent={getPathCompletionPercent}
          />
        )}

        {currentView === 'friends' && (
          <FriendsPage />
        )}

        {currentView === 'profile' && (
          <ProfilePage
            progress={progress}
            levelInfo={levelInfo}
            onUpdateUserName={updateUserName}
            onNavigateFriends={() => {
              setCurrentView('friends');
              setActiveTab('friends');
            }}
          />
        )}

        {currentView === 'lesson' && activeLesson && (
          <LessonPage
            lesson={activeLesson}
            onLessonCompleted={completeLesson}
            onExit={handleExitLesson}
            onNavigateLesson={(newLessonId) => setActiveLessonId(newLessonId)}
          />
        )}
      </main>

      {/* Draggable Blue Cat Mascot Widget */}
      <DraggableMascot />
    </div>
  );
}

export default App;
