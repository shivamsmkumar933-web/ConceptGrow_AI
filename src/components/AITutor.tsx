import React, { useState } from 'react';
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  Languages,
  HelpCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Layers,
  AlertCircle
} from 'lucide-react';
import { LanguageCode, ExplanationMode, GroundedSource, AIStatusInfo } from '../types';
import { AIService } from '../services/aiService';
import { StorageService } from '../services/storageService';
import { SpeechService } from '../services/speechService';
import { CONCEPTS } from '../data/curatedConcepts';

interface AITutorProps {
  onStartPractice: (conceptId: string) => void;
  aiStatus: AIStatusInfo;
  onOpenAIModal: () => void;
  initialLanguage?: LanguageCode;
}

export const AITutor: React.FC<AITutorProps> = ({
  onStartPractice,
  aiStatus,
  onOpenAIModal,
  initialLanguage = 'en'
}) => {
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('standard');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundedSource[]>([]);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [detectedConceptId, setDetectedConceptId] = useState<string | null>(null);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);

  const samplePrompts = [
    { label: "Kirchhoff's Current Law (KCL)", text: "How does electric current split at a junction in KCL?", conceptId: "kcl" },
    { label: "Hinglish Doubt", text: "Sir current junction par split kaise hota hai and sign convention me galti kyun hoti hai?", conceptId: "kcl" },
    { label: "Calculus Derivatives", text: "What does the derivative geometrically represent on a curve?", conceptId: "differentiation" },
    { label: "Newton's 3rd Law", text: "Why do action and reaction forces not cancel each other out?", conceptId: "newtons_laws" },
    { label: "Ohm's Law & Resistance", text: "Explain V = IR using a water pipe analogy.", conceptId: "ohms_law" }
  ];

  const handleAsk = async (queryText?: string, targetConceptId?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setLoading(true);
    setResponse(null);
    setSources([]);
    setOfflineNotice(null);

    // Concept detection from query
    let detectedId = targetConceptId || null;
    if (!detectedId) {
      const lower = q.toLowerCase();
      const matched = CONCEPTS.find(c =>
        lower.includes(c.id) ||
        lower.includes(c.name.toLowerCase()) ||
        c.tags.some(t => lower.includes(t))
      );
      if (matched) detectedId = matched.id;
    }
    setDetectedConceptId(detectedId);

    const res = await AIService.askDoubt({
      question: q,
      language,
      explanationMode,
      studentLevel: 'Undergraduate Engineering',
      conceptContext: detectedId ? CONCEPTS.find(c => c.id === detectedId)?.name : undefined
    });

    setLoading(false);

    if (res.success && res.explanation) {
      setResponse(res.explanation);
      setSources(res.sourcesUsed || []);
      setModelUsed(res.modelUsed || aiStatus.configuredModel);

      // Save to doubt history
      StorageService.saveDoubt({
        id: 'doubt-' + Date.now(),
        userId: StorageService.getUser()?.id || 'guest',
        question: q,
        detectedSubject: 'Science & Engineering',
        detectedConceptId: detectedId || undefined,
        explanationMode,
        language,
        responseText: res.explanation,
        sourcesUsed: res.sourcesUsed || [],
        timestamp: new Date().toISOString()
      });
    } else {
      // Offline fallback: Use grounded curriculum knowledge
      const matchedConcept = detectedId ? CONCEPTS.find(c => c.id === detectedId) : CONCEPTS[4]; // Default to KCL
      setSources(res.sourcesUsed && res.sourcesUsed.length > 0 ? res.sourcesUsed : [
        {
          title: 'OpenStax University Physics Vol 2 (Direct-Current Circuits)',
          url: 'https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules',
          chapter: 'Chapter 10: Kirchhoff’s Rules',
          license: 'CC BY 4.0'
        }
      ]);

      const structuredGroundedFallback = `💡 Simple Core Idea:
${matchedConcept ? matchedConcept.summary : "Conservation laws govern circuit interactions."}

🌊 Intuitive Model & Analogy:
Think of an electrical junction like a 3-way water pipe. Fluid cannot vanish or build up in thin air: every drop entering from pipe A must exit through pipes B and C.

📐 Governing Law & Formula:
$$\\sum I_{\\text{in}} = \\sum I_{\\text{out}} \\quad \\text{or} \\quad \\sum_{k=1}^n I_k = 0$$
Sign Convention: Currents entering the junction are defined as positive (+), while currents leaving are negative (-).

📝 Worked Example:
If $I_1 = 10\\text{ A}$ enters a node and $I_2 = 4\\text{ A}$ exits through branch 2, the remaining branch $I_3$ must equal $10\\text{ A} - 4\\text{ A} = 6\\text{ A}$ leaving.

⚠️ Common Misconception to Avoid:
Do not add all numerical current values together blindly! You must separate incoming vs outgoing directions across the junction boundary.

🎯 Quick Self-Check:
Currents of 5A and 7A enter a junction, and 4A leaves. What is the current in the other outgoing branch? (Answer: 8A leaving).`;

      setResponse(structuredGroundedFallback);
      setOfflineNotice("Grounded curriculum response provided (Local Ollama AI is in standby mode).");
    }
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    } else if (response) {
      setIsSpeaking(true);
      SpeechService.speak(response, 1.0, language === 'hi' || language === 'hinglish' ? 'hi' : 'en-US');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Brain className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Tutor & Doubt Solver
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ask any conceptual doubt in your preferred language. Grounded in verified university textbooks.
          </p>
        </div>

        {/* AI Status Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              aiStatus.connected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${aiStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{aiStatus.connected ? `Ollama (${aiStatus.configuredModel})` : 'AI Standby Mode'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Language & Explanation Modes */}
      <div className="grid sm:grid-cols-2 gap-4">
        
        {/* Language Selector */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-blue-600" /> Explanation Language
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'en', label: 'English' },
              { id: 'hinglish', label: 'Hinglish (Natural)' },
              { id: 'hi', label: 'हिन्दी (Hindi)' }
            ].map(l => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id as LanguageCode)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  language === l.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/70 dark:border-blue-800 dark:text-blue-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation Mode Selector */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" /> Pedagogical Style
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'beginner', label: 'Beginner' },
              { id: 'standard', label: 'Standard' },
              { id: 'detailed', label: 'Detailed' },
              { id: 'visual_analogy', label: 'Analogy' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setExplanationMode(m.id as ExplanationMode)}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold transition-all border ${
                  explanationMode === m.id
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/70 dark:border-indigo-800 dark:text-indigo-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          What concept or problem are you confused about?
        </label>
        
        <div className="relative">
          <textarea
            rows={3}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Type your question in English, Hindi, or Hinglish (e.g., 'Sir current junction par split kaise hota hai?')"
            className="w-full p-3.5 pr-24 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />

          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Explain</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Prompts */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
            Quick Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(p.text);
                  handleAsk(p.text, p.conceptId);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden animate-in fade-in duration-200">
          
          {/* Response Top Bar */}
          <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Personalized Step-by-Step Breakdown
              </span>
              {modelUsed && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                  {modelUsed}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Narration Button */}
              <button
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSpeaking
                    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
                <span>{isSpeaking ? 'Stop Narration' : 'Listen with AI Voice'}</span>
              </button>

              {detectedConceptId && (
                <button
                  onClick={() => onStartPractice(detectedConceptId)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Practice This Concept</span>
                </button>
              )}
            </div>
          </div>

          {offlineNotice && (
            <div className="px-6 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{offlineNotice}</span>
            </div>
          )}

          {/* Formatted Content */}
          <div className="p-6 sm:p-8 space-y-4 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            <div className="whitespace-pre-line font-sans space-y-3">
              {response}
            </div>
          </div>

          {/* Grounded Sources & Citations Box */}
          {sources.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Grounded Citations (RAG Knowledge)</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-start justify-between gap-2 group"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                        {src.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {src.chapter}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
