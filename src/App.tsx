/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import DocAnalyzer from "./components/DocAnalyzer";
import BudgetCoach from "./components/BudgetCoach";
import LearningCenter from "./components/LearningCenter";
import Gamification from "./components/Gamification";
import { UserProfile, DocumentAnalysis, DailyChallenge, AchievementBadge, Lesson, Recommendation } from "./types";
import {
  INITIAL_LESSONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CHALLENGES,
  INITIAL_RECOMMENDATIONS
} from "./data";
import { Wallet, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function App() {
  // 1. App Navigation State
  const [currentTab, setCurrentTab] = useState<string>("landing");

  // 2. Dark/Light Theme state
  const [hasManualTheme, setHasManualTheme] = useState<boolean>(() => {
    return localStorage.getItem("fintwin_manual_theme") === "true";
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("fintwin_dark");
    if (saved !== null) {
      return saved === "true";
    }
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // 3. User Profile State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("fintwin_user");
    if (saved) return JSON.parse(saved);
    return {
      name: "Sathvik",
      email: "kanithisathvik2005@gmail.com",
      avatar: "S",
      xp: 0,
      streak: 3,
      healthScore: 84,
      documentsCount: 0,
      lessonsCompleted: 0,
      level: 1,
    };
  });

  // 4. Document Analysis State
  const [documents, setDocuments] = useState<DocumentAnalysis[]>(() => {
    const saved = localStorage.getItem("fintwin_docs");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDocument, setSelectedDocument] = useState<DocumentAnalysis | null>(null);

  // 5. Challenges checklist state
  const [challenges, setChallenges] = useState<DailyChallenge[]>(() => {
    const saved = localStorage.getItem("fintwin_challenges");
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });

  // 6. Achievements / Badges state
  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem("fintwin_badges");
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // 7. Lessons completion state
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem("fintwin_lessons");
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);

  // Effect to synchronize states to localStorage & HTML document class
  useEffect(() => {
    localStorage.setItem("fintwin_dark", String(isDarkMode));
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Sync automatic system theme updates unless manual theme selected
  useEffect(() => {
    if (hasManualTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [hasManualTheme]);

  const handleSetDarkMode = (dark: boolean) => {
    setIsDarkMode(dark);
    setHasManualTheme(true);
    localStorage.setItem("fintwin_manual_theme", "true");
  };

  useEffect(() => {
    localStorage.setItem("fintwin_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("fintwin_docs", JSON.stringify(documents));
    setUser((prev) => ({ ...prev, documentsCount: documents.length }));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("fintwin_challenges", JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem("fintwin_badges", JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem("fintwin_lessons", JSON.stringify(lessons));
    const completed = lessons.filter((l) => l.completed).length;
    setUser((prev) => ({ ...prev, lessonsCompleted: completed }));
  }, [lessons]);

  // Handle XP Increments & automatic leveling up
  const handleIncrementXP = (amount: number) => {
    setUser((prev) => {
      const nextXP = prev.xp + amount;
      const nextLevel = Math.floor(nextXP / 1000) + 1; // 1000 XP per level
      return {
        ...prev,
        xp: nextXP,
        level: nextLevel > prev.level ? nextLevel : prev.level,
      };
    });
  };

  // Mark Daily Challenge as complete
  const handleCompleteChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id && !c.completed) {
          handleIncrementXP(c.xpReward);
          return { ...c, completed: true };
        }
        return c;
      })
    );
  };

  // Unlock Achievement Badge
  const handleUnlockAchievement = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === badgeId && !b.unlocked) {
          handleIncrementXP(b.xpValue);
          return { ...b, unlocked: true };
        }
        return b;
      })
    );
  };

  // Complete a lesson and unlock relevant accomplishments
  const handleCompleteLesson = (id: string) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === id && !l.completed) {
          handleIncrementXP(100);
          return { ...l, completed: true };
        }
        return l;
      })
    );
    // Unlock Scholar badge
    handleUnlockAchievement("ach_2");
  };

  // Route directly to Doc Analyzer with specific document loaded
  const handleSelectDocument = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setSelectedDocument(doc);
      setCurrentTab("analyzer");
    }
  };

  // Complete reset to sandbox defaults
  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all your learning points, streak, and analyzed document history?")) {
      localStorage.removeItem("fintwin_user");
      localStorage.removeItem("fintwin_docs");
      localStorage.removeItem("fintwin_challenges");
      localStorage.removeItem("fintwin_badges");
      localStorage.removeItem("fintwin_lessons");

      setUser({
        name: "Sathvik",
        email: "kanithisathvik2005@gmail.com",
        avatar: "S",
        xp: 0,
        streak: 3,
        healthScore: 84,
        documentsCount: 0,
        lessonsCompleted: 0,
        level: 1,
      });
      setDocuments([]);
      setSelectedDocument(null);
      setChallenges(INITIAL_CHALLENGES);
      setBadges(INITIAL_ACHIEVEMENTS);
      setLessons(INITIAL_LESSONS);
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        
        {/* Navbar */}
        <Navbar
          user={user}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isDarkMode={isDarkMode}
          setIsDarkMode={handleSetDarkMode}
        />

        {/* Content routing container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentTab === "landing" && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8"
              >
                <LandingPage setCurrentTab={setCurrentTab} />
              </motion.div>
            )}

            {currentTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Dashboard
                  user={user}
                  setUser={setUser}
                  documents={documents}
                  onSelectDocument={handleSelectDocument}
                  setCurrentTab={setCurrentTab}
                  challenges={challenges}
                  onCompleteChallenge={handleCompleteChallenge}
                  recommendations={recommendations}
                  lessons={lessons}
                  badges={badges}
                  onResetProgress={handleResetProgress}
                />
              </motion.div>
            )}

            {currentTab === "analyzer" && (
              <motion.div
                key="analyzer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <DocAnalyzer
                  documents={documents}
                  setDocuments={setDocuments}
                  selectedDocument={selectedDocument}
                  setSelectedDocument={setSelectedDocument}
                  onUnlockAchievement={handleUnlockAchievement}
                  onIncrementXP={handleIncrementXP}
                />
              </motion.div>
            )}

            {currentTab === "budget" && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <BudgetCoach
                  onUnlockAchievement={handleUnlockAchievement}
                  onIncrementXP={handleIncrementXP}
                />
              </motion.div>
            )}

            {currentTab === "learning" && (
              <motion.div
                key="learning"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <LearningCenter
                  lessons={lessons}
                  onCompleteLesson={handleCompleteLesson}
                  onIncrementXP={handleIncrementXP}
                  onUnlockAchievement={handleUnlockAchievement}
                />
              </motion.div>
            )}

            {currentTab === "gamification" && (
              <motion.div
                key="gamification"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Gamification
                  user={user}
                  challenges={challenges}
                  onCompleteChallenge={handleCompleteChallenge}
                  badges={badges}
                  onIncrementXP={handleIncrementXP}
                  onUnlockAchievement={handleUnlockAchievement}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Unified Applet Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 py-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                FT
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">FinTwin AI © 2026</span>
              <span className="text-slate-300 dark:text-slate-800">|</span>
              <span>Personal Finance Literacy Platform</span>
            </div>

            <div className="flex items-center space-x-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Full-Stack AI Sandbox</span>
              <span className="text-slate-200 dark:text-slate-800">•</span>
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
              <span>Sathvik Profile Connected</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
