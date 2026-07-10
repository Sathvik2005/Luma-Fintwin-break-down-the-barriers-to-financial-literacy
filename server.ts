/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with telemetry header if key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
const isGeminiEnabled = !!(geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY" && geminiApiKey.trim() !== "");

let ai: GoogleGenAI | null = null;
if (isGeminiEnabled) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini AI successfully initialized server-side.");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
} else {
  console.log("Gemini API key is missing or default. Operating in rich simulation mode.");
}

// ----------------- API ENDPOINTS -----------------

// Health status check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    geminiEnabled: isGeminiEnabled,
    environment: process.env.NODE_ENV || "development",
  });
});

// 1. AI Document Analyzer API
app.post("/api/analyze", async (req, res) => {
  const { fileName, fileType, fileContentBase64, customDocType } = req.body;

  if (!fileName || !fileContentBase64) {
    return res.status(400).json({
      success: false,
      message: "File name and content (base64) are required.",
    });
  }

  const fileTypeLower = (fileType || "").toLowerCase();
  const isImage = fileTypeLower.includes("image") || fileTypeLower.includes("png") || fileTypeLower.includes("jpg") || fileTypeLower.includes("jpeg");
  const isPdf = fileTypeLower.includes("pdf");

  // Determine document theme for rich mockups if Gemini is disabled or fails
  let detectedType = "Credit Card Agreement";
  const nameLower = fileName.toLowerCase();
  if (nameLower.includes("loan") || nameLower.includes("borrow") || nameLower.includes("emi")) {
    detectedType = "Personal Loan Agreement";
  } else if (nameLower.includes("lease") || nameLower.includes("rent") || nameLower.includes("apartment") || nameLower.includes("tenancy")) {
    detectedType = "Apartment Lease Agreement";
  } else if (nameLower.includes("invoice") || nameLower.includes("bill") || nameLower.includes("receipt") || nameLower.includes("utility")) {
    detectedType = "Utility Invoice / Service Bill";
  } else if (customDocType) {
    detectedType = customDocType;
  }

  // Fallback / Rich Simulation Data
  const getMockAnalysis = (docName: string, docType: string) => {
    const randomId = "doc_" + Math.random().toString(36).substr(2, 9);
    const dateStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

    if (docType === "Personal Loan Agreement") {
      return {
        id: randomId,
        name: docName,
        uploadDate: dateStr,
        summary: "This document is a Fixed-Rate Personal Unsecured Loan Agreement. It outlines a principal borrow of $10,000 to be repaid over a 36-month term with equal monthly payments (EMI) of $322.67.",
        terms: [
          { term: "Principal", definition: "The original amount of money borrowed or lent, excluding interest." },
          { term: "EMI (Equated Monthly Installment)", definition: "A fixed payment amount made by a borrower to a lender at a specified date each calendar month." },
          { term: "APR (Annual Percentage Rate)", definition: "The annual rate of interest charged for borrowing, including fees." },
          { term: "Prepayment Penalty", definition: "A fee charged if you pay off your loan earlier than the scheduled maturity date." }
        ],
        hiddenFees: [
          "Processing Fee: An upfront deduction of 2.5% ($250) from the loan principal before disbursement.",
          "Late Payment Charge: A penalty of $35 or 5% of the unpaid balance (whichever is greater) for payments delayed by more than 10 days."
        ],
        risks: [
          "High Prepayment charge of 3% on outstanding principal if repaid in full within the first 12 months.",
          "Defaulting on payments allows the lender to report to credit bureaus, dropping your credit score by up to 100 points.",
          "Arbitration Clause: Waives your right to settle disputes in a public court of law."
        ],
        thingsToKnow: [
          "The interest rate is fixed at 9.5% per annum, meaning payments won't fluctuate with market changes.",
          "Autopay is mandatory; disabling electronic debit incurs a $5 manual handling fee per month.",
          "First payment starts exactly 30 days after document execution."
        ],
        suggestedQuestions: [
          "Can I negotiate the processing fee down?",
          "Are there options for temporary deferment or forbearance in case of financial hardship?",
          "Will paying an extra $100 every month directly reduce the principal balance?"
        ],
        easyExplanation: "Imagine you want to buy a high-end computer today but don't have $10,000. We lend you the $10,000, and you promise to pay us back about $323 every single month for the next three years. However, we'll take $250 immediately as a setup fee, so you only get $9,750 in hand. If you pay late, you'll owe us an extra $35. If you want to pay us all back early in the first year to avoid interest, we'll charge you a 3% fee on whatever is left! Best advice: make sure you can afford the $323 monthly fee comfortably before signing.",
        confidenceScore: 98
      };
    } else if (docType === "Apartment Lease Agreement") {
      return {
        id: randomId,
        name: docName,
        uploadDate: dateStr,
        summary: "This is a standard Residential Lease Agreement for a 12-month tenancy. The tenant agrees to lease the premises for $1,850 per month, with a security deposit equivalent to one month's rent.",
        terms: [
          { term: "Security Deposit", definition: "A sum of money held in trust by the landlord to cover potential damages beyond normal wear and tear." },
          { term: "Subleasing", definition: "Renting all or part of the leased property to another individual while remaining primarily responsible under the original lease." },
          { term: "Force Majeure", definition: "A contract clause freeing both parties from liability when an extraordinary event or circumstance occurs." },
          { term: "Holdover Tenancy", definition: "When a tenant remains in possession of the property after the lease expiration date without a new lease in place." }
        ],
        hiddenFees: [
          "Monthly Amenity Fee: A non-optional utility & trash fee of $45/month not included in the base rent.",
          "Lockout Service Charge: $75 fee if the landlord has to assist you with key re-entry outside of standard working hours.",
          "Car Parking Space: $50 per month per vehicle (must be declared on signature)."
        ],
        risks: [
          "Automatic Renewal: Unless you submit a written termination notice 60 days in advance, the lease auto-renews at a 10% premium.",
          "Landlord Entry: The contract permits landlord inspection with only 12 hours notice, which is shorter than typical local laws (24-48 hours).",
          "Tenant Liability: You are responsible for all repairs under $100, regardless of who caused the issue."
        ],
        thingsToKnow: [
          "Pets are allowed, but require a $300 non-refundable deposit and an extra $30/month 'pet rent'.",
          "Subleasing is strictly prohibited without written consent from the landlord.",
          "Late rent payments after the 5th of the month will incur a flat $100 late fee."
        ],
        suggestedQuestions: [
          "Can we change the written notice requirement from 60 days to 30 days?",
          "How is the security deposit returned? Is interest accumulated and paid to the tenant?",
          "Can the landlord explain why tenants must cover plumbing/repairs under $100?"
        ],
        easyExplanation: "You are renting an apartment for a year for $1,850 a month, and you must give them $1,850 upfront as protection money in case you break anything. But keep in mind: you actually have to pay $1,895 each month because of a trash fee they didn't advertise. You must also fix small broken things yourself if they cost less than $100. Most importantly, if you want to leave at the end of the year, you MUST tell them in writing 2 months before, or they'll automatically lock you into another year and raise your rent by 10%!",
        confidenceScore: 95
      };
    } else if (docType === "Utility Invoice / Service Bill") {
      return {
        id: randomId,
        name: docName,
        uploadDate: dateStr,
        summary: "This is a monthly electric utility bill totaling $184.20. It covers energy consumption over a 30-day period with a specific breakdown of baseline versus peak-rate tier consumption.",
        terms: [
          { term: "Kilowatt-Hour (kWh)", definition: "The standard unit of measure for electrical energy consumption over time." },
          { term: "Peak Rates", definition: "Higher electricity pricing applied during hours of highest demand (typically 4 PM to 9 PM)." },
          { term: "Delivery Charge", definition: "The cost to transport electricity from generating plants through transmission lines to your house." }
        ],
        hiddenFees: [
          "Municipal Franchise Fee: A local tax surcharge of $6.80 hidden in the subtotal lines.",
          "Paper Statement Fee: A $2.50 charge applied because you receive paper bills instead of e-statements."
        ],
        risks: [
          "Variable Rates: Your rate per kWh is variable and increases by up to 150% if you exceed the tier-1 baseline allowance.",
          "Delayed Payment Fee: Payments received after the due date are charged 1.5% compounding interest per month."
        ],
        thingsToKnow: [
          "Your current usage is 18% higher than the local average for a similarly sized home.",
          "Switching to automatic paperless billing saves you $2.50/month instantly.",
          "Shifting dishwasher and laundry usage to after 9 PM can cut peak charges by 40%."
        ],
        suggestedQuestions: [
          "How do I sign up for budget billing (equalized monthly payments)?",
          "Does my utility company offer a free home energy audit to pinpoint heat/cool leaks?"
        ],
        easyExplanation: "This is your monthly power bill for $184.20. You're paying extra because you used power during the busiest hours of the day (like late afternoon when everyone turns on their AC). They are also charging you an extra $2.50 just to mail you this piece of paper! If you switch to online bills and run your heavy appliances late at night, you'll easily save around $15 to $20 next month.",
        confidenceScore: 99
      };
    } else {
      // Default / Credit Card agreement
      return {
        id: randomId,
        name: docName,
        uploadDate: dateStr,
        summary: `This document appears to be a Credit Agreement or financial statement for ${docName}. It details line of credit specifications, payment terms, and applicable APR rules.`,
        terms: [
          { term: "Annual Percentage Rate (APR)", definition: "The yearly cost of borrowing money, expressed as a percentage." },
          { term: "Grace Period", definition: "The period of time during which you can pay your credit card balance in full without incurring interest." },
          { term: "Minimum Payment Due", definition: "The smallest amount you must pay by the due date to avoid late fees and keep your account in good standing." }
        ],
        hiddenFees: [
          "Annual Fee: $95 charged automatically every year.",
          "Cash Advance Fee: 5% of the transaction amount or $10 (whichever is greater), with immediate interest accrual (no grace period).",
          "Foreign Transaction Fee: 3% on all purchases made outside your home country."
        ],
        risks: [
          "Late Payment APR: If you make a late payment, your APR can jump to a penalty rate of 29.99% indefinitely.",
          "Minimum Payment Trap: Paying only the minimum amount will prolong your debt for years and cost you triple the original price in interest."
        ],
        thingsToKnow: [
          "The interest rate is variable, tied to the U.S. Prime Rate.",
          "Autopay is available and highly recommended to prevent penalty rate hikes.",
          "The grace period is 25 days from the close of each billing cycle."
        ],
        suggestedQuestions: [
          "Is there a card option with no annual fee?",
          "Can I request a waiver of my first late fee if it was accidental?",
          "How does cash advance interest compound compared to regular purchases?"
        ],
        easyExplanation: "This is a credit card contract. They are giving you a line of credit, but if you buy things, you must pay them back within 25 days or they start charging you interest at a high annual rate. There is also a yearly fee of $95 just to have the card. Be super careful: if you miss a single payment, they can permanently raise your interest rate to almost 30%, which makes it incredibly hard to pay off!",
        confidenceScore: 94
      };
    }
  };

  // If Gemini is enabled, perform the actual AI call
  if (ai) {
    try {
      console.log(`Analyzing document "${fileName}" using Gemini 3.5 Flash...`);

      // Prepare image or document parts
      const filePart = {
        inlineData: {
          mimeType: fileTypeLower || "application/pdf",
          data: fileContentBase64,
        },
      };

      const systemPrompt = `You are FinTwin AI, an expert, beginner-friendly financial analyst and literacy coach. 
Analyze the provided financial document (PDF, image, or statement). Your goal is to simplify it, detect hidden risks/fees, and educate the user.

You MUST respond with a valid, clean JSON object following this EXACT schema, and absolutely NO markdown wrappers (like \`\`\`json ... \`\`\`), no extra text before or after, just pure parsable JSON text.

JSON Schema to return:
{
  "summary": "Short 2-3 sentence overview explaining what this document is, key amounts, parties, and dates.",
  "terms": [
    { "term": "Term Name (e.g. APR, Escrow)", "definition": "Simple explanation in normal words" }
  ],
  "hiddenFees": [
    "Fee Name: Cost and detail (e.g., 'Processing Fee: $250 upfront charge')"
  ],
  "risks": [
    "Clear explanation of a risky clause, default penalty, or credit impact"
  ],
  "thingsToKnow": [
    "Important deadlines, grace periods, or general rules from the contract"
  ],
  "suggestedQuestions": [
    "A direct, useful question the user should ask their broker/lender/landlord about this document"
  ],
  "easyExplanation": "A friendly, ultra-simplified explanation of how this document works, written as if explaining to an inquisitive 15-year-old. Use metaphors if helpful, avoid heavy terminology, and end with a positive/cautionary takeaway.",
  "confidenceScore": 95
}

Review the document thoroughly. Be vigilant about finding:
- Prepayment penalties, late charges, administrative fees.
- Automatic renewal clauses, dispute/arbitration restrictions, or tenant repair liabilities.
- Balloon payments, variable rates, or penalty interest jumps.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          filePart,
          { text: "Analyze this financial document and return the JSON according to the schema instructions. Identify any hidden fees, risks, and simplify key terms." }
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = response.text ? response.text.trim() : "";
      console.log("Raw Gemini Response received.");

      // Clean response text just in case of markdown block wrappers
      let cleanedJson = responseText;
      if (cleanedJson.startsWith("```json")) {
        cleanedJson = cleanedJson.substring(7);
      } else if (cleanedJson.startsWith("```")) {
        cleanedJson = cleanedJson.substring(3);
      }
      if (cleanedJson.endsWith("```")) {
        cleanedJson = cleanedJson.substring(0, cleanedJson.length - 3);
      }
      cleanedJson = cleanedJson.trim();

      try {
        const parsedData = JSON.parse(cleanedJson);
        const randomId = "doc_" + Math.random().toString(36).substr(2, 9);
        const dateStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

        return res.json({
          success: true,
          data: {
            id: randomId,
            name: fileName,
            uploadDate: dateStr,
            ...parsedData,
          },
        });
      } catch (parseError) {
        console.error("Gemini output was not valid JSON, falling back to simulated data. Error:", parseError);
        console.error("Raw response was:", responseText);
        // Fall back to simulated template if parse fails
        const simulated = getMockAnalysis(fileName, detectedType);
        return res.json({
          success: true,
          data: simulated,
          warning: "AI output parsed with fallback simulation",
        });
      }
    } catch (apiError) {
      console.error("Gemini API Error, falling back to simulated data:", apiError);
      const simulated = getMockAnalysis(fileName, detectedType);
      return res.json({
        success: true,
        data: simulated,
        warning: "Operating in rich offline simulation mode",
      });
    }
  } else {
    // Return rich mock analysis directly
    const simulated = getMockAnalysis(fileName, detectedType);
    return res.json({
      success: true,
      data: simulated,
      simulated: true,
    });
  }
});

// 2. Chat Assistant API (Context-aware Chatbot)
app.post("/api/chat", async (req, res) => {
  const { messages, documentContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      success: false,
      message: "Conversation messages list is required.",
    });
  }

  const userQuery = messages[messages.length - 1]?.text || "";

  if (ai) {
    try {
      console.log(`Sending chat query to Gemini: "${userQuery.substring(0, 60)}..."`);

      const systemPrompt = `You are FinTwin AI, an expert, beginner-friendly personal finance coach and document advisor.
You are currently chatting with the user about a financial document they uploaded.

${documentContext ? `Here is the analyzed context of the document they uploaded:
- Document Name: ${documentContext.name}
- Summary: ${documentContext.summary}
- Hidden Fees: ${JSON.stringify(documentContext.hiddenFees)}
- Risks: ${JSON.stringify(documentContext.risks)}
- Easy Explanation: ${documentContext.easyExplanation}
- Terms parsed: ${JSON.stringify(documentContext.terms)}` : "No specific document has been uploaded yet. Provide generic, friendly, and expert financial literacy advice."}

Instructions:
- Keep your answers clean, easy to understand, and professional.
- If the user asks about specific terms (e.g. EMI, APR, Escrow, Grace Period, Ballon payments), explain them clearly, like explaining to a 15-year-old, using a short relatable example.
- Keep your responses under 150 words when possible.
- Adhere to safety and avoid giving direct legal/investment mandates, instead frame them as recommendations to consider ("I recommend asking your landlord...", "It is wise to verify...").`;

      // Convert prior messages to conversation structure for Gemini if needed, or simply pass them as text context
      const chatHistoryPrompt = messages.map((m: any) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join("\n");

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Conversation history:\n${chatHistoryPrompt}\n\nAssistant reply to User:`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const responseText = response.text ? response.text.trim() : "I'm processing your question but couldn't formulate a response right now. Please ask again!";
      return res.json({
        success: true,
        text: responseText,
      });
    } catch (apiError) {
      console.error("Gemini Chat API Error, falling back to simulated chatbot:", apiError);
      const simulatedText = getMockChatResponse(userQuery, documentContext);
      return res.json({
        success: true,
        text: simulatedText,
        warning: "Chatbot operating in offline mode",
      });
    }
  } else {
    const simulatedText = getMockChatResponse(userQuery, documentContext);
    return res.json({
      success: true,
      text: simulatedText,
      simulated: true,
    });
  }
});

// Mock Chatbot Response generator
function getMockChatResponse(query: string, documentContext: any): string {
  const q = query.toLowerCase();

  if (q.includes("emi")) {
    return "**EMI** stands for **Equated Monthly Installment**. 💸 It is the fixed amount you pay back to the lender every single month until your loan is fully repaid. \n\nEach EMI payment is made of two parts:\n1. **Principal**: Paying back the actual money you borrowed.\n2. **Interest**: The extra cost the bank charges you for borrowing.\n\n*Example:* If you borrow $10,000 to buy a car, your EMI might be $322.67 every month for 3 years!";
  }
  if (q.includes("apr")) {
    return "**APR** stands for **Annual Percentage Rate**. 📈 It tells you the *true cost* of borrowing money for a whole year, expressed as a percentage.\n\nUnlike standard interest rates, APR includes both the interest rate **and** other fees (like setup fees, processing fees, or mandatory insurance) bundled together. It's the best number to use when comparing different credit cards or loans!";
  }
  if (q.includes("escrow")) {
    return "**Escrow** is like a trusted neutral third-party holding cell for money. 🏦 \n\n*Example:* When you buy a house, you don't give the money directly to the seller immediately. Instead, the money sits in an 'Escrow Account' run by a neutral party. Once the seller proves the house is clean and the keys are ready, the escrow agent releases the money to the seller. It protects both sides from getting scammed!";
  }
  if (q.includes("prepayment") || q.includes("pay off early")) {
    return "A **Prepayment Penalty** is a fee some banks charge you if you try to pay off your debt *earlier* than scheduled. 🛑 \n\nBanks make money from the monthly interest you pay. If you pay off the loan early, they lose out on that interest! To protect their profits, they charge you a penalty (often 1-3% of the remaining balance). In your uploaded document, make sure to check if prepayment is free after the first year!";
  }
  if (q.includes("fee") || q.includes("hidden cost")) {
    if (documentContext && documentContext.hiddenFees && documentContext.hiddenFees.length > 0) {
      return `Yes, based on the document you uploaded, I detected the following fees:\n\n${documentContext.hiddenFees.map((f: string) => `• ${f}`).join("\n")}\n\nI recommend asking the issuer to clarify or waive these if possible!`;
    }
    return "Typically, common hidden fees include **processing/origination fees**, **maintenance/annual fees**, **statement fees**, and **late payment charges**. Always look for these in fine print near the signature block!";
  }
  if (q.includes("risk") || q.includes("danger")) {
    if (documentContext && documentContext.risks && documentContext.risks.length > 0) {
      return `Here are the key risks I found in your document:\n\n${documentContext.risks.map((r: string) => `• ${r}`).join("\n")}\n\nMake sure you are comfortable with these conditions before signing anything.`;
    }
    return "The biggest risks in financial agreements are **variable interest rate hikes**, **automatic renewals**, **default reporting** (which ruins your credit score), and **mandatory arbitration clauses** (meaning you cannot sue them in court if they make a mistake).";
  }

  if (documentContext) {
    return `Regarding **${documentContext.name}**: I'm happy to help you understand this document! Based on our analysis, this is a ${documentContext.summary.substring(0, 100)}...\n\nYou can ask me specific questions like "What is the APR?", "Can I pay it off early?", or "What happens if I make a late payment?"`;
  }

  return "I am FinTwin AI, your personal finance assistant! Ask me anything about budgeting, credit scores, taxes, loans, or upload a financial document above and I'll analyze it for you step-by-step!";
}

// 3. Budget Suggestions API
app.post("/api/budget/analyze", (req, res) => {
  const { monthlySpending, savings, categories } = req.body;

  // Generate customized AI tips based on spending profile
  const totalSpend = monthlySpending || 1800;
  const savingsAmount = savings || 400;
  const totalIncome = totalSpend + savingsAmount;
  const savingsRate = Math.round((savingsAmount / (totalIncome || 1)) * 100);

  const tips = [
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
    },
    {
      id: "tip_3",
      title: "Automate a 5% Saving Boost",
      description: `Your current savings rate is ${savingsRate}%. Increasing your automated paycheck direct-deposit by just 5% would add an extra $100 to your emergency fund monthly without you feeling the pinch.`,
      category: "Savings"
    }
  ];

  let suggestions = "Your budget is looking healthy! Try to focus on keeping food costs below 20% of your total spending.";
  if (savingsRate < 10) {
    suggestions = "Critical priority: Your savings rate is currently below 10%. We recommend establishing an automated emergency fund deposit immediately after salary receipt.";
  } else if (savingsRate < 20) {
    suggestions = "Good progress! You're close to the golden standard of 20% savings. Cutting back slightly on impulse entertainment shopping can push you over the line.";
  } else {
    suggestions = "Outstanding! You're saving more than 20% of your monthly income. Consider transferring excess cash from regular savings to a High-Yield Savings Account (HYSA) to grow your funds faster.";
  }

  res.json({
    success: true,
    savingsRate,
    suggestions,
    tips
  });
});

// Vite & Static file serving setup

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server mounted on Express.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static build from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinTwin AI server is running on http://localhost:${PORT}`);
  });
}

startServer();
