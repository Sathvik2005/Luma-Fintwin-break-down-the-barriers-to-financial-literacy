/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart2,
  BookOpen,
  Trophy,
  Plus,
  Minus,
  FileSearch,
  MessageSquare,
  Sparkles,
  ArrowRightCircle,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { FAQS, TESTIMONIALS, LOGOS } from "../data";

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
}

export default function LandingPage({ setCurrentTab }: LandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const features = [
    {
      icon: <FileSearch className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "AI Document Analyzer",
      description: "Upload loans, lease agreements, credit contracts or invoices to detect hidden clauses in seconds.",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Financial Chat Assistant",
      description: "Ask context-aware follow-up questions about complex terms like EMI, APR, or escrow limits.",
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Budget Coach",
      description: "Visualize category spending against target savings rates, with automated money saving suggestions.",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Learning Center",
      description: "Participate in bite-sized interactive finance courses spanning investing, taxes, and compound interest.",
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      title: "Risk Detection",
      description: "Get highlighted warnings of penalty rate hikes, automatic renewals, and restrictive court waiver clauses.",
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      icon: <Trophy className="h-6 w-6 text-pink-600 dark:text-pink-400" />,
      title: "Money Challenges",
      description: "Gamified daily challenges, achievement levels, streak counters, and rewardable XP points.",
      bg: "bg-pink-50 dark:bg-pink-950/20",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Upload Document",
      desc: "Drag and drop any PDF or photo of an agreement, bill, or invoice.",
    },
    {
      num: "02",
      title: "AI Analysis",
      desc: "Google Gemini scans the contract text and extracts structural insights.",
    },
    {
      num: "03",
      title: "Understand Everything",
      desc: "Read simple terms, detect risks, and view an 'Explain to a 15-year-old' version.",
    },
    {
      num: "04",
      title: "Improve Health",
      desc: "Pass gamified quizzes, complete daily budgeting challenges, and master your cash.",
    },
  ];

  // Motion variant definitions for premium stagger loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),theme(colors.slate.50))] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.950/15),theme(colors.slate.950))]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Copy */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen Financial Intelligence</span>
              </motion.div>
              <motion.h1 variants={itemVariants} className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Understand Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Money</span> with AI.
              </motion.h1>
              <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Upload any financial document and get simple explanations, hidden risks, important terms, and personalized financial advice. Take control of your financial destiny today.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setCurrentTab("dashboard")}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 dark:shadow-none transition-all group cursor-pointer"
                >
                  Try Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setCurrentTab("learning")}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-all cursor-pointer"
                >
                  Explore Lessons
                </button>
              </motion.div>
 
              {/* Secure statement */}
              <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start space-x-2 text-xs text-slate-500 dark:text-slate-500 pt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Secure, private, server-side processing.</span>
              </motion.div>
            </motion.div>
 
            {/* Right Mockup Illustration */}
            <div className="mt-16 lg:mt-0 lg:col-span-6 relative flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                className="relative w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none"
              >
                {/* Upload Action Visualizer */}
                <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-sm">
                    <FileSearch className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Evaluating Personal_Loan_Agreement.pdf</span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full w-4/5 animate-pulse" />
                  </div>
                </div>
 
                {/* Floating Insight Card 1: Hidden Fees */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl shadow-lg shadow-slate-100 dark:shadow-none flex items-center space-x-3 max-w-[200px]"
                >
                  <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center font-bold text-xs">
                    $
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Hidden Fees Found</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">$250 processing fee</p>
                  </div>
                </motion.div>
 
                {/* Floating Insight Card 2: Risk Level */}
                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
                  className="absolute top-1/2 -right-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl shadow-lg shadow-slate-100 dark:shadow-none flex items-center space-x-3 max-w-[180px]"
                >
                  <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Risk Severity</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">Late fee jump to 29%</p>
                  </div>
                </motion.div>
 
                {/* Floating Insight Card 3: Health Score */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 4.4, ease: "easeInOut" }}
                  className="absolute -bottom-6 left-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 px-4 rounded-2xl shadow-lg shadow-slate-100 dark:shadow-none flex items-center space-x-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    84
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Score</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">Great savings habits!</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Inspired by the design and trust principles of next-gen platforms
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {LOGOS.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 transition-all text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Smarter Finance tools for better money.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Say goodbye to complicated legal documents and confusing finance spreadsheets. FinTwin AI wraps everything in high-fidelity visualizers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                onClick={() => {
                  if (idx === 0 || idx === 4) setCurrentTab("analyzer");
                  else if (idx === 1) setCurrentTab("analyzer");
                  else if (idx === 2) setCurrentTab("budget");
                  else if (idx === 3) setCurrentTab("learning");
                  else setCurrentTab("gamification");
                }}
              >
                <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
            <h2 className="font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Simple 4-Step Journey
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Transform confusing documentation into clear financial confidence in less than 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/25 border border-slate-100 dark:border-slate-800">
                <span className="text-4xl font-extrabold text-blue-600/20 dark:text-blue-400/15 font-mono">
                  {step.num}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Teaser */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Gamified Duolingo-style Finance Dashboard
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                Track your financial health score, complete daily tasks, earn experience points (XP), unlock custom reward badges, and reach levels as you learn!
              </p>
              <ul className="space-y-3.5">
                {[
                  "Personalized AI health recommendations",
                  "Daily budgeting challenges with XP rewards",
                  "Comprehensive learning progress tracking",
                  "Document upload count history logs"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-500">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setCurrentTab("dashboard")}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline group cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="mt-12 lg:mt-0 lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      LC
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Literacy Level 3</h4>
                      <p className="text-xs text-slate-400">XP Progress: 480 / 1000 XP</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-orange-500">🔥 3 Day Streak</p>
                    <p className="text-xs text-slate-400">Score: 84 / 100</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 font-bold">Daily Challenge</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white mt-2"> Subscription Audit</span>
                    <span className="text-[10px] text-blue-500 font-bold mt-1">+50 XP</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 font-bold">Latest Badge</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white mt-2">🎓 FinTwin Scholar</span>
                    <span className="text-[10px] text-emerald-500 font-bold mt-1">Unlocked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Trusted by users worldwide.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <p className="text-sm italic text-slate-600 dark:text-slate-400 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h5>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 dark:text-white text-sm sm:text-base hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="faq-content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to decode your financial future?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Gain full understanding of all financial paperwork. No hidden surprises. No fine-print trickery. Only clarity.
          </p>
          <button
            onClick={() => setCurrentTab("dashboard")}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg transition-all cursor-pointer"
          >
            Launch Free Analyzer
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
