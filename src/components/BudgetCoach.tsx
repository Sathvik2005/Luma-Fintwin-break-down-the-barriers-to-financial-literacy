/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";
import {
  PiggyBank,
  Sparkles,
  Plus,
  RefreshCw,
  Loader2,
  BellRing,
  Bell,
  Trash2,
  X,
  AlertTriangle,
  Info,
  Target,
  Coins,
  TrendingUp,
  CheckCircle,
  Gift,
  Compass,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BudgetItem, SavingTip, SavingsGoal } from "../types";
import { INITIAL_BUDGET } from "../data";

// Custom Theme-Adaptive Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md text-[11px] font-sans">
        <p className="text-slate-400 font-bold mb-1.5 uppercase tracking-wider">{label}</p>
        <div className="space-y-1">
          {payload.map((item: any, index: number) => (
            <p key={index} className="font-bold flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.stroke || item.payload.color || item.color }} />
                {item.name}:
              </span>
              <span className="font-mono text-slate-800 dark:text-white">${item.value}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface BudgetCoachProps {
  onUnlockAchievement: (badgeId: string) => void;
  onIncrementXP: (amount: number) => void;
}

export default function BudgetCoach({
  onUnlockAchievement,
  onIncrementXP,
}: BudgetCoachProps) {
  // Persistence load of budget items with safety fallbacks
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem("fintwin_budget_items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({
            ...item,
            threshold: item.threshold ?? 85,
          }));
        }
      } catch (e) {
        console.error("Error parsing budget items", e);
      }
    }
    return INITIAL_BUDGET.map((item) => ({ ...item, threshold: 85 }));
  });

  const [incomeInput, setIncomeInput] = useState<number>(() => {
    const saved = localStorage.getItem("fintwin_income_input");
    return saved ? parseFloat(saved) : 3000;
  });

  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [savingsRate, setSavingsRate] = useState<number>(20);
  const [aiSuggestions, setAiSuggestions] = useState<string>("Your budget is looking healthy! Focus on reducing dining and utility peak-rate hours.");
  const [savingTips, setSavingTips] = useState<SavingTip[]>([
    {
      id: "tip_1",
      title: "Consolidate Subscription Surcharges",
      description: "We found 3 overlapping entertainment streaming packages. Pausing 2 of them can boost your monthly savings by $24 instantly.",
      category: "Entertainment"
    },
    {
      id: "tip_2",
      title: "Cook at Home During Peak Workdays",
      description: "Your dining out category spikes by 45% during mid-week office hours. Bringing a prepped lunch on Tue & Wed saves around $120/month.",
      category: "Food"
    }
  ]);

  // Alert dismissals (cleared when category inputs or spending levels shift)
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number | null>(null);

  // Temporary item creation form state
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newThreshold, setNewThreshold] = useState("85");

  const totalSpent = budgetItems.reduce((acc, item) => acc + item.amount, 0);
  const totalBudgetLimit = budgetItems.reduce((acc, item) => acc + item.budget, 0);
  const totalSavings = incomeInput - totalSpent;
  const currentSavingsRate = incomeInput > 0 ? Math.round((totalSavings / incomeInput) * 100) : 0;

  // Persist budget items, income to localStorage
  useEffect(() => {
    localStorage.setItem("fintwin_budget_items", JSON.stringify(budgetItems));
  }, [budgetItems]);

  useEffect(() => {
    localStorage.setItem("fintwin_income_input", String(incomeInput));
  }, [incomeInput]);

  // --- Historical Trend State ---
  const [activeVisualizerTab, setActiveVisualizerTab] = useState<"breakdown" | "history">("breakdown");
  const [selectedTrendCategory, setSelectedTrendCategory] = useState<string>("Total Outflow");
  
  const [trendData, setTrendData] = useState(() => {
    const saved = localStorage.getItem("fintwin_trend_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing trend data", e);
      }
    }
    return [
      { name: "Jan", Housing: 1200, "Food & Dining": 380, Utilities: 210, Transportation: 140, Entertainment: 95, Miscellaneous: 50, Total: 2075 },
      { name: "Feb", Housing: 1200, "Food & Dining": 420, Utilities: 230, Transportation: 160, Entertainment: 120, Miscellaneous: 60, Total: 2190 },
      { name: "Mar", Housing: 1200, "Food & Dining": 450, Utilities: 240, Transportation: 150, Entertainment: 150, Miscellaneous: 80, Total: 2270 },
      { name: "Apr", Housing: 1200, "Food & Dining": 390, Utilities: 200, Transportation: 130, Entertainment: 110, Miscellaneous: 40, Total: 2070 },
      { name: "May", Housing: 1200, "Food & Dining": 440, Utilities: 220, Transportation: 170, Entertainment: 130, Miscellaneous: 70, Total: 2270 },
      { name: "Jun", Housing: 1200, "Food & Dining": 480, Utilities: 220, Transportation: 150, Entertainment: 180, Miscellaneous: 70, Total: 2300 }
    ];
  });

  // Calculate dynamic current month metrics
  const currentMonthData = {
    name: "Current",
    Housing: budgetItems.find((i) => i.category === "Housing")?.amount ?? 1200,
    "Food & Dining": budgetItems.find((i) => i.category === "Food & Dining")?.amount ?? 450,
    Utilities: budgetItems.find((i) => i.category === "Utilities")?.amount ?? 220,
    Transportation: budgetItems.find((i) => i.category === "Transportation")?.amount ?? 150,
    Entertainment: budgetItems.find((i) => i.category === "Entertainment")?.amount ?? 180,
    Miscellaneous: budgetItems.find((i) => i.category === "Miscellaneous")?.amount ?? 70,
    Total: totalSpent
  };

  const fullTrendData = [...trendData, currentMonthData];

  // --- Savings Goals State ---
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem("fintwin_savings_goals");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error parsing savings goals", e);
      }
    }
    return [
      { id: "goal_1", name: "Emergency Security Fund", target: 5000, current: 3800, category: "Security", color: "#10B981" },
      { id: "goal_2", name: "Tokyo Summer Adventure", target: 3000, current: 1200, category: "Vacation", color: "#8B5CF6" },
      { id: "goal_3", name: "Apple Silicon MacBook", target: 1500, current: 1500, category: "Productivity", color: "#3B82F6" }
    ];
  });

  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalCategory, setGoalCategory] = useState("Security");
  const [goalColor, setGoalColor] = useState("#10B981");

  const [goalFundAmount, setGoalFundAmount] = useState<{ [key: string]: string }>({});
  const [celebratingGoalId, setCelebratingGoalId] = useState<string | null>(null);
  
  const [celebratedGoalIds, setCelebratedGoalIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("fintwin_celebrated_goal_ids");
    return saved ? JSON.parse(saved) : ["goal_3"];
  });

  useEffect(() => {
    localStorage.setItem("fintwin_savings_goals", JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem("fintwin_celebrated_goal_ids", JSON.stringify(celebratedGoalIds));
  }, [celebratedGoalIds]);

  const handleCreateSavingsGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName) return;

    const targetVal = parseFloat(goalTarget) || 1000;
    const currentVal = parseFloat(goalCurrent) || 0;

    const newGoal: SavingsGoal = {
      id: "goal_" + Date.now(),
      name: goalName,
      target: targetVal,
      current: currentVal,
      category: goalCategory,
      color: goalColor,
    };

    setSavingsGoals((prev) => [...prev, newGoal]);
    setGoalName("");
    setGoalTarget("");
    setGoalCurrent("");
    setGoalCategory("Security");
    setGoalColor("#10B981");
    setShowAddGoalForm(false);
    onIncrementXP(30);
  };

  const handleAddFunds = (goalId: string, isWithdrawal = false) => {
    const inputVal = goalFundAmount[goalId];
    if (!inputVal) return;

    const delta = parseFloat(inputVal) || 0;
    if (delta <= 0) return;

    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const finalAmt = isWithdrawal ? Math.max(0, g.current - delta) : g.current + delta;
          const isNewlyReached = finalAmt >= g.target && g.current < g.target;

          if (isNewlyReached && !celebratedGoalIds.includes(goalId)) {
            setCelebratingGoalId(goalId);
            setCelebratedGoalIds((prev) => [...prev, goalId]);
            onIncrementXP(150);
            onUnlockAchievement("ach_3");
            
            setTimeout(() => {
              setCelebratingGoalId(null);
            }, 6000);
          }

          return { ...g, current: finalAmt };
        }
        return g;
      })
    );

    setGoalFundAmount((prev) => ({ ...prev, [goalId]: "" }));
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm("Are you sure you want to delete this savings goal?")) {
      setSavingsGoals((prev) => prev.filter((g) => g.id !== goalId));
      setCelebratedGoalIds((prev) => prev.filter((id) => id !== goalId));
    }
  };

  // Compute Active Alerts
  const activeAlerts = budgetItems
    .map((item, idx) => {
      const ratio = item.budget > 0 ? (item.amount / item.budget) * 100 : 0;
      const threshold = item.threshold ?? 85;
      const isOverBudget = item.amount > item.budget;
      const isOverThreshold = ratio >= threshold;

      return {
        category: item.category,
        amount: item.amount,
        budget: item.budget,
        color: item.color,
        ratio,
        threshold,
        isOverBudget,
        isOverThreshold,
        index: idx,
      };
    })
    .filter((alert) => alert.isOverThreshold && !dismissedAlerts.includes(alert.category));

  // Trigger server-side analysis
  const handleTriggerBudgetAnalyze = async (bypassLoader = false) => {
    if (!bypassLoader) setAnalyzing(true);
    try {
      const response = await fetch("/api/budget/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlySpending: totalSpent,
          savings: totalSavings > 0 ? totalSavings : 100,
          categories: budgetItems.map((b) => ({ name: b.category, amount: b.amount })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSavingsRate(data.savingsRate);
        setAiSuggestions(data.suggestions);
        if (data.tips && data.tips.length > 0) {
          setSavingTips(data.tips);
        }
        if (!bypassLoader) {
          onIncrementXP(120);
          onUnlockAchievement("ach_3"); // Budget Master badge
        }
      }
    } catch (e) {
      console.error("Budget Analyzer API error:", e);
    } finally {
      if (!bypassLoader) setAnalyzing(false);
    }
  };

  useEffect(() => {
    // Initial silent run
    handleTriggerBudgetAnalyze(true);
  }, []);

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newAmount || !newBudget) return;

    const colors = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#64748B", "#EC4899", "#14B8A6"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newItem: BudgetItem = {
      category: newCategory,
      amount: parseFloat(newAmount) || 0,
      budget: parseFloat(newBudget) || 0,
      color: randomColor,
      threshold: parseInt(newThreshold) || 85,
    };

    setBudgetItems((prev) => [...prev, newItem]);
    setNewCategory("");
    setNewAmount("");
    setNewBudget("");
    setNewThreshold("85");

    // Remove from dismissed if re-added
    setDismissedAlerts((prev) => prev.filter((c) => c !== newCategory));
  };

  const handleResetBudget = () => {
    if (confirm("Reset budget list to the standard template?")) {
      const resetList = INITIAL_BUDGET.map((item) => ({ ...item, threshold: 85 }));
      setBudgetItems(resetList);
      setDismissedAlerts([]);
      setSelectedCategoryIdx(null);
    }
  };

  // Setup Pie Chart data
  const pieData = budgetItems.map((item) => ({
    name: item.category,
    value: item.amount,
    color: item.color,
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center space-x-2">
          <PiggyBank className="h-6 w-6 text-emerald-500" />
          <span>Budget Coach & Alerts</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Analyze expense limits with precision, customize proactive warning thresholds, and view tailored AI tips.
        </p>
      </div>

      {/* 1. NOTIFICATION ALERT HUB */}
      <AnimatePresence>
        {activeAlerts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-2xl border border-rose-100 dark:border-rose-950/30 bg-rose-50/50 dark:bg-rose-950/10 space-y-3.5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
                <BellRing className="h-5 w-5 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-widest font-sans">
                  PROACTIVE BUDGET ALERTS ({activeAlerts.length})
                </h3>
              </div>
              <button
                onClick={() => setDismissedAlerts(budgetItems.map((item) => item.category))}
                className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
              >
                Mute All Notifications
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeAlerts.map((alert) => (
                <motion.div
                  key={alert.category}
                  layout
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-900/40 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: alert.color }} />
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white font-sans">{alert.category}</h4>
                      </div>
                      <button
                        onClick={() => setDismissedAlerts((prev) => [...prev, alert.category])}
                        className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        title="Dismiss alert"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {alert.isOverBudget ? (
                        <span>
                          🚨 Exceeded budget limit by{" "}
                          <strong className="text-rose-600 dark:text-rose-400 font-bold">
                            ${(alert.amount - alert.budget).toFixed(0)}
                          </strong>!
                        </span>
                      ) : (
                        <span>
                          ⚠️ Warning: Reached{" "}
                          <strong className="text-amber-500 dark:text-amber-400 font-bold">
                            {alert.ratio.toFixed(0)}%
                          </strong>{" "}
                          of limit (Threshold: {alert.threshold}%).
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between text-[10px] border-t border-slate-100 dark:border-slate-800/80 pt-2 font-mono">
                    <span className="text-slate-400">Spent: ${alert.amount} / Limit: ${alert.budget}</span>
                    <button
                      onClick={() => setSelectedCategoryIdx(alert.index)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                    >
                      Configure Alert
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-950/30 bg-emerald-50/20 dark:bg-emerald-950/5 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-2.5 text-emerald-600 dark:text-emerald-400">
              <Bell className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold font-sans">
                ALL SYSTEMS GREEN • No categories are exceeding their warning thresholds!
              </span>
            </div>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider hidden sm:inline">
              Safe Zone
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5-Span): Financial Inputs & Progress Bars */}
        <div className="lg:col-span-5 space-y-6">
          {/* Income Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Monthly Cash Inflow
            </h3>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
              <input
                type="number"
                value={incomeInput}
                onChange={(e) => setIncomeInput(parseFloat(e.target.value) || 0)}
                placeholder="Monthly take-home income..."
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">TOTAL OUTFLOWS</span>
                <span className="text-base font-bold text-slate-800 dark:text-white">${totalSpent}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold block">EST. MONTHLY SAVINGS</span>
                <span className={`text-base font-bold ${totalSavings >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  ${totalSavings}
                </span>
              </div>
            </div>
          </div>

          {/* Budget Limit List with editable warning thresholds */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  Expense Categories
                </h3>
                <span className="text-[10px] text-slate-400">
                  💡 Click any row to customize thresholds or edit limits
                </span>
              </div>
              <button
                onClick={handleResetBudget}
                className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center space-x-1"
                title="Reset list to sample template"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset template</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {budgetItems.map((item, idx) => {
                const ratio = Math.round((item.amount / (item.budget || 1)) * 100);
                const isOver = item.amount > item.budget;
                const threshold = item.threshold ?? 85;
                const isOverThreshold = ratio >= threshold;
                const isSelected = selectedCategoryIdx === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedCategoryIdx(isSelected ? null : idx)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-blue-50/40 dark:bg-blue-950/10 border-blue-200 dark:border-blue-800/80"
                        : "bg-transparent border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-bold text-slate-700 dark:text-slate-200">{item.category}</span>
                          {isOverThreshold && (
                            <span
                              className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded ${
                                isOver
                                  ? "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                                  : "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                              }`}
                            >
                              {isOver ? "OVER LIMIT" : `ALERT (${threshold}%)`}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-400">
                          <span className={`font-bold ${isOver ? "text-red-500" : "text-slate-800 dark:text-white"}`}>
                            ${item.amount}
                          </span>{" "}
                          / ${item.budget}
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isOver ? "bg-red-500" : isOverThreshold ? "bg-amber-500" : "bg-blue-600"
                          }`}
                          style={{ width: `${Math.min(ratio, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Category Editor Drawer (shown when selected) */}
            <AnimatePresence>
              {selectedCategoryIdx !== null && budgetItems[selectedCategoryIdx] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3.5 text-xs overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-150 dark:border-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: budgetItems[selectedCategoryIdx].color }} />
                      <h4 className="font-bold text-slate-800 dark:text-white">
                        Configure {budgetItems[selectedCategoryIdx].category}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedCategoryIdx(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">CURRENT SPENT ($)</label>
                      <input
                        type="number"
                        value={budgetItems[selectedCategoryIdx].amount}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setBudgetItems((prev) =>
                            prev.map((item, i) => (i === selectedCategoryIdx ? { ...item, amount: val } : item))
                          );
                          // Reset alert dismissal when amount modifies
                          setDismissedAlerts((prev) => prev.filter((c) => c !== budgetItems[selectedCategoryIdx].category));
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">BUDGET LIMIT ($)</label>
                      <input
                        type="number"
                        value={budgetItems[selectedCategoryIdx].budget}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setBudgetItems((prev) =>
                            prev.map((item, i) => (i === selectedCategoryIdx ? { ...item, budget: val } : item))
                          );
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Threshold setting */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold block">
                        ALERT WARNING THRESHOLD
                      </span>
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                        {budgetItems[selectedCategoryIdx].threshold ?? 85}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={budgetItems[selectedCategoryIdx].threshold ?? 85}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setBudgetItems((prev) =>
                          prev.map((item, i) => (i === selectedCategoryIdx ? { ...item, threshold: val } : item))
                        );
                        // Reset alert dismissal on threshold change
                        setDismissedAlerts((prev) => prev.filter((c) => c !== budgetItems[selectedCategoryIdx].category));
                      }}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-slate-400 font-semibold px-0.5 font-mono">
                      <span>50% (Strict)</span>
                      <span>85% (Standard)</span>
                      <span>100% (Absolute Limit)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        const catName = budgetItems[selectedCategoryIdx].category;
                        setBudgetItems((prev) => prev.filter((_, i) => i !== selectedCategoryIdx));
                        setSelectedCategoryIdx(null);
                        setDismissedAlerts((prev) => prev.filter((c) => c !== catName));
                      }}
                      className="font-bold text-red-500 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete Category</span>
                    </button>
                    <span className="text-slate-400 italic">Saved to Sandbox Storage</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick add category item */}
            <form onSubmit={handleAddNewItem} className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-12 gap-2.5 items-end">
              <div className="col-span-4 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">CATEGORY</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Gym"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
                />
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">SPENT ($)</label>
                <input
                  type="number"
                  required
                  placeholder="20"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
                />
              </div>
              <div className="col-span-3 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">LIMIT ($)</label>
                <input
                  type="number"
                  required
                  placeholder="50"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block" title="Warning Threshold %">WARN %</label>
                <select
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="w-full px-1 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
                >
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="80">80%</option>
                  <option value="85">85%</option>
                  <option value="90">90%</option>
                  <option value="95">95%</option>
                  <option value="100">100%</option>
                </select>
              </div>
              <div className="col-span-12 pt-1">
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 rounded-lg flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Add Custom Category with Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (7-Span): Recharts Visualizations & AI recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Charts view (Pie & Bar comparative vs Historical Line) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Expense Visualizers
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Analyze current structure or historical spending progress
                </p>
              </div>
              <div className="flex space-x-1 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl max-w-fit self-start sm:self-auto">
                <button
                  onClick={() => setActiveVisualizerTab("breakdown")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeVisualizerTab === "breakdown"
                      ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  Current Breakdown
                </button>
                <button
                  onClick={() => setActiveVisualizerTab("history")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeVisualizerTab === "history"
                      ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  Historical Trends
                </button>
              </div>
            </div>

            {activeVisualizerTab === "breakdown" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Circular category pie */}
                <div className="space-y-2 text-center">
                  <span className="text-[11px] text-slate-400 font-bold block">PROPORTIONAL OUTFLOW</span>
                  <div className="h-48 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Total indicator in center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] text-slate-400 font-bold">TOTAL</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-white">${totalSpent}</span>
                    </div>
                  </div>
                </div>

                {/* Bar comparison chart */}
                <div className="space-y-2 text-center">
                  <span className="text-[11px] text-slate-400 font-bold block">ACTUAL SPENT VS BUDGET LIMIT</span>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={budgetItems} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="category" tick={{ fill: "var(--chart-text)", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--chart-text)", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Bar dataKey="amount" fill="#3B82F6" name="Spent" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="budget" fill="#E2E8F0" name="Limit" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 pt-2">
                {/* Category selectors for trends */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider block uppercase">
                    Select Filter Metric
                  </span>
                  <div className="flex flex-wrap gap-1.5 overflow-x-auto max-h-24 scrollbar-none pb-1">
                    {["Total Outflow", ...budgetItems.map(i => i.category)].map((cat) => {
                      const isActive = selectedTrendCategory === cat;
                      const catColor = cat === "Total Outflow" ? "#6366F1" : budgetItems.find(i => i.category === cat)?.color ?? "#64748B";
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedTrendCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 border cursor-pointer ${
                            isActive
                              ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: catColor }} />
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Line Chart */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Monthly Spending Trend: {selectedTrendCategory}</span>
                    <span className="text-indigo-500 font-bold flex items-center">
                      <TrendingUp className="mr-1 h-3.5 w-3.5" />
                      Historical Series
                    </span>
                  </div>
                  
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={fullTrendData.map(d => {
                          let val = 0;
                          if (selectedTrendCategory === "Total Outflow") {
                            val = d.Total;
                          } else {
                            val = (d as any)[selectedTrendCategory] !== undefined
                              ? (d as any)[selectedTrendCategory]
                              : Math.round((d.Total * 0.12) * (0.8 + Math.random() * 0.4));
                          }
                          return {
                            name: d.name,
                            Spending: val,
                            Total: d.Total
                          };
                        })}
                        margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: "var(--chart-text)", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--chart-text)", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="Spending"
                          name={selectedTrendCategory === "Total Outflow" ? "Total Outflow" : `${selectedTrendCategory} Outflow`}
                          stroke={selectedTrendCategory === "Total Outflow" ? "#6366F1" : budgetItems.find(i => i.category === selectedTrendCategory)?.color ?? "#3B82F6"}
                          strokeWidth={2.5}
                          activeDot={{ r: 6 }}
                          dot={{ r: 3, strokeWidth: 1.5 }}
                        />
                        {selectedTrendCategory !== "Total Outflow" && (
                          <Line
                            type="monotone"
                            dataKey="Total"
                            name="Total Spending Reference"
                            stroke="#E2E8F0"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            dot={false}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Savings Goals Tracker Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Target className="h-4.5 w-4.5 text-blue-500" />
                  <span>Savings Goals Tracker</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Set specific savings targets, accumulate resources, and claim XP multipliers!
                </p>
              </div>

              <button
                onClick={() => setShowAddGoalForm(!showAddGoalForm)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
              >
                {showAddGoalForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span>{showAddGoalForm ? "Cancel" : "New Goal"}</span>
              </button>
            </div>

            {/* Create Goal Form */}
            <AnimatePresence>
              {showAddGoalForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCreateSavingsGoal}
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl space-y-4 overflow-hidden text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase">Goal Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Tesla Down Payment"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase">Category</label>
                      <select
                        value={goalCategory}
                        onChange={(e) => setGoalCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:border-blue-500"
                      >
                        <option value="Security">Security / Emergency</option>
                        <option value="Vacation">Vacation / Travel</option>
                        <option value="Electronics">Electronics / Tech</option>
                        <option value="Vehicle">Vehicle / Transport</option>
                        <option value="Education">Education / Skillup</option>
                        <option value="Investments">Investments</option>
                        <option value="Other">Other Want</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase">Target Amount ($)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="e.g., 5000"
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase">Initial Saved ($)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g., 500"
                        value={goalCurrent}
                        onChange={(e) => setGoalCurrent(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Goal Color */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase">Goal Theme Color</label>
                    <div className="flex items-center space-x-3">
                      {["#10B981", "#8B5CF6", "#3B82F6", "#F59E0B", "#F43F5E", "#EC4899", "#64748B"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setGoalColor(c)}
                          className="h-6 w-6 rounded-full border border-white/20 relative cursor-pointer"
                          style={{ backgroundColor: c }}
                        >
                          {goalColor === c && (
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Specific Goal (+30 XP)</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Savings Goals List */}
            <div className="space-y-4">
              {savingsGoals.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <Coins className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs text-slate-400 mt-2">
                    No active savings goals. Tap "New Goal" to establish your target!
                  </p>
                </div>
              ) : (
                savingsGoals.map((goal) => {
                  const percent = Math.min(Math.round((goal.current / (goal.target || 1)) * 100), 100);
                  const isReached = goal.current >= goal.target;
                  const deltaRemaining = Math.max(0, goal.target - goal.current);

                  return (
                    <div
                      key={goal.id}
                      className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 relative overflow-hidden flex flex-col justify-between gap-3.5"
                    >
                      {/* Celebratory Animation Overlay */}
                      <AnimatePresence>
                        {celebratingGoalId === goal.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center text-center p-4 z-20 text-white rounded-xl"
                          >
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              {[...Array(30)].map((_, i) => {
                                const randomX = Math.random() * 300 - 150;
                                const randomY = - (Math.random() * 150 + 100);
                                const size = Math.random() * 8 + 4;
                                const delay = Math.random() * 0.4;
                                const colors = ["#10B981", "#8B5CF6", "#3B82F6", "#F59E0B", "#F43F5E", "#EC4899"];
                                const color = colors[i % colors.length];

                                return (
                                  <motion.div
                                    key={i}
                                    initial={{ x: 0, y: 100, opacity: 1, rotate: 0 }}
                                    animate={{
                                      x: randomX,
                                      y: randomY,
                                      opacity: 0,
                                      rotate: Math.random() * 360 + 180
                                    }}
                                    transition={{
                                      duration: 2.2,
                                      delay,
                                      ease: "easeOut"
                                    }}
                                    className="absolute left-1/2 bottom-0 rounded-sm"
                                    style={{
                                      width: size,
                                      height: size * (Math.random() > 0.5 ? 1.5 : 1),
                                      backgroundColor: color
                                    }}
                                  />
                                );
                              })}
                            </div>

                            <motion.div
                              initial={{ scale: 0.5, rotate: -15 }}
                              animate={{ scale: 1.1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200, damping: 10 }}
                              className="h-12 w-12 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-2xl shadow-lg"
                            >
                              🥳
                            </motion.div>
                            <h4 className="text-xs font-extrabold font-sans mt-2 tracking-tight">
                              Target Reached! Goal Achieved!
                            </h4>
                            <p className="text-[10px] text-slate-300 max-w-xs mt-0.5 leading-normal">
                              You saved <span className="font-extrabold text-amber-400">${goal.target}</span> for <span className="font-bold text-white">"{goal.name}"</span>!
                            </p>
                            
                            <div className="mt-3 flex items-center space-x-2 bg-emerald-500/25 border border-emerald-500/35 px-3 py-1 rounded-full text-emerald-400 text-[9px] font-bold font-mono">
                              <Award className="h-3 w-3 animate-bounce" />
                              <span>Awarded +150 XP!</span>
                            </div>

                            <button
                              onClick={() => setCelebratingGoalId(null)}
                              className="mt-4 px-3 py-1 bg-white text-slate-900 rounded-lg text-[10px] font-extrabold hover:bg-slate-100 transition-all cursor-pointer"
                            >
                              Dismiss Celebration
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className="px-2 py-0.5 text-[8px] font-extrabold rounded-full uppercase tracking-wider text-white"
                              style={{ backgroundColor: goal.color }}
                            >
                              {goal.category}
                            </span>
                            {isReached && (
                              <span className="flex items-center text-[8px] text-emerald-500 font-bold space-x-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                <CheckCircle className="h-2.5 w-2.5" />
                                <span>COMPLETED</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white font-sans">
                            {goal.name}
                          </h4>
                        </div>

                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer"
                          title="Delete Goal"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Progress Metrics */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          <span>
                            Saved <strong className="text-slate-700 dark:text-slate-200">${goal.current}</strong> of ${goal.target}
                          </span>
                          <span className="font-bold font-mono" style={{ color: goal.color }}>
                            {percent}%
                          </span>
                        </div>

                        {/* Progress Bar container */}
                        <div className="w-full bg-slate-200/60 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-100 dark:border-slate-850">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: goal.color,
                              boxShadow: percent === 100 ? `0 0 8px ${goal.color}` : "none"
                            }}
                          />
                        </div>
                      </div>

                      {/* Interactive contribution forms */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-150 dark:border-slate-800/60 text-[10px]">
                        {isReached ? (
                          <span className="text-emerald-500 font-bold flex items-center space-x-1.5">
                            <Gift className="h-4.5 w-4.5 fill-emerald-100 dark:fill-transparent" />
                            <span>Great job! Target met successfully.</span>
                            {celebratedGoalIds.includes(goal.id) && (
                              <button
                                onClick={() => setCelebratingGoalId(goal.id)}
                                className="text-blue-500 hover:underline font-extrabold cursor-pointer text-[9px]"
                              >
                                (Celebrate again!)
                              </button>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            Needs <strong className="text-slate-600 dark:text-slate-200 font-bold">${deltaRemaining}</strong> more to hit target
                          </span>
                        )}

                        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                          <span className="font-bold text-slate-400 font-sans">$</span>
                          <input
                            type="number"
                            min="1"
                            placeholder="Amount"
                            value={goalFundAmount[goal.id] || ""}
                            onChange={(e) =>
                              setGoalFundAmount((prev) => ({ ...prev, [goal.id]: e.target.value }))
                            }
                            className="w-16 px-1.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:border-blue-500 text-slate-800 dark:text-white"
                          />
                          <button
                            onClick={() => handleAddFunds(goal.id, false)}
                            className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-md shadow-sm cursor-pointer transition-colors"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => handleAddFunds(goal.id, true)}
                            className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold rounded-md shadow-sm cursor-pointer transition-colors"
                          >
                            Sub
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Coach assessment panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-indigo-500 fill-indigo-100 dark:fill-transparent" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                  AI Personal Finance Suggestions
                </h3>
              </div>
              <button
                onClick={() => handleTriggerBudgetAnalyze()}
                disabled={analyzing}
                className="inline-flex items-center space-x-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline disabled:opacity-50 cursor-pointer"
              >
                {analyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                <span>Get AI suggestions</span>
              </button>
            </div>

            {/* Core suggestions banner */}
            <div className="p-4 rounded-xl border border-indigo-50 dark:border-indigo-950/20 bg-indigo-50/10 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
              {aiSuggestions}
            </div>

            {/* Savings goals progress */}
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 font-sans">Savings Target Rate: 20%</span>
                <span className={`font-extrabold font-mono ${currentSavingsRate >= 20 ? "text-emerald-500" : "text-amber-500"}`}>
                  Current: {currentSavingsRate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${currentSavingsRate >= 20 ? "bg-emerald-500" : "bg-amber-500"}`}
                  style={{ width: `${Math.min(currentSavingsRate, 100)}%` }}
                />
              </div>
            </div>

            {/* Money savings tips list */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
                Tailored Savings Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {savingTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {tip.category}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white leading-snug font-sans">
                      {tip.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
