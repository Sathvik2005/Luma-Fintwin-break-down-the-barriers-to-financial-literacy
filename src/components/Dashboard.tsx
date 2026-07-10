/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  ShieldAlert,
  GraduationCap,
  FileText,
  Trophy,
  Flame,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  User,
  RotateCcw
} from "lucide-react";
import { UserProfile, DocumentAnalysis, DailyChallenge, Recommendation, Lesson, AchievementBadge } from "../types";

interface DashboardProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  documents: DocumentAnalysis[];
  onSelectDocument: (docId: string) => void;
  setCurrentTab: (tab: string) => void;
  challenges: DailyChallenge[];
  onCompleteChallenge: (id: string) => void;
  recommendations: Recommendation[];
  lessons: Lesson[];
  badges: AchievementBadge[];
  onResetProgress: () => void;
}

export default function Dashboard({
  user,
  setUser,
  documents,
  onSelectDocument,
  setCurrentTab,
  challenges,
  onCompleteChallenge,
  recommendations,
  lessons,
  badges,
  onResetProgress,
}: DashboardProps) {
  const completedLessonsCount = lessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedLessonsCount / (lessons.length || 1)) * 100);

  // Financial Health score interpretation
  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 50) return "text-amber-500 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  const getHealthLevel = (score: number) => {
    if (score >= 80) return "Strong";
    if (score >= 50) return "Moderate";
    return "Needs Care";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-lg">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-white/20 text-xs font-semibold uppercase tracking-wider">Active Portfolio</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-sans">
            Welcome back, {user.name}!
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed max-w-xl">
            Your financial IQ is increasing! Keep completing daily lessons, auditing agreements, and tracking your spending metrics to level up.
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/10">
          <div className="h-12 w-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
            <Flame className="h-6 w-6 fill-white" />
          </div>
          <div>
            <p className="text-xs text-blue-100 font-bold uppercase tracking-wider">Learning Streak</p>
            <p className="text-lg font-bold">{user.streak} Days Active</p>
          </div>
        </div>
      </div>

      {/* Grid of Main Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Financial Health Score */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Financial Health</span>
            <span className={`text-3xl font-bold font-sans ${getHealthColor(user.healthScore)}`}>
              {user.healthScore}
            </span>
            <span className="text-xs font-bold text-slate-500 block">
              Level: <span className="font-semibold">{getHealthLevel(user.healthScore)}</span>
            </span>
          </div>
          <div className="h-14 w-14 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center font-bold text-sm text-slate-800 dark:text-white relative">
            <svg className="absolute -rotate-90 w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeWidth="3.5"
                strokeDasharray={`${user.healthScore}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="z-10">{user.healthScore}%</span>
          </div>
        </div>

        {/* Metric 2: Documents Analyzed */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Docs Uploaded</span>
            <span className="text-3xl font-bold font-sans text-slate-900 dark:text-white block">
              {user.documentsCount}
            </span>
            <span className="text-xs text-slate-400 block">AI fine-print scans</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 3: Learning Lessons Completed */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Course Progress</span>
            <span className="text-3xl font-bold font-sans text-slate-900 dark:text-white block">
              {completedLessonsCount} / {lessons.length}
            </span>
            <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 4: XP Accumulated */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Reward Levels</span>
            <span className="text-3xl font-bold font-sans text-slate-900 dark:text-white block">
              {user.xp} <span className="text-xs text-slate-400 font-normal">XP</span>
            </span>
            <span className="text-xs text-slate-500 block">Level {user.level} Practitioner</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
            <Trophy className="h-6 w-6 fill-purple-100 dark:fill-transparent" />
          </div>
        </div>
      </div>

      {/* Middle Layout Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2-Span): Recommendations and Recent Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommendations Banner */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                AI Personalized Insights
              </h3>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60 gap-3 hover:border-blue-200 dark:hover:border-blue-900/30 transition-all duration-150"
                >
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    {rec.text}
                  </p>
                  <button
                    onClick={() => {
                      if (rec.type === "learning") setCurrentTab("learning");
                      else if (rec.type === "saving") setCurrentTab("budget");
                      else setCurrentTab("analyzer");
                    }}
                    className="shrink-0 inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/20 transition-all cursor-pointer"
                  >
                    {rec.actionLabel}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Documents Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                  Audited Documents
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab("analyzer")}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Upload New
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center flex flex-col items-center justify-center space-y-3">
                <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No documents uploaded yet</p>
                  <p className="text-xs text-slate-400 max-w-xs mt-0.5">Drag-and-drop your lease, credit card form, or loan sheets in the Doc Analyzer.</p>
                </div>
                <button
                  onClick={() => setCurrentTab("analyzer")}
                  className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                >
                  Analyze First Document
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDocument(doc.id)}
                    className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/20 px-2 rounded-lg group transition-all"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {doc.name}
                        </h4>
                        <p className="text-[10px] text-slate-400">Audited on {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                        {doc.confidenceScore}% Confidence
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1-Span): Daily Challenges & Achievements Preview */}
        <div className="space-y-6 col-span-1">
          {/* Daily Challenge card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Daily Challenge
            </h3>

            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-4 rounded-xl border ${
                  challenge.completed
                    ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/20"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800"
                } space-y-3`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`text-sm font-bold ${challenge.completed ? "text-emerald-800 dark:text-emerald-400 line-through" : "text-slate-800 dark:text-white"}`}>
                    {challenge.title}
                  </h4>
                  <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    +{challenge.xpReward} XP
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {challenge.description}
                </p>

                {!challenge.completed ? (
                  <button
                    onClick={() => onCompleteChallenge(challenge.id)}
                    className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-sm"
                  >
                    Mark as Completed
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle className="h-4 w-4" />
                    <span>XP Rewarded Successfully!</span>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => setCurrentTab("gamification")}
              className="w-full text-center text-xs text-slate-400 font-bold hover:text-blue-600 dark:hover:text-blue-400"
            >
              View Achievement Ladder
            </button>
          </div>

          {/* Achievement Badges widget */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Unlockable Badges
              </h3>
              <span className="text-xs text-slate-400">
                {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {badges.slice(0, 8).map((badge) => (
                <div
                  key={badge.id}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center justify-center transition-all ${
                    badge.unlocked
                      ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 scale-100"
                      : "bg-slate-50 dark:bg-slate-800/45 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 scale-95"
                  }`}
                  title={`${badge.title}: ${badge.description}`}
                >
                  <Award className={`h-6 w-6 ${badge.unlocked ? "text-indigo-500 fill-indigo-100 dark:fill-transparent animate-pulse" : "text-slate-300 dark:text-slate-700"}`} />
                  <span className="text-[8px] font-bold mt-1 line-clamp-1">{badge.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset profile progress utility */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onResetProgress}
              className="inline-flex items-center space-x-1 text-[10px] text-slate-400 hover:text-red-500 hover:underline cursor-pointer"
              title="Restores to default initial mockup levels"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset App Profile Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
