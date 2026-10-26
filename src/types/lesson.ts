export type BlockType = 'content' | 'quiz' | 'matching' | 'sorting';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface ContentBlock extends BaseBlock {
  type: 'content';
  heading: string;
  subtitle?: string;
  paragraphs: string[];
  bulletPoints?: string[];
  keyTakeaway?: string;
  mascotTip?: string;
  visualType?: 'ai-definition' | 'traditional-vs-ml' | 'ml-loop' | 'ai-family-tree' | 'capabilities-matrix' | 'comparison';
  highlightBadges?: { label: string; color: 'cyan' | 'purple' | 'emerald' | 'amber' }[];
}

export interface QuizOption {
  id: string;
  text: string;
  explanation?: string;
}

export interface QuizBlock extends BaseBlock {
  type: 'quiz';
  question: string;
  context?: string;
  options: QuizOption[];
  correctAnswerId: string;
  hint?: string;
  explanation: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingBlock extends BaseBlock {
  type: 'matching';
  prompt: string;
  instruction?: string;
  pairs: MatchingPair[];
  explanation: string;
}

export interface SortingCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface SortingItem {
  id: string;
  text: string;
  correctCategoryId: string;
  hint?: string;
}

export interface SortingBlock extends BaseBlock {
  type: 'sorting';
  prompt: string;
  instruction?: string;
  categories: SortingCategory[];
  items: SortingItem[];
  explanation: string;
}

export type LessonBlock = ContentBlock | QuizBlock | MatchingBlock | SortingBlock;

export interface Lesson {
  id: string;
  title: string;
  learningPathId: string;
  unitId: string;
  unitTitle: string;
  order: number;
  description: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  xpReward: number;
  badgeRewardId?: string;
  completionRequirements?: {
    minScorePercentage?: number;
  };
  blocks: LessonBlock[];
}

export interface LessonSummary {
  id: string;
  title: string;
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  badgeRewardId?: string;
}

export type PathStatus = 'available' | 'coming-soon' | 'locked';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningPath {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  difficulty: DifficultyLevel;
  gradeLevel: string;
  totalLessons: number;
  status: PathStatus;
  colorTheme: {
    primary: string;
    border: string;
    badge: string;
    bgGlow: string;
  };
  lessons: LessonSummary[];
}

export type BadgeRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type BadgeCategory = 'Milestone' | 'Mastery' | 'Streak' | 'Exploration';

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  rarity: BadgeRarity;
  category: BadgeCategory;
  xpBonus: number;
  requirement: string;
}

export interface LessonAttempt {
  completedAt: string;
  mistakesCount: number;
  xpEarned: number;
}

export interface UserProgress {
  userName: string;
  totalXP: number;
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessonIds: string[];
  earnedBadgeIds: string[];
  lessonAttempts: Record<string, LessonAttempt>;
  activePathId: string;
}

export type LessonNodeStatus = 'locked' | 'available' | 'in-progress' | 'completed';
