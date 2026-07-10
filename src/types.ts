/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  xp: number;
  streak: number;
  healthScore: number; // 0 - 100
  documentsCount: number;
  lessonsCompleted: number;
  level: number;
}

export interface DocumentAnalysis {
  id: string;
  name: string;
  uploadDate: string;
  summary: string;
  terms: { term: string; definition: string }[];
  hiddenFees: string[];
  risks: string[];
  thingsToKnow: string[];
  suggestedQuestions: string[];
  easyExplanation: string; // 15-year-old style
  confidenceScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface BudgetItem {
  category: string;
  amount: number;
  budget: number;
  color: string;
  threshold?: number; // threshold warning level in percent (e.g. 85 for 85%)
}

export interface SavingTip {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  category: string;
  title: string;
  shortDescription: string;
  content: string;
  estimatedTime: string;
  quiz: QuizQuestion[];
  completed: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xpValue: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export interface Recommendation {
  id: string;
  type: 'saving' | 'learning' | 'document';
  text: string;
  actionLabel: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
  color: string;
  deadline?: string;
}
