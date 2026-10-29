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
import { LocalPage } from './pages/LocalPage';
import { FriendsProvider } from './contexts/FriendsProvider';
import { AuthPage } from './pages/AuthPage';
import { useAuth } from './hooks/useAuth';
import { getLessonById } from './data/lessons';
import {
  LegacyImportPrompt,
  ProgressErrorScreen,
  ProgressLoadingScreen,
  SaveErrorBanner,
} from './components/ProgressStatusScreens';

type AuthEntryMode = 'login' | 'signup';

// The public auth screen is addressed by URL hash so a refresh or the browser
// Back button lands on the same mode without needing server-side routing.
const AUTH_HASH: Record<AuthEntryMode, string> = {
  login: '#/login',
  signup: '#/signup',
};

function readAuthHash(): AuthEntryMode | null {
  if (window.location.hash === AUTH_HASH.signup) return 'signup';
  if (window.location.hash === AUTH_HASH.login) return 'login';
  return null;
}

export type AppView = 'home' | 'dashboard' | 'progress' | 'profile' | 'friends' | 'local' | 'lesson';

export function App() {
  const { user, loading, logout } = useAuth();
  const {
    status: progressStatus,
    saveStatus,
    legacyProgress,
    retryLoad,
    retrySave,
    importLegacy,
    startFresh,
    progress,
    levelInfo,
    getLessonStatus,
    completeLesson,
    resetProgress,
    updateUserName,
    getPathCompletionPercent,
    getNextAvailableLesson,
  } = useProgress(user?.uid ?? null, user?.displayName ?? 'Learner');

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeTab, setActiveTab] = useState<string>('learn');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthEntryMode | null>(readAuthHash);
  // Bumped on Back/Forward so AuthPage remounts into the mode in the URL.
  const [authPageKey, setAuthPageKey] = useState(0);

  const openAuth = (mode: AuthEntryMode) => {
    window.history.pushState(null, '', AUTH_HASH[mode]);
    setAuthMode(mode);
    setAuthPageKey((k) => k + 1);
  };

  const closeAuth = () => {
    window.history.pushState(null, '', window.location.pathname + window.location.search);
    setAuthMode(null);
  };

  useEffect(() => {
    const onHashChange = () => {
      setAuthMode(readAuthHash());
      setAuthPageKey((k) => k + 1);
    };
    window.addEventListener('popstate', onHashChange);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('popstate', onHashChange);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  // A signed-in user never needs the auth screen: drop a stale #/login or
  // #/signup so they stay on the dashboard (including right after signing in).
  useEffect(() => {
    if (!user) return;
    if (readAuthHash()) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setAuthMode(null);
  }, [user]);

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
        {authMode === null ? (
          <>
            <div className="w-full flex justify-end px-4 sm:px-6 lg:px-8 pt-4">
              <button
                onClick={() => openAuth('login')}
                className="btn-3d bg-[#0f1d38] hover:bg-[#1b3464] border-2 border-[#1c325c] hover:border-[#1cb0f6]/60 border-b-4 text-slate-100 font-black text-xs uppercase tracking-wider rounded-2xl px-5 py-2.5"
              >
                Log in
              </button>
            </div>
            <HomePage onStartLearning={() => openAuth('signup')} />
          </>
        ) : (
          <AuthPage
            key={authPageKey}
            initialMode={authMode}
            onBack={closeAuth}
            onModeChange={(mode) =>
              window.history.replaceState(null, '', AUTH_HASH[mode])
            }
          />
        )}
        <DraggableMascot />
      </div>
    );
  }

  // Progress belongs to this account and must be loaded before any screen
  // that reads or writes it renders, so nothing can save over unloaded data.
  if (progressStatus === 'loading' || progressStatus === 'signed-out') {
    return <ProgressLoadingScreen />;
  }
  if (progressStatus === 'error') {
    return <ProgressErrorScreen onRetry={retryLoad} onSignOut={() => void logout({ force: true })} />;
  }
  if (progressStatus === 'needs-import-decision' && legacyProgress) {
    return (
      <LegacyImportPrompt
        legacy={legacyProgress}
        onImport={importLegacy}
        onStartFresh={startFresh}
      />
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
    <FriendsProvider key={user.uid} uid={user.uid}>
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
          <FriendsPage
            onNavigateLocal={() => {
              setCurrentView('local');
              setActiveTab('local');
            }}
          />
        )}

        {currentView === 'local' && <LocalPage />}

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

      {saveStatus === 'error' && <SaveErrorBanner onRetry={retrySave} />}

      {/* Draggable Blue Cat Mascot Widget */}
      <DraggableMascot />
    </div>
    </FriendsProvider>
  );
}

export default App;
