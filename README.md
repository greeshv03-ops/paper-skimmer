# Paper Skimmer

Upload a research paper PDF and get an instant breakdown — a 3-point summary of the core findings, a paragraph on the methodology and datasets, and a list of key equations or metrics. Powered by Gemini 2.5 Flash.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/greeshv03-ops/paper-skimmer.git
   cd paper-skimmer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
