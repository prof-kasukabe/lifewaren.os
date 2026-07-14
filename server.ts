import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/reflect", async (req, res) => {
    try {
      const { logs } = req.body;
      
      if (!logs || !Array.isArray(logs) || logs.length === 0) {
        return res.status(400).json({ error: "Logs are required for reflection." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const logTexts = logs.map(l => `[${l.source.toUpperCase()}] ${l.content}`).join("\\n");
      const prompt = `Analyze the following daily learning/activity logs for a developer who is also working as a courier and a thesis joki (freelance). Provide a short, highly motivating, single-paragraph "Growth Mindset" reflection (max 3 sentences) that connects their daily hustle to their long-term goal of financial freedom and career growth. Keep it bold, direct, and slightly philosophical.\\n\\nLogs:\\n${logTexts}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ reflection: response.text });
    } catch (error) {
      console.error("AI Reflection Error:", error);
      res.status(500).json({ error: "Failed to generate reflection." });
    }
  });

  app.post("/api/decision-insight", async (req, res) => {
    try {
      const { quadrant, effort, reward, habits, logs } = req.body;

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const habitTexts = habits.map(h => `- ${h.name} (${h.completed ? 'Done' : 'Pending'})`).join("\\n");
      const logTexts = logs.map(l => `- [${l.source.toUpperCase()}] ${l.content}`).join("\\n");

      const prompt = `You are a strategic AI advisor for a developer who is juggling their main career, a courier side-hustle, and freelance thesis joki work. 
They are evaluating a new potential task or project.
They rated the Effort as ${effort}/10 and Reward as ${reward}/10, placing this decision in the "${quadrant}" quadrant of their decision matrix.

Current Habits Status:
${habitTexts}

Recent Logs/Activities:
${logTexts}

Based on their current workload, habits, and this specific decision quadrant, provide a single, highly actionable piece of advice (max 2 sentences) on how they should approach this specific decision. Be sharp, pragmatic, and directly reference their current context if relevant. Keep the tone professional but slightly edgy.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ insight: response.text });
    } catch (error) {
      console.error("Decision Insight Error:", error);
      res.status(500).json({ error: "Failed to generate insight." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
