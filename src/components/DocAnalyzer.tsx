/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Upload,
  Sparkles,
  AlertTriangle,
  Info,
  DollarSign,
  HelpCircle,
  BookOpen,
  Send,
  Loader2,
  CheckCircle,
  FileCode,
  ShieldCheck,
  ChevronDown,
  Trash2,
  ArrowRight
} from "lucide-react";
import { DocumentAnalysis, ChatMessage } from "../types";

interface DocAnalyzerProps {
  documents: DocumentAnalysis[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentAnalysis[]>>;
  selectedDocument: DocumentAnalysis | null;
  setSelectedDocument: (doc: DocumentAnalysis | null) => void;
  onUnlockAchievement: (badgeId: string) => void;
  onIncrementXP: (amount: number) => void;
}

export default function DocAnalyzer({
  documents,
  setDocuments,
  selectedDocument,
  setSelectedDocument,
  onUnlockAchievement,
  onIncrementXP,
}: DocAnalyzerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [chatSending, setChatSending] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [currentTab, setCurrentTab] = useState<'summary' | 'fees' | 'risks' | 'easy' | 'terms'>('summary');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: "Hi! Upload a financial document on the left, and I will analyze its fine print for you. Once analyzed, you can ask me questions about any clause or term!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Predefined samples for immediate testing
  const sampleTemplates = [
    { name: "Personal_Loan_Agreement.pdf", type: "Personal Loan Agreement" },
    { name: "Apartment_Lease_Contract.pdf", type: "Apartment Lease Agreement" },
    { name: "Utility_Electric_Statement.jpg", type: "Utility Invoice / Service Bill" },
    { name: "Gold_Visa_Credit_Card.pdf", type: "Credit Card Agreement" },
  ];

  // Drag-and-drop handler
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Main file processing logic
  const handleFile = async (file: File) => {
    setAnalyzing(true);
    try {
      const base64Content = await getBase64(file);
      await triggerAnalysis(file.name, file.type, base64Content);
    } catch (error) {
      console.error("Error reading file:", error);
      setAnalyzing(false);
    }
  };

  // Convert File to base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(",")[1];
        resolve(base64String || "");
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Trigger server-side API call
  const triggerAnalysis = async (fileName: string, fileType: string, base64Data: string, customType?: string) => {
    setAnalyzing(true);
    setAnalysisStep(0);
    const intervalId = setInterval(() => {
      setAnalysisStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
          fileType,
          fileContentBase64: base64Data,
          customDocType: customType,
        }),
      });

      const result = await response.json();
      if (result.success) {
        const newDoc: DocumentAnalysis = result.data;
        setDocuments((prev) => [newDoc, ...prev]);
        setSelectedDocument(newDoc);

        // Adjust chat intro dynamically
        setChatHistory([
          {
            id: "doc_loaded",
            sender: "ai",
            text: `I've successfully audited "${newDoc.name}"! I found ${newDoc.hiddenFees.length} potential hidden fees and ${newDoc.risks.length} key risks. Try asking me something like "What is the APR?" or "What are the hidden fees?"`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        // Reward XP and Achievements
        onIncrementXP(150);
        onUnlockAchievement("ach_1"); // First analysis badge
      } else {
        alert("Could not analyze document: " + result.message);
      }
    } catch (e) {
      console.error("API error during analysis:", e);
      alert("Failed to reach server-side analysis pipeline. Please retry.");
    } finally {
      clearInterval(intervalId);
      setAnalyzing(false);
    }
  };

  // Process sample selection
  const handleSelectSample = (sample: typeof sampleTemplates[0]) => {
    const mockBase64 = "MOCK_BASE64_PLACEHOLDER_FOR_DUMMY_Agreements_AND_FINANCE_SHEETS";
    triggerAnalysis(sample.name, "application/pdf", mockBase64, sample.type);
  };

  // Handle chatbot messaging
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatSending) return;

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    const originalInput = chatInput;
    setChatInput("");
    setChatSending(true);

    // Scroll to bottom
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
          documentContext: selectedDocument,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setChatHistory((prev) => [
          ...prev,
          {
            id: "reply_" + Date.now(),
            sender: "ai",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        onIncrementXP(10); // Reward active user curiosity
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          sender: "ai",
          text: "I encountered a minor network issue formulated by offline states. Let's try again shortly!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatSending(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    if (selectedDocument && selectedDocument.id === id) {
      setSelectedDocument(updated.length > 0 ? updated[0] : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h2 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-blue-500 fill-blue-100 dark:fill-transparent" />
          <span>AI Document Analyzer</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload credit card contracts, bank loan terms, lease sheets, or utility invoices for real-time risk assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Hand: Upload pane & Previously analyzed list */}
        <div className="lg:col-span-4 space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
              dragActive
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                : "border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-slate-50/40 dark:hover:bg-slate-900/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*,.png,.jpg,.jpeg"
              onChange={handleFileInput}
              className="hidden"
            />
            {!analyzing ? (
              <div className="flex flex-col items-center justify-center space-y-3.5">
                <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Drag & drop your files
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports PDFs, PNGs, and JPEGs up to 10MB
                  </p>
                </div>
                <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm transition-all cursor-pointer">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 w-full">
                <div className="relative h-14 w-14 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 dark:border-blue-500/30 animate-ping" />
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
                <div className="w-full space-y-3 px-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>AI Auditing Progress</span>
                    <span>{Math.round(((analysisStep + 1) / 4) * 100)}%</span>
                  </div>
                  {/* Custom animated progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((analysisStep + 1) / 4) * 100}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  {/* Sequential steps list */}
                  <div className="space-y-1.5 text-left pt-1">
                    {[
                      "Uploading document secure packet...",
                      "Extracting and scanning page text...",
                      "Auditing fine print with Gemini AI...",
                      "Assembling critical risk report..."
                    ].map((step, idx) => {
                      const isDone = analysisStep > idx;
                      const isActive = analysisStep === idx;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 text-[10px] font-medium transition-colors duration-300 ${
                            isDone
                              ? "text-emerald-500 dark:text-emerald-400"
                              : isActive
                              ? "text-blue-600 dark:text-blue-400 font-bold"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          <span>{step}</span>
                          {isActive && <span className="text-[8px] font-mono animate-pulse font-normal"> (active)</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sandbox Templates */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Or Try a Sandbox Template</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {sampleTemplates.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  disabled={analyzing}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-left hover:border-blue-400 dark:hover:border-blue-900/40 transition-all text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-50 cursor-pointer"
                >
                  <span className="truncate pr-2">{sample.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Uploaded History Lists */}
          {documents.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Uploaded Records ({documents.length})
              </h4>
              <div className="space-y-2 max-h-[180px] overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocument(doc);
                      setCurrentTab('summary');
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                      selectedDocument && selectedDocument.id === doc.id
                        ? "bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-l-blue-600"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate max-w-[80%]">
                      <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {doc.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteDoc(doc.id, e)}
                      className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Detailed AI Analysis Pane */}
        <div className="lg:col-span-5 space-y-6">
          {!selectedDocument ? (
            <div className="h-[480px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-3 shadow-sm">
              <div className="h-14 w-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Document Active</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                  Drag and drop your own contract file or select one of our prepackaged credit card, lease, or loan sandbox templates to inspect.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[580px]">
              {/* Tab headers */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-4">
                <div className="truncate">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{selectedDocument.name}</h3>
                  <p className="text-[10px] text-slate-400">Audited date: {selectedDocument.uploadDate}</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded">
                  {selectedDocument.confidenceScore}% Confidence
                </span>
              </div>

              {/* Tabs list */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold shrink-0 select-none scrollbar-none">
                {[
                  { id: "summary", label: "Summary" },
                  { id: "easy", label: "Simplified" },
                  { id: "fees", label: "Hidden Fees" },
                  { id: "risks", label: "Risks" },
                  { id: "terms", label: "Jargon Dictionary" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as any)}
                    className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      currentTab === tab.id
                        ? "border-b-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/10"
                        : "border-b-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content area */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {currentTab === "summary" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Executive Summary</h4>
                      <p className="text-slate-700 dark:text-slate-200 font-medium">{selectedDocument.summary}</p>
                    </div>

                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Questions to Ask</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {selectedDocument.suggestedQuestions.map((q, idx) => (
                          <li
                            key={idx}
                            onClick={() => {
                              setChatInput(q);
                            }}
                            className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-900 cursor-pointer transition-all hover:bg-slate-50/50"
                          >
                            ❓ "{q}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {currentTab === "easy" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="h-5 w-5" />
                      <h4 className="font-bold text-sm">Explain like I'm 15</h4>
                    </div>
                    <div className="p-5 rounded-xl border border-indigo-50 dark:border-indigo-900/30 bg-indigo-50/10 text-slate-700 dark:text-slate-200">
                      {selectedDocument.easyExplanation}
                    </div>
                  </div>
                )}

                {currentTab === "fees" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-red-500">
                      <DollarSign className="h-5 w-5" />
                      <h4 className="font-bold text-sm">Potential Hidden Surcharges & Fees</h4>
                    </div>

                    {selectedDocument.hiddenFees.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No hidden fees were flagged in this document.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {selectedDocument.hiddenFees.map((fee, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-red-50 dark:border-red-950/20 bg-red-50/10 flex items-start space-x-3">
                            <span className="font-bold text-red-500 mt-0.5">•</span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{fee}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentTab === "risks" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-amber-500">
                      <AlertTriangle className="h-5 w-5" />
                      <h4 className="font-bold text-sm">Critical Contractual Risks</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {selectedDocument.risks.map((risk, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-amber-50 dark:border-amber-950/20 bg-amber-50/10 flex items-start space-x-3">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-normal">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentTab === "terms" && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Jargon Simplified</h4>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedDocument.terms.map((t, idx) => (
                        <div key={idx} className="py-3 space-y-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{t.term}</span>
                          <span className="text-xs text-slate-400 leading-normal block">{t.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Hand: AI Context-aware Chatbot */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm h-[580px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center space-x-2 shrink-0">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Context Chat Assistant
              </h3>
            </div>

            {/* Chats stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[85%] space-y-1 shadow-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700/60"
                    }`}
                  >
                    <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[8px] block text-right ${msg.sender === "user" ? "text-blue-100" : "text-slate-400"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {chatSending && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-bl-none flex items-center space-x-2.5 shadow-sm border border-slate-100 dark:border-slate-800/40">
                    <div className="flex space-x-1 items-center h-4 shrink-0">
                      <motion.div
                        className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Gemini is auditing...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat bottom input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={selectedDocument ? "Ask about APR, prepayment, late fees..." : "Ask standard financial questions..."}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatSending}
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 shrink-0 transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
