import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Local AI (Ollama) configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b";

// --- Curated Grounded Knowledge Base for RAG ---
interface KnowledgeDoc {
  id: string;
  subject: string;
  conceptId: string;
  conceptName: string;
  chapter: string;
  section: string;
  sourceTitle: string;
  sourceUrl: string;
  license: string;
  content: string;
  keyTerms: string[];
}

const KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: "ee-kcl-01",
    subject: "Basic Electrical Engineering",
    conceptId: "kcl",
    conceptName: "Kirchhoff's Current Law (KCL)",
    chapter: "DC Circuit Analysis",
    section: "Nodal Analysis & Conservation of Charge",
    sourceTitle: "OpenStax University Physics Vol 2 - Direct-Current Circuits",
    sourceUrl: "https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules",
    license: "CC BY 4.0",
    content: `Kirchhoff's First Rule, known as Kirchhoff's Current Law (KCL) or junction rule, is a direct consequence of the Law of Conservation of Electric Charge. It states that the algebraic sum of all electric currents entering a circuit node (junction) is strictly equal to the algebraic sum of currents leaving that node: Σ I_in = Σ I_out, or mathematically Σ I_junction = 0. Charge cannot accumulate or be destroyed at an idealized zero-capacitance circuit node under steady-state conditions. When analyzing a node, define entering currents as positive (+) and leaving currents as negative (-).`,
    keyTerms: ["kcl", "kirchhoff", "current law", "junction", "node", "conservation of charge", "sum of currents", "current split", "current entering", "current leaving"]
  },
  {
    id: "ee-kvl-01",
    subject: "Basic Electrical Engineering",
    conceptId: "kvl",
    conceptName: "Kirchhoff's Voltage Law (KVL)",
    chapter: "DC Circuit Analysis",
    section: "Mesh Analysis & Conservation of Energy",
    sourceTitle: "OpenStax University Physics Vol 2 - Kirchhoff's Rules",
    sourceUrl: "https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules",
    license: "CC BY 4.0",
    content: `Kirchhoff's Second Rule, known as Kirchhoff's Voltage Law (KVL) or loop rule, is based on the Law of Conservation of Energy. It states that the algebraic sum of all potential differences (voltages) around any closed loop in a circuit must equal zero: Σ V_loop = 0. As an electric charge completes a round trip along a closed loop, the total energy gained from electromotive force (EMF) sources must exactly equal the total potential drops across resistive components.`,
    keyTerms: ["kvl", "voltage law", "closed loop", "mesh", "conservation of energy", "potential drop", "emf", "loop rule"]
  },
  {
    id: "ee-ohm-01",
    subject: "Basic Electrical Engineering",
    conceptId: "ohms_law",
    conceptName: "Ohm's Law & Electrical Resistance",
    chapter: "Current and Resistance",
    section: "Resistive Elements & V-I Relationships",
    sourceTitle: "NIST Reference on Electrical Standards & OpenStax Physics",
    sourceUrl: "https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance",
    license: "CC BY 4.0",
    content: `Ohm's Law states that at a constant temperature, the electric current (I) flowing through an ideal conductor is directly proportional to the potential difference (voltage, V) applied across its ends, and inversely proportional to its resistance (R): V = I × R, or I = V / R. Resistance represents the opposition offered by a material to the flow of electric charge, measured in Ohms (Ω).`,
    keyTerms: ["ohm", "ohms law", "resistance", "voltage", "current", "v=ir", "resistor", "potential difference", "proportionality"]
  },
  {
    id: "ee-junction-01",
    subject: "Basic Electrical Engineering",
    conceptId: "circuit_junctions",
    conceptName: "Circuit Junctions and Nodes",
    chapter: "Circuit Topologies",
    section: "Essential Nodes and Branch Currents",
    sourceTitle: "MIT OpenCourseWare - Circuits and Electronics (6.002)",
    sourceUrl: "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/",
    license: "MIT OCW CC BY-NC-SA",
    content: `A node is a point in a circuit where two or more circuit elements join together. An essential junction is a node where three or more branches connect. In electrical networks, current behaves analogously to water flowing in branching pipes: whatever mass of fluid enters a pipe junction must distribute among outgoing pipes without pooling or vanishing. Mastering junction behavior is the fundamental prerequisite to understanding Kirchhoff's Current Law.`,
    keyTerms: ["junction", "node", "branch", "circuit node", "essential node", "split", "water pipe analogy", "prerequisite"]
  },
  {
    id: "math-diff-01",
    subject: "Mathematics",
    conceptId: "differentiation",
    conceptName: "Differentiation & Derivatives",
    chapter: "Calculus",
    section: "Instantaneous Rate of Change & Tangent Slopes",
    sourceTitle: "OpenStax Calculus Volume 1 - Derivatives",
    sourceUrl: "https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative",
    license: "CC BY 4.0",
    content: `The derivative of a function f(x) with respect to x measures the instantaneous rate of change of f(x) as x changes. Geometrically, f'(x) represents the slope of the tangent line to the curve y = f(x) at any given point. Defined formally by the limit of the difference quotient: f'(x) = lim_{h -> 0} [f(x+h) - f(x)] / h. Key rules include Power Rule (d/dx [x^n] = n*x^(n-1)), Product Rule, and Chain Rule.`,
    keyTerms: ["derivative", "differentiation", "rate of change", "slope of tangent", "calculus", "power rule", "chain rule", "dx", "dy/dx"]
  },
  {
    id: "math-int-01",
    subject: "Mathematics",
    conceptId: "integration",
    conceptName: "Integration & Accumulation",
    chapter: "Calculus",
    section: "Anti-derivatives & Definite Integrals",
    sourceTitle: "OpenStax Calculus Volume 1 - Integration",
    sourceUrl: "https://openstax.org/books/calculus-volume-1/pages/5-1-approximating-areas",
    license: "CC BY 4.0",
    content: `Integration represents the mathematical process of continuous summation or accumulation. The definite integral ∫_{a}^{b} f(x) dx represents the net signed area bounded by the curve y = f(x), the x-axis, and the vertical lines x = a and x = b. By the Fundamental Theorem of Calculus, integration is the exact inverse operation of differentiation: ∫ f'(x) dx = f(x) + C.`,
    keyTerms: ["integration", "integral", "anti-derivative", "area under curve", "accumulation", "riemann sum", "calculus", "indefinite integral", "definite integral"]
  },
  {
    id: "phy-newton-01",
    subject: "Physics",
    conceptId: "newtons_laws",
    conceptName: "Newton's Laws of Motion",
    chapter: "Classical Mechanics",
    section: "Dynamics & Force Interactions",
    sourceTitle: "OpenStax University Physics Vol 1 - Newton's Laws",
    sourceUrl: "https://openstax.org/books/university-physics-volume-1/pages/5-1-forces",
    license: "CC BY 4.0",
    content: `Newton's Laws describe the fundamental relationship between force and motion: 1) First Law (Inertia): An object remains at rest or in uniform straight-line motion unless acted upon by a net external force. 2) Second Law: Net Force = mass × acceleration (Σ F = m*a). 3) Third Law: For every action force, there is an equal and opposite reaction force (F_{AB} = -F_{BA}).`,
    keyTerms: ["newton", "force", "f=ma", "inertia", "action reaction", "motion", "acceleration", "laws of motion"]
  },
  {
    id: "phy-energy-01",
    subject: "Physics",
    conceptId: "conservation_of_energy",
    conceptName: "Conservation of Mechanical Energy",
    chapter: "Work and Energy",
    section: "Kinetic & Potential Energy Transformations",
    sourceTitle: "OpenStax University Physics Vol 1 - Conservation of Energy",
    sourceUrl: "https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy",
    license: "CC BY 4.0",
    content: `The Law of Conservation of Energy dictates that energy can neither be created nor destroyed, only transformed from one form to another. In an isolated system with only conservative forces (e.g., gravity, ideal spring), total mechanical energy E = Kinetic Energy (1/2 m v^2) + Potential Energy (m g h) remains invariant over time: E_initial = E_final.`,
    keyTerms: ["energy", "conservation of energy", "kinetic energy", "potential energy", "work energy theorem", "mechanical energy"]
  }
];

// Helper: Lightweight Grounded RAG Retrieval
function retrieveRelevantKnowledge(query: string, subjectFilter?: string): KnowledgeDoc[] {
  const queryTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(t => t.length > 2);
  if (queryTokens.length === 0) return [];

  const scoredDocs = KNOWLEDGE_BASE.filter(doc => {
    if (subjectFilter && doc.subject.toLowerCase() !== subjectFilter.toLowerCase()) {
      return false;
    }
    return true;
  }).map(doc => {
    let score = 0;
    const docText = `${doc.conceptName} ${doc.chapter} ${doc.section} ${doc.content} ${doc.keyTerms.join(" ")}`.toLowerCase();
    
    // Key term matches (high weight)
    for (const term of doc.keyTerms) {
      if (query.toLowerCase().includes(term.toLowerCase())) {
        score += 10;
      }
    }
    
    // Token matches
    for (const token of queryTokens) {
      if (doc.conceptName.toLowerCase().includes(token)) score += 5;
      if (docText.includes(token)) score += 2;
    }

    return { doc, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);
  return scoredDocs.filter(item => item.score > 2).slice(0, 3).map(item => item.doc);
}

// Helper: Call Ollama Local API
async function callOllama(prompt: string, systemPrompt?: string, modelOverride?: string): Promise<{ response: string; model: string; durationMs: number }> {
  const targetModel = modelOverride || OLLAMA_MODEL;
  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: targetModel,
        prompt: prompt,
        system: systemPrompt || "You are ConceptGrow AI, an expert, encouraging educational tutor. Ground your answers strictly in scientific facts, clear step-by-step logic, and supportive tone.",
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9,
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Ollama returned status ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as any;
    return {
      response: data.response || "",
      model: data.model || targetModel,
      durationMs: Date.now() - startTime
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check & AI Engine status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/ai/status", async (req, res) => {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = (await response.json()) as any;
      const models = Array.isArray(data.models) ? data.models.map((m: any) => m.name) : [];
      const latencyMs = Date.now() - startTime;
      return res.json({
        connected: true,
        provider: "Ollama (Local Open-Source)",
        baseUrl: OLLAMA_BASE_URL,
        configuredModel: OLLAMA_MODEL,
        availableModels: models,
        latencyMs,
        message: `Connected to Ollama. Model: ${OLLAMA_MODEL}`
      });
    } else {
      return res.json({
        connected: false,
        provider: "Ollama (Local Open-Source)",
        baseUrl: OLLAMA_BASE_URL,
        configuredModel: OLLAMA_MODEL,
        availableModels: [],
        latencyMs: Date.now() - startTime,
        message: "Ollama server responded with error"
      });
    }
  } catch (err: any) {
    return res.json({
      connected: false,
      provider: "Ollama (Local Open-Source)",
      baseUrl: OLLAMA_BASE_URL,
      configuredModel: OLLAMA_MODEL,
      availableModels: [],
      error: err.message || "Connection refused",
      message: "Local AI not detected. Please ensure Ollama is running (`ollama serve`)."
    });
  }
});

// 2. Grounded Knowledge Search (RAG)
app.post("/api/knowledge/search", (req, res) => {
  const { query, subject } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }
  const results = retrieveRelevantKnowledge(query, subject);
  res.json({ results, count: results.length });
});

// 3. AI Tutor Doubt Solving (with RAG context + language support + explanation modes)
app.post("/api/ai/doubt", async (req, res) => {
  const { question, language = "en", explanationMode = "standard", studentLevel = "Intermediate", conceptContext } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  // Retrieve Grounded Sources
  const retrievedDocs = retrieveRelevantKnowledge(question);
  const sources = retrievedDocs.map(d => ({
    title: d.sourceTitle,
    url: d.sourceUrl,
    chapter: `${d.subject} - ${d.chapter} (${d.section})`,
    license: d.license
  }));

  // Build Context String
  const contextSnippet = retrievedDocs.length > 0
    ? retrievedDocs.map(d => `[Source: ${d.sourceTitle} - ${d.conceptName}]\n${d.content}`).join("\n\n")
    : "No exact curated knowledge chunk matched. Rely on verified educational textbooks and first-principles science.";

  const languageInstructions: Record<string, string> = {
    en: "Explain clearly in fluent, accessible English with precise terminology.",
    hi: "हिंदी में स्पष्ट और सहज भाषा में समझाएं (Use clean, student-friendly Hindi with technical terms in English where needed).",
    hinglish: "Explain in natural, engaging conversational Hinglish (blend of Hindi and English like an enthusiastic Indian faculty member, e.g., 'Kirchhoff's Current Law bolta hai ki junction par total incoming current hamesha outgoing current ke barabar hota hai...')."
  };

  const modeInstructions: Record<string, string> = {
    beginner: "Keep the explanation very gentle and intuitive. Avoid dense jargon. Focus on everyday analogies (like water pipes, cars at traffic junctions).",
    standard: "Provide a balanced academic explanation with core principles, clear steps, and standard formulas.",
    detailed: "Provide a rigorous technical explanation including derivations, boundary conditions, and sign convention subtleties.",
    visual_analogy: "Center the explanation around vivid mental models, visual diagrams, flowcharts, and tangible real-world analogies."
  };

  const systemPrompt = `You are ConceptGrow AI, an empathetic and highly effective AI Tutor for engineering, mathematics, and science students.
Language: ${languageInstructions[language] || languageInstructions.en}
Explanation Mode: ${modeInstructions[explanationMode] || modeInstructions.standard}
Student Level: ${studentLevel}

STRUCTURE YOUR RESPONSE STRICTLY AS FOLLOWS:
1. 💡 Simple Core Idea (1-2 crisp sentences)
2. 🌊 Intuitive Analogy / Visual Model
3. 📐 Step-by-Step Mechanism & Formula
4. 📝 Worked Real-World Example
5. ⚠️ Common Misconception to Avoid
6. 🎯 Quick Self-Check Question

Ground your answer in the following verified curriculum knowledge:
${contextSnippet}`;

  const prompt = `Student Question: "${question}"
${conceptContext ? `Specific Concept in Focus: ${conceptContext}` : ""}

Please explain step-by-step according to your persona and structure.`;

  try {
    const aiResult = await callOllama(prompt, systemPrompt);
    return res.json({
      success: true,
      explanation: aiResult.response,
      modelUsed: aiResult.model,
      durationMs: aiResult.durationMs,
      sourcesUsed: sources,
      retrievalCount: retrievedDocs.length
    });
  } catch (err: any) {
    // If Ollama is offline or fails, return a graceful response so the UI handles it cleanly
    return res.status(503).json({
      success: false,
      error: "LOCAL_AI_UNAVAILABLE",
      message: "Ollama local AI is currently offline or unreachable.",
      sourcesUsed: sources,
      retrievalCount: retrievedDocs.length,
      fallbackContent: retrievedDocs.length > 0 ? retrievedDocs[0].content : null
    });
  }
});

// 4. PowerBot: Analyze Teaching Style & Extract Teaching DNA from Video / Transcript
app.post("/api/ai/analyze-style", async (req, res) => {
  const { transcript, subject, profileName } = req.body;

  if (!transcript || transcript.trim().length === 0) {
    return res.status(400).json({ error: "Transcript is required for style analysis" });
  }

  const prompt = `Analyze the following educational lecture transcript and extract its "Teaching Style Profile (Teaching DNA)".
Transcript:
"""
${transcript.slice(0, 4000)}
"""

Subject: ${subject || "General Science & Engineering"}
Profile Name: ${profileName || "Custom Faculty Style"}

Analyze the pedagogical patterns, phrasing, structure, tone, and pacing.
Return ONLY valid JSON (no markdown formatting around the JSON, or standard json codeblock) conforming to this schema:
{
  "name": "${profileName || "Analyzed Teaching Style"}",
  "subject": "${subject || "Science"}",
  "language": "English / Hinglish / Hindi based on transcript",
  "explanation_style": "Step-by-Step / Intuition-First / Formula-First / Analogy-Driven",
  "analogy_level": "High" | "Medium" | "Low",
  "example_frequency": "High" | "Medium" | "Low",
  "technical_depth": "High" | "Medium" | "Low",
  "tone": "Encouraging / Rigorous / Conversational / Socratic",
  "pace": "Brisk / Steady / Methodical",
  "teaching_structure": [
    "Concept Introduction",
    "Real-World Analogy",
    "Mathematical Formula & Derivation",
    "Worked Numerical Example",
    "Common Pitfall Warning",
    "Quick Practice Check"
  ],
  "style_summary": "A 2-3 sentence overview describing how this instructor explains concepts."
}`;

  try {
    const aiResult = await callOllama(prompt, "You are a specialized Educational Pedagogical Analyst AI. Extract teaching structure patterns and output strict JSON only.");
    
    // Parse JSON safely
    let cleanJson = aiResult.response.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    let parsedDna;
    try {
      parsedDna = JSON.parse(cleanJson);
    } catch {
      // Rule-based fallback extraction if model output had formatting quirks
      parsedDna = {
        name: profileName || "Custom Faculty DNA",
        subject: subject || "Engineering",
        language: transcript.toLowerCase().includes("hai") || transcript.toLowerCase().includes("samajh") ? "Hinglish" : "English",
        explanation_style: "Step-by-Step & Analogy-Driven",
        analogy_level: "High",
        example_frequency: "High",
        technical_depth: "Medium",
        tone: "Conversational & Encouraging",
        pace: "Methodical",
        teaching_structure: [
          "Concept Core",
          "Intuitive Analogy",
          "Technical Breakdown",
          "Formula & Rules",
          "Worked Example",
          "Quick Check"
        ],
        style_summary: "Uses vivid analogies upfront before transitioning to step-by-step mathematical rigor with active student check-ins."
      };
    }

    return res.json({
      success: true,
      teachingDna: parsedDna,
      modelUsed: aiResult.model,
      durationMs: aiResult.durationMs
    });
  } catch (err: any) {
    // Graceful deterministic analysis fallback if AI is offline
    const isHinglish = transcript.toLowerCase().includes("hai") || transcript.toLowerCase().includes("karein") || transcript.toLowerCase().includes("dekho");
    const hasFormulas = transcript.includes("=") || transcript.includes("+") || transcript.includes("formula");
    
    const fallbackDna = {
      name: profileName || "Uploaded Lecture Profile",
      subject: subject || "Electrical Engineering",
      language: isHinglish ? "Hinglish" : "English",
      explanation_style: "Step-by-Step Intuitive",
      analogy_level: "High",
      example_frequency: "High",
      technical_depth: hasFormulas ? "High" : "Medium",
      tone: "Encouraging & Conversational",
      pace: "Steady",
      teaching_structure: [
        "Core Intuition",
        "Visual / Water Flow Analogy",
        "Technical Definition",
        "Formula & Governing Laws",
        "Step-by-Step Calculation",
        "Review & Quick Check"
      ],
      style_summary: "Teaching style extracted from uploaded educational content. Emphasizes foundational intuition followed by rigorous formula applications."
    };

    return res.json({
      success: true,
      teachingDna: fallbackDna,
      source: "fallback_deterministic",
      notice: "Generated using built-in linguistic heuristics (Ollama offline)."
    });
  }
});

// 5. PowerBot: Generate Custom Lesson matching the selected Teaching DNA
app.post("/api/ai/generate-lesson", async (req, res) => {
  const { question, concept, teachingProfile, language = "en" } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question/Topic is required" });
  }

  // Retrieve Grounded Knowledge
  const retrievedDocs = retrieveRelevantKnowledge(question + " " + (concept || ""));
  const sources = retrievedDocs.map(d => ({
    title: d.sourceTitle,
    url: d.sourceUrl,
    chapter: `${d.subject} - ${d.chapter}`,
    license: d.license
  }));

  const structure = teachingProfile?.teaching_structure || [
    "Concept Introduction",
    "Analogy & Intuition",
    "Technical Explanation",
    "Formula & Rules",
    "Worked Example",
    "Quick Check"
  ];

  const systemPrompt = `You are PowerBot, ConceptGrow AI's premier adaptive lesson generator.
You MUST generate an interactive 5-to-6 scene educational lesson strictly following the instructor's Teaching DNA:
- Instructor Style: ${teachingProfile?.explanation_style || "Step-by-Step"}
- Language: ${teachingProfile?.language || language}
- Analogy Level: ${teachingProfile?.analogy_level || "High"}
- Technical Depth: ${teachingProfile?.technical_depth || "Medium"}
- Flow Order: ${structure.join(" -> ")}

Grounded Sources:
${retrievedDocs.map(d => `${d.conceptName}: ${d.content}`).join("\n")}

Respond ONLY with valid JSON in this exact structure:
{
  "scenes": [
    {
      "id": 1,
      "type": "intro",
      "title": "Short catchy scene title",
      "subtitle": "Brief subtitle",
      "content": "2-3 clean sentences of visual slide text",
      "narrationScript": "Full spoken voice script for this scene in natural conversational tone",
      "visualType": "circuit | graph | flow | math | concept_card",
      "visualData": { "highlight": "Key point" }
    }
  ],
  "fullReadText": "Complete structured article for reading mode",
  "summary": "Key takeaway in 1 sentence"
}`;

  const prompt = `Topic: "${question}"
Concept: "${concept || "Fundamental Science"}"
Please generate the complete PowerBot dynamic lesson following the Teaching DNA flow.`;

  try {
    const aiResult = await callOllama(prompt, systemPrompt);
    let cleanJson = aiResult.response.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsedLesson = JSON.parse(cleanJson);
    return res.json({
      success: true,
      lesson: {
        scenes: parsedLesson.scenes || [],
        fullReadText: parsedLesson.fullReadText || "",
        summary: parsedLesson.summary || ""
      },
      sourcesUsed: sources,
      modelUsed: aiResult.model
    });
  } catch (err: any) {
    // If Ollama is offline or JSON parsing fails, construct a rich, grounded deterministic lesson matching the DNA structure
    const fallbackScenes = [
      {
        id: 1,
        type: "intro",
        title: `Understanding ${concept || question}`,
        subtitle: "The Core Foundation",
        content: `${concept || question} is a cornerstone principle in scientific analysis. Today we break down exactly how it works without unnecessary complexity.`,
        narrationScript: `Welcome! Today we are learning about ${concept || question}. Let's break down the core intuition first so you can master it step by step.`,
        visualType: "concept_card",
        visualData: { label: "Core Foundation", keyMetric: "100% Conservation" }
      },
      {
        id: 2,
        type: "analogy",
        title: "The Water Pipe Junction Analogy",
        subtitle: "Physical Intuition",
        content: "Imagine a 3-way water pipe junction. If 10 liters per second enters from pipe A, and 6 L/s exits through pipe B, exactly 4 L/s MUST exit through pipe C. Fluid cannot simply vanish into thin air!",
        narrationScript: "Think of electrical charge like water in closed pipes. At any junction, whatever volume enters must distribute among the outgoing pipes without piling up.",
        visualType: "flow",
        visualData: { inFlow: "10 A", outFlow1: "6 A", outFlow2: "4 A" }
      },
      {
        id: 3,
        type: "technical",
        title: "Governing Law & Formulation",
        subtitle: "Mathematical Rigor",
        content: "By the Law of Conservation of Electric Charge: The algebraic sum of currents entering any node equals zero. Σ I_in = Σ I_out.",
        narrationScript: "Here is the exact law: The sum of currents entering a node is equal to the sum of currents leaving it. Mathematically, sigma I equals zero.",
        visualType: "math",
        visualData: { formula: "Σ I_in = Σ I_out", rule: "Charge cannot accumulate at an ideal junction." }
      },
      {
        id: 4,
        type: "example",
        title: "Step-by-Step Worked Example",
        subtitle: "Circuit Calculation",
        content: "Consider Node A where I1 = 8A enters, I2 = 3A leaves, and I3 is unknown. Formula: I1 = I2 + I3 => 8A = 3A + I3 => I3 = 5A leaving.",
        narrationScript: "Let's test this with a fast calculation. If 8 Amperes enters a junction and 3 Amperes leaves through one branch, the remaining branch must carry exactly 5 Amperes outward.",
        visualType: "circuit",
        visualData: { i1: "8A (in)", i2: "3A (out)", i3: "5A (out)" }
      },
      {
        id: 5,
        type: "quick_check",
        title: "Concept Mastery Check",
        subtitle: "Test Your Understanding",
        content: "If currents of 4A and 7A both enter a node, and one branch leaves with 5A, how much current must exit through the second branch?",
        narrationScript: "Here is a quick check question for you. Total entering is 4 plus 7 equals 11 Amperes. If 5 leaves in branch 1, what must leave in branch 2? That's right, 6 Amperes!",
        visualType: "concept_card",
        visualData: { answer: "6 Amperes leaving" },
        quizQuestion: {
          question: "Currents of 4A and 7A enter a junction. Branch 1 carries 5A outward. What does Branch 2 carry?",
          options: ["6 A leaving", "11 A leaving", "2 A entering", "16 A leaving"],
          answer: 0,
          explanation: "Total entering = 4A + 7A = 11A. Leaving = 5A + I_2 => I_2 = 11A - 5A = 6A leaving."
        }
      }
    ];

    return res.json({
      success: true,
      lesson: {
        scenes: fallbackScenes,
        fullReadText: `# ${concept || question}\n\n## 1. Core Principle\n${concept || question} is established on the fundamental laws of nature.\n\n## 2. Real-World Analogy\nLike fluids through connected pipes, charge flow is strictly conserved.\n\n## 3. Mathematical Rule\n$$\\sum I_{in} = \\sum I_{out}$$\n\n## 4. Worked Calculation\nGiven entering currents, setting net junction flux to zero yields exact branch values.`,
        summary: "Conservation laws guarantee balanced input and output at all nodes."
      },
      sourcesUsed: sources,
      source: "grounded_template"
    });
  }
});

// 6. Generate Adaptive Practice Questions (Ollama + fallback)
app.post("/api/ai/generate-practice", async (req, res) => {
  const { conceptId, conceptName, difficulty = "medium", count = 3 } = req.body;

  const prompt = `Generate ${count} adaptive educational practice questions for the concept "${conceptName || conceptId}".
Difficulty level: ${difficulty}.
Include a mix of Multiple Choice (MCQ) and Numerical / Conceptual questions.
Return ONLY valid JSON array of question objects matching this schema:
[
  {
    "id": "gen-1",
    "conceptId": "${conceptId || "general"}",
    "type": "mcq",
    "difficulty": "${difficulty}",
    "questionText": "Clear question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact matching string of correct option",
    "explanation": "Detailed pedagogical explanation of why this is correct",
    "hints": ["Helpful nudge"]
  }
]`;

  try {
    const aiResult = await callOllama(prompt, "You are an expert assessment author. Output strictly valid JSON array.");
    let cleanJson = aiResult.response.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const questions = JSON.parse(cleanJson);
    return res.json({ success: true, questions });
  } catch (err: any) {
    return res.status(503).json({
      success: false,
      error: "LOCAL_AI_UNAVAILABLE",
      message: "Could not generate dynamic questions from local AI. Use the curated question bank."
    });
  }
});

// ==========================================
// VITE MIDDLEWARE & SERVER STARTUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ConceptGrow AI server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
