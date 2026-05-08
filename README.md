# Paper Skimmer

> Upload a research paper PDF and get an instant AI-powered breakdown in seconds.

Paper Skimmer uses **Llama 3.3 70B via Groq** to analyze academic papers and extract:

- **3-point summary** — the core findings at a glance
- **Methods & datasets** — how the research was conducted
- **Key equations & metrics** — the math and benchmarks that matter

Built with Next.js, TypeScript, and Tailwind CSS. Features a drag-and-drop upload interface with a dark glassmorphism design.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A free [Groq API key](https://console.groq.com) (no credit card required)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/greeshv03-ops/paper-skimmer.git
   cd paper-skimmer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**

   Create a `.env.local` file in the root directory:
   ```
   GROQ_API_KEY=your-api-key-here
   ```
   Get a free key at [console.groq.com](https://console.groq.com) → API Keys → Create Key.

4. **Start the dev server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Next.js 16, React 19, Tailwind CSS  |
| AI Model | Llama 3.3 70B (via Groq)            |
| PDF      | pdf-parse v2                        |
| Language | TypeScript                          |

---

## Contributors

- [@greeshv03-ops](https://github.com/greeshv03-ops)
- [@SamriddhiS2](https://github.com/SamriddhiS2)
