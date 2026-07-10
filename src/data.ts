/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson, AchievementBadge, DailyChallenge, Recommendation, BudgetItem } from "./types";

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: "les_1",
    category: "Budgeting",
    title: "Mastering the 50/30/20 Rule",
    shortDescription: "The simplest, most effective template to structure your paycheck.",
    estimatedTime: "5 mins",
    content: `Budgeting isn't about restricting yourself—it's about directing your cash with intention! The **50/30/20 Rule** is a gold standard for financial organization. Here is how it splits your post-tax monthly income:

1. **50% for Needs**: These are non-negotiable expenses. Rent, mortgage, utility bills, groceries, insurance, and minimum debt payments. If you can't survive without it, it goes here.
2. **30% for Wants**: These are lifestyle expenses. Dining out, cinema tickets, streaming subscriptions, vacation funds, and designer clothes.
3. **20% for Savings**: This goes directly into your high-yield savings account (HYSA), retirement portfolio (401k or IRA), or extra debt payments (above the minimums).

By sticking to this template, you ensure your future is secure (Savings) while still enjoying the present (Wants) and covering essentials (Needs).`,
    completed: false,
    quiz: [
      {
        question: "Under the 50/30/20 budgeting rule, which category does dining out at a restaurant belong to?",
        options: ["Needs", "Wants", "Savings", "Emergency Fund"],
        answerIndex: 1,
        explanation: "Dining out is a lifestyle choice (Wants), whereas buying basic groceries at a store belongs in Needs."
      },
      {
        question: "What percentage of income should be dedicated directly to Savings or extra debt paydown?",
        options: ["10%", "20%", "30%", "50%"],
        answerIndex: 1,
        explanation: "The rule recommends dedicating 20% of your income towards your future savings, emergency fund, or investment goals."
      },
      {
        question: "Which of the following is considered a 'Need'?",
        options: ["Gym membership", "Rent / Housing payment", "Streaming subscription", "Coffee shop lattes"],
        answerIndex: 1,
        explanation: "Rent or housing is a non-negotiable necessity to keep a roof over your head, making it a clear 'Need'."
      }
    ]
  },
  {
    id: "les_2",
    category: "Credit Score",
    title: "How Credit Scores Work",
    shortDescription: "Demystifying FICO scores and how to repair or boost them.",
    estimatedTime: "7 mins",
    content: `Your **credit score** is a three-digit number (ranging from 300 to 850) that serves as your financial GPA. Lenders use it to decide if they should trust you with loans and what interest rates to charge you. A high score saves you hundreds of thousands of dollars in interest over your lifetime!

Here is how FICO calculates your credit score:
- **35% Payment History**: Do you pay your bills on time? Even one payment delayed by 30+ days can hurt your score significantly.
- **30% Credit Utilization**: How much of your available credit card limit are you using? Standard rule: keep this ratio below 30% (below 10% is optimal).
- **15% Length of Credit History**: How long have your accounts been open? Older credit history indicates stability. Avoid closing your oldest credit cards!
- **10% New Credit**: Have you applied for multiple cards or loans recently? Too many hard inquiries in a short period look desperate.
- **10% Credit Mix**: Do you have a healthy mix of revolving credit (cards) and installment credit (car loan, student loan)?

To boost your score: never miss a payment, keep balances low, and avoid applying for credit unless truly needed.`,
    completed: false,
    quiz: [
      {
        question: "Which factor has the highest impact (35%) on your credit score?",
        options: ["Credit Utilization Ratio", "Length of Credit History", "Payment History (On-Time Payments)", "The number of credit cards you own"],
        answerIndex: 2,
        explanation: "Payment History is the single biggest factor (35%) in your score. Missing payments shows lenders you are high-risk."
      },
      {
        question: "What is the recommended maximum percentage of credit limit you should use to maintain a healthy score?",
        options: ["100%", "75%", "50%", "30%"],
        answerIndex: 3,
        explanation: "Keeping your credit utilization ratio below 30% is standard practice to avoid dragging down your credit score."
      },
      {
        question: "Should you close your oldest credit card once you pay off its balance?",
        options: ["Yes, to avoid temptation.", "No, because closing it shortens your credit history and lowers your credit score.", "Yes, it boosts your credit mix.", "Only if it has no cash back benefits."],
        answerIndex: 1,
        explanation: "Closing your oldest account shortens your credit history and reduces your overall available credit limit, both of which lower your score."
      }
    ]
  },
  {
    id: "les_3",
    category: "Taxes",
    title: "Understanding Progressive Tax Brackets",
    shortDescription: "Why moving to a higher tax bracket doesn't reduce your overall income.",
    estimatedTime: "6 mins",
    content: `A common financial myth is: 'I shouldn't take a raise because it will push me into a higher tax bracket, and I'll make less money overall!' This is completely false because of how **progressive tax brackets** work.

Under a progressive tax system, your income is taxed in 'segments' or 'buckets', not as one lump sum. 

*Example:* Imagine there are two tax brackets:
- 10% tax on income up to $50,000
- 20% tax on income above $50,000

If you make $55,000, you do NOT pay 20% on the full $55,000. Instead:
- Your first $50,000 is taxed at 10% ($5,000)
- Only the remaining $5,000 is taxed at the higher 20% rate ($1,000)
- Your total tax is $6,000. Taking that raise *always* leaves you with more take-home cash!

Understanding standard deductions, tax credits, and pre-tax retirement accounts (like traditional 401k) can further reduce your taxable income, saving you money during tax season.`,
    completed: false,
    quiz: [
      {
        question: "How does a progressive tax system calculate your overall tax obligation?",
        options: [
          "Your highest tax bracket rate is applied to your entire income.",
          "Everyone pays the exact same dollar amount.",
          "Your income is taxed in chunks or brackets, with only the income inside each bracket taxed at that specific rate.",
          "Taxes are calculated purely on what you spend, not what you earn."
        ],
        answerIndex: 2,
        explanation: "Progressive systems tax income in segments. Moving to a higher bracket only taxes the additional income above that bracket's threshold."
      },
      {
        question: "If a raise pushes you into a higher tax bracket, will your total net take-home income decrease?",
        options: [
          "Yes, because of the higher tax rate.",
          "No, because only the money inside the higher bracket is taxed at the higher rate.",
          "Yes, unless you write off business expenses.",
          "Only if you are married filing jointly."
        ],
        answerIndex: 1,
        explanation: "No, a raise will never result in less money overall. Only the incremental portion of the raise is taxed at the higher rate."
      }
    ]
  },
  {
    id: "les_4",
    category: "Investing",
    title: "The Power of Compound Interest",
    shortDescription: "How small, consistent investments turn into massive wealth over time.",
    estimatedTime: "8 mins",
    content: `Albert Einstein famously called **Compound Interest** the 'eighth wonder of the world.' It is the mechanism that turns ordinary savers into millionaires.

Compound interest is simply: **earning interest on your interest**.

*The Math:* Imagine you invest $1,000 at a 10% annual return. 
- Year 1: You earn $100. Your balance is $1,100.
- Year 2: You don't just earn interest on your original $1,000. You earn 10% on your new balance of $1,100, which is $110! Your balance is now $1,210.
- After 40 years of compounding, that single $1,000 grows to **$45,259** without you adding another penny!

If you add just $100 every month to that pot, after 40 years you would have **$584,222**! 

The absolute key to investing is **Time**. The earlier you start, the more cycles of compounding your money experiences. This is why investing $100/month in your 20s is far more powerful than investing $300/month starting in your 40s.`,
    completed: false,
    quiz: [
      {
        question: "What is compound interest?",
        options: [
          "Interest that you pay back to the credit card company.",
          "Interest earned on both the original principal amount and the accumulated interest from previous periods.",
          "An extra fee charged by stock brokers.",
          "Interest that decreases over time as your investments grow."
        ],
        answerIndex: 1,
        explanation: "Compound interest is earning interest on interest, causing your money to grow exponentially over time."
      },
      {
        question: "Which factor is the absolute most powerful driver of compound interest growth?",
        options: ["The specific stocks you pick", "The total amount of cash you start with", "Time (starting early)", "Using a premium banking app"],
        answerIndex: 2,
        explanation: "Time is the critical factor. The longer your money compounds, the faster it grows. Starting early is far more important than starting with a large sum."
      }
    ]
  },
  {
    id: "les_5",
    category: "Loans",
    title: "Good Debt vs. Bad Debt",
    shortDescription: "Understanding when borrowing leverages your future and when it drains it.",
    estimatedTime: "5 mins",
    content: `Not all debt is created equal. Understanding the difference between good debt and bad debt is vital to financial freedom.

- **Good Debt**: This is borrowing money to buy assets that grow in value or generate future income. Examples include a reasonable **mortgage** (home values usually rise, and you save on rent), **student loans** (which increase your lifetime earning potential), or **business loans** to fund operations. These debts usually have lower interest rates.
- **Bad Debt**: This is borrowing to purchase depreciating assets or consumable items that don't make you money. The ultimate bad debt is **high-interest credit card debt** spent on luxury vacations, designer clothes, or expensive electronics. Carrying a balance at a 20%+ interest rate is a massive wealth drain.

A simple rule: if borrowing doesn't increase your future income or asset value, avoid it at all costs!`,
    completed: false,
    quiz: [
      {
        question: "Which of the following is generally classified as 'Good Debt'?",
        options: ["Credit card balance for a holiday", "A low-interest loan for a college education", "Payday loan for rent", "Auto loan for a luxury sportscar"],
        answerIndex: 1,
        explanation: "Education is an investment that increases your future career earning potential, making it a form of good debt when borrowed responsibly."
      },
      {
        question: "Why is high-interest credit card debt considered 'Bad Debt'?",
        options: [
          "It typically has very low interest rates.",
          "It is used to buy assets that increase in value.",
          "It charges extremely high interest rates (often 20%+) to buy consumable items that lose value instantly.",
          "It is backed by the government."
        ],
        answerIndex: 2,
        explanation: "Credit card debt carries high interest rates and is used for non-essential purchases that offer no future financial return."
      }
    ]
  },
  {
    id: "les_6",
    category: "Insurance",
    title: "The Pillars of Insurance",
    shortDescription: "How to protect your wealth from catastrophic life events.",
    estimatedTime: "5 mins",
    content: `You can build the perfect budget and stock portfolio, but a single major accident, health emergency, or fire can wipe out your entire net worth in a day if you aren't insured. **Insurance** is the ultimate shield for your wealth.

There are 4 essential insurance coverages you should know:
1. **Health Insurance**: Covers medical bills. Even a short hospital stay can cost tens of thousands.
2. **Auto Insurance**: Required by law in most places. It protects you from massive liabilities if you damage someone else's car or cause injuries.
3. **Homeowners/Renters Insurance**: Renters insurance is extremely cheap (typically $15/month) but covers your furniture, computers, and clothes if your apartment floods or burns down.
4. **Term Life Insurance**: Essential if you have dependents (kids or spouses who rely on your salary). It provides them with a safety net if you pass away. Avoid 'Whole Life' insurance as it has high fees—stick to simple, cheap 'Term Life'.`,
    completed: false,
    quiz: [
      {
        question: "Is Renters Insurance usually expensive?",
        options: ["Yes, it costs hundreds of dollars a month.", "No, it is very cheap (typically $10-$20/month) and protects your personal belongings.", "It is free by federal law.", "It is only required for households with pets."],
        answerIndex: 1,
        explanation: "Renters insurance is incredibly cheap but protects your valuable personal assets in case of fire, flood, or theft."
      }
    ]
  },
  {
    id: "les_7",
    category: "Emergency Fund",
    title: "Building Your Emergency Buffer",
    shortDescription: "Why having liquid cash is your absolute first line of defense.",
    estimatedTime: "5 mins",
    content: `Before you buy a single share of stock or pay off low-interest debt, you need an **Emergency Fund**. An emergency fund is liquid, easy-to-access cash parked in a secure savings account.

*Why do you need it?* Life happens. Cars break down, water pipes burst, or you might lose your job. Without emergency savings, you will be forced to put these costs on credit cards or tap into your retirement investments (which incurs heavy tax penalties).

*How much do you need?*
- **3 to 6 months of basic living expenses**: If your rent, food, and utilities cost $2,000 a month, your target is $6,000 to $12,000.
- Keep this money in a **High-Yield Savings Account (HYSA)**. It remains safe, fully accessible, and earns 4%+ interest compared to standard banks which pay 0.01%.

Treat this fund as an absolute security blanket, not a vacation or shopping budget!`,
    completed: false,
    quiz: [
      {
        question: "How many months of basic living expenses should your Emergency Fund ideally cover?",
        options: ["1 week", "1 to 2 months", "3 to 6 months", "2 years"],
        answerIndex: 2,
        explanation: "Financial planners recommend saving 3 to 6 months of expenses to survive unexpected job losses or medical crises."
      },
      {
        question: "Where is the best place to keep your Emergency Fund?",
        options: [
          "Under your mattress",
          "In the stock market",
          "In a High-Yield Savings Account (HYSA)",
          "In high-end physical gold coins"
        ],
        answerIndex: 2,
        explanation: "An HYSA keeps your money 100% safe and fully liquid for emergencies while earning competitive interest rates."
      }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: "ach_1",
    title: "First Analysis",
    description: "Successfully upload and analyze your first financial document.",
    icon: "FileSearch",
    unlocked: false,
    xpValue: 150
  },
  {
    id: "ach_2",
    title: "FinTwin Scholar",
    description: "Complete your first learning module and pass the quiz.",
    icon: "GraduationCap",
    unlocked: false,
    xpValue: 100
  },
  {
    id: "ach_3",
    title: "Budget Master",
    description: "Analyze your spending and receive tailored budget suggestions.",
    icon: "PiggyBank",
    unlocked: false,
    xpValue: 120
  },
  {
    id: "ach_4",
    title: "Knowledge Guru",
    description: "Successfully complete all 7 financial literacy courses.",
    icon: "BookOpen",
    unlocked: false,
    xpValue: 300
  },
  {
    id: "ach_5",
    title: "Challenge Buster",
    description: "Complete a daily financial challenge to establish healthy habits.",
    icon: "Trophy",
    unlocked: false,
    xpValue: 80
  },
  {
    id: "ach_6",
    title: "Streak Starter",
    description: "Reach a 3-day learning streak in FinTwin AI.",
    icon: "Flame",
    unlocked: false,
    xpValue: 100
  }
];

export const INITIAL_CHALLENGES: DailyChallenge[] = [
  {
    id: "chal_1",
    title: "Subscription Audit",
    description: "Log into your banking app, locate all recurring subscriptions, and flag one you haven't used in 30 days to cancel.",
    xpReward: 50,
    completed: false
  },
  {
    id: "chal_2",
    title: "The No-Spend Day",
    description: "Challenge yourself to spend $0 today outside of mandatory bills or transportation. Prepare coffee and food at home!",
    xpReward: 60,
    completed: false
  },
  {
    id: "chal_3",
    title: "Auto-Save Kickstart",
    description: "Set up an automatic recurring transfer of just $5 a week from your checking to your savings account.",
    xpReward: 40,
    completed: false
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec_1",
    type: "learning",
    text: "Understand progressive tax brackets so you are ready to request that raise.",
    actionLabel: "Start Tax Lesson"
  },
  {
    id: "rec_2",
    type: "saving",
    text: "Your dining out spend is spiking. Consider packing lunch two days a week to save $120.",
    actionLabel: "Review Budget Coach"
  },
  {
    id: "rec_3",
    type: "document",
    text: "Review standard terms in Credit Agreements to detect cash advance traps.",
    actionLabel: "Try Doc Analyzer"
  }
];

export const INITIAL_BUDGET: BudgetItem[] = [
  { category: "Housing", amount: 1200, budget: 1200, color: "#3B82F6" }, // Royal Blue
  { category: "Food & Dining", amount: 480, budget: 400, color: "#10B981" }, // Emerald Green
  { category: "Utilities", amount: 220, budget: 250, color: "#F59E0B" }, // Amber
  { category: "Transportation", amount: 150, budget: 180, color: "#8B5CF6" }, // Purple
  { category: "Entertainment", amount: 180, budget: 100, color: "#EF4444" }, // Red
  { category: "Miscellaneous", amount: 70, budget: 100, color: "#64748B" } // Slate Gray
];

export const FAQS = [
  {
    question: "How does FinTwin AI analyze my documents?",
    answer: "FinTwin AI leverages cutting-edge Google Gemini AI models to securely parse text and charts inside your uploaded PDFs and images. It looks for complex legal clauses, extracts hidden fees, defines complicated terminology, and translates jargon into conversational plain English."
  },
  {
    question: "Is my personal financial data secure?",
    answer: "Absolutely. Security is our absolute foundation. Your files are processed in real-time server-side and never stored permanently or shared with third parties. No persistent banking credentials are required—you are in total control."
  },
  {
    question: "Do I need a finance background to use this?",
    answer: "No, FinTwin AI is designed explicitly for absolute beginners! We explain complex numbers, interest rates, and loan clauses using simple metaphors, and even include a dedicated section that explains everything like you're 15 years old."
  },
  {
    question: "Can I use FinTwin AI for free?",
    answer: "Yes! All basic features—including our custom budget coach, document analysis simulations, and our comprehensive learning center—are 100% free. If your workspace has a connected Gemini key, you get real AI-powered document audits as well."
  }
];

export const LOGOS = [
  "Ramp", "Stripe", "Mercury", "Notion", "Linear", "Apple"
];

export const TESTIMONIALS = [
  {
    text: "FinTwin AI saved me $250 on a personal loan processing fee that was buried in page 14 of the contract. The 'Explain Like I'm 15' feature is incredible!",
    name: "Alex Rivera",
    role: "Freelance Designer"
  },
  {
    text: "I finally understand how tax brackets work! The bite-sized lessons, quizzes, and streak challenges make learning about money addictive.",
    name: "Maya Patel",
    role: "Graduate Student"
  },
  {
    text: "The Budget Coach helped me locate three overlapping streaming subscriptions I totally forgot about. My credit score is already up 35 points!",
    name: "Marcus Vance",
    role: "Product Manager"
  }
];
