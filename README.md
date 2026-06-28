这是一份为你整合好的完整版 `README.md`，你可以直接复制并保存到项目根目录中。

---

# The Ultimate Objective Arbiter (绝对客观裁判所)

**"Stripping away AI's 'neutral' mask to ignite a battlefield of logic and bias."**

---

### 🚀 Project Overview

**The Ultimate Objective Arbiter** is a real-time debate entertainment platform. It transforms AI from a neutral assistant into a dramatic, high-stakes performer. Two AI agents with diametrically opposed worldviews engage in structured debates, while users intervene, score rounds, and influence the AI's logic in real-time.

### ✨ Key Features

* **Polarized AI Debater Agents:** Two independent AI instances with completely opposite worldviews, personalities, and rhetoric styles.
* **8-Speech Structure:** Precise debate flow (Opening → Rebuttal ① → Rebuttal ② → Closing) with strict word limits per round.
* **Hell Mode (Human Intervention):** Pause the debate at any time to take control of an AI debater and personally out-maneuver the opponent.
* **Ultimate AI Judge:** A final verdict system that analyzes the debate transcript and provides a sharp, humorous, and critical MBTI-style personality report.
* **Bilingual Support:** Full English / 中文 UI, toggleable at any time.

### 🧠 Dynamic Prompt Engineering Engine

We implement a real-time feedback loop that turns spectators into "directors" of the debate:

* **Style Reinforcement (Like/Dislike):** When users "Like" an argument, the system reinforces the current rhetorical style and persona density in the next prompt.
* **Adaptive Aggression (Scoring):** The system calculates the performance gap between debaters in real-time. If one side falls behind, the engine dynamically injects "High-Aggression" and "Critical-Thinking" instructions into their system prompt, forcing the AI to counter-attack more fiercely to regain ground.

### 🛠 Tech Stack

* **Framework:** Next.js 16 (App Router), React 19, TypeScript
* **Styling:** Tailwind CSS v4, Framer Motion
* **AI Engine:** Vercel AI SDK, DeepSeek API
* **State Management:** React Context + useReducer
* **Data Validation:** Zod (for structured JSON output)

### 📁 Project Structure

```text
app/                 # API routes & Page routing
components/          # Core debate UI components
lib/                 # AI prompt engineering & Debate engine logic

```

### 🌐 Access Options

#### 🌐 Live Demo

You can experience the project directly in your browser:
[https://youth-code-hackathon.vercel.app/debate](https://www.google.com/search?q=https://youth-code-hackathon.vercel.app/debate)

#### 💻 Local Development

If you wish to run the project locally, follow these steps:

1. **Clone the repository:**
```bash
git clone https://github.com/Emilyyy-G/Youth_Code_Hackathon.git
cd Youth_Code_Hackathon

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure environment variables:**
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_deepseek_api_key
OPENAI_BASE_URL=https://api.deepseek.com/v1

```


4. **Launch server:**
```bash
npm run dev

```



---

### 👥 Team Members

| Name | GitHub Account |
| --- | --- |
| **Emily** | [@Emilyyy-G](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2FEmilyyy-G) |
| **Tina** | [@Tina0707](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2FTina0707) |

---

*License: MIT*以下是按照你要求的顺序重新编排的 README 内容：
