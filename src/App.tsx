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
import { getLessonById } from './data/lessons';

export type AppView = 'home' | 'dashboard' | 'progress' | 'profile' | 'friends' | 'lesson';

export function App() {
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

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, activeLessonId]);

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
