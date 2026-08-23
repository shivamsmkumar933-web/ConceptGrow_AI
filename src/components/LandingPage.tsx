import React from 'react';
import {
  Brain,
  Zap,
  Map,
  Video,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Languages,
  BookOpen,
  Cpu,
  Layers,
  Compass,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onStartStudent: () => void;
  onStartTeacher: () => void;
  onOpenDemo: () => void;
  onOpenAIModal: () => void;
  aiConnected: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartStudent,
  onStartTeacher,
  onOpenDemo,
  onOpenAIModal,
  aiConnected
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors selection:bg-blue-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Subtle background glow grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 opacity-70" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-semibold mb-6 shadow-xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>AI-Powered Adaptive Learning & Teaching DNA</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
            Understand Better. Learn Smarter.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Grow Without Limits.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Most AI tutors only adapt what they say. ConceptGrow AI detects your hidden prerequisite gaps and uses <strong>PowerBot</strong> to teach concepts in your instructor's exact pedagogical structure.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={onStartStudent}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <span>Start Learning as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStartTeacher}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Faculty Dashboard</span>
            </button>
          </div>

          {/* AI Connection & Privacy Badge */}
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Free & Open-Source AI (Ollama)</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 cursor-pointer hover:underline" onClick={onOpenAIModal}>
              <span className={`w-2 h-2 rounded-full ${aiConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{aiConnected ? 'Ollama AI Active' : 'Offline / Standby Mode'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Flagship Innovation Banner: PowerBot */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
          
          <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Video className="w-3.5 h-3.5" /> Flagship Innovation: PowerBot
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Learn in the teaching style that works for you.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Upload any educational lecture video or transcript. PowerBot extracts the instructor’s unique <strong>Teaching DNA</strong> (intuition flow, analogy density, step-by-step depth, formula rules) and dynamically regenerates any topic into interactive video-style lessons matching that exact pattern.
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium">
                  ✓ Concept → Analogy → Formula → Example Flow
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium">
                  ✓ Multilingual (Hinglish, Hindi, English)
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium">
                  ✓ Browser-Native Voice Narration
                </span>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700 pb-2">
                  <span className="font-semibold text-blue-300">Teaching DNA Analyzed</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Explanation Style:</span>
                    <span className="font-semibold text-white">Analogy-First & Step-by-Step</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Analogy Density:</span>
                    <span className="font-semibold text-indigo-300">High (Water Pipe Models)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Target Language:</span>
                    <span className="font-semibold text-amber-300">Hinglish / English</span>
                  </div>
                </div>

                <button
                  onClick={onStartStudent}
                  className="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Try Interactive Video Lesson</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Built from First Principles for Deep Mastery
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            No fake shortcuts. Grounded RAG textbooks, prerequisite gap detection, and deterministic analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Grounded AI Doubt Solver
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ask in English, Hindi, or natural conversational Hinglish. Retrieves verified passages from OpenStax and MIT OCW with genuine source citations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Adaptive Practice & Gaps
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dynamically escalates question difficulty. If you struggle on Kirchhoff’s Law, it immediately diagnoses your Circuit Junction prerequisite status.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interactive Learning Map
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A real-time dependency DAG that visualizes your mastery status from Not Started to Mastered based strictly on your verified practice attempts.
            </p>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-900 dark:text-white">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>ConceptGrow AI</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Free local AI edtech platform powered by Ollama and browser-native speech synthesis.
          </p>
          <div className="pt-2 flex justify-center gap-4 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <button onClick={onStartStudent} className="hover:underline">Student Dashboard</button>
            <span>•</span>
            <button onClick={onStartTeacher} className="hover:underline">Teacher Portal</button>
            <span>•</span>
            <button onClick={onOpenDemo} className="hover:underline">Instant Demo Sandbox</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
