<<<<<<< HEAD
# The Ultimate Objective Arbiter
**Tagline: Stripping away AI's "neutral" mask to ignite a battlefield of logic and bias.**

## 🚀 Project Overview
The Ultimate Objective Arbiter is a real-time interactive debate entertainment web application built for hackathons. Unlike generic neutral AI chatbots, this project spawns two polarized AI debaters with conflicting extreme personas to launch intense, logical verbal confrontations.

With a human-in-the-loop interactive system and real-time audience feedback mechanism, we convert rigid, plain AI logical dialogue into dramatic, watchable competitive performances. A dedicated sarcastic judge AI delivers a comprehensive, witty final ruling after rounds of debate, completing a full closed-loop debate experience for both participants and spectators.
=======
# AI Debate - The Arbitrator

An AI-powered interactive debate platform. Watch two AI debaters clash over hot topics, or jump into human-vs-AI mode and challenge the debaters yourself!

## Features

- **AI vs AI Debate** — Two AI debaters with opposing stances argue on a chosen topic
- **8-Speech Structure** — Opening Statement → Rebuttal ① → Rebuttal ② → Closing Statement, each with per-round word limits
- **Human vs AI** — Pause the debate, take over either AI, and argue against the opponent yourself
- **Round Scoring** — Rate each debater after every round (-10 to +10 slider)
- **AI Judge Report** — Receive an MBTI-style personality analysis report after the debate
- **English / 中文** — Full bilingual UI, toggle instantly
- **Topic Categories** — Tech / Society / Education / Ethics / Environment / Lifestyle
- **Pause Intervention** — Pause the debate and type your thoughts; the AI adjusts its strategy based on your input
- **Like / Dislike** — Vote on each individual argument

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/openai`), DeepSeek API
- **State**: React Context + useReducer

## Local Development

### Prerequisites

Node.js v18 or higher

### Setup
>>>>>>> 6606123a9e05691a7c8c398e9d9522e035c1ce57

## ✨ Core Key Features
1. **Polarized Extreme AI Debater Agents**
Two independent AI instances with completely opposite worldview, personality, stance and rhetoric styles. Each agent sticks firmly to its preset stance without neutral compromise throughout the debate.

2. **Real-Time Audience Feedback Dynamic Prompt Loop**
Spectators can like/dislike each argument instantly. User feedback data is injected into the agent’s system prompt in real time, dynamically adjusting the AI’s aggression level, tone sharpness, argument structure and logical angle without restarting the conversation.

3. **Hell Mode: Human Intervention Takeover**
Users can pause the ongoing debate at any time and seize full control of either AI debater. Step into the debate arena manually to craft counterarguments and outmaneuver the opposing AI for a fully immersive competitive experience.

4. **Ultimate Sarcastic AI Judge & Final Verdict System**
A dedicated judge AI analyzes the full debate transcript, scoring logic strength, persuasion and rhetoric performance of both sides, then outputs a sharp, humorous, sarcastic final judgment with clear win/loss conclusion for the whole match.

5. **Live Visual Battle Dashboard**
Built-in dynamic UI visualization modules: real-time tension meter animation, argument score sliders, stance bias indicators and round timeline to visualize the intensity of the debate visually.

## 🛠 Full Tech Stack
- **Frontend Framework**: Next.js 14 (App Router)
- **UI & Visual Components**: Tailwind CSS + Framer Motion (dynamic battle animations, real-time feedback UI)
- **Backend Runtime**: Node.js + Next.js API Routes (full-stack monorepo architecture)
- **AI LLM Engine**: DeepSeek API 
- **Data Validation & Schema Constraint**: Zod (enforce structured JSON output from LLMs for judge scoring)
- **State Management**: Client-side React state + Server-side persistent debate context

## 💻 Local Development Setup Guide
### Prerequisites
Node.js v18 or higher installed on your local machine

1. Clone the repository
```bash
<<<<<<< HEAD
git clone https://github.com/Emilyyy-G/Youth_Code_Hackathon.git
cd ultimate-objective-arbiter
```

2. Install all project dependencies
```bash
npm install
```

3. Configure environment variables
- Create a `.env` file in the project root directory
- Ensure `.env` is added to `.gitignore` to avoid secret leakage
- Fill your LLM API credentials inside `.env`:
```env
# LLM Service Config
LLM_API_KEY=your_llm_provider_api_key_here
LLM_BASE_URL=your_model_api_endpoint_url
```

4. Launch local development server
```bash
npm run dev
```

5. Preview the application
Open your browser and visit `http://localhost:3000` to start a new AI debate session instantly.

## 🏆 Hackathon Competitive Advantages (Why This Project Stands Out)
1. **High-Impact Live Demo Effect**
This is not a plain functional tool — it’s a highly performative interactive show. The dramatic AI confrontation, animated battle UI and human takeover mechanic deliver eye-catching live demo effects to capture judges’ attention immediately.

2. **Deep Hidden Technical Complexity with Friendly UX**
Advanced underlying implementations including multi-agent differentiated prompt engineering, real-time prompt injection pipeline, LLM structured output constraint via Zod and cross-agent context synchronization are fully abstracted behind an intuitive consumer-grade interface. The stack demonstrates solid full-stack + LLM integration capabilities.

3. **Strong User Participation & Interactive Loop**
Breaking the passive AI viewing experience. The audience feedback system and human takeover Hell Mode turn every visitor into an active participant, forming a complete, engaging interaction cycle that judges value highly.

4. **Unique Creative Positioning**
Most hackathon AI projects focus on productivity or assistance tools. This product innovates on entertainment + competitive AI conflict, filling a blank niche of "AI debate theater".

## ⚖️ Project Long-Term Vision
We aim to build a brand-new form of digital entertainment called **Conflict Theater**. Our core mission is to frame logical reasoning and argumentation as immersive, addictive spectator content, moving beyond conventional utilitarian AI assistant use cases to explore the performative, competitive side of large language models.

## 📌 Hackathon Submission Optimization Tips
1. **Add Screenshot Gallery**
Append a dedicated Screenshots section at the top of README with UI previews: main debate arena, audience feedback panel, Hell Mode takeover interface and judge final verdict page. Visual assets are the primary factor to attract judges to review your repository.

2. **Embed Demo Video**
Record a 60-second highlight demo video focusing on the human intervention Hell Mode and real-time feedback dynamics, embed it at the very top of the document. Short demo videos are the most efficient way to showcase core gameplay during judging.

3. **Customize Placeholder Info**
Replace all bracketed placeholder values (repository URL, GitHub username, API service info) with your actual project details before final submission.

4. (Optional) Add Vercel One-Click Deployment Badge
Add deployment badge and one-click deploy instructions for online live demo access, allowing judges to test your project without local setup.

---

## 🚀 Optional Vercel Deployment Guide
### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/[YOUR_USERNAME]/ultimate-objective-arbiter)

### Manual Deployment Steps
1. Push full source code to your GitHub repository
2. Import the repository inside Vercel dashboard
3. Add all environment variables (`LLM_API_KEY`, `LLM_BASE_URL`) in Vercel Environment Config panel
4. Use default build command: `npm run build`
5. Trigger deployment and access your live production link after build completion
```

=======
# 1. Clone the repository
git clone https://github.com/Emilyyy-G/Youth_Code_Hackathon.git
cd Youth_Code_Hackathon

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create .env.local in the project root:
OPENAI_API_KEY=your_deepseek_api_key
OPENAI_BASE_URL=https://api.deepseek.com/v1

# 4. Start the development server
npm run dev
```

Open `http://localhost:3000` in your browser.

## Debate Flow

```
Home → Pick a Topic Category → Pick a Topic
   ↓
Round 1: Pro Opening (80-120 words) → Con Opening (80-120 words) → Score
Round 2: Pro Rebuttal ① (50-80 words) → Con Rebuttal ① (50-80 words) → Score
Round 3: Pro Rebuttal ② (50-80 words) → Con Rebuttal ② (50-80 words) → Score
Round 4: Pro Closing (30-60 words) → Con Closing (30-60 words) → Score
   ↓
AI Judge Report (MBTI-style analysis)
```

## Project Structure

```
app/
├── api/
│   ├── chat/route.ts          # AI debate streaming endpoint
│   ├── judge/route.ts         # AI judge report generation
│   └── topics/route.ts        # Topic generation
├── debate/page.tsx            # Debate page
└── page.tsx                   # Landing page

components/
├── debate/                    # Core debate components
│   ├── AAvatar.tsx            # AI avatar + take-over button
│   ├── Dashboard.tsx          # Right sidebar control panel
│   ├── DebateHeader.tsx       # Top header bar
│   ├── DebateLayout.tsx       # Main debate orchestrator
│   ├── DebaterColumn.tsx      # Single debater chat column
│   ├── JudgingPhase.tsx       # Judge report page
│   ├── MessageActions.tsx     # Like/dislike buttons
│   └── SpeechBubble.tsx       # Message bubble with bold rendering
├── landing/                   # Landing page components
├── shared/                    # Shared components
└── topic/                     # Topic selection

lib/
├── debate/
│   ├── constants.ts           # Constants and topic data
│   ├── engine.ts              # Debate round scheduling
│   ├── i18n.ts                # Internationalization
│   └── prompt-builder.ts      # AI system prompt factory
└── store/
    └── debate-context.tsx     # Global state management
```

## Branches

- `frontend/ui` — Frontend UI components and pages
- `backend/ai-logic` — API routes and AI logic

## License

MIT
>>>>>>> 6606123a9e05691a7c8c398e9d9522e035c1ce57
