/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Wallet, Menu, X, Sun, Moon, Flame, Trophy } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  user: UserProfile;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function Navbar({
  user,
  currentTab,
  setCurrentTab,
  isDarkMode,
  setIsDarkMode,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "analyzer", label: "Doc Analyzer" },
    { id: "budget", label: "Budget Coach" },
    { id: "learning", label: "Learning Center" },
    { id: "gamification", label: "Challenges" },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentTab("landing")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="ml-3 font-sans text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              FinTwin AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {currentTab !== "landing" &&
              navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    currentTab === item.id
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            {currentTab === "landing" && (
              <button
                onClick={() => handleNavClick("dashboard")}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                Launch Dashboard
              </button>
            )}
          </div>

          {/* Stats & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Flame Streak Indicator */}
            <div className="flex items-center px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold animate-pulse">
              <Flame className="mr-1 h-4 w-4 fill-orange-500" />
              <span>{user.streak} Day Streak</span>
            </div>

            {/* XP Badge */}
            <div className="flex items-center px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <Trophy className="mr-1 h-4 w-4 fill-blue-500" />
              <span>{user.xp} XP (Lvl {user.level})</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative flex items-center h-8 w-14 rounded-full p-1 cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:border-slate-300 dark:hover:border-slate-600"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <div
                className={`flex items-center justify-center h-6 w-6 rounded-full bg-white dark:bg-slate-950 shadow-md transform transition-all duration-300 ease-out ${
                  isDarkMode ? "translate-x-6 rotate-180 bg-indigo-950/20 shadow-indigo-500/20" : "translate-x-0 rotate-0 shadow-amber-500/20"
                }`}
              >
                {isDarkMode ? (
                  <Moon className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400/25 transition-transform" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-amber-500 fill-amber-500/25 transition-transform" />
                )}
              </div>
              <span className="absolute right-2 text-[9px] font-bold font-mono text-slate-400 dark:text-transparent transition-opacity pointer-events-none select-none">
                ☀️
              </span>
              <span className="absolute left-2 text-[9px] font-bold font-mono text-transparent dark:text-indigo-400 transition-opacity pointer-events-none select-none">
                🌙
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative flex items-center h-8 w-14 rounded-full p-1 cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <div
                className={`flex items-center justify-center h-6 w-6 rounded-full bg-white dark:bg-slate-950 shadow-md transform transition-all duration-300 ease-out ${
                  isDarkMode ? "translate-x-6 rotate-180 bg-indigo-950/20" : "translate-x-0 rotate-0"
                }`}
              >
                {isDarkMode ? (
                  <Moon className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400/25" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-amber-500 fill-amber-500/25" />
                )}
              </div>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 pt-2 pb-4 space-y-1">
          {currentTab !== "landing" ? (
            navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                  currentTab === item.id
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))
          ) : (
            <button
              onClick={() => handleNavClick("dashboard")}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Launch Dashboard
            </button>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2 flex items-center justify-around">
            <div className="flex items-center text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-3 py-1.5 rounded-full">
              <Flame className="mr-1 h-3.5 w-3.5 fill-orange-500" />
              <span>{user.streak} Days</span>
            </div>
            <div className="flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-3 py-1.5 rounded-full">
              <Trophy className="mr-1 h-3.5 w-3.5 fill-blue-500" />
              <span>{user.xp} XP</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
