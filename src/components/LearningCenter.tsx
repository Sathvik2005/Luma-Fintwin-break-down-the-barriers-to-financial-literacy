/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  Trophy,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
  PlayCircle,
  Award,
  AlertCircle
} from "lucide-react";
import { Lesson, QuizQuestion } from "../types";

interface LearningCenterProps {
  lessons: Lesson[];
  onCompleteLesson: (id: string) => void;
  onIncrementXP: (amount: number) => void;
  onUnlockAchievement: (badgeId: string) => void;
}

export default function LearningCenter({
  lessons,
  onCompleteLesson,
  onIncrementXP,
  onUnlockAchievement,
}: LearningCenterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Quiz execution states
  const [inQuizMode, setInQuizMode] = useState(false);
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Filter lessons
  const categories = ["All", ...Array.from(new Set(lessons.map((l) => l.category)))];

  const filteredLessons = selectedCategory === "All"
    ? lessons
    : lessons.filter((l) => l.category === selectedCategory);

  const completedCount = lessons.filter((l) => l.completed).length;
  const totalXPBonus = completedCount * 100;

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setInQuizMode(false);
    setCurrentQuizQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleStartQuiz = () => {
    setInQuizMode(true);
    setCurrentQuizQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleSelectAnswer = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswerIndex(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedAnswerIndex === null) return;

    const currentQuestion = activeLesson?.quiz[currentQuizQuestionIndex];
    if (currentQuestion && selectedAnswerIndex === currentQuestion.answerIndex) {
      setScore((prev) => prev + 1);
    }

    setQuizSubmitted(true);
  };

  const handleNextQuizQuestion = () => {
    if (!activeLesson) return;

    if (currentQuizQuestionIndex + 1 < activeLesson.quiz.length) {
      setCurrentQuizQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      const totalQuestions = activeLesson.quiz.length;
      const passMark = Math.ceil(totalQuestions / 2); // Pass if they get > 50%

      if (score >= passMark) {
        // Mark lesson completed
        onCompleteLesson(activeLesson.id);

        // Calculate if all lessons are completed to award final badge
        const updatedCompletedCount = lessons.filter((l) => l.completed || l.id === activeLesson.id).length;
        if (updatedCompletedCount === lessons.length) {
          onUnlockAchievement("ach_4"); // Knowledge Guru badge
          onIncrementXP(300);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-indigo-500" />
            <span>Learning Center</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Learn essential financial structures through bite-sized interactive courses and pass quizzes to level up.
          </p>
        </div>

        {/* Global Stats bar */}
        <div className="flex items-center space-x-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 px-4 py-2.5 rounded-xl shrink-0">
          <Trophy className="h-4.5 w-4.5 text-indigo-500 fill-indigo-100 dark:fill-transparent" />
          <div className="text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Lessons Completed: </span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              {completedCount} / {lessons.length}
            </span>
          </div>
        </div>
      </div>

      {!activeLesson ? (
        // LESSONS EXPLORE VIEW
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto select-none pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/10"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lessons Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => handleStartLesson(lesson)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                      {lesson.category}
                    </span>
                    {lesson.completed && (
                      <span className="flex items-center text-[10px] font-extrabold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                        <CheckCircle className="mr-1 h-3.5 w-3.5" />
                        <span>Done (+100 XP)</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {lesson.shortDescription}
                  </p>
                </div>

                <div className="border-t border-slate-50 dark:border-slate-800/80 my-4 pt-3.5 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center">
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    <span>{lesson.estimatedTime}</span>
                  </span>

                  <span className="inline-flex items-center font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    <span>{lesson.completed ? "Review Lesson" : "Start Lesson"}</span>
                    <ChevronRight className="ml-0.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ACTIVE LESSON DETAILED READING VIEW / QUIZ VIEW
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Reading / Quiz Pane (8-Span) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[460px] flex flex-col justify-between">
            {!inQuizMode ? (
              // 1. Reading content mode
              <div className="flex-1 flex flex-col">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                      {activeLesson.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{activeLesson.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    Back to Explore
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-6 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap font-medium">
                    {activeLesson.content}
                  </div>
                </div>

                {/* Footer bar triggers Quiz */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                  <span className="text-xs text-slate-400 flex items-center">
                    <Clock className="mr-1.5 h-4 w-4" />
                    <span>Finished reading? Test your memory.</span>
                  </span>
                  <button
                    onClick={handleStartQuiz}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    <PlayCircle className="mr-1.5 h-4 w-4" />
                    <span>Take Lesson Quiz (+100 XP)</span>
                  </button>
                </div>
              </div>
            ) : (
              // 2. Active Quiz execution mode
              <div className="flex-1 flex flex-col justify-between">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
                    <GraduationCap className="h-4.5 w-4.5" />
                    <span>Active Quiz Evaluation</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Question {currentQuizQuestionIndex + 1} of {activeLesson.quiz.length}
                  </span>
                </div>

                {!quizFinished ? (
                  // Running the quiz question-by-question
                  <div className="p-6 sm:p-8 flex-1 space-y-6">
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${((currentQuizQuestionIndex) / activeLesson.quiz.length) * 100}%` }}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-normal">
                        {activeLesson.quiz[currentQuizQuestionIndex].question}
                      </h4>

                      <div className="grid grid-cols-1 gap-3 pt-2">
                        {activeLesson.quiz[currentQuizQuestionIndex].options.map((option, idx) => {
                          const isSelected = selectedAnswerIndex === idx;
                          const isCorrect = idx === activeLesson.quiz[currentQuizQuestionIndex].answerIndex;

                          let optionStyle = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300";
                          if (isSelected) {
                            optionStyle = "border-indigo-500 bg-indigo-50/40 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-950/20";
                          }

                          if (quizSubmitted) {
                            if (isCorrect) {
                              optionStyle = "border-emerald-500 bg-emerald-50/40 text-emerald-800 dark:text-emerald-400 dark:bg-emerald-950/25";
                            } else if (isSelected) {
                              optionStyle = "border-red-500 bg-red-50/40 text-red-800 dark:text-red-400 dark:bg-red-950/25";
                            } else {
                              optionStyle = "border-slate-100 dark:border-slate-800 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelectAnswer(idx)}
                              disabled={quizSubmitted}
                              className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${optionStyle}`}
                            >
                              <div className="flex items-center space-x-3">
                                <span className={`h-6 w-6 rounded-full border flex items-center justify-center font-bold text-xs ${isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 text-slate-400"}`}>
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span>{option}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feedback explanations */}
                    {quizSubmitted && (
                      <div className={`p-4 rounded-xl border leading-relaxed text-xs space-y-1.5 ${
                        selectedAnswerIndex === activeLesson.quiz[currentQuizQuestionIndex].answerIndex
                          ? "bg-emerald-50/40 border-emerald-100 dark:bg-emerald-950/15 dark:border-emerald-900/20"
                          : "bg-red-50/40 border-red-100 dark:bg-red-950/15 dark:border-red-900/20"
                      }`}>
                        <p className={`font-bold ${selectedAnswerIndex === activeLesson.quiz[currentQuizQuestionIndex].answerIndex ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                          {selectedAnswerIndex === activeLesson.quiz[currentQuizQuestionIndex].answerIndex ? "✓ Correct!" : "✗ Incorrect Answer"}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                          {activeLesson.quiz[currentQuizQuestionIndex].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Quiz summary evaluation scorecard
                  <div className="p-8 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
                    {score >= Math.ceil(activeLesson.quiz.length / 2) ? (
                      <>
                        <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center shadow-md animate-bounce">
                          <CheckCircle className="h-10 w-10" />
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                            Course Completed Successfully!
                          </h3>
                          <p className="text-sm text-slate-500 max-w-sm">
                            You scored **{score} out of {activeLesson.quiz.length}**. Outstanding knowledge retention.
                          </p>
                          <span className="inline-block text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mt-3">
                            +100 XP REWARDED
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-16 w-16 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center">
                          <AlertCircle className="h-10 w-10" />
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                            Quiz Attempt Complete
                          </h3>
                          <p className="text-sm text-slate-500 max-w-sm">
                            You got **{score} out of {activeLesson.quiz.length}**. You need to get at least 50% correct to unlock your XP certificate.
                          </p>
                          <button
                            onClick={handleStartQuiz}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs mt-3 shadow-sm transition-all"
                          >
                            Retry Quiz
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Footer controls */}
                {!quizFinished && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuizAnswer}
                        disabled={selectedAnswerIndex === null}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs disabled:opacity-40 transition-all cursor-pointer"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <span>
                          {currentQuizQuestionIndex + 1 < activeLesson.quiz.length ? "Next Question" : "See Results"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {quizFinished && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between gap-4">
                    <button
                      onClick={() => setInQuizMode(false)}
                      className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs"
                    >
                      Return to Reading
                    </button>
                    <button
                      onClick={() => setActiveLesson(null)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
                    >
                      Exit Lesson
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar recommendations / Lesson Directory (4-Span) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Course Directory ({lessons.length})
              </h3>

              <div className="space-y-2.5">
                {lessons.map((les) => (
                  <div
                    key={les.id}
                    onClick={() => handleStartLesson(les)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      activeLesson && activeLesson.id === les.id
                        ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <div className="truncate pr-3 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase block tracking-wider opacity-60">
                        {les.category}
                      </span>
                      <span className="text-xs font-bold truncate block">{les.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
