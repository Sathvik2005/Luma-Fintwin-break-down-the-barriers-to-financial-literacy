/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Trophy,
  Flame,
  Award,
  CheckCircle,
  HelpCircle,
  Lock,
  Compass,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  Zap,
  Calendar
} from "lucide-react";
import { UserProfile, DailyChallenge, AchievementBadge } from "../types";

interface GamificationProps {
  user: UserProfile;
  challenges: DailyChallenge[];
  onCompleteChallenge: (id: string) => void;
  badges: AchievementBadge[];
  onIncrementXP: (amount: number) => void;
  onUnlockAchievement: (badgeId: string) => void;
}

export default function Gamification({
  user,
  challenges,
  onCompleteChallenge,
  badges,
  onIncrementXP,
  onUnlockAchievement,
}: GamificationProps) {
  // Duolingo style motivational quote
  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start a lesson to begin your financial learning streak!";
    if (streak < 3) return "Great start! Keep going to establish a 3-day habits baseline.";
    return "Outstanding! Your consistent daily discipline is establishing permanent wealth habits.";
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-orange-500" />
          <span>Challenges & Gamification</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Build long-term habits, complete daily challenges, and unlock achievements as you master personal finance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4-Span): Streak Card & Daily Challenges checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Streak details */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="h-6 w-6 fill-white" />
                <h3 className="text-base font-bold font-sans">Streak Status</h3>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold">
                Level {user.level}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-3xl font-extrabold font-sans">
                {user.streak} Day Streak
              </p>
              <p className="text-xs text-orange-50 leading-relaxed max-w-sm">
                {getStreakMessage(user.streak)}
              </p>
            </div>

            {/* Streak Timeline representation */}
            <div className="grid grid-cols-7 gap-1.5 pt-3">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                const isActive = idx < user.streak;
                return (
                  <div key={idx} className="text-center space-y-1">
                    <span className="text-[10px] text-orange-200 font-bold">{day}</span>
                    <div
                      className={`h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isActive
                          ? "bg-white text-orange-600 shadow-sm shadow-orange-700/10"
                          : "bg-white/10 text-orange-200"
                      }`}
                    >
                      {isActive ? "🔥" : "•"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Daily Financial Challenges
              </h3>
            </div>

            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`p-4 rounded-xl border ${
                    challenge.completed
                      ? "bg-emerald-50/40 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/20"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800"
                  } space-y-2`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold ${challenge.completed ? "text-emerald-800 dark:text-emerald-400 line-through" : "text-slate-800 dark:text-white"}`}>
                      {challenge.title}
                    </h4>
                    <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      +{challenge.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    {challenge.description}
                  </p>

                  {!challenge.completed ? (
                    <button
                      onClick={() => {
                        onCompleteChallenge(challenge.id);
                        onUnlockAchievement("ach_5"); // Challenge Buster badge
                      }}
                      className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-sm"
                    >
                      Mark as Completed
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed! (+{challenge.xpReward} XP Added)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (8-Span): Achievements Grid & Milestones Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Achievement Badges Grid list */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                  Financial Mastery Badges
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-bold bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                {unlockedCount} / {badges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex items-start space-x-3.5 transition-all duration-200 ${
                    badge.unlocked
                      ? "bg-indigo-50/40 border-indigo-200 dark:bg-indigo-950/15 dark:border-indigo-900/35"
                      : "bg-slate-50/50 border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 text-slate-400"
                  }`}
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    badge.unlocked
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700"
                  }`}>
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h4 className={`text-xs sm:text-sm font-bold ${badge.unlocked ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>
                        {badge.title}
                      </h4>
                      {!badge.unlocked && <Lock className="h-3 w-3 text-slate-300 dark:text-slate-700 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {badge.description}
                    </p>
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 block pt-0.5">
                      Worth: {badge.xpValue} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habit Timeline description */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Compass className="h-4 w-4" />
              <span>Achievement Roadmap</span>
            </h3>

            <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3.5 pl-6 space-y-6 py-1">
              {[
                { title: "Novice Analyst", desc: "Unlock 'First Analysis' by processing your first mortgage or lease contract.", status: "completed" },
                { title: "Budget Architect", desc: "Unlock 'Budget Master' by configuring custom income, outflows, and savings indicators.", status: "current" },
                { title: "Financial Sage", desc: "Complete all 7 financial literacy courses and scores 100% on tax bracket calculations.", status: "locked" }
              ].map((milestone, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute -left-9 top-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center font-bold text-[10px] ${
                    milestone.status === "completed"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : milestone.status === "current"
                      ? "bg-blue-600 border-blue-600 text-white animate-pulse"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{milestone.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
