# AI Debate - The Arbitrator

An AI-powered interactive debate platform. Watch two AI debaters clash over hot topics, or jump into human-vs-AI mode and challenge the debaters yourself!

🔗 **Live Demo**: [https://youth-code-hackathon.vercel.app](https://youth-code-hackathon.vercel.app)

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

```bash
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
